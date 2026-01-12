import React from 'react';
import { Metadata } from 'next';
import Footer from '../components/Footer';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Pairfit and our mission to help couples and friends connect on a deeper level through interactive quizzes.",
};

export default function AboutPage() {
  return (
    <div className={styles.main}>
      <main className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>About Pairfit</h1>
        </header>

        <section className={styles.section}>
          <p className={styles.paragraph}>
            In today’s fast-paced world, truly getting to know someone has become more difficult than ever. 
            Honest conversations often take a back seat to busy schedules, social pressure, and the fear 
            of asking uncomfortable questions. Understanding important areas like emotional compatibility, 
            money-related decisions, values, and personal preferences requires time and openness—something 
            many relationships struggle with.
          </p>

          <p className={styles.paragraph}>
            <span className={styles.highlight}>Pairfit is designed to make this process simple, comfortable, and even fun.</span>
          </p>

          <p className={styles.paragraph}>
            Pairfit helps people understand their partners better through engaging, interactive quizzes 
            that focus on real aspects of relationships that truly matter. From emotional connection and 
            communication styles to financial thinking and lifestyle preferences, Pairfit gives you 
            meaningful insights into how compatible you are with your partner.
          </p>

          <p className={styles.paragraph}>
            Instead of relying on assumptions, Pairfit creates a safe space for self-expression and discovery. 
            The quizzes encourage honest answers, spark thoughtful conversations, and highlight both 
            similarities and differences in a positive way. This leads to better communication, deeper 
            understanding, and stronger emotional bonds.
          </p>

          <p className={styles.paragraph}>
            Whether you’re in a new relationship, strengthening an existing one, or simply curious about 
            how well you and your partner align, Pairfit turns connection into clarity. It’s easy to use, 
            insightful, and designed to bring two people closer—one quiz at a time.
          </p>

          <p className={styles.footer_text}>
            Pairfit helps you understand not just how well you match, but how well you grow together. 💛
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
