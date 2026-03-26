import React, { useEffect, useMemo, useState } from 'react';
import KPICard from '../../components/dashboard/KPICard';
import ActivityItem from '../../components/dashboard/ActivityItem';
import { leadsService } from '../../services/leads/leadsService';
import { applicationsService } from '../../services/applications/applicationsService';
import { commissionService } from '../../services/commissions/commissionService';
import { Lead } from '../../services/types/lead.types';
import { LoanApplication } from '../../services/types/application.types';
import { CommissionRecord } from '../../services/types/commission.types';
import './AdminDashboardPage.css';

const AdminDashboardPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      await commissionService.syncCommissionRecords();
      const [allLeads, allApplications, allCommissions] = await Promise.all([
        leadsService.getAllLeads('ADMIN'),
        applicationsService.getAllApplications(),
        commissionService.getCommissionRecords(),
      ]);
      setLeads(allLeads);
      setApplications(allApplications);
      setCommissions(allCommissions);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpis = useMemo(() => {
    const totalLeads = leads.length;
    const totalApplications = applications.length;
    const conversion = totalLeads === 0 ? 0 : (totalApplications / totalLeads) * 100;
    const docsVerified = applications.filter((app) => app.status === 'DOCS_VERIFIED').length;
    const totalDisbursed = commissions.reduce((sum, item) => sum + item.disbursedAmount, 0);

    return [
      {
        label: 'Total Leads',
        value: totalLeads.toLocaleString(),
        change: `${conversion.toFixed(1)}% Conv.`,
        changeType: 'increase' as const,
        icon: '📋',
      },
      {
        label: 'Applications',
        value: totalApplications.toLocaleString(),
        change: `${docsVerified} Verified`,
        changeType: 'increase' as const,
        icon: '📄',
      },
      {
        label: 'Docs Verified',
        value: docsVerified.toLocaleString(),
        change: `${(totalApplications ? (docsVerified / totalApplications) * 100 : 0).toFixed(1)}%`,
        changeType: 'increase' as const,
        icon: '✅',
      },
      {
        label: 'Disbursed Volume',
        value: `₹${totalDisbursed.toLocaleString('en-IN')}`,
        change: `${commissions.length} Payout Rows`,
        changeType: 'increase' as const,
        icon: '💰',
      },
    ];
  }, [leads, applications, commissions]);

  const funnel = useMemo(() => {
    const totalLeads = leads.length || 1;
    const count = {
      lead: leads.length,
      contacted: leads.filter((lead) => lead.status === 'CONTACTED').length,
      qualified: leads.filter((lead) => lead.status === 'QUALIFIED').length,
      loggedIn: leads.filter((lead) => lead.status === 'LOGGED_IN').length,
      docsVerified: applications.filter((app) => app.status === 'DOCS_VERIFIED').length,
      disbursed: commissions.length,
    };
    return [
      { stage: 'Leads Generated', count: count.lead, percentage: 100 },
      { stage: 'Contacted', count: count.contacted, percentage: Math.round((count.contacted / totalLeads) * 100) },
      { stage: 'Qualified', count: count.qualified, percentage: Math.round((count.qualified / totalLeads) * 100) },
      { stage: 'Logged In', count: count.loggedIn, percentage: Math.round((count.loggedIn / totalLeads) * 100) },
      {
        stage: 'Docs Verified',
        count: count.docsVerified,
        percentage: Math.round((count.docsVerified / totalLeads) * 100),
      },
      { stage: 'Disbursed', count: count.disbursed, percentage: Math.round((count.disbursed / totalLeads) * 100) },
    ];
  }, [leads, applications, commissions]);

  const productSplit = useMemo(() => {
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

  const recentActivity = useMemo(() => {
    const leadEvents = leads.map((lead) => ({
      id: `lead_${lead.id}`,
      type: 'LEAD' as const,
      title: `Lead ${lead.status.replace('_', ' ')}`,
      description: `${lead.customerName} · ${lead.loanType} · ₹${lead.loanAmount.toLocaleString('en-IN')}`,
      time: new Date(lead.updatedAt).toLocaleString('en-IN'),
      status:
        lead.status === 'NEW'
          ? ('NEW' as const)
          : lead.status === 'REJECTED'
            ? ('COMPLETED' as const)
            : ('IN_PROGRESS' as const),
      sortDate: lead.updatedAt,
    }));

    const appEvents = applications.map((app) => ({
      id: `app_${app.id}`,
      type: 'APPLICATION' as const,
      title: `Application ${app.status.replace('_', ' ')}`,
      description: `${app.customerName} · ${app.applicationNo} · ₹${app.requestedAmount.toLocaleString('en-IN')}`,
      time: new Date(app.updatedAt).toLocaleString('en-IN'),
      status: app.status === 'DOCS_VERIFIED' ? ('COMPLETED' as const) : ('IN_PROGRESS' as const),
      sortDate: app.updatedAt,
    }));

    const payoutEvents = commissions.map((item) => ({
      id: `com_${item.id}`,
      type: 'DISBURSEMENT' as const,
      title: `Commission ${item.payoutStatus}`,
      description: `${item.customerName} · ${item.applicationNo} · ₹${item.commissionAmount.toLocaleString('en-IN')}`,
      time: new Date(item.payoutDate || item.createdAt).toLocaleString('en-IN'),
      status: item.payoutStatus === 'PAID' ? ('COMPLETED' as const) : ('IN_PROGRESS' as const),
      sortDate: item.payoutDate || item.createdAt,
    }));

    return [...leadEvents, ...appEvents, ...payoutEvents]
      .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
      .slice(0, 8);
  }, [leads, applications, commissions]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Advanced Dashboard</h1>
          <p className="dashboard-subtitle">
            Live pipeline, payouts, and role performance insights
          </p>
        </div>
        <button className="btn-export" onClick={loadDashboard}>Refresh</button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map(kpi => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Funnel & Activity Grid */}
      <div className="content-grid">
        {/* Lead Funnel */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Pipeline Funnel</h3>
            <p className="panel-subtitle">End-to-end lead to disbursement progression</p>
          </div>
          <div className="funnel-container">
            {funnel.map((stage, index) => (
              <div key={stage.stage} className="funnel-stage">
                <div className="funnel-stage-label">
                  <span className="funnel-stage-name">{stage.stage}</span>
                  <span className="funnel-stage-count">{stage.count.toLocaleString()}</span>
                </div>
                <div className="funnel-bar-wrapper">
                  <div
                    className="funnel-bar"
                    style={{
                      width: `${stage.percentage}%`,
                      background: `linear-gradient(90deg, #4f46e5, #7c3aed ${100 - index * 15}%)`,
                    }}
                  />
                </div>
                <span className="funnel-percentage">{stage.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Activity</h3>
            <p className="panel-subtitle">Leads, applications, and payouts</p>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Product Mix</h3>
          <p className="panel-subtitle">Loan type distribution across active leads</p>
        </div>
        <div className="funnel-container">
          {productSplit.map((item, index) => (
            <div key={item.loanType} className="funnel-stage">
              <div className="funnel-stage-label">
                <span className="funnel-stage-name">{item.loanType}</span>
                <span className="funnel-stage-count">{item.count.toLocaleString()}</span>
              </div>
              <div className="funnel-bar-wrapper">
                <div
                  className="funnel-bar"
                  style={{
                    width: `${item.percentage}%`,
                    background: `linear-gradient(90deg, #0ea5e9, #6366f1 ${100 - index * 10}%)`,
                  }}
                />
              </div>
              <span className="funnel-percentage">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
