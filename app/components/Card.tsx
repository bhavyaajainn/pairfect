import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderOnHover?: boolean;
  centered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  borderOnHover = false,
  centered = false,
}) => {
  const classes = [
    styles.card,
    hoverEffect ? styles.hoverEffect : '',
    borderOnHover ? styles.borderOnHover : '',
    centered ? styles.centered : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
