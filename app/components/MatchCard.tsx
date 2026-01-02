import { User, ClipboardList, TrendingUp, Trash2 } from 'lucide-react';
import Button from './Button';
import styles from './MatchCard.module.css';

interface MatchCardProps {
  id: string;
  respondentName: string;
  quizTitle: string;
  matchPercentage: number;
  date: string;
  answers?: any;
  onView?: () => void;
  onDelete?: (id: string) => void;
}

export default function MatchCard({ id, respondentName, quizTitle, matchPercentage, date, answers, onView, onDelete }: MatchCardProps) {
  const isPending = !answers || Object.keys(answers).length === 0;

  const getPercentageColor = (percent: number) => {
    if (isPending) return styles.gray;
    if (percent >= 90) return styles.green;
    if (percent >= 60) return styles.yellow;
    return styles.red;
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Normalize quiz title (convert snake_case to Title Case if needed)
  const displayTitle = quizTitle.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={18} />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{respondentName}</h3>
          <p className={styles.date}>{formattedDate}</p>
        </div>
      </div>

      <div className={styles.details}>
        <ClipboardList size={16} className={styles.icon} />
        <span>{displayTitle}</span>
      </div>

      <div className={styles.scoreWrapper}>
        <div className={`${styles.badge} ${getPercentageColor(matchPercentage)}`}>
          {isPending ? 'Pending' : `${matchPercentage}% Match`}
        </div>
        <div className={styles.progressBarWrapper}>
          <div 
            className={`${styles.progressBar} ${getPercentageColor(matchPercentage)}`} 
            style={{ width: isPending ? '0%' : `${matchPercentage}%` }}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onView}
          disabled={isPending}
        >
          View
        </Button>
        <button 
          className={styles.deleteButton}
          onClick={() => onDelete?.(id)}
          title="Delete match"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
