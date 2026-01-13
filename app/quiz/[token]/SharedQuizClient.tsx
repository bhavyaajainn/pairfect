"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import styles from './page.module.css';
import ComparisonView from '@/app/components/ComparisonView';
import { validateQuizLink, submitSharedResponse, getUserQuizResponse } from '@/lib/quizService';
import { useNotification } from '@/app/context/NotificationContext';

// Import quiz components
// Import quiz components
import PartnerPreferencesClient from '../partner-preferences/PartnerPreferencesClient';
import LifePrioritiesClient from '../life-priorities/LifePrioritiesClient';
import EmotionalCompatibilityClient from '../emotional-compatibility/EmotionalCompatibilityClient';
import ConflictCommunicationClient from '../conflict-communication/ConflictCommunicationClient';
import ResponsibilityReliabilityClient from '../responsibility-reliability/ResponsibilityReliabilityClient';

const QuizComponents: Record<string, any> = {
  'partner_preferences': PartnerPreferencesClient,
  'life_priorities': LifePrioritiesClient,
  'emotional_compatibility': EmotionalCompatibilityClient,
  'conflict_communication': ConflictCommunicationClient,
  'responsibility_reliability': ResponsibilityReliabilityClient,
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

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Connection configuration is missing. Please check Vercel environment variables.');
      setLoading(false);
      return;
    }

    async function checkLink() {
      try {
        const result = await validateQuizLink(token);
        
        if (result.valid) {
          setLinkData(result.data);
        } else if (result.alreadySubmitted) {
          setLinkData(result.data);
          setCompleted(true);
          setRespondentAnswers(result.respondentAnswers);
          
          if (result.creatorId) {
            const creatorResp = await getUserQuizResponse(result.creatorId, result.data.quiz_id);
            if (creatorResp) {
              setCreatorAnswers(creatorResp.answers);
            }
          }
        } else {
          setError(result.error || 'Invalid link');
        }
      } catch (err: any) {
        console.error('SharedQuizClient: Unexpected error during validation:', err);
        setError('Failed to validate link due to an internal error.');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      checkLink();
    } else {
      setLoading(false);
      setError('No link token found.');
    }
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <p>Validating your link...</p>
        </div>
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

  return <SelectedQuiz {...quizProps} />;
}
