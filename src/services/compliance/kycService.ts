import { apiClient } from '../apiClient';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

export interface KycRecord {
  applicationId: string;
  panNumber?: string;
  ckycNumber?: string;
  panStatus: VerificationStatus;
  ckycStatus: VerificationStatus;
  updatedAt: string;
}

interface KycApiResponse {
  applicationId: number;
  panNumber?: string;
  ckycNumber?: string;
  panStatus: VerificationStatus;
  ckycStatus: VerificationStatus;
  updatedAt: string;
}

const mapKycFromApi = (item: KycApiResponse): KycRecord => ({
  applicationId: String(item.applicationId),
  panNumber: item.panNumber,
  ckycNumber: item.ckycNumber,
  panStatus: item.panStatus,
  ckycStatus: item.ckycStatus,
  updatedAt: item.updatedAt,
});

export const kycService = {
  getKycByApplication: async (applicationId: string): Promise<KycRecord> => {
    const data = await apiClient.get<KycApiResponse>(`/applications/${applicationId}/kyc`);
    return mapKycFromApi(data);
  },

  updateIdentifiers: async (
    applicationId: string,
    payload: { panNumber?: string; ckycNumber?: string }
  ): Promise<KycRecord> => {
    const data = await apiClient.put<KycApiResponse>(`/applications/${applicationId}/kyc`, payload);
    return mapKycFromApi(data);
  },

  verifyPan: async (applicationId: string): Promise<KycRecord> => {
    const data = await apiClient.post<KycApiResponse>(`/applications/${applicationId}/kyc/verify-pan`);
    return mapKycFromApi(data);
  },

  verifyCkyc: async (applicationId: string): Promise<KycRecord> => {
    const data = await apiClient.post<KycApiResponse>(`/applications/${applicationId}/kyc/verify-ckyc`);
    return mapKycFromApi(data);
  },
};
