"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
        <p className="text-neutral-600 mt-1">
          Initiate payments, transfers, and bill payments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Send size={20} className="text-primary" />
              Single Payment
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Make one-off payments to accounts
            </p>
            <Button variant="primary" className="w-full">
              New Payment
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Banknote size={20} className="text-primary" />
              Bulk Payments
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Process batch payments (payroll, suppliers)
            </p>
            <Button variant="primary" className="w-full">
              Upload Batch
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <ArrowRightLeft size={20} className="text-primary" />
              Domestic Transfer
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Transfer between GTBank and other banks
            </p>
            <Button variant="primary" className="w-full">
              New Transfer
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <Globe size={20} className="text-primary" />
              International Transfer
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              SWIFT, SEPA, and other international methods
            </p>
            <Button variant="primary" className="w-full">
              International Transfer
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <FileText size={20} className="text-primary" />
              Bill Payments
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Pay utilities, government duties, and services
            </p>
            <Button variant="primary" className="w-full">
              Pay Bill
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold text-neutral-900">
              <BookOpen size={20} className="text-primary" />
              Cheque Services
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-neutral-600">
              Request cheque books and confirmations
            </p>
            <Button variant="primary" className="w-full">
              Request Cheque Book
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
