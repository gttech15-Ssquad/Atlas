"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  CreditCard,
  Send,
  Lock,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

interface PhysicalCard {
  id: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  status: "active" | "inactive" | "blocked" | "pending";
  department: string;
  spendingLimit: number;
  monthlySpent: number;
  cardType: string;
  issueDate: string;
}

export default function PhysicalCardsPage() {
  const [visibleCVVs, setVisibleCVVs] = React.useState<Set<string>>(new Set());

  const physicalCards: PhysicalCard[] = [
    {
      id: "1",
      cardholderName: "Chioma Okafor",
      cardNumber: "4532 •••• •••• 8901",
      expiryDate: "12/25",
      cvv: "•••",
      status: "active",
      department: "Finance",
      spendingLimit: 50000,
      monthlySpent: 32500,
      cardType: "Corporate Gold",
      issueDate: "2023-06-15",
    },
    {
      id: "2",
      cardholderName: "Emeka Nwosu",
      cardNumber: "4532 •••• •••• 5234",
      expiryDate: "08/26",
      cvv: "•••",
      status: "active",
      department: "Operations",
      spendingLimit: 35000,
      monthlySpent: 18000,
      cardType: "Corporate Platinum",
      issueDate: "2024-01-20",
    },
    {
      id: "3",
      cardholderName: "Adekunle Adeyemi",
      cardNumber: "4532 •••• •••• 7456",
      expiryDate: "03/24",
      cvv: "•••",
      status: "pending",
      department: "Marketing",
      spendingLimit: 25000,
      monthlySpent: 0,
      cardType: "Corporate Standard",
      issueDate: "2024-10-01",
    },
    {
      id: "4",
      cardholderName: "Ngozi Okoro",
      cardNumber: "4532 •••• •••• 6789",
      expiryDate: "05/25",
      cvv: "•••",
      status: "blocked",
      department: "Sales",
      spendingLimit: 40000,
      monthlySpent: 12000,
      cardType: "Corporate Gold",
      issueDate: "2023-11-10",
    },
  ];

  const toggleCVVVisibility = (cardId: string) => {
    setVisibleCVVs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-neutral-900">Physical Cards</h1>
        <p className="text-neutral-600">
          Manage corporate physical cards for your team members and departments.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-sm text-neutral-600">Total Cards</p>
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
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <p className="text-sm text-neutral-600">Pending</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-sm text-neutral-600">Blocked</p>
          </CardBody>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/physical-cards/request">
          <Button variant="primary" size="md">
            <CreditCard size={18} className="mr-2" />
            Request New Card
          </Button>
        </Link>
        <Button variant="outline" size="md">
          <Send size={18} className="mr-2" />
          Bulk Order
        </Button>
      </div>

      {/* Physical Cards List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Physical Cards
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {physicalCards.map((card) => (
            <div
              key={card.id}
              className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {card.cardholderName}
                  </h3>
                  <p className="text-sm text-neutral-600">{card.department}</p>
                </div>
                <Badge
                  variant="success"
                  className={getStatusColor(card.status)}
                >
                  {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </Badge>
              </div>

              <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-4 mb-4 flex items-end justify-between">
                <div>
                  <p className="text-sm opacity-75 mb-2">Card Number</p>
                  <p className="font-mono text-lg font-semibold">
                    {card.cardNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Card Type</p>
                  <p className="text-sm font-semibold">{card.cardType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Expiry Date</p>
                  <p className="font-semibold text-neutral-900">
                    {card.expiryDate}
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">CVV</p>
                    <p className="font-semibold text-neutral-900">
                      {visibleCVVs.has(card.id)
                        ? card.cvv.replace(/•/g, "•")
                        : card.cvv}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCVVVisibility(card.id)}
                    className="p-1 hover:bg-neutral-100 rounded"
                  >
                    {visibleCVVs.has(card.id) ? (
                      <EyeOff size={16} className="text-neutral-600" />
                    ) : (
                      <Eye size={16} className="text-neutral-600" />
                    )}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Issue Date</p>
                  <p className="font-semibold text-neutral-900">
                    {new Date(card.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Limit</p>
                  <p className="font-semibold text-neutral-900">
                    ₦{card.spendingLimit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-neutral-900">
                    Monthly Spend
                  </p>
                  <p className="text-sm text-neutral-600">
                    ₦{card.monthlySpent.toLocaleString()} of ₦
                    {card.spendingLimit.toLocaleString()}
                  </p>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(card.monthlySpent / card.spendingLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Lock size={16} className="mr-2" />
                  Block Card
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <CreditCard size={16} className="mr-2" />
                  Manage Settings
                </Button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg transition">
                  <MoreVertical size={16} className="text-neutral-600" />
                </button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Recent Card Requests
          </h2>
        </CardHeader>
        <CardBody className="space-y-0">
          <div className="divide-y divide-neutral-200">
            {[
              {
                name: "Tunde Olanrewaju",
                department: "IT",
                requestDate: "2024-12-01",
                status: "approved",
              },
              {
                name: "Fatima Hassan",
                department: "HR",
                requestDate: "2024-11-28",
                status: "pending",
              },
              {
                name: "David Okonkwo",
                department: "Procurement",
                requestDate: "2024-11-25",
                status: "approved",
              },
            ].map((request, idx) => (
              <div
                key={idx}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-neutral-900">{request.name}</p>
                  <p className="text-sm text-neutral-600">
                    {request.department}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      request.status === "approved" ? "success" : "warning"
                    }
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </Badge>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
