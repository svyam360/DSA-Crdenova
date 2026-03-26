import React from 'react';
import './KPICard.css';

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, change, changeType, icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <span className={`kpi-change kpi-change--${changeType}`}>{change}</span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
};

export default KPICard;
