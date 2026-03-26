import { AuditLogEntry } from '../types/audit.types';

const AUDIT_LOG_KEY = 'dsa_audit_logs';
const AUDIT_RETENTION_DAYS_KEY = 'dsa_audit_retention_days';
const DEFAULT_RETENTION_DAYS = 2555;

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

let logs = readStorage<AuditLogEntry[]>(AUDIT_LOG_KEY, []);

const purgeByDays = (days: number): number => {
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  const before = logs.length;
  logs = logs.filter((entry) => new Date(entry.createdAt).getTime() >= threshold);
  writeStorage(AUDIT_LOG_KEY, logs);
  return before - logs.length;
};

export const auditService = {
  addLog: (payload: Omit<AuditLogEntry, 'id' | 'createdAt'>): void => {
    const record: AuditLogEntry = {
      ...payload,
      id: `AUD_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    logs = [record, ...logs];
    writeStorage(AUDIT_LOG_KEY, logs);
  },

  getLogs: async (): Promise<AuditLogEntry[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 120));
    return [...logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getRetentionDays: (): number => {
    const raw = localStorage.getItem(AUDIT_RETENTION_DAYS_KEY);
    if (!raw) {
      return DEFAULT_RETENTION_DAYS;
    }
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_RETENTION_DAYS;
  },

  setRetentionDays: (days: number): void => {
    localStorage.setItem(AUDIT_RETENTION_DAYS_KEY, String(days));
  },

  purgeByRetentionPolicy: (): number => {
    const days = auditService.getRetentionDays();
    return purgeByDays(days);
  },

  purgeByDays: (days: number): number => purgeByDays(days),
};

