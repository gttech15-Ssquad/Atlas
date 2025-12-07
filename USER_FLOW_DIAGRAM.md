# GTBank Corporate Banking Platform - User Flow Diagram

## 1. Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     START: Landing Page                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Login Page                               │
│  - Enter Email/Username                                     │
│  - Enter Password                                           │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
            ✓ Valid        ✗ Invalid
            Credentials    Credentials
                    │                 │
                    ▼                 ▼
         ┌──────────────────┐   ┌─────────────────┐
         │ 2FA OTP Screen   │   │ Error Message   │
         │ Enter OTP        │   │ Retry Login     │
         └────────┬─────────┘   └─────────────────┘
                  │
           ┌──────┴──────┐
           ▼             ▼
        ✓ Valid    ✗ Invalid
        OTP        OTP
           │          │
           ▼          ▼
    ┌─────────────┐  ┌──────────────┐
    │ Dashboard   │  │ Resend OTP   │
    │ (Logged In) │  │ or Retry     │
    └─────────────┘  └──────────────┘
```

## 2. Main Dashboard & Navigation Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      DASHBOARD HOME                             │
│  - Welcome Message: "Welcome back, [User Name]!"               │
│  - Account Balance Summary                                     │
│  - Virtual Cards Count                                         │
│  - Monthly Spending                                            │
│  - Team Members Count                                          │
│  - Recent Transactions List                                    │
│  - System Status                                               │
└────────────────────────┬───────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Sidebar Menu    Navbar Actions    Profile Dropdown
        │                │                │
        │                ▼                ▼
        │           • Notifications   • Profile Settings
        │           • Bell Icon       • Settings
        │                             • Logout
        │
        ├─────────────────────────────────────────┐
        │         SIDEBAR NAVIGATION              │
        │                                         │
        ├─ Dashboard                             │
        ├─ Account Information                   │
        ├─ Transaction History                   │
        ├─ Payments                              │
        ├─ Cards (Dropdown Menu)                 │
        │  ├─ Virtual Cards                      │
        │  └─ Physical Cards                     │
        ├─ Cheque Services                       │
        ├─ User & Role Management                │
        ├─ Audit Trail                           │
        ├─ International Trade                   │
        ├─ Loans & Investments                   │
        ├─ API Integrations                      │
        ├─ Subscription Manager                  │
        └─ Settings                              │
```

## 3. Virtual Card Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│                  VIRTUAL CARDS PAGE                           │
│  - List all user's virtual cards                             │
│  - Card stats (Total, Active, Spending)                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Card List         Actions         Card Details
        │                │                │
        ▼                ▼                ▼
   Click Card    ┌─────────────────┐  View Card:
        │        │ Create Card     │  - Card Number
        │        │ View All Cards  │  - CVV
        │        │ Manage Subs     │  - Expiry Date
        │        └────────┬────────┘  - Balance
        │                 │            - Status
        ▼                 ▼            - Limits
   Card Details    Create New Card
        │                 │
        ├─────────────┬───┼────────────┐
        ▼             ▼   ▼            ▼
   View Info   Set Limit  Choose  Configure
        │      Amount    Category Merchants
        ▼             │       │         │
   Block Card        │       │         │
        │             └───┬──┴─────────┘
        │                 ▼
        │          ┌────────────────┐
        │          │ Approval Queue │
        │          │ (If high-risk) │
        │          └────────┬───────┘
        │                   │
        ▼                   ▼
   Manage Settings   Card Created
        │            (Pending/Active)
        ├─ Update Nickname
        ├─ Change Spending Limit
        ├─ Block/Unblock
        ├─ Restrict Merchants
        └─ Enable/Disable International
```

## 4. Card Approval Workflow (High-Risk Actions)

```
┌──────────────────────────────────┐
│  High-Risk Action Triggered      │
│  (e.g., Change Limits, Freeze)   │
└────────────────┬─────────────────┘
                 ▼
         ┌──────────────────┐
         │ Create Approval  │
         │ Request          │
         └────────┬─────────┘
                  ▼
         ┌──────────────────┐
         │ Route to Approver│
         │ Based on Role    │
         │ - CEO            │
         │ - CFO            │
         │ - Admin          │
         └────────┬─────────┘
                  ▼
    ┌─────────────────────────┐
    │ Approver Notification   │
    │ Review Details          │
    └────────┬────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
   Approve      Reject
      │             │
      ▼             ▼
   Action      Notify Requestor
   Complete    Request Denied
```

## 5. Transaction Flow

```
┌──────────────────────────────────────────────────────────┐
│            TRANSACTIONS / PAYMENTS PAGE                   │
└────────────────────────┬─────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   View History      Make Payment    Bulk Payment
        │                │                │
        ▼                ▼                ▼
   Filter/Search    ┌──────────────┐  Upload File
        │           │ Select Card  │
        │           └──────┬───────┘
        │                  ▼
        │          ┌──────────────────┐
        │          │ Enter Details    │
        │          │ - Recipient      │
        │          │ - Amount         │
        │          │ - Reference      │
        │          └──────┬───────────┘
        │                 ▼
        │          ┌──────────────────┐
        │          │ Verify Balance   │
        │          │ Check Limits     │
        │          └──────┬───────────┘
        │                 ▼
        │          ┌──────────────────┐
        │          │ Review & Confirm │
        │          └──────┬───────────┘
        │                 ▼
        ▼          ┌──────────────────┐
   Transaction    │ Process Payment  │
   Details        │ Update Balance   │
   - Date         │ Create Audit Log │
   - Amount       └──────┬───────────┘
   - Status                │
   - Merchant              ▼
                    ┌──────────────────┐
                    │ Show Confirmation│
                    │ Transaction ID   │
                    │ Receipt Option   │
                    └──────────────────┘
```

## 6. Account & Sub-Accounts Flow

```
┌────────────────────────────────────────┐
│   ACCOUNT INFORMATION PAGE             │
└────────────┬──────────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
Account Info    Sub-Accounts
    │                 │
    ├─ Account No.    ├─ List All Sub-Accounts
    ├─ Balance        ├─ View Sub-Account Details
    ├─ Account Type   ├─ Create New Sub-Account
    ├─ Status         │  ├─ Set Name
    └─ Details        │  ├─ Assign Budget
                      │  └─ Set Permissions
                      │
                      ├─ Edit Sub-Account
                      │  ├─ Update Name
                      │  └─ Adjust Budget
                      │
                      └─ Delete Sub-Account
                         └─ Transfer Funds First
```

## 7. Cheque Services Flow

```
┌────────────────────────────────────────┐
│     CHEQUE SERVICES PAGE               │
└────────────┬──────────────────────────┘
             │
    ┌────────┴──────────┬─────────────┐
    ▼                   ▼             ▼
Cheque Register    Issue Cheque    Cheque Books
    │                   │             │
    ├─ View All        ┌─────────────┐├─ Book A (Active)
    │  Cheques         │ Enter       ││  45 remaining
    │                  │ Details     ││
    ├─ Filter by       ├─ Payee      ├─ Book B (Active)
    │  Status          ├─ Amount     │  78 remaining
    │                  ├─ Reference  │
    ├─ Download        │             ├─ Book C (Pending)
    │  Register        └──────┬──────┘  0 remaining
    │                         ▼
    │                   Review & Print
    │                         │
    └─────────────────┬───────┘
                      ▼
              Cheque Created
              (Can Track Status)
```

## 8. User & Role Management Flow

```
┌────────────────────────────────────────────┐
│  USER & ROLE MANAGEMENT PAGE               │
└────────────┬───────────────────────────────┘
             │
    ┌────────┴──────────┬───────────────┐
    ▼                   ▼               ▼
User List         Add New User      Edit User
    │                   │               │
    ├─ View All Users   └──────┬────────┘
    │                          ▼
    ├─ Search/Filter    ┌──────────────────┐
    │                   │ Enter Details    │
    ├─ Click User       │ - Name           │
    │  Details          │ - Email          │
    │                   │ - Department     │
    ├─ Edit User        │ - Role           │
    │  - Update Info    │ - Status         │
    │  - Change Role    └──────┬───────────┘
    │  - Reset Password        │
    │                          ▼
    ├─ Deactivate User  ┌──────────────────┐
    │                   │ Set Permissions  │
    ├─ Reactivate       │ Based on Role    │
    │                   │ - CEO            │
    └─ Delete User      │ - CFO            │
                        │ - Admin          │
                        │ - Delegate       │
                        │ - Auditor        │
                        └──────┬───────────┘
                               ▼
                        ┌──────────────────┐
                        │ Confirm Changes  │
                        │ Audit Log Entry  │
                        └──────────────────┘
```

## 9. International Trade Flow

```
┌────────────────────────────────────────────┐
│  INTERNATIONAL TRADE PAGE                  │
└────────────┬───────────────────────────────┘
             │
    ┌────────┴───────────┬──────────────┐
    ▼                    ▼              ▼
View Facilities    New Letter of    Request Guarantee
    │              Credit                │
    ├─ List All             │             │
    │  LC/Guarantees        ▼             ▼
    │                ┌────────────────┐  ┌──────────────┐
    ├─ Filter by    │ Enter Details  │  │ Enter Details│
    │  Status       ├─ Beneficiary   │  ├─ Beneficiary │
    │               ├─ Amount/Terms  │  ├─ Amount      │
    ├─ View Details │ Currency       │  ├─ Validity    │
    │  - Ref No.    │ Documents      │  └──────┬───────┘
    │  - Type       └────────┬────────┘         │
    │  - Amount             │                  │
    │  - Status             ▼                  ▼
    │  - Expiry      ┌────────────────┐  ┌──────────────┐
    │               │ Submit for     │  │ Submit for   │
    └─ Download     │ Processing     │  │ Approval     │
       Documents    │ Audit Log      │  │              │
                    └────────────────┘  └──────────────┘
```

## 10. Loans & Investments Flow

```
┌────────────────────────────────────────────┐
│  LOANS & INVESTMENTS PAGE                  │
└────────────┬───────────────────────────────┘
             │
    ┌────────┴──────────┬──────────────┐
    ▼                   ▼              ▼
View Loans         Apply for Loan   View Investments
    │                   │             │
    ├─ List Facilities  ┌─────────┐   ├─ Portfolio
    │                   │ Details │   │  Summary
    ├─ Outstanding      │ Purpose │   │
    │  Balance          │ Amount  │   ├─ FD Accounts
    │                   │ Tenor   │   │
    ├─ Payment Schedule │ Rate    │   ├─ Treasury
    │                   └────┬────┘   │  Bills
    ├─ Download Docs        │        │
    │                       ▼        ├─ Corporate
    └─ View Details  ┌────────────────┐  Bonds
       - Rate        │ Submit Application
       - Available   │ Select Approver  ├─ Maturity
       - Interest    │ Audit Log Entry  │  Dates
                     └────────────────┘ │
                                       └─ Expected
                                          Returns
```

## 11. Audit Trail Flow

```
┌────────────────────────────────────────┐
│       AUDIT TRAIL PAGE                 │
└────────────┬──────────────────────────┘
             │
    ┌────────┴──────────┬─────────────┐
    ▼                   ▼             ▼
View Logs          Filter Logs    Download Report
    │                   │             │
    ├─ All Activities   ├─ By Date    └─ Export as PDF
    │                   ├─ By User    └─ Export as CSV
    ├─ Card Operations  ├─ By Action
    │  - Created        │ - Creation  Audit Log Entry:
    │  - Updated        │ - Deletion  • Who (User)
    │  - Deleted        │ - Approval  • What (Action)
    │  - Frozen         │ - Updates   • When (Timestamp)
    │                   │             • Where (IP)
    ├─ Approvals        └─ By Entity  • Why (Reason)
    │  - Requested
    │  - Approved
    │  - Rejected
    │
    ├─ User Access
    │  - Login
    │  - Logout
    │
    └─ Payment Activity
       - Transactions
       - Transfers
```

## 12. Settings Flow

```
┌────────────────────────────────────────┐
│         SETTINGS PAGE                  │
└────────────┬──────────────────────────┘
             │
    ┌────────┴───────────┬──────────────┐
    ▼                    ▼              ▼
Profile Settings   Notifications    Other Settings
    │                   │             │
    ├─ Personal Info    ├─ Email Alerts├─ Language
    │  - Name           ├─ SMS Alerts  ├─ Theme
    │  - Email          ├─ Push        ├─ Timezone
    │  - Phone          │  Notifications
    │                   │             ├─ API Keys
    ├─ Security         │              │
    │  - Password       ├─ Notification├─ Integration
    │  - 2FA            │  Preferences  │  Settings
    │  - Sessions       │              │
    │                   └─ Manage      └─ Help & Support
    ├─ Department          Channels
    │  - Current Dept
    │  - Role
    │
    └─ Save Changes
       Audit Log Entry
```

## 13. Logout Flow

```
┌──────────────────────────────────────┐
│   User Clicks Logout                 │
└────────────┬───────────────────────┘
             ▼
   ┌──────────────────────────┐
   │ Clear Session/Token      │
   │ Clear Local Storage       │
   │ Close All Active Sessions│
   └────────────┬───────────┘
                ▼
   ┌──────────────────────────┐
   │ Redirect to Login Page   │
   └────────────┬───────────┘
                ▼
   ┌──────────────────────────┐
   │ Display "Logged Out"     │
   │ Message (Optional)       │
   └──────────────────────────┘
```

## 14. Error Handling Flow

```
┌──────────────────────────────────────┐
│      Any Action Fails                │
└────────────┬───────────────────────┘
             ▼
   ┌──────────────────────────┐
   │ Catch Error              │
   │ Log to Audit Trail       │
   └────────────┬───────────┘
                ▼
   ┌──────────────────────────┐
   │ Display Error Message    │
   │ User-Friendly Text       │
   └────────────┬───────────┘
                ▼
   ┌──────────────────────────┐
   │ Provide Options          │
   │ - Retry                  │
   │ - Go Back                │
   │ - Contact Support        │
   └──────────────────────────┘
```

## User Journey Summary

```
┌─────────────────────────────────────────────────────────┐
│              TYPICAL USER JOURNEY                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. LOGIN & AUTHENTICATE                               │
│    ↓                                                   │
│ 2. VIEW DASHBOARD                                     │
│    ↓                                                   │
│ 3. MANAGE VIRTUAL CARDS                              │
│    • Create/Edit/Block Cards                          │
│    • Set Limits & Restrictions                        │
│    ↓                                                   │
│ 4. MAKE TRANSACTIONS                                 │
│    • View History                                     │
│    • Make Payments                                    │
│    • Track Balance                                    │
│    ↓                                                   │
│ 5. MANAGE APPROVALS (if CEO/CFO)                    │
│    • Review Pending Requests                          │
│    • Approve/Reject Actions                           │
│    ↓                                                   │
│ 6. VIEW REPORTS & AUDIT                              │
│    • Check Transaction History                        │
│    • Download Audit Trail                             │
│    • View Account Status                              │
│    ↓                                                   │
│ 7. CONFIGURE SETTINGS                                │
│    • Update Profile                                   │
│    • Change Preferences                               │
│    • Manage Notifications                             │
│    ↓                                                   │
│ 8. LOGOUT                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
