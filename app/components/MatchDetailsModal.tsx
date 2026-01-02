import React from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import Button from './Button';
import styles from './MatchDetailsModal.module.css';
import { QUIZ_DATA } from '@/lib/quizData';

import ComparisonView from './ComparisonView';

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  creatorAnswers: any;
}

export default function MatchDetailsModal({ isOpen, onClose, match, creatorAnswers }: MatchDetailsModalProps) {
  if (!isOpen || !match) return null;

  const quizId = match.quiz_id;
  const respondentAnswers = match.answers;
  const respondentName = match.respondent_name;

  const renderComparison = () => {
    return (
      <ComparisonView 
        quizId={quizId}
        creatorAnswers={creatorAnswers}
        respondentAnswers={respondentAnswers}
        respondentName={respondentName}
        creatorLabel="You"
      />
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>Compatibility Details</h2>
            <p className={styles.subtitle}>Comparing your responses with {respondentName}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.scoreInfo}>
            <span className={styles.scoreLabel}>Overall Match</span>
            <span className={styles.scoreValue}>{match.match_percentage}%</span>
          </div>
          <div className={styles.progressBarWrapper}>
            <div 
              className={styles.progressBar} 
              style={{ 
                width: `${match.match_percentage}%`,
                backgroundColor: match.match_percentage >= 90 ? '#10b981' : match.match_percentage >= 60 ? '#f59e0b' : '#ef4444'
              }} 
            />
          </div>
        </div>

        <div className={styles.content}>
          {renderComparison()}
        </div>

        <div className={styles.footer}>
          <Button onClick={onClose}>Close Details</Button>
        </div>
      </div>
    </div>
  );
}
