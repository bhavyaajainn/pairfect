"use client";

import React, { useState } from 'react';
import Button from './Button';
import { supabase } from '@/lib/supabase';
import styles from '../auth.module.css';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase) {
      setError('Connection to database failed. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Handle session persistence based on keepLoggedIn
      if (!keepLoggedIn) {
        // Set session to expire when browser closes
        await supabase.auth.updateUser({
          data: { session_type: 'temporary' }
        });
      }

      // Redirect to dashboard on success
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setError('Connection to database failed. Please try again later.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard} style={{ boxShadow: 'none', padding: 0 }}>
      <h2 className={styles.title} style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Welcome Back!</h2>
      
      {error && (
        <div style={{ 
          padding: '0.75rem', 
          marginBottom: '1rem', 
          backgroundColor: '#fee', 
          color: '#c33', 
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleEmailLogin}>
        <div className={styles.inputGroup}>
          <label htmlFor="login-email" className={styles.label}>Email</label>
          <input 
            type="email" 
            id="login-email" 
            className={styles.input} 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="login-password" className={styles.label}>Password</label>
          <input 
            type="password" 
            id="login-password" 
            className={styles.input} 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <Button fullWidth className="mt-4" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className={styles.divider}>Or</div>
      
      <Button variant="blue" fullWidth onClick={handleGoogleLogin} disabled={loading}>
        <span className={styles.googleIcon}>G</span> Sign in with Google
      </Button>

      <div className={styles.checkboxGroup} style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        <input 
          type="checkbox" 
          id="keep-logged-in" 
          checked={keepLoggedIn}
          onChange={(e) => setKeepLoggedIn(e.target.checked)}
          style={{ marginRight: '0.5rem' }}
          disabled={loading}
        />
        <label htmlFor="keep-logged-in" style={{ fontSize: '0.875rem', color: 'var(--dark-text)', cursor: 'pointer' }}>
          Keep me logged in
        </label>
      </div>
      
      <div className={styles.footerLink}>
        Don't have an account? 
        <button 
          onClick={onSwitchToSignup} 
          className={styles.link} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
          disabled={loading}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
