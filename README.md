# Atlas - Original Frontend Implementation

**Note: This is legacy frontend implementation. For corrected and optimized version, please use `Virtupay-Corrected-Frontend/` directory.**

## Directory Purpose

This directory contains the original Atlas frontend implementation for GTBank Corporate Account Management Platform. This version was used as a reference for creating the corrected Virtupay Corporate frontend implementation.

## File Structure and Functionality

### Core Application Files

- **`package.json`** - Original package configuration with basic dependencies and scripts for Next.js development.

- **`src/app/layout.tsx`** - Original root layout with basic metadata and global styles setup.

- **`src/app/page.tsx`** - Original home page with authentication-based routing to login or dashboard.

- **`src/app/login/page.tsx`** - Original login page with basic authentication form and 2FA mock.

- **`src/app/dashboard/page.tsx`** - Original dashboard with statistics, charts, and quick actions.

- **`src/app/virtual-cards/page.tsx`** - Original virtual cards listing with basic card management features.

### Components (`/src/components`)

- **`layout/Navbar.tsx`** - Original navigation bar with basic menu and user profile.

- **`layout/Sidebar.tsx`** - Original sidebar navigation with role-based menu items.

- **`ui/`** - Original UI components including Alert, Button, Card, Input, LoadingSpinner, Modal, Select, Table.

- **`forms/CardCreationForm.tsx`** - Original card creation form with basic validation.

- **`forms/ApprovalForm.tsx`** - Original approval form for card requests.

### State Management (`/src/stores`)

- **`authStore.ts`** - Original authentication state management with Zustand.

- **`cardStore.ts`** - Original virtual card state management with Zustand.

- **`auditStore.ts`** - Original audit log state management.

- **`userManagementStore.ts`** - Original user management state.

- **`subscriptionStore.ts`** - Original subscription management state.

### Utilities (`/src/utils`)

- **`constants.ts`** - Original application constants and configuration.

- **`helpers.ts`** - Original utility functions for common operations.

## Subdirectories

- **`/src/app`** - Original Next.js app router pages
- **`/src/components`** - Original UI components and layouts
- **`/src/stores`** - Original Zustand state management
- **`/src/utils`** - Original utility functions

## Dependencies

### Original Dependencies

- **next** - Next.js framework
- **react** & **react-dom** - React libraries
- **typescript** - TypeScript support
- **tailwindcss** - CSS framework
- **zustand** - State management
- **lucide-react** - Icon library
- **recharts** - Chart library

## Known Issues

This original implementation contains several issues that were addressed in the corrected version:

1. **Mock Data Only** - No real backend integration, all data stored in localStorage
2. **Limited Error Handling** - Basic error handling without proper user feedback
3. **Incomplete Validation** - Limited form validation and business rules
4. **Performance Issues** - Suboptimal state management and re-renders
5. **Security Gaps** - Mock authentication without proper security
6. **Accessibility Issues** - Limited accessibility features and ARIA support
7. **Mobile Responsiveness** - Basic responsive design without mobile optimization

## Migration to Corrected Version

To migrate from this original implementation to the corrected Virtupay Corporate frontend:

1. **API Integration** - Replace mock data with real API calls using React Query
2. **Authentication** - Update to proper JWT authentication with secure token handling
3. **State Management** - Migrate to optimized Zustand stores with proper persistence
4. **UI Components** - Replace with accessible Radix UI components
5. **Error Handling** - Implement comprehensive error handling with user feedback
6. **Validation** - Add proper form validation with Zod schemas
7. **Performance** - Implement proper caching and optimization strategies

## Development Status

**This implementation is deprecated and should not be used for production.** Use `Virtupay-Corrected-Frontend/` directory for the current, maintained Virtupay Corporate frontend.

## Legacy Support

This codebase is maintained for reference purposes and to understand the evolution of the Virtupay Corporate frontend. It contains useful UI patterns and approaches that were refined in the corrected implementation.

## Comparison with Corrected Version

| Feature          | Original (Atlas)  | Corrected Version                |
| ---------------- | ----------------- | -------------------------------- |
| Data Source      | Mock localStorage | Real API with React Query        |
| Authentication   | Mock 2FA          | JWT with secure tokens           |
| Error Handling   | Basic             | Comprehensive with user feedback |
| Validation       | Limited           | Extensive with Zod               |
| Performance      | Basic             | Optimized with caching           |
| Accessibility    | Limited           | Full WCAG compliance             |
| Mobile Support   | Basic             | Responsive design                |
| UI Components    | Custom            | Radix UI accessible              |
| State Management | Basic Zustand     | Optimized Zustand with persist   |
| Code Quality     | Basic             | TypeScript strict mode           |
| Testing          | None              | Full test coverage               |

## Historical Context

This implementation represents the initial frontend development phase for the GTBank Corporate platform. It served as a prototype for understanding user requirements and testing UI concepts before the comprehensive refactoring that resulted in the corrected Virtupay Corporate implementation.

## Archiving

This directory should be considered archived. No new features or bug fixes will be applied to this implementation. All development efforts should focus on the corrected version in `Virtupay-Corrected-Frontend/`.

## Technical Debt

The original implementation accumulated significant technical debt:

- **Hardcoded values** throughout the application
- **Inconsistent naming conventions**
- **Missing type definitions** for many components
- **Unused code** and dependencies
- **Inconsistent error handling** patterns
- **Limited documentation** and comments
- **No testing** infrastructure
- **Poor separation of concerns** in components

## Learning Outcomes

Despite its limitations, this implementation provided valuable insights:

- User experience requirements for corporate banking
- Complex approval workflow patterns
- Multi-role permission systems
- Virtual card management UX
- Dashboard analytics needs
- Mobile responsiveness requirements

These insights directly informed the architecture and feature set of the corrected Virtupay Corporate frontend implementation.

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
