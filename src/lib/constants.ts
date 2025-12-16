// Navigation Constants
export const SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: "BarChart3",
  },
  {
    id: "accounts",
    label: "Account Information",
    href: "/accounts",
    icon: "Wallet",
  },

  {
    id: "transactions",
    label: "Transaction History",
    href: "/transactions",
    icon: "ArrowRightLeft",
  },
  {
    id: "cards",
    label: "Cards",
    href: "#",
    icon: "CreditCard",
    submenu: [
      {
        id: "virtual-cards",
        label: "Virtual Cards",
        href: "/virtual-cards",
      },
      {
        id: "physical-cards",
        label: "Physical Cards",
        href: "/physical-cards",
      },
    ],
  },

  {
    id: "users",
    label: "User & Role Management",
    href: "/users",
    icon: "Shield",
  },
  {
    id: "audit",
    label: "Audit Trail",
    href: "/audit",
    icon: "ClipboardList",
  },


  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: "Settings",
  },
];

// GTBank Branding
export const GTBANK_PRIMARY = "#E15C42";
export const GTBANK_NAVY = "#0A2463";

// Card Status
export const CARD_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  FROZEN: "frozen",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const CARD_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  frozen: "Frozen",
  pending: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
};

export const CARD_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  frozen: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

// Approval Roles
export const APPROVAL_ROLES = {
  CEO: "CEO",
  CFO: "CFO",
  ADMIN: "Admin",
  DELEGATE: "Delegate",
  AUDITOR: "Auditor",
} as const;

// High Risk Actions
export const HIGH_RISK_ACTIONS = [
  "CHANGE_LIMITS",
  "CHANGE_MERCHANTS",
  "ENABLE_INTERNATIONAL",
  "FREEZE_CARD",
  "DELETE_CARD",
] as const;

// Department Types
export const DEPARTMENTS = [
  "Human Resources",
  "Finance",
  "Operations",
  "Marketing",
  "Sales",
  "IT",
  "Compliance",
  "Risk Management",
] as const;

// Merchant Categories
export const MERCHANT_CATEGORIES = [
  "Gas Stations",
  "Hotels",
  "Restaurants",
  "Retail",
  "Groceries",
  "Airlines",
  "Telecommunications",
  "Utilities",
  "Entertainment",
  "Online Shopping",
] as const;
