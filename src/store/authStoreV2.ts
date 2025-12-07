/**
 * Auth Store - Zustand Store for Authentication
 * Manages user authentication state and profile data
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api-client-v2";
import {
  UserProfile,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthResponse,
} from "@/types";

interface AuthState {
  // State
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string) => void;
  fetchProfile: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: apiClient.getToken(),
      isAuthenticated: apiClient.getToken() !== null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.register(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        apiClient.clearToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: UserProfile | null) => {
        set({ user });
      },

      setToken: (token: string) => {
        apiClient.setToken(token);
        set({ token, isAuthenticated: true });
      },

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await apiClient.getProfile();
          set({ user, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch profile",
            isLoading: false,
          });
          throw error;
        }
      },

      changePassword: async (data: ChangePasswordRequest) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.changePassword(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to change password",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      setError: (error: string) => set({ error }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
