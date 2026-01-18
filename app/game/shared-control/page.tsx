"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Play, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/app/components/Button';

// Allowed Emails
const ALLOWED_EMAILS = ['jainbhavya841@gmail.com', 'debugged999@gmail.com'];

import styles from './lobby.module.css';

export default function SharedControlLobby() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (loading) return <div className={styles.loading}>Verifying Access...</div>;

  const isAllowed = user?.email && ALLOWED_EMAILS.includes(user.email);

  if (!user || !isAllowed) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
           <div className={styles.header}>
             <h1>Access Denied</h1>
             <p>This game is currently in closed beta.</p>
             <p className={styles.helperText}>Allowed for specific testers only.</p>
             <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
           </div>
        </div>
      </div>
    );
  }

  const createRoom = () => {
    setIsCreating(true);
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTimeout(() => {
      router.push(`/game/shared-control/${roomId}`);
    }, 500);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length >= 4) {
      router.push(`/game/shared-control/${joinCode.toUpperCase()}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Users size={32} color="#fbbf24" />
          </div>
          <h1>One Screen, Two Controls</h1>
          <p>A game of trust, timing, and chaos.</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.createSection}>
            <Button 
              onClick={createRoom} 
              disabled={isCreating}
              className={styles.createBtn}
            >
              {isCreating ? 'Creating...' : 'Start New Mission'}
              <Play size={18} />
            </Button>
          </div>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <form onSubmit={joinRoom} className={styles.joinSection}>
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className={styles.input}
              maxLength={6}
            />
            <Button type="submit" variant="outline" disabled={joinCode.length < 4}>
              Join <ArrowRight size={18} />
            </Button>
          </form>
        </div>
        
        <div className={styles.instructions}>
           <h3>How to Play</h3>
           <ul>
             <li>Need 2 Players on separate devices.</li>
             <li><strong>Player A:</strong> Moves Left/Right. (Jump with Up, Crouch with Down)</li>
             <li><strong>Player B:</strong> Moves Up/Down. (Jump with Left, Crouch with Right)</li>
             <li><strong>Rule:</strong> Any 'Top' or 'Left' key = JUMP. Any 'Bottom' or 'Right' key = CROUCH.</li>
             <li>Coordinate to reach the target!</li>
           </ul>
        </div>
      </div>
    </div>
  );
}
