export type DsaApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DsaAgency {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  approvalStatus: DsaApprovalStatus;
  mappedProducts: string[];
  mappedBanks: string[];
  createdAt: string;
}

export interface AgentUser {
  id: string;
  dsaId: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface UamPermission {
  screen: string;
  actions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    approve: boolean;
    export: boolean;
  };
}
