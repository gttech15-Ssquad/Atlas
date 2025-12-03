"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, TrendingUp, BarChart3, Clock } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Reports & Analytics
        </h1>
        <p className="text-neutral-600 mt-1">
          Generate and download reports for analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <FileText size={20} className="text-primary" />
              Account Statements
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Download statements in PDF, CSV, or Excel format
            </p>
            <Button variant="primary" className="w-full">
              Generate Statement
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <TrendingUp size={20} className="text-primary" />
              Transaction Reports
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Detailed transaction logs and analysis
            </p>
            <Button variant="primary" className="w-full">
              View Transactions
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <BarChart3 size={20} className="text-primary" />
              Spending Analysis
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Analyze spending patterns and trends
            </p>
            <Button variant="primary" className="w-full">
              View Analysis
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Clock size={20} className="text-primary" />
              Scheduled Reports
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Manage automated report delivery
            </p>
            <Button variant="primary" className="w-full">
              Configure Schedule
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
