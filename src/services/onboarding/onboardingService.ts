import { AgentUser, DsaAgency, UamPermission } from '../types/onboarding.types';
import { auditService } from '../audit/auditService';

const DSA_KEY = 'dsa_agencies_data';
const AGENT_KEY = 'dsa_agents_data';
const UAM_KEY = 'dsa_uam_permissions_data';

const readStorage = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse ${key}`, error);
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const seedDsas: DsaAgency[] = [
  {
    id: 'DSA_001',
    name: 'Prime DSA',
    code: 'PRIME001',
    email: 'dsa@prime.com',
    phone: '9876500001',
    approvalStatus: 'APPROVED',
    mappedProducts: ['HOME', 'PERSONAL', 'BUSINESS'],
    mappedBanks: ['HDFC', 'ICICI'],
    createdAt: '2026-01-01T09:00:00Z',
  },
];

const seedAgents: AgentUser[] = [
  {
    id: 'AG_001',
    dsaId: 'DSA_001',
    name: 'Field Agent Kumar',
    email: 'agent@prime.com',
    phone: '9876500002',
    isActive: true,
    createdAt: '2026-01-02T09:00:00Z',
  },
];

const defaultUam: Record<string, UamPermission[]> = {
  ADMIN: [
    { screen: 'Dashboard', actions: { view: true, create: false, edit: false, approve: false, export: true } },
    { screen: 'Leads', actions: { view: true, create: true, edit: true, approve: true, export: true } },
    { screen: 'Eligibility', actions: { view: true, create: true, edit: true, approve: false, export: true } },
    { screen: 'Applications', actions: { view: true, create: true, edit: true, approve: true, export: true } },
    { screen: 'Documents', actions: { view: true, create: true, edit: true, approve: true, export: true } },
    { screen: 'DSA Management', actions: { view: true, create: true, edit: true, approve: true, export: true } },
    { screen: 'Commissions', actions: { view: true, create: false, edit: true, approve: true, export: true } },
    { screen: 'Rate Cards & SLA', actions: { view: true, create: true, edit: true, approve: true, export: true } },
    { screen: 'Reports', actions: { view: true, create: false, edit: false, approve: false, export: true } },
    { screen: 'Audit Logs', actions: { view: true, create: false, edit: false, approve: false, export: true } },
    { screen: 'Settings', actions: { view: true, create: false, edit: true, approve: true, export: false } },
  ],
  DSA: [
    { screen: 'Dashboard', actions: { view: true, create: false, edit: false, approve: false, export: true } },
    { screen: 'Leads', actions: { view: true, create: false, edit: true, approve: false, export: true } },
    { screen: 'Applications', actions: { view: true, create: true, edit: true, approve: false, export: true } },
    { screen: 'Agents', actions: { view: true, create: true, edit: true, approve: false, export: false } },
    { screen: 'Earnings', actions: { view: true, create: false, edit: false, approve: false, export: true } },
    { screen: 'Reports', actions: { view: true, create: false, edit: false, approve: false, export: true } },
  ],
  AGENT: [
    { screen: 'Dashboard', actions: { view: true, create: false, edit: false, approve: false, export: false } },
    { screen: 'Leads', actions: { view: true, create: false, edit: true, approve: false, export: false } },
    { screen: 'Applications', actions: { view: true, create: true, edit: true, approve: false, export: false } },
    { screen: 'Earnings', actions: { view: true, create: false, edit: false, approve: false, export: false } },
  ],
};

const mergeRolePermissions = (defaults: UamPermission[], existing: UamPermission[]): UamPermission[] => {
  return defaults.map((defaultEntry) => {
    const match = existing.find((item) => item.screen === defaultEntry.screen);
    return match || defaultEntry;
  });
};

let dsas = readStorage<DsaAgency[]>(DSA_KEY, seedDsas);
let agents = readStorage<AgentUser[]>(AGENT_KEY, seedAgents);
const persistedUam = readStorage<Record<string, UamPermission[]>>(UAM_KEY, defaultUam);
let uamPermissions: Record<string, UamPermission[]> = {
  ADMIN: mergeRolePermissions(defaultUam.ADMIN, persistedUam.ADMIN || []),
  DSA: mergeRolePermissions(defaultUam.DSA, persistedUam.DSA || []),
  AGENT: mergeRolePermissions(defaultUam.AGENT, persistedUam.AGENT || []),
};
writeStorage(UAM_KEY, uamPermissions);

export const onboardingService = {
  getDsas: async (): Promise<DsaAgency[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));
    return [...dsas];
  },

  createDsa: async (
    payload: Omit<DsaAgency, 'id' | 'approvalStatus' | 'createdAt'>
  ): Promise<DsaAgency> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    const record: DsaAgency = {
      ...payload,
      id: `DSA_${Date.now()}`,
      approvalStatus: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    dsas = [record, ...dsas];
    writeStorage(DSA_KEY, dsas);
    auditService.addLog({
      module: 'Onboarding',
      action: 'CREATE_DSA',
      actor: 'SYSTEM',
      details: `Created DSA ${record.name}`,
    });
    return record;
  },

  updateDsaStatus: async (id: string, status: DsaAgency['approvalStatus']): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));
    dsas = dsas.map((dsa) => (dsa.id === id ? { ...dsa, approvalStatus: status } : dsa));
    writeStorage(DSA_KEY, dsas);
    auditService.addLog({
      module: 'Onboarding',
      action: 'UPDATE_DSA_STATUS',
      actor: 'SYSTEM',
      details: `DSA ${id} status changed to ${status}`,
    });
  },

  getAgents: async (): Promise<AgentUser[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));
    return [...agents];
  },

  createAgent: async (payload: Omit<AgentUser, 'id' | 'createdAt'>): Promise<AgentUser> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    const record: AgentUser = {
      ...payload,
      id: `AG_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    agents = [record, ...agents];
    writeStorage(AGENT_KEY, agents);
    auditService.addLog({
      module: 'Onboarding',
      action: 'CREATE_AGENT',
      actor: 'SYSTEM',
      details: `Created agent ${record.name}`,
    });
    return record;
  },

  updateAgentStatus: async (id: string, isActive: boolean): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));
    agents = agents.map((agent) => (agent.id === id ? { ...agent, isActive } : agent));
    writeStorage(AGENT_KEY, agents);
    auditService.addLog({
      module: 'Onboarding',
      action: 'UPDATE_AGENT_STATUS',
      actor: 'SYSTEM',
      details: `Agent ${id} set active=${isActive}`,
    });
  },

  getUamPermissions: async (): Promise<Record<string, UamPermission[]>> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 150));
    return { ...uamPermissions };
  },

  updateUamPermission: async (
    role: 'ADMIN' | 'DSA' | 'AGENT',
    screen: string,
    action: keyof UamPermission['actions'],
    value: boolean
  ): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 150));
    const rolePermissions = uamPermissions[role] || [];
    uamPermissions[role] = rolePermissions.map((item) =>
      item.screen === screen ? { ...item, actions: { ...item.actions, [action]: value } } : item
    );
    writeStorage(UAM_KEY, uamPermissions);
    auditService.addLog({
      module: 'UAM',
      action: 'UPDATE_PERMISSION',
      actor: 'SYSTEM',
      details: `${role} ${screen} ${action}=${value}`,
    });
  },
};
