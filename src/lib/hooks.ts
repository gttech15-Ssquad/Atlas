import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";

// Virtual Cards Queries
export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await apiClient.getCards();
      const data = res.data;
      return data.items ?? data;
    },
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ["cards", id],
    queryFn: async () => {
      const res = await apiClient.getCard(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.createCard(data);
      return res.data;
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
      const res = await apiClient.updateCard(id, data);
      return res.data;
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
      const res = await apiClient.deleteCard(id);
      return res.data;
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
      const res = await apiClient.freezeCard(id);
      return res.data;
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
      // Submit an approval request to the backend
      const res = await apiClient.submitApproval(cardId, role, "");
      return res.data;
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
      // If filters include cardId, call card transactions endpoint
      if (filters?.cardId) {
        const res = await apiClient.getTransactions({
          cardId: filters.cardId,
          pageSize: filters.pageSize ?? 20,
        });
        const data = res.data;
        return data.items ?? data;
      }
      // Fallback to account transactions
      const res = await apiClient.getTransactions(filters);
      const data = res.data;
      return data.items ?? data;
    },
  });
}

// Accounts Queries
export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await apiClient.getAccounts();
      const data = res.data;
      return data.items ?? data;
    },
  });
}

// Subscriptions Queries
export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await apiClient.getSubscriptions();
      const data = res.data;
      return data.items ?? data;
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      const res = await apiClient.updateSubscriptionStatus(id, status);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

// Dashboard summary (accountbalance/summary)
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      const res = await apiClient.getAccountSummary();
      return res.data;
    },
  });
}

// Recent transactions for dashboard
export function useRecentTransactions({ pageSize = 5 } = {}) {
  return useQuery({
    queryKey: ["recentTransactions", pageSize],
    queryFn: async () => {
      const res = await apiClient.getAccountTransactions({
        pageNumber: 1,
        pageSize,
      });
      const data = res.data;
      return data.items ?? data;
    },
  });
}

// Approvals
export function usePendingApprovals() {
  return useQuery({
    queryKey: ["approvals", "pending"],
    queryFn: async () => {
      const res = await apiClient.getPendingApprovals();
      const data = res.data;
      return data.items ?? data;
    },
  });
}

export function useProcessApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      approve,
      comment,
    }: {
      id: string;
      approve: boolean;
      comment?: string;
    }) => {
      if (approve) {
        const res = await apiClient.approveApproval(id, comment);
        return res.data;
      } else {
        const res = await apiClient.rejectApproval(id, comment);
        return res.data;
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["approvals", "pending"] }),
  });
}

// Organization members / users
export function useOrganizationMembers(orgId?: string) {
  return useQuery({
    queryKey: ["organizationMembers", orgId],
    queryFn: async () => {
      if (!orgId) return [] as any[];
      const res = await apiClient.getOrganizationMembers(orgId);
      const data = res.data;
      // Backend returns OrganizationMembersResponse with Members field
      return data.members ?? data.items ?? data;
    },
    enabled: !!orgId,
  });
}

// Audit logs
export function useAuditLogs(params?: any) {
  return useQuery({
    queryKey: ["auditLogs", params ?? {}],
    queryFn: async () => {
      const res = await apiClient.getAuditLogs(params);
      const data = res.data;
      return data.items ?? data;
    },
  });
}
