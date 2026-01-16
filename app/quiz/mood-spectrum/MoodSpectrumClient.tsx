"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Activity, Clock, Share2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';
import { MOOD_SPECTRUM_CATEGORIES } from '@/lib/quizData';

interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function MoodSpectrumClient({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [moodLevels, setMoodLevels] = useState<Record<string, number>>({});
  const [gameState, setGameState] = useState<'details' | 'playing' | 'result'>(isShared ? 'playing' : 'details');
  const [saving, setSaving] = useState(false);
  const [hasTakenBefore, setHasTakenBefore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Initialize all moods to 50 (middle value)
    const initialLevels: Record<string, number> = {};
    MOOD_SPECTRUM_CATEGORIES.forEach(cat => {
      initialLevels[cat.id] = 50;
    });
    setMoodLevels(initialLevels);
  }, []);

  useEffect(() => {
    async function checkPreviousResponse() {
      if (user && !isShared) {
        try {
          const response = await getUserQuizResponse(user.id, 'mood_spectrum');
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

  const handleSliderChange = (moodId: string, value: number) => {
    setMoodLevels(prev => ({ ...prev, [moodId]: value }));
  };

  const getColorForIntensity = (intensity: number, isPositive: boolean) => {
    // For positive emotions, invert the scale
    const effectiveIntensity = isPositive ? 100 - intensity : intensity;
    
    if (effectiveIntensity <= 25) return '#22C55E'; // Green
    if (effectiveIntensity <= 50) return '#EAB308'; // Yellow
    if (effectiveIntensity <= 75) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const handleComplete = async () => {
    setGameState('result');
    if (isShared && onComplete) {
      onComplete(moodLevels);
      return;
    }
    if (user) {
      setSaving(true);
      try {
        await saveQuizResponse(user.id, 'mood_spectrum', moodLevels);
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
            <Activity size={64} color="#a855f7" />
          </div>
          <h1 className={styles.detailsTitle}>Mood Spectrum Quiz</h1>
          <p className={styles.detailsDescription}>
            Explore your emotional landscape by rating the intensity of different emotions. 
            This quiz helps you understand your mood spectrum and emotional patterns through 
            a simple slider-based interface.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>3 Minutes</span>
            </div>
            <div className={styles.infoItem}>
              <Activity size={20} />
              <span>10 Emotions</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Color-Coded Levels</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>What You&apos;ll Discover</h3>
            <ul className={styles.detailsList}>
              <li>
                <strong>Emotional Intensity:</strong> Understand how strongly you experience 
                different emotions like anger, joy, anxiety, and calmness.
              </li>
              <li>
                <strong>Mood Patterns:</strong> Identify which emotions dominate your 
                emotional landscape and how they balance each other.
              </li>
              <li>
                <strong>Self-Awareness:</strong> Gain insights into your emotional tendencies 
                and how they might affect your relationships.
              </li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Retake Quiz' : 'Start Quiz'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>Login to save and compare your mood spectrum over time.</p>
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
          <h1 className={styles.title}>Mood Spectrum</h1>
          {gameState === 'playing' && (
            <p className={styles.subtitle}>
              Drag the sliders to rate how intensely you experience each emotion.
            </p>
          )}
        </header>

        {gameState === 'playing' ? (
          <>
            <div className={styles.moodGrid}>
              {MOOD_SPECTRUM_CATEGORIES.map((mood) => {
                const intensity = moodLevels[mood.id] || 50;
                const color = getColorForIntensity(intensity, mood.isPositive);
                
                return (
                  <div key={mood.id} className={styles.moodItem}>
                    <div className={styles.moodHeader}>
                      <span className={styles.moodName}>{mood.name}</span>
                      <span className={styles.moodValue} style={{ color }}>
                        {intensity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity}
                      onChange={(e) => handleSliderChange(mood.id, parseInt(e.target.value))}
                      className={styles.slider}
                      style={{
                        background: `linear-gradient(to right, ${color} 0%, ${color} ${intensity}%, #e5e7eb ${intensity}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className={styles.sliderLabels}>
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.buttonContainer}>
              <Button 
                onClick={handleComplete}
                className={styles.completeButton}
              >
                See My Mood Spectrum
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Mood Spectrum</h2>
            <p className={styles.resultDescription}>
              Here&apos;s your emotional intensity profile across different mood categories:
            </p>
            
            {saving && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                Saving your responses...
              </p>
            )}

            <div className={styles.resultGrid}>
              {MOOD_SPECTRUM_CATEGORIES.map((mood) => {
                const intensity = moodLevels[mood.id] || 50;
                const color = getColorForIntensity(intensity, mood.isPositive);
                
                return (
                  <div key={mood.id} className={styles.resultMoodItem}>
                    <div className={styles.resultMoodHeader}>
                      <span className={styles.resultMoodName}>{mood.name}</span>
                      <span className={styles.resultMoodValue} style={{ color }}>
                        {intensity}%
                      </span>
                    </div>
                    <div className={styles.resultBar}>
                      <div 
                        className={styles.resultBarFill} 
                        style={{ width: `${intensity}%`, backgroundColor: color }}
                      />
                    </div>
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
