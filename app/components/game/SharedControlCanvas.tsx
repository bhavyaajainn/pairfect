"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './sharedControlCanvas.module.css';

// -- TYPES --
type Role = 'HORIZONTAL' | 'VERTICAL';
type InputState = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  crouch: boolean;
};

type Obstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'WALL' | 'HURDLE' | 'LOW_BEAM';
};

interface GameProps {
  role: Role;
  onInput: (input: Partial<InputState>) => void;
  remoteInput: Partial<InputState>;
  onWin?: () => void;
  isGameOver?: boolean;
  channelRef: React.MutableRefObject<any>;
}

// -- CONSTANTS --
const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 500;
const PLAYER_SIZE = 30;
const STEP_SIZE = 15; // Discrete step per press
const FRICTION = 0.92; // No longer used for movement, but keeping for now
const MOVE_ACCEL = 0.6; // No longer used for movement, but keeping for now
const MAX_SPEED = 6; // No longer used for movement, but keeping for now

// Level Design
const OBSTACLES: Obstacle[] = [
  // Outer Walls
  { x: 0, y: 0, w: 800, h: 20, type: 'WALL' },
  { x: 0, y: 480, w: 800, h: 20, type: 'WALL' },
  { x: 0, y: 0, w: 20, h: 500, type: 'WALL' },
  { x: 780, y: 0, w: 20, h: 500, type: 'WALL' },
  
  // Maze Walls
  { x: 150, y: 20, w: 20, h: 300, type: 'WALL' },
  { x: 300, y: 180, w: 20, h: 320, type: 'WALL' },
  { x: 450, y: 20, w: 20, h: 300, type: 'WALL' },
  { x: 600, y: 180, w: 20, h: 320, type: 'WALL' },

  // Hurdles (Require Jump) - Orange
  { x: 170, y: 200, w: 130, h: 20, type: 'HURDLE' },
  { x: 470, y: 100, w: 130, h: 20, type: 'HURDLE' },

  // Low Beams (Require Crouch) - Blue
  { x: 20, y: 350, w: 130, h: 20, type: 'LOW_BEAM' },
  { x: 620, y: 300, w: 160, h: 20, type: 'LOW_BEAM' },
];

const GOAL = { x: 740, y: 440, w: 40, h: 40 };
const START_POS = { x: 60, y: 60 };

export default function SharedControlCanvas({ role, onInput, remoteInput, onWin, isGameOver, channelRef }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State Refs
  const pos = useRef({ ...START_POS });
  const zHeight = useRef(0); // 0 = ground, >0 = air
  const isCrouching = useRef(false);
  const localInput = useRef<Partial<InputState>>({});
  const won = useRef(false);
  
  const checkCollision = useCallback((nextX: number, nextY: number, jumping: boolean, crouching: boolean) => {
    const pLeft = nextX;
    const pRight = nextX + PLAYER_SIZE;
    const pTop = nextY;
    const pBottom = nextY + PLAYER_SIZE;

    for (const obs of OBSTACLES) {
        const oLeft = obs.x;
        const oRight = obs.x + obs.w;
        const oTop = obs.y;
        const oBottom = obs.y + obs.h;

        if (pRight > oLeft && pLeft < oRight && pBottom > oTop && pTop < oBottom) {
            if (obs.type === 'WALL') return true;
            if (obs.type === 'HURDLE' && !jumping) return true;
            if (obs.type === 'LOW_BEAM' && !crouching) return true;
        }
    }
    return false;
  }, []); // No dependencies, as OBSTACLES and PLAYER_SIZE are constants

  const broadcastPos = useCallback(() => {
    if (!channelRef.current) return;
    if (role === 'HORIZONTAL') {
        channelRef.current.send({
            type: 'broadcast',
            event: 'sync_pos',
            payload: { x: pos.current.x }
        });
    } else {
        channelRef.current.send({
            type: 'broadcast',
            event: 'sync_pos',
            payload: { y: pos.current.y }
        });
    }
  }, [channelRef, role]); // Dependencies: channelRef and role

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for game keys
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const update: Partial<InputState> = {};
      let moved = false;

      // JUMP/CROUCH State logic (Held Keys)
      const isJumping = localInput.current.jump || false;
      const isCrouchingState = localInput.current.crouch || false;

      // MOVEMENT LOGIC (Discrete Steps)
      if (role === 'HORIZONTAL') {
        if (e.key === 'ArrowLeft') {
            const nextX = pos.current.x - STEP_SIZE;
            if (!checkCollision(nextX, pos.current.y, isJumping, isCrouchingState)) {
                pos.current.x = nextX;
                moved = true;
            }
        }
        if (e.key === 'ArrowRight') {
            const nextX = pos.current.x + STEP_SIZE;
            if (!checkCollision(nextX, pos.current.y, isJumping, isCrouchingState)) {
                pos.current.x = nextX;
                moved = true;
            }
        }
        // Action Mapping
        if (e.key === 'ArrowUp') update.jump = true;
        if (e.key === 'ArrowDown') update.crouch = true;
      } 
      else if (role === 'VERTICAL') {
        if (e.key === 'ArrowUp') {
            const nextY = pos.current.y - STEP_SIZE;
            if (!checkCollision(pos.current.x, nextY, isJumping, isCrouchingState)) {
                pos.current.y = nextY;
                moved = true;
            }
        }
        if (e.key === 'ArrowDown') {
            const nextY = pos.current.y + STEP_SIZE;
            if (!checkCollision(pos.current.x, nextY, isJumping, isCrouchingState)) {
                pos.current.y = nextY;
                moved = true;
            }
        }
        // Action Mapping
        if (e.key === 'ArrowLeft') update.jump = true;
        if (e.key === 'ArrowRight') update.crouch = true;
      }
      
      // Universal Keys
      if (e.key === ' ') update.jump = true;
      if (e.key === 'Shift') update.crouch = true;

      // Broadcast if moved or state changed
      if (moved) broadcastPos();

      if (Object.keys(update).length > 0) {
        localInput.current = { ...localInput.current, ...update };
        onInput(localInput.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const update: Partial<InputState> = {};
      
      if (role === 'HORIZONTAL') {
        // Actions only
        if (e.key === 'ArrowUp') update.jump = false;
        if (e.key === 'ArrowDown') update.crouch = false;
      } else if (role === 'VERTICAL') {
        // Actions only
        if (e.key === 'ArrowLeft') update.jump = false;
        if (e.key === 'ArrowRight') update.crouch = false;
      }
      
      if (e.key === ' ') update.jump = false;
      if (e.key === 'Shift') update.crouch = false;

      if (Object.keys(update).length > 0) {
        localInput.current = { ...localInput.current, ...update };
        onInput(localInput.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const render = () => {
      // Pause if game over
      if (isGameOver) return;
      
      // Sync Jump/Crouch State
      const inputJump = localInput.current.jump || remoteInput.jump;
      const inputCrouch = localInput.current.crouch || remoteInput.crouch;

      if (inputJump) {
          zHeight.current = 10;
      } else {
          zHeight.current = 0;
      }

      isCrouching.current = !!inputCrouch;

      // NOTE: Movement is now EVENT-DRIVEN in handleKeyDown/touch
      // We do NOT update pos.current here based on held keys or velocity.
      // The position is updated directly by key/touch events.

      // Win Check
      if (
          pos.current.x < GOAL.x + GOAL.w &&
          pos.current.x + PLAYER_SIZE > GOAL.x &&
          pos.current.y < GOAL.y + GOAL.h &&
          pos.current.y + PLAYER_SIZE > GOAL.y &&
          !won.current
      ) {
          won.current = true;
          if (onWin) onWin();
      }

      // -- RENDER --
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Grid
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=0; i<WORLD_WIDTH; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i, WORLD_HEIGHT); }
      for(let i=0; i<WORLD_HEIGHT; i+=50) { ctx.moveTo(0,i); ctx.lineTo(WORLD_WIDTH, i); }
      ctx.stroke();

      // Obstacles
      OBSTACLES.forEach(obs => {
          if (obs.type === 'WALL') ctx.fillStyle = '#6b7280';
          else if (obs.type === 'HURDLE') ctx.fillStyle = '#f97316'; // Orange
          else if (obs.type === 'LOW_BEAM') ctx.fillStyle = '#3b82f6'; // Blue
          
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          
          if (obs.type === 'HURDLE') {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(obs.x, obs.y + 5, obs.w, 10);
            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.fillText("JUMP", obs.x + obs.w/2 - 12, obs.y + 14);
          } else if (obs.type === 'LOW_BEAM') {
            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.fillText("CROUCH", obs.x + obs.w/2 - 18, obs.y + 14);
          }
      });

      // Goal
      const gx = GOAL.x + GOAL.w/2;
      const gy = GOAL.y + GOAL.h/2;
      
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20;

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(gx - 10, gy - 10);
      ctx.lineTo(gx + 10, gy - 10);
      ctx.quadraticCurveTo(gx + 10, gy + 5, gx, gy + 10);
      ctx.quadraticCurveTo(gx - 10, gy + 5, gx - 10, gy - 10);
      ctx.moveTo(gx, gy + 10);
      ctx.lineTo(gx, gy + 15);
      ctx.moveTo(gx - 8, gy + 15);
      ctx.lineTo(gx + 8, gy + 15);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.strokeStyle = won.current ? '#fff' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(GOAL.x, GOAL.y, GOAL.w, GOAL.h);

      // Player
      const pScale = zHeight.current > 0 ? 1.2 : (isCrouching.current ? 0.8 : 1);
      const pColor = zHeight.current > 0 ? '#fde047' : '#fbbf24';
      
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(pos.current.x + PLAYER_SIZE/2, pos.current.y + PLAYER_SIZE + 5, PLAYER_SIZE/2 * pScale, PLAYER_SIZE/4 * pScale, 0, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = pColor;
      const sizeOffset = (PLAYER_SIZE - (PLAYER_SIZE * pScale)) / 2;
      ctx.fillRect(pos.current.x + sizeOffset, pos.current.y + sizeOffset, PLAYER_SIZE * pScale, PLAYER_SIZE * pScale);

      // Overlay Info
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '14px monospace';
      
      // Tutorial Hints
      ctx.textAlign = 'left';
      // Simplified labels to match the "Top/Left = Jump" mental model
      const jumpKey = role === 'HORIZONTAL' ? '▲ (Up)' : '◀ (Left)';
      const crouchKey = role === 'HORIZONTAL' ? '▼ (Down)' : '▶ (Right)';

      ctx.fillText(`🟧 JUMP: ${jumpKey}`, 20, WORLD_HEIGHT - 15);
      ctx.fillText(`🟦 CROUCH: ${crouchKey}`, 220, WORLD_HEIGHT - 15);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [role, remoteInput, isGameOver, checkCollision, broadcastPos, onWin]);

    // Logic for Touch mapping (mirrors Key mapping)
    const handleTouchStart = (dir: 'up' | 'down' | 'left' | 'right') => {
        const update: Partial<InputState> = {};
        let moved = false;
        const isJumping = localInput.current.jump || false;
        const isCrouchingState = localInput.current.crouch || false;

        if (role === 'HORIZONTAL') {
            if (dir === 'left') {
                const nextX = pos.current.x - STEP_SIZE;
                if (!checkCollision(nextX, pos.current.y, isJumping, isCrouchingState)) {
                    pos.current.x = nextX;
                    moved = true;
                }
            }
            if (dir === 'right') {
                const nextX = pos.current.x + STEP_SIZE;
                if (!checkCollision(nextX, pos.current.y, isJumping, isCrouchingState)) {
                    pos.current.x = nextX;
                    moved = true;
                }
            }
            // Actions
            if (dir === 'up') update.jump = true;
            if (dir === 'down') update.crouch = true;
        } 
        else if (role === 'VERTICAL') {
            if (dir === 'up') {
                const nextY = pos.current.y - STEP_SIZE;
                if (!checkCollision(pos.current.x, nextY, isJumping, isCrouchingState)) {
                    pos.current.y = nextY;
                    moved = true;
                }
            }
            if (dir === 'down') {
                const nextY = pos.current.y + STEP_SIZE;
                if (!checkCollision(pos.current.x, nextY, isJumping, isCrouchingState)) {
                    pos.current.y = nextY;
                    moved = true;
                }
            }
            // Actions
            if (dir === 'left') update.jump = true;
            if (dir === 'right') update.crouch = true;
        }

        if (moved && channelRef.current) {
             if (role === 'HORIZONTAL') {
                channelRef.current.send({ type: 'broadcast', event: 'sync_pos', payload: { x: pos.current.x } });
            } else {
                channelRef.current.send({ type: 'broadcast', event: 'sync_pos', payload: { y: pos.current.y } });
            }
        }

        if (Object.keys(update).length > 0) {
            localInput.current = { ...localInput.current, ...update };
            onInput(localInput.current);
        }
    };

    const handleTouchEnd = (dir: 'up' | 'down' | 'left' | 'right') => {
        const update: Partial<InputState> = {};
        if (role === 'HORIZONTAL') {
            // Only clear Action flags
            if (dir === 'up') update.jump = false;
            if (dir === 'down') update.crouch = false;
        } else {
            if (dir === 'left') update.jump = false;
            if (dir === 'right') update.crouch = false;
        }
        
        if (Object.keys(update).length > 0) {
            localInput.current = { ...localInput.current, ...update };
            onInput(localInput.current);
        }
    };

    // SYNC LOOP: Broadcast authoritative axis
    useEffect(() => {
        if (!channelRef.current || isGameOver) return;

        const syncInterval = setInterval(() => {
            if (role === 'HORIZONTAL') {
                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'sync_pos',
                    payload: { x: pos.current.x }
                });
            } else {
                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'sync_pos',
                    payload: { y: pos.current.y }
                });
            }
        }, 100); // 10Hz sync

        const channel = channelRef.current;
        const sub = channel.on('broadcast', { event: 'sync_pos' }, ({ payload }: { payload: any }) => {
            if (role === 'HORIZONTAL' && payload.y !== undefined) {
                // I am Horz, I trust Vert's Y
                // Interpolate or snap? Snap for now to fix desync hard.
                if (Math.abs(pos.current.y - payload.y) > 5) {
                    pos.current.y = payload.y;
                }
            } else if (role === 'VERTICAL' && payload.x !== undefined) {
                // I am Vert, I trust Horz's X
                if (Math.abs(pos.current.x - payload.x) > 5) {
                    pos.current.x = payload.x;
                }
            }
        });

        return () => {
             clearInterval(syncInterval);
             channel.off('broadcast', { event: 'sync_pos' });
        };
    }, [role, isGameOver]); // Re-bind if role changes

  return (
    <div className={styles.canvasContainer}>
         <canvas 
            ref={canvasRef} 
            width={WORLD_WIDTH} 
            height={WORLD_HEIGHT} 
            className={styles.canvas}
         />
         
         {/* Mobile D-Pad Overlay */}
         <div className={`${styles.controlsOverlay} ${styles.mobileOnly}`}>
            <div className={styles.dpadGrid}>
                {/* UP */}
                <div className={styles.dpadRow}>
                    <button 
                        className={`${styles.touchBtn} ${role === 'HORIZONTAL' ? styles.actionBtn : ''}`}
                        onTouchStart={(e) => { e.preventDefault(); handleTouchStart('up'); }}
                        onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('up'); }}
                    >{role === 'HORIZONTAL' ? 'JUMP' : '▲'}</button>
                </div>
                
                {/* LEFT / RIGHT */}
                <div className={styles.dpadRow}>
                    <button 
                        className={`${styles.touchBtn} ${role === 'VERTICAL' ? styles.actionBtn : ''}`}
                        onTouchStart={(e) => { e.preventDefault(); handleTouchStart('left'); }}
                        onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('left'); }}
                    >{role === 'VERTICAL' ? 'JUMP' : '◀'}</button>

                    <div className={styles.dpadSpacer} />

                    <button 
                        className={`${styles.touchBtn} ${role === 'VERTICAL' ? styles.crouchBtn : ''}`}
                        onTouchStart={(e) => { e.preventDefault(); handleTouchStart('right'); }}
                        onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('right'); }}
                    >{role === 'VERTICAL' ? 'CROUCH' : '▶'}</button>
                </div>

                {/* DOWN */}
                <div className={styles.dpadRow}>
                     <button 
                        className={`${styles.touchBtn} ${role === 'HORIZONTAL' ? styles.crouchBtn : ''}`}
                        onTouchStart={(e) => { e.preventDefault(); handleTouchStart('down'); }}
                        onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('down'); }}
                    >{role === 'HORIZONTAL' ? 'CROUCH' : '▼'}</button>
                </div>
            </div>
         </div>
    </div>
  );
}
