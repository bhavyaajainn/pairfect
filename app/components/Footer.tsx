import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.column}>
          <h4>Popular Quizzes</h4>
          <div className={styles.links}>
            <Link href="/quiz/emotional-compatibility" className={styles.link}>Emotional Compatibility Quiz</Link>
            <Link href="/quiz/life-priorities" className={styles.link}>Life Priorities Quiz</Link>
            <Link href="/quiz/conflict-communication" className={styles.link}>Conflict & Communication Quiz</Link>
          </div>
        </div>
        <div className={styles.column}>
          <h4>Company</h4>
          <div className={styles.links}>
            <Link href="/about" className={styles.link}>About Pairfit</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
            <Link href="/start-quiz" className={styles.link}>Start Quiz</Link>
          </div>
        </div>
        <div className={styles.column}>
          <h4>Legal</h4>
          <div className={styles.links}>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms" className={styles.link}>Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className={styles.copyright} suppressHydrationWarning>
        © {new Date().getFullYear()} Pairfit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
