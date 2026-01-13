"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/app/context/NotificationContext';
import AuthModal from './AuthModal';
import styles from './Navbar.module.css';

interface NavbarProps {
  isAuthenticated?: boolean;
}

const Navbar: React.FC<NavbarProps> = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showAlert, showConfirm } = useNotification();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openLogin = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase?.auth?.signOut();
    setShowDropdown(false);
    router.push('/');
  };


  // Get user's initials for avatar
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          Pairfit
        </Link>
        
        <div className={styles.navLinks}>
          {hasMounted && (
            loading ? (
              <div className={styles.profileIcon}>...</div>
            ) : user ? (
              <>
                <Link href="/about" className={styles.navLink}>About</Link>
                <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  <div 
                    className={styles.profileIcon}
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{ cursor: 'pointer' }}
                  >
                    {getInitials()}
                  </div>
                  {showDropdown && (
                    <div className={styles.dropdown}>
                      <button onClick={handleLogout} className={styles.dropdownItem}>
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/about" className={styles.navLink}>About</Link>
                <button onClick={openLogin} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  Login
                </button>
              </>
            )
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialTab={authModalTab}
      />
    </>
  );
};

export default Navbar;
