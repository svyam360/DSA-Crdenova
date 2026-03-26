export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOGGED_IN' | 'CONVERTED' | 'REJECTED';
export type LeadSource = 'WEBSITE' | 'REFERENCE' | 'DIRECT' | 'CAMPAIGN';
export type LoanType = 'HOME' | 'PERSONAL' | 'BUSINESS' | 'CAR' | 'EDUCATION';

export interface Lead {
  id: string;
  leadId: string;
  customerName: string;
  mobile: string;
  email: string;
  loanType: LoanType;
  loanAmount: number;
  status: LeadStatus;
  source: LeadSource;
  dsaName?: string;
  agentName?: string;
  createdAt: string;
  updatedAt: string;
  city: string;
  state: string;
}

export interface LeadFormData {
  customerName: string;
  mobile: string;
  email: string;
  loanType: LoanType;
  loanAmount: number;
  source: LeadSource;
  city: string;
  state: string;
}
