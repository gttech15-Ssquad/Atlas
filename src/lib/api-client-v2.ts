/**
 * API Client Service
 * Handles all HTTP requests to the C# backend
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthResponse,
  UserProfile,
  CreateCardRequest,
  UpdateCardRequest,
  VirtualCard,
  CardDetailsResponse,
  CardBalance,
  CardLimit,
  SetCardLimitRequest,
  FreezeCardRequest,
  FundBalanceRequest,
  SetInternationalTransactionRequest,
  CreateTransactionRequest,
  Transaction,
  CompleteTransactionRequest,
  ReverseTransactionRequest,
  DisputeTransactionRequest,
  TransactionSummary,
  RequestApprovalRequest,
  CardApproval,
  ApproveApprovalRequest,
  RejectApprovalRequest,
  ApprovalRequirements,
  AuditLog,
  AuditLogFilters,
  Department,
  CreateDepartmentRequest,
  PaginatedResponse,
  ApiError,
  PaginationParams,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api";
const TOKEN_KEY = "authToken";
const TOKEN_EXPIRY_KEY = "authTokenExpiry";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Load token from localStorage on initialization
    this.loadTokenFromStorage();

    // Request interceptor - add token to all requests
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token expiry and errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login - you can dispatch a Redux action or emit an event
          window.location.href = "/login";
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Load token from localStorage
   */
  private loadTokenFromStorage(): void {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (token && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() < expiryTime) {
          this.token = token;
          this.tokenExpiry = expiryTime;
        } else {
          this.clearToken();
        }
      }
    }
  }

  /**
   * Set token and store in localStorage
   */
  setToken(token: string, expiresIn?: number): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      if (expiresIn) {
        const expiryTime = Date.now() + expiresIn * 1000;
        this.tokenExpiry = expiryTime;
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      }
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear token
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  }

  /**
   * Check if token is valid
   */
  isTokenValid(): boolean {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry;
  }

  /**
   * Format error response
   */
  private formatError(error: AxiosError<ApiError>): ApiError {
    if (error.response?.data) {
      return {
        ...error.response.data,
        statusCode: error.response.status,
      };
    }

    return {
      code: error.code || "UNKNOWN_ERROR",
      message: error.message || "An unexpected error occurred",
      statusCode: error.response?.status || 500,
    };
  }

  // ============================================
  // Authentication Endpoints
  // ============================================

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/register",
      data
    );
    this.setToken(response.data.token, 86400); // 24 hours
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/login", data);
    this.setToken(response.data.token, 86400); // 24 hours
    return response.data;
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      "/auth/change-password",
      data
    );
    return response.data;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>("/auth/profile");
    return response.data;
  }

  // ============================================
  // Virtual Card Endpoints
  // ============================================

  async createCard(data: CreateCardRequest): Promise<VirtualCard> {
    const response = await this.client.post<VirtualCard>("/cards", data);
    return response.data;
  }

  async getCards(
    params?: PaginationParams
  ): Promise<PaginatedResponse<VirtualCard>> {
    const response = await this.client.get<PaginatedResponse<VirtualCard>>(
      "/cards",
      {
        params,
      }
    );
    return response.data;
  }

  async getCard(cardId: number): Promise<VirtualCard> {
    const response = await this.client.get<VirtualCard>(`/cards/${cardId}`);
    return response.data;
  }

  async getCardDetails(cardId: number): Promise<CardDetailsResponse> {
    const response = await this.client.get<CardDetailsResponse>(
      `/cards/${cardId}/details`
    );
    return response.data;
  }

  async updateCard(
    cardId: number,
    data: UpdateCardRequest
  ): Promise<VirtualCard> {
    const response = await this.client.put<VirtualCard>(
      `/cards/${cardId}`,
      data
    );
    return response.data;
  }

  async freezeCard(
    cardId: number,
    data: FreezeCardRequest
  ): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      `/cards/${cardId}/freeze`,
      data
    );
    return response.data;
  }

  async unfreezeCard(cardId: number): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      `/cards/${cardId}/unfreeze`
    );
    return response.data;
  }

  async deleteCard(cardId: number): Promise<void> {
    await this.client.delete(`/cards/${cardId}`);
  }

  async setCardLimit(
    cardId: number,
    data: SetCardLimitRequest
  ): Promise<CardLimit> {
    const response = await this.client.post<CardLimit>(
      `/cards/${cardId}/limits`,
      data
    );
    return response.data;
  }

  async getCardLimits(cardId: number): Promise<CardLimit[]> {
    const response = await this.client.get<CardLimit[]>(
      `/cards/${cardId}/limits`
    );
    return response.data;
  }

  async getCardBalance(cardId: number): Promise<CardBalance> {
    const response = await this.client.get<CardBalance>(
      `/cards/${cardId}/balance`
    );
    return response.data;
  }

  async fundCardBalance(
    cardId: number,
    data: FundBalanceRequest
  ): Promise<CardBalance> {
    const response = await this.client.post<CardBalance>(
      `/cards/${cardId}/balance/fund`,
      data
    );
    return response.data;
  }

  async setInternationalTransactions(
    cardId: number,
    data: SetInternationalTransactionRequest
  ): Promise<{ message: string }> {
    const response = await this.client.put<{ message: string }>(
      `/cards/${cardId}/international`,
      data
    );
    return response.data;
  }

  // ============================================
  // Transaction Endpoints
  // ============================================

  async createTransaction(
    cardId: number,
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    const response = await this.client.post<Transaction>(
      `/transactions/card/${cardId}`,
      data
    );
    return response.data;
  }

  async getCardTransactions(
    cardId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Transaction>> {
    const response = await this.client.get<PaginatedResponse<Transaction>>(
      `/transactions/card/${cardId}`,
      { params }
    );
    return response.data;
  }

  async getTransaction(transactionId: number): Promise<Transaction> {
    const response = await this.client.get<Transaction>(
      `/transactions/${transactionId}`
    );
    return response.data;
  }

  async completeTransaction(
    transactionId: number,
    data?: CompleteTransactionRequest
  ): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      `/transactions/${transactionId}/complete`,
      data || {}
    );
    return response.data;
  }

  async reverseTransaction(
    transactionId: number,
    data: ReverseTransactionRequest
  ): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      `/transactions/${transactionId}/reverse`,
      data
    );
    return response.data;
  }

  async disputeTransaction(
    transactionId: number,
    data: DisputeTransactionRequest
  ): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      `/transactions/${transactionId}/dispute`,
      data
    );
    return response.data;
  }

  async getTransactionSummary(
    cardId: number,
    startDate?: string,
    endDate?: string
  ): Promise<TransactionSummary> {
    const response = await this.client.get<TransactionSummary>(
      `/transactions/card/${cardId}/summary`,
      { params: { startDate, endDate } }
    );
    return response.data;
  }

  // ============================================
  // Approval Endpoints
  // ============================================

  async requestApproval(
    cardId: number,
    data: RequestApprovalRequest
  ): Promise<CardApproval> {
    const response = await this.client.post<CardApproval>(
      `/approvals?cardId=${cardId}`,
      data
    );
    return response.data;
  }

  async getPendingApprovals(): Promise<CardApproval[]> {
    const response =
      await this.client.get<CardApproval[]>("/approvals/pending");
    return response.data;
  }

  async getApprovalDetails(approvalId: number): Promise<CardApproval> {
    const response = await this.client.get<CardApproval>(
      `/approvals/${approvalId}`
    );
    return response.data;
  }

  async approveApproval(
    approvalId: number,
    data?: ApproveApprovalRequest
  ): Promise<{ message: string }> {
    const response = await this.client.put<{ message: string }>(
      `/approvals/${approvalId}/approve`,
      data || {}
    );
    return response.data;
  }

  async rejectApproval(
    approvalId: number,
    data: RejectApprovalRequest
  ): Promise<{ message: string }> {
    const response = await this.client.put<{ message: string }>(
      `/approvals/${approvalId}/reject`,
      data
    );
    return response.data;
  }

  async getApprovalHistory(cardId: number): Promise<CardApproval[]> {
    const response = await this.client.get<CardApproval[]>(
      `/approvals/card/${cardId}/history`
    );
    return response.data;
  }

  async getApprovalRequirements(
    actionType: string
  ): Promise<ApprovalRequirements> {
    const response = await this.client.get<ApprovalRequirements>(
      `/approvals/requirements/${actionType}`
    );
    return response.data;
  }

  // ============================================
  // Audit Endpoints
  // ============================================

  async getAuditLogs(
    params?: AuditLogFilters
  ): Promise<PaginatedResponse<AuditLog>> {
    const response = await this.client.get<PaginatedResponse<AuditLog>>(
      "/audit",
      {
        params,
      }
    );
    return response.data;
  }

  async getUserAuditLogs(userId: number): Promise<AuditLog[]> {
    const response = await this.client.get<AuditLog[]>(`/audit/user/${userId}`);
    return response.data;
  }

  async exportAuditLogs(
    format: "csv" | "json" = "csv",
    startDate?: string,
    endDate?: string
  ): Promise<Blob> {
    const response = await this.client.get(`/audit/export`, {
      params: { format, startDate, endDate },
      responseType: "blob",
    });
    return response.data;
  }

  // ============================================
  // Department Endpoints
  // ============================================

  async createDepartment(data: CreateDepartmentRequest): Promise<Department> {
    const response = await this.client.post<Department>("/departments", data);
    return response.data;
  }

  async getDepartments(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Department>> {
    const response = await this.client.get<PaginatedResponse<Department>>(
      "/departments",
      {
        params,
      }
    );
    return response.data;
  }

  async getDepartment(departmentId: number): Promise<Department> {
    const response = await this.client.get<Department>(
      `/departments/${departmentId}`
    );
    return response.data;
  }

  async updateDepartment(
    departmentId: number,
    data: Partial<CreateDepartmentRequest>
  ): Promise<Department> {
    const response = await this.client.put<Department>(
      `/departments/${departmentId}`,
      data
    );
    return response.data;
  }

  async deleteDepartment(departmentId: number): Promise<void> {
    await this.client.delete(`/departments/${departmentId}`);
  }

  // ============================================
  // Health Check
  // ============================================

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await this.client.get<{ status: string }>("/health");
      return response.data;
    } catch (error) {
      // API might not have a health endpoint, return error
      throw this.formatError(error as AxiosError<ApiError>);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export the class for testing
export default ApiClient;
