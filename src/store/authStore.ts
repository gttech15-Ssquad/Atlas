import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper function to set auth cookie
const setAuthCookie = (token: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24 hours
  }
};

// Helper function to clear auth cookie
const clearAuthCookie = () => {
  if (typeof document !== "undefined") {
    document.cookie = "auth_token=; path=/; max-age=0";
  }
};

export type Role = "CEO" | "CFO" | "Admin" | "DepartmentHead" | "Auditor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  login: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => {
        clearAuthCookie();
        set({ user: null, token: null, isAuthenticated: false });
      },
      login: async (email) => {
        // Mock login with a small delay to simulate API call
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            // Map demo emails to full names
            const nameMap: Record<string, string> = {
              "ceo@gtbank.com": "Chioma Okafor",
              "cfo@gtbank.com": "Emeka Nwosu",
              "admin@gtbank.com": "Adekunle Adeyemi",
              "head@gtbank.com": "Ngozi Okoro",
              "auditor@gtbank.com": "Tunde Olanrewaju",
            };

            const mockUser: User = {
              id: "1",
              email,
              name: nameMap[email] || "Administrator",
              role: "CEO",
              department: "Finance",
              status: "active",
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            };
            const token = "mock-token-" + Date.now();
            setAuthCookie(token);
            set({
              user: mockUser,
              token,
              isAuthenticated: true,
            });
            resolve();
          }, 500);
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
