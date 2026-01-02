import React from 'react';
import Footer from '../components/Footer';
import { PrivacyTermsContent } from '../privacy/page';
import styles from '../privacy/legal.module.css';

export default function TermsPage() {
  return (
    <div className={styles.main}>
      <PrivacyTermsContent />
      <Footer />
    </div>
  );
}
