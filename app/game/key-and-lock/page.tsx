"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Key, Users, ArrowRight } from 'lucide-react';
import Button from '@/app/components/Button';
import styles from './lobby.module.css';

export default function KeyAndLockLobby() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [joining, setJoining] = useState(false);

  // Generate a random 6-character room code
  const createGame = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/game/key-and-lock/${newRoomId}`);
  };

  const joinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;
    setJoining(true);
    router.push(`/game/key-and-lock/${roomId.toUpperCase()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icons}>
            <Key size={32} className={styles.iconKey} />
            <Lock size={32} className={styles.iconLock} />
          </div>
          <h1 className={styles.title}>Key & Lock</h1>
          <p className={styles.subtitle}>
            A cooperative game of trust and communication.
            <br />
            Two players. Asymmetric information. One goal.
          </p>
        </div>

        <div className={styles.actions}>
          <div className={styles.section}>
            <h3>Start a New Game</h3>
            <p>Create a room and invite a partner.</p>
            <Button onClick={createGame} fullWidth size="lg">
              Create Room
            </Button>
          </div>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.section}>
            <h3>Join Existing Game</h3>
            <form onSubmit={joinGame} className={styles.joinForm}>
              <input
                type="text"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className={styles.input}
                maxLength={6}
              />
              <Button 
                type="submit" 
                variant="outline" 
                fullWidth 
                disabled={!roomId.trim() || joining}
              >
                {joining ? 'Joining...' : 'Join Room'}
              </Button>
            </form>
          </div>
        </div>

        <div className={styles.instructions}>
          <h4>How to Play</h4>
          <ul>
            <li><strong>Player A (Key Finder):</strong> Can see keys but not hazards.</li>
            <li><strong>Player B (Navigator):</strong> Can see doors/hazards but not keys.</li>
            <li><strong>Goal:</strong> Work together to unlock all doors and survive.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
