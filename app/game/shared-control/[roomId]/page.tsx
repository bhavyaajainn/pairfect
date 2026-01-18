"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ArrowLeft, Activity, Timer } from 'lucide-react';
import Button from '@/app/components/Button';
import { useAuth } from '@/hooks/useAuth';
import styles from './game.module.css';
import SharedControlCanvas from '@/app/components/game/SharedControlCanvas';

// Types
type Role = 'HORIZONTAL' | 'VERTICAL';
const ALLOWED_EMAILS = ['jainbhavya841@gmail.com', 'debugged999@gmail.com'];
const GAME_DURATION = 60; // seconds

export default function SharedControlGame() {
  const { roomId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // State
  const [role, setRole] = useState<Role | null>(null);
  const [status, setStatus] = useState<'CONNECTING' | 'WAITING' | 'PLAYING' | 'WON' | 'LOST' | 'DISCONNECTED'>('CONNECTING');
  const [players, setPlayers] = useState<any[]>([]);
  const [playerId] = useState(() => Math.random().toString(36).substring(2, 10));
  const [remoteInput, setRemoteInput] = useState<any>({});
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const channelRef = useRef<RealtimeChannel | null>(null);

  // -- ACCESS CONTROL --
  useEffect(() => {
      if (!authLoading && user) {
          if (!user.email || !ALLOWED_EMAILS.includes(user.email)) {
              alert("Access Denied: This game is for specific testers only.");
              router.push('/dashboard');
          }
      } else if (!authLoading && !user) {
          router.push('/');
      }
  }, [user, authLoading, router]);

  // -- JOIN & GAME LOGIC --
  useEffect(() => {
    if (!supabase || !roomId) return;

    const channel = supabase.channel(`shared_game_${roomId}`, {
      config: { presence: { key: playerId } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const connectedPlayers = Object.values(newState).flat() as any[];
        console.log('Presence sync:', connectedPlayers);
        setPlayers(connectedPlayers);
        
        // Auto-assign roles based on arrival order
        const sortedIds = connectedPlayers.map(p => p.playerId).sort();
        const myIndex = sortedIds.indexOf(playerId);
        
        if (connectedPlayers.length >= 2) {
             console.log('Starting game. My Index:', myIndex);
            if (myIndex === 0) setRole('HORIZONTAL');
            if (myIndex === 1) setRole('VERTICAL');
            
            // Only start if not already ended
            setStatus(prev => (prev === 'WON' || prev === 'LOST') ? prev : 'PLAYING');
        } else {
            console.log('Not enough players:', connectedPlayers.length);
            setStatus('WAITING');
        }
      })
      .on('broadcast', { event: 'input' }, ({ payload }) => {
        if (payload.playerId !== playerId) {
            setRemoteInput(payload.input);
        }
      })
      .on('broadcast', { event: 'game_state' }, ({ payload }) => {
          if (payload.type === 'GAME_OVER') {
              setStatus(payload.result); // WON or LOST
          }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          channel.track({ playerId, joinedAt: new Date().toISOString() });
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Unsubscribing');
      channel.unsubscribe();
    };
  }, [roomId, playerId]);

  // -- TIMER LOGIC --
  useEffect(() => {
      if (status === 'PLAYING') {
          const timer = setInterval(() => {
              setTimeLeft((prev) => {
                  if (prev <= 1) {
                      clearInterval(timer);
                      setStatus('LOST');
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [status]);

  const handleInput = (input: any) => {
      if(channelRef.current) {
          channelRef.current.send({
              type: 'broadcast',
              event: 'input',
              payload: { playerId, input }
          });
      }
  };

  const handleWin = () => {
      setStatus('WON');
      // Broadcast win to other player
      if (channelRef.current) {
          channelRef.current.send({
              type: 'broadcast',
              event: 'game_state',
              payload: { type: 'GAME_OVER', result: 'WON' }
          });
      }
  };

  // -- RENDER --
  if (authLoading || status === 'CONNECTING') {
    return <div className={styles.loading}>Connecting...</div>;
  }

  if (status === 'WAITING') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.waitingIcon}>
            <Activity className={styles.pulse} size={48} />
          </div>
          <h2>Waiting for Copilot</h2>
          <p>Share Room Code: <strong>{roomId}</strong></p>
          <div className={styles.helperText}>
             Players connected: {players.length} / 2
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.backBtn} onClick={() => router.push('/dashboard')}>
            <ArrowLeft size={20} /> Exit
        </div>
        
        <div className={styles.timerDisplay} style={{ color: timeLeft < 10 ? '#ef4444' : '#fff' }}>
            <Timer size={20} /> {timeLeft}s
        </div>

        <div className={styles.roleDisplay}>
            You control: 
            <strong>
                {role === 'HORIZONTAL' ? ' ↔ HORIZONTAL (Left/Right)' : ' ↕ VERTICAL (Up/Down)'}
            </strong>
        </div>
        <div className={styles.legend}>
            <span>🟧 Jump: {role === 'HORIZONTAL' ? '▲' : '◀'}</span>
            <span>🟦 Crouch: {role === 'HORIZONTAL' ? '▼' : '▶'}</span>
        </div>
      </header>

      <main className={styles.gameArea}>
        {role && (status === 'PLAYING' || status === 'WON' || status === 'LOST') && (
            <div className={styles.canvasWrapper}>
                <SharedControlCanvas 
                    role={role}
                    onInput={handleInput}
                    remoteInput={remoteInput}
                    onWin={handleWin}
                    isGameOver={status !== 'PLAYING'}
                    channelRef={channelRef}
                />
                {status === 'WON' && (
                    <div className={styles.overlay}>
                        <h1>VICTORY!</h1>
                        <p>Time Remaining: {timeLeft}s</p>
                        <Button onClick={() => window.location.reload()}>Play Again</Button>
                    </div>
                )}
                {status === 'LOST' && (
                    <div className={styles.overlay}>
                        <h1 style={{color: '#ef4444'}}>TIME UP!</h1>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
}
