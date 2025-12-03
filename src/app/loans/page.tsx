"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { Plus, TrendingUp, FileText } from "lucide-react";

export default function LoansInvestmentsPage() {
  const loanFacilities = [
    {
      id: "LOAN001",
      facilityName: "Term Loan - Expansion",
      amount: 50000000,
      currency: "NGN",
      rate: 12.5,
      tenor: "60 months",
      status: "active",
      disbursedAmount: 45000000,
      remainingBalance: 35000000,
    },
    {
      id: "LOAN002",
      facilityName: "Working Capital Facility",
      amount: 30000000,
      currency: "NGN",
      rate: 14.0,
      tenor: "24 months",
      status: "active",
      disbursedAmount: 30000000,
      remainingBalance: 12000000,
    },
    {
      id: "LOAN003",
      facilityName: "Import Finance",
      amount: 25000000,
      currency: "NGN",
      rate: 13.5,
      tenor: "12 months",
      status: "pending",
      disbursedAmount: 0,
      remainingBalance: 25000000,
    },
  ];

  const investmentPortfolio = [
    {
      id: "INV001",
      name: "Fixed Deposit Account",
      amount: 100000000,
      rate: 8.5,
      maturityDate: "2025-06-30",
      status: "active",
    },
    {
      id: "INV002",
      name: "Treasury Bills",
      amount: 50000000,
      rate: 9.2,
      maturityDate: "2025-03-15",
      status: "active",
    },
    {
      id: "INV003",
      name: "Corporate Bonds",
      amount: 75000000,
      rate: 10.5,
      maturityDate: "2026-12-31",
      status: "active",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const loanRows = loanFacilities.map((loan) => [
    <span key="name" className="font-medium text-neutral-900">
      {loan.facilityName}
    </span>,
    <span key="amt" className="font-semibold text-neutral-900">
      ₦{(loan.amount / 1000000).toFixed(0)}M
    </span>,
    <span key="rate" className="text-neutral-900">
      {loan.rate}%
    </span>,
    <span key="tenor" className="text-neutral-600">
      {loan.tenor}
    </span>,
    <Badge
      key="status"
      variant="success"
      className={getStatusColor(loan.status)}
    >
      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
    </Badge>,
  ]);

  const investmentRows = investmentPortfolio.map((inv) => [
    <span key="name" className="font-medium text-neutral-900">
      {inv.name}
    </span>,
    <span key="amt" className="font-semibold text-neutral-900">
      ₦{(inv.amount / 1000000).toFixed(0)}M
    </span>,
    <span key="rate" className="text-primary font-semibold">
      {inv.rate}%
    </span>,
    <span key="maturity" className="text-sm text-neutral-600">
      {new Date(inv.maturityDate).toLocaleDateString()}
    </span>,
    <Badge
      key="status"
      variant="success"
      className={getStatusColor(inv.status)}
    >
      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
    </Badge>,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-neutral-900">
          Loans & Investments
        </h1>
        <p className="text-neutral-600">
          Manage loan facilities and investment portfolio.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">₦105M</div>
            <p className="text-sm text-neutral-600">Total Loan Facilities</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">₦225M</div>
            <p className="text-sm text-neutral-600">Total Investments</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-sm text-neutral-600">Active Loans</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <p className="text-sm text-neutral-600">Pending Review</p>
          </CardBody>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="primary" size="md">
          <Plus size={18} className="mr-2" />
          Apply for Loan
        </Button>
        <Button variant="outline" size="md">
          <TrendingUp size={18} className="mr-2" />
          View Investment Options
        </Button>
      </div>

      {/* Loan Facilities */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Loan Facilities
          </h2>
        </CardHeader>
        <CardBody>
          <Table
            headers={["Facility Name", "Amount", "Rate", "Tenor", "Status"]}
            rows={loanRows}
          />
        </CardBody>
      </Card>

      {/* Loan Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loanFacilities.slice(0, 2).map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-900">
                {loan.facilityName}
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-xs text-neutral-600 mb-1">Facility Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ₦{(loan.amount / 1000000).toFixed(0)}M
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Disbursed</p>
                  <p className="font-semibold text-neutral-900">
                    ₦{(loan.disbursedAmount / 1000000).toFixed(0)}M
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Available</p>
                  <p className="font-semibold text-green-600">
                    ₦
                    {((loan.amount - loan.disbursedAmount) / 1000000).toFixed(
                      0
                    )}
                    M
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <p className="text-xs text-neutral-600 mb-2">
                  Outstanding Balance
                </p>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(loan.remainingBalance / loan.amount) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm font-semibold text-neutral-900 mt-2">
                  ₦{(loan.remainingBalance / 1000000).toFixed(0)}M
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <FileText size={16} className="mr-2" />
                View Details
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Investment Portfolio */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Investment Portfolio
          </h2>
        </CardHeader>
        <CardBody>
          <Table
            headers={[
              "Investment Type",
              "Amount",
              "Rate",
              "Maturity Date",
              "Status",
            ]}
            rows={investmentRows}
          />
        </CardBody>
      </Card>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Liquid Assets",
            amount: "₦50M",
            percentage: "22%",
            color: "bg-blue-100 text-blue-800",
          },
          {
            title: "Medium Term",
            amount: "₦75M",
            percentage: "33%",
            color: "bg-yellow-100 text-yellow-800",
          },
          {
            title: "Long Term",
            amount: "₦100M",
            percentage: "45%",
            color: "bg-green-100 text-green-800",
          },
        ].map((asset) => (
          <Card key={asset.title}>
            <CardBody className="text-center">
              <p className="text-sm text-neutral-600 mb-2">{asset.title}</p>
              <p className="text-3xl font-bold text-primary mb-2">
                {asset.amount}
              </p>
              <Badge variant="success" className={asset.color}>
                {asset.percentage} of portfolio
              </Badge>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
