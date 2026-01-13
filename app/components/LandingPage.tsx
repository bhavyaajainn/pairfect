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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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
            Discover the true depth of your connections with Pairfit. Take fun, interactive quizzes with friends and partners 
            to reveal your compatibility score and explore emotional alignment. Build stronger, more meaningful 
            relationships through the power of shared discovery and play.
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

      <section className={styles.seoSection}>
        <div className={styles.seoContainer}>
          <h2 className={styles.seoTitle}>Elevate Your Relationship with Pairfit</h2>
          <div className={styles.seoText}>
            <p>
              <span className={styles.seoHighlight}>Pairfit</span> is the premier platform for couples and friends looking to discover their 
              <strong> relationship compatibility</strong> and <strong>emotional alignment</strong>. In a world where meaningful connections 
              are more important than ever, Pairfit provides a fun and insightful way to bridge the gap between curiosity and clarity. 
              Our suite of interactive quizzes is specifically designed to spark honest conversations, reveal hidden priorities, and 
              strengthen the bonds you share with those who matter most.
            </p>
            
            <div className={styles.seoGrid}>
              <div>
                <h3>Subconscious Priorities</h3>
                <p>
                  Ever wondered what truly drives your decisions? The Pairfit <strong>Life Priorities</strong> quiz uses a unique drag-and-drop 
                  interface to help you rank life events. This reveals your subconscious values and shows how they align with your partner&apos;s 
                  vision for the future, fostering a deeper <strong>emotional matching</strong> experience.
                </p>
              </div>
              <div>
                <h3>Emotional Intelligence</h3>
                <p>
                  Understanding how you and your partner respond to various situations is key to longevity. Pairfit&apos;s 
                  <strong> Emotional Compatibility</strong> test evaluates your communication styles and reactions, providing a clear 
                  picture of your <strong>relationship alignment</strong>. It&apos;s about finding harmony in both similarities and differences.
                </p>
              </div>
            </div>

            <p>
              Whether you are in the early stages of a romance or have been together for decades, Pairfit offers the tools to 
              keep your connection vibrant. By using Pairfit regularly, you can track how your compatibility grows over time, 
              ensuring that you and your partner stay in sync as life evolves. Our platform is built on the belief that 
              <strong> relationship health</strong> is a journey, not a destination.
            </p>
            
            <p>
              Pairfit is more than just a <strong>compatibility test</strong>; it&apos;s a dedicated space for relationship growth. 
              Join the Pairfit community today and transform the way you relate to the world around you. Discover why 
              thousands of users trust Pairfit to help them find, nurture, and sustain their perfect match through the 
              power of <strong>emotional discovery</strong> and shared play.
            </p>
          </div>
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
