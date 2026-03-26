import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Table, { TableColumn } from '../../components/common/Table';
import { applicationsService } from '../../services/applications/applicationsService';
import { ApplicationFormData, LoanApplication } from '../../services/types/application.types';
import { Lead } from '../../services/types/lead.types';
import { leadsService } from '../../services/leads/leadsService';
import { rateCardService } from '../../services/banks/rateCardService';
import { RateCard } from '../../services/types/rateCard.types';
import './PhaseOnePages.css';

const formatCurrency = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;
const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

interface ApplicationsPageProps {
  roleScope?: 'ADMIN' | 'DSA' | 'AGENT';
  allowCreate?: boolean;
  title?: string;
}

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  roleScope = 'ADMIN',
  allowCreate = true,
  title = 'Loan Applications',
}) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [eligibleOffers, setEligibleOffers] = useState<RateCard[]>([]);
  const [formData, setFormData] = useState<ApplicationFormData>({
    leadId: '',
    requestedAmount: 0,
    monthlyIncome: 0,
    monthlyObligations: 0,
    cibilScore: 700,
    panNumber: '',
    ckycNumber: '',
  });

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apps, allLeads] = await Promise.all([
        applicationsService.getAllApplications(),
        leadsService.getAllLeads(roleScope),
      ]);
      const scopedLeadIds = new Set(allLeads.map((lead) => lead.id));
      setApplications(apps.filter((app) => scopedLeadIds.has(app.leadId)));
      setLeads(allLeads);
    } finally {
      setLoading(false);
    }
  };

  const eligibleSnapshot = useMemo(() => {
    return applicationsService.evaluateEligibility({
      monthlyIncome: formData.monthlyIncome,
      monthlyObligations: formData.monthlyObligations,
      cibilScore: formData.cibilScore,
    });
  }, [formData.monthlyIncome, formData.monthlyObligations, formData.cibilScore]);

  useEffect(() => {
    const selectedLead = leads.find((lead) => lead.id === formData.leadId);
    if (!selectedLead || !formData.requestedAmount || formData.requestedAmount <= 0) {
      setEligibleOffers([]);
      return;
    }
    void rateCardService
      .getEligibleOffers(selectedLead.loanType, formData.requestedAmount)
      .then(setEligibleOffers)
      .catch(() => setEligibleOffers([]));
  }, [leads, formData.leadId, formData.requestedAmount]);

  const createApplication = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.leadId) {
      alert('Please select a lead.');
      return;
    }
    if (!eligibleSnapshot.eligible) {
      alert('Application cannot be created: customer is not eligible as per FOIR/CIBIL rules.');
      return;
    }
    if (formData.requestedAmount > eligibleSnapshot.recommendedAmount) {
      alert('Requested amount exceeds recommended eligible amount.');
      return;
    }

    try {
      setSubmitting(true);
      await applicationsService.createApplication(formData);
      setIsModalOpen(false);
      setFormData({
        leadId: '',
        requestedAmount: 0,
        monthlyIncome: 0,
        monthlyObligations: 0,
        cibilScore: 700,
        panNumber: '',
        ckycNumber: '',
      });
      await loadData();
    } catch (error) {
      console.error('Failed to create application:', error);
      alert((error as Error)?.message || 'Failed to create application.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<LoanApplication>[] = [
    { key: 'applicationNo', header: 'Application No', render: (app) => <strong>{app.applicationNo}</strong> },
    { key: 'customerName', header: 'Customer' },
    { key: 'loanType', header: 'Loan Type' },
    { key: 'requestedAmount', header: 'Requested', render: (app) => formatCurrency(app.requestedAmount) },
    { key: 'eligibleAmount', header: 'Eligible', render: (app) => formatCurrency(app.eligibleAmount) },
    {
      key: 'status',
      header: 'Status',
      render: (app) => (
        <StatusBadge variant={app.status === 'DOCS_VERIFIED' ? 'success' : 'warning'}>
          {app.status.replace('_', ' ')}
        </StatusBadge>
      ),
    },
    { key: 'createdAt', header: 'Created', render: (app) => formatDate(app.createdAt) },
  ];

  const leadOptions = [{ value: '', label: 'Select lead' }].concat(
    leads.map((lead) => ({
      value: lead.id,
      label: `${lead.leadId} - ${lead.customerName} (${lead.loanType})`,
    }))
  );

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>{title}</h1>
        <p>Convert qualified leads into formal applications (Phase 1 MVP)</p>
      </div>

      {allowCreate && (
        <div className="phase-actions">
          <Button onClick={() => setIsModalOpen(true)}>+ New Application</Button>
        </div>
      )}

      <div className="phase-grid-4">
        <div className="phase-stat">
          <span className="phase-stat-label">Total Applications</span>
          <span className="phase-stat-value">{applications.length}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Logged In</span>
          <span className="phase-stat-value">{applications.filter((app) => app.status === 'LOGGED_IN').length}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Docs Pending</span>
          <span className="phase-stat-value">{applications.filter((app) => app.status === 'DOCS_PENDING').length}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Docs Verified</span>
          <span className="phase-stat-value">{applications.filter((app) => app.status === 'DOCS_VERIFIED').length}</span>
        </div>
      </div>

      <Table data={applications} columns={columns} loading={loading} />

      <Modal
        isOpen={allowCreate && isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Application"
        size="medium"
      >
        <form onSubmit={createApplication}>
          <div className="phase-grid-2">
            <Select
              label="Lead"
              value={formData.leadId}
              options={leadOptions}
              onChange={(event) => setFormData((prev) => ({ ...prev, leadId: event.target.value }))}
            />
            <Input
              label="Requested Amount"
              type="number"
              value={formData.requestedAmount || ''}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, requestedAmount: Number(event.target.value) }))
              }
            />
            <Input
              label="Monthly Income"
              type="number"
              value={formData.monthlyIncome || ''}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, monthlyIncome: Number(event.target.value) }))
              }
            />
            <Input
              label="Monthly Obligations"
              type="number"
              value={formData.monthlyObligations || ''}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, monthlyObligations: Number(event.target.value) }))
              }
            />
            <Input
              label="CIBIL Score"
              type="number"
              value={formData.cibilScore || ''}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, cibilScore: Number(event.target.value) }))
              }
            />
            <Input
              label="PAN Number"
              placeholder="ABCDE1234F"
              value={formData.panNumber || ''}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, panNumber: event.target.value.toUpperCase() }))
              }
            />
            <Input
              label="CKYC Number"
              placeholder="14 digit CKYC number"
              value={formData.ckycNumber || ''}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, ckycNumber: event.target.value }))
              }
            />
          </div>

          <div className="phase-panel" style={{ marginTop: 10 }}>
            <strong>Eligibility Preview</strong>
            <p>FOIR: {eligibleSnapshot.foir.toFixed(2)}%</p>
            <p>Decision: {eligibleSnapshot.eligible ? 'Eligible' : 'Not Eligible'}</p>
            <p>Recommended Amount: {formatCurrency(eligibleSnapshot.recommendedAmount)}</p>
            <p>Best Partner Offers: {eligibleOffers.length}</p>
            {eligibleOffers.slice(0, 3).map((offer) => (
              <p key={offer.id}>
                {offer.partnerName} ({offer.partnerType}) · ROI {offer.interestRate}% · TAT {offer.tatHours} hrs
              </p>
            ))}
          </div>

          <div className="phase-form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApplicationsPage;
