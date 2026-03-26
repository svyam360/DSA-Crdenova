import { apiClient } from '../apiClient';
import {
  ApplicationDocument,
  ApplicationFormData,
  DocumentVerificationStatus,
  EligibilityInput,
  LoanApplication,
} from '../types/application.types';

interface LoanApplicationApiResponse {
  id: number;
  applicationNo: string;
  leadId: number;
  customerName: string;
  loanType: LoanApplication['loanType'];
  requestedAmount: number;
  eligibleAmount: number;
  status: LoanApplication['status'];
  createdAt: string;
  updatedAt: string;
}

interface DocumentApiResponse {
  id: number;
  applicationId: number;
  docType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verificationStatus: DocumentVerificationStatus;
  aadhaarMasked?: boolean;
  remarks?: string;
}

const mapApplicationFromApi = (item: LoanApplicationApiResponse): LoanApplication => ({
  id: String(item.id),
  applicationNo: item.applicationNo,
  leadId: String(item.leadId),
  customerName: item.customerName,
  loanType: item.loanType,
  requestedAmount: Number(item.requestedAmount),
  eligibleAmount: Number(item.eligibleAmount),
  status: item.status,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapDocumentFromApi = (item: DocumentApiResponse): ApplicationDocument => ({
  id: String(item.id),
  applicationId: String(item.applicationId),
  docType: item.docType,
  fileName: item.fileName,
  fileUrl: item.fileUrl,
  uploadedAt: item.uploadedAt,
  verificationStatus: item.verificationStatus,
  isAadhaarMasked: item.aadhaarMasked,
  remarks: item.remarks,
});

export const applicationsService = {
  evaluateEligibility: (input: EligibilityInput) => {
    const foir = input.monthlyIncome > 0 ? (input.monthlyObligations / input.monthlyIncome) * 100 : 0;
    const eligible = foir <= 60 && input.cibilScore >= 700;
    const monthlySurplus = Math.max(input.monthlyIncome - input.monthlyObligations, 0);
    const recommendedAmount = Math.max(Math.round(monthlySurplus * 50_000), 0);

    return {
      foir,
      eligible,
      recommendedAmount,
    };
  },

  getAllApplications: async (): Promise<LoanApplication[]> => {
    const data = await apiClient.get<LoanApplicationApiResponse[]>('/applications');
    return data
      .map(mapApplicationFromApi)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  createApplication: async (formData: ApplicationFormData): Promise<LoanApplication> => {
    const payload = {
      ...formData,
      leadId: Number(formData.leadId),
    };

    const data = await apiClient.post<LoanApplicationApiResponse>('/applications', payload);
    return mapApplicationFromApi(data);
  },

  getDocumentsByApplication: async (applicationId: string): Promise<ApplicationDocument[]> => {
    const data = await apiClient.get<DocumentApiResponse[]>(`/applications/${applicationId}/documents`);
    return data.map(mapDocumentFromApi);
  },

  uploadDocument: async (
    applicationId: string,
    payload: { docType: string; fileName: string; fileUrl: string; isAadhaarMasked?: boolean }
  ): Promise<ApplicationDocument> => {
    const data = await apiClient.post<DocumentApiResponse>(`/applications/${applicationId}/documents`, {
      docType: payload.docType,
      fileName: payload.fileName,
      fileUrl: payload.fileUrl,
      aadhaarMasked: payload.isAadhaarMasked,
    });

    return mapDocumentFromApi(data);
  },

  updateDocumentVerification: async (
    documentId: string,
    status: DocumentVerificationStatus,
    remarks?: string
  ): Promise<ApplicationDocument> => {
    const data = await apiClient.put<DocumentApiResponse>(`/documents/${documentId}/verify`, {
      status,
      remarks,
    });

    return mapDocumentFromApi(data);
  },
};
