import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import { applicationsService } from '../../services/applications/applicationsService';
import { leadsService } from '../../services/leads/leadsService';
import { LoanApplication } from '../../services/types/application.types';
import { Lead } from '../../services/types/lead.types';
import './PhaseOnePages.css';

const exportCsv = (name: string, headers: string[], rows: string[][]) => {
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

interface ReportsPageProps {
  roleScope?: 'ADMIN' | 'DSA' | 'AGENT';
  title?: string;
}

const ReportsPage: React.FC<ReportsPageProps> = ({
  roleScope = 'ADMIN',
  title = 'Simple Reports',
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [leadData, applicationData] = await Promise.all([
          leadsService.getAllLeads(roleScope),
          applicationsService.getAllApplications(),
        ]);
        const scopedLeadIds = new Set(leadData.map((lead) => lead.id));
        setLeads(leadData);
        setApplications(applicationData.filter((app) => scopedLeadIds.has(app.leadId)));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const metrics = useMemo(() => {
    const conversionRatio = leads.length === 0 ? 0 : (applications.length / leads.length) * 100;
    const loggedInCount = applications.filter((app) => app.status === 'LOGGED_IN').length;
    const docsVerifiedCount = applications.filter((app) => app.status === 'DOCS_VERIFIED').length;
    const totalRequested = applications.reduce((sum, app) => sum + app.requestedAmount, 0);
    return { conversionRatio, loggedInCount, docsVerifiedCount, totalRequested };
  }, [leads, applications]);

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>{title}</h1>
        <p>Phase 1 reporting for leads and loan applications</p>
      </div>

      <div className="phase-grid-4">
        <div className="phase-stat">
          <span className="phase-stat-label">Total Leads</span>
          <span className="phase-stat-value">{leads.length}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Applications</span>
          <span className="phase-stat-value">{applications.length}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Conversion Ratio</span>
          <span className="phase-stat-value">{metrics.conversionRatio.toFixed(2)}%</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Total Requested Value</span>
          <span className="phase-stat-value">₹{metrics.totalRequested.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="phase-panel">
        <h3>Exports</h3>
        <div className="phase-actions">
          <Button
            disabled={loading}
            onClick={() =>
              exportCsv(
                'lead-report',
                ['Lead ID', 'Customer', 'Loan Type', 'Amount', 'Status', 'Source', 'City', 'State'],
                leads.map((lead) => [
                  lead.leadId,
                  lead.customerName,
                  lead.loanType,
                  String(lead.loanAmount),
                  lead.status,
                  lead.source,
                  lead.city,
                  lead.state,
                ])
              )
            }
          >
            Export Lead Report
          </Button>
          <Button
            disabled={loading}
            variant="secondary"
            onClick={() =>
              exportCsv(
                'application-report',
                ['Application No', 'Customer', 'Loan Type', 'Requested', 'Eligible', 'Status'],
                applications.map((app) => [
                  app.applicationNo,
                  app.customerName,
                  app.loanType,
                  String(app.requestedAmount),
                  String(app.eligibleAmount),
                  app.status,
                ])
              )
            }
          >
            Export Application Report
          </Button>
        </div>
      </div>

      <div className="phase-panel">
        <h3>Quick KPI Snapshot</h3>
        <p>Logged In: {metrics.loggedInCount}</p>
        <p>Documents Verified: {metrics.docsVerifiedCount}</p>
      </div>
    </div>
  );
};

export default ReportsPage;
