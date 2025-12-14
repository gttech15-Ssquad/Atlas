"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Lock, Unlock, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { PermissionDeniedModal } from "@/components/modals/PermissionDeniedModal";
import { useRBACStore, User, UserRole } from "@/store/rbacStore";
import { useCanPerformAction } from "@/hooks/useCanPerformAction";
import { useNotificationStore } from "@/store/notificationStore";
import { rbacUtils } from "@/lib/rbacUtils";
import Link from "next/link";

export default function UsersPage() {
  const {
    allUsers,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useRBACStore();
  const { canManageUsers } = useCanPerformAction();
  const { addNotification } = useNotificationStore();

  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "VIEWER" as UserRole,
  });

  // Check permission on mount
  useEffect(() => {
    if (!canManageUsers()) {
      setShowPermissionDenied(true);
    }
  }, [canManageUsers]);

  const handleAddUser = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Please fill in all fields",
      });
      return;
    }

    if (allUsers.some((u) => u.email === formData.email)) {
      addNotification({
        type: "error",
        title: "Error",
        message: "User with this email already exists",
      });
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      addNotification({
        type: "success",
        title: "Success",
        message: `User ${formData.name} updated successfully`,
      });
      setEditingUser(null);
    } else {
      addUser({
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: "active",
        createdAt: new Date().toISOString(),
      });
      addNotification({
        type: "success",
        title: "Success",
        message: `User ${formData.name} added successfully`,
      });
    }

    setFormData({ name: "", email: "", role: "VIEWER" });
    setShowAddModal(false);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      addNotification({
        type: "error",
        title: "Error",
        message: "You cannot delete your own account",
      });
      return;
    }

    deleteUser(userId);
    addNotification({
      type: "success",
      title: "Success",
      message: `User ${userName} deleted successfully`,
    });
  };

  const handleToggleStatus = (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      addNotification({
        type: "error",
        title: "Error",
        message: "You cannot disable your own account",
      });
      return;
    }

    toggleUserStatus(userId);
    const user = allUsers.find((u) => u.id === userId);
    addNotification({
      type: "success",
      title: "Success",
      message: `User ${userName} is now ${user?.status === "active" ? "disabled" : "enabled"}`,
    });
  };

  if (!canManageUsers()) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              User Management
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto py-12 text-center">
          <Lock size={48} className="mx-auto text-neutral-300 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-600 mb-6">
            User management is not available for your role.
          </p>
          <Link href="/">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>

        <PermissionDeniedModal
          isOpen={showPermissionDenied}
          onClose={() => setShowPermissionDenied(false)}
          message="User management is only available for Approvers and Administrators."
          requiredRole="APPROVER or ADMINISTRATOR"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              User Management
            </h1>
            <p className="text-neutral-600 mt-1">
              Add, edit, and manage user accounts and access levels
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", email: "", role: "VIEWER" });
            setShowAddModal(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., John Doe"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g., john@dangotecement.com"
                disabled={!!editingUser}
              />
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as UserRole,
                  })
                }
                options={[
                  { value: "APPROVER", label: "Approver" },
                  { value: "ADMINISTRATOR", label: "Administrator" },
                  { value: "VIEWER", label: "Viewer" },
                ]}
              />

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
                <p className="font-medium mb-1">Role Permissions:</p>
                <ul className="space-y-1 list-disc list-inside">
                  {formData.role === "APPROVER" && (
                    <>
                      <li>Create/Freeze/Delete cards immediately</li>
                      <li>Approve pending actions</li>
                      <li>Manage all users</li>
                    </>
                  )}
                  {formData.role === "ADMINISTRATOR" && (
                    <>
                      <li>Manage user accounts</li>
                      <li>Card actions require approval</li>
                      <li>Cannot view card details</li>
                    </>
                  )}
                  {formData.role === "VIEWER" && (
                    <>
                      <li>View cards only (read-only)</li>
                      <li>No admin privileges</li>
                      <li>No action capabilities</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddUser}
                  className="flex-1"
                >
                  {editingUser ? "Update User" : "Add User"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            All Users ({allUsers.length})
          </h2>
        </CardHeader>
        <CardBody>
          {allUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                      Last Login
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={cn(
                        "border-b border-neutral-100 hover:bg-neutral-50 transition",
                        currentUser?.id === user.id && "bg-blue-50"
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white",
                              rbacUtils.getRoleBadgeColor(user.role) ===
                                "blue" && "bg-blue-500",
                              rbacUtils.getRoleBadgeColor(user.role) ===
                                "orange" && "bg-orange-500",
                              rbacUtils.getRoleBadgeColor(user.role) ===
                                "gray" && "bg-gray-500",
                              rbacUtils.getRoleBadgeColor(user.role) ===
                                "purple" && "bg-purple-500"
                            )}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {user.name}
                              {currentUser?.id === user.id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            rbacUtils.getRoleBadgeColor(user.role) === "blue"
                              ? "bg-blue-100 text-blue-800"
                              : rbacUtils.getRoleBadgeColor(user.role) ===
                                  "orange"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rbacUtils.getRoleDisplayName(user.role)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {user.status === "active" ? "Active" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 text-xs">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 text-neutral-600 hover:bg-neutral-200 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(user.id, user.name)
                            }
                            className="p-2 text-neutral-600 hover:bg-neutral-200 rounded transition"
                            title={
                              user.status === "active" ? "Disable" : "Enable"
                            }
                          >
                            {user.status === "active" ? (
                              <Unlock size={16} />
                            ) : (
                              <Lock size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                            title="Delete"
                            disabled={currentUser?.id === user.id}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// Helper function
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};
