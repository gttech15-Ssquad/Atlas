"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "APPROVER" | "ADMINISTRATOR" | "VIEWER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "disabled";
  createdAt: string;
  lastLogin?: string;
}

export interface RBACState {
  // Current user
  currentUser: User | null;
  allUsers: User[];

  // Actions for current user
  setCurrentUser: (user: User | null) => void;
  loginUser: (email: string) => void;
  logoutUser: () => void;

  // User management (for APPROVER and ADMINISTRATOR)
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  getUserByEmail: (email: string) => User | undefined;

  // Initialization
  initializeDemoUsers: () => void;
}

const DEMO_USERS: User[] = [
  {
    id: "user-approver-001",
    email: "aliko.dangote@dangotecement.com",
    name: "Aliko Dangote",
    role: "APPROVER",
    status: "active",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-admin-001",
    email: "zainab.hassan@dangotecement.com",
    name: "Zainab Hassan",
    role: "ADMINISTRATOR",
    status: "active",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-viewer-001",
    email: "seun.adebayo@dangotecement.com",
    name: "Oluwaseun Adebayo",
    role: "VIEWER",
    status: "active",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

export const useRBACStore = create<RBACState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      allUsers: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      loginUser: (email: string) => {
        const user = get().getUserByEmail(email);
        if (user) {
          set({
            currentUser: {
              ...user,
              lastLogin: new Date().toISOString(),
            },
          });
        }
      },

      logoutUser: () => set({ currentUser: null }),

      addUser: (user) => {
        set((state) => ({
          allUsers: [...state.allUsers, user],
        }));
      },

      updateUser: (id, updates) => {
        set((state) => ({
          allUsers: state.allUsers.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          allUsers: state.allUsers.filter((user) => user.id !== id),
        }));
      },

      toggleUserStatus: (id) => {
        set((state) => ({
          allUsers: state.allUsers.map((user) =>
            user.id === id
              ? {
                  ...user,
                  status: user.status === "active" ? "disabled" : "active",
                }
              : user
          ),
        }));
      },

      getUserByEmail: (email: string) => {
        return get().allUsers.find((user) => user.email === email);
      },

      initializeDemoUsers: () => {
        const state = get();
        if (state.allUsers.length === 0) {
          set({ allUsers: DEMO_USERS });
        }
      },
    }),
    {
      name: "orgfrontend_rbac",
      partialize: (state) => ({
        allUsers: state.allUsers,
        currentUser: state.currentUser,
      }),
    }
  )
);
