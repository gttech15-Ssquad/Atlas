"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
import { PermissionDeniedModal } from "@/components/modals/PermissionDeniedModal";
import { useCardStore } from "@/store/cardStore";
import { useRBACStore } from "@/store/rbacStore";
import { useApprovalsStore } from "@/store/approvalsStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useCanPerformAction } from "@/hooks/useCanPerformAction";
import { DEPARTMENTS } from "@/lib/constants";
import {
  generateCardNumber,
  generateCVV,
  generateExpiryDate,
} from "@/lib/utils";
import { ArrowLeft, Check, Lock } from "lucide-react";
import Link from "next/link";
import { auditLogger } from "@/lib/auditLogger";

interface FormData {
  nickname: string;
  department: string;
  softLimit: string;
  hardLimit: string;
  internationalTransactions: boolean;
}

interface FormErrors {
  nickname?: string;
  department?: string;
  softLimit?: string;
  hardLimit?: string;
  merchantCategories?: string;
  internationalTransactions?: string;
}

export default function CreateCardPage() {
  const router = useRouter();
  const { addCard } = useCardStore();
  const { currentUser } = useRBACStore();
  const { createApproval } = useApprovalsStore();
  const { addNotification } = useNotificationStore();
  const { canPerformCardAction } = useCanPerformAction();

  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    department: "",
    softLimit: "",
    hardLimit: "",
    internationalTransactions: false,
  });

  const [showMultiSig, setShowMultiSig] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const [showApprovalSent, setShowApprovalSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check permission on mount
  useEffect(() => {
    if (canPerformCardAction("CREATE_CARD") === "denied" && currentUser) {
      setShowPermissionDenied(true);
    }
  }, [canPerformCardAction, currentUser]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = "Card nickname is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.softLimit || isNaN(Number(formData.softLimit))) {
      newErrors.softLimit = "Valid soft limit is required";
    }

    if (!formData.hardLimit || isNaN(Number(formData.hardLimit))) {
      newErrors.hardLimit = "Valid hard limit is required";
    }

    if (
      Number(formData.softLimit) > 0 &&
      Number(formData.hardLimit) > 0 &&
      Number(formData.softLimit) > Number(formData.hardLimit)
    ) {
      newErrors.softLimit = "Soft limit cannot exceed hard limit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const actionType = canPerformCardAction("CREATE_CARD");

      if (actionType === "denied") {
        setShowPermissionDenied(true);
      } else if (actionType === "approval") {
        // Send for approval
        handleSendForApproval();
      } else {
        // APPROVER - proceed to multi-signatory
        setShowMultiSig(true);
      }
    }
  };

  const handleSendForApproval = async () => {
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      // Create approval request
      const approvalId = createApproval({
        type: "CREATE_CARD",
        initiatorEmail: currentUser.email,
        initiatorName: currentUser.name,
        cardDetails: {
          ...formData,
          cardNumber: generateCardNumber(),
          cvv: generateCVV(),
          expiryDate: generateExpiryDate(),
        },
        status: "PENDING",
      });

      auditLogger.logApprovalRequested(
        approvalId,
        "CREATE_CARD",
        formData.nickname
      );

      // Show notification
      addNotification({
        type: "info",
        title: "Approval Sent",
        message:
          "Your card creation request has been sent to Approver for approval",
        duration: 5000,
      });

      setShowApprovalSent(true);

      // Redirect after delay
      setTimeout(() => {
        router.push("/virtual-cards");
      }, 2000);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to send approval request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultiSigApprove = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate new card details
    const generatedCardNumber = generateCardNumber();

    // Create new card with approval
    const newCardId = `card-${Date.now()}`;
    addCard({
      id: newCardId,
      nickname: formData.nickname,
      cardNumber: generatedCardNumber,
      maskedNumber: `${generatedCardNumber.slice(0, 4)} **** **** ****`,
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      department: formData.department,
      softLimit: Number(formData.softLimit),
      hardLimit: Number(formData.hardLimit),
      currentSpend: 0,
      merchantCategories: [],
      internationalTransactions: formData.internationalTransactions,
      status: "active",
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || "Current User",
      approvedBy: { approver: true },
    });

    auditLogger.logCardCreated(
      newCardId,
      formData.nickname,
      formData.department
    );

    addNotification({
      type: "success",
      title: "Card Created",
      message: "Virtual card has been created successfully",
    });

    setShowMultiSig(false);

    // Give localStorage persist middleware time to write before navigating
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/virtual-cards");
  };

  if (canPerformCardAction("CREATE_CARD") === "denied") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/virtual-cards">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Create Virtual Card
            </h1>
          </div>
        </div>

        <div className="max-w-md mx-auto py-12 text-center">
          <Lock size={48} className="mx-auto text-neutral-300 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-600 mb-6">
            You do not have permission to create virtual cards. Only Approvers
            can perform this action.
          </p>
          <Link href="/virtual-cards">
            <Button variant="primary">Back to Cards</Button>
          </Link>
        </div>

        <PermissionDeniedModal
          isOpen={showPermissionDenied}
          onClose={() => setShowPermissionDenied(false)}
          message="Only users with APPROVER role can create virtual cards. Administrators can submit requests for approval."
          requiredRole="APPROVER"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/virtual-cards">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Create Virtual Card
          </h1>
          <p className="text-neutral-600 mt-1">
            Create a new corporate virtual card with spending limits and
            controls
          </p>
        </div>
      </div>

      {/* Alert */}
      {currentUser?.role === "ADMINISTRATOR" && (
        <Alert
          type="info"
          title="Approval Required"
          message="Your card creation will be sent to an Approver for approval after you submit the form"
        />
      )}

      {currentUser?.role === "APPROVER" && (
        <Alert
          type="info"
          title="Immediate Card Creation"
          message="As an Approver, you can create cards immediately after OTP verification"
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-900">
                Card Configuration
              </h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Card Nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="e.g., Marketing Team Card"
                      error={errors.nickname}
                    />

                    <Select
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      options={[
                        { value: "", label: "Select Department" },
                        ...DEPARTMENTS.map((dept) => ({
                          value: dept,
                          label: dept,
                        })),
                      ]}
                      error={errors.department}
                      placeholder="Select Department"
                    />
                  </div>
                </div>

                {/* Spending Limits */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Spending Limits
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Soft Limit (₦)"
                      name="softLimit"
                      type="number"
                      value={formData.softLimit}
                      onChange={handleInputChange}
                      placeholder="e.g., 400000"
                      error={errors.softLimit}
                    />
                    <Input
                      label="Hard Limit (₦)"
                      name="hardLimit"
                      type="number"
                      value={formData.hardLimit}
                      onChange={handleInputChange}
                      placeholder="e.g., 500000"
                      error={errors.hardLimit}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Soft limit generates warnings, hard limit blocks
                    transactions
                  </p>
                </div>

                {/* Merchant Categories */}
                {/* Removed - no longer needed */}

                {/* International Transactions */}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Additional Controls
                  </h3>
                  <label className="flex items-center gap-3 p-3 rounded border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition">
                    <input
                      type="checkbox"
                      name="internationalTransactions"
                      checked={formData.internationalTransactions}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Allow International Transactions
                      </p>
                      <p className="text-xs text-neutral-600">
                        Enable transactions in foreign currencies
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-neutral-200">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Check size={16} className="mr-2" />
                    {currentUser?.role === "APPROVER"
                      ? "Proceed to Multi-Signatory Approval"
                      : "Send for Approval"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Multi-Signatory Modal */}
      <MultiSignatoryModal
        isOpen={showMultiSig}
        onClose={() => setShowMultiSig(false)}
        onApprove={handleMultiSigApprove}
        cardNickname={formData.nickname}
        action={`Create New Virtual Card - ${formData.department || "Corporate"}`}
      />

      {/* Approval Sent Modal */}
      {showApprovalSent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardBody className="text-center py-12">
              <Check size={48} className="mx-auto text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Request Sent for Approval
              </h2>
              <p className="text-neutral-600 mb-2">
                Your card creation request has been submitted to an Approver
              </p>
              <p className="text-sm text-neutral-500">
                You will receive a notification once the request is approved or
                rejected
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Permission Denied Modal */}
      <PermissionDeniedModal
        isOpen={showPermissionDenied}
        onClose={() => {
          setShowPermissionDenied(false);
          router.push("/virtual-cards");
        }}
        message="You do not have permission to create virtual cards. Contact your Administrator or Approver."
        requiredRole="APPROVER"
      />
    </div>
  );
}
