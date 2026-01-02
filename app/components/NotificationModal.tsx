"use client";

import React, { useEffect } from 'react';
import { X, AlertCircle, HelpCircle, CheckCircle } from 'lucide-react';
import Button from './Button';
import styles from './NotificationModal.module.css';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'alert':
        return <AlertCircle className={styles.alertIcon} size={48} />;
      case 'confirm':
        return <HelpCircle className={styles.confirmIcon} size={48} />;
      default:
        return <CheckCircle className={styles.successIcon} size={48} />;
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onCancel}>
          <X size={20} />
        </button>
        
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            {getIcon()}
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.footer}>
          {type === 'confirm' && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={onConfirm}>
            {type === 'confirm' ? 'Confirm' : 'OK'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
