import React, { useEffect, useMemo, useState } from 'react';
import { leadsService } from '../../services/leads/leadsService';
import { Lead } from '../../services/types/lead.types';
import './RoleDashboardPage.css';

interface RoleDashboardPageProps {
  role: 'DSA' | 'AGENT';
  title: string;
}

const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const RoleDashboardPage: React.FC<RoleDashboardPageProps> = ({ role, title }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await leadsService.getAllLeads(role);
        setLeads(data);
      } catch (error) {
        console.error('Failed to load role dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [role]);

  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((lead) => lead.status === 'NEW').length;
    const convertedLeads = leads.filter((lead) => lead.status === 'CONVERTED').length;
    const qualifiedLeads = leads.filter((lead) => lead.status === 'QUALIFIED').length;
    const loggedInLeads = leads.filter((lead) => lead.status === 'LOGGED_IN').length;
    const totalValue = leads.reduce((sum, lead) => sum + lead.loanAmount, 0);
    const conversionRatio = totalLeads === 0 ? 0 : (convertedLeads / totalLeads) * 100;

    return { totalLeads, newLeads, convertedLeads, qualifiedLeads, loggedInLeads, totalValue, conversionRatio };
  }, [leads]);

  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [leads]);

  const productMix = useMemo(() => {
    const total = leads.length || 1;
    const map = leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.loanType] = (acc[lead.loanType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(map)
      .map(([loanType, count]) => ({
        loanType,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  if (loading) {
    return (
      <div className="role-dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="role-dashboard">
      <div className="role-dashboard-header">
        <h1>{title}</h1>
        <p>Track your lead portfolio and conversion performance</p>
      </div>

      <div className="role-metric-grid">
        <div className="role-metric-card">
          <span className="role-metric-label">Total Leads</span>
          <span className="role-metric-value">{metrics.totalLeads}</span>
        </div>
        <div className="role-metric-card">
          <span className="role-metric-label">New Leads</span>
          <span className="role-metric-value">{metrics.newLeads}</span>
        </div>
        <div className="role-metric-card">
          <span className="role-metric-label">Qualified</span>
          <span className="role-metric-value">{metrics.qualifiedLeads}</span>
        </div>
        <div className="role-metric-card">
          <span className="role-metric-label">Logged In</span>
          <span className="role-metric-value">{metrics.loggedInLeads}</span>
        </div>
        <div className="role-metric-card">
          <span className="role-metric-label">Converted</span>
          <span className="role-metric-value">{metrics.convertedLeads}</span>
        </div>
        <div className="role-metric-card">
          <span className="role-metric-label">Pipeline Value</span>
          <span className="role-metric-value">{formatCurrency(metrics.totalValue)}</span>
        </div>
        <div className="role-metric-card">
          <span className="role-metric-label">Conversion Ratio</span>
          <span className="role-metric-value">{metrics.conversionRatio.toFixed(1)}%</span>
        </div>
      </div>

      <div className="role-recent-panel">
        <h3>Loan Product Mix</h3>
        {productMix.length === 0 ? (
          <p className="role-empty-text">No lead activity yet.</p>
        ) : (
          <div className="role-mix-list">
            {productMix.map((item) => (
              <div key={item.loanType} className="role-mix-row">
                <span>{item.loanType}</span>
                <div className="role-mix-bar">
                  <div className="role-mix-fill" style={{ width: `${item.percentage}%` }} />
                </div>
                <strong>{item.percentage}%</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="role-recent-panel">
        <h3>Recent Lead Updates</h3>
        {recentLeads.length === 0 ? (
          <p className="role-empty-text">No lead activity yet.</p>
        ) : (
          <div className="role-recent-list">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="role-recent-item">
                <div>
                  <strong>{lead.customerName}</strong>
                  <p>{lead.leadId} · {lead.loanType} · {formatCurrency(lead.loanAmount)}</p>
                </div>
                <span className={`role-status role-status-${lead.status.toLowerCase()}`}>{lead.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleDashboardPage;
