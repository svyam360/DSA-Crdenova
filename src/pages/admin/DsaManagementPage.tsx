import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Table, { TableColumn } from '../../components/common/Table';
import { onboardingService } from '../../services/onboarding/onboardingService';
import { AgentUser, DsaAgency } from '../../services/types/onboarding.types';
import './PhaseOnePages.css';

const DsaManagementPage: React.FC = () => {
  const [dsas, setDsas] = useState<DsaAgency[]>([]);
  const [agents, setAgents] = useState<AgentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDsaModalOpen, setIsDsaModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [dsaForm, setDsaForm] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    mappedProducts: 'HOME,PERSONAL',
    mappedBanks: 'HDFC,ICICI',
  });
  const [agentForm, setAgentForm] = useState({
    dsaId: '',
    name: '',
    email: '',
    phone: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dsaData, agentData] = await Promise.all([
        onboardingService.getDsas(),
        onboardingService.getAgents(),
      ]);
      setDsas(dsaData);
      setAgents(agentData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const dsaColumns: TableColumn<DsaAgency>[] = [
    { key: 'name', header: 'DSA Name' },
    { key: 'code', header: 'Code' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'approvalStatus', header: 'Approval Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (dsa) => (
        <select
          value={dsa.approvalStatus}
          onChange={(event) =>
            onboardingService
              .updateDsaStatus(dsa.id, event.target.value as DsaAgency['approvalStatus'])
              .then(loadData)
          }
        >
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      ),
    },
  ];

  const agentColumns: TableColumn<AgentUser>[] = [
    {
      key: 'dsaId',
      header: 'DSA',
      render: (agent) => dsas.find((dsa) => dsa.id === agent.dsaId)?.name || '-',
    },
    { key: 'name', header: 'Agent Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'isActive',
      header: 'Active',
      render: (agent) => (
        <input
          type="checkbox"
          checked={agent.isActive}
          onChange={(event) => onboardingService.updateAgentStatus(agent.id, event.target.checked).then(loadData)}
        />
      ),
    },
  ];

  const dsaOptions = useMemo(
    () => [{ value: '', label: 'Select DSA' }].concat(dsas.map((dsa) => ({ value: dsa.id, label: dsa.name }))),
    [dsas]
  );

  const createDsa = async (event: React.FormEvent) => {
    event.preventDefault();
    await onboardingService.createDsa({
      name: dsaForm.name,
      code: dsaForm.code,
      email: dsaForm.email,
      phone: dsaForm.phone,
      mappedProducts: dsaForm.mappedProducts.split(',').map((item) => item.trim()).filter(Boolean),
      mappedBanks: dsaForm.mappedBanks.split(',').map((item) => item.trim()).filter(Boolean),
    });
    setIsDsaModalOpen(false);
    await loadData();
  };

  const createAgent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!agentForm.dsaId) {
      alert('Please select DSA');
      return;
    }
    await onboardingService.createAgent({ ...agentForm, isActive: true });
    setIsAgentModalOpen(false);
    await loadData();
  };

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>DSA & User Onboarding</h1>
        <p>Manage DSA registration, approval, and agent creation</p>
      </div>

      <div className="phase-actions">
        <Button onClick={() => setIsDsaModalOpen(true)}>+ Register DSA</Button>
        <Button variant="secondary" onClick={() => setIsAgentModalOpen(true)}>
          + Add Agent
        </Button>
      </div>

      <div className="phase-panel">
        <h3>DSA Agencies</h3>
        <Table data={dsas} columns={dsaColumns} loading={loading} />
      </div>

      <div className="phase-panel">
        <h3>Agents</h3>
        <Table data={agents} columns={agentColumns} loading={loading} />
      </div>

      <Modal isOpen={isDsaModalOpen} onClose={() => setIsDsaModalOpen(false)} title="Register DSA">
        <form onSubmit={createDsa}>
          <div className="phase-grid-2">
            <Input label="DSA Name" value={dsaForm.name} onChange={(e) => setDsaForm({ ...dsaForm, name: e.target.value })} />
            <Input label="Code" value={dsaForm.code} onChange={(e) => setDsaForm({ ...dsaForm, code: e.target.value })} />
            <Input label="Email" type="email" value={dsaForm.email} onChange={(e) => setDsaForm({ ...dsaForm, email: e.target.value })} />
            <Input label="Phone" value={dsaForm.phone} onChange={(e) => setDsaForm({ ...dsaForm, phone: e.target.value })} />
            <Input label="Mapped Products (comma separated)" value={dsaForm.mappedProducts} onChange={(e) => setDsaForm({ ...dsaForm, mappedProducts: e.target.value })} />
            <Input label="Mapped Banks (comma separated)" value={dsaForm.mappedBanks} onChange={(e) => setDsaForm({ ...dsaForm, mappedBanks: e.target.value })} />
          </div>
          <div className="phase-form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsDsaModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAgentModalOpen} onClose={() => setIsAgentModalOpen(false)} title="Add Agent">
        <form onSubmit={createAgent}>
          <div className="phase-grid-2">
            <Select label="DSA" options={dsaOptions} value={agentForm.dsaId} onChange={(e) => setAgentForm({ ...agentForm, dsaId: e.target.value })} />
            <Input label="Agent Name" value={agentForm.name} onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })} />
            <Input label="Email" type="email" value={agentForm.email} onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })} />
            <Input label="Phone" value={agentForm.phone} onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })} />
          </div>
          <div className="phase-form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsAgentModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DsaManagementPage;
