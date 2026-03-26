import { LoanType } from './lead.types';

export interface RateCard {
  id: string;
  partnerType: 'BANK' | 'NBFC';
  partnerName: string;
  loanType: LoanType;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  processingFeePct: number;
  commissionPct: number;
  tatHours: number;
  isActive: boolean;
}
