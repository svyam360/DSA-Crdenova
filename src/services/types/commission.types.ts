export type PayoutStatus = 'PENDING' | 'PAID';

export interface CommissionRecord {
  id: string;
  applicationId: string;
  applicationNo: string;
  customerName: string;
  dsaName: string;
  agentName: string;
  disbursedAmount: number;
  commissionPct: number;
  commissionAmount: number;
  gstRate?: number;
  gstAmount?: number;
  tdsRate?: number;
  tdsAmount?: number;
  netPayout?: number;
  payoutStatus: PayoutStatus;
  payoutDate?: string;
  payoutBatchId?: string;
  createdAt: string;
}

export interface PayoutBatch {
  id: string;
  recordIds: string[];
  recordCount: number;
  totalAmount: number;
  generatedAt: string;
}
