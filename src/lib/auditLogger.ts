import { useAuditStore, type AuditLog } from "@/stores/auditStore";
import { useRBACStore } from "@/store/rbacStore";

/**
 * Audit logger utility for tracking user actions throughout the app
 */
export const auditLogger = {
  /**
   * Log a user action
   */
  logAction: (
    action: string,
    entity: string,
    entityId: string = "",
    status: "success" | "failed" = "success",
    details: Record<string, any> = {},
    beforeValue?: any,
    afterValue?: any
  ) => {
    try {
      const currentUser = useRBACStore.getState().currentUser;

      if (!currentUser) {
        console.warn("Cannot log action: no current user");
        return;
      }

      const auditLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        action,
        entity,
        entityId,
        status,
        details,
        beforeValue,
        afterValue,
      };

      useAuditStore.getState().addLog(auditLog);
    } catch (error) {
      console.error("Error logging audit action:", error);
    }
  },

  /**
   * Log card creation
   */
  logCardCreated: (
    cardId: string,
    cardNickname: string,
    department: string
  ) => {
    auditLogger.logAction("Card Created", "Virtual Card", cardId, "success", {
      cardNickname,
      department,
    });
  },

  /**
   * Log card deletion
   */
  logCardDeleted: (cardId: string, cardNickname: string) => {
    auditLogger.logAction("Card Deleted", "Virtual Card", cardId, "success", {
      cardNickname,
    });
  },

  /**
   * Log card freeze
   */
  logCardFrozen: (cardId: string, cardNickname: string) => {
    auditLogger.logAction(
      "Card Frozen",
      "Virtual Card",
      cardId,
      "success",
      { cardNickname, action: "freeze" },
      { status: "active" },
      { status: "frozen" }
    );
  },

  /**
   * Log card unfreeze
   */
  logCardUnfrozen: (cardId: string, cardNickname: string) => {
    auditLogger.logAction(
      "Card Unfrozen",
      "Virtual Card",
      cardId,
      "success",
      { cardNickname, action: "unfreeze" },
      { status: "frozen" },
      { status: "active" }
    );
  },

  /**
   * Log approval request created
   */
  logApprovalRequested: (
    approvalId: string,
    type: string,
    cardNickname: string
  ) => {
    auditLogger.logAction(
      "Approval Requested",
      "Approval",
      approvalId,
      "success",
      { approvalType: type, cardNickname }
    );
  },

  /**
   * Log approval approved
   */
  logApprovalApproved: (
    approvalId: string,
    type: string,
    cardNickname: string
  ) => {
    auditLogger.logAction(
      "Approval Granted",
      "Approval",
      approvalId,
      "success",
      { approvalType: type, cardNickname }
    );
  },

  /**
   * Log approval rejected
   */
  logApprovalRejected: (
    approvalId: string,
    type: string,
    cardNickname: string
  ) => {
    auditLogger.logAction(
      "Approval Rejected",
      "Approval",
      approvalId,
      "success",
      { approvalType: type, cardNickname }
    );
  },

  /**
   * Log spending limit change
   */
  logSpendingLimitChanged: (
    cardId: string,
    cardNickname: string,
    beforeLimit: number,
    afterLimit: number
  ) => {
    auditLogger.logAction(
      "Spending Limit Changed",
      "Virtual Card",
      cardId,
      "success",
      { cardNickname },
      { limit: beforeLimit },
      { limit: afterLimit }
    );
  },

  /**
   * Log card details viewed
   */
  logCardViewed: (cardId: string, cardNickname: string) => {
    auditLogger.logAction(
      "Card Details Viewed",
      "Virtual Card",
      cardId,
      "success",
      { cardNickname }
    );
  },

  /**
   * Log user login
   */
  logUserLogin: (userId: string, userName: string) => {
    auditLogger.logAction("User Logged In", "User", userId, "success", {
      userName,
    });
  },

  /**
   * Log user logout
   */
  logUserLogout: (userId: string, userName: string) => {
    auditLogger.logAction("User Logged Out", "User", userId, "success", {
      userName,
    });
  },

  /**
   * Log failed action
   */
  logFailedAction: (
    action: string,
    entity: string,
    entityId: string,
    error: string
  ) => {
    auditLogger.logAction(action, entity, entityId, "failed", { error });
  },
};
