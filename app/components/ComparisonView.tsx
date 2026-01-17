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
        {tasks.map((task: any) => {
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

  if (quizId === 'travel_planner') {
    // Helper to format currency
    const formatMoney = (amount: number) => `₹${amount.toLocaleString()}`;
    // Helper to format text
    const formatText = (text: string) => text.replace(/([A-Z])/g, ' $1').trim(); // camelCase to human readable

    const sections = [
      {
        title: 'Trip Basics',
        items: [
          { label: 'Budget', c: formatMoney(creatorAnswers.budget), r: formatMoney(respondentAnswers.budget) },
          { label: 'Duration', c: `${creatorAnswers.duration} Days`, r: `${respondentAnswers.duration} Days` },
          { label: 'Total Cost', c: formatMoney(creatorAnswers.totalCost), r: formatMoney(respondentAnswers.totalCost) },
        ]
      },
      {
        title: 'Preferences',
        items: [
          { label: 'Flight Class', c: formatText(creatorAnswers.flightClass), r: formatText(respondentAnswers.flightClass) },
          { label: 'Meal Plan', c: formatText(creatorAnswers.mealPlan), r: formatText(respondentAnswers.mealPlan) },
        ]
      }
    ];

    // Activity comparison
    console.log('ComparisonView Debug:', {
      cActivities: creatorAnswers.selectedActivities,
      rActivities: respondentAnswers.selectedActivities,
      cKeys: Object.keys(creatorAnswers)
    });

    const cActivities = new Set(creatorAnswers.selectedActivities || []);
    const rActivities = new Set(respondentAnswers.selectedActivities || []);
    const allActivities = Array.from(new Set([...cActivities, ...rActivities]));

    return (
      <div className={styles.travelComparison}>
        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          {sections.map(section => (
            <div key={section.title} className={styles.metricSection}>
              <h4 className={styles.metricTitle}>{section.title}</h4>
              {section.items.map(item => {
                const isMatch = item.c === item.r;
                return (
                  <div key={item.label} className={`${styles.metricRow} ${isMatch ? styles.matchRow : ''}`}>
                    <span className={styles.metricLabel}>{item.label}</span>
                    <div className={styles.metricValues}>
                      <div className={styles.metricValue}>
                        <span className={styles.who}>{creatorLabel}</span>
                        <span>{item.c}</span>
                      </div>
                      <div className={styles.metricValue}>
                        <span className={styles.who}>{rLabel}</span>
                        <span>{item.r}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Hotel Breakdown */}
        <div className={styles.metricSection}>
          <h4 className={styles.metricTitle}>Hotel Nights Allocation</h4>
          <div className={styles.hotelComparison}>
            {['threeStar', 'fourStar', 'fiveStar'].map(star => {
              const starLabel = star === 'threeStar' ? '3-Star' : star === 'fourStar' ? '4-Star' : '5-Star';
              const cNights = creatorAnswers.hotelNights[star] || 0;
              const rNights = respondentAnswers.hotelNights[star] || 0;
              const isMatch = cNights === rNights;

              return (
                <div key={star} className={`${styles.metricRow} ${isMatch ? styles.matchRow : ''}`}>
                  <span className={styles.metricLabel}>{starLabel}</span>
                  <div className={styles.metricValues}>
                    <div className={styles.metricValue}>
                      <span className={styles.who}>{creatorLabel}</span>
                      <span>{cNights}n</span>
                    </div>
                    <div className={styles.metricValue}>
                      <span className={styles.who}>{rLabel}</span>
                      <span>{rNights}n</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activities */}
        <div className={styles.metricSection}>
          <h4 className={styles.metricTitle}>Proposed Activities</h4>
          <div className={styles.activitiesList}>
            {allActivities.map((act: any) => {
              const cSelected = cActivities.has(act);
              const rSelected = rActivities.has(act);
              const isMatch = cSelected && rSelected;
              
              if (!cSelected && !rSelected) return null;

              return (
                <div key={act} className={`${styles.activityRow} ${isMatch ? styles.match : ''}`}>
                  <span className={styles.activityName}>{act}</span>
                  <div className={styles.activityStatus}>
                     {cSelected && <span className={styles.personBadge}>{creatorLabel}</span>}
                     {rSelected && <span className={styles.personBadge}>{rLabel}</span>}
                     {isMatch && <Check size={16} className={styles.matchIcon} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
