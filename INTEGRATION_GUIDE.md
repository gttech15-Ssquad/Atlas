/\*\*

- INTEGRATION GUIDE
- Complete guide for integrating the Next.js frontend with C# backend
  \*/

# VirtupayCorpAPI - Next.js Frontend Integration Guide

## Overview

This integration package provides a complete TypeScript/React setup to consume your C# VirtupayCorpAPI backend. It includes:

- ✅ Full type-safe API client
- ✅ Zustand stores for state management
- ✅ React Query hooks for data fetching
- ✅ Comprehensive error handling
- ✅ Utility functions and formatters
- ✅ Authentication management

## Files Created

### 1. Type Definitions (`src/types/index.ts`)

Complete TypeScript interfaces for all API endpoints:

- Authentication types (LoginRequest, AuthResponse, UserProfile)
- Virtual Card types (VirtualCard, CardBalance, CardLimit)
- Transaction types (Transaction, TransactionSummary)
- Approval types (CardApproval, ApprovalStatus)
- Audit types (AuditLog, AuditLogFilters)
- Enums and constants for all statuses

### 2. API Client (`src/lib/api-client-v2.ts`)

Axios-based HTTP client with:

- Base URL configuration
- JWT token management (localStorage)
- Request/response interceptors
- Error handling
- All CRUD operations for backend endpoints
- Singleton pattern for consistency

### 3. Zustand Stores

State management for different domains:

#### `src/store/authStoreV2.ts`

- User authentication state
- Login/register/logout actions
- Profile management
- Error handling

#### `src/store/cardStoreV2.ts`

- Virtual card operations
- Balance and limit management
- Card list pagination
- Error handling

#### `src/store/transactionStoreV2.ts`

- Transaction management
- Transaction summaries
- Transaction history
- Dispute/reverse operations

### 4. React Query Hooks (`src/lib/hooks-v2.ts`)

Reusable hooks for:

- Fetching cards, transactions, approvals
- Creating/updating operations
- Automatic cache management
- Optimistic updates

### 5. Utilities (`src/lib/utils-v2.ts`)

Helper functions:

- Card number masking
- Currency/date formatting
- Card status utilities
- Validation functions
- Error parsing

### 6. Error Handler (`src/lib/error-handler.ts`)

Centralized error management:

- ErrorHandler class for parsing errors
- NotificationService for user notifications
- Validation error handling
- Retry logic

## Environment Setup

### 1. Create `.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://localhost:5001/api

# For development with CORS
NEXT_PUBLIC_API_TIMEOUT=15000
```

### 2. Update `next.config.ts` (if needed for proxy)

```typescript
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "https://localhost:5001/api/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
```

### 3. Install Dependencies (if not already installed)

```bash
npm install axios @tanstack/react-query zustand
```

## Usage Examples

### 1. Authentication

#### Login Example

```typescript
// components/LoginForm.tsx
import { useAuthStore } from '@/store/authStoreV2';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  async function handleLogin(email: string, password: string) {
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const email = new FormData(e.currentTarget).get('email') as string;
      const password = new FormData(e.currentTarget).get('password') as string;
      handleLogin(email, password);
    }}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

#### Using React Query Hook

```typescript
import { useLogin } from '@/lib/hooks-v2';

export function LoginPage() {
  const loginMutation = useLogin();

  async function onLogin(email: string, password: string) {
    try {
      await loginMutation.mutateAsync({ email, password });
      // Redirect on success
    } catch (error) {
      // Handle error
    }
  }

  return (
    // Your login form
  );
}
```

### 2. Virtual Card Management

#### Fetch All Cards

```typescript
// pages/virtual-cards/index.tsx
import { useCards } from '@/lib/hooks-v2';
import { formatCurrency, getCardStatusLabel } from '@/lib/utils-v2';

export default function VirtualCardsPage() {
  const { data, isLoading, error } = useCards({ pageNumber: 1, pageSize: 20 });

  if (isLoading) return <div>Loading cards...</div>;
  if (error) return <div>Error loading cards: {error.message}</div>;

  return (
    <div>
      <h1>Virtual Cards</h1>
      <table>
        <thead>
          <tr>
            <th>Card Number</th>
            <th>Cardholder</th>
            <th>Status</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((card) => (
            <tr key={card.id}>
              <td>{card.cardNumber}</td>
              <td>{card.cardholderName}</td>
              <td>{getCardStatusLabel(card.status)}</td>
              <td>{card.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### Create New Card

```typescript
import { useCreateCard } from '@/lib/hooks-v2';

export function CreateCardForm() {
  const createCard = useCreateCard();

  async function handleSubmit(formData: FormData) {
    try {
      await createCard.mutateAsync({
        cardholderName: formData.get('cardholderName') as string,
        nickname: formData.get('nickname') as string,
        currency: 'USD',
        allowInternational: true,
      });
      // Success - card created
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      <input name="cardholderName" placeholder="Cardholder Name" required />
      <input name="nickname" placeholder="Card Nickname (optional)" />
      <button disabled={createCard.isPending}>
        {createCard.isPending ? 'Creating...' : 'Create Card'}
      </button>
    </form>
  );
}
```

#### View Card Details with Balance

```typescript
import { useCardDetails, useCardBalance, useCardLimits } from '@/lib/hooks-v2';
import { formatCurrency, getCardStatusColor } from '@/lib/utils-v2';

export function CardDetailsPage({ cardId }: { cardId: number }) {
  const { data: details } = useCardDetails(cardId);
  const { data: balance } = useCardBalance(cardId);
  const { data: limits } = useCardLimits(cardId);

  if (!details || !balance) return <div>Loading...</div>;

  return (
    <div>
      <h2>{details.card.cardholderName}</h2>
      <p>Card: {details.card.cardNumber}</p>
      <p>Status: {details.card.status}</p>

      <div className="balance-section">
        <h3>Balance</h3>
        <p>Total: {formatCurrency(balance.totalBalance, balance.currency)}</p>
        <p>Available: {formatCurrency(balance.availableBalance, balance.currency)}</p>
        <p>Used: {formatCurrency(balance.usedBalance, balance.currency)}</p>
        <progress value={balance.percentageUsed} max="100" />
      </div>

      <div className="limits-section">
        <h3>Limits</h3>
        {limits?.map((limit) => (
          <div key={limit.id}>
            <p>{limit.limitType}: {formatCurrency(limit.amount, 'USD')}</p>
            <p>Used: {limit.percentageUsed}%</p>
            {limit.isWarningReached && <p className="warning">Limit warning!</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Freeze Card

```typescript
import { useFreezeCard } from '@/lib/hooks-v2';

export function FreezeCardButton({ cardId }: { cardId: number }) {
  const freezeCard = useFreezeCard();

  async function handleFreeze() {
    const reason = prompt('Why are you freezing this card?');
    if (reason) {
      try {
        await freezeCard.mutateAsync({ cardId, reason });
        alert('Card frozen successfully');
      } catch (error) {
        alert('Failed to freeze card');
      }
    }
  }

  return (
    <button onClick={handleFreeze} disabled={freezeCard.isPending}>
      {freezeCard.isPending ? 'Freezing...' : 'Freeze Card'}
    </button>
  );
}
```

### 3. Transactions

#### View Card Transactions

```typescript
import { useCardTransactions } from '@/lib/hooks-v2';
import { formatCurrency, formatDate, getTransactionStatusLabel } from '@/lib/utils-v2';

export function CardTransactionsPage({ cardId }: { cardId: number }) {
  const { data: transactions, isLoading } = useCardTransactions(cardId, {
    pageNumber: 1,
    pageSize: 10,
  });

  if (isLoading) return <div>Loading transactions...</div>;

  return (
    <div>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.items.map((txn) => (
            <tr key={txn.id}>
              <td>{formatDate(txn.createdAt)}</td>
              <td>{txn.merchant}</td>
              <td>{formatCurrency(txn.amount, txn.currency)}</td>
              <td>{getTransactionStatusLabel(txn.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### Create Transaction

```typescript
import { useCreateTransaction } from '@/lib/hooks-v2';

export function CreateTransactionForm({ cardId }: { cardId: number }) {
  const createTransaction = useCreateTransaction();

  async function handleSubmit(formData: FormData) {
    try {
      await createTransaction.mutateAsync({
        cardId,
        data: {
          amount: parseFloat(formData.get('amount') as string),
          merchant: formData.get('merchant') as string,
          merchantCategoryCode: formData.get('mcc') as string,
        },
      });
      alert('Transaction created');
    } catch (error) {
      alert('Failed to create transaction');
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      <input type="number" name="amount" placeholder="Amount" step="0.01" required />
      <input name="merchant" placeholder="Merchant Name" required />
      <input name="mcc" placeholder="Merchant Category Code (optional)" />
      <button disabled={createTransaction.isPending}>
        Create Transaction
      </button>
    </form>
  );
}
```

#### Dispute Transaction

```typescript
import { useDisputeTransaction } from '@/lib/hooks-v2';

export function DisputeTransactionButton({ transactionId }: { transactionId: number }) {
  const disputeTransaction = useDisputeTransaction();

  async function handleDispute() {
    const reason = prompt('Why are you disputing this transaction?');
    if (reason) {
      try {
        await disputeTransaction.mutateAsync({ transactionId, reason });
        alert('Transaction disputed');
      } catch (error) {
        alert('Failed to dispute transaction');
      }
    }
  }

  return (
    <button onClick={handleDispute} disabled={disputeTransaction.isPending}>
      Dispute Transaction
    </button>
  );
}
```

### 4. Approval Workflows

#### View Pending Approvals

```typescript
import { usePendingApprovals } from '@/lib/hooks-v2';

export function PendingApprovalsPage() {
  const { data: approvals, isLoading } = usePendingApprovals();

  if (isLoading) return <div>Loading approvals...</div>;

  return (
    <div>
      <h1>Pending Approvals</h1>
      {approvals?.map((approval) => (
        <ApprovalCard key={approval.id} approval={approval} />
      ))}
    </div>
  );
}

function ApprovalCard({ approval }: { approval: CardApproval }) {
  const approveApproval = useApproveApproval();
  const rejectApproval = useRejectApproval();

  return (
    <div className="approval-card">
      <p>Action: {approval.actionType}</p>
      <p>Status: {approval.status}</p>
      <p>Created: {new Date(approval.createdAt).toLocaleDateString()}</p>

      <button
        onClick={() => approveApproval.mutateAsync({ approvalId: approval.id })}
        disabled={approveApproval.isPending}
      >
        Approve
      </button>

      <button
        onClick={() => {
          const reason = prompt('Rejection reason?');
          if (reason) {
            rejectApproval.mutateAsync({ approvalId: approval.id, reason });
          }
        }}
        disabled={rejectApproval.isPending}
      >
        Reject
      </button>
    </div>
  );
}
```

### 5. Error Handling

#### Using Error Handler

```typescript
import { ErrorHandler, NotificationService } from "@/lib/error-handler";

async function handleApiCall() {
  try {
    // Make API call
  } catch (error) {
    const notification = ErrorHandler.handle(error);
    NotificationService.notify(notification);
  }
}
```

#### Using Notification Service

```typescript
import { NotificationService } from "@/lib/error-handler";

// Show error
NotificationService.error("Failed to create card", "Please try again");

// Show success
NotificationService.success("Card created successfully");

// Show warning
NotificationService.warning("Limited balance remaining");

// Show info
NotificationService.info("Processing your request");
```

#### Create Error Notification Component

```typescript
// components/NotificationCenter.tsx
import { useEffect, useState } from 'react';
import { NotificationService, ErrorNotification } from '@/lib/error-handler';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((notification) => {
      if (notification.message) {
        // Add notification
        setNotifications((prev) => [...prev, notification]);
      } else {
        // Remove notification (dismissal)
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          {notification.details && <p className="details">{notification.details}</p>}
          {notification.action && (
            <button onClick={notification.action.callback}>
              {notification.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## State Management Patterns

### Using Zustand Store

```typescript
import { useCardStore } from '@/store/cardStoreV2';

export function CardManagement() {
  const {
    cards,
    selectedCard,
    isLoading,
    fetchCards,
    createCard,
    selectCard,
  } = useCardStore();

  useEffect(() => {
    fetchCards({ pageNumber: 1, pageSize: 20 });
  }, []);

  return (
    <div>
      {cards.map((card) => (
        <div key={card.id} onClick={() => selectCard(card)}>
          {card.cardholderName}
        </div>
      ))}
    </div>
  );
}
```

### Combining with React Query

```typescript
import { useCards } from "@/lib/hooks-v2";

// Use React Query for server state
const { data: cardsData } = useCards();

// Use Zustand for UI state
const { selectedCard, selectCard } = useCardStore();

// Best practice: Use React Query for data fetching,
// Zustand for UI state and complex business logic
```

## Configuration

### CORS Configuration (Backend)

Add to your C# `Program.cs`:

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();
app.UseCors("AllowLocalhost");
```

### SSL Certificate (For HTTPS)

For development, your C# backend may use a self-signed certificate. To handle this in development:

```typescript
// lib/api-client-v2.ts
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://localhost:5001/api"
    : process.env.NEXT_PUBLIC_API_URL || "https://api.virtupay.com/api";
```

## Testing Integration

### Test API Connection

```typescript
import { apiClient } from "@/lib/api-client-v2";

async function testConnection() {
  try {
    const health = await apiClient.healthCheck();
    console.log("API is healthy:", health);
  } catch (error) {
    console.error("API is down:", error);
  }
}
```

### Mock API for Development

```typescript
// Optional: Mock API responses for development
if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
  // Use MSW (Mock Service Worker) or similar
}
```

## Best Practices

1. **Always use hooks for data fetching** - React Query handles caching and synchronization
2. **Validate user input** - Use the validation utilities before making API calls
3. **Handle errors gracefully** - Use NotificationService for user feedback
4. **Use TypeScript** - Take advantage of type safety
5. **Organize by feature** - Keep API, stores, and components together
6. **Cache strategically** - Configure staleTime appropriately for your use cases
7. **Implement optimistic updates** - Make UI feel faster
8. **Log errors** - Send errors to logging service (optional)

## Troubleshooting

### CORS Errors

- Ensure backend CORS policy allows your frontend origin
- Check API_URL environment variable

### 401 Unauthorized

- Token may be expired
- Check localStorage for authToken
- Try logging in again

### Network Timeouts

- Increase timeout in api-client-v2.ts
- Check if backend is running

### Type Errors

- Ensure types/index.ts matches backend response format
- Run TypeScript compiler: `tsc --noEmit`

## Next Steps

1. Update environment variables with your API URL
2. Test authentication flow
3. Implement card management pages
4. Add transaction features
5. Implement approval workflows
6. Add audit logging views
7. Style components with Tailwind
8. Add form validation
9. Implement loading/error states
10. Deploy to production

## Support

For questions or issues:

1. Check the backend API documentation
2. Review type definitions for request/response structure
3. Check React Query documentation
4. Review Zustand documentation
5. Check error logs in browser console

---

**Last Updated**: December 2025
**Backend Version**: VirtupayCorpAPI v1.0
**Frontend Framework**: Next.js 14+ with TypeScript
