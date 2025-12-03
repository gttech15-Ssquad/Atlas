import { create } from "zustand";
import { CARD_STATUS } from "@/lib/constants";

export interface VirtualCard {
  id: string;
  nickname: string;
  cardNumber: string;
  maskedNumber: string;
  department: string;
  softLimit: number;
  hardLimit: number;
  currentSpend: number;
  status: (typeof CARD_STATUS)[keyof typeof CARD_STATUS];
  expiryDate: string;
  cvv: string;
  merchantCategories: string[];
  internationalTransactions: boolean;
  createdAt: string;
  lastUsed?: string;
  createdBy: string;
  approvedBy?: {
    ceo?: boolean;
    cfo?: boolean;
  };
}

export interface CardApprovalFlow {
  cardId: string;
  ceoApproved: boolean;
  cfoApproved: boolean;
  ceoOTP?: string;
  cfoOTP?: string;
  action: string;
}

interface CardState {
  cards: VirtualCard[];
  selectedCard: VirtualCard | null;
  approvalFlows: CardApprovalFlow[];

  // Actions
  addCard: (card: VirtualCard) => void;
  updateCard: (id: string, updates: Partial<VirtualCard>) => void;
  deleteCard: (id: string) => void;
  selectCard: (id: string) => void;
  freezeCard: (id: string) => void;
  unfreezeCard: (id: string) => void;

  // Approval
  startApprovalFlow: (cardId: string, action: string) => void;
  approveAsCEO: (cardId: string, otp: string) => void;
  approveAsCFO: (cardId: string, otp: string) => void;
  completeApproval: (cardId: string) => void;
  getApprovalFlow: (cardId: string) => CardApprovalFlow | undefined;
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [
    {
      id: "card-001",
      nickname: "Marketing Ops",
      cardNumber: "4929 7892 3456 7890",
      maskedNumber: "**** **** **** 7890",
      department: "Marketing",
      softLimit: 50000,
      hardLimit: 100000,
      currentSpend: 32500,
      status: "active",
      expiryDate: "12/26",
      cvv: "***",
      merchantCategories: ["Retail", "Online Shopping", "Airlines"],
      internationalTransactions: true,
      createdAt: "2024-01-15",
      lastUsed: "2024-11-28",
      createdBy: "Admin User",
      approvedBy: { ceo: true, cfo: true },
    },
    {
      id: "card-002",
      nickname: "IT Department",
      cardNumber: "4929 1234 5678 9012",
      maskedNumber: "**** **** **** 9012",
      department: "IT",
      softLimit: 75000,
      hardLimit: 150000,
      currentSpend: 45000,
      status: "active",
      expiryDate: "08/26",
      cvv: "***",
      merchantCategories: ["Telecommunications", "Online Shopping", "Software"],
      internationalTransactions: false,
      createdAt: "2024-02-20",
      lastUsed: "2024-11-27",
      createdBy: "Admin User",
      approvedBy: { ceo: true, cfo: true },
    },
    {
      id: "card-003",
      nickname: "Finance Compliance",
      cardNumber: "4929 5555 6666 7777",
      maskedNumber: "**** **** **** 7777",
      department: "Finance",
      softLimit: 100000,
      hardLimit: 250000,
      currentSpend: 89000,
      status: "frozen",
      expiryDate: "06/25",
      cvv: "***",
      merchantCategories: ["Retail", "Hotels", "Utilities"],
      internationalTransactions: true,
      createdAt: "2024-03-10",
      lastUsed: "2024-11-25",
      createdBy: "Admin User",
      approvedBy: { ceo: true, cfo: true },
    },
  ],
  selectedCard: null,
  approvalFlows: [],

  addCard: (card: VirtualCard) => {
    set((state) => ({
      cards: [...state.cards, card],
    }));
  },

  updateCard: (id: string, updates: Partial<VirtualCard>) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ),
    }));
  },

  deleteCard: (id: string) => {
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
      selectedCard: state.selectedCard?.id === id ? null : state.selectedCard,
    }));
  },

  selectCard: (id: string) => {
    const card = get().cards.find((c) => c.id === id);
    set({ selectedCard: card || null });
  },

  freezeCard: (id: string) => {
    get().updateCard(id, { status: "frozen" });
  },

  unfreezeCard: (id: string) => {
    get().updateCard(id, { status: "active" });
  },

  startApprovalFlow: (cardId: string, action: string) => {
    const existing = get().approvalFlows.find((f) => f.cardId === cardId);
    if (!existing) {
      set((state) => ({
        approvalFlows: [
          ...state.approvalFlows,
          {
            cardId,
            ceoApproved: false,
            cfoApproved: false,
            action,
          },
        ],
      }));
    }
  },

  approveAsCEO: (cardId: string, otp: string) => {
    set((state) => ({
      approvalFlows: state.approvalFlows.map((flow) =>
        flow.cardId === cardId
          ? { ...flow, ceoApproved: true, ceoOTP: otp }
          : flow
      ),
    }));
  },

  approveAsCFO: (cardId: string, otp: string) => {
    set((state) => ({
      approvalFlows: state.approvalFlows.map((flow) =>
        flow.cardId === cardId
          ? { ...flow, cfoApproved: true, cfoOTP: otp }
          : flow
      ),
    }));
  },

  completeApproval: (cardId: string) => {
    set((state) => ({
      approvalFlows: state.approvalFlows.filter((f) => f.cardId !== cardId),
    }));
  },

  getApprovalFlow: (cardId: string) => {
    return get().approvalFlows.find((f) => f.cardId === cardId);
  },
}));
