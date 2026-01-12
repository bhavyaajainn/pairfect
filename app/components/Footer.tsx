import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link href="/about" className={styles.link}>About</Link>
        <Link href="/privacy" className={styles.link}>Privacy & Terms</Link>
      </div>
      <div className={styles.copyright} suppressHydrationWarning>
        © {new Date().getFullYear()} Pairfit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
