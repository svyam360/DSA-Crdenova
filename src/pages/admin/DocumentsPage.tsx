import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Table, { TableColumn } from '../../components/common/Table';
import { applicationsService } from '../../services/applications/applicationsService';
import { ApplicationDocument, LoanApplication } from '../../services/types/application.types';
import { KycRecord, kycService } from '../../services/compliance/kycService';
import './PhaseOnePages.css';

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'PAN', label: 'PAN Card' },
  { value: 'AADHAAR', label: 'Aadhaar Card' },
  { value: 'BANK_STATEMENT', label: 'Bank Statement' },
  { value: 'INCOME_PROOF', label: 'Income Proof' },
];

const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const DocumentsPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [docType, setDocType] = useState(DOCUMENT_TYPE_OPTIONS[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aadhaarMaskedConfirmed, setAadhaarMaskedConfirmed] = useState(false);
  const [kyc, setKyc] = useState<KycRecord | null>(null);

  useEffect(() => {
    void loadApplications();
  }, []);

  useEffect(() => {
    if (!selectedApplicationId) {
      setDocuments([]);
      setKyc(null);
      return;
    }
    void loadDocuments(selectedApplicationId);
    void loadKyc(selectedApplicationId);
  }, [selectedApplicationId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const apps = await applicationsService.getAllApplications();
      setApplications(apps);
      if (apps.length > 0) {
        setSelectedApplicationId(apps[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (applicationId: string) => {
    const docs = await applicationsService.getDocumentsByApplication(applicationId);
    setDocuments(docs);
  };

  const loadKyc = async (applicationId: string) => {
    const kycData = await kycService.getKycByApplication(applicationId);
    setKyc(kycData);
  };

  const handleUpload = async () => {
    if (!selectedApplicationId || !file) {
      alert('Select application and file first.');
      return;
    }

    try {
      setUploading(true);
      const fileUrl = await toDataUrl(file);
      await applicationsService.uploadDocument(selectedApplicationId, {
        docType,
        fileName: file.name,
        fileUrl,
        isAadhaarMasked: docType === 'AADHAAR' ? aadhaarMaskedConfirmed : undefined,
      });
      setFile(null);
      setAadhaarMaskedConfirmed(false);
      await loadDocuments(selectedApplicationId);
      await loadApplications();
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert((error as Error)?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (docId: string, status: 'PENDING' | 'VERIFIED' | 'NOT_CLEAR') => {
    await applicationsService.updateDocumentVerification(docId, status);
    await loadDocuments(selectedApplicationId);
    await loadApplications();
  };

  const updateKycField = async (field: 'panNumber' | 'ckycNumber', value: string) => {
    if (!selectedApplicationId) return;
    const next = await kycService.updateIdentifiers(selectedApplicationId, { [field]: value });
    setKyc(next);
  };

  const verifyPan = async () => {
    if (!selectedApplicationId) return;
    const next = await kycService.verifyPan(selectedApplicationId);
    setKyc(next);
  };

  const verifyCkyc = async () => {
    if (!selectedApplicationId) return;
    const next = await kycService.verifyCkyc(selectedApplicationId);
    setKyc(next);
  };

  const columns: TableColumn<ApplicationDocument>[] = [
    { key: 'docType', header: 'Document Type' },
    {
      key: 'fileName',
      header: 'File',
      render: (doc) => (
        <a className="phase-doc-link" href={doc.fileUrl} target="_blank" rel="noreferrer">
          {doc.fileName}
        </a>
      ),
    },
    {
      key: 'verificationStatus',
      header: 'Verification',
      render: (doc) => (
        <select
          value={doc.verificationStatus}
          onChange={(event) =>
            updateStatus(doc.id, event.target.value as 'PENDING' | 'VERIFIED' | 'NOT_CLEAR')
          }
        >
          <option value="PENDING">PENDING</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="NOT_CLEAR">NOT CLEAR</option>
        </select>
      ),
    },
    {
      key: 'isAadhaarMasked',
      header: 'Aadhaar Masked',
      render: (doc) => (doc.docType === 'AADHAAR' ? (doc.isAadhaarMasked ? 'YES' : 'NO') : '-'),
    },
    { key: 'uploadedAt', header: 'Uploaded At', render: (doc) => new Date(doc.uploadedAt).toLocaleString('en-IN') },
  ];

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>Document & KYC</h1>
        <p>Upload and verify mandatory application documents</p>
      </div>

      <div className="phase-panel">
        <div className="phase-grid-2">
          <Select
            label="Application"
            value={selectedApplicationId}
            options={applications.map((app) => ({
              value: app.id,
              label: `${app.applicationNo} - ${app.customerName}`,
            }))}
            onChange={(event) => setSelectedApplicationId(event.target.value)}
          />

          <Select
            label="Document Type"
            value={docType}
            options={DOCUMENT_TYPE_OPTIONS}
            onChange={(event) => setDocType(event.target.value)}
          />
        </div>

        <div className="phase-actions" style={{ marginTop: 12 }}>
          <div className="phase-upload-group">
            <input
              className="phase-file-input"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <span className="phase-file-name">{file?.name || 'No file chosen'}</span>
          </div>
          {docType === 'AADHAAR' && (
            <label className="phase-checkbox-label">
              <input
                type="checkbox"
                checked={aadhaarMaskedConfirmed}
                onChange={(event) => setAadhaarMaskedConfirmed(event.target.checked)}
                className="phase-checkbox-input"
              />
              Aadhaar is masked as per UIDAI policy
            </label>
          )}
          <Button onClick={handleUpload} loading={uploading}>
            Upload Document
          </Button>
        </div>
      </div>

      <div className="phase-panel">
        <h3>PAN / CKYC Verification Hooks</h3>
        <div className="phase-grid-2">
          <Input
            label="PAN"
            placeholder="ABCDE1234F"
            value={kyc?.panNumber || ''}
            onChange={(event) => updateKycField('panNumber', event.target.value.toUpperCase())}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={verifyPan}>Verify PAN</Button>
            <span>PAN Status: {kyc?.panStatus || 'PENDING'}</span>
          </div>
          <Input
            label="CKYC Number"
            placeholder="14 digit CKYC number"
            value={kyc?.ckycNumber || ''}
            onChange={(event) => updateKycField('ckycNumber', event.target.value)}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={verifyCkyc}>Verify CKYC</Button>
            <span>CKYC Status: {kyc?.ckycStatus || 'PENDING'}</span>
          </div>
        </div>
      </div>

      <Table data={documents} columns={columns} loading={loading} />
    </div>
  );
};

export default DocumentsPage;
