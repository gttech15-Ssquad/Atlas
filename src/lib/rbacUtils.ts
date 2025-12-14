import { UserRole } from "@/store/rbacStore";

export type CardAction =
  | "CREATE_CARD"
  | "FREEZE_CARD"
  | "DELETE_CARD"
  | "SET_LIMIT"
  | "VIEW_CARD_DETAILS"
  | "EXPORT_CARD";

export type AdminAction =
  | "ADD_USER"
  | "DELETE_USER"
  | "RESET_PASSWORD"
  | "TOGGLE_USER_STATUS"
  | "VIEW_USERS";

export type Action = CardAction | AdminAction;

// Permission matrix
const PERMISSION_MATRIX: Record<UserRole, Record<Action, boolean>> = {
  APPROVER: {
    // Card Actions - APPROVER can do everything immediately
    CREATE_CARD: true,
    FREEZE_CARD: true,
    DELETE_CARD: true,
    SET_LIMIT: true,
    VIEW_CARD_DETAILS: true,
    EXPORT_CARD: true,

    // Admin Actions - APPROVER has full admin privileges
    ADD_USER: true,
    DELETE_USER: true,
    RESET_PASSWORD: true,
    TOGGLE_USER_STATUS: true,
    VIEW_USERS: true,
  },

  ADMINISTRATOR: {
    // Card Actions - ADMIN cannot perform card actions but they create approvals
    CREATE_CARD: false, // Triggers approval
    FREEZE_CARD: false, // Triggers approval
    DELETE_CARD: false, // Triggers approval
    SET_LIMIT: false, // Triggers approval
    VIEW_CARD_DETAILS: false, // Cannot view
    EXPORT_CARD: false,

    // Admin Actions - ADMIN has full admin privileges
    ADD_USER: true,
    DELETE_USER: true,
    RESET_PASSWORD: true,
    TOGGLE_USER_STATUS: true,
    VIEW_USERS: true,
  },

  VIEWER: {
    // Card Actions - VIEWER cannot do anything
    CREATE_CARD: false,
    FREEZE_CARD: false,
    DELETE_CARD: false,
    SET_LIMIT: false,
    VIEW_CARD_DETAILS: true, // Can only view basic info
    EXPORT_CARD: false,

    // Admin Actions - VIEWER has no admin privileges
    ADD_USER: false,
    DELETE_USER: false,
    RESET_PASSWORD: false,
    TOGGLE_USER_STATUS: false,
    VIEW_USERS: false,
  },
};

export const rbacUtils = {
  /**
   * Check if a user role can perform an action
   */
  canPerformAction: (role: UserRole, action: Action): boolean => {
    return PERMISSION_MATRIX[role]?.[action] ?? false;
  },

  /**
   * Check if a user role can perform card actions
   */
  canPerformCardAction: (
    role: UserRole,
    action: CardAction
  ): "immediate" | "approval" | "denied" => {
    if (role === "APPROVER") return "immediate";
    if (role === "ADMINISTRATOR")
      return action.includes("VIEW") ? "denied" : "approval";
    return "denied";
  },

  /**
   * Check if a user role can manage users
   */
  canManageUsers: (role: UserRole): boolean => {
    return role === "APPROVER" || role === "ADMINISTRATOR";
  },

  /**
   * Check if a user role can view card details
   */
  canViewCardDetails: (role: UserRole): boolean => {
    return role === "APPROVER" || role === "VIEWER";
  },

  /**
   * Check if a user role can approve actions
   */
  canApproveActions: (role: UserRole): boolean => {
    return role === "APPROVER";
  },

  /**
   * Get readable action name
   */
  getActionName: (action: Action): string => {
    const actionNames: Record<Action, string> = {
      CREATE_CARD: "Create Card",
      FREEZE_CARD: "Freeze Card",
      DELETE_CARD: "Delete Card",
      SET_LIMIT: "Set Card Limit",
      VIEW_CARD_DETAILS: "View Card Details",
      EXPORT_CARD: "Export Card",
      ADD_USER: "Add User",
      DELETE_USER: "Delete User",
      RESET_PASSWORD: "Reset Password",
      TOGGLE_USER_STATUS: "Toggle User Status",
      VIEW_USERS: "View Users",
    };
    return actionNames[action] || action;
  },

  /**
   * Get permission denied message
   */
  getPermissionDeniedMessage: (action: Action, role: UserRole): string => {
    const cardActions = [
      "CREATE_CARD",
      "FREEZE_CARD",
      "DELETE_CARD",
      "SET_LIMIT",
    ];
    const isCardAction = cardActions.includes(action);

    if (role === "VIEWER" && isCardAction) {
      return "You do not have privilege to perform this action on cards. Only Approvers can manage cards.";
    }

    if (role === "ADMINISTRATOR" && isCardAction) {
      return `Your ${rbacUtils.getActionName(action as CardAction)} request will be sent for approval to an Approver.`;
    }

    return `You do not have privilege to perform this action. This action requires ${role === "VIEWER" ? "Approver or Administrator" : "Approver"} privileges.`;
  },

  /**
   * Get role badge color
   */
  getRoleBadgeColor: (
    role: UserRole
  ): "blue" | "orange" | "gray" | "purple" => {
    const colors: Record<UserRole, "blue" | "orange" | "gray" | "purple"> = {
      APPROVER: "blue",
      ADMINISTRATOR: "orange",
      VIEWER: "gray",
    };
    return colors[role];
  },

  /**
   * Get role display name
   */
  getRoleDisplayName: (role: UserRole): string => {
    const names: Record<UserRole, string> = {
      APPROVER: "Approver",
      ADMINISTRATOR: "Administrator",
      VIEWER: "Viewer",
    };
    return names[role];
  },
};
