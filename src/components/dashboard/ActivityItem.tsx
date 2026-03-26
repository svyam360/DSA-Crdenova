import React from 'react';
import './ActivityItem.css';

interface ActivityItemProps {
  type: 'LEAD' | 'APPLICATION' | 'APPROVAL' | 'DISBURSEMENT';
  title: string;
  description: string;
  time: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
}

const ACTIVITY_ICONS = {
  LEAD: '📝',
  APPLICATION: '📄',
  APPROVAL: '✅',
  DISBURSEMENT: '💸',
};

const STATUS_COLORS = {
  NEW: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  COMPLETED: '#10b981',
};

const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  title,
  description,
  time,
  status,
}) => {
  return (
    <div className="activity-item">
      <div className="activity-icon" style={{ background: `${STATUS_COLORS[status]}20` }}>
        {ACTIVITY_ICONS[type]}
      </div>
      <div className="activity-content">
        <div className="activity-title">{title}</div>
        <div className="activity-description">{description}</div>
      </div>
      <div className="activity-time">{time}</div>
    </div>
  );
};

export default ActivityItem;
