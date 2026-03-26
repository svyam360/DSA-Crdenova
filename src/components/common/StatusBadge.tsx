import React from 'react';
import './StatusBadge.css';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, children }) => {
  return <span className={`status-badge status-badge--${variant}`}>{children}</span>;
};

export default StatusBadge;
