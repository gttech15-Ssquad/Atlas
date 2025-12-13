"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import NextLink from "next/link";
import { FileText, TrendingUp, BarChart3, Clock } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Reports & Analytics
        </h1>
        <p className="text-neutral-600 mt-1">
          View audit logs and transaction history
        </p>
      </div>

      <Alert
        type="info"
        title="Available Reports"
        message="Only Audit Logs and Transaction History are currently available. Additional report types will be enabled in future releases."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audit Logs - Enabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <FileText size={20} className="text-primary" />
              Audit Trail
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              View all system activities and compliance logs
            </p>
            <NextLink href="/audit">
              <Button variant="primary" className="w-full">
                View Audit Trail
              </Button>
            </NextLink>
          </CardBody>
        </Card>

        {/* Transaction Reports - Enabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <TrendingUp size={20} className="text-primary" />
              Transaction History
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              View all your transactions and account movements
            </p>
            <NextLink href="/transactions">
              <Button variant="primary" className="w-full">
                View Transactions
              </Button>
            </NextLink>
          </CardBody>
        </Card>

        {/* Account Statements - Disabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <BarChart3 size={20} className="text-neutral-400" />
              Account Statements
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Download statements in PDF, CSV, or Excel format
            </p>
            <Button variant="outline" className="w-full" disabled>
              Generate Statement (Not Available)
            </Button>
          </CardBody>
        </Card>

        {/* Spending Analysis - Disabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Clock size={20} className="text-neutral-400" />
              Spending Analysis
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Analyze spending patterns and trends
            </p>
            <Button variant="outline" className="w-full" disabled>
              View Analysis (Not Available)
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
