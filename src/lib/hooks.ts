import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockCardsData,
  mockTransactionsData,
  mockAccountsData,
  mockSubscriptionsData,
} from "./mock-data";

// Virtual Cards Queries
export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockCardsData;
    },
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ["cards", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockCardsData.find((card) => card.id === id);
    },
    enabled: !!id,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id: `card-${Date.now()}`, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { id, ...data };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["cards", id] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useFreezeCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["cards", id] });
    },
  });
}

export function useApproveCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cardId,
      role,
    }: {
      cardId: string;
      role: "ceo" | "cfo";
      otp: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { cardId, role, approved: true };
    },
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
    },
  });
}

// Transactions Queries
export function useTransactions(filters?: any) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockTransactionsData;
    },
  });
}

// Accounts Queries
export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAccountsData;
    },
  });
}

// Subscriptions Queries
export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockSubscriptionsData;
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}
