import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { auditService } from '../../services/audit/auditService';
import { onboardingService } from '../../services/onboarding/onboardingService';
import { UamPermission } from '../../services/types/onboarding.types';
import './PhaseOnePages.css';

const roles: Array<'ADMIN' | 'DSA' | 'AGENT'> = ['ADMIN', 'DSA', 'AGENT'];
const actions: Array<keyof UamPermission['actions']> = ['view', 'create', 'edit', 'approve', 'export'];

const SettingsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Record<string, UamPermission[]>>({});
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'DSA' | 'AGENT'>('ADMIN');
  const [loading, setLoading] = useState(true);
  const [retentionDays, setRetentionDays] = useState<number>(auditService.getRetentionDays());

  const loadData = async () => {
    setLoading(true);
    const data = await onboardingService.getUamPermissions();
    setPermissions(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
    setRetentionDays(auditService.getRetentionDays());
  }, []);

  const updatePermission = async (
    screen: string,
    action: keyof UamPermission['actions'],
    value: boolean
  ) => {
    await onboardingService.updateUamPermission(selectedRole, screen, action, value);
    await loadData();
  };

  const current = permissions[selectedRole] || [];

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>Admin & User Access Management</h1>
        <p>Manage role permissions and audit-ready access controls</p>
      </div>

      <div className="phase-actions">
        {roles.map((role) => (
          <Button
            key={role}
            variant={selectedRole === role ? 'primary' : 'secondary'}
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </Button>
        ))}
      </div>

      <div className="phase-panel" style={{ overflowX: 'auto' }}>
        {loading ? (
          <p>Loading permissions...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Screen</th>
                {actions.map((action) => (
                  <th key={action}>{action.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {current.map((permission) => (
                <tr key={permission.screen}>
                  <td>{permission.screen}</td>
                  {actions.map((action) => (
                    <td key={`${permission.screen}_${action}`}>
                      <input
                        type="checkbox"
                        checked={permission.actions[action]}
                        onChange={(event) => updatePermission(permission.screen, action, event.target.checked)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="phase-panel">
        <h3>Aadhaar & Audit Retention Policy</h3>
        <p style={{ marginBottom: 12 }}>Aadhaar uploads must be masked. Configure audit log retention below.</p>
        <div className="phase-grid-2">
          <Input
            label="Retention Days"
            type="number"
            value={retentionDays || ''}
            onChange={(event) => setRetentionDays(Number(event.target.value))}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <Button
              onClick={() => {
                auditService.setRetentionDays(retentionDays);
                alert('Retention policy updated');
              }}
            >
              Save Retention
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const removed = auditService.purgeByRetentionPolicy();
                alert(`Purged ${removed} old audit logs`);
              }}
            >
              Purge Old Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
