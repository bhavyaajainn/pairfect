"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GripVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import styles from './quiz.module.css';

import { PriorityItem, LIFE_PRIORITIES_DATA } from '@/lib/quizData';

interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function LifePrioritiesQuiz({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<PriorityItem[]>(LIFE_PRIORITIES_DATA);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const dragItem = React.useRef<number | null>(null);
  const dragOverItem = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (!isShared && !user) {
      router.push('/');
    }
  }, [isShared, user, authLoading, router]);

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

  const handleComplete = async () => {
    setShowResult(true);
    
    if (isShared && onComplete) {
      onComplete(items);
      return;
    }

    // Save quiz response for authenticated user
    if (user) {
      setSaving(true);
      try {
        await saveQuizResponse(user.id, 'life_priorities', items);
        console.log('Quiz response saved successfully');
      } catch (error) {
        console.error('Error saving quiz response:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        <ArrowLeft size={24} />
        <span>Back</span>
      </Link>

      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Life Priorities</h1>
          <p className={styles.subtitle}>
            Rank these items in order of importance to you.
          </p>
        </header>

        {!showResult ? (
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
              Here's what your ranking reveals about your subconscious priorities:
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
