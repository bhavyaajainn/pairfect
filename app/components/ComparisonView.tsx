import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { QUIZ_DATA } from '@/lib/quizData';
import styles from './ComparisonView.module.css';

interface ComparisonViewProps {
  quizId: string;
  creatorAnswers: any;
  respondentAnswers: any;
  respondentName: string;
  creatorLabel?: string;
  respondentLabel?: string;
}

export default function ComparisonView({ 
  quizId, 
  creatorAnswers, 
  respondentAnswers, 
  respondentName,
  creatorLabel = "Creator",
  respondentLabel
}: ComparisonViewProps) {
  const rLabel = respondentLabel || respondentName;

  if (quizId === 'life_priorities') {
    return (
      <div className={styles.comparisonGrid}>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>{creatorLabel}'s Ranking</h4>
          <div className={styles.rankingList}>
            {creatorAnswers.map((item: any, index: number) => (
              <div key={item.id} className={styles.rankingItem}>
                <span className={styles.rank}>{index + 1}</span>
                <span className={styles.text}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>{rLabel}'s Ranking</h4>
          <div className={styles.rankingList}>
            {respondentAnswers.map((item: any, index: number) => {
              const isMatch = creatorAnswers[index]?.id === item.id;
              return (
                <div key={item.id} className={`${styles.rankingItem} ${isMatch ? styles.match : ''}`}>
                  <span className={styles.rank}>{index + 1}</span>
                  <span className={styles.text}>{item.text}</span>
                  {isMatch && <Check size={14} className={styles.matchIcon} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (quizId === 'responsibility_reliability') {
    const creatorSet = new Set(creatorAnswers);
    const respondentSet = new Set(respondentAnswers);
    const tasks = QUIZ_DATA.responsibility_reliability;

    return (
      <div className={styles.taskGrid}>
        {tasks.map(task => {
          const creatorPicked = creatorSet.has(task.id);
          const respondentPicked = respondentSet.has(task.id);
          const isMatch = creatorPicked === respondentPicked;

          return (
            <div key={task.id} className={`${styles.taskItem} ${isMatch ? styles.match : ''}`}>
              <span className={styles.taskText}>{task.title}</span>
              <div className={styles.taskStatus}>
                <div className={styles.statusLabel}>
                  <span>{creatorLabel}:</span>
                  {creatorPicked ? <Check size={14} className={styles.yes} /> : <X size={14} className={styles.no} />}
                </div>
                <div className={styles.statusLabel}>
                  <span>{rLabel}:</span>
                  {respondentPicked ? <Check size={14} className={styles.yes} /> : <X size={14} className={styles.no} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default for key-value quizzes (Emotional, Conflict, Partner Preferences)
  const questions = (QUIZ_DATA as any)[quizId] || [];
  
  // Normalize creator answers for partner_preferences if it's an array
  let normalizedCreatorAnswers = creatorAnswers;
  if (quizId === 'partner_preferences' && Array.isArray(creatorAnswers)) {
    normalizedCreatorAnswers = {};
    creatorAnswers.forEach((ans: any, idx: number) => {
      const q = questions.find((q: any) => q.category === ans.category) || questions[idx];
      if (q) normalizedCreatorAnswers[q.id] = ans.choice;
    });
  }

  return (
    <div className={styles.qaList}>
      {questions.map((q: any, index: number) => {
        const creatorVal = normalizedCreatorAnswers[q.id];
        const respondentVal = respondentAnswers[q.id];
        const isMatch = creatorVal === respondentVal;

        const creatorOptionText = q.options?.find((o: any) => o.label === creatorVal)?.text || creatorVal;
        const respondentOptionText = q.options?.find((o: any) => o.label === respondentVal)?.text || respondentVal;

        return (
          <div key={q.id} className={`${styles.qaItem} ${isMatch ? styles.match : ''}`}>
            <div className={styles.questionHeader}>
              <span className={styles.qNumber}>Question {index + 1}: {q.title || q.category}</span>
              {isMatch ? (
                <span className={styles.matchBadge}><Check size={12} /> Match</span>
              ) : (
                <span className={styles.mismatchBadge}><AlertCircle size={12} /> Different</span>
              )}
            </div>
            <div className={styles.answersRow}>
              <div className={styles.answerBox}>
                <span className={styles.label}>{creatorLabel}</span>
                <span className={styles.value}>{creatorOptionText}</span>
              </div>
              <div className={styles.answerBox}>
                <span className={styles.label}>{rLabel}</span>
                <span className={styles.value}>{respondentOptionText}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
