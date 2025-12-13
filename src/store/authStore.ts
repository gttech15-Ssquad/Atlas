import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api-client";

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
  firstName: string;
  lastName: string;
  role: Role;
  department?: string;
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  organizationId: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setOrganizationId: (orgId: string | null) => void;
  logout: () => void;
  login: (email: string, password?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      organizationId: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setOrganizationId: (orgId) => set({ organizationId: orgId }),
      logout: () => {
        clearAuthCookie();
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("organization_id");
        }
        set({
          user: null,
          token: null,
          organizationId: null,
          isAuthenticated: false,
        });
      },
      login: async (email: string, password?: string) => {
        try {
          const res = await apiClient.login(email, password ?? "");

          console.log(res);
          const data = res.data;
          console.log(data);

          const token = data?.token ?? data?.jwt ?? null;
          const firstuser = data?.user ?? data?.profile ?? null;
          const user = {
            ...firstuser,
            name: `${firstuser.firstName} ${firstuser.lastName}`,
          };

          const orgId =
            data?.organizationId ??
            data?.OrganizationId ??
            data?.organizationId ??
            null;
          if (token) {
            setAuthCookie(token);
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("auth_token", token);
              if (orgId) localStorage.setItem("organization_id", orgId);
            }
            set({
              user,
              token,
              organizationId: orgId ?? null,
              isAuthenticated: true,
            });
            return;
          }
          throw new Error("Invalid login response");
        } catch (err) {
          clearAuthCookie();
          if (typeof localStorage !== "undefined") {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("organization_id");
          }
          set({
            user: null,
            token: null,
            organizationId: null,
            isAuthenticated: false,
          });
          throw err;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
