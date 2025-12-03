"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { CardPreview } from "@/components/cards/CardPreview";
import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
import { useCardStore } from "@/store/cardStore";
import { DEPARTMENTS, MERCHANT_CATEGORIES } from "@/lib/constants";
import {
  generateCardNumber,
  generateCVV,
  generateExpiryDate,
} from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

interface FormData {
  nickname: string;
  department: string;
  softLimit: string;
  hardLimit: string;
  merchantCategories: string[];
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
  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    department: "",
    softLimit: "",
    hardLimit: "",
    merchantCategories: [],
    internationalTransactions: false,
  });

  const [cardPreview, setCardPreview] = useState({
    cardNumber: generateCardNumber(),
    cvv: generateCVV(),
    expiryDate: generateExpiryDate(),
  });

  const [showMultiSig, setShowMultiSig] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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

    if (formData.merchantCategories.length === 0) {
      newErrors.merchantCategories =
        "At least one merchant category must be selected";
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

  const handleMerchantToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      merchantCategories: prev.merchantCategories.includes(category)
        ? prev.merchantCategories.filter((m) => m !== category)
        : [...prev.merchantCategories, category],
    }));
  };

  const handleRegenerateCard = () => {
    setCardPreview({
      cardNumber: generateCardNumber(),
      cvv: generateCVV(),
      expiryDate: generateExpiryDate(),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowMultiSig(true);
    }
  };

  const handleMultiSigApprove = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create new card with approval
    addCard({
      id: `card-${Date.now()}`,
      nickname: formData.nickname,
      cardNumber: cardPreview.cardNumber,
      maskedNumber: `${cardPreview.cardNumber.slice(0, 4)}-****-****-${cardPreview.cardNumber.slice(-4)}`,
      expiryDate: cardPreview.expiryDate,
      cvv: cardPreview.cvv,
      department: formData.department,
      softLimit: Number(formData.softLimit),
      hardLimit: Number(formData.hardLimit),
      currentSpend: 0,
      merchantCategories: formData.merchantCategories,
      internationalTransactions: formData.internationalTransactions,
      status: "active",
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
      approvedBy: { ceo: true, cfo: true },
    });

    setShowMultiSig(false);
    router.push("/virtual-cards");
  };

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
      <Alert
        type="info"
        title="Multi-Signatory Required"
        message="Card creation requires CEO and CFO approval with OTP verification"
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
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
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Allowed Merchant Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {MERCHANT_CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 p-2 rounded border border-neutral-200 hover:border-orange-500 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={formData.merchantCategories.includes(
                            category
                          )}
                          onChange={() => handleMerchantToggle(category)}
                          className="rounded"
                        />
                        <span className="text-sm text-neutral-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.merchantCategories && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.merchantCategories}
                    </p>
                  )}
                </div>

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
                  <Button type="submit" variant="primary" className="w-full">
                    <Check size={16} className="mr-2" />
                    Proceed to Multi-Signatory Approval
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Card Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-900">
                Card Preview
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <CardPreview
                cardNumber={cardPreview.cardNumber}
                expiryDate={cardPreview.expiryDate}
                cvv={cardPreview.cvv}
                cardholderName="CORPORATE CARD"
                department={formData.department || "CORPORATE"}
                showCVV={showCVV}
                onShowCVV={setShowCVV}
              />

              <Button
                variant="outline"
                className="w-full"
                onClick={handleRegenerateCard}
              >
                Regenerate Card Details
              </Button>
            </CardBody>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-900">
                Summary
              </h3>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Nickname:</span>
                <span className="font-medium text-neutral-900">
                  {formData.nickname || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Department:</span>
                <span className="font-medium text-neutral-900">
                  {formData.department || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Soft Limit:</span>
                <span className="font-medium text-neutral-900">
                  {formData.softLimit
                    ? `₦${Number(formData.softLimit).toLocaleString()}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Hard Limit:</span>
                <span className="font-medium text-neutral-900">
                  {formData.hardLimit
                    ? `₦${Number(formData.hardLimit).toLocaleString()}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Int'l Transactions:</span>
                <span className="font-medium text-neutral-900">
                  {formData.internationalTransactions
                    ? "✓ Allowed"
                    : "✗ Blocked"}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <span className="text-neutral-600">Categories:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.merchantCategories.length > 0 ? (
                    formData.merchantCategories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-500 text-xs">
                      None selected
                    </span>
                  )}
                </div>
              </div>
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
        action="CREATE_CARD"
      />
    </div>
  );
}
