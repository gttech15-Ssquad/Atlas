"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Lock, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useOrganizationMembers } from "@/lib/hooks";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const orgId =
    useAuthStore((s) => s.organizationId) ??
    (typeof localStorage !== "undefined"
      ? localStorage.getItem("organization_id")
      : null);
  const { data: members = [], isLoading } = useOrganizationMembers(
    orgId ?? undefined
  );

  const filtered = (members as any[])
    .filter((m) => {
      const name =
        (m.userFirstName ?? m.user?.firstName ?? m.userName ?? "") +
        " " +
        (m.userLastName ?? m.user?.lastName ?? "");
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.userEmail ?? m.user?.email ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    })
    .slice(0, 200);

  if (isLoading) return <div>Loading users...</div>;

  const rows = filtered.map((m) => {
    const name =
      `${m.userFirstName ?? m.user?.firstName ?? ""} ${m.userLastName ?? m.user?.lastName ?? ""}`.trim();
    const email = m.userEmail ?? m.user?.email ?? "";
    const role = m.orgRole ?? m.user?.role ?? "";
    const dept = m.user?.department ?? "";
    const status = m.status ?? "";
    return [
      <span key="name" className="text-sm font-medium text-neutral-900">
        {name || email}
      </span>,
      <span key="email" className="text-sm text-neutral-600">
        {email}
      </span>,
      <span key="role" className="text-sm text-neutral-900">
        {role}
      </span>,
      <span key="dept" className="text-sm text-neutral-600">
        {dept}
      </span>,
      <span
        key="status"
        className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"
      >
        {status}
      </span>,
      <div key="actions" className="flex gap-2">
        <Button variant="outline" size="sm">
          <Lock size={16} />
        </Button>
        <Button variant="danger" size="sm">
          <Trash2 size={16} />
        </Button>
      </div>,
    ];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Users</h1>
          <p className="text-neutral-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button variant="primary">
          <Plus size={16} className="mr-2" /> Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Search</h2>
        </CardHeader>
        <CardBody>
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            All Users ({members.length})
          </h2>
        </CardHeader>
        <CardBody>
          <Table
            headers={[
              "Name",
              "Email",
              "Role",
              "Department",
              "Status",
              "Actions",
            ]}
            rows={rows}
          />
        </CardBody>
      </Card>
    </div>
  );
}
