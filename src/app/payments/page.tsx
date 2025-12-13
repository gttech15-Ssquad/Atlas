"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  Send,
  Banknote,
  ArrowRightLeft,
  Globe,
  FileText,
  BookOpen,
} from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Payments & Transfers
        </h1>
        <p className="text-neutral-600 mt-1">Initiate payments and transfers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Payment - Enabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Send size={20} className="text-primary" />
              Single Payment
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Make one-off payments from your account
            </p>
            <Button variant="primary" className="w-full" disabled>
              New Payment (Coming Soon)
            </Button>
          </CardBody>
        </Card>

        {/* Bulk Payments - Disabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Banknote size={20} className="text-neutral-400" />
              Bulk Payments
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Process batch payments (payroll, suppliers)
            </p>
            <Button variant="outline" className="w-full" disabled>
              Upload Batch (Not Available)
            </Button>
          </CardBody>
        </Card>

        {/* Domestic Transfer - Disabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <ArrowRightLeft size={20} className="text-neutral-400" />
              Domestic Transfer
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Transfer between GTBank and other banks
            </p>
            <Button variant="outline" className="w-full" disabled>
              New Transfer (Not Available)
            </Button>
          </CardBody>
        </Card>

        {/* International Transfer - Disabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Globe size={20} className="text-neutral-400" />
              International Transfer
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              SWIFT, SEPA, and other international methods
            </p>
            <Button variant="outline" className="w-full" disabled>
              International Transfer (Not Available)
            </Button>
          </CardBody>
        </Card>

        {/* Bill Payments - Disabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <FileText size={20} className="text-neutral-400" />
              Bill Payments
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Pay utilities, government duties, and services
            </p>
            <Button variant="outline" className="w-full" disabled>
              Pay Bill (Not Available)
            </Button>
          </CardBody>
        </Card>

        {/* Cheque Services - Disabled */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <BookOpen size={20} className="text-neutral-400" />
              Cheque Services
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Request cheque books and confirmations
            </p>
            <Button variant="outline" className="w-full" disabled>
              Request Cheque Book (Not Available)
            </Button>
          </CardBody>
        </Card>
      </div>

      <Alert
        type="info"
        title="Limited Payment Features"
        message="Only Single Payments are currently available in this version. Additional payment and transfer types will be enabled as they are integrated with the backend system."
      />
    </div>
  );
}
