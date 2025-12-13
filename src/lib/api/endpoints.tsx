const mainbaseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = `${mainbaseUrl}/api`;

export const endpoints = (query?: string) => {
  // Base path for all API calls is implied as the start of the documented paths
  // e.g., /api/AccountBalance -> /AccountBalance

  const accounts = {
    // GET /api/AccountBalance/balance (from image 1: AccountBalance/balance)
    getBalance: `${baseUrl}/AccountBalance/balance`,
    // GET /api/AccountBalance/summary (from image 1: AccountBalance/summary)
    getSummary: `${baseUrl}/AccountBalance/summary`,
    // POST /api/AccountBalance/fund (from image 1: AccountBalance/fund)
    fundAccount: `${baseUrl}/AccountBalance/fund`,
    // GET /api/AccountBalance/transactions (from image 1: AccountBalance/transactions)
    getTransactions: `${baseUrl}/AccountBalance/transactions${query ? `?${query}` : ""}`,
    // GET /api/AccountBalance/transactions/date-range (from image 1: AccountBalance/transactions/date-range)
    getTransactionsByDateRange: `${baseUrl}/AccountBalance/transactions/date-range`,
  };

  const approvals = {
    // POST /api/Approvals (from image 1: Approvals)
    requestApproval: `${baseUrl}/Approvals`,
    // GET /api/Approvals/pending (from image 1: Approvals/pending)
    getPendingApprovals: `${baseUrl}/Approvals/pending`,
    // GET /api/Approvals/{id} (from image 1: Approvals/{id})
    getSpecificApprovalRequest: (id: string) => `${baseUrl}/Approvals/${id}`,
    // PUT /api/Approvals/{approvalId}/approve (from image 1: Approvals/{approvalId}/approve)
    approve: (approvalId: string) =>
      `${baseUrl}/Approvals/${approvalId}/approve`,
    // PUT /api/Approvals/{approvalId}/reject (from image 1: Approvals/{approvalId}/reject)
    reject: (approvalId: string) => `${baseUrl}/Approvals/${approvalId}/reject`,
    // GET /api/Approvals/{cardId}/history (from image 1: Approvals/{cardId}/history)
    getCardApprovalHistory: (cardId: string) =>
      `${baseUrl}/Approvals/${cardId}/history`,
    // GET /api/Approvals/requirements/{actionType} (from image 1: Approvals/requirements/{actionType})
    getRequirements: (actionType: string) =>
      `${baseUrl}/Approvals/requirements/${actionType}`,
  };

  const audit = {
    // GET /api/Audit (from image 1: Audit)
    getAuditLogs: `${baseUrl}/Audit${query ? `?${query}` : ""}`,
    // GET /api/Audit/user/{userId} (from image 1: Audit/user/{userId})
    getUserAuditLogs: (userId: string) =>
      `${baseUrl}/Audit/user/${userId}${query ? `?${query}` : ""}`,
    // GET /api/Audit/export (from image 1: Audit/export)
    exportAuditLogs: `${baseUrl}/Audit/export`,
  };

  const cards = {
    // POST /api/Cards (from image 3: Cards)
    createCard: `${baseUrl}/Cards`,
    // GET /api/Cards (from image 3: Cards)
    getAllCards: `${baseUrl}/Cards`,
    // GET /api/Cards/{cardId} (from image 3: Cards/{cardId})
    getCardDetails: (cardId: string) => `${baseUrl}/Cards/${cardId}`,
    // PUT /api/Cards/{cardId} (from image 3: Cards/{cardId})
    updateCard: (cardId: string) => `${baseUrl}/Cards/${cardId}`,
    // DELETE /api/Cards/{cardId} (from image 3: Cards/{cardId})
    deleteCard: (cardId: string) => `${baseUrl}/Cards/${cardId}`,
    // GET /api/Cards/{cardId}/detail (from image 3: Cards/{cardId}/detail)
    getComprehensiveCardInfo: (cardId: string) =>
      `${baseUrl}/Cards/${cardId}/details`,
    // POST /api/Cards/{cardId}/freeze (from image 3: Cards/{cardId}/freeze)
    freezeCard: (cardId: string) => `${baseUrl}/Cards/${cardId}/freeze`,
    // POST /api/Cards/{cardId}/unfreeze (from image 3: Cards/{cardId}/unfreeze)
    unfreezeCard: (cardId: string) => `${baseUrl}/Cards/${cardId}/unfreeze`,
    // GET /api/Cards/{cardId}/limits (from image 3: Cards/{cardId}/limits)
    getSpendingLimits: (cardId: string) => `${baseUrl}/Cards/${cardId}/limits`,
    // PUT /api/Cards/{cardId}/limits (from image 3: Cards/{cardId}/limits)
    setSpendingLimits: (cardId: string) => `${baseUrl}/Cards/${cardId}/limits`,
    // GET /api/Cards/{cardId}/balance (from image 3: Cards/{cardId}/balance)
    getCardBalance: (cardId: string) => `${baseUrl}/Cards/${cardId}/balance`,
    // POST /api/Cards/{cardId}/fund (from image 3: Cards/{cardId}/fund)
    fundCard: (cardId: string) => `${baseUrl}/Cards/${cardId}/fund`,
    // PUT /api/Cards/{cardId}/international (from image 3 & 2: Cards/{cardId}/international)
    setInternationalTransactions: (cardId: string) =>
      `${baseUrl}/Cards/${cardId}/international`,
  };

  const departments = {
    // POST /api/Departments (from image 2: Departments)
    createDepartment: `${baseUrl}/Departments`,
    // GET /api/Departments (from image 2: Departments)
    getAllDepartments: `${baseUrl}/Departments`,
    // GET /api/Departments/{departmentId} (from image 2: Departments/{departmentId})
    getDepartmentDetails: (departmentId: string) =>
      `${baseUrl}/Departments/${departmentId}`,
    // PUT /api/Departments/{departmentId} (from image 2: Departments/{departmentId})
    updateDepartment: (departmentId: string) =>
      `${baseUrl}/Departments/${departmentId}`,
    // DELETE /api/Departments/{departmentId} (from image 2: Departments/{departmentId})
    deleteDepartment: (departmentId: string) =>
      `${baseUrl}/Departments/${departmentId}`,
  };

  const organizations = {
    // POST /api/Organizations (from image 2: Organizations)
    createOrganization: `${baseUrl}/Organizations`,
    // GET /api/Organizations (from image 2: Organizations)
    getAllOrganizations: `${baseUrl}/Organizations`,
    // PUT /api/Organizations/{orgId}/settings (from image 2: Organizations/{orgId}/settings)
    updateOrganizationSettings: (orgId: string) =>
      `${baseUrl}/Organizations/${orgId}/settings`,
    // GET /api/Organizations/{orgId}/members (from image 2: Organizations/{orgId}/members)
    getOrganizationMembers: (orgId: string) =>
      `${baseUrl}/Organizations/${orgId}/members`,
    // POST /api/Organizations/{orgId}/members/{userId} (from image 2: Organizations/{orgId}/members/{userId})
    updateMemberRole: (orgId: string, userId: string) =>
      `${baseUrl}/Organizations/${orgId}/members/${userId}`,
    // DELETE /api/Organizations/{orgId}/members/{userId} (from image 2: Organizations/{orgId}/members/{userId})
    removeMember: (orgId: string, userId: string) =>
      `${baseUrl}/Organizations/${orgId}/members/${userId}`,
  };

  const transactions = {
    // GET /api/Transactions/card/{cardId} (from image 2: Transactions/card/{cardId})
    getCardTransactions: (cardId: string) =>
      `${baseUrl}/Transactions/card/${cardId}`,
    // GET /api/Transactions/{transactionId} (from image 2: Transactions/{transactionId})
    getTransactionDetails: (transactionId: string) =>
      `${baseUrl}/Transactions/${transactionId}`,
    // POST /api/Transactions/{transactionId}/complete (from image 2: Transactions/{transactionId}/complete)
    completeTransaction: (transactionId: string) =>
      `${baseUrl}/Transactions/${transactionId}/complete`,
    // POST /api/Transactions/{transactionId}/reverse (from image 2: Transactions/{transactionId}/reverse)
    reverseTransaction: (transactionId: string) =>
      `${baseUrl}/Transactions/${transactionId}/reverse`,
    // POST /api/Transactions/{transactionId}/dispute (from image 2: Transactions/{transactionId}/dispute)
    disputeTransaction: (transactionId: string) =>
      `${baseUrl}/Transactions/${transactionId}/dispute`,
    // GET /api/Transactions/card/{cardId}/summary (from image 2: Transactions/card/{cardId}/summary)
    getCardTransactionSummary: (cardId: string) =>
      `${baseUrl}/Transactions/card/${cardId}/summary`,
  };

  return {
    accounts,
    auth: {
      // POST /api/Auth/register (from your existing code)
      signup: `${baseUrl}/Auth/register`,
      // POST /api/Auth/login (from your existing code)
      login: `${baseUrl}/Auth/login`,
    },
    approvals,
    audit,
    cards,
    departments,
    organizations,
    transactions,
  };
};
