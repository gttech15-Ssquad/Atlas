"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Plus } from "lucide-react";

const mockSubAccounts = [
  {
    id: 1,
    name: "Petty Cash",
    accountNumber: "2050111111111",
    balance: 500000,
  },
  {
    id: 2,
    name: "Travel Expenses",
    accountNumber: "2050222222222",
    balance: 300000,
  },
  {
    id: 3,
    name: "Project Alpha",
    accountNumber: "2050333333333",
    balance: 1000000,
  },
];

export default function SubAccountsPage() {
  const rows = mockSubAccounts.map((sub) => [
    <span key="name" className="font-medium text-neutral-900">
      {sub.name}
    </span>,
    <span key="num" className="font-mono text-sm text-neutral-600">
      {sub.accountNumber}
    </span>,
    <span key="bal" className="font-medium text-neutral-900">
      ₦{sub.balance.toLocaleString()}
    </span>,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Sub-Accounts</h1>
          <p className="text-neutral-600 mt-1">
            Manage department and project sub-accounts
          </p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus size={18} />
          New Sub-Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Active Sub-Accounts
          </h2>
        </CardHeader>
        <CardBody>
          <Table headers={["Name", "Account Number", "Balance"]} rows={rows} />
        </CardBody>
      </Card>
    </div>
  );
}
