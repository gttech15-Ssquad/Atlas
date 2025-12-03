"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Save } from "lucide-react";

export default function EditCardPage() {
  const [settings, setSettings] = useState({
    cardName: "Marketing Department",
    hardLimit: 500000,
    softLimit: 400000,
    dailyLimit: 50000,
    international: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/virtual-cards">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Edit Card</h1>
          <p className="text-neutral-600 mt-1">
            Modify card settings and limits
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            Card Details
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Card Name"
            value={settings.cardName}
            onChange={(e) =>
              setSettings({ ...settings, cardName: e.target.value })
            }
          />
          <Input
            label="Hard Limit (₦)"
            type="number"
            value={settings.hardLimit}
            onChange={(e) =>
              setSettings({
                ...settings,
                hardLimit: parseInt(e.target.value) || 0,
              })
            }
          />
          <Input
            label="Soft Limit (₦)"
            type="number"
            value={settings.softLimit}
            onChange={(e) =>
              setSettings({
                ...settings,
                softLimit: parseInt(e.target.value) || 0,
              })
            }
          />
          <Input
            label="Daily Limit (₦)"
            type="number"
            value={settings.dailyLimit}
            onChange={(e) =>
              setSettings({
                ...settings,
                dailyLimit: parseInt(e.target.value) || 0,
              })
            }
          />
          <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.international}
              onChange={(e) =>
                setSettings({ ...settings, international: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-neutral-900 font-medium">
              Allow International Transactions
            </span>
          </label>
        </CardBody>
      </Card>

      <div className="flex gap-2">
        <Link href="/virtual-cards" className="flex-1">
          <Button variant="secondary" className="w-full">
            Cancel
          </Button>
        </Link>
        <Button variant="primary" className="flex-1 gap-2">
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
