import React from 'react';
import type { Metadata } from 'next';
import Footer from '../components/Footer';
import styles from '../about/about.module.css';

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Pairfit team for any inquiries, feedback, or support regarding our relationship compatibility quizzes.",
};

export default function ContactPage() {
  return (
    <div className={styles.main}>
      <main className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Contact</h1>
        </header>

        <section className={styles.section}>
          <p className={styles.paragraph}>
            Have questions, feedback, or just want to say hello? We&apos;d love to hear from you! 
            At Pairfit, we are committed to helping you build stronger connections, and your 
            input helps us improve.
          </p>

          <p className={styles.paragraph}>
            <strong>Email Us:</strong><br />
            For support or general inquiries, please email us at:<br />
            <a href="mailto:support@pairfit.in" className={styles.highlight}>support@pairfit.in</a>
          </p>

          <p className={styles.paragraph}>
            Whether you&apos;re experiencing a technical issue, have a suggestion for a new quiz, 
            or want to share your success story, our team is here to help.
          </p>

          <p className={styles.footer_text}>
            We usually respond within 24-48 hours. Thank you for being part of the Pairfit community! 💛
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
