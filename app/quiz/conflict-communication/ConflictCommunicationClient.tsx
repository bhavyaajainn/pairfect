"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, ShieldAlert, Clock, CheckCircle2, Share2, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';

import { ConflictQuestion, CONFLICT_COMMUNICATION_QUESTIONS as QUESTIONS } from '@/lib/quizData';

export interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function ConflictCommunicationClient({ isShared, onComplete, respondentName }: QuizProps) {
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
          const response = await getUserQuizResponse(user.id, 'conflict_communication');
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
            await saveQuizResponse(user.id, 'conflict_communication', newAnswers);
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
            <MessageSquare size={64} color="#f59e0b" />
          </div>
          <h1 className={styles.detailsTitle}>Conflict & Communication Quiz</h1>
          <p className={styles.detailsDescription}>
            Conflict is inevitable, but how you handle it determines the strength of your bond. 
            This quiz helps you identify your communication patterns during disagreements and 
            discover ways to navigate conflict constructively.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>3 Minutes</span>
            </div>
            <div className={styles.infoItem}>
              <Flame size={20} />
              <span>Conflict Styles</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Style Comparison</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>What You&apos;ll Explore</h3>
            <ul className={styles.detailsList}>
              <li>
                <strong>Communication Habits:</strong> Discover your go-to response (Avoidance, Assertion, 
                or Adaptation) when tensions rise.
              </li>
              <li>
                <strong>Trigger Awareness:</strong> Understand the communication styles that help you 
                feel heard and those that cause you to shut down.
              </li>
              <li>
                <strong>Resolution Paths:</strong> Learn how you and your partner can bridge the 
                gap during disagreements for more effective resolution.
              </li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Review My Style' : 'Start Quiz'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>Better communication leads to fewer misunderstandings and more love.</p>
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
          <h1 className={styles.title}>Conflict & Communication Style</h1>
          {gameState === 'playing' && (
            <p className={styles.subtitle}>
              Understand how you handle disagreement and communication.
            </p>
          )}
        </header>

        {gameState === 'playing' && currentQuestion ? (
          <>
            <div className={styles.messageBubble}>
              <div className={styles.questionText}>
                {currentQuestion.title}
              </div>
            </div>
            
            <div className={styles.optionsGrid}>
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  className={`${styles.optionButton} ${answers[currentQuestion.id] === option.label ? styles.selected : ''}`}
                  onClick={() => handleAnswer(option.label)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            
            <div className={styles.progress}>
              Message {currentQuestionIndex + 1} of {QUESTIONS.length}
            </div>
          </>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Communication Style</h2>
            <p className={styles.resultDescription}>
              You&apos;ve completed the quiz! Here&apos;s a summary of your responses.
            </p>
            
            {saving && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                Saving your responses...
              </p>
            )}

            <div className={styles.resultsList}>
              {QUESTIONS.map((q) => (
                <div key={q.id} className={styles.resultItem}>
                  <span className={styles.resultQuestion}>{q.id}. {q.title}</span>
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
