"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { Lock, Trash2, AlertCircle } from "lucide-react";
import { useRBACStore } from "@/store/rbacStore";
import { auditLogger } from "@/lib/auditLogger";

const mockUsers = [
  {
    id: "1",
    name: "Aliko Dangote",
    email: "aliko.dangote@dangotecement.com",
    role: "APPROVER",
    department: "Executive",
    status: "active",
  },
  {
    id: "2",
    name: "Zainab Hassan",
    email: "zainab.hassan@dangotecement.com",
    role: "ADMINISTRATOR",
    department: "Operations",
    status: "active",
  },
  {
    id: "3",
    name: "Oluwaseun Adebayo",
    email: "seun.adebayo@dangotecement.com",
    role: "VIEWER",
    department: "Finance",
    status: "active",
  },
  // Additional 20 users
  {
    id: "4",
    name: "Chukwu Obi",
    email: "chukwu.obi@dangotecement.com",
    role: "APPROVER",
    department: "Executive",
    status: "active",
  },
  {
    id: "5",
    name: "Amara Nwosu",
    email: "amara.nwosu@dangotecement.com",
    role: "ADMINISTRATOR",
    department: "Finance",
    status: "active",
  },
  {
    id: "6",
    name: "Chinua Okafor",
    email: "chinua.okafor@dangotecement.com",
    role: "VIEWER",
    department: "Marketing",
    status: "active",
  },
  {
    id: "7",
    name: "Bisola Adeyemi",
    email: "bisola.adeyemi@dangotecement.com",
    role: "VIEWER",
    department: "Sales",
    status: "active",
  },
  {
    id: "8",
    name: "Kayode Ifebayo",
    email: "kayode.ifebayo@dangotecement.com",
    role: "VIEWER",
    department: "IT",
    status: "active",
  },
  {
    id: "9",
    name: "Folake Adekunle",
    email: "folake.adekunle@dangotecement.com",
    role: "VIEWER",
    department: "HR",
    status: "active",
  },
  {
    id: "10",
    name: "Tunde Olawale",
    email: "tunde.olawale@dangotecement.com",
    role: "VIEWER",
    department: "Legal",
    status: "active",
  },
  {
    id: "11",
    name: "Chioma Ejiofor",
    email: "chioma.ejiofor@dangotecement.com",
    role: "VIEWER",
    department: "Compliance",
    status: "active",
  },
  {
    id: "12",
    name: "Adekunle Oladele",
    email: "adekunle.oladele@dangotecement.com",
    role: "VIEWER",
    department: "Operations",
    status: "active",
  },
  {
    id: "13",
    name: "Fatima Ibrahim",
    email: "fatima.ibrahim@dangotecement.com",
    role: "ADMINISTRATOR",
    department: "Audit",
    status: "active",
  },
  {
    id: "14",
    name: "Emeka Ndubuisi",
    email: "emeka.ndubuisi@dangotecement.com",
    role: "VIEWER",
    department: "Treasury",
    status: "active",
  },
  {
    id: "15",
    name: "Ngozi Mba",
    email: "ngozi.mba@dangotecement.com",
    role: "VIEWER",
    department: "Risk Management",
    status: "active",
  },
  {
    id: "16",
    name: "Adebayo Okunlade",
    email: "adebayo.okunlade@dangotecement.com",
    role: "VIEWER",
    department: "Procurement",
    status: "active",
  },
  {
    id: "17",
    name: "Ifeoma Obi",
    email: "ifeoma.obi@dangotecement.com",
    role: "ADMINISTRATOR",
    department: "Corporate Affairs",
    status: "active",
  },
  {
    id: "18",
    name: "Kunle Azeez",
    email: "kunle.azeez@dangotecement.com",
    role: "VIEWER",
    department: "Supply Chain",
    status: "active",
  },
  {
    id: "19",
    name: "Blessing Okafor",
    email: "blessing.okafor@dangotecement.com",
    role: "VIEWER",
    department: "Strategy",
    status: "active",
  },
  {
    id: "20",
    name: "Segun Abubakar",
    email: "segun.abubakar@dangotecement.com",
    role: "VIEWER",
    department: "Quality Assurance",
    status: "active",
  },
  {
    id: "21",
    name: "Motunrayo Adeleke",
    email: "motunrayo.adeleke@dangotecement.com",
    role: "VIEWER",
    department: "Information Security",
    status: "active",
  },
  {
    id: "22",
    name: "Chidi Eze",
    email: "chidi.eze@dangotecement.com",
    role: "VIEWER",
    department: "Business Development",
    status: "active",
  },
  {
    id: "23",
    name: "Ada Ejiro",
    email: "ada.ejiro@dangotecement.com",
    role: "VIEWER",
    department: "Technology",
    status: "active",
  },
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
}

export default function UsersPage() {
  const { currentUser } = useRBACStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    userId: string;
    userName: string;
  } | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers as User[]);
  const [mounted, setMounted] = useState(false);

  // Load users from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const stored = localStorage.getItem("orgfrontend_users");
    if (stored) {
      setUsers(JSON.parse(stored));
    }
    setMounted(true);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("orgfrontend_users", JSON.stringify(users));
    }
  }, [users, mounted]);

  const isApprover = currentUser?.role === "APPROVER";
  const isAdmin = currentUser?.role === "ADMINISTRATOR";
  const isViewer = currentUser?.role === "VIEWER";
  const canManageUsers = isApprover || isAdmin;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const handleDisableUser = (
    userId: string,
    userName: string,
    currentStatus: string
  ) => {
    if (!canManageUsers) {
      setShowPermissionDenied(true);
      return;
    }
    if (currentUser?.id === userId) {
      alert("You cannot disable your own account");
      return;
    }
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    auditLogger.logAction(
      newStatus === "active" ? "User Reactivated" : "User Disabled",
      "User",
      userId,
      "success",
      { userName }
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (!canManageUsers) {
      setShowPermissionDenied(true);
      return;
    }
    if (currentUser?.id === userId) {
      alert("You cannot delete your own account");
      return;
    }
    setDeleteConfirm({ userId, userName });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== deleteConfirm.userId)
    );
    auditLogger.logAction(
      "User Deleted",
      "User",
      deleteConfirm.userId,
      "success",
      {
        userName: deleteConfirm.userName,
      }
    );
    setDeleteConfirm(null);
  };

  const rows = filteredUsers.map((user) => [
    <span key="name" className="text-sm font-medium text-neutral-900">
      {user.name}
    </span>,
    <span key="email" className="text-sm text-neutral-600">
      {user.email}
    </span>,
    <Badge
      key="role"
      variant={
        user.role === "APPROVER"
          ? "info"
          : user.role === "ADMINISTRATOR"
            ? "warning"
            : "secondary"
      }
    >
      {user.role}
    </Badge>,
    <span key="dept" className="text-sm text-neutral-600">
      {user.department}
    </span>,
    <span
      key="status"
      className={`text-xs px-2 py-1 rounded-full ${
        user.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {user.status === "active" ? "Active" : "Inactive"}
    </span>,
    <div key="actions" className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDisableUser(user.id, user.name, user.status)}
        disabled={isViewer || currentUser?.id === user.id}
        title={
          isViewer
            ? "Viewers cannot disable users"
            : currentUser?.id === user.id
              ? "You cannot disable your own account"
              : user.status === "active"
                ? "Disable user"
                : "Reactivate user"
        }
      >
        <Lock size={16} />
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleDeleteUser(user.id, user.name)}
        disabled={isViewer || currentUser?.id === user.id}
        title={
          isViewer
            ? "Viewers cannot delete users"
            : currentUser?.id === user.id
              ? "You cannot delete your own account"
              : "Delete user"
        }
      >
        <Trash2 size={16} />
      </Button>
    </div>,
  ]);

  return (
    <div className="space-y-6">
      {isViewer && (
        <Alert
          type="info"
          title="Read-Only Access"
          message="As a viewer, you can only view user information. You cannot manage, disable, or delete users."
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Users</h1>
          <p className="text-neutral-600 mt-1">
            {isViewer
              ? "View user accounts and permissions"
              : "Manage user accounts and permissions"}
          </p>
        </div>
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
            All Users ({filteredUsers.length})
          </h2>
        </CardHeader>
        <CardBody>
          {mounted ? (
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
          ) : (
            <div className="text-center py-8 text-neutral-500">Loading...</div>
          )}
        </CardBody>
      </Card>

      {showPermissionDenied && (
        <Card className="border-red-200 bg-red-50">
          <CardBody className="flex items-start gap-3">
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <p className="font-semibold text-red-900">Permission Denied</p>
              <p className="text-sm text-red-700 mt-1">
                You do not have permission to manage users. Only Approvers and
                Administrators can disable or delete users.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {deleteConfirm && mounted && (
        <Modal
          isOpen={true}
          title="Confirm Deletion"
          onClose={() => setDeleteConfirm(null)}
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Are you sure you want to permanently delete{" "}
              <strong>{deleteConfirm.userName}</strong>? This action cannot be
              undone.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Deleting this user will permanently
                remove their account from the system.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete User
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
