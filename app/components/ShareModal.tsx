import React, { useState } from 'react';
import { X, Copy, Check, Link as LinkIcon, Share2 } from 'lucide-react';
import Button from './Button';
import styles from './AuthModal.module.css'; // Reusing some modal styles
import shareStyles from './ShareModal.module.css';
import { createQuizLink } from '@/lib/quizService';
import { useAuth } from '@/hooks/useAuth';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
  quizDescription: string;
}

export default function ShareModal({ isOpen, onClose, quizId, quizTitle, quizDescription }: ShareModalProps) {
  const { user } = useAuth();
  const [respondentName, setRespondentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setRespondentName('');
      setGeneratedLink('');
      setError('');
      setLoading(false);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!respondentName.trim()) {
      setError('Please enter a name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await createQuizLink(quizId, respondentName.trim(), user.id);
      const baseUrl = window.location.origin;
      setGeneratedLink(`${baseUrl}/quiz/${data.token}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const userName = user?.email?.split('@')[0] || 'A friend';
    const title = `Take the ${quizTitle} on Pairfit!`;
    const text = `*Quiz:* ${quizTitle}\n${quizDescription}\n\n*Invited by:* ${userName}`;
    const url = generatedLink;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to WhatsApp if share fails (e.g. user cancelled or not supported)
      }
    }

    const message = `${text}\n*Take the quiz:* ${url}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${shareStyles.shareModal}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={shareStyles.content}>
          <div className={shareStyles.header}>
            <div className={shareStyles.iconWrapper}>
              <LinkIcon size={32} className={shareStyles.icon} />
            </div>
            <h2 className={shareStyles.title}>Share "{quizTitle}"</h2>
            <p className={shareStyles.subtitle}>
              Generate a unique, one-time link to share with someone.
            </p>
          </div>

          {!generatedLink ? (
            <form onSubmit={handleGenerateLink} className={shareStyles.form}>
              <div className={shareStyles.inputGroup}>
                <label htmlFor="respondentName">Who are you sharing this with?</label>
                <input
                  id="respondentName"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={respondentName}
                  onChange={e => setRespondentName(e.target.value)}
                  className={shareStyles.input}
                  disabled={loading}
                />
                <p className={shareStyles.hint}>
                  This name must be unique for your quizzes.
                </p>
              </div>

              {error && <p className={shareStyles.error}>{error}</p>}

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Generating...' : 'Generate Link'}
              </Button>
            </form>
          ) : (
            <div className={shareStyles.success}>
              <div className={shareStyles.linkBox}>
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className={shareStyles.linkInput}
                />
                <button onClick={copyToClipboard} className={shareStyles.copyButton}>
                  {copied ? <Check size={20} color="#10b981" /> : <Copy size={20} />}
                </button>
              </div>
              <p className={shareStyles.successHint}>
                Link generated! It will expire in 24 hours and can only be used once.
              </p>
              <div className={shareStyles.actionButtons}>
                <Button onClick={handleShare} className={shareStyles.whatsappButton} fullWidth>
                  <Share2 size={20} style={{ marginRight: '8px' }} />
                  Share Link
                </Button>
                <Button variant="outline" fullWidth onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
