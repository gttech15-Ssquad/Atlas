"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

const mockTransactions = [
  {
    date: "2025-01-15",
    description: "Card Payment - Zenith Bank",
    amount: 150000,
    type: "outgoing",
  },
  {
    date: "2025-01-14",
    description: "Salary Deposit",
    amount: 5000000,
    type: "incoming",
  },
  {
    date: "2025-01-13",
    description: "Transfer",
    amount: 50000,
    type: "outgoing",
  },
  {
    date: "2025-01-12",
    description: "Card Purchase - Online",
    amount: 25000,
    type: "outgoing",
  },
  {
    date: "2025-01-11",
    description: "Refund - Returned Items",
    amount: 75000,
    type: "incoming",
  },
];

export default function TransactionsPage() {
  const rows = mockTransactions.map((tx) => [
    <span key="date" className="text-sm text-neutral-600">
      {tx.date}
    </span>,
    <span key="desc" className="text-neutral-900">
      {tx.description}
    </span>,
    <span
      key="amt"
      className={
        tx.type === "incoming"
          ? "text-green-600 font-medium"
          : "text-red-600 font-medium"
      }
    >
      {tx.type === "incoming" ? "+" : "-"}₦{tx.amount.toLocaleString()}
    </span>,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Transactions</h1>
        <p className="text-neutral-600 mt-1">
          View all account transaction history
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Transactions
          </h2>
        </CardHeader>
        <CardBody>
          <Table headers={["Date", "Description", "Amount"]} rows={rows} />
        </CardBody>
      </Card>
    </div>
  );
}
