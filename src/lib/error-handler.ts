/**
 * Error Handling Service
 * Centralized error handling and user notification
 */

import { ApiError } from "@/types";

export interface ErrorNotification {
  id: string;
  type: "error" | "warning" | "info" | "success";
  message: string;
  details?: string;
  duration?: number; // ms, 0 = permanent
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Error handler for API errors
 */
export class ErrorHandler {
  static handle(error: any): ErrorNotification {
    const errorData = this.parseError(error);

    return {
      id: this.generateId(),
      type: "error",
      message: errorData.message,
      details: errorData.details,
      duration: 5000,
    };
  }

  static parseError(error: any): ApiError {
    // API error response
    if (error?.response?.data) {
      return {
        code: error.response.data.code || "API_ERROR",
        message: error.response.data.message || "An API error occurred",
        details: error.response.data.details,
        statusCode: error.response.status,
      };
    }

    // Axios network error
    if (error?.code === "ECONNABORTED") {
      return {
        code: "TIMEOUT",
        message: "Request timeout. Please try again.",
        statusCode: 408,
      };
    }

    if (error?.code === "ENOTFOUND") {
      return {
        code: "NETWORK_ERROR",
        message: "Network connection failed. Please check your internet.",
        statusCode: 0,
      };
    }

    // Generic error
    return {
      code: error?.code || "UNKNOWN_ERROR",
      message: error?.message || "An unexpected error occurred",
      statusCode: error?.status || 500,
    };
  }

  static getErrorMessage(error: any): string {
    const errorData = this.parseError(error);
    return errorData.message;
  }

  static getErrorCode(error: any): string {
    if (error?.code) return error.code;
    if (error?.response?.data?.code) return error.response.data.code;
    return "UNKNOWN_ERROR";
  }

  static isNetworkError(error: any): boolean {
    return !error?.response && (error?.code || error?.message);
  }

  static isAuthError(error: any): boolean {
    return error?.response?.status === 401;
  }

  static isPermissionError(error: any): boolean {
    return error?.response?.status === 403;
  }

  static isNotFoundError(error: any): boolean {
    return error?.response?.status === 404;
  }

  static isValidationError(error: any): boolean {
    return error?.response?.status === 400;
  }

  static isServerError(error: any): boolean {
    return error?.response?.status && error.response.status >= 500;
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Notification service for displaying errors/messages
 */
export class NotificationService {
  private static listeners: Set<(notification: ErrorNotification) => void> =
    new Set();
  private static notifications: Map<string, ErrorNotification> = new Map();
  private static timers: Map<string, NodeJS.Timeout> = new Map();

  static subscribe(
    callback: (notification: ErrorNotification) => void
  ): () => void {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => this.listeners.delete(callback);
  }

  static notify(notification: ErrorNotification): void {
    this.notifications.set(notification.id, notification);

    // Notify all subscribers
    this.listeners.forEach((listener) => {
      listener(notification);
    });

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.duration);

      this.timers.set(notification.id, timer);
    }
  }

  static error(
    message: string,
    details?: string,
    action?: ErrorNotification["action"]
  ): void {
    this.notify({
      id: this.generateId(),
      type: "error",
      message,
      details,
      duration: 5000,
      action,
    });
  }

  static warning(message: string, details?: string): void {
    this.notify({
      id: this.generateId(),
      type: "warning",
      message,
      details,
      duration: 4000,
    });
  }

  static success(message: string, details?: string): void {
    this.notify({
      id: this.generateId(),
      type: "success",
      message,
      details,
      duration: 3000,
    });
  }

  static info(message: string, details?: string): void {
    this.notify({
      id: this.generateId(),
      type: "info",
      message,
      details,
      duration: 4000,
    });
  }

  static dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.notifications.delete(id);

    // Notify all subscribers about dismissal
    this.listeners.forEach((listener) => {
      listener({
        id,
        type: "info",
        message: "", // Empty message indicates dismissal
      });
    });
  }

  static getAll(): ErrorNotification[] {
    return Array.from(this.notifications.values());
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Validation error handler
 */
export class ValidationErrorHandler {
  static parseValidationError(error: any): Record<string, string[]> {
    if (!error?.response?.data) {
      return {};
    }

    const data = error.response.data;

    // Handle ASP.NET Core validation errors
    if (data.errors && typeof data.errors === "object") {
      const errors: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(data.errors)) {
        errors[key.toLowerCase()] = Array.isArray(value)
          ? value
          : [String(value)];
      }
      return errors;
    }

    // Handle generic error message
    if (data.message) {
      return {
        general: [data.message],
      };
    }

    return {};
  }

  static getErrorsForField(
    errors: Record<string, string[]>,
    field: string
  ): string[] {
    return errors[field.toLowerCase()] || [];
  }

  static hasErrors(errors: Record<string, string[]>): boolean {
    return Object.keys(errors).length > 0;
  }

  static getFirstError(
    errors: Record<string, string[]>,
    field: string
  ): string | null {
    const fieldErrors = this.getErrorsForField(errors, field);
    return fieldErrors.length > 0 ? fieldErrors[0] : null;
  }
}

/**
 * Async error wrapper
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  onError?: (error: any) => void
): (...args: T) => Promise<R | void> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        const notification = ErrorHandler.handle(error);
        NotificationService.notify(notification);
      }
    }
  };
}

/**
 * Create error with context
 */
export function createApiError(
  code: string,
  message: string,
  statusCode: number = 500,
  details?: string
): ApiError {
  return {
    code,
    message,
    statusCode,
    details,
  };
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  // Recoverable: timeouts, rate limits, temporary server errors
  return (
    statusCode === 408 ||
    statusCode === 429 ||
    (statusCode >= 500 && statusCode <= 599)
  );
}

/**
 * Get retry delay in milliseconds
 */
export function getRetryDelay(
  attempt: number,
  maxDelay: number = 10000
): number {
  const delay = Math.min(1000 * Math.pow(2, attempt), maxDelay);
  const jitter = Math.random() * 0.1 * delay;
  return delay + jitter;
}
