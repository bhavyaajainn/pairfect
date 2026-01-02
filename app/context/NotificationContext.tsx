"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationModal from '../components/NotificationModal';

type NotificationType = 'alert' | 'confirm';

interface NotificationState {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface NotificationContextType {
  showAlert: (title: string, message: string, onConfirm?: () => void) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NotificationState>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setState({
      isOpen: true,
      type: 'alert',
      title,
      message,
      onConfirm,
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    setState({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm,
      onCancel,
    });
  };

  const handleClose = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    state.onConfirm?.();
    handleClose();
  };

  const handleCancel = () => {
    state.onCancel?.();
    handleClose();
  };

  return (
    <NotificationContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <NotificationModal
        isOpen={state.isOpen}
        type={state.type}
        title={state.title}
        message={state.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
