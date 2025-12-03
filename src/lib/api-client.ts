import axios, { AxiosInstance } from "axios";

// Mock API client
class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle auth error
          localStorage.removeItem("auth_token");
        }
        return Promise.reject(error);
      }
    );
  }

  // Virtual Cards
  async getCards() {
    return this.client.get("/cards");
  }

  async getCard(id: string) {
    return this.client.get(`/cards/${id}`);
  }

  async createCard(data: any) {
    return this.client.post("/cards", data);
  }

  async updateCard(id: string, data: any) {
    return this.client.patch(`/cards/${id}`, data);
  }

  async deleteCard(id: string) {
    return this.client.delete(`/cards/${id}`);
  }

  async freezeCard(id: string) {
    return this.client.post(`/cards/${id}/freeze`, {});
  }

  async unfreezeCard(id: string) {
    return this.client.post(`/cards/${id}/unfreeze`, {});
  }

  // Approvals
  async submitApproval(cardId: string, role: "ceo" | "cfo", otp: string) {
    return this.client.post(`/cards/${cardId}/approve`, {
      role,
      otp,
    });
  }

  // Transactions
  async getTransactions(filters?: any) {
    return this.client.get("/transactions", { params: filters });
  }

  // Accounts
  async getAccounts() {
    return this.client.get("/accounts");
  }

  // Subscriptions
  async getSubscriptions() {
    return this.client.get("/subscriptions");
  }

  async updateSubscriptionStatus(id: string, status: boolean) {
    return this.client.patch(`/subscriptions/${id}`, { active: status });
  }
}

export const apiClient = new APIClient();
