import { LoanType } from './lead.types';

export type ApplicationStatus = 'LOGGED_IN' | 'DOCS_PENDING' | 'DOCS_VERIFIED';
export type DocumentVerificationStatus = 'PENDING' | 'VERIFIED' | 'NOT_CLEAR';

export interface LoanApplication {
  id: string;
  applicationNo: string;
  leadId: string;
  customerName: string;
  loanType: LoanType;
  requestedAmount: number;
  eligibleAmount: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EligibilityInput {
  monthlyIncome: number;
  monthlyObligations: number;
  cibilScore: number;
}

export interface ApplicationFormData {
  leadId: string;
  requestedAmount: number;
  monthlyIncome: number;
  monthlyObligations: number;
  cibilScore: number;
  panNumber?: string;
  ckycNumber?: string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  docType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verificationStatus: DocumentVerificationStatus;
  isAadhaarMasked?: boolean;
  remarks?: string;
}
