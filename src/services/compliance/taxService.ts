import { CommissionRecord } from '../types/commission.types';

export interface GstInvoice {
  id: string;
  invoiceNo: string;
  commissionRecordId: string;
  applicationNo: string;
  customerName: string;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  grossAmount: number;
  tdsRate: number;
  tdsAmount: number;
  netPayable: number;
  generatedAt: string;
}

const GST_INVOICE_KEY = 'dsa_gst_invoices';
export const DEFAULT_GST_RATE = 18;
export const DEFAULT_TDS_194H_RATE = 5;

const readStorage = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

let invoices = readStorage<GstInvoice[]>(GST_INVOICE_KEY, []);

const toTwo = (value: number): number => Math.round(value * 100) / 100;

export const taxService = {
  calculatePayout: (commissionAmount: number, gstRate = DEFAULT_GST_RATE, tdsRate = DEFAULT_TDS_194H_RATE) => {
    const gstAmount = toTwo((commissionAmount * gstRate) / 100);
    const grossAmount = toTwo(commissionAmount + gstAmount);
    const tdsAmount = toTwo((commissionAmount * tdsRate) / 100);
    const netPayable = toTwo(grossAmount - tdsAmount);
    return { gstAmount, grossAmount, tdsAmount, netPayable };
  },

  generateInvoiceFromCommission: async (record: CommissionRecord): Promise<GstInvoice> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 150));
    const calc = taxService.calculatePayout(
      record.commissionAmount,
      record.gstRate ?? DEFAULT_GST_RATE,
      record.tdsRate ?? DEFAULT_TDS_194H_RATE
    );
    const invoice: GstInvoice = {
      id: `INV_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      invoiceNo: `GST-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(5, '0')}`,
      commissionRecordId: record.id,
      applicationNo: record.applicationNo,
      customerName: record.customerName,
      taxableAmount: record.commissionAmount,
      gstRate: record.gstRate ?? DEFAULT_GST_RATE,
      gstAmount: calc.gstAmount,
      grossAmount: calc.grossAmount,
      tdsRate: record.tdsRate ?? DEFAULT_TDS_194H_RATE,
      tdsAmount: calc.tdsAmount,
      netPayable: calc.netPayable,
      generatedAt: new Date().toISOString(),
    };

    invoices = [invoice, ...invoices];
    writeStorage(GST_INVOICE_KEY, invoices);
    return invoice;
  },

  getInvoices: async (): Promise<GstInvoice[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
    return [...invoices];
  },
};

