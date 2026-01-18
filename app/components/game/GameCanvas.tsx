"use client";

import React, { useEffect, useState } from 'react';
import { Lock, Key, ShieldAlert, Star, Hourglass, Skull } from 'lucide-react';
import styles from './gameCanvas.module.css';

// Types
type Position = { x: number; y: number };
type Role = 'KEY_FINDER' | 'NAVIGATOR';

type GameEntity = {
  id: string;
  type: 'KEY' | 'DOOR' | 'HAZARD' | 'GOAL';
  hazardType?: 'TIME_PENALTY' | 'INSTANT_DEATH';
  pos: Position;
  color?: string;
  collected?: boolean;
  opened?: boolean;
  triggered?: boolean;
};

// Constants
const CELL_SIZE = 30; // px
const MAZE_LAYOUT = [
  "####################",
  "#                  #",
  "#  #######  #####  #",
  "#  #     #  #   #  #",
  "#  #  ####  # # #  #",
  "#  #  #     # # #  #",
  "#  #  ####  ### #  #",
  "#  #            #  #",
  "#  #######  #####  #",
  "#        #  #      #",
  "#######  #  #  #####",
  "#     #  #  #      #",
  "#  ####  #  #####  #",
  "#                  #",
  "####################"
];

const ROWS = MAZE_LAYOUT.length;
const COLS = MAZE_LAYOUT[0].length;

interface GameCanvasProps {
  role: Role;
  onMove: (pos: Position) => void;
  onHazard?: (type: 'TIME_PENALTY' | 'INSTANT_DEATH') => void;
  onGoal?: () => void;
  otherPlayerPos?: Position | null;
}

export default function GameCanvas({ role, onMove, onHazard, onGoal, otherPlayerPos }: GameCanvasProps) {
  // Local state
  const [myPos, setMyPos] = useState<Position>({ x: 1, y: 1 });
  
  // Level Data
  const [entities, setEntities] = useState<GameEntity[]>([
    { id: 'k1', type: 'KEY', pos: { x: 18, y: 3 }, color: '#3b82f6' }, // Blue Key
    { id: 'd1', type: 'DOOR', pos: { x: 10, y: 7 }, color: '#3b82f6' }, // Blue Door
    
    // Hazards
    { id: 'h1', type: 'HAZARD', hazardType: 'TIME_PENALTY', pos: { x: 5, y: 5 } },
    { id: 'h2', type: 'HAZARD', hazardType: 'INSTANT_DEATH', pos: { x: 15, y: 4 } },
    { id: 'h3', type: 'HAZARD', hazardType: 'TIME_PENALTY', pos: { x: 8, y: 12 } },
    
    { id: 'k2', type: 'KEY', pos: { x: 2, y: 12 }, color: '#ef4444' }, // Red Key
    { id: 'd2', type: 'DOOR', pos: { x: 15, y: 10 }, color: '#ef4444' }, // Red Door
    { id: 'g1', type: 'GOAL', pos: { x: 18, y: 13 } },
  ]);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newPos = { ...myPos };

      switch (e.key) {
        case 'ArrowUp': newPos.y -= 1; break;
        case 'ArrowDown': newPos.y += 1; break;
        case 'ArrowLeft': newPos.x -= 1; break;
        case 'ArrowRight': newPos.x += 1; break;
        default: return;
      }

      // 1. Boundary Check & Wall Collision
      if (
        newPos.y < 0 || newPos.y >= ROWS ||
        newPos.x < 0 || newPos.x >= COLS ||
        MAZE_LAYOUT[newPos.y][newPos.x] === '#'
      ) {
        return; // Hit wall or boundary
      }

      // 2. Door Collision
      const hitEntity = entities.find(e => e.pos.x === newPos.x && e.pos.y === newPos.y);
      if (hitEntity && hitEntity.type === 'DOOR' && !hitEntity.opened) {
         return; // Hit closed door
      }

      // 3. Hazard Collision
      if (hitEntity && hitEntity.type === 'HAZARD' && !hitEntity.triggered) {
          if (role === 'KEY_FINDER') {
              // Key Finders can't see hazards, so they trigger them!
              if (onHazard && hitEntity.hazardType) {
                  onHazard(hitEntity.hazardType);
                  // Mark as triggered locally to avoid double hits immediately (state sync handles real removal)
                  hitEntity.triggered = true; 
              }
          }
      }

      // 4. Goal Collision
      if (hitEntity && hitEntity.type === 'GOAL') {
          if (onGoal) onGoal();
      }

      setMyPos(newPos);
      onMove(newPos);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [myPos, entities, onMove, onHazard, onGoal, role]);

  // Render Grid
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const isWall = MAZE_LAYOUT[y][x] === '#';
        const isMe = myPos.x === x && myPos.y === y;
        const isOther = otherPlayerPos && otherPlayerPos.x === x && otherPlayerPos.y === y;
        
        const entity = entities.find(e => e.pos.x === x && e.pos.y === y);
        let content = null;

        if (entity && !entity.triggered) {
          if (entity.type === 'KEY') {
            if (role === 'KEY_FINDER' && !entity.collected) {
              content = <Key size={18} color={entity.color} strokeWidth={3} />;
            }
          } else if (entity.type === 'DOOR') {
            const isVisible = role === 'NAVIGATOR' || entity.opened;
            if (isVisible) {
               content = <Lock size={18} color={entity.color} className={entity.opened ? styles.openedDoor : ''} />;
            }
          } else if (entity.type === 'HAZARD') {
            if (role === 'NAVIGATOR') {
              if (entity.hazardType === 'TIME_PENALTY') {
                  content = <Hourglass size={18} color="#ec4899" />;
              } else {
                  content = <Skull size={18} color="#ef4444" />;
              }
            }
          } else if (entity.type === 'GOAL') {
             content = <Star size={20} color="#fbbf24" fill="#fbbf24" />;
          }
        }

        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={`${styles.cell} ${isWall ? styles.wall : styles.floor}`}
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          >
            {content}
            {isMe && <div className={`${styles.player} ${styles.me}`} />}
            {isOther && <div className={`${styles.player} ${styles.other}`} />}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className={styles.mazeWrapper}>
      <div 
        className={styles.gridContainer}
        style={{ 
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          width: COLS * CELL_SIZE,
          height: ROWS * CELL_SIZE
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
}
