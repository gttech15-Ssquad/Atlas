"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Lock, Trash2 } from "lucide-react";

const mockUsers = [
  {
    id: "1",
    name: "Chukwu Obi",
    email: "chukwu.obi@gtbank.com",
    role: "CEO",
    department: "Executive",
    status: "active",
  },
  {
    id: "2",
    name: "Adeyemi Okoro",
    email: "adeyemi.okoro@gtbank.com",
    role: "CFO",
    department: "Finance",
    status: "active",
  },
  {
    id: "3",
    name: "Zainab Hassan",
    email: "zainab.hassan@gtbank.com",
    role: "Admin",
    department: "Operations",
    status: "active",
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const rows = mockUsers.map((user) => [
    <span key="name" className="text-sm font-medium text-neutral-900">
      {user.name}
    </span>,
    <span key="email" className="text-sm text-neutral-600">
      {user.email}
    </span>,
    <span key="role" className="text-sm text-neutral-900">
      {user.role}
    </span>,
    <span key="dept" className="text-sm text-neutral-600">
      {user.department}
    </span>,
    <span
      key="status"
      className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"
    >
      {user.status}
    </span>,
    <div key="actions" className="flex gap-2">
      <Button variant="outline" size="sm">
        <Lock size={16} />
      </Button>
      <Button variant="danger" size="sm">
        <Trash2 size={16} />
      </Button>
    </div>,
  ]);

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
          <Plus size={16} className="mr-2" />
          Add User
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
            All Users ({mockUsers.length})
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
