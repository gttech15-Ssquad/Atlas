"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Lock } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/authStore";

export default function ProfileSettingsPage() {
  const auth = useAuthStore();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    role: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiClient.getProfile();
        const data = res.data;
        setProfile({
          firstName: data?.firstName || auth.user?.name?.split(" ")[0] || "",
          lastName: data?.lastName || auth.user?.name?.split(" ")[1] || "",
          email: data?.email || auth.user?.email || "",
          phone: data?.phone || "",
          department: data?.department || "",
          role: data?.role || auth.user?.role || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        if (auth.user) {
          setProfile({
            firstName: auth.user.name?.split(" ")[0] || "",
            lastName: auth.user.name?.split(" ")[1] || "",
            email: auth.user.email || "",
            phone: "",
            department: "",
            role: auth.user.role || "",
          });
        }
      }
    };
    loadProfile();
  }, [auth.user]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    try {
      await apiClient.changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      setMessage({ type: "success", text: "Password changed successfully" });
      setShowPasswordForm(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Profile Settings
        </h1>
        <p className="text-neutral-600 mt-1">
          Manage your account profile and personal information
        </p>
      </div>

      {message && (
        <Alert
          type={message.type === "success" ? "success" : "error"}
          title={message.type === "success" ? "Success" : "Error"}
          message={message.text}
        />
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Personal Information
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={profile.firstName}
              disabled
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              disabled
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              disabled
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <Input
              label="Phone"
              value={profile.phone}
              disabled
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Department
              </label>
              <div className="px-4 py-2 bg-neutral-50 rounded-lg text-neutral-600">
                {profile.department || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Role
              </label>
              <div className="px-4 py-2 bg-neutral-50 rounded-lg text-neutral-600">
                {profile.role || "-"}
              </div>
            </div>
          </div>
          <p className="text-sm text-neutral-600">
            Profile information is read-only and managed by your administrator.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Security</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {!showPasswordForm ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPasswordForm(true)}
            >
              <Lock size={16} className="mr-2" />
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Old Password"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
                required
              />
              <Input
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Change Password
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
