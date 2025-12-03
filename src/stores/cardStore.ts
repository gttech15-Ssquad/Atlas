import { create } from "zustand";

export interface VirtualCard {
  id: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardName: string;
  department: string;
  status: "active" | "frozen" | "disabled" | "expired";
  hardLimit: number;
  softLimit: number;
  currentSpending: number;
  createdAt: string;
  approvedBy: { ceo?: boolean; cfo?: boolean };
  merchantWhitelist: string[];
  allowInternational: boolean;
}

export interface CardApprovalRequest {
  id: string;
  cardId?: string;
  action: "create" | "modify" | "freeze" | "unfreeze" | "delete";
  status:
    | "pending"
    | "ceoApproved"
    | "cfoPending"
    | "ceoPending"
    | "approved"
    | "rejected";
  ceoApproved: boolean;
  cfoApproved: boolean;
  requesterEmail: string;
  requestedAt: string;
  details: Record<string, any>;
  rejectionReason?: string;
}

export interface CardStore {
  cards: VirtualCard[];
  approvals: CardApprovalRequest[];
  addCard: (card: VirtualCard) => void;
  updateCard: (id: string, updates: Partial<VirtualCard>) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => VirtualCard | undefined;
  getAllCards: () => VirtualCard[];

  createApprovalRequest: (request: CardApprovalRequest) => void;
  approveRequest: (id: string, role: "CEO" | "CFO") => void;
  rejectRequest: (id: string, reason: string) => void;
  getPendingApprovals: () => CardApprovalRequest[];
  getApprovalById: (id: string) => CardApprovalRequest | undefined;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  approvals: [],

  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ),
    })),
  deleteCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),
  getCard: (id) => get().cards.find((card) => card.id === id),
  getAllCards: () => get().cards,

  createApprovalRequest: (request) =>
    set((state) => ({
      approvals: [...state.approvals, request],
    })),
  approveRequest: (id, role) =>
    set((state) => ({
      approvals: state.approvals.map((approval) => {
        if (approval.id === id) {
          const updated = { ...approval };
          if (role === "CEO") updated.ceoApproved = true;
          if (role === "CFO") updated.cfoApproved = true;

          if (updated.ceoApproved && updated.cfoApproved) {
            updated.status = "approved";
          } else if (updated.ceoApproved) {
            updated.status = "cfoPending";
          } else if (updated.cfoApproved) {
            updated.status = "ceoPending";
          }
          return updated;
        }
        return approval;
      }),
    })),
  rejectRequest: (id, reason) =>
    set((state) => ({
      approvals: state.approvals.map((approval) =>
        approval.id === id
          ? { ...approval, status: "rejected", rejectionReason: reason }
          : approval
      ),
    })),
  getPendingApprovals: () =>
    get().approvals.filter(
      (a) =>
        a.status === "pending" ||
        a.status === "ceoPending" ||
        a.status === "cfoPending"
    ),
  getApprovalById: (id) => get().approvals.find((a) => a.id === id),
}));
