/**
 * Type definitions for VirtupayCorpAPI integration
 * Auto-generated from backend documentation
 */

// ============================================
// Authentication Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  departmentId?: number;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  createdAt: string;
}

// ============================================
// User Types
// ============================================

export type UserRole = "CEO" | "CFO" | "Admin" | "Delegate" | "Auditor";
export type UserStatus = "Active" | "Suspended" | "Inactive";

// ============================================
// Virtual Card Types
// ============================================

export interface CreateCardRequest {
  cardholderName: string;
  nickname?: string;
  departmentId?: number;
  cardType?: string;
  currency?: string;
  allowInternational?: boolean;
}

export interface UpdateCardRequest {
  nickname?: string;
  allowInternational?: boolean;
  status?: CardStatus;
}

export interface VirtualCard {
  id: number;
  cardNumber: string;
  cardholderName: string;
  nickname?: string;
  expiryDate: string;
  status: CardStatus;
  cardType: string;
  currency: string;
  allowInternational: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardDetailsResponse {
  card: VirtualCard;
  balance: CardBalance;
  limits: CardLimit[];
}

export interface CardBalance {
  availableBalance: number;
  reservedBalance: number;
  usedBalance: number;
  totalBalance: number;
  currency: string;
  percentageUsed: number;
  lastUpdated: string;
}

export interface CardLimit {
  id: number;
  cardId: number;
  limitType: LimitType;
  amount: number;
  period: LimitPeriod;
  threshold: number;
  usedAmount: number;
  availableAmount: number;
  percentageUsed: number;
  isWarningReached: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface SetCardLimitRequest {
  limitType: LimitType;
  amount: number;
  period: LimitPeriod;
  threshold?: number;
}

export interface FreezeCardRequest {
  reason: string;
}

export interface FundBalanceRequest {
  amount: number;
  reason: string;
  referenceId?: string;
}

export interface SetInternationalTransactionRequest {
  allowInternational: boolean;
  reason?: string;
}

export type CardStatus = "ACTIVE" | "INACTIVE" | "FROZEN" | "CANCELLED";
export type LimitType =
  | "SOFT_LIMIT"
  | "HARD_LIMIT"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "PER_TRANSACTION";
export type LimitPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "NO_LIMIT";

// ============================================
// Transaction Types
// ============================================

export interface CreateTransactionRequest {
  amount: number;
  merchant: string;
  merchantCategoryCode?: string;
  referenceId?: string;
}

export interface Transaction {
  id: number;
  cardId: number;
  amount: number;
  merchant: string;
  merchantCategoryCode?: string;
  status: TransactionStatus;
  currency: string;
  referenceId?: string;
  disputeReason?: string;
  canBeDisputed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface CompleteTransactionRequest {
  completionData?: string;
}

export interface ReverseTransactionRequest {
  reason: string;
}

export interface DisputeTransactionRequest {
  reason: string;
}

export interface TransactionSummary {
  completedAmount: number;
  pendingAmount: number;
  reversedAmount: number;
  failedAmount: number;
  transactionsByMerchant: Record<string, number>;
}

export type TransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "REVERSED"
  | "DISPUTED"
  | "FAILED";

// ============================================
// Approval Types
// ============================================

export interface RequestApprovalRequest {
  actionType: ApprovalActionType;
  actionData?: string;
}

export interface CardApproval {
  id: number;
  cardId: number;
  actionType: ApprovalActionType;
  status: ApprovalStatus;
  reason?: string;
  actionData?: string;
  createdAt: string;
  resolvedAt?: string;
  expiresAt: string;
}

export interface ApproveApprovalRequest {
  comment?: string;
}

export interface RejectApprovalRequest {
  reason: string;
}

export interface ApprovalRequirements {
  actionType: ApprovalActionType;
  isRequired: boolean;
  requiredRole: UserRole;
  description: string;
  maxDurationHours: number;
}

export type ApprovalActionType =
  | "FREEZE_CARD"
  | "DELETE_CARD"
  | "CHANGE_LIMITS"
  | "CHANGE_MERCHANTS"
  | "ENABLE_INTERNATIONAL"
  | "CREATE_CARD";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

// ============================================
// Audit Types
// ============================================

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId: number;
  changes?: string;
  ipAddress: string;
  status: "SUCCESS" | "FAILURE";
  timestamp: string;
  errorMessage?: string;
}

export interface AuditLogFilters {
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

// ============================================
// Department Types
// ============================================

export interface Department {
  id: number;
  name: string;
  budget: number;
  managerId?: number;
}

export interface CreateDepartmentRequest {
  name: string;
  budget: number;
  managerId?: number;
}

// ============================================
// Pagination Types
// ============================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageNumber: number;
  pageSize: number;
}

// ============================================
// API Error Types
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  statusCode?: number;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: string;
}

// ============================================
// Query Request/Response Types
// ============================================

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

// Enum constants for easier usage
export const USER_ROLES = {
  CEO: "CEO" as const,
  CFO: "CFO" as const,
  ADMIN: "Admin" as const,
  DELEGATE: "Delegate" as const,
  AUDITOR: "Auditor" as const,
};

export const CARD_STATUSES = {
  ACTIVE: "ACTIVE" as const,
  INACTIVE: "INACTIVE" as const,
  FROZEN: "FROZEN" as const,
  CANCELLED: "CANCELLED" as const,
};

export const TRANSACTION_STATUSES = {
  PENDING: "PENDING" as const,
  COMPLETED: "COMPLETED" as const,
  REVERSED: "REVERSED" as const,
  DISPUTED: "DISPUTED" as const,
  FAILED: "FAILED" as const,
};

export const APPROVAL_STATUSES = {
  PENDING: "PENDING" as const,
  APPROVED: "APPROVED" as const,
  REJECTED: "REJECTED" as const,
  EXPIRED: "EXPIRED" as const,
};

export const LIMIT_TYPES = {
  SOFT_LIMIT: "SOFT_LIMIT" as const,
  HARD_LIMIT: "HARD_LIMIT" as const,
  DAILY: "DAILY" as const,
  WEEKLY: "WEEKLY" as const,
  MONTHLY: "MONTHLY" as const,
  PER_TRANSACTION: "PER_TRANSACTION" as const,
};

export const LIMIT_PERIODS = {
  DAILY: "DAILY" as const,
  WEEKLY: "WEEKLY" as const,
  MONTHLY: "MONTHLY" as const,
  NO_LIMIT: "NO_LIMIT" as const,
};
