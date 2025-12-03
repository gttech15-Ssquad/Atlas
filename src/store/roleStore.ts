import { create } from "zustand";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  hasDelegate: boolean;
  delegateName?: string;
  delegateEmail?: string;
}

interface RoleState {
  roles: Role[];
  users: RoleUser[];

  // Role actions
  addRole: (role: Role) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;

  // User role actions
  assignDelegate: (
    userId: string,
    delegateName: string,
    delegateEmail: string
  ) => void;
  removeDelegate: (userId: string) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [
    {
      id: "role-001",
      name: "Chief Executive Officer (CEO)",
      description: "Executive leadership with full approval authority",
      permissions: [
        "VIEW_ALL_CARDS",
        "APPROVE_CARDS",
        "FREEZE_CARDS",
        "DELETE_CARDS",
        "VIEW_AUDIT_LOG",
      ],
    },
    {
      id: "role-002",
      name: "Chief Financial Officer (CFO)",
      description: "Financial oversight and approval authority",
      permissions: [
        "VIEW_ALL_CARDS",
        "APPROVE_CARDS",
        "VIEW_AUDIT_LOG",
        "VIEW_SPENDING",
      ],
    },
    {
      id: "role-003",
      name: "Administrator",
      description: "System administration and user management",
      permissions: [
        "MANAGE_USERS",
        "MANAGE_ROLES",
        "VIEW_ALL_CARDS",
        "VIEW_AUDIT_LOG",
      ],
    },
    {
      id: "role-004",
      name: "Delegate",
      description: "Delegated approval authority (cannot finalize)",
      permissions: ["VIEW_ASSIGNED_CARDS", "INITIAL_APPROVAL"],
    },
    {
      id: "role-005",
      name: "Auditor",
      description: "Audit trail and compliance review",
      permissions: ["VIEW_AUDIT_LOG", "VIEW_ALL_CARDS", "VIEW_REPORTS"],
    },
  ],

  users: [
    {
      id: "user-001",
      name: "Chukwu Obi",
      email: "chukwu.obi@gtbank.com",
      role: "CEO",
      department: "Executive",
      hasDelegate: false,
    },
    {
      id: "user-002",
      name: "Amara Nwosu",
      email: "amara.nwosu@gtbank.com",
      role: "CFO",
      department: "Finance",
      hasDelegate: true,
      delegateName: "Emeka Eze",
      delegateEmail: "emeka.eze@gtbank.com",
    },
    {
      id: "user-003",
      name: "Tunde Adebayo",
      email: "tunde.adebayo@gtbank.com",
      role: "Admin",
      department: "IT",
      hasDelegate: false,
    },
    {
      id: "user-004",
      name: "Chioma Ifeanyi",
      email: "chioma.ifeanyi@gtbank.com",
      role: "Auditor",
      department: "Compliance",
      hasDelegate: false,
    },
  ],

  addRole: (role: Role) => {
    set((state) => ({
      roles: [...state.roles, role],
    }));
  },

  updateRole: (id: string, updates: Partial<Role>) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id ? { ...role, ...updates } : role
      ),
    }));
  },

  deleteRole: (id: string) => {
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
    }));
  },

  assignDelegate: (
    userId: string,
    delegateName: string,
    delegateEmail: string
  ) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, hasDelegate: true, delegateName, delegateEmail }
          : user
      ),
    }));
  },

  removeDelegate: (userId: string) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? {
              ...user,
              hasDelegate: false,
              delegateName: undefined,
              delegateEmail: undefined,
            }
          : user
      ),
    }));
  },
}));
