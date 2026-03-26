export interface AuditLogEntry {
  id: string;
  module: string;
  action: string;
  actor: string;
  details: string;
  createdAt: string;
}
