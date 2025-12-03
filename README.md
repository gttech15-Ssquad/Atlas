# GTBank Corporate Account Management Platform

A comprehensive Next.js 14 frontend for GTBank's corporate account management system with virtual card management featuring multi-signatory authorization.

## Features

### Core Functionality

- ✅ **Authentication**: Login with 2FA mock, role-based access control (RBAC)
- ✅ **Virtual Card Management**: Complete card lifecycle management with dual authorization
- ✅ **Multi-Signatory Authorization**: CEO and CFO approval workflows
- ✅ **User Management**: Role-based user administration
- ✅ **Audit Trail**: Comprehensive activity logging and filtering
- ✅ **Subscription Manager**: Vendor subscription tracking and management
- ✅ **Account Management**: Account overview, transactions, sub-accounts
- ✅ **Reports**: Transaction history, audit reports, export functionality

### Roles & Permissions

- **CEO**: Full system access, approve/reject card requests, manage users, delegate authority
- **CFO**: Card approval authority, spending limit changes, user management, reports
- **Admin**: Card creation, user management, department management, card controls
- **Department Head**: View team cards, request cards (with approval)
- **Auditor**: Read-only access to reports and audit trail

### Virtual Card Features

- Instant card creation after dual approval
- 16-digit card number with CVV and expiry date
- Hard and soft spending limits with auto-freeze
- Merchant whitelist management
- International transaction controls
- Card freeze/unfreeze functionality
- Department-based card funding
- Real-time spending analytics

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home redirect to login/dashboard
│   ├── login/                      # Authentication pages
│   ├── dashboard/                  # Main dashboard
│   ├── virtual-cards/              # Virtual card management
│   │   ├── page.tsx               # Card list
│   │   ├── create/                 # Card creation with approval flow
│   │   ├── approvals/              # Approval queue
│   │   └── [id]/                   # Card detail pages
│   ├── users/                      # User management
│   ├── reports/                    # Reports and analytics
│   ├── audit/                      # Audit trail
│   ├── accounts/                   # Account management
│   ├── payments/                   # Payment services
│   ├── subscriptions/              # Subscription manager
│   └── globals.css                 # Global styles
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   └── Table.tsx
│   └── forms/
│       ├── CardCreationForm.tsx
│       └── ApprovalForm.tsx
├── stores/
│   ├── authStore.ts               # Authentication state
│   ├── cardStore.ts               # Virtual card state
│   ├── auditStore.ts              # Audit log state
│   ├── userManagementStore.ts      # User state
│   └── subscriptionStore.ts        # Subscription state
└── utils/
    ├── constants.ts               # App constants
    └── helpers.ts                 # Utility functions
```

## Setup & Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. **Clone or download the repository**

```bash
cd Demeter
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Demo Credentials

Login with any of these demo accounts (2FA code can be any 6 digits):

| Role  | Email            | Password |
| ----- | ---------------- | -------- |
| CEO   | ceo@gtbank.com   | password |
| CFO   | cfo@gtbank.com   | password |
| Admin | admin@gtbank.com | password |

## Key Pages

### Authentication

- `/login` - Login with 2FA

### Dashboard

- `/` or `/dashboard` - Main dashboard with stats and quick actions

### Virtual Cards

- `/virtual-cards` - Card list and management
- `/virtual-cards/create` - Create new card (with approval flow)
- `/virtual-cards/approvals` - Approval queue for pending requests
- `/virtual-cards/[id]` - Card details and spending analytics

### User Management

- `/users` - User list and role management
- `/users/permissions` - Role-based permissions matrix

### Reports & Audit

- `/reports` - Transaction reports
- `/reports/audit` - Audit trail with advanced filtering

### Accounts (Dummy)

- `/accounts` - Account overview
- `/accounts/transactions` - Transaction history
- `/accounts/sub-accounts` - Sub-account management

### Payments (Dummy)

- `/payments` - Single payment form
- `/payments/bulk` - Bulk transfer form
- `/payments/bills` - Bill payment form

### Subscriptions

- `/subscriptions` - Subscription manager dashboard

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand 4
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Custom components + existing library

## Features Implementation Guide

### 1. Multi-Signatory Authorization Flow

The system implements a two-step approval process:

1. **Card Creation Request**

   - User submits card creation form
   - Request stored in `approvalQueue` state
   - CEO and CFO receive notifications

2. **Approval Process**

   - CEO clicks approve → OTP prompt
   - CFO clicks approve → OTP prompt
   - Both must approve before card generation
   - Any rejection returns to requestor

3. **Card Generation**
   - Upon dual approval, card instantly generated
   - 16-digit number, CVV, expiry date assigned
   - Audit log created with approver names

### 2. Virtual Card Management

- **Card Creation**: Form captures name, department, limits, merchants
- **Spending Controls**: Soft limit (warning) and hard limit (freeze)
- **Merchant Control**: Whitelist specific merchants per card
- **International Tx**: Toggle international transaction support
- **Card Operations**: Freeze, unfreeze, delete (with appropriate approvals)

### 3. Role-Based Access Control

Each route is protected by `RoleGuard` component that checks:

- User authentication status
- User role permissions
- Access to specific features

### 4. Audit Trail

Every action logged with:

- Timestamp
- User information
- Action description
- Entity type and ID
- Success/failure status
- IP address and browser
- Before/after values for changes

## State Management (Zustand Stores)

### Auth Store

```typescript
useAuthStore()
- user: User | null
- token: string | null
- isAuthenticated: boolean
- login(email, password, otp)
- logout()
```

### Card Store

```typescript
useCardStore()
- cards: VirtualCard[]
- approvals: CardApprovalRequest[]
- addCard(card)
- createApprovalRequest(request)
- approveRequest(id, role)
- rejectRequest(id, reason)
```

### Audit Store

```typescript
useAuditStore()
- logs: AuditLog[]
- addLog(log)
- filterLogs(filters)
- searchLogs(query)
```

### User Management Store

```typescript
useUserManagementStore()
- users: User[]
- addUser(user)
- updateUser(id, updates)
- getUsersByRole(role)
- disableUser(id, reason)
```

### Subscription Store

```typescript
useSubscriptionStore()
- subscriptions: Subscription[]
- addSubscription(sub)
- getTotalMonthlySpending()
- getTotalAnnualSpending()
```

## Styling

### Color Scheme

- **Background**: `#1A1A1A` (dark-primary)
- **Secondary**: `#252525` (dark-secondary)
- **Tertiary**: `#333333` (dark-tertiary)
- **Primary Accent**: `#00A651` (GTBank green)
- **Secondary**: `#0066CC` (blue)
- **Success**: `#10B981` (green)
- **Warning**: `#F59E0B` (amber)
- **Error**: `#EF4444` (red)

### Responsive Design

- Mobile-first approach (393px base)
- Tablet breakpoints (768px+)
- Desktop breakpoints (1024px+)
- Sidebar hidden on mobile, visible on md+

## Mock Data

All data is stored in Zustand stores with localStorage persistence:

- 3 predefined users (CEO, CFO, Admin)
- Sample virtual cards with spending data
- Mock audit logs
- Sample subscriptions
- Mock transactions and accounts

## API Routes (Mock)

The application simulates API endpoints through Zustand stores. Future backend integration would replace these with real API calls:

```
GET /api/cards
POST /api/cards
GET /api/cards/:id
PUT /api/cards/:id
DELETE /api/cards/:id
POST /api/cards/:id/freeze
GET /api/approvals
POST /api/approvals/:id/approve
POST /api/approvals/:id/reject
GET /api/audit-trail
GET /api/users
POST /api/users
```

## Future Enhancements

- [ ] Real backend API integration
- [ ] PDF/CSV export functionality
- [ ] Email notification system
- [ ] SMS alerts
- [ ] International transaction support
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] WebSocket real-time updates

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Code splitting via Next.js App Router
- Optimized re-renders with Zustand
- Responsive images
- CSS-in-JS with Tailwind
- No unused CSS shipped

## Security

- Role-based access control (RBAC)
- Protected routes with middleware
- Mock 2FA system
- Audit logging for compliance
- Session management with JWT mock
- Input validation with Zod

## Troubleshooting

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

### Build errors

```bash
npm run build
npm start
```

### Clear cache and reinstall

```bash
rm -rf node_modules .next
npm install
npm run dev
```

## Contributing

This is a frontend demo project. Features are documented for reference implementation.

## License

Proprietary - GTBank Corporate

## Support

For issues or questions, refer to the project documentation or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Complete Beta
