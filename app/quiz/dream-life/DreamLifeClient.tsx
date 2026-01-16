"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Clock, Share2, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';
import { DREAM_LIFE_CATEGORIES } from '@/lib/quizData';

interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

export default function DreamLifeClient({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [gameState, setGameState] = useState<'details' | 'playing' | 'result'>(isShared ? 'playing' : 'details');
  const [saving, setSaving] = useState(false);
  const [hasTakenBefore, setHasTakenBefore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function checkPreviousResponse() {
      if (user && !isShared) {
        try {
          const response = await getUserQuizResponse(user.id, 'dream_life');
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

  const handleSelection = (categoryId: number, optionLabel: string) => {
    const newSelections = { ...selections, [categoryId]: optionLabel };
    setSelections(newSelections);

    // Auto-advance to next category after a short delay
    setTimeout(() => {
      if (currentCategoryIndex < DREAM_LIFE_CATEGORIES.length - 1) {
        setCurrentCategoryIndex(prev => prev + 1);
      } else {
        handleComplete(newSelections);
      }
    }, 300);
  };

  const handleComplete = async (finalSelections: Record<number, string>) => {
    setGameState('result');
    if (isShared && onComplete) {
      onComplete(finalSelections);
      return;
    }
    if (user) {
      setSaving(true);
      try {
        await saveQuizResponse(user.id, 'dream_life', finalSelections);
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
            <Sparkles size={64} color="#ec4899" />
          </div>
          <h1 className={styles.detailsTitle}>Dream Life Designer</h1>
          <p className={styles.detailsDescription}>
            Create a visual representation of your ideal life! Choose from beautiful images 
            across 6 lifestyle categories to design your dream life and discover what truly 
            matters to you.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>4 Minutes</span>
            </div>
            <div className={styles.infoItem}>
              <Heart size={20} />
              <span>6 Categories</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Visual Mood Board</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>Categories You&apos;ll Explore</h3>
            <ul className={styles.detailsList}>
              <li>
                <strong>Dream Home:</strong> Choose your ideal living space from apartments 
                to beach houses and mountain cabins.
              </li>
              <li>
                <strong>Lifestyle Type:</strong> Define your aesthetic from minimalist to 
                luxurious, adventurous to traditional.
              </li>
              <li>
                <strong>Career Path:</strong> Select your ideal professional journey and 
                work style.
              </li>
              <li>
                <strong>Social Circle:</strong> Decide on your preferred social dynamic and 
                friend group size.
              </li>
              <li>
                <strong>Dream Vacation:</strong> Pick your perfect getaway style from beach 
                paradises to adventure sports.
              </li>
              <li>
                <strong>Daily Routine:</strong> Choose your ideal daily rhythm and schedule 
                preferences.
              </li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Redesign My Life' : 'Start Designing'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>Login to save and share your dream life vision.</p>
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

  const currentCategory = DREAM_LIFE_CATEGORIES[currentCategoryIndex];

  return (
    <div className={styles.container}>
      <button 
        onClick={() => gameState === 'playing' ? setGameState('details') : router.push('/dashboard')} 
        className={styles.backLink} 
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={24} />
        <span>{gameState === 'playing' ? 'Exit Designer' : 'Dashboard'}</span>
      </button>

      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dream Life Designer</h1>
          {gameState === 'playing' && (
            <p className={styles.subtitle}>
              {currentCategory?.category}
            </p>
          )}
        </header>

        {gameState === 'playing' ? (
          <>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${((currentCategoryIndex + 1) / DREAM_LIFE_CATEGORIES.length) * 100}%` }}
              />
            </div>
            <p className={styles.progressText}>
              Question {currentCategoryIndex + 1} of {DREAM_LIFE_CATEGORIES.length}
            </p>

            <div className={styles.optionsGrid}>
              {currentCategory?.options.map((option) => (
                <div
                  key={option.label}
                  className={`${styles.optionCard} ${selections[currentCategory.id] === option.label ? styles.selected : ''}`}
                  onClick={() => handleSelection(currentCategory.id, option.label)}
                >
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={option.imageSrc} 
                      alt={option.label} 
                      fill 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.optionLabel}>
                    <span>{option.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {currentCategoryIndex > 0 && (
              <div className={styles.navigationButtons}>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentCategoryIndex(prev => prev - 1)}
                >
                  Previous
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Dream Life</h2>
            <p className={styles.resultDescription}>
              Here&apos;s your personalized vision board based on your selections:
            </p>
            
            {saving && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                Saving your dream life...
              </p>
            )}

            <div className={styles.moodBoard}>
              {DREAM_LIFE_CATEGORIES.map((category) => {
                const selectedOption = category.options.find(opt => opt.label === selections[category.id]);
                
                return (
                  <div key={category.id} className={styles.moodBoardItem}>
                    <h3 className={styles.categoryTitle}>{category.category}</h3>
                    {selectedOption && (
                      <>
                        <div className={styles.moodBoardImage}>
                          <Image 
                            src={selectedOption.imageSrc} 
                            alt={selectedOption.label} 
                            fill 
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <p className={styles.selectionLabel}>{selectedOption.label}</p>
                      </>
                    )}
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
