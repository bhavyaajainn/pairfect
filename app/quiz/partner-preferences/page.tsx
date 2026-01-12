"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import styles from './quiz.module.css';

import { PartnerPreferenceQuestion, PARTNER_PREFERENCES_QUESTIONS as QUESTIONS } from '@/lib/quizData';

export interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: Record<number, string>) => void;
  respondentName?: string;
}

export default function PartnerPreferencesQuiz({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (authLoading) return;
    if (!isShared && !user) {
      router.push('/');
    }
  }, [isShared, user, authLoading, router]);

  const handleChoice = async (choiceLabel: string) => {
    if (isProcessing || showResult) return;
    setIsProcessing(true);

    const newAnswers = { ...answers, [QUESTIONS[currentIndex].id]: choiceLabel };
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsProcessing(false);
    } else {
      setShowResult(true);
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

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        <ArrowLeft size={24} />
        <span>Back</span>
      </Link>

      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Partner Preferences</h1>
        {!showResult && currentQuestion && (
          <>
            <p className={styles.subtitle}>{currentQuestion.category}</p>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </header>

        {!showResult && currentQuestion ? (
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

