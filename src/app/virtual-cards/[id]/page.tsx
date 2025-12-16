"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { CardPreview } from "@/components/cards/CardPreview";
import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
import { useCardStore } from "@/store/cardStore";
import { CARD_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { Lock, Trash2, Edit3, ArrowLeft } from "lucide-react";
import { mockAuditData } from "@/lib/mock-data";
import Link from "next/link";

export default function CardDetailsPage() {
  const params = useParams();
  const cardId = params.id as string;
  const { cards, selectedCard, selectCard } = useCardStore();
  const [showCVV, setShowCVV] = useState(false);
  const [showMultiSig, setShowMultiSig] = useState(false);
  const [multiSigAction, setMultiSigAction] = useState("");

  React.useEffect(() => {
    selectCard(cardId);
  }, [cardId, selectCard]);

  const card = selectedCard || cards.find((c) => c.id === cardId);

  if (!card) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-neutral-500">Card not found</p>
        <Link href="/virtual-cards">
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Cards
          </Button>
        </Link>
      </div>
    );
  }

  const softLimitPercentage = calculatePercentage(
    card.currentSpend,
    card.softLimit
  );
  const hardLimitPercentage = calculatePercentage(
    card.currentSpend,
    card.hardLimit
  );

  const handleApproveAction = (action: string) => {
    setMultiSigAction(action);
    setShowMultiSig(true);
  };

  const handleMultiSigApprove = async (_ceoOTP: string, _cfoOTP: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowMultiSig(false);
    setMultiSigAction("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/virtual-cards">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              {card.nickname}
            </h1>
            <p className="text-neutral-600 mt-1">
              {card.department} Department
            </p>
          </div>
        </div>
        <Badge variant={card.status === "active" ? "success" : "warning"}>
          {CARD_STATUS_LABELS[card.status]}
        </Badge>
      </div>

      {/* Card Preview and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Preview */}
        <CardPreview
          cardNumber={card.cardNumber}
          expiryDate={card.expiryDate}
          cvv={card.cvv || "000"}
          cardholderName="CORPORATE CARD"
          department={card.department}
          showCVV={showCVV}
          onShowCVV={setShowCVV}
        />

        {/* Card Details */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">
              Card Details
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-neutral-600">
                  Card Number
                </p>
                <p className="font-mono text-sm text-neutral-900 mt-1">
                  {card.maskedNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600">Expiry</p>
                <p className="font-mono text-sm text-neutral-900 mt-1">
                  {card.expiryDate}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600">
                  Department
                </p>
                <p className="text-sm text-neutral-900 mt-1">
                  {card.department}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600">Status</p>
                <Badge
                  variant={card.status === "active" ? "success" : "warning"}
                >
                  {CARD_STATUS_LABELS[card.status]}
                </Badge>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-600">
                  Merchants Allowed
                </span>
                <span className="text-xs text-neutral-500">
                  {card.merchantCategories.length} categories
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {card.merchantCategories.map((merchant) => (
                  <Badge key={merchant} variant="primary">
                    {merchant}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={card.internationalTransactions}
                  readOnly
                  className="rounded"
                />
                <span className="text-sm text-neutral-700">
                  International Transactions{" "}
                  {card.internationalTransactions ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Spending Analysis */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Spending Analysis
          </h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">
                Soft Limit
              </span>
              <span className="text-sm font-semibold text-neutral-900">
                {formatCurrency(card.currentSpend)} /{" "}
                {formatCurrency(card.softLimit)}
              </span>
            </div>
            <Progress
              value={card.currentSpend}
              max={card.softLimit}
              color={softLimitPercentage > 80 ? "warning" : "primary"}
              showLabel
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">
                Hard Limit
              </span>
              <span className="text-sm font-semibold text-neutral-900">
                {formatCurrency(card.currentSpend)} /{" "}
                {formatCurrency(card.hardLimit)}
              </span>
            </div>
            <Progress
              value={card.currentSpend}
              max={card.hardLimit}
              color={hardLimitPercentage > 90 ? "error" : "primary"}
              showLabel
            />
          </div>
        </CardBody>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Activity Log
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {mockAuditData
              .filter((a) => a.cardId === cardId)
              .slice(0, 5)
              .map((log) => (
                <div
                  key={log.id}
                  className="pb-3 border-b border-neutral-200 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {log.details}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => handleApproveAction("CHANGE_LIMITS")}
        >
          <Edit3 size={16} className="mr-2" />
          Change Limits
        </Button>
        <Button
          variant="warning"
          onClick={() => handleApproveAction("FREEZE_CARD")}
        >
          <Lock size={16} className="mr-2" />
          Freeze Card
        </Button>
        <Button
          variant="danger"
          onClick={() => handleApproveAction("DELETE_CARD")}
        >
          <Trash2 size={16} className="mr-2" />
          Delete Card
        </Button>
      </div>

      {/* Multi-Signatory Modal */}
      <MultiSignatoryModal
        isOpen={showMultiSig}
        onClose={() => setShowMultiSig(false)}
        onApprove={handleMultiSigApprove}
        cardNickname={card.nickname}
        action={multiSigAction}
      />
    </div>
  );
}
