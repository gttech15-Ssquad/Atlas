"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, Mail, Building, Calendar } from "lucide-react";

export default function UserDetailPage() {
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@gtbank.com",
    role: "CEO",
    department: "Finance",
    status: "active",
    createdAt: "2024-01-15",
    cardLimit: 10,
    permissions: [
      "Approve Cards",
      "Create Users",
      "View Reports",
      "Manage Settings",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900">{user.name}</h1>
          <p className="text-neutral-600 mt-1">User ID: {user.id}</p>
        </div>
        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                User Information
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-neutral-50">
                  <p className="text-sm text-neutral-600 mb-2 flex items-center gap-2">
                    <Mail size={14} />
                    Email
                  </p>
                  <p className="font-medium text-neutral-900">{user.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50">
                  <p className="text-sm text-neutral-600 mb-2">Role</p>
                  <p className="font-medium text-neutral-900">{user.role}</p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50">
                  <p className="text-sm text-neutral-600 mb-2 flex items-center gap-2">
                    <Building size={14} />
                    Department
                  </p>
                  <p className="font-medium text-neutral-900">
                    {user.department}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50">
                  <p className="text-sm text-neutral-600 mb-2">Card Limit</p>
                  <p className="font-medium text-neutral-900">
                    {user.cardLimit} cards
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 col-span-2">
                  <p className="text-sm text-neutral-600 mb-2 flex items-center gap-2">
                    <Calendar size={14} />
                    Member Since
                  </p>
                  <p className="font-medium text-neutral-900">
                    {user.createdAt}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Permissions
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                {user.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span className="text-sm text-neutral-900">
                      {permission}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900">Quick Actions</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <Button variant="secondary" className="w-full">
                <Lock size={16} className="mr-2" />
                Deactivate User
              </Button>
              <Button variant="secondary" className="w-full">
                Send Reset Email
              </Button>
              <Button variant="secondary" className="w-full">
                Remove User
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900">Statistics</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Active Cards</p>
                <p className="text-2xl font-bold text-neutral-900">3</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Approvals Made</p>
                <p className="text-2xl font-bold text-neutral-900">24</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Last Activity</p>
                <p className="text-sm font-medium text-neutral-900">
                  2 hours ago
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
