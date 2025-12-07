/**
 * Transaction Store - Zustand Store for Transaction Management
 * Manages transaction state and operations
 */

import { create } from "zustand";
import { apiClient } from "@/lib/api-client-v2";
import {
  Transaction,
  TransactionSummary,
  CreateTransactionRequest,
  CompleteTransactionRequest,
  ReverseTransactionRequest,
  DisputeTransactionRequest,
  PaginationParams,
} from "@/types";

interface TransactionStoreState {
  // State
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  transactionSummary: TransactionSummary | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  currentCardId: number | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    total: number;
  };

  // Actions
  setCurrentCard: (cardId: number) => void;
  fetchCardTransactions: (
    cardId: number,
    params?: PaginationParams
  ) => Promise<void>;
  fetchTransaction: (transactionId: number) => Promise<void>;
  fetchTransactionSummary: (
    cardId: number,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;
  createTransaction: (
    cardId: number,
    data: CreateTransactionRequest
  ) => Promise<void>;
  completeTransaction: (
    transactionId: number,
    data?: CompleteTransactionRequest
  ) => Promise<void>;
  reverseTransaction: (
    transactionId: number,
    data: ReverseTransactionRequest
  ) => Promise<void>;
  disputeTransaction: (
    transactionId: number,
    data: DisputeTransactionRequest
  ) => Promise<void>;
  selectTransaction: (transaction: Transaction | null) => void;
  setPagination: (pageNumber: number, pageSize: number) => void;
  clearError: () => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useTransactionStore = create<TransactionStoreState>(
  (set, get) => ({
    // Initial state
    transactions: [],
    selectedTransaction: null,
    transactionSummary: null,
    isLoading: false,
    isFetching: false,
    error: null,
    currentCardId: null,
    pagination: {
      pageNumber: 1,
      pageSize: 20,
      total: 0,
    },

    // Actions
    setCurrentCard: (cardId: number) => {
      set({ currentCardId: cardId });
    },

    fetchCardTransactions: async (
      cardId: number,
      params?: PaginationParams
    ) => {
      set({ isLoading: true, error: null, currentCardId: cardId });
      try {
        const response = await apiClient.getCardTransactions(cardId, params);
        set({
          transactions: response.items,
          pagination: {
            pageNumber: response.pageNumber,
            pageSize: response.pageSize,
            total: response.total,
          },
          isLoading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch transactions",
          isLoading: false,
        });
        throw error;
      }
    },

    fetchTransaction: async (transactionId: number) => {
      set({ isFetching: true, error: null });
      try {
        const transaction = await apiClient.getTransaction(transactionId);
        set({ selectedTransaction: transaction, isFetching: false });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch transaction",
          isFetching: false,
        });
        throw error;
      }
    },

    fetchTransactionSummary: async (
      cardId: number,
      startDate?: string,
      endDate?: string
    ) => {
      set({ isFetching: true, error: null });
      try {
        const summary = await apiClient.getTransactionSummary(
          cardId,
          startDate,
          endDate
        );
        set({ transactionSummary: summary, isFetching: false });
      } catch (error: any) {
        set({
          error: error.message || "Failed to fetch transaction summary",
          isFetching: false,
        });
        throw error;
      }
    },

    createTransaction: async (
      cardId: number,
      data: CreateTransactionRequest
    ) => {
      set({ isLoading: true, error: null });
      try {
        const newTransaction = await apiClient.createTransaction(cardId, data);
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.message || "Failed to create transaction",
          isLoading: false,
        });
        throw error;
      }
    },

    completeTransaction: async (
      transactionId: number,
      data?: CompleteTransactionRequest
    ) => {
      set({ isLoading: true, error: null });
      try {
        await apiClient.completeTransaction(transactionId, data);
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === transactionId
              ? { ...txn, status: "COMPLETED" as const }
              : txn
          ),
          selectedTransaction:
            state.selectedTransaction?.id === transactionId
              ? { ...state.selectedTransaction, status: "COMPLETED" as const }
              : state.selectedTransaction,
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.message || "Failed to complete transaction",
          isLoading: false,
        });
        throw error;
      }
    },

    reverseTransaction: async (
      transactionId: number,
      data: ReverseTransactionRequest
    ) => {
      set({ isLoading: true, error: null });
      try {
        await apiClient.reverseTransaction(transactionId, data);
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === transactionId
              ? { ...txn, status: "REVERSED" as const }
              : txn
          ),
          selectedTransaction:
            state.selectedTransaction?.id === transactionId
              ? { ...state.selectedTransaction, status: "REVERSED" as const }
              : state.selectedTransaction,
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.message || "Failed to reverse transaction",
          isLoading: false,
        });
        throw error;
      }
    },

    disputeTransaction: async (
      transactionId: number,
      data: DisputeTransactionRequest
    ) => {
      set({ isLoading: true, error: null });
      try {
        await apiClient.disputeTransaction(transactionId, data);
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === transactionId
              ? { ...txn, status: "DISPUTED" as const }
              : txn
          ),
          selectedTransaction:
            state.selectedTransaction?.id === transactionId
              ? { ...state.selectedTransaction, status: "DISPUTED" as const }
              : state.selectedTransaction,
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.message || "Failed to dispute transaction",
          isLoading: false,
        });
        throw error;
      }
    },

    selectTransaction: (transaction: Transaction | null) => {
      set({ selectedTransaction: transaction });
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
        transactions: [],
        selectedTransaction: null,
        transactionSummary: null,
        isLoading: false,
        isFetching: false,
        error: null,
        currentCardId: null,
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 0,
        },
      });
    },
  })
);
