"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { useAccounts } from "@/lib/hooks";

export default function AccountsPage() {
  const { data: accounts = [], isLoading } = useAccounts();

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    const symbol = currency === "USD" ? "$" : "₦";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const rows = (Array.isArray(accounts) ? accounts : []).map((account: any) => [
    <span key="num" className="font-medium font-mono">
      {account.accountNumber || account.AccountNumber || "-"}
    </span>,
    <span key="type">
      {account.accountType || account.AccountType || "Business"}
    </span>,
    <span key="bal">
      {formatCurrency(
        account.balance ||
          account.Balance ||
          account.availableBalance ||
          account.AvailableBalance ||
          0,
        account.currency || account.Currency || "NGN"
      )}
    </span>,
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
          {isLoading ? (
            <p className="text-center py-8 text-neutral-600">
              Loading accounts...
            </p>
          ) : accounts.length === 0 ? (
            <p className="text-center py-8 text-neutral-600">
              No accounts found
            </p>
          ) : (
            <Table
              headers={["Account Number", "Type", "Balance"]}
              rows={rows}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
