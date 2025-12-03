import { create } from "zustand";

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  status: "success" | "failed";
  details: Record<string, any>;
  ipAddress?: string;
  browser?: string;
  beforeValue?: any;
  afterValue?: any;
}

export interface AuditStore {
  logs: AuditLog[];
  addLog: (log: AuditLog) => void;
  getAllLogs: () => AuditLog[];
  filterLogs: (filters: {
    startDate?: string;
    endDate?: string;
    action?: string;
    userId?: string;
    status?: "success" | "failed";
  }) => AuditLog[];
  searchLogs: (query: string) => AuditLog[];
}

export const useAuditStore = create<AuditStore>((set, get) => ({
  logs: [],
  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),
  getAllLogs: () => get().logs,
  filterLogs: (filters) => {
    let filtered = get().logs;

    if (filters.startDate) {
      filtered = filtered.filter(
        (log) => new Date(log.timestamp) >= new Date(filters.startDate!)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (log) => new Date(log.timestamp) <= new Date(filters.endDate!)
      );
    }
    if (filters.action) {
      filtered = filtered.filter((log) => log.action.includes(filters.action!));
    }
    if (filters.userId) {
      filtered = filtered.filter((log) => log.userId === filters.userId);
    }
    if (filters.status) {
      filtered = filtered.filter((log) => log.status === filters.status);
    }

    return filtered;
  },
  searchLogs: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().logs.filter(
      (log) =>
        log.action.toLowerCase().includes(lowerQuery) ||
        log.userName.toLowerCase().includes(lowerQuery) ||
        log.entity.toLowerCase().includes(lowerQuery)
    );
  },
}));
