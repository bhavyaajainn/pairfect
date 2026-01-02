import React, { useState } from 'react';
import { X, Copy, Check, Link as LinkIcon } from 'lucide-react';
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

  const shareToWhatsApp = () => {
    const userName = user?.email?.split('@')[0] || 'A friend';
    const message = `*Quiz:* ${quizTitle}\n${quizDescription}\n\n*Invited by:* ${userName}\n*Take the quiz:* ${generatedLink}`;
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
                <Button onClick={shareToWhatsApp} className={shareStyles.whatsappButton} fullWidth>
                  <svg 
                    viewBox="0 0 24 24" 
                    className={shareStyles.whatsappIcon}
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Share to WhatsApp
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
