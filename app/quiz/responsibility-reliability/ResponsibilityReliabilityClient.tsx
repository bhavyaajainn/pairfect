"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, CheckCircle2, Share2, ClipboardList, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';

import { ResponsibilityTask, RESPONSIBILITY_RELIABILITY_TASKS as TASKS } from '@/lib/quizData';

const MAX_SELECTION = 6;

export interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function ResponsibilityReliabilityClient({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'details' | 'playing' | 'result'>(isShared ? 'playing' : 'details');
  const [saving, setSaving] = useState(false);
  const [hasTakenBefore, setHasTakenBefore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function checkPreviousResponse() {
      if (user && !isShared) {
        try {
          const response = await getUserQuizResponse(user.id, 'responsibility_reliability');
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

  const handleStart = () => {
    if (!user && !isShared) {
      setIsAuthModalOpen(true);
      return;
    }
    setGameState('playing');
  };

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
    setGameState('result');
    
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

  if (gameState === 'details') {
    return (
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={24} />
          <span>Back to Home</span>
        </Link>

        <div className={styles.detailsView}>
          <div className={styles.detailsIcon}>
            <ClipboardList size={64} color="#10b981" />
          </div>
          <h1 className={styles.detailsTitle}>Responsibility & Reliability Quiz</h1>
          <p className={styles.detailsDescription}>
            A partnership is a team, and every team needs a balance of responsibilities. This quiz 
            puts you in a high-stakes scenario (managing a wedding!) to see which tasks you prioritize 
            and how you divide labor under pressure.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>5 Minutes</span>
            </div>
            <div className={styles.infoItem}>
              <AlertCircle size={20} />
              <span>Prioritization Task</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Teamwork Insights</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>What You&apos;ll Discover</h3>
            <ul className={styles.detailsList}>
              <li>
                <strong>Execution Style:</strong> Learn whether you focus on logistics, people, 
                or crisis management.
              </li>
              <li>
                <strong>Reliability Patterns:</strong> Understand how you take ownership of critical 
                tasks in a shared environment.
              </li>
              <li>
                <strong>Balanced Teamwork:</strong> See how your management style complements 
                your partner&apos;s approach to responsibility.
              </li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Update My Style' : 'Start Task'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>Effective teamwork is the backbone of any strong relationship.</p>
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
      <button 
        onClick={() => gameState === 'playing' ? setGameState('details') : router.push('/dashboard')} 
        className={styles.backLink} 
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={24} />
        <span>{gameState === 'playing' ? 'Exit Quiz' : 'Dashboard'}</span>
      </button>

      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Responsibility & Reliability</h1>
          {gameState === 'playing' && (
            <>
              <p className={styles.subtitle}>
                You are managing a wedding. You have <strong>{MAX_SELECTION} points</strong> of energy. Select the {MAX_SELECTION} crises you would handle personally.
              </p>
              <div className={styles.counter}>
                Capacity: <span className={selectedTaskIds.length === MAX_SELECTION ? styles.full : ''}>{selectedTaskIds.length} / {MAX_SELECTION}</span>
              </div>
            </>
          )}
        </header>

        {gameState === 'playing' ? (
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
        {gameState === 'playing' && (
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
