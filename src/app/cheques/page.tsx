"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { Plus, Download } from "lucide-react";

export default function ChequeServicesPage() {
  const cheques = [
    {
      id: "CHQ001",
      number: "000123456",
      amount: 500000,
      payee: "Zenith Electronics Ltd",
      status: "cleared",
      date: "2024-12-01",
      expectedDate: "2024-12-02",
    },
    {
      id: "CHQ002",
      number: "000123457",
      amount: 1000000,
      payee: "Premier Logistics",
      status: "pending",
      date: "2024-11-28",
      expectedDate: "2024-12-03",
    },
    {
      id: "CHQ003",
      number: "000123458",
      amount: 750000,
      payee: "Global Trading Corp",
      status: "in-transit",
      date: "2024-11-25",
      expectedDate: "2024-12-05",
    },
    {
      id: "CHQ004",
      number: "000123459",
      amount: 250000,
      payee: "Office Supplies Inc",
      status: "cancelled",
      date: "2024-11-20",
      expectedDate: "2024-11-27",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cleared":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const rows = cheques.map((cheque) => [
    <span key="num" className="font-mono font-semibold text-neutral-900">
      {cheque.number}
    </span>,
    <span key="payee" className="text-neutral-900">
      {cheque.payee}
    </span>,
    <span key="amt" className="font-semibold text-neutral-900">
      ₦{cheque.amount.toLocaleString()}
    </span>,
    <Badge
      key="status"
      variant="success"
      className={getStatusColor(cheque.status)}
    >
      {cheque.status.charAt(0).toUpperCase() + cheque.status.slice(1)}
    </Badge>,
    <span key="date" className="text-sm text-neutral-600">
      {new Date(cheque.date).toLocaleDateString()}
    </span>,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-neutral-900">Cheque Services</h1>
        <p className="text-neutral-600">
          Manage cheques, issue new cheques, and track cheque status.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-sm text-neutral-600">Total Cheques</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-sm text-neutral-600">Cleared</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <p className="text-sm text-neutral-600">In Transit</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <p className="text-sm text-neutral-600">Pending</p>
          </CardBody>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="primary" size="md">
          <Plus size={18} className="mr-2" />
          Issue New Cheque
        </Button>
        <Button variant="outline" size="md">
          <Download size={18} className="mr-2" />
          Download Register
        </Button>
      </div>

      {/* Cheques List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Cheque Register
          </h2>
        </CardHeader>
        <CardBody>
          <Table
            headers={["Cheque #", "Payee", "Amount", "Status", "Date"]}
            rows={rows}
          />
        </CardBody>
      </Card>

      {/* Cheque Books */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Cheque Books
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {[
            {
              book: "Book A",
              range: "000123400 - 000123499",
              status: "active",
              remaining: 45,
            },
            {
              book: "Book B",
              range: "000123500 - 000123599",
              status: "active",
              remaining: 78,
            },
            {
              book: "Book C",
              range: "000123600 - 000123699",
              status: "pending",
              remaining: 0,
            },
          ].map((book) => (
            <div
              key={book.book}
              className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
            >
              <div>
                <p className="font-semibold text-neutral-900">{book.book}</p>
                <p className="text-sm text-neutral-600">{book.range}</p>
              </div>
              <div className="text-right">
                <Badge
                  variant={book.status === "active" ? "success" : "warning"}
                  className={
                    book.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </Badge>
                <p className="text-xs text-neutral-500 mt-2">
                  {book.remaining} remaining
                </p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
