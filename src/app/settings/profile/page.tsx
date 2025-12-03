"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock } from "lucide-react";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Chukwu",
    lastName: "Obi",
    email: "chukwu.obi@gtbank.com",
    phone: "+234 (0) 701 234 5678",
    department: "Executive",
    role: "CEO",
  });

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
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <Input
              label="Phone"
              value={profile.phone}
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
                {profile.department}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Role
              </label>
              <div className="px-4 py-2 bg-neutral-50 rounded-lg text-neutral-600">
                {profile.role}
              </div>
            </div>
          </div>
          <Button variant="primary" className="w-full md:w-auto">
            Save Changes
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Security</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Button variant="outline" className="w-full">
            <Lock size={16} className="mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Change Two-Factor Authentication
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
