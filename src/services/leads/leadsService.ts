import { apiClient } from '../apiClient';
import { Lead, LeadFormData } from '../types/lead.types';

type UserRole = 'ADMIN' | 'DSA' | 'AGENT';

interface LeadApiResponse {
  id: number;
  leadCode: string;
  customerName: string;
  mobile: string;
  email: string;
  loanType: Lead['loanType'];
  loanAmount: number;
  status: Lead['status'];
  source: Lead['source'];
  city: string;
  state: string;
  dsaName?: string;
  agentName?: string;
  createdAt: string;
  updatedAt: string;
}

const mapLeadFromApi = (item: LeadApiResponse): Lead => ({
  id: String(item.id),
  leadId: item.leadCode,
  customerName: item.customerName,
  mobile: item.mobile,
  email: item.email,
  loanType: item.loanType,
  loanAmount: Number(item.loanAmount),
  status: item.status,
  source: item.source,
  city: item.city,
  state: item.state,
  dsaName: item.dsaName,
  agentName: item.agentName,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const scopeByRole = (leads: Lead[], role: UserRole): Lead[] => {
  if (role === 'ADMIN') {
    return leads;
  }

  if (role === 'DSA') {
    return leads.filter((lead) => lead.dsaName === 'Prime DSA');
  }

  return leads.filter((lead) => lead.agentName === 'Field Agent Kumar');
};

export const leadsService = {
  getAllLeads: async (role: UserRole = 'ADMIN'): Promise<Lead[]> => {
    const data = await apiClient.get<LeadApiResponse[]>('/leads');
    const leads = data.map(mapLeadFromApi);
    return scopeByRole(leads, role).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getLeadById: async (id: string): Promise<Lead | null> => {
    try {
      const data = await apiClient.get<LeadApiResponse>(`/leads/${id}`);
      return mapLeadFromApi(data);
    } catch {
      return null;
    }
  },

  createLead: async (formData: LeadFormData): Promise<Lead> => {
    const payload = {
      ...formData,
      dsaName: 'Prime DSA',
      agentName: 'Field Agent Kumar',
    };
    const data = await apiClient.post<LeadApiResponse>('/leads', payload);
    return mapLeadFromApi(data);
  },

  updateLead: async (
    id: string,
    updateData: Partial<LeadFormData & Pick<Lead, 'status'>>
  ): Promise<Lead> => {
    if (updateData.status) {
      const data = await apiClient.put<LeadApiResponse>(`/leads/${id}/status`, {
        status: updateData.status,
      });
      return mapLeadFromApi(data);
    }

    const data = await apiClient.put<LeadApiResponse>(`/leads/${id}`, updateData);
    return mapLeadFromApi(data);
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  resetLeads: (): void => {
    // No-op in API mode.
  },
};
