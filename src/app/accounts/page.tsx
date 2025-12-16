"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

const mockAccounts = [
  {
    accountNumber: "20501234567",
    accountName: "Dangote Cement PLC",
    accountType: "Current Account",
    balance: 5000000,
    currency: "NGN",
  },
];

export default function AccountsPage() {
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : "₦";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const rows = mockAccounts.map((account) => [
    <span key="num" className="font-medium font-mono">
      {account.accountNumber}
    </span>,
    <span key="name">{account.accountName}</span>,
    <span key="type">{account.accountType}</span>,
    <span key="bal">{formatCurrency(account.balance, account.currency)}</span>,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Accounts</h1>
        <p className="text-neutral-600 mt-1">
          View and manage your corporate accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Linked Accounts
          </h2>
        </CardHeader>
        <CardBody>
          <Table
            headers={["Account Number", "Account Name", "Type", "Balance"]}
            rows={rows}
          />
        </CardBody>
      </Card>
    </div>
  );
}
