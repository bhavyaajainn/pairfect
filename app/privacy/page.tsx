import React from 'react';
import type { Metadata } from 'next';
import Footer from '../components/Footer';
import styles from './legal.module.css';

export const metadata: Metadata = {
  title: "Privacy & Terms",
  description: "Understand how Pairfit handles your data and our terms of service. We prioritize your privacy and transparency.",
};

const PrivacyTermsContent = () => (
  <main className={styles.content}>
    <header className={styles.header}>
      <h1 className={styles.title}>Privacy & Terms</h1>
    </header>

    <section className={styles.section}>
      <p className={styles.paragraph}>
        At Pairfit, your privacy is important to us. We are committed to keeping your information safe, minimal, and transparent.
      </p>

      <p className={styles.paragraph}>
        Pairfit collects only what is necessary to provide a meaningful experience. We may collect:
      </p>
      
      <ul className={styles.paragraph}>
        <li>Email addresses (for account access and identification)</li>
        <li>Quiz responses submitted by users</li>
      </ul>

      <p className={styles.paragraph}>
        We do not collect sensitive or personal information such as passwords in plain text, financial details, government IDs, phone numbers, or private messages. Quiz responses are used only to calculate compatibility and improve the Pairfit experience.
      </p>

      <p className={styles.paragraph}>
        All data is securely stored and protected using modern security practices. Responses are visible only to the intended participants and are never sold, shared, or distributed to third parties.
      </p>

      <p className={styles.paragraph}>
        Pairfit quizzes are designed for insight and connection, not judgment. Participation is voluntary, and users remain in control of what they choose to share. Public quiz links are time-limited and can be used only as intended.
      </p>

      <p className={styles.paragraph}>
        By using Pairfit, you agree to use the platform responsibly and respectfully. Any misuse of the service, attempts to exploit the system, or violation of intended usage may result in restricted access.
      </p>

      <p className={styles.paragraph}>
        Pairfit exists to build trust, encourage honest connection, and keep things simple. If you ever have questions about privacy or data usage, transparency is our promise.
      </p>

      <p className={styles.footer_note}>
        Your trust matters to us, and we work hard to keep Pairfit safe, respectful, and meaningful.
      </p>
    </section>
  </main>
);

export default function PrivacyPage() {
  return (
    <div className={styles.main}>
      <PrivacyTermsContent />
      <Footer />
    </div>
  );
}

export { PrivacyTermsContent };
