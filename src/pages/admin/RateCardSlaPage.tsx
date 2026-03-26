import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Table, { TableColumn } from '../../components/common/Table';
import { rateCardService } from '../../services/banks/rateCardService';
import { RateCard } from '../../services/types/rateCard.types';
import { LoanType } from '../../services/types/lead.types';
import './PhaseOnePages.css';

const loanTypeOptions = [
  { value: 'HOME', label: 'HOME' },
  { value: 'PERSONAL', label: 'PERSONAL' },
  { value: 'BUSINESS', label: 'BUSINESS' },
  { value: 'CAR', label: 'CAR' },
  { value: 'EDUCATION', label: 'EDUCATION' },
];

const partnerTypeOptions = [
  { value: 'BANK', label: 'BANK' },
  { value: 'NBFC', label: 'NBFC' },
];

const RateCardSlaPage: React.FC = () => {
  const [rows, setRows] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Omit<RateCard, 'id'>>({
    partnerType: 'BANK',
    partnerName: '',
    loanType: 'HOME',
    minAmount: 0,
    maxAmount: 0,
    interestRate: 0,
    processingFeePct: 0,
    commissionPct: 0,
    tatHours: 24,
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    const data = await rateCardService.getAllRateCards();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const columns: TableColumn<RateCard>[] = [
    { key: 'partnerType', header: 'Type' },
    { key: 'partnerName', header: 'Partner' },
    { key: 'loanType', header: 'Loan Type' },
    { key: 'minAmount', header: 'Min Amt', render: (row) => `₹${row.minAmount.toLocaleString('en-IN')}` },
    { key: 'maxAmount', header: 'Max Amt', render: (row) => `₹${row.maxAmount.toLocaleString('en-IN')}` },
    { key: 'interestRate', header: 'ROI', render: (row) => `${row.interestRate}%` },
    { key: 'processingFeePct', header: 'Proc Fee', render: (row) => `${row.processingFeePct}%` },
    { key: 'commissionPct', header: 'Commission', render: (row) => `${row.commissionPct}%` },
    { key: 'tatHours', header: 'TAT (hrs)' },
    {
      key: 'isActive',
      header: 'Active',
      render: (row) => (
        <input
          type="checkbox"
          checked={row.isActive}
          onChange={(event) => rateCardService.upsertRateCard({ ...row, isActive: event.target.checked }).then(loadData)}
        />
      ),
    },
  ];

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await rateCardService.upsertRateCard(form);
    setIsOpen(false);
    await loadData();
  };

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>Bank/NBFC Rate Cards & SLA</h1>
        <p>Manage partner-wise pricing, commission, and TAT tracker</p>
      </div>

      <div className="phase-actions">
        <Button onClick={() => setIsOpen(true)}>+ Add Rate Card</Button>
      </div>

      <Table data={rows} columns={columns} loading={loading} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Rate Card">
        <form onSubmit={handleCreate}>
          <div className="phase-grid-2">
            <Select
              label="Partner Type"
              options={partnerTypeOptions}
              value={form.partnerType}
              onChange={(event) => setForm({ ...form, partnerType: event.target.value as 'BANK' | 'NBFC' })}
            />
            <Input
              label="Partner Name"
              value={form.partnerName}
              onChange={(event) => setForm({ ...form, partnerName: event.target.value })}
            />
            <Select
              label="Loan Type"
              options={loanTypeOptions}
              value={form.loanType}
              onChange={(event) => setForm({ ...form, loanType: event.target.value as LoanType })}
            />
            <Input label="Min Amount" type="number" value={form.minAmount || ''} onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })} />
            <Input label="Max Amount" type="number" value={form.maxAmount || ''} onChange={(e) => setForm({ ...form, maxAmount: Number(e.target.value) })} />
            <Input label="Interest Rate %" type="number" value={form.interestRate || ''} onChange={(e) => setForm({ ...form, interestRate: Number(e.target.value) })} />
            <Input label="Processing Fee %" type="number" value={form.processingFeePct || ''} onChange={(e) => setForm({ ...form, processingFeePct: Number(e.target.value) })} />
            <Input label="Commission %" type="number" value={form.commissionPct || ''} onChange={(e) => setForm({ ...form, commissionPct: Number(e.target.value) })} />
            <Input label="TAT Hours" type="number" value={form.tatHours || ''} onChange={(e) => setForm({ ...form, tatHours: Number(e.target.value) })} />
          </div>
          <div className="phase-form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RateCardSlaPage;
