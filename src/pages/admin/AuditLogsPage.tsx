import React, { useEffect, useState } from 'react';
import Table, { TableColumn } from '../../components/common/Table';
import { auditService } from '../../services/audit/auditService';
import { AuditLogEntry } from '../../services/types/audit.types';
import './PhaseOnePages.css';

const AuditLogsPage: React.FC = () => {
  const [rows, setRows] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const logs = await auditService.getLogs();
    setRows(logs);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const columns: TableColumn<AuditLogEntry>[] = [
    { key: 'createdAt', header: 'Timestamp', render: (row) => new Date(row.createdAt).toLocaleString('en-IN') },
    { key: 'module', header: 'Module' },
    { key: 'action', header: 'Action' },
    { key: 'actor', header: 'Actor' },
    { key: 'details', header: 'Details' },
  ];

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>Audit Logs</h1>
        <p>Aadhaar policy actions, approvals, payouts, and security traces</p>
      </div>
      <Table data={rows} columns={columns} loading={loading} />
    </div>
  );
};

export default AuditLogsPage;
