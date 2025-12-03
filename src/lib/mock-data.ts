export const mockCardsData = [
  {
    id: "card-001",
    nickname: "Marketing Ops",
    cardNumber: "4929 7892 3456 7890",
    maskedNumber: "**** **** **** 7890",
    department: "Marketing",
    softLimit: 50000,
    hardLimit: 100000,
    currentSpend: 32500,
    status: "active",
    expiryDate: "12/26",
    cvv: "***",
    merchantCategories: ["Retail", "Online Shopping", "Airlines"],
    internationalTransactions: true,
    createdAt: "2024-01-15",
    lastUsed: "2024-11-28",
    createdBy: "Admin User",
  },
];

export const mockTransactionsData = [
  {
    id: "tx-001",
    cardId: "card-001",
    description: "Paystack - Software",
    amount: 2500,
    date: "2024-11-28",
    status: "completed",
    merchant: "Paystack Ltd",
    category: "Software",
  },
  {
    id: "tx-002",
    cardId: "card-001",
    description: "Uber - Transportation",
    amount: 850,
    date: "2024-11-27",
    status: "completed",
    merchant: "Uber Nigeria",
    category: "Transportation",
  },
  {
    id: "tx-003",
    cardId: "card-002",
    description: "Amazon - Hardware",
    amount: 15000,
    date: "2024-11-26",
    status: "completed",
    merchant: "Amazon",
    category: "IT Equipment",
  },
  {
    id: "tx-004",
    cardId: "card-001",
    description: "Jumia - Office Supplies",
    amount: 3200,
    date: "2024-11-25",
    status: "completed",
    merchant: "Jumia Nigeria",
    category: "Office Supplies",
  },
];

export const mockAccountsData = [
  {
    id: "acc-001",
    accountName: "Main Operating Account",
    accountNumber: "0123456789",
    balance: 5000000,
    type: "Current",
    status: "Active",
    currency: "NGN",
  },
  {
    id: "acc-002",
    accountName: "Payroll Account",
    accountNumber: "0987654321",
    balance: 2500000,
    type: "Current",
    status: "Active",
    currency: "NGN",
  },
];

export const mockSubscriptionsData = [
  {
    id: "sub-001",
    vendorName: "Microsoft 365",
    monthlyCost: 50000,
    linkedCard: "**** **** **** 7890",
    nextBillingDate: "2024-12-15",
    status: true,
    plan: "Enterprise",
  },
  {
    id: "sub-002",
    vendorName: "AWS Cloud Services",
    monthlyCost: 150000,
    linkedCard: "**** **** **** 9012",
    nextBillingDate: "2024-12-05",
    status: true,
    plan: "Pro",
  },
  {
    id: "sub-003",
    vendorName: "Slack Workspace",
    monthlyCost: 25000,
    linkedCard: "**** **** **** 7890",
    nextBillingDate: "2024-12-10",
    status: false,
    plan: "Standard",
  },
  {
    id: "sub-004",
    vendorName: "GitHub Enterprise",
    monthlyCost: 75000,
    linkedCard: "**** **** **** 9012",
    nextBillingDate: "2024-12-01",
    status: true,
    plan: "Team",
  },
];

export const mockDashboardData = {
  totalBalance: 5000000,
  cardCount: 3,
  activeCards: 2,
  monthlySpend: 156500,
  monthlyLimit: 500000,
  transactions: mockTransactionsData.slice(0, 5),
  alerts: [
    {
      id: "alert-001",
      type: "warning",
      message: "Card ending in 7890 approaching soft limit",
      timestamp: "2024-11-28T14:30:00",
    },
    {
      id: "alert-002",
      type: "info",
      message: "New approval request pending CFO review",
      timestamp: "2024-11-28T10:15:00",
    },
    {
      id: "alert-003",
      type: "error",
      message: "Card ending in 7777 is frozen",
      timestamp: "2024-11-27T09:00:00",
    },
  ],
};

export const mockChartData = [
  { month: "Jan", spend: 45000, limit: 100000 },
  { month: "Feb", spend: 52000, limit: 100000 },
  { month: "Mar", spend: 48000, limit: 100000 },
  { month: "Apr", spend: 61000, limit: 100000 },
  { month: "May", spend: 55000, limit: 100000 },
  { month: "Jun", spend: 67000, limit: 100000 },
  { month: "Jul", spend: 72000, limit: 100000 },
  { month: "Aug", spend: 65000, limit: 100000 },
  { month: "Sep", spend: 78000, limit: 100000 },
  { month: "Oct", spend: 82000, limit: 100000 },
  { month: "Nov", spend: 88000, limit: 100000 },
  { month: "Dec", spend: 76000, limit: 100000 },
];

export const mockAuditData = [
  {
    id: "audit-001",
    action: "CARD_CREATED",
    user: "Admin User",
    timestamp: "2024-11-28T14:30:00",
    cardId: "card-001",
    details: "Virtual card created for Marketing department",
  },
  {
    id: "audit-002",
    action: "CARD_FROZEN",
    user: "Admin User",
    timestamp: "2024-11-27T10:00:00",
    cardId: "card-003",
    details: "Card frozen due to suspicious activity",
  },
  {
    id: "audit-003",
    action: "LIMIT_CHANGED",
    user: "System",
    timestamp: "2024-11-26T09:15:00",
    cardId: "card-002",
    details: "Soft limit updated from 50000 to 75000",
  },
];
