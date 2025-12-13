"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { useTransactions } from "@/lib/hooks";

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();

  if (isLoading) return <div>Loading transactions...</div>;

  const rows = (transactions as any[]).map((tx) => [
    <span key="date" className="text-sm text-neutral-600">
      {new Date(tx.date ?? tx.createdAt ?? tx.timestamp).toLocaleDateString()}
    </span>,
    <span key="desc" className="text-neutral-900">
      {tx.description ?? tx.merchant ?? tx.narration}
    </span>,
    <span
      key="amt"
      className={
        tx.type === "incoming" || tx.status === "CREDIT"
          ? "text-green-600 font-medium"
          : "text-red-600 font-medium"
      }
    >
      {tx.type === "incoming" || tx.status === "CREDIT" ? "+" : "-"}₦
      {Math.abs(tx.amount ?? tx.value ?? 0).toLocaleString()}
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
