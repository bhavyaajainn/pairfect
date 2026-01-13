"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Heart, Sparkles, Clock, CheckCircle2, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';

import { PartnerPreferenceQuestion, PARTNER_PREFERENCES_QUESTIONS as QUESTIONS } from '@/lib/quizData';

export interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: Record<number, string>) => void;
  respondentName?: string;
}

export default function PartnerPreferencesClient({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
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
          const response = await getUserQuizResponse(user.id, 'partner_preferences');
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

  const handleChoice = async (choiceLabel: string) => {
    if (isProcessing || gameState === 'result') return;
    setIsProcessing(true);

    const newAnswers = { ...answers, [QUESTIONS[currentIndex].id]: choiceLabel };
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsProcessing(false);
    } else {
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
          const formattedAnswers = Object.entries(newAnswers).map(([questionId, choice]) => ({
            category: QUESTIONS.find(q => q.id === parseInt(questionId))?.category || 'Unknown',
            choice: choice
          }));
          await saveQuizResponse(user.id, 'partner_preferences', formattedAnswers);
        } catch (error) {
          console.error('Error saving quiz response:', error);
        } finally {
          setSaving(false);
        }
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
            <Heart size={64} color="#ff4d4d" fill="#ff4d4d" />
          </div>
          <h1 className={styles.detailsTitle}>Partner Preferences Quiz</h1>
          <p className={styles.detailsDescription}>
            Building a life together starts with understanding each other&apos;s daily preferences and 
            long-term values. Our Partner Preferences quiz helps you articulate what you value in a 
            partner and see how your visions of the future align.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>3 Minutes</span>
            </div>
            <div className={styles.infoItem}>
              <Sparkles size={20} />
              <span>Visual Choices</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Compare Preferences</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>What This Quiz Explores</h3>
            <ul className={styles.detailsList}>
              <li>
                <strong>Lifestyle Alignment:</strong> From morning routines to travel styles, discover 
                how your daily rhythms match.
              </li>
              <li>
                <strong>Future Aspirations:</strong> Explore shared goals in career, family, and 
                personal growth.
              </li>
              <li>
                <strong>Social & Financial Values:</strong> Understand each other&apos;s approach to 
                socializing, spending, and saving.
              </li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Update Preferences' : 'Start Quiz'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>Personal preferences are saved to your profile once logged in.</p>
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

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

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
          <h1 className={styles.title}>Partner Preferences</h1>
        {gameState === 'playing' && currentQuestion && (
          <>
            <p className={styles.subtitle}>{currentQuestion.category}</p>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </header>

        {gameState === 'playing' && currentQuestion ? (
          <div className={styles.cardContainer}>
            <div 
              className={styles.choiceCard} 
              onClick={() => handleChoice(currentQuestion.options[0].label)}
              style={{ backgroundImage: `url(${currentQuestion.options[0].imageSrc})` }}
            >
              <div className={styles.cardOverlay}>
                <span className={styles.choiceLabel}>{currentQuestion.options[0].label}</span>
              </div>
            </div>

            <div className={styles.orDivider}>OR</div>

            <div 
              className={styles.choiceCard} 
              onClick={() => handleChoice(currentQuestion.options[1].label)}
              style={{ backgroundImage: `url(${currentQuestion.options[1].imageSrc})` }}
            >
              <div className={styles.cardOverlay}>
                <span className={styles.choiceLabel}>{currentQuestion.options[1].label}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Ideal Partner Profile</h2>
            <p className={styles.resultText}>
              You have a clear idea of what you want! Here is a summary of your preferences.
            </p>
            
            {saving && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Saving your responses...
              </p>
            )}
            
            <div className={styles.resultsList}>
              {Object.entries(answers).map(([questionId, choice]) => {
                const question = QUESTIONS.find(q => q.id === parseInt(questionId));
                return (
                  <div key={questionId} className={styles.resultItem}>
                    <strong>{question?.category}:</strong> {choice}
                  </div>
                );
              })}
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
