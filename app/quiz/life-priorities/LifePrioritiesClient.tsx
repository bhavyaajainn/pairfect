"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GripVertical, Scale, CheckCircle2, Clock, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';
import { PriorityItem, LIFE_PRIORITIES_DATA } from '@/lib/quizData';

interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function LifePrioritiesClient({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<PriorityItem[]>(LIFE_PRIORITIES_DATA);
  const [gameState, setGameState] = useState<'details' | 'playing' | 'result'>(isShared ? 'playing' : 'details');
  const [saving, setSaving] = useState(false);
  const [hasTakenBefore, setHasTakenBefore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    async function checkPreviousResponse() {
      if (user && !isShared) {
        try {
          const response = await getUserQuizResponse(user.id, 'life_priorities');
          if (response) {
            setHasTakenBefore(true);
          }
        } catch (error) {
          console.error('Error checking previous response:', error);
        }
      }
    }
    checkPreviousResponse();
  }, [user, isShared]);

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _items = [...items];
    const draggedItemContent = _items[dragItem.current];
    _items.splice(dragItem.current, 1);
    _items.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setItems(_items);
  };

  const handleStart = () => {
    if (!user && !isShared) {
      setIsAuthModalOpen(true);
      return;
    }
    setGameState('playing');
  };

  const handleComplete = async () => {
    setGameState('result');
    if (isShared && onComplete) {
      onComplete(items);
      return;
    }
    if (user) {
      setSaving(true);
      try {
        await saveQuizResponse(user.id, 'life_priorities', items);
      } catch (error) {
        console.error('Error saving quiz response:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  if (gameState === 'details') {
    return (
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={24} />
          <span>Back to Home</span>
        </Link>

        <div className={styles.detailsView}>
          <div className={styles.detailsIcon}>
            <Scale size={64} />
          </div>
          <h1 className={styles.detailsTitle}>Life Priorities Quiz</h1>
          <p className={styles.detailsDescription}>
            Discover the true depth of your connections with Pairfit. The Life Priorities quiz is a 
            unique psychological exercise designed to reveal your subconscious values and what truly 
            drives your decisions in life.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>2 Minutes</span>
            </div>
            <div className={styles.infoItem}>
              <CheckCircle2 size={20} />
              <span>Interactive Ranking</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Compare with Partners</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>What You&apos;ll Discover</h3>
            <ul className={styles.detailsList}>
              <li>
                <strong>Subconscious Ranking:</strong> Learn which life areas (Family, Career, Relationships) 
                you prioritize when speed is of the essence.
              </li>
              <li>
                <strong>Emotional Alignment:</strong> Understand how your values align with those of 
                your partner or close friends.
              </li>
              <li>
                <strong>Deep Insights:</strong> Get a detailed breakdown of the hidden meanings 
                behind your responses.
              </li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Try Again' : 'Start Quiz'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>You&apos;ll need to login to save your results.</p>
            )}
          </div>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => setGameState('details')} className={styles.backLink} style={{ border: 'none' }}>
        <ArrowLeft size={24} />
        <span>Exit Quiz</span>
      </button>

      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Life Priorities</h1>
          <p className={styles.subtitle}>
            Rank these items in order of importance to you.
          </p>
        </header>

        {gameState === 'playing' ? (
          <>
            <div className={styles.itemsContainer}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.item}
                  draggable
                  onDragStart={() => (dragItem.current = index)}
                  onDragEnter={() => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className={styles.rank}>{index + 1}</div>
                  <div className={styles.itemContent}>
                    <GripVertical className={styles.dragIcon} size={20} />
                    <div className={styles.itemText}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.buttonContainer}>
              <Button 
                onClick={handleComplete}
                className={styles.completeButton}
              >
                See My Priorities
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Life Priorities</h2>
            <p className={styles.resultDescription}>
              Here&apos;s what your ranking reveals about your subconscious priorities:
            </p>
            
            {saving && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Saving your responses...
              </p>
            )}

            <div className={styles.resultList}>
              {items.map((item, index) => (
                <div key={item.id} className={styles.resultItem}>
                  <span className={styles.resultRank}>{index + 1}</span>
                  <span className={styles.resultMeaning}>{item.meaning}: </span>
                  <span className={styles.resultItemText}>{item.text}</span>
                </div>
              ))}
            </div>

            <div className={styles.resultActions}>
              <Button 
                onClick={() => router.push('/dashboard')}
                className={styles.backButton}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
