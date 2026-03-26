import { LoanType } from '../types/lead.types';
import { RateCard } from '../types/rateCard.types';

const RATE_CARD_KEY = 'dsa_rate_cards';

const seedRateCards: RateCard[] = [
  {
    id: 'RC_001',
    partnerType: 'BANK',
    partnerName: 'HDFC Bank',
    loanType: 'HOME',
    minAmount: 500000,
    maxAmount: 15000000,
    interestRate: 8.65,
    processingFeePct: 0.5,
    commissionPct: 0.8,
    tatHours: 72,
    isActive: true,
  },
  {
    id: 'RC_002',
    partnerType: 'BANK',
    partnerName: 'ICICI Bank',
    loanType: 'PERSONAL',
    minAmount: 100000,
    maxAmount: 3000000,
    interestRate: 11.9,
    processingFeePct: 1.2,
    commissionPct: 1.2,
    tatHours: 36,
    isActive: true,
  },
  {
    id: 'RC_003',
    partnerType: 'NBFC',
    partnerName: 'Bajaj Finserv',
    loanType: 'BUSINESS',
    minAmount: 300000,
    maxAmount: 10000000,
    interestRate: 13.5,
    processingFeePct: 1.5,
    commissionPct: 1.1,
    tatHours: 48,
    isActive: true,
  },
];

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

let rateCards = readStorage<RateCard[]>(RATE_CARD_KEY, seedRateCards);

export const rateCardService = {
  getAllRateCards: async (): Promise<RateCard[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 120));
    return [...rateCards];
  },

  upsertRateCard: async (payload: Omit<RateCard, 'id'> & { id?: string }): Promise<RateCard> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 120));
    const record: RateCard = {
      ...payload,
      id: payload.id || `RC_${Date.now()}`,
    };
    rateCards = [record, ...rateCards.filter((item) => item.id !== record.id)];
    writeStorage(RATE_CARD_KEY, rateCards);
    return record;
  },

  getEligibleOffers: async (loanType: LoanType, amount: number): Promise<RateCard[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
    return rateCards
      .filter((card) => card.isActive)
      .filter((card) => card.loanType === loanType)
      .filter((card) => amount >= card.minAmount && amount <= card.maxAmount)
      .sort((a, b) => a.interestRate - b.interestRate || a.tatHours - b.tatHours);
  },
};

