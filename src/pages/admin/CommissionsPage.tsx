import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import Table, { TableColumn } from '../../components/common/Table';
import { taxService, GstInvoice } from '../../services/compliance/taxService';
import { commissionService } from '../../services/commissions/commissionService';
import { CommissionRecord, PayoutBatch } from '../../services/types/commission.types';
import './PhaseOnePages.css';

const formatCurrency = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;

const CommissionsPage: React.FC = () => {
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [invoices, setInvoices] = useState<GstInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      await commissionService.syncCommissionRecords();
      const [data, batchData, invoiceData] = await Promise.all([
        commissionService.getCommissionRecords(),
        commissionService.getPayoutBatches(),
        taxService.getInvoices(),
      ]);
      setRecords(data);
      setBatches(batchData);
      setInvoices(invoiceData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const metrics = useMemo(() => {
    const total = records.reduce((sum, item) => sum + item.commissionAmount, 0);
    const pending = records
      .filter((item) => item.payoutStatus === 'PENDING')
      .reduce((sum, item) => sum + item.commissionAmount, 0);
    const paid = records
      .filter((item) => item.payoutStatus === 'PAID')
      .reduce((sum, item) => sum + item.commissionAmount, 0);
    return { total, pending, paid };
  }, [records]);

  const columns: TableColumn<CommissionRecord>[] = [
    { key: 'applicationNo', header: 'Application' },
    { key: 'customerName', header: 'Customer' },
    { key: 'dsaName', header: 'DSA' },
    { key: 'agentName', header: 'Agent' },
    { key: 'disbursedAmount', header: 'Disbursed', render: (item) => formatCurrency(item.disbursedAmount) },
    { key: 'commissionPct', header: 'Rate %', render: (item) => `${item.commissionPct}%` },
    { key: 'commissionAmount', header: 'Commission', render: (item) => formatCurrency(item.commissionAmount) },
    { key: 'gstAmount', header: 'GST 18%', render: (item) => formatCurrency(item.gstAmount || 0) },
    { key: 'tdsAmount', header: 'TDS 194H', render: (item) => formatCurrency(item.tdsAmount || 0) },
    { key: 'netPayout', header: 'Net Payout', render: (item) => formatCurrency(item.netPayout || 0) },
    { key: 'payoutStatus', header: 'Payout Status' },
    { key: 'payoutBatchId', header: 'Batch ID', render: (item) => item.payoutBatchId || '-' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) =>
        item.payoutStatus === 'PENDING' ? (
          <Button variant="secondary" onClick={() => commissionService.markAsPaid(item.id).then(loadData)}>
            Mark Paid
          </Button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span>{item.payoutDate ? new Date(item.payoutDate).toLocaleDateString('en-IN') : '-'}</span>
            <Button
              variant="secondary"
              onClick={async () => {
                const invoice = await taxService.generateInvoiceFromCommission(item);
                alert(`GST Invoice generated: ${invoice.invoiceNo}`);
                await loadData();
              }}
            >
              GST Invoice
            </Button>
          </div>
        ),
    },
  ];

  const batchColumns: TableColumn<PayoutBatch>[] = [
    { key: 'id', header: 'Batch ID' },
    { key: 'recordCount', header: 'Records' },
    { key: 'totalAmount', header: 'Total Amount', render: (batch) => formatCurrency(batch.totalAmount) },
    {
      key: 'generatedAt',
      header: 'Generated At',
      render: (batch) => new Date(batch.generatedAt).toLocaleString('en-IN'),
    },
  ];

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>Commission & Payout</h1>
        <p>Auto-calculated commissions based on verified loan applications</p>
      </div>

      <div className="phase-actions">
        <Button
          onClick={async () => {
            const batch = await commissionService.generatePayoutBatch();
            if (!batch) {
              alert('No pending commission records available.');
            }
            await loadData();
          }}
        >
          Generate Payout Batch
        </Button>
      </div>

      <div className="phase-grid-4">
        <div className="phase-stat">
          <span className="phase-stat-label">Total Commission</span>
          <span className="phase-stat-value">{formatCurrency(metrics.total)}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Pending Payout</span>
          <span className="phase-stat-value">{formatCurrency(metrics.pending)}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Paid Payout</span>
          <span className="phase-stat-value">{formatCurrency(metrics.paid)}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Records</span>
          <span className="phase-stat-value">{records.length}</span>
        </div>
      </div>

      <Table data={records} columns={columns} loading={loading} />

      <div className="phase-panel">
        <h3>Payout Batch History</h3>
        <Table data={batches} columns={batchColumns} loading={loading} />
      </div>

      <div className="phase-panel">
        <h3>GST Invoice History</h3>
        <Table
          data={invoices}
          columns={[
            { key: 'invoiceNo', header: 'Invoice No' },
            { key: 'applicationNo', header: 'Application' },
            { key: 'customerName', header: 'Customer' },
            { key: 'taxableAmount', header: 'Taxable', render: (item) => formatCurrency(item.taxableAmount) },
            { key: 'gstAmount', header: 'GST', render: (item) => formatCurrency(item.gstAmount) },
            { key: 'tdsAmount', header: 'TDS', render: (item) => formatCurrency(item.tdsAmount) },
            { key: 'netPayable', header: 'Net', render: (item) => formatCurrency(item.netPayable) },
            { key: 'generatedAt', header: 'Generated', render: (item) => new Date(item.generatedAt).toLocaleString('en-IN') },
          ]}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CommissionsPage;
