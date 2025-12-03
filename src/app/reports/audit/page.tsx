"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Download, Eye } from "lucide-react";

const mockAuditLogs = [
  {
    id: "1",
    timestamp: "2025-11-29T14:30:00Z",
    user: "John Doe",
    action: "Card Creation Approved",
    entity: "VirtualCard",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2025-11-29T13:15:00Z",
    user: "Jane Smith",
    action: "User Created",
    entity: "User",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2025-11-29T12:45:00Z",
    user: "System Admin",
    action: "Card Limit Modified",
    entity: "VirtualCard",
    status: "success",
  },
];

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockAuditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Audit Trail</h1>
          <p className="text-neutral-600 mt-1">
            Complete activity log with filters
          </p>
        </div>
        <Button variant="secondary">
          <Download size={18} className="mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        </CardHeader>
        <CardBody>
          <Input
            placeholder="Search by action or user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Activity Logs ({filtered.length})
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">
                      {log.action}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {log.user} • {log.entity}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        log.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                    <Link href={`/reports/audit/${log.id}`}>
                      <Button variant="secondary" size="sm">
                        <Eye size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
