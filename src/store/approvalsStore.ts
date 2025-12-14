"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ApprovalType =
  | "CREATE_CARD"
  | "FREEZE_CARD"
  | "DELETE_CARD"
  | "SET_LIMIT";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PendingApproval {
  id: string;
  type: ApprovalType;
  initiatorEmail: string;
  initiatorName: string;
  cardDetails: Record<string, any>;
  timestamp: string;
  status: ApprovalStatus;
  metadata?: Record<string, any>;
  approverEmail?: string;
  approverName?: string;
  approvedAt?: string;
}

export interface ApprovalsState {
  approvals: PendingApproval[];

  // Approval management
  createApproval: (
    approval: Omit<PendingApproval, "id" | "timestamp">
  ) => string;
  approveApproval: (
    id: string,
    approverEmail: string,
    approverName: string
  ) => void;
  rejectApproval: (
    id: string,
    approverEmail: string,
    approverName: string
  ) => void;
  getApprovalById: (id: string) => PendingApproval | undefined;
  getPendingApprovals: () => PendingApproval[];
  getApprovalsByInitiator: (email: string) => PendingApproval[];
}

export const useApprovalsStore = create<ApprovalsState>()(
  persist(
    (set, get) => ({
      approvals: [],

      createApproval: (approval) => {
        const id = `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newApproval: PendingApproval = {
          ...approval,
          id,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          approvals: [...state.approvals, newApproval],
        }));

        return id;
      },

      approveApproval: (id, approverEmail, approverName) => {
        set((state) => ({
          approvals: state.approvals.map((approval) =>
            approval.id === id
              ? {
                  ...approval,
                  status: "APPROVED" as ApprovalStatus,
                  approverEmail,
                  approverName,
                  approvedAt: new Date().toISOString(),
                }
              : approval
          ),
        }));
      },

      rejectApproval: (id, approverEmail, approverName) => {
        set((state) => ({
          approvals: state.approvals.map((approval) =>
            approval.id === id
              ? {
                  ...approval,
                  status: "REJECTED" as ApprovalStatus,
                  approverEmail,
                  approverName,
                  approvedAt: new Date().toISOString(),
                }
              : approval
          ),
        }));
      },

      getApprovalById: (id) => {
        return get().approvals.find((approval) => approval.id === id);
      },

      getPendingApprovals: () => {
        return get().approvals.filter(
          (approval) => approval.status === "PENDING"
        );
      },

      getApprovalsByInitiator: (email) => {
        return get().approvals.filter(
          (approval) => approval.initiatorEmail === email
        );
      },
    }),
    {
      name: "orgfrontend_approvals",
    }
  )
);
