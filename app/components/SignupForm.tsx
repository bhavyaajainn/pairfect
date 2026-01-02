"use client";

import React, { useState } from 'react';
import Button from './Button';
import { supabase } from '@/lib/supabase';
import styles from '../auth.module.css';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;

      setSuccess('Account created! Please check your email to verify your account.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard} style={{ boxShadow: 'none', padding: 0 }}>
      <h2 className={styles.title} style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Create Account</h2>
      
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

      {success && (
        <div style={{ 
          padding: '0.75rem', 
          marginBottom: '1rem', 
          backgroundColor: '#efe', 
          color: '#363', 
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {success}
        </div>
      )}
      
      <form className={styles.form} onSubmit={handleSignup}>
        <div className={styles.inputGroup}>
          <label htmlFor="signup-email" className={styles.label}>Email</label>
          <input 
            type="email" 
            id="signup-email" 
            className={styles.input} 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="signup-password" className={styles.label}>Password</label>
          <input 
            type="password" 
            id="signup-password" 
            className={styles.input} 
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="signup-confirm-password" className={styles.label}>Confirm Password</label>
          <input 
            type="password" 
            id="signup-confirm-password" 
            className={styles.input} 
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <Button fullWidth className="mt-4" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      
      <div className={styles.footerLink}>
        Already have an account? 
        <button 
          onClick={onSwitchToLogin} 
          className={styles.link}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
          disabled={loading}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
