"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Sparkles, Clock, CheckCircle2, Share2, HeartPulse } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';

import { EmotionalQuestion, EMOTIONAL_COMPATIBILITY_QUESTIONS as QUESTIONS } from '@/lib/quizData';

export interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function EmotionalCompatibilityClient({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [gameState, setGameState] = useState<'details' | 'playing' | 'result'>(isShared ? 'playing' : 'details');
  const [saving, setSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasTakenBefore, setHasTakenBefore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function checkPreviousResponse() {
      if (user && !isShared) {
        try {
          const response = await getUserQuizResponse(user.id, 'emotional_compatibility');
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

  const handleAnswer = async (optionLabel: string) => {
    if (isProcessing || gameState === 'result') return;
    setIsProcessing(true);

    const newAnswers = { ...answers, [QUESTIONS[currentQuestionIndex].id]: optionLabel };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsProcessing(false);
      }, 300);
    } else {
      setTimeout(async () => {
        setGameState('result');
        setIsProcessing(false);
        
        if (isShared && onComplete) {
          onComplete(newAnswers);
          return;
        }

        // Save quiz response for authenticated user
        if (user) {
          setSaving(true);
          try {
            await saveQuizResponse(user.id, 'emotional_compatibility', newAnswers);
          } catch (error: any) {
            console.error('Error saving quiz response:', error);
          } finally {
            setSaving(false);
          }
        }
      }, 300);
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
            <Brain size={64} color="#a855f7" />
          </div>
          <h1 className={styles.detailsTitle}>Emotional Compatibility Quiz</h1>
          <p className={styles.detailsDescription}>
            True intimacy begins with emotional understanding. This quiz explores how you respond to 
            different emotional triggers and situations, providing insights into your personal 
            emotional style and how it interacts with others.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>4 Minutes</span>
            </div>
            <div className={styles.infoItem}>
              <HeartPulse size={20} />
              <span>Scenario-Based</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Emotional Alignment</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>What You&apos;ll Discover</h3>
            <ul className={styles.detailsList}>
              <li>
                <strong>Response Styles:</strong> Understand whether you lean towards logic, emotion, 
                or observation during stressful situations.
              </li>
              <li>
                <strong>Support Needs:</strong> Learn how you prefer to give and receive emotional 
                support in a relationship.
              </li>
              <li>
                <strong>Connection Depth:</strong> See how your emotional frequency compares to 
                your partner&apos;s or friends&apos;.
              </li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Update Emotional Profile' : 'Start Quiz'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>Understanding your emotional profile helps in building lasting bonds.</p>
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

  const currentQuestion = QUESTIONS[currentQuestionIndex];

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
          <h1 className={styles.title}>Emotional Compatibility</h1>
          {gameState === 'playing' && (
            <p className={styles.subtitle}>
              See how you emotionally respond to different situations.
            </p>
          )}
        </header>

        {gameState === 'playing' && currentQuestion ? (
          <div className={styles.questionCard}>
            <div className={styles.questionText}>
              {currentQuestion.id}. {currentQuestion.title}
            </div>
            <div className={styles.scenarioText}>
              {currentQuestion.scenario}
            </div>
            
            <div className={styles.optionsGrid}>
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  className={`${styles.optionButton} ${answers[currentQuestion.id] === option.label ? styles.selected : ''}`}
                  onClick={() => handleAnswer(option.label)}
                >
                  <strong>{option.label})</strong> {option.text}
                </button>
              ))}
            </div>
            
            <div className={styles.progress}>
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </div>
          </div>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Emotional Style</h2>
            <p className={styles.resultDescription}>
              You&apos;ve completed the quiz! Here&apos;s what your responses suggest about your emotional compatibility style.
            </p>
            
            {saving && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                Saving your responses...
              </p>
            )}

            <div className={styles.resultsList}>
              {QUESTIONS.map((q) => (
                <div key={q.id} className={styles.resultItem}>
                  <span className={styles.resultQuestion}>{q.id}. {q.title}: </span>
                  <span className={styles.resultAnswer}>{q.options.find(o => o.label === answers[q.id])?.text}</span>
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
