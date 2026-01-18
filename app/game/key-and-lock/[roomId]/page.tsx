"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Lock, Key, RotateCcw, Copy, Users } from 'lucide-react';
import Button from '@/app/components/Button';
import GameCanvas from '@/app/components/game/GameCanvas';
import styles from '../game.module.css';

// Types for Supabase payload
type PlayerState = {
  playerId: string;
  role: 'KEY_FINDER' | 'NAVIGATOR';
  pos: { x: number; y: number };
};

export default function KeyAndLockGame() {
  const { roomId } = useParams();
  const router = useRouter();
  
  // -- STATE --
  const [role, setRole] = useState<'KEY_FINDER' | 'NAVIGATOR' | null>(null);
  const [status, setStatus] = useState<'CONNECTING' | 'WAITING' | 'PLAYING' | 'DISCONNECTED'>('CONNECTING');
  const [players, setPlayers] = useState<any[]>([]);
  const [playerId] = useState(() => Math.random().toString(36).substring(2, 10)); 
  const [otherPlayerPos, setOtherPlayerPos] = useState<{ x: number, y: number } | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [lastSignal, setLastSignal] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const roleRef = useRef<'KEY_FINDER' | 'NAVIGATOR' | null>(null);

  // -- EFFECTS --

  // 1. Game Channel & Presence
  useEffect(() => {
    if (!supabase || !roomId) return;

    console.log(`Joining game room: ${roomId} as ${playerId}`);

    const channel = supabase.channel(`game_${roomId}`, {
      config: { presence: { key: playerId } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const connectedPlayers = Object.values(newState).flat() as any[];
        setPlayers(connectedPlayers);
        
        // Auto-assign roles
        if (connectedPlayers.length >= 2 && !roleRef.current) {
            const sortedIds = connectedPlayers.map(p => p.playerId).sort();
            const myRole = sortedIds[0] === playerId ? 'KEY_FINDER' : 'NAVIGATOR';
            
            console.log(`Assigned role: ${myRole}`);
            setRole(myRole);
            roleRef.current = myRole;
            setStatus('PLAYING');
        } else if (connectedPlayers.length === 1) {
            if (!roleRef.current) setStatus('WAITING');
        }
      })
      .on('broadcast', { event: 'player_move' }, ({ payload }) => {
        if (payload.playerId !== playerId) {
            setOtherPlayerPos(payload.pos);
        }
      })
      .on('broadcast', { event: 'game_event' }, ({ payload }) => {
        console.log('Received game event:', payload);
        if (payload.type === 'SIGNAL') {
            setLastSignal(`${payload.message}`);
        } else if (payload.type === 'HAZARD_HIT') {
             setLastSignal(`PARTNER HIT TRAP! ${payload.message}`);
             if (payload.hazardType === 'TIME_PENALTY') {
                 setTimeLeft(prev => Math.max(0, prev - 30));
             }
        } else if (payload.type === 'GAME_OVER') {
             setGameState('LOST');
        } else if (payload.type === 'GAME_WON') {
             setGameState('WON');
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.track({ playerId, joinedAt: new Date().toISOString() });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, playerId]);

  // 2. Timer Logic
  useEffect(() => {
    if (status === 'PLAYING' && gameState === 'PLAYING' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('LOST');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, gameState, timeLeft]);

  // 3. Clear Signal
  useEffect(() => {
    if (lastSignal) {
      const timer = setTimeout(() => setLastSignal(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastSignal]);

  // -- HANDLERS --

  const handleMove = (pos: { x: number; y: number }) => {
    if (channelRef.current) {
        channelRef.current.send({
            type: 'broadcast',
            event: 'player_move',
            payload: { playerId, pos, role }
        });
    }
  };

  const handleHazard = (type: 'TIME_PENALTY' | 'INSTANT_DEATH') => {
    if (gameState !== 'PLAYING') return;

    if (type === 'TIME_PENALTY') {
         setTimeLeft(prev => Math.max(0, prev - 30));
         if (channelRef.current) {
             channelRef.current.send({
                 type: 'broadcast',
                 event: 'game_event',
                 payload: { type: 'HAZARD_HIT', hazardType: 'TIME_PENALTY', message: '-30s' }
             });
         }
    } else if (type === 'INSTANT_DEATH') {
         setGameState('LOST');
         if (channelRef.current) {
             channelRef.current.send({
                 type: 'broadcast',
                 event: 'game_event',
                 payload: { type: 'GAME_OVER', reason: 'Hit a death trap!' }
             });
         }
    }
  };

  const handleGoal = () => {
    if (gameState !== 'PLAYING') return;
     setGameState('WON');
     if (channelRef.current) {
         channelRef.current.send({
             type: 'broadcast',
             event: 'game_event',
             payload: { type: 'GAME_WON', timeRemaining: timeLeft }
         });
     }
  };

  const handleSignal = (type: string) => {
    if (channelRef.current) {
        channelRef.current.send({
            type: 'broadcast',
            event: 'game_event',
            payload: { type: 'SIGNAL', message: type, playerId }
        });
    }
  };

  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // -- RENDER --

  if (status === 'CONNECTING') {
    return <div className={styles.loading}>Connecting to secure frequency...</div>;
  }

  if (status === 'WAITING') {
    return (
      <div className={styles.container}>
        <div className={styles.waitingCard}>
          <div className={styles.waitingIcon}>
            <div className={styles.pulse}></div>
            <Users size={48} />
          </div>
          <h2>Waiting for Partner</h2>
          <p>Share this room code with your teammate:</p>
          <div className={styles.roomCode} onClick={copyRoomLink}>
            {roomId} <Copy size={16} />
          </div>
          <p className={styles.hint}>The game will start automatically when they join.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={`${styles.stats} ${timeLeft < 60 ? styles.urgent : ''}`}>
            ⏳ {formatTime(timeLeft)}
          </div>
          <div className={styles.roleBadge}>
            {role === 'KEY_FINDER' ? <Key size={16} /> : <Lock size={16} />}
            <span>{role === 'KEY_FINDER' ? 'Key Finder' : 'Navigator'}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
            Exit Mission
          </Button>
        </div>
      </header>

      <main className={styles.gameArea}>
        {gameState === 'WON' && (
            <div className={styles.overlay}>
                <h1>🎉 MISSION COMPLETE!</h1>
                <p>Time Remaining: {formatTime(timeLeft)}</p>
                <Button onClick={() => window.location.reload()}>Play Again</Button>
            </div>
        )}
        
        {gameState === 'LOST' && (
            <div className={styles.overlay}>
                <h1 style={{color: '#ef4444'}}>💀 MISSION FAILED</h1>
                <p>You ran out of time or hit a trap.</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        )}
      
        {role && (
            <GameCanvas 
                role={role} 
                onMove={handleMove}
                onHazard={handleHazard}
                onGoal={handleGoal}
                otherPlayerPos={otherPlayerPos}
            />
        )}
        
        <div className={styles.controls}>
           <div className={styles.signalButtons}>
             <Button 
                variant="secondary" 
                className={styles.signalBtn}
                onClick={() => handleSignal('STOP')}
             >
                STOP 🛑
             </Button>
             <Button 
                variant="secondary" 
                className={styles.signalBtn}
                onClick={() => handleSignal('GO')}
             >
                GO 🟢
             </Button>
             <Button 
                variant="secondary" 
                className={styles.signalBtn}
                onClick={() => handleSignal('CARRY')}
             >
                CARRY 🎒
             </Button>
           </div>
           
           <div className={styles.voiceSection}>
             <div className={styles.voiceIndicator}>
                <div className={styles.micIcon}>🎤</div>
                <span>Voice Channel Open</span>
             </div>
             <p className={styles.instruction}>Keep this tab open. Use Discord/Phone for audio.</p>
           </div>

           {lastSignal && (
             <div className={styles.signalOverlay}>
               <span className={styles.signalText}>{lastSignal}</span>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
