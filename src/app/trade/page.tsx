"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { Plus, FileText, Globe } from "lucide-react";

export default function InternationalTradePage() {
  const tradeTransactions = [
    {
      id: "LCI001",
      referenceNo: "LC/2024/11/0001",
      type: "Letter of Credit",
      beneficiary: "Shanghai Manufacturing Co",
      amount: 50000,
      currency: "USD",
      status: "active",
      expiryDate: "2024-12-31",
    },
    {
      id: "LCI002",
      referenceNo: "LC/2024/11/0002",
      type: "Documentary Bill",
      beneficiary: "Dubai Trading LLC",
      amount: 75000,
      currency: "USD",
      status: "pending",
      expiryDate: "2024-12-15",
    },
    {
      id: "LCI003",
      referenceNo: "BG/2024/11/0003",
      type: "Bank Guarantee",
      beneficiary: "International Contractors Inc",
      amount: 100000,
      currency: "USD",
      status: "active",
      expiryDate: "2025-03-31",
    },
    {
      id: "LCI004",
      referenceNo: "LC/2024/10/0004",
      type: "Letter of Credit",
      beneficiary: "Hong Kong Exports Ltd",
      amount: 120000,
      currency: "USD",
      status: "closed",
      expiryDate: "2024-11-30",
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

  const rows = tradeTransactions.map((tx) => [
    <span
      key="ref"
      className="font-mono text-sm font-semibold text-neutral-900"
    >
      {tx.referenceNo}
    </span>,
    <span key="type" className="text-neutral-900">
      {tx.type}
    </span>,
    <span key="beneficiary" className="text-neutral-900">
      {tx.beneficiary}
    </span>,
    <span key="amt" className="font-semibold text-neutral-900">
      {tx.currency} {tx.amount.toLocaleString()}
    </span>,
    <Badge key="status" variant="success" className={getStatusColor(tx.status)}>
      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
    </Badge>,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-neutral-900">
          International Trade
        </h1>
        <p className="text-neutral-600">
          Manage letters of credit, guarantees, and international transactions.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-sm text-neutral-600">Total Facilities</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-sm text-neutral-600">Active</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">USD 345,000</div>
            <p className="text-sm text-neutral-600">Total Exposure</p>
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
          New Letter of Credit
        </Button>
        <Button variant="outline" size="md">
          <FileText size={18} className="mr-2" />
          Request Guarantee
        </Button>
      </div>

      {/* Trade Facilities */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Trade Facilities
          </h2>
        </CardHeader>
        <CardBody>
          <Table
            headers={[
              "Reference No",
              "Type",
              "Beneficiary",
              "Amount",
              "Status",
            ]}
            rows={rows}
          />
        </CardBody>
      </Card>

      {/* Supported Countries */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Supported Corridors
          </h2>
        </CardHeader>
        <CardBody className="space-y-0">
          <div className="divide-y divide-neutral-200">
            {[
              {
                region: "Asia Pacific",
                countries: "China, India, Japan, Singapore, Hong Kong",
              },
              {
                region: "Middle East & Africa",
                countries: "UAE, Saudi Arabia, South Africa, Kenya",
              },
              {
                region: "Europe",
                countries: "UK, Germany, France, Netherlands, Belgium",
              },
              {
                region: "Americas",
                countries: "USA, Canada, Brazil, Mexico, Chile",
              },
            ].map((corridor) => (
              <div
                key={corridor.region}
                className="py-4 first:pt-0 last:pb-0 flex items-start gap-4"
              >
                <Globe size={20} className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-neutral-900">
                    {corridor.region}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {corridor.countries}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Compliance Info */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Documentation Required
          </h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {[
            "Proforma Invoice or Purchase Order",
            "Bank's Terms and Conditions",
            "Supplier's Trade References",
            "Certificate of Incorporation",
            "Directors' Identification Documents",
            "Compliance & KYC Documentation",
          ].map((doc, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-neutral-900">{doc}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
