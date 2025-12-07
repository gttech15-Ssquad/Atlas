/**
 * Card Store - Zustand Store for Virtual Card Management
 * Manages virtual card state, balances, limits, and operations
 */

import { create } from "zustand";
import { apiClient } from "@/lib/api-client-v2";
import {
  VirtualCard,
  CardBalance,
  CardLimit,
  CardDetailsResponse,
  CreateCardRequest,
  UpdateCardRequest,
  FreezeCardRequest,
  FundBalanceRequest,
  SetCardLimitRequest,
  SetInternationalTransactionRequest,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

interface CardStoreState {
  // State
  cards: VirtualCard[];
  selectedCard: VirtualCard | null;
  cardDetails: CardDetailsResponse | null;
  cardBalance: CardBalance | null;
  cardLimits: CardLimit[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    total: number;
  };

  // Actions
  fetchCards: (params?: PaginationParams) => Promise<void>;
  fetchCard: (cardId: number) => Promise<void>;
  fetchCardDetails: (cardId: number) => Promise<void>;
  fetchCardBalance: (cardId: number) => Promise<void>;
  fetchCardLimits: (cardId: number) => Promise<void>;
  createCard: (data: CreateCardRequest) => Promise<void>;
  updateCard: (cardId: number, data: UpdateCardRequest) => Promise<void>;
  freezeCard: (cardId: number, reason: string) => Promise<void>;
  unfreezeCard: (cardId: number) => Promise<void>;
  deleteCard: (cardId: number) => Promise<void>;
  setCardLimit: (cardId: number, data: SetCardLimitRequest) => Promise<void>;
  fundCardBalance: (cardId: number, data: FundBalanceRequest) => Promise<void>;
  setInternationalTransactions: (
    cardId: number,
    data: SetInternationalTransactionRequest
  ) => Promise<void>;
  selectCard: (card: VirtualCard | null) => void;
  setPagination: (pageNumber: number, pageSize: number) => void;
  clearError: () => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useCardStore = create<CardStoreState>((set, get) => ({
  // Initial state
  cards: [],
  selectedCard: null,
  cardDetails: null,
  cardBalance: null,
  cardLimits: [],
  isLoading: false,
  isFetching: false,
  error: null,
  pagination: {
    pageNumber: 1,
    pageSize: 20,
    total: 0,
  },

  // Actions
  fetchCards: async (params?: PaginationParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCards(params);
      set({
        cards: response.items,
        pagination: {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          total: response.total,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch cards",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchCard: async (cardId: number) => {
    set({ isFetching: true, error: null });
    try {
      const card = await apiClient.getCard(cardId);
      set({ selectedCard: card, isFetching: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch card",
        isFetching: false,
      });
      throw error;
    }
  },

  fetchCardDetails: async (cardId: number) => {
    set({ isFetching: true, error: null });
    try {
      const details = await apiClient.getCardDetails(cardId);
      set({ cardDetails: details, isFetching: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch card details",
        isFetching: false,
      });
      throw error;
    }
  },

  fetchCardBalance: async (cardId: number) => {
    set({ isFetching: true, error: null });
    try {
      const balance = await apiClient.getCardBalance(cardId);
      set({ cardBalance: balance, isFetching: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch card balance",
        isFetching: false,
      });
      throw error;
    }
  },

  fetchCardLimits: async (cardId: number) => {
    set({ isFetching: true, error: null });
    try {
      const limits = await apiClient.getCardLimits(cardId);
      set({ cardLimits: limits, isFetching: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch card limits",
        isFetching: false,
      });
      throw error;
    }
  },

  createCard: async (data: CreateCardRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newCard = await apiClient.createCard(data);
      set((state) => ({
        cards: [newCard, ...state.cards],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to create card",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCard: async (cardId: number, data: UpdateCardRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCard = await apiClient.updateCard(cardId, data);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? updatedCard : card
        ),
        selectedCard:
          state.selectedCard?.id === cardId ? updatedCard : state.selectedCard,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update card",
        isLoading: false,
      });
      throw error;
    }
  },

  freezeCard: async (cardId: number, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.freezeCard(cardId, { reason });
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, status: "FROZEN" as const } : card
        ),
        selectedCard:
          state.selectedCard?.id === cardId
            ? { ...state.selectedCard, status: "FROZEN" as const }
            : state.selectedCard,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to freeze card",
        isLoading: false,
      });
      throw error;
    }
  },

  unfreezeCard: async (cardId: number) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.unfreezeCard(cardId);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, status: "ACTIVE" as const } : card
        ),
        selectedCard:
          state.selectedCard?.id === cardId
            ? { ...state.selectedCard, status: "ACTIVE" as const }
            : state.selectedCard,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to unfreeze card",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCard: async (cardId: number) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteCard(cardId);
      set((state) => ({
        cards: state.cards.filter((card) => card.id !== cardId),
        selectedCard:
          state.selectedCard?.id === cardId ? null : state.selectedCard,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete card",
        isLoading: false,
      });
      throw error;
    }
  },

  setCardLimit: async (cardId: number, data: SetCardLimitRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newLimit = await apiClient.setCardLimit(cardId, data);
      set((state) => ({
        cardLimits: [...state.cardLimits, newLimit],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to set card limit",
        isLoading: false,
      });
      throw error;
    }
  },

  fundCardBalance: async (cardId: number, data: FundBalanceRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBalance = await apiClient.fundCardBalance(cardId, data);
      set({ cardBalance: updatedBalance, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fund balance",
        isLoading: false,
      });
      throw error;
    }
  },

  setInternationalTransactions: async (
    cardId: number,
    data: SetInternationalTransactionRequest
  ) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.setInternationalTransactions(cardId, data);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId
            ? { ...card, allowInternational: data.allowInternational }
            : card
        ),
        selectedCard:
          state.selectedCard?.id === cardId
            ? {
                ...state.selectedCard,
                allowInternational: data.allowInternational,
              }
            : state.selectedCard,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update international transactions",
        isLoading: false,
      });
      throw error;
    }
  },

  selectCard: (card: VirtualCard | null) => {
    set({ selectedCard: card });
  },

  setPagination: (pageNumber: number, pageSize: number) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        pageNumber,
        pageSize,
      },
    }));
  },

  clearError: () => set({ error: null }),
  setError: (error: string) => set({ error }),

  reset: () => {
    set({
      cards: [],
      selectedCard: null,
      cardDetails: null,
      cardBalance: null,
      cardLimits: [],
      isLoading: false,
      isFetching: false,
      error: null,
      pagination: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
      },
    });
  },
}));
