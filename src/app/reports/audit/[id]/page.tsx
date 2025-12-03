"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Copy } from "lucide-react";

export default function AuditDetailPage() {
  const audit = {
    id: "audit-1",
    timestamp: "2025-11-29T14:30:00Z",
    user: "John Doe",
    action: "Card Creation Approved",
    entity: "VirtualCard",
    status: "success",
    details: {
      cardName: "Marketing Department",
      limit: 500000,
      department: "Marketing",
      international: true,
    },
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/reports/audit">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {audit.action}
          </h1>
          <p className="text-neutral-600 mt-1">Audit ID: {audit.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Basic Information
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Action</p>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
                  <p className="font-medium text-neutral-900">{audit.action}</p>
                  <button
                    onClick={() => copyToClipboard(audit.action)}
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">User</p>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
                  <p className="font-medium text-neutral-900">{audit.user}</p>
                  <button
                    onClick={() => copyToClipboard(audit.user)}
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Timestamp</p>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
                  <p className="font-medium text-neutral-900">
                    {new Date(audit.timestamp).toLocaleString()}
                  </p>
                  <button
                    onClick={() => copyToClipboard(audit.timestamp)}
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Status</p>
                <div className="p-3 bg-green-50 rounded">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {audit.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Details
              </h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {Object.entries(audit.details).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-neutral-600 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
                    <p className="font-medium text-neutral-900">
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value)}
                    </p>
                    <button
                      onClick={() => copyToClipboard(String(value))}
                      className="text-neutral-600 hover:text-neutral-900"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Summary
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Entity Type</p>
                <p className="font-medium text-neutral-900">{audit.entity}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Audit ID</p>
                <p className="font-mono text-sm text-neutral-900">{audit.id}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
