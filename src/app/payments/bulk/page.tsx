"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface BulkPayment {
  id: string;
  recipientName: string;
  accountNumber: string;
  bankCode: string;
  amount: number;
  narration: string;
  status: "pending" | "approved" | "completed";
}

export default function BulkPaymentsPage() {
  const [step, setStep] = useState<"upload" | "review" | "submitted">("upload");
  const [payments, setPayments] = useState<BulkPayment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    recipientName: "",
    accountNumber: "",
    bankCode: "058",
    amount: 0,
    narration: "",
  });
  const [loading] = useState(false);

  const mockBanks = [
    { code: "011", name: "First Bank" },
    { code: "044", name: "Access Bank" },
    { code: "058", name: "Guaranty Trust Bank" },
    { code: "063", name: "Zenith Bank" },
  ];

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayment = () => {
    if (
      !newPayment.recipientName ||
      !newPayment.accountNumber ||
      newPayment.amount <= 0
    ) {
      alert("Please fill all fields");
      return;
    }

    const payment: BulkPayment = {
      id: `pay-${Date.now()}`,
      recipientName: newPayment.recipientName,
      accountNumber: newPayment.accountNumber,
      bankCode: newPayment.bankCode,
      amount: newPayment.amount,
      narration: newPayment.narration,
      status: "pending",
    };

    setPayments([...payments, payment]);
    setNewPayment({
      recipientName: "",
      accountNumber: "",
      bankCode: "058",
      amount: 0,
      narration: "",
    });
    setShowModal(false);
  };

  const handleRemovePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  const handleSubmit = async () => {
    // Bulk payments are not yet supported by the backend in this integration.
    // Disable submission to avoid broken flows.
    alert(
      "Bulk payment submission is disabled — backend integration not available."
    );
    return;
  };

  const getBankName = (code: string) => {
    return mockBanks.find((b) => b.code === code)?.name || code;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/payments">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Bulk Payments</h1>
          <p className="text-neutral-600 mt-1">
            Process multiple payments at once
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["upload", "review", "submitted"].map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === s
                  ? "bg-blue-600 text-white"
                  : ["upload", "review", "submitted"].indexOf(step) > i
                    ? "bg-green-600 text-white"
                    : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div
                className={`flex-1 h-1 ${
                  ["upload", "review", "submitted"].indexOf(step) > i
                    ? "bg-green-600"
                    : "bg-neutral-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Add Payments
              </h2>
            </CardHeader>
            <CardBody>
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Add Payment
              </Button>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Step 2: Review */}
      {step === "review" && (
        <div className="max-w-4xl space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-neutral-600 text-sm mb-2">Total Payments</p>
              <p className="text-2xl font-bold text-neutral-900">
                {payments.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-neutral-600 text-sm mb-2">Total Amount</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₦{totalAmount.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-neutral-600 text-sm mb-2">Processing Fee</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₦{Math.round(totalAmount * 0.001).toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Payment Details
                </h2>
                <div className="text-sm text-neutral-600">
                  Bulk payments submission is disabled — backend integration not
                  available.
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">
                        {payment.recipientName}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {payment.accountNumber} •{" "}
                        {getBankName(payment.bankCode)}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-neutral-900">
                        ₦{payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {payment.narration}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemovePayment(payment.id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setStep("upload")}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading}
            >
              Submit for Processing
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Submitted */}
      {step === "submitted" && (
        <div className="max-w-2xl">
          <Card>
            <CardBody className="text-center py-12">
              <div className="inline-block w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Submitted Successfully
              </h2>
              <p className="text-neutral-600 mb-6">
                Your bulk payment batch has been submitted and is being
                processed.
              </p>

              <Link href="/payments">
                <Button variant="secondary" className="w-full">
                  Back to Payments
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Add Payment
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Recipient Name"
                placeholder="John Doe"
                value={newPayment.recipientName}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    recipientName: e.target.value,
                  })
                }
              />
              <Input
                label="Account Number"
                placeholder="2050123456789"
                value={newPayment.accountNumber}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    accountNumber: e.target.value,
                  })
                }
              />
              <Select
                label="Bank"
                value={newPayment.bankCode}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, bankCode: e.target.value })
                }
                options={mockBanks.map((bank) => ({
                  value: bank.code,
                  label: bank.name,
                }))}
              />
              <Input
                label="Amount (₦)"
                type="number"
                placeholder="500000"
                value={newPayment.amount || ""}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <Input
                label="Narration"
                placeholder="Payment details"
                value={newPayment.narration}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, narration: e.target.value })
                }
              />
              <div className="flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddPayment}
                  className="flex-1"
                >
                  Add
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
