type Role = 'ADMIN' | 'DSA' | 'AGENT';
type PermissionAction = 'view' | 'create' | 'edit' | 'approve' | 'export';

interface PermissionEntry {
  screen: string;
  actions: Record<PermissionAction, boolean>;
}

const UAM_KEY = 'dsa_uam_permissions_data';

const defaultPermissions: Record<Role, PermissionEntry[]> = {
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

const readPermissions = (): Record<Role, PermissionEntry[]> => {
  const raw = localStorage.getItem(UAM_KEY);
  if (!raw) {
    return defaultPermissions;
  }

  try {
    const parsed = JSON.parse(raw) as Record<Role, PermissionEntry[]>;
    return {
      ADMIN: parsed.ADMIN || defaultPermissions.ADMIN,
      DSA: parsed.DSA || defaultPermissions.DSA,
      AGENT: parsed.AGENT || defaultPermissions.AGENT,
    };
  } catch {
    return defaultPermissions;
  }
};

export const permissionService = {
  hasPermission: (
    role: Role,
    screen: string,
    action: PermissionAction = 'view'
  ): boolean => {
    const rolePermissions = readPermissions()[role] || [];
    const entry = rolePermissions.find((item) => item.screen === screen);
    if (!entry) {
      return true;
    }
    return Boolean(entry.actions[action]);
  },
};
