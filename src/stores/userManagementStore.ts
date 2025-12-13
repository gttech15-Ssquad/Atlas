import { create } from "zustand";
import { User, Role } from "@/store/authStore";

export interface UserManagementStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: Role) => User[];
  disableUser: (id: string, reason: string) => void;
}

export const useUserManagementStore = create<UserManagementStore>(
  (set, get) => ({
    users: [
      {
        id: "1",
        email: "ceo@gtbank.com",
        name: "John Akande",
        role: "CEO",
        department: "Executive",
        status: "active",
        lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 365
        ).toISOString(),
      },
      {
        id: "2",
        email: "cfo@gtbank.com",
        name: "Nwamaka Obi",
        role: "CFO",
        department: "Finance",
        status: "active",
        lastLogin: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 200
        ).toISOString(),
      },
      {
        id: "3",
        email: "admin@gtbank.com",
        name: "Chioma Ejiro",
        role: "Admin",
        department: "Operations",
        status: "active",
        lastLogin: new Date().toISOString(),
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 100
        ).toISOString(),
      },
    ],

    addUser: (user) =>
      set((state) => ({
        users: [...state.users, user],
      })),

    updateUser: (id, updates) =>
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...updates } : user
        ),
      })),

    deleteUser: (id) =>
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      })),

    getAllUsers: () => get().users,

    getUserById: (id) => get().users.find((user) => user.id === id),

    getUsersByRole: (role) => get().users.filter((user) => user.role === role),

    disableUser: (id, reason) =>
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, status: "inactive" } : user
        ),
      })),
  })
);
