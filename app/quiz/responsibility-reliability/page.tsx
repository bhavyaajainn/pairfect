"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import styles from './quiz.module.css';

import { ResponsibilityTask, RESPONSIBILITY_RELIABILITY_TASKS as TASKS } from '@/lib/quizData';

const MAX_SELECTION = 6;

export interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function ResponsibilityReliabilityQuiz({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (authLoading) return;
    if (!isShared && !user) {
      router.push('/');
    }
  }, [isShared, user, authLoading, router]);

  const toggleSelection = (id: number) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(prev => prev.filter(taskId => taskId !== id));
    } else {
      if (selectedTaskIds.length < MAX_SELECTION) {
        setSelectedTaskIds(prev => [...prev, id]);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    
    if (isShared && onComplete) {
      onComplete(selectedTaskIds);
      return;
    }

    // Save quiz response for authenticated user
    if (user) {
      setSaving(true);
      try {
        await saveQuizResponse(user.id, 'responsibility_reliability', selectedTaskIds);
      } catch (error: any) {
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
          <h1 className={styles.title}>Responsibility & Reliability</h1>
          <p className={styles.subtitle}>
            You are managing a wedding. You have <strong>{MAX_SELECTION} points</strong> of energy. Select the {MAX_SELECTION} crises you would handle personally.
          </p>
          <div className={styles.counter}>
            Capacity: <span className={selectedTaskIds.length === MAX_SELECTION ? styles.full : ''}>{selectedTaskIds.length} / {MAX_SELECTION}</span>
          </div>
        </header>

        {!submitted ? (
          <div className={styles.grid}>
            {TASKS.map((task) => {
              const isSelected = selectedTaskIds.includes(task.id);
              const isDisabled = !isSelected && selectedTaskIds.length >= MAX_SELECTION;

              return (
                <div 
                  key={task.id} 
                  className={`${styles.card} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                  onClick={() => !isDisabled && toggleSelection(task.id)}
                >
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{task.title}</h3>
                    {isSelected && <CheckCircle size={20} className={styles.checkIcon} />}
                  </div>
                  <p className={styles.cardDescription}>{task.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Management Style</h2>
            <p className={styles.resultText}>
              You prioritized {selectedTaskIds.length} critical tasks. 
              In a real wedding chaos, your ability to triage is key!
            </p>
            <div className={styles.selectedList}>
              <h3>You chose to handle:</h3>
              
              {saving && (
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Saving your responses...
                </p>
              )}

              <ul>
                {TASKS.filter(t => selectedTaskIds.includes(t.id)).map(t => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
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
        {!submitted && (
          <footer className={styles.footer}>
            <Button 
              disabled={selectedTaskIds.length !== MAX_SELECTION}
              onClick={handleSubmit}
              className={styles.submitButton}
            >
              Confirm Selection ({selectedTaskIds.length}/{MAX_SELECTION})
            </Button>
          </footer>
        )}
      </div>
    </div>
  );
}

