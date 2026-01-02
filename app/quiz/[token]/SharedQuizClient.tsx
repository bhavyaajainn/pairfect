"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import styles from './page.module.css';
import ComparisonView from '@/app/components/ComparisonView';
import { validateQuizLink, submitSharedResponse, getUserQuizResponse } from '@/lib/quizService';
import { useNotification } from '@/app/context/NotificationContext';

// Import quiz components
import PartnerPreferencesQuiz from '../partner-preferences/page';
import LifePrioritiesQuiz from '../life-priorities/page';
import EmotionalCompatibilityQuiz from '../emotional-compatibility/page';
import ConflictCommunicationQuiz from '../conflict-communication/page';
import ResponsibilityReliabilityQuiz from '../responsibility-reliability/page';
import { CloudCog } from 'lucide-react';

const QuizComponents: Record<string, any> = {
  'partner_preferences': PartnerPreferencesQuiz,
  'life_priorities': LifePrioritiesQuiz,
  'emotional_compatibility': EmotionalCompatibilityQuiz,
  'conflict_communication': ConflictCommunicationQuiz,
  'responsibility_reliability': ResponsibilityReliabilityQuiz,
};

export default function SharedQuizClient({ token }: { token: string }) {
  const router = useRouter();
  const { showAlert } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [respondentAnswers, setRespondentAnswers] = useState<any>(null);
  const [creatorAnswers, setCreatorAnswers] = useState<any>(null);
  
  // Debug states
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const addLog = (msg: string) => {
    console.log(msg);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addLog(`SharedQuizClient: Mounted with token: "${token}"`);
    
    // Auto-show debug if loading takes too long
    const debugTimer = setTimeout(() => {
      if (loading) {
        addLog('Debug: Loading is taking longer than expected. Showing diagnostic info.');
        setShowDebug(true);
      }
    }, 5000);

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    addLog(`Debug: Supabase URL exists: ${!!supabaseUrl}`);
    addLog(`Debug: Supabase Key exists: ${!!supabaseAnonKey}`);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      addLog('Error: Missing Supabase environment variables');
      setError('Connection configuration is missing. Please check Vercel environment variables.');
      setLoading(false);
      return;
    }

    async function checkLink() {
      addLog('SharedQuizClient: Starting link validation...');
      try {
        const result = await validateQuizLink(token);
        addLog(`SharedQuizClient: Validation result received: ${JSON.stringify(result).substring(0, 100)}...`);
        
        if (result.valid) {
          setLinkData(result.data);
        } else if (result.alreadySubmitted) {
          setLinkData(result.data);
          setCompleted(true);
          setRespondentAnswers(result.respondentAnswers);
          
          if (result.creatorId) {
            addLog('SharedQuizClient: Fetching creator answers...');
            const creatorResp = await getUserQuizResponse(result.creatorId, result.data.quiz_id);
            if (creatorResp) {
              setCreatorAnswers(creatorResp.answers);
            }
          }
        } else {
          addLog(`SharedQuizClient: Validation failed with error: ${result.error}`);
          setError(result.error || 'Invalid link');
        }
      } catch (err: any) {
        addLog(`SharedQuizClient: Unexpected error: ${err.message || 'Unknown error'}`);
        console.error('SharedQuizClient: Unexpected error during validation:', err);
        setError('Failed to validate link due to an internal error.');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      checkLink();
    } else {
      addLog('Warning: No token provided');
      setLoading(false);
      setError('No link token found.');
    }

    return () => clearTimeout(debugTimer);
  }, [token]);

  const handleQuizComplete = async (answers: any) => {
    try {
      const check = await validateQuizLink(token);
      if (!check.valid && check.alreadySubmitted) {
        setCompleted(true);
        setRespondentAnswers(check.respondentAnswers);
        return;
      }
      
      await submitSharedResponse(token, linkData.respondent_name, answers);
      setRespondentAnswers(answers);
      
      const creatorResp = await getUserQuizResponse(linkData.created_by, linkData.quiz_id);
      if (creatorResp) {
        setCreatorAnswers(creatorResp.answers);
      }
      
      setCompleted(true);
    } catch (err: any) {
      if (err.message?.includes('already been submitted')) {
        setCompleted(true);
      } else {
        console.error('Error saving response:', err);
        showAlert('Error', 'We couldn\'t save your response. Please try again.');
      }
    }
  };

  // Helper to render debug overlay
  const renderDebug = () => (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      background: 'rgba(0,0,0,0.8)', 
      color: '#0f0', 
      padding: '10px', 
      fontSize: '10px', 
      maxHeight: '150px', 
      overflowY: 'auto',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>Diagnostic Logs:</strong>
        <button onClick={() => setShowDebug(false)} style={{ background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
      </div>
      {debugInfo.map((log, i) => <div key={i}>{log}</div>)}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <p>Validating your link...</p>
          {showDebug && <p style={{ fontSize: '10px', color: '#666', marginTop: '10px' }}>Connection: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'}</p>}
        </div>
        {showDebug && renderDebug()}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h1 className={styles.errorTitle}>Link Invalid</h1>
          <p className={styles.errorText}>{error}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button onClick={() => router.push('/')}>Go Home</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
          {showDebug && <div style={{ marginTop: '20px', textAlign: 'left' }}>{renderDebug()}</div>}
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <h1 className={styles.successTitle}>Quiz Completed!</h1>
          <p className={styles.successText}>
            Thank you, {linkData?.respondent_name || 'there'}! Here is how your responses compare with the creator.
          </p>
          
          {creatorAnswers && respondentAnswers ? (
            <div className={styles.comparisonWrapper}>
              <ComparisonView 
                quizId={linkData.quiz_id}
                creatorAnswers={creatorAnswers}
                respondentAnswers={respondentAnswers}
                respondentName={linkData.respondent_name}
                respondentLabel="You"
              />
            </div>
          ) : (
            <p className={styles.loadingText}>Loading comparison...</p>
          )}
          
          <div className={styles.actions}>
            <Button onClick={() => router.push('/')}>Create Your Own Quiz</Button>
          </div>
        </div>
      </div>
    );
  }

  const quizProps = {
    isShared: true,
    onComplete: handleQuizComplete,
    respondentName: linkData.respondent_name
  };

  const normalizedQuizId = (linkData.quiz_id || '').replace(/-/g, '_');
  const SelectedQuiz = QuizComponents[normalizedQuizId];

  if (!SelectedQuiz) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h1 className={styles.errorTitle}>Error</h1>
          <p className={styles.errorText}>Unknown quiz type: {linkData.quiz_id}</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SelectedQuiz {...quizProps} />
      {showDebug && renderDebug()}
    </>
  );
}
