/\*\*

- QUICK REFERENCE GUIDE
- Cheat sheet for common integration tasks
  \*/

# Quick Reference Guide - API Integration

## 1. Setup (One-time)

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://localhost:5001/api
```

### Install Dependencies

```bash
npm install # All dependencies already in package.json
```

## 2. Common Imports

### Types

```typescript
import {
  VirtualCard,
  Transaction,
  CardBalance,
  CardApproval,
  AuditLog,
} from "@/types";
```

### API Client

```typescript
import { apiClient } from "@/lib/api-client-v2";
```

### Hooks

```typescript
import {
  useCards,
  useCard,
  useCardDetails,
  useCreateCard,
  useCardTransactions,
  useCreateTransaction,
  usePendingApprovals,
} from "@/lib/hooks-v2";
```

### Stores

```typescript
import { useAuthStore } from "@/store/authStoreV2";
import { useCardStore } from "@/store/cardStoreV2";
import { useTransactionStore } from "@/store/transactionStoreV2";
```

### Utilities

```typescript
import {
  maskCardNumber,
  formatCurrency,
  formatDate,
  getCardStatusLabel,
  getTransactionStatusLabel,
} from "@/lib/utils-v2";
```

### Error Handling

```typescript
import {
  ErrorHandler,
  NotificationService,
  ValidationErrorHandler,
} from "@/lib/error-handler";
```

## 3. Authentication Quick Tasks

### Login

```typescript
const { login } = useAuthStore();
await login({ email: "user@example.com", password: "password" });
```

### Get Current User

```typescript
const { user } = useAuthStore();
```

### Logout

```typescript
const { logout } = useAuthStore();
logout();
```

### Change Password

```typescript
const { mutateAsync } = useChangePassword();
await mutateAsync({
  oldPassword: "old",
  newPassword: "new",
});
```

## 4. Card Management Quick Tasks

### Fetch All Cards

```typescript
const { data: cardsData } = useCards({ pageNumber: 1, pageSize: 20 });
```

### Create Card

```typescript
const { mutateAsync } = useCreateCard();
await mutateAsync({
  cardholderName: "John Doe",
  nickname: "Sales Card",
  currency: "USD",
  allowInternational: true,
});
```

### Get Card Details

```typescript
const { data: details } = useCardDetails(cardId);
```

### Get Card Balance

```typescript
const { data: balance } = useCardBalance(cardId);
```

### Freeze Card

```typescript
const { mutateAsync } = useFreezeCard();
await mutateAsync({ cardId, reason: "Security concern" });
```

### Unfreeze Card

```typescript
const { mutateAsync } = useUnfreezeCard();
await mutateAsync(cardId);
```

### Set Card Limit

```typescript
const { mutateAsync } = useSetCardLimit();
await mutateAsync({
  cardId,
  data: {
    limitType: "DAILY",
    amount: 1000,
    period: "DAILY",
    threshold: 80,
  },
});
```

### Fund Card Balance

```typescript
const { mutateAsync } = useFundCardBalance();
await mutateAsync({
  cardId,
  data: {
    amount: 5000,
    reason: "Monthly allocation",
    referenceId: "REF-001",
  },
});
```

## 5. Transaction Quick Tasks

### Get Card Transactions

```typescript
const { data: txnData } = useCardTransactions(cardId, {
  pageNumber: 1,
  pageSize: 10,
});
```

### Create Transaction

```typescript
const { mutateAsync } = useCreateTransaction();
await mutateAsync({
  cardId,
  data: {
    amount: 250,
    merchant: "Amazon",
    merchantCategoryCode: "5411",
  },
});
```

### Reverse Transaction

```typescript
const { mutateAsync } = useReverseTransaction();
await mutateAsync({
  transactionId,
  reason: "Double charged",
});
```

### Dispute Transaction

```typescript
const { mutateAsync } = useDisputeTransaction();
await mutateAsync({
  transactionId,
  reason: "Unauthorized charge",
});
```

### Get Transaction Summary

```typescript
const { data: summary } = useTransactionSummary(
  cardId,
  "2025-01-01",
  "2025-01-31"
);
```

## 6. Approval Workflows Quick Tasks

### Get Pending Approvals

```typescript
const { data: approvals } = usePendingApprovals();
```

### Approve a Request

```typescript
const { mutateAsync } = useApproveApproval();
await mutateAsync({
  approvalId,
  data: { comment: "Approved" },
});
```

### Reject a Request

```typescript
const { mutateAsync } = useRejectApproval();
await mutateAsync({
  approvalId,
  reason: "Insufficient justification",
});
```

### Request Approval for Action

```typescript
const { mutateAsync } = useRequestApproval();
await mutateAsync({
  cardId,
  data: {
    actionType: "FREEZE_CARD",
    actionData: "Security investigation",
  },
});
```

## 7. Audit & Compliance Quick Tasks

### Get Audit Logs

```typescript
const { data: logs } = useAuditLogs({
  action: "CARD_CREATED",
  startDate: "2025-01-01",
  endDate: "2025-01-31",
});
```

### Export Audit Logs

```typescript
const { mutateAsync } = useExportAuditLogs();
const blob = await mutateAsync({ format: "csv" });
// Download the blob
```

## 8. Formatting Quick Tasks

### Format Card Number

```typescript
const masked = maskCardNumber("1234567890123456");
// Output: ****-****-****-3456
```

### Format Currency

```typescript
const formatted = formatCurrency(1500, "USD");
// Output: $1,500.00
```

### Format Date

```typescript
const date = formatDate("2025-01-05T10:30:00Z", "short");
// Output: 01/05/2025
```

### Get Card Status Label

```typescript
const label = getCardStatusLabel("FROZEN");
// Output: Frozen
```

### Get Transaction Status Label

```typescript
const label = getTransactionStatusLabel("COMPLETED");
// Output: Completed
```

## 9. Error Handling Quick Tasks

### Handle API Error

```typescript
try {
  await apiClient.getCards();
} catch (error) {
  const notification = ErrorHandler.handle(error);
  NotificationService.notify(notification);
}
```

### Show Error Notification

```typescript
NotificationService.error("Operation failed", "Please try again");
```

### Show Success Notification

```typescript
NotificationService.success("Card created successfully");
```

### Parse Validation Errors

```typescript
try {
  // API call
} catch (error) {
  const errors = ValidationErrorHandler.parseValidationError(error);
  // errors = { email: ['Email is required'] }
}
```

## 10. State Management Quick Tasks

### Update Card Store

```typescript
const { cards, selectCard, fetchCards } = useCardStore();

// Fetch cards
await fetchCards({ pageNumber: 1, pageSize: 20 });

// Select a card
selectCard(cards[0]);
```

### Update Transaction Store

```typescript
const { transactions, setCurrentCard } = useTransactionStore();

// Set current card
setCurrentCard(123);

// Fetch transactions for that card
await fetchCardTransactions(123);
```

## 11. Type Safety

### Use Type Definitions in Components

```typescript
import { VirtualCard, Transaction } from '@/types';

interface CardProps {
  card: VirtualCard;
  onSelect: (card: VirtualCard) => void;
}

export function CardComponent({ card, onSelect }: CardProps) {
  return <div onClick={() => onSelect(card)}>{card.cardholderName}</div>;
}
```

## 12. React Query Patterns

### Invalidate Cache After Mutation

```typescript
const queryClient = useQueryClient();

const createCard = useMutation({
  mutationFn: (data) => apiClient.createCard(data),
  onSuccess: () => {
    // Automatically handled by hooks-v2.ts
    queryClient.invalidateQueries({ queryKey: ["cards"] });
  },
});
```

### Dependent Queries

```typescript
const { data: card } = useCard(cardId);
const { data: balance } = useCardBalance(
  card?.id ?? 0 // Only fetch if card exists
);
```

## 13. Common Status Constants

### Card Statuses

```typescript
"ACTIVE" | "INACTIVE" | "FROZEN" | "CANCELLED";
```

### Transaction Statuses

```typescript
"PENDING" | "COMPLETED" | "REVERSED" | "DISPUTED" | "FAILED";
```

### Approval Statuses

```typescript
"PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
```

### User Roles

```typescript
"CEO" | "CFO" | "Admin" | "Delegate" | "Auditor";
```

## 14. API Endpoints Summary

| Method | Endpoint                 | Hook                    |
| ------ | ------------------------ | ----------------------- |
| GET    | /cards                   | useCards()              |
| POST   | /cards                   | useCreateCard()         |
| GET    | /cards/{id}              | useCard(id)             |
| PUT    | /cards/{id}              | useUpdateCard()         |
| POST   | /cards/{id}/freeze       | useFreezeCard()         |
| POST   | /cards/{id}/unfreeze     | useUnfreezeCard()       |
| DELETE | /cards/{id}              | useDeleteCard()         |
| GET    | /cards/{id}/balance      | useCardBalance(id)      |
| POST   | /cards/{id}/balance/fund | useFundCardBalance()    |
| GET    | /cards/{id}/limits       | useCardLimits(id)       |
| POST   | /cards/{id}/limits       | useSetCardLimit()       |
| GET    | /transactions/card/{id}  | useCardTransactions(id) |
| POST   | /transactions/card/{id}  | useCreateTransaction()  |
| POST   | /approvals               | useRequestApproval()    |
| GET    | /approvals/pending       | usePendingApprovals()   |
| PUT    | /approvals/{id}/approve  | useApproveApproval()    |
| PUT    | /approvals/{id}/reject   | useRejectApproval()     |
| GET    | /audit                   | useAuditLogs()          |

## 15. Loading & Error States

### In Components

```typescript
const { data, isLoading, error } = useCards();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;

return <CardList cards={data?.items} />;
```

### With Mutation

```typescript
const { mutateAsync, isPending, error } = useCreateCard();

<button disabled={isPending}>
  {isPending ? 'Creating...' : 'Create Card'}
</button>
{error && <Error message={error.message} />}
```

## 16. Pagination

### Simple Pagination

```typescript
const [page, setPage] = useState(1);
const { data } = useCards({ pageNumber: page, pageSize: 20 });

<button onClick={() => setPage(p => p - 1)}>Previous</button>
<span>Page {page} of {Math.ceil(data?.total / 20)}</span>
<button onClick={() => setPage(p => p + 1)}>Next</button>
```

## 17. Filtering

### With Query Parameters

```typescript
const [filters, setFilters] = useState<AuditLogFilters>({
  action: "CARD_CREATED",
  startDate: "2025-01-01",
});

const { data } = useAuditLogs(filters);
```

---

**Pro Tips:**

- Use TypeScript strict mode for better type safety
- Always handle errors in try-catch blocks
- Use React Query for server state, Zustand for UI state
- Memoize expensive computations with useMemo
- Use useCallback for event handlers passed as props
- Test API calls before integrating into components

**Common Gotchas:**

- ❌ Forgetting to add error boundary
- ❌ Not handling loading states
- ❌ Mixing server state (React Query) with UI state (Zustand)
- ❌ Not validating user input
- ❌ Storing sensitive data in localStorage
- ❌ Not setting up CORS correctly on backend
