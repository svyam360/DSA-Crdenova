import React, { useEffect, useMemo, useState } from 'react';
import Table, { TableColumn } from '../../components/common/Table';
import { commissionService } from '../../services/commissions/commissionService';
import { CommissionRecord } from '../../services/types/commission.types';
import './EarningsPage.css';

interface EarningsPageProps {
  role: 'DSA' | 'AGENT';
  ownerName: string;
  title: string;
}

const formatCurrency = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;

const EarningsPage: React.FC<EarningsPageProps> = ({ role, ownerName, title }) => {
  const [rows, setRows] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await commissionService.syncCommissionRecords();
      const all = await commissionService.getCommissionRecords();
      const scoped =
        role === 'DSA'
          ? all.filter((item) => item.dsaName === ownerName)
          : all.filter((item) => item.agentName === ownerName);
      setRows(scoped);
      setLoading(false);
    };

    void load();
  }, [role, ownerName]);

  const totals = useMemo(() => {
    const total = rows.reduce((sum, item) => sum + item.commissionAmount, 0);
    const pending = rows
      .filter((item) => item.payoutStatus === 'PENDING')
      .reduce((sum, item) => sum + item.commissionAmount, 0);
    const paid = rows
      .filter((item) => item.payoutStatus === 'PAID')
      .reduce((sum, item) => sum + item.commissionAmount, 0);
    return { total, pending, paid };
  }, [rows]);

  const columns: TableColumn<CommissionRecord>[] = [
    { key: 'applicationNo', header: 'Application' },
    { key: 'customerName', header: 'Customer' },
    { key: 'commissionPct', header: 'Rate %', render: (item) => `${item.commissionPct}%` },
    { key: 'commissionAmount', header: 'Commission', render: (item) => formatCurrency(item.commissionAmount) },
    { key: 'tdsAmount', header: 'TDS', render: (item) => formatCurrency(item.tdsAmount || 0) },
    { key: 'netPayout', header: 'Net', render: (item) => formatCurrency(item.netPayout || 0) },
    { key: 'payoutStatus', header: 'Payout Status' },
    { key: 'payoutBatchId', header: 'Batch', render: (item) => item.payoutBatchId || '-' },
    {
      key: 'payoutDate',
      header: 'Payout Date',
      render: (item) => (item.payoutDate ? new Date(item.payoutDate).toLocaleDateString('en-IN') : '-'),
    },
  ];

  return (
    <div className="earnings-page">
      <div className="earnings-header">
        <h1>{title}</h1>
        <p>Track commission earnings and payout progress</p>
      </div>

      <div className="earnings-stats">
        <div className="earnings-stat-card">
          <span>Total</span>
          <strong>{formatCurrency(totals.total)}</strong>
        </div>
        <div className="earnings-stat-card">
          <span>Pending</span>
          <strong>{formatCurrency(totals.pending)}</strong>
        </div>
        <div className="earnings-stat-card">
          <span>Paid</span>
          <strong>{formatCurrency(totals.paid)}</strong>
        </div>
      </div>

      <Table data={rows} columns={columns} loading={loading} />
    </div>
  );
};

export default EarningsPage;
