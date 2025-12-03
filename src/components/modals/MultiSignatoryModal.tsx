"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSignatoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (ceoOTP: string, cfoOTP: string) => Promise<void>;
  cardNickname?: string;
  action?: string;
  isLoading?: boolean;
}

export const MultiSignatoryModal = ({
  isOpen,
  onClose,
  onApprove,
  cardNickname = "Virtual Card",
  action = "Create Virtual Card",
  isLoading = false,
}: MultiSignatoryModalProps) => {
  const [ceoOTP, setCeoOTP] = useState("");
  const [cfoOTP, setCfoOTP] = useState("");
  const [ceoApproved, setCeoApproved] = useState(false);
  const [cfoApproved, setCfoApproved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!ceoOTP || !cfoOTP) {
      setError("Both OTPs are required");
      return;
    }

    try {
      setError("");
      await onApprove(ceoOTP, cfoOTP);
      setCeoOTP("");
      setCfoOTP("");
      setCeoApproved(false);
      setCfoApproved(false);
    } catch (err: any) {
      setError(err.message || "Approval failed. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Multi-Signatory Authorization"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-info/10 border border-info/30 rounded-lg p-4">
          <p className="text-sm text-info/90">
            This is a high-risk action requiring dual authorization.
          </p>
          <p className="text-xs text-info/70 mt-1">
            Action: <strong>{action}</strong> - {cardNickname}
          </p>
        </div>

        {/* Approval Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900">
            Required Approvals
          </h3>

          {/* CEO Approval */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                    ceoApproved
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning"
                  )}
                >
                  {ceoApproved ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">CEO Approval</p>
                  <p className="text-xs text-neutral-500">Chukwu Obi</p>
                </div>
              </div>
              <Badge variant={ceoApproved ? "success" : "warning"}>
                {ceoApproved ? "Approved" : "Pending"}
              </Badge>
            </div>

            {!ceoApproved && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  CEO OTP
                </label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={ceoOTP}
                  onChange={(e) => {
                    setCeoOTP(e.target.value.slice(0, 6));
                    if (e.target.value.length === 6) {
                      setCeoApproved(true);
                    }
                  }}
                  maxLength={6}
                  className="font-mono text-center text-lg"
                />
              </div>
            )}
          </div>

          {/* CFO Approval */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                    cfoApproved
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning"
                  )}
                >
                  {cfoApproved ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">CFO Approval</p>
                  <p className="text-xs text-neutral-500">Amara Nwosu</p>
                </div>
              </div>
              <Badge variant={cfoApproved ? "success" : "warning"}>
                {cfoApproved ? "Approved" : "Pending"}
              </Badge>
            </div>

            {!cfoApproved && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  CFO OTP
                </label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={cfoOTP}
                  onChange={(e) => {
                    setCfoOTP(e.target.value.slice(0, 6));
                    if (e.target.value.length === 6) {
                      setCfoApproved(true);
                    }
                  }}
                  maxLength={6}
                  className="font-mono text-center text-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            title="Approval Failed"
            message={error}
            onClose={() => setError("")}
          />
        )}

        {/* Info */}
        {ceoApproved && cfoApproved && (
          <Alert
            type="success"
            title="All approvals received"
            message="Ready to proceed with the action."
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!ceoApproved || !cfoApproved || isLoading}
          >
            {isLoading ? "Processing..." : "Complete Approval"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
