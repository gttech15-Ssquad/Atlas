"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import { useAuditStore } from "@/stores/auditStore";

export default function AuditPage() {
  const allLogs = useAuditStore((state) => state.getAllLogs());
  const [filters, setFilters] = useState({
    action: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    let logs = allLogs;

    if (filters.action) {
      logs = logs.filter((log) =>
        log.action.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    if (filters.status) {
      logs = logs.filter((log) => log.status === filters.status);
    }

    if (filters.startDate) {
      logs = logs.filter(
        (log) =>
          new Date(log.timestamp) >= new Date(filters.startDate + "T00:00:00")
      );
    }

    if (filters.endDate) {
      logs = logs.filter(
        (log) =>
          new Date(log.timestamp) <= new Date(filters.endDate + "T23:59:59")
      );
    }

    return logs;
  }, [allLogs, filters]);

  const rows = filteredLogs.map((log) => [
    <span key="ts" className="text-xs text-neutral-500">
      {new Date(log.timestamp).toLocaleString()}
    </span>,
    <span key="user" className="text-sm text-neutral-900">
      {log.userName}
    </span>,
    <span key="action" className="text-sm text-neutral-900">
      {log.action}
    </span>,
    <span key="entity" className="text-sm text-neutral-600">
      {log.entity}
    </span>,
    <span
      key="status"
      className={`text-xs px-2 py-1 rounded-full ${
        log.status === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {log.status}
    </span>,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Audit Trail</h1>
        <p className="text-neutral-600 mt-1">
          View all system activities and user actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Action"
              placeholder="Search action..."
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              options={[
                { value: "", label: "All Statuses" },
                { value: "success", label: "Success" },
                { value: "failed", label: "Failed" },
              ]}
            />
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="primary" className="flex-1 md:flex-none">
              Apply Filters
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Activity Log ({filteredLogs.length} entries)
          </h2>
        </CardHeader>
        <CardBody>
          <Table
            headers={["Timestamp", "User", "Action", "Entity", "Status"]}
            rows={rows}
          />
        </CardBody>
      </Card>
    </div>
  );
}
