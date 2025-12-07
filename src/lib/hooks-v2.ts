/**
 * Custom React Hooks for API Calls with React Query
 * Provides reusable hooks for fetching and mutating data
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client-v2";
import {
  VirtualCard,
  CardDetailsResponse,
  CardBalance,
  CardLimit,
  Transaction,
  CardApproval,
  AuditLog,
  CreateCardRequest,
  UpdateCardRequest,
  FreezeCardRequest,
  FundBalanceRequest,
  SetCardLimitRequest,
  CreateTransactionRequest,
  CompleteTransactionRequest,
  ReverseTransactionRequest,
  DisputeTransactionRequest,
  RequestApprovalRequest,
  ApproveApprovalRequest,
  RejectApprovalRequest,
  AuditLogFilters,
  PaginationParams,
} from "@/types";

// ============================================
// Card Hooks
// ============================================

export function useCards(params?: PaginationParams) {
  return useQuery({
    queryKey: ["cards", params?.pageNumber, params?.pageSize],
    queryFn: () => apiClient.getCards(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCard(cardId: number) {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: () => apiClient.getCard(cardId),
    enabled: !!cardId,
  });
}

export function useCardDetails(cardId: number) {
  return useQuery({
    queryKey: ["cardDetails", cardId],
    queryFn: () => apiClient.getCardDetails(cardId),
    enabled: !!cardId,
  });
}

export function useCardBalance(cardId: number) {
  return useQuery({
    queryKey: ["cardBalance", cardId],
    queryFn: () => apiClient.getCardBalance(cardId),
    enabled: !!cardId,
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

export function useCardLimits(cardId: number) {
  return useQuery({
    queryKey: ["cardLimits", cardId],
    queryFn: () => apiClient.getCardLimits(cardId),
    enabled: !!cardId,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCardRequest) => apiClient.createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: number;
      data: UpdateCardRequest;
    }) => apiClient.updateCard(cardId, data),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cardDetails", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useFreezeCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, reason }: { cardId: number; reason: string }) =>
      apiClient.freezeCard(cardId, { reason }),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cardDetails", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUnfreezeCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: number) => apiClient.unfreezeCard(cardId),
    onSuccess: (_, cardId) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cardDetails", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: number) => apiClient.deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useSetCardLimit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: number;
      data: SetCardLimitRequest;
    }) => apiClient.setCardLimit(cardId, data),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["cardLimits", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cardDetails", cardId] });
    },
  });
}

export function useFundCardBalance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: number;
      data: FundBalanceRequest;
    }) => apiClient.fundCardBalance(cardId, data),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["cardBalance", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cardDetails", cardId] });
    },
  });
}

export function useSetInternationalTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      allowInternational,
      reason,
    }: {
      cardId: number;
      allowInternational: boolean;
      reason?: string;
    }) =>
      apiClient.setInternationalTransactions(cardId, {
        allowInternational,
        reason,
      }),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cardDetails", cardId] });
    },
  });
}

// ============================================
// Transaction Hooks
// ============================================

export function useCardTransactions(cardId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: [
      "cardTransactions",
      cardId,
      params?.pageNumber,
      params?.pageSize,
    ],
    queryFn: () => apiClient.getCardTransactions(cardId, params),
    enabled: !!cardId,
  });
}

export function useTransaction(transactionId: number) {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => apiClient.getTransaction(transactionId),
    enabled: !!transactionId,
  });
}

export function useTransactionSummary(
  cardId: number,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["transactionSummary", cardId, startDate, endDate],
    queryFn: () => apiClient.getTransactionSummary(cardId, startDate, endDate),
    enabled: !!cardId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: number;
      data: CreateTransactionRequest;
    }) => apiClient.createTransaction(cardId, data),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: ["cardTransactions", cardId] });
      queryClient.invalidateQueries({ queryKey: ["cardBalance", cardId] });
      queryClient.invalidateQueries({
        queryKey: ["transactionSummary", cardId],
      });
    },
  });
}

export function useCompleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      data,
    }: {
      transactionId: number;
      data?: CompleteTransactionRequest;
    }) => apiClient.completeTransaction(transactionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["cardTransactions"] });
    },
  });
}

export function useReverseTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
    }: {
      transactionId: number;
      reason: string;
    }) => apiClient.reverseTransaction(transactionId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["cardTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["cardBalance"] });
    },
  });
}

export function useDisputeTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
    }: {
      transactionId: number;
      reason: string;
    }) => apiClient.disputeTransaction(transactionId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["cardTransactions"] });
    },
  });
}

// ============================================
// Approval Hooks
// ============================================

export function usePendingApprovals() {
  return useQuery({
    queryKey: ["pendingApprovals"],
    queryFn: () => apiClient.getPendingApprovals(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useApprovalDetails(approvalId: number) {
  return useQuery({
    queryKey: ["approvalDetails", approvalId],
    queryFn: () => apiClient.getApprovalDetails(approvalId),
    enabled: !!approvalId,
  });
}

export function useApprovalHistory(cardId: number) {
  return useQuery({
    queryKey: ["approvalHistory", cardId],
    queryFn: () => apiClient.getApprovalHistory(cardId),
    enabled: !!cardId,
  });
}

export function useApprovalRequirements(actionType: string) {
  return useQuery({
    queryKey: ["approvalRequirements", actionType],
    queryFn: () => apiClient.getApprovalRequirements(actionType),
    enabled: !!actionType,
  });
}

export function useRequestApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: number;
      data: RequestApprovalRequest;
    }) => apiClient.requestApproval(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["approvalHistory"] });
    },
  });
}

export function useApproveApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      approvalId,
      data,
    }: {
      approvalId: number;
      data?: ApproveApprovalRequest;
    }) => apiClient.approveApproval(approvalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["approvalDetails"] });
      queryClient.invalidateQueries({ queryKey: ["approvalHistory"] });
    },
  });
}

export function useRejectApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      approvalId,
      reason,
    }: {
      approvalId: number;
      reason: string;
    }) => apiClient.rejectApproval(approvalId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["approvalDetails"] });
      queryClient.invalidateQueries({ queryKey: ["approvalHistory"] });
    },
  });
}

// ============================================
// Audit Hooks
// ============================================

export function useAuditLogs(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => apiClient.getAuditLogs(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUserAuditLogs(userId: number) {
  return useQuery({
    queryKey: ["userAuditLogs", userId],
    queryFn: () => apiClient.getUserAuditLogs(userId),
    enabled: !!userId,
  });
}

export function useExportAuditLogs() {
  return useMutation({
    mutationFn: ({
      format,
      startDate,
      endDate,
    }: {
      format?: "csv" | "json";
      startDate?: string;
      endDate?: string;
    }) => apiClient.exportAuditLogs(format, startDate, endDate),
  });
}

// ============================================
// Department Hooks
// ============================================

export function useDepartments(params?: PaginationParams) {
  return useQuery({
    queryKey: ["departments", params?.pageNumber, params?.pageSize],
    queryFn: () => apiClient.getDepartments(params),
  });
}

export function useDepartment(departmentId: number) {
  return useQuery({
    queryKey: ["department", departmentId],
    queryFn: () => apiClient.getDepartment(departmentId),
    enabled: !!departmentId,
  });
}

// ============================================
// Authentication Hooks
// ============================================

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.getProfile(),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiClient.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      apiClient.changePassword(data),
  });
}
