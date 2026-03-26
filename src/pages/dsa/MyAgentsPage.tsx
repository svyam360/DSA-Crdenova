import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table, { TableColumn } from '../../components/common/Table';
import { onboardingService } from '../../services/onboarding/onboardingService';
import { AgentUser, DsaAgency } from '../../services/types/onboarding.types';
import './MyAgentsPage.css';

const MyAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentUser[]>([]);
  const [dsas, setDsas] = useState<DsaAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const loadData = async () => {
    setLoading(true);
    const [agentData, dsaData] = await Promise.all([onboardingService.getAgents(), onboardingService.getDsas()]);
    setAgents(agentData);
    setDsas(dsaData);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const primeDsaId = useMemo(() => dsas.find((item) => item.name === 'Prime DSA')?.id || '', [dsas]);
  const scopedAgents = useMemo(() => agents.filter((agent) => agent.dsaId === primeDsaId), [agents, primeDsaId]);

  const columns: TableColumn<AgentUser>[] = [
    { key: 'name', header: 'Agent' },
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

  const createAgent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!primeDsaId) {
      alert('DSA profile not found.');
      return;
    }
    await onboardingService.createAgent({ ...form, dsaId: primeDsaId, isActive: true });
    setIsOpen(false);
    setForm({ name: '', email: '', phone: '' });
    await loadData();
  };

  return (
    <div className="my-agents-page">
      <div className="my-agents-header">
        <div>
          <h1>My Agents</h1>
          <p>Create and manage agents under your DSA agency</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>+ New Agent</Button>
      </div>

      <Table data={scopedAgents} columns={columns} loading={loading} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Agent">
        <form onSubmit={createAgent}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="my-agents-actions">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyAgentsPage;
