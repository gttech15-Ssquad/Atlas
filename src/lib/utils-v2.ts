/**
 * Utility Functions
 * Helper functions for validation, formatting, and data manipulation
 */

import {
  CardBalance,
  CardLimit,
  Transaction,
  VirtualCard,
  ApiError,
} from "@/types";

/**
 * Mask card number - show only last 4 digits
 * @example maskCardNumber('1234567890123456') => '****-****-****-3456'
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (cleaned.length < 4) return cardNumber;
  const last4 = cleaned.slice(-4);
  return `****-****-****-${last4}`;
}

/**
 * Unmask card number for display (kept for reference)
 */
export function unmaskCardNumber(maskedNumber: string): string {
  // This would never actually return the full card number for security
  // Only used to extract the masked version
  return maskedNumber;
}

/**
 * Format currency with proper symbol
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Format date to readable format
 */
export function formatDate(
  date: string | Date,
  format: "short" | "long" = "short"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "long") {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
}

/**
 * Format time difference (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return formatDate(date, "short");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if card status is frozen
 */
export function isCardFrozen(card: VirtualCard): boolean {
  return card.status === "FROZEN";
}

/**
 * Check if card is active and usable
 */
export function isCardUsable(card: VirtualCard): boolean {
  return card.status === "ACTIVE";
}

/**
 * Check if card is expired
 */
export function isCardExpired(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  return expiry < new Date();
}

/**
 * Calculate spending percentage
 */
export function calculateSpendingPercentage(
  balance: CardBalance | null
): number {
  if (!balance) return 0;
  return balance.totalBalance > 0
    ? (balance.usedBalance / balance.totalBalance) * 100
    : 0;
}

/**
 * Check if spending limit warning is reached
 */
export function isLimitWarningReached(limit: CardLimit): boolean {
  return limit.isWarningReached || limit.percentageUsed >= limit.threshold;
}

/**
 * Check if spending limit is exceeded
 */
export function isLimitExceeded(limit: CardLimit): boolean {
  return limit.availableAmount <= 0;
}

/**
 * Format limit type for display
 */
export function formatLimitType(limitType: string): string {
  return limitType
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get spending status color
 */
export function getSpendingStatusColor(percentage: number): string {
  if (percentage <= 50) return "green";
  if (percentage <= 80) return "yellow";
  return "red";
}

/**
 * Get card status color
 */
export function getCardStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    ACTIVE: "green",
    INACTIVE: "gray",
    FROZEN: "blue",
    CANCELLED: "red",
  };
  return statusColors[status] || "gray";
}

/**
 * Get card status label
 */
export function getCardStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    FROZEN: "Frozen",
    CANCELLED: "Cancelled",
  };
  return statusLabels[status] || status;
}

/**
 * Get transaction status color
 */
export function getTransactionStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PENDING: "yellow",
    COMPLETED: "green",
    REVERSED: "gray",
    DISPUTED: "orange",
    FAILED: "red",
  };
  return statusColors[status] || "gray";
}

/**
 * Get transaction status label
 */
export function getTransactionStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    REVERSED: "Reversed",
    DISPUTED: "Disputed",
    FAILED: "Failed",
  };
  return statusLabels[status] || status;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Get error code
 */
export function getErrorCode(error: any): string {
  if (error?.code) {
    return error.code;
  }

  if (error?.response?.data?.code) {
    return error.response.data.code;
  }

  return "UNKNOWN_ERROR";
}

/**
 * Format transaction for display
 */
export function formatTransaction(transaction: Transaction): {
  amount: string;
  date: string;
  status: string;
} {
  return {
    amount: formatCurrency(transaction.amount, transaction.currency),
    date: formatDate(transaction.createdAt, "short"),
    status: getTransactionStatusLabel(transaction.status),
  };
}

/**
 * Get remaining balance percentage
 */
export function getRemainingBalancePercentage(
  balance: CardBalance | null
): number {
  if (!balance) return 100;
  const percentage = (balance.availableBalance / balance.totalBalance) * 100;
  return Math.max(0, Math.min(100, percentage));
}

/**
 * Check if need to warn about balance
 */
export function shouldWarnAboutBalance(balance: CardBalance | null): boolean {
  if (!balance) return false;
  const remainingPercentage = getRemainingBalancePercentage(balance);
  return remainingPercentage < 25; // Warn when less than 25% remains
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Validate card number format (basic)
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s|-/g, "");
  return /^\d{13,19}$/.test(cleaned);
}

/**
 * Validate CVV format
 */
export function isValidCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

/**
 * Parse API error response
 */
export function parseApiError(error: any): {
  code: string;
  message: string;
  details?: string;
  statusCode?: number;
} {
  const defaultError = {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred",
  };

  if (error?.response?.data) {
    return {
      code: error.response.data.code || defaultError.code,
      message: error.response.data.message || defaultError.message,
      details: error.response.data.details,
      statusCode: error.response.status,
    };
  }

  if (error?.message) {
    return {
      ...defaultError,
      message: error.message,
    };
  }

  return defaultError;
}

/**
 * Get HTTP status message
 */
export function getHttpStatusMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: "Bad request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    500: "Server error",
    503: "Service unavailable",
  };
  return messages[statusCode] || "Unknown error";
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Download file
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Generate unique ID
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (typeof obj === "string") return obj.trim() === "";
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
}
