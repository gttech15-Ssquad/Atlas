"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";

export default function PhysicalCardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Physical Cards</h1>
        <p className="text-neutral-600 mt-1">Manage physical debit cards</p>
      </div>

      <Alert
        type="warning"
        title="Feature Not Available"
        message="Physical card management is not currently supported in this version of the application. This feature is under development and will be available in a future release."
      />

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">
            <AlertCircle className="inline mr-2" size={20} />
            Coming Soon
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-600">
            Physical card features including issuance, activation, and
            management will be available in an upcoming version.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
