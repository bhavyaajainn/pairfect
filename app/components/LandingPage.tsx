"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Scale, HeartHandshake, MessageCircle } from 'lucide-react';
import Footer from './Footer';
import Button from './Button';
import Card from './Card';
import AuthModal from './AuthModal';
import styles from '../page.module.css';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const quizzes = [
    { id: 'life_priorities', icon: <Scale size={32} />, title: 'Life Priorities', description: 'Drag and drop to rank life events and reveal your subconscious priorities.', href: '/quiz/life-priorities' },
    { id: 'emotional_compatibility', icon: <HeartHandshake size={32} />, title: 'Emotional Compatibility', description: 'See how you emotionally respond to different situations.', href: '/quiz/emotional-compatibility' },
    { id: 'conflict_communication', icon: <MessageCircle size={32} />, title: 'Conflict & Communication', description: 'Understand how you handle disagreement and communication.', href: '/quiz/conflict-communication' },
  ];

  const handleAction = (href: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      router.push(href);
    }
  };

  return (
    <div className={styles.main}>
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find Your Perfect Match!</h1>
          <p className={styles.heroSubtitle}>
            Take fun quizzes with friends and discover your compatibility score. 
            Connect on a deeper level through play.
          </p>
          <Button 
            size="lg" 
            className={styles.ctaButton}
            onClick={() => handleAction('/dashboard')}
          >
            Get Started
          </Button>
        </div>
        <div className={styles.heroImageContainer}>
          <Image 
            src="/hero.png" 
            alt="Two people connecting" 
            width={500} 
            height={500} 
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      <section className={styles.quizPreview}>
        <h2 className={styles.sectionTitle}>Popular Quizzes</h2>
        <div className={styles.grid}>
          {quizzes.map((quiz) => (
            <Card key={quiz.id} hoverEffect borderOnHover className={styles.quizCard}>
              <div className={styles.quizCardContent}>
                <div className={styles.quizIcon}>{quiz.icon}</div>
                <h3 className={styles.quizTitle}>{quiz.title}</h3>
                <p className={styles.quizDescription}>{quiz.description}</p>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => handleAction(quiz.href)}
                >
                  Try This Quiz
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
