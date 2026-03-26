import { CommissionRecord, PayoutBatch } from '../types/commission.types';
import { apiClient } from '../apiClient';

interface CommissionApiResponse {
  id: number;
  applicationId: number;
  applicationNo: string;
  customerName: string;
  dsaName: string;
  agentName: string;
  disbursedAmount: number;
  commissionPct: number;
  commissionAmount: number;
  gstRate: number;
  gstAmount: number;
  tdsRate: number;
  tdsAmount: number;
  netPayout: number;
  payoutStatus: CommissionRecord['payoutStatus'];
  payoutDate?: string;
  payoutBatchId?: string;
  createdAt: string;
}

interface PayoutBatchApiResponse {
  id: number;
  batchCode: string;
  recordCount: number;
  totalAmount: number;
  generatedAt: string;
}

const mapCommissionFromApi = (item: CommissionApiResponse): CommissionRecord => ({
  id: String(item.id),
  applicationId: String(item.applicationId),
  applicationNo: item.applicationNo,
  customerName: item.customerName,
  dsaName: item.dsaName,
  agentName: item.agentName,
  disbursedAmount: Number(item.disbursedAmount),
  commissionPct: Number(item.commissionPct),
  commissionAmount: Number(item.commissionAmount),
  gstRate: Number(item.gstRate),
  gstAmount: Number(item.gstAmount),
  tdsRate: Number(item.tdsRate),
  tdsAmount: Number(item.tdsAmount),
  netPayout: Number(item.netPayout),
  payoutStatus: item.payoutStatus,
  payoutDate: item.payoutDate,
  payoutBatchId: item.payoutBatchId,
  createdAt: item.createdAt,
});

const mapBatchFromApi = (item: PayoutBatchApiResponse): PayoutBatch => ({
  id: item.batchCode,
  recordIds: [],
  recordCount: Number(item.recordCount),
  totalAmount: Number(item.totalAmount),
  generatedAt: item.generatedAt,
});

export const commissionService = {
  syncCommissionRecords: async (): Promise<void> => {
    await apiClient.post('/commissions/sync');
  },

  getCommissionRecords: async (): Promise<CommissionRecord[]> => {
    const data = await apiClient.get<CommissionApiResponse[]>('/commissions');
    return data
      .map(mapCommissionFromApi)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPayoutBatches: async (): Promise<PayoutBatch[]> => {
    const data = await apiClient.get<PayoutBatchApiResponse[]>('/commissions/batches');
    return data.map(mapBatchFromApi);
  },

  markAsPaid: async (id: string): Promise<void> => {
    await apiClient.post(`/commissions/${id}/pay`);
  },

  generatePayoutBatch: async (): Promise<PayoutBatch | null> => {
    try {
      const data = await apiClient.post<PayoutBatchApiResponse>('/commissions/batch-payout');
      return mapBatchFromApi(data);
    } catch (error) {
      const message = (error as Error).message || '';
      if (message.toLowerCase().includes('no pending commission')) {
        return null;
      }
      throw error;
    }
  },
};
