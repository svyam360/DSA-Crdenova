import React, { useEffect, useMemo, useState } from 'react';
import Table, { TableColumn } from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { Lead, LeadStatus } from '../../services/types/lead.types';
import { leadsService } from '../../services/leads/leadsService';
import CreateLeadForm from '../../components/leads/CreateLeadForm.tsx';
import Input from '../../components/common/Input.tsx';
import Select from '../../components/common/Select.tsx';
import { authService } from '../../services/auth/authService.ts';
import './LeadsPage.css';

const getStatusVariant = (status: LeadStatus) => {
  const variants: Record<LeadStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    NEW: 'info',
    CONTACTED: 'warning',
    QUALIFIED: 'success',
    LOGGED_IN: 'neutral',
    CONVERTED: 'success',
    REJECTED: 'error',
  };
  return variants[status];
};

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

interface LeadsPageProps {
  roleScope?: 'ADMIN' | 'DSA' | 'AGENT';
  pageTitle?: string;
  pageSubtitle?: string;
  allowCreate?: boolean;
}

const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'LOGGED_IN', label: 'Logged In' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'REJECTED', label: 'Rejected' },
];

const STATUS_UPDATE_OPTIONS = STATUS_FILTER_OPTIONS.filter((option) => option.value !== 'ALL');

const LeadsPage: React.FC<LeadsPageProps> = ({
  roleScope,
  pageTitle,
  pageSubtitle,
  allowCreate = true,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LeadStatus>('ALL');
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();
  const effectiveRole: 'ADMIN' | 'DSA' | 'AGENT' = roleScope || currentUser?.role || 'ADMIN';

  useEffect(() => {
    loadLeads();
  }, [effectiveRole]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsService.getAllLeads(effectiveRole);
      setLeads(data);
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = async () => {
    setIsCreateModalOpen(false);
    await loadLeads();
  };

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      setUpdatingLeadId(leadId);
      await leadsService.updateLead(leadId, { status });
      await loadLeads();
    } catch (error) {
      console.error('Failed to update lead status:', error);
      alert('Failed to update lead status. Please try again.');
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'ALL' ? true : lead.status === statusFilter;
      const lowerSearch = searchTerm.trim().toLowerCase();
      const matchesSearch = !lowerSearch
        ? true
        : [
            lead.leadId,
            lead.customerName,
            lead.mobile,
            lead.email,
            lead.city,
            lead.state,
          ].some((field) => field.toLowerCase().includes(lowerSearch));

      return matchesStatus && matchesSearch;
    });
  }, [leads, searchTerm, statusFilter]);

  const handleExportCsv = () => {
    const headers = ['Lead ID', 'Customer', 'Mobile', 'Email', 'Loan Type', 'Amount', 'Status', 'Source', 'City', 'State', 'Created'];
    const rows = filteredLeads.map((lead) => [
      lead.leadId,
      lead.customerName,
      lead.mobile,
      lead.email,
      lead.loanType,
      lead.loanAmount.toString(),
      lead.status,
      lead.source,
      lead.city,
      lead.state,
      formatDate(lead.createdAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${effectiveRole.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns: TableColumn<Lead>[] = [
    {
      key: 'leadId',
      header: 'Lead ID',
      width: '100px',
      render: (lead) => <span className="lead-id">{lead.leadId}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (lead) => (
        <div className="customer-cell">
          <div className="customer-name">{lead.customerName}</div>
          <div className="customer-contact">{lead.mobile}</div>
        </div>
      ),
    },
    {
      key: 'loanType',
      header: 'Loan Type',
      width: '120px',
      render: (lead) => <span className="loan-type">{lead.loanType}</span>,
    },
    {
      key: 'loanAmount',
      header: 'Amount',
      width: '120px',
      render: (lead) => <span className="loan-amount">{formatCurrency(lead.loanAmount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (lead) => (
        <StatusBadge variant={getStatusVariant(lead.status)}>
          {lead.status.replace('_', ' ')}
        </StatusBadge>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      width: '110px',
    },
    {
      key: 'city',
      header: 'Location',
      width: '140px',
      render: (lead) => (
        <div className="location-cell">
          {lead.city}, {lead.state}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      width: '120px',
      render: (lead) => <span className="date-text">{formatDate(lead.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Update Status',
      width: '170px',
      render: (lead) => (
        <select
          value={lead.status}
          disabled={updatingLeadId === lead.id}
          onChange={(event) => handleStatusChange(lead.id, event.target.value as LeadStatus)}
          className="row-status-select"
        >
          {STATUS_UPDATE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="leads-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{pageTitle || (effectiveRole === 'ADMIN' ? 'All Leads' : 'My Leads')}</h1>
          <p className="page-subtitle">
            {pageSubtitle || 'Manage and track customer leads through the pipeline'}
          </p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" onClick={handleExportCsv}>📊 Export CSV</Button>
          {allowCreate && <Button onClick={() => setIsCreateModalOpen(true)}>+ New Lead</Button>}
        </div>
      </div>

      <div className="leads-filters">
        <Input
          placeholder="Search by lead id, customer, email, mobile, city..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <Select
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'ALL' | LeadStatus)}
        />
      </div>

      <div className="leads-stats">
        <div className="stat-card">
          <span className="stat-label">Visible Leads</span>
          <span className="stat-value">{filteredLeads.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">New</span>
          <span className="stat-value">{filteredLeads.filter((lead) => lead.status === 'NEW').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Qualified</span>
          <span className="stat-value">{filteredLeads.filter((lead) => lead.status === 'QUALIFIED').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Converted</span>
          <span className="stat-value">{filteredLeads.filter((lead) => lead.status === 'CONVERTED').length}</span>
        </div>
      </div>

      <Table data={filteredLeads} columns={columns} loading={loading} />

      <Modal
        isOpen={allowCreate && isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Lead"
        size="medium"
      >
        <CreateLeadForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default LeadsPage;
