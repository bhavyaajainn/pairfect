"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import styles from './quiz.module.css';

import { ConflictQuestion, CONFLICT_COMMUNICATION_QUESTIONS as QUESTIONS } from '@/lib/quizData';

export interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function ConflictCommunicationQuiz({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  const handleAnswer = async (optionLabel: string) => {
    if (isProcessing || showResult) return;
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

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        <ArrowLeft size={24} />
        <span>Back</span>
      </Link>

      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Conflict & Communication Style</h1>
          <p className={styles.subtitle}>
            Understand how you handle disagreement and communication.
          </p>
        </header>

        {!showResult && currentQuestion ? (
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

