"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, X } from "lucide-react";
import { usePendingApprovals, useProcessApproval } from "@/lib/hooks";

export default function ApprovalsQueuePage() {
  const { data: approvals = [], isLoading } = usePendingApprovals();
  const process = useProcessApproval();

  const pending = approvals.filter(
    (a: any) => a.status === "PENDING" || a.status === "pending"
  );
  const approved = approvals.filter(
    (a: any) => a.status === "APPROVED" || a.status === "approved"
  );

  const handleApprove = async (id: string) => {
    try {
      await process.mutateAsync({ id, approve: true });
    } catch (err) {
      // ignore — error handling could be enhanced
    }
  };

  const handleReject = async (id: string) => {
    try {
      await process.mutateAsync({ id, approve: false });
    } catch (err) {
      // ignore
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
            {pending.map((approval: any) => (
              <div
                key={approval.id}
                className="border border-amber-200 bg-amber-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">
                      {approval.cardName ??
                        approval.card?.nickname ??
                        approval.resourceName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Requested by{" "}
                      {approval.requestedByName ??
                        approval.requestedBy ??
                        approval.requester}
                    </p>
                    <p className="text-lg font-bold text-neutral-900 mt-2">
                      ₦
                      {(
                        approval.amount ??
                        approval.requestAmount ??
                        0
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(approval.id)}
                    >
                      <CheckCircle2 size={16} className="mr-1" /> Approve
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
            {approved.map((approval: any) => (
              <div
                key={approval.id}
                className="border border-green-200 bg-green-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {approval.cardName ??
                        approval.card?.nickname ??
                        approval.resourceName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      ₦
                      {(
                        approval.amount ??
                        approval.requestAmount ??
                        0
                      ).toLocaleString()}{" "}
                      •{" "}
                      {new Date(
                        approval.requestedAt ??
                          approval.createdAt ??
                          approval.requestDate
                      ).toLocaleDateString()}
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
