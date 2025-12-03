"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    cardCreated: true,
    cardApproved: true,
    transactionAlert: true,
    approvalRequired: true,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Notification Settings
        </h1>
        <p className="text-neutral-600 mt-1">
          Manage how you receive notifications and alerts
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Notification Channels
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => toggleSetting("emailNotifications")}
              className="rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">
                Email Notifications
              </p>
              <p className="text-xs text-neutral-600">
                Receive alerts via email
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={() => toggleSetting("smsNotifications")}
              className="rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">SMS Notifications</p>
              <p className="text-xs text-neutral-600">
                Receive alerts via text message
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => toggleSetting("pushNotifications")}
              className="rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Push Notifications</p>
              <p className="text-xs text-neutral-600">
                Receive browser notifications
              </p>
            </div>
          </label>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Alert Types
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={settings.cardCreated}
              onChange={() => toggleSetting("cardCreated")}
              className="rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Card Created</p>
              <p className="text-xs text-neutral-600">
                Notify when a new card is created
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={settings.cardApproved}
              onChange={() => toggleSetting("cardApproved")}
              className="rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Card Approved</p>
              <p className="text-xs text-neutral-600">
                Notify when a card is approved
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={settings.transactionAlert}
              onChange={() => toggleSetting("transactionAlert")}
              className="rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Transaction Alerts</p>
              <p className="text-xs text-neutral-600">
                Notify on major transactions
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={settings.approvalRequired}
              onChange={() => toggleSetting("approvalRequired")}
              className="rounded"
            />
            <div>
              <p className="font-medium text-neutral-900">Approval Required</p>
              <p className="text-xs text-neutral-600">
                Notify when approval is needed
              </p>
            </div>
          </label>
        </CardBody>
      </Card>

      <Button variant="primary" className="w-full md:w-auto">
        Save Settings
      </Button>
    </div>
  );
}
