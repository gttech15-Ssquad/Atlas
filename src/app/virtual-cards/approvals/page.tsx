"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, X } from "lucide-react";

const mockApprovals = [
  {
    id: 1,
    cardName: "Marketing Team Card",
    requester: "John Doe",
    amount: 500000,
    status: "pending",
    requestDate: "2025-11-29",
  },
  {
    id: 2,
    cardName: "Sales Department Card",
    requester: "Jane Smith",
    amount: 750000,
    status: "pending",
    requestDate: "2025-11-28",
  },
  {
    id: 3,
    cardName: "Operations Card",
    requester: "Mike Johnson",
    amount: 300000,
    status: "approved",
    requestDate: "2025-11-27",
  },
];

export default function ApprovalsQueuePage() {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [, setSelectedApprovalId] = useState<number | null>(
    null
  );

  const handleApprove = (id: number) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a))
    );
    setSelectedApprovalId(null);
  };

  const handleReject = (id: number) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    setSelectedApprovalId(null);
  };

  const pending = approvals.filter((a) => a.status === "pending");
  const approved = approvals.filter((a) => a.status === "approved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Card Approvals</h1>
        <p className="text-neutral-600 mt-1">
          Review and approve card requests
        </p>
      </div>

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900">
              Pending Approvals ({pending.length})
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {pending.map((approval) => (
              <div
                key={approval.id}
                className="border border-amber-200 bg-amber-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">
                      {approval.cardName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Requested by {approval.requester}
                    </p>
                    <p className="text-lg font-bold text-neutral-900 mt-2">
                      ₦{approval.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(approval.id)}
                    >
                      <CheckCircle2 size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReject(approval.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {approved.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900">
              Approved Requests ({approved.length})
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {approved.map((approval) => (
              <div
                key={approval.id}
                className="border border-green-200 bg-green-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {approval.cardName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      ₦{approval.amount.toLocaleString()} •{" "}
                      {approval.requestDate}
                    </p>
                  </div>
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {pending.length === 0 && approved.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-neutral-600">No approvals to display</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
