"use client";

import React, { useState } from "react";
import { X, Check, XCircle, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { OTPVerificationModal } from "./OTPVerificationModal";
import { useApprovalsStore } from "@/store/approvalsStore";
import { useRBACStore } from "@/store/rbacStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useCardStore } from "@/store/cardStore";
import { otpManager } from "@/lib/otpManager";
import { rbacUtils } from "@/lib/rbacUtils";

interface PendingApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PendingApprovalsModal: React.FC<PendingApprovalsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { getPendingApprovals, approveApproval, rejectApproval } =
    useApprovalsStore();
  const { currentUser } = useRBACStore();
  const { addNotification } = useNotificationStore();
  const { addCard } = useCardStore();

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(
    null
  );
  const [confirmReject, setConfirmReject] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingApprovals = getPendingApprovals();
  const selectedApproval = selectedApprovalId
    ? getPendingApprovals().find((a) => a.id === selectedApprovalId)
    : null;

  const handleApproveClick = (approvalId: string) => {
    setSelectedApprovalId(approvalId);
    otpManager.generateOTP();
    setShowOTPModal(true);
  };

  const handleOTPVerify = async (otp: string): Promise<boolean> => {
    const validation = otpManager.validateOTP(otp);

    if (!validation.valid) {
      return false;
    }

    if (!selectedApproval || !currentUser) return false;

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Execute the action based on type
      if (selectedApproval.type === "CREATE_CARD") {
        const cardDetails = selectedApproval.cardDetails;
        addCard({
          id: `card-${Date.now()}`,
          nickname: cardDetails.nickname,
          cardNumber: cardDetails.cardNumber,
          maskedNumber: `${cardDetails.cardNumber.slice(0, 4)} **** **** ****`,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
          department: cardDetails.department,
          softLimit: Number(cardDetails.softLimit),
          hardLimit: Number(cardDetails.hardLimit),
          currentSpend: 0,
          merchantCategories: cardDetails.merchantCategories || [],
          internationalTransactions:
            cardDetails.internationalTransactions || false,
          status: "active",
          createdAt: new Date().toISOString(),
          createdBy: selectedApproval.initiatorName,
          approvedBy: { approver: true },
        });
      } else if (selectedApproval.type === "FREEZE_CARD") {
        const cardDetails = selectedApproval.cardDetails;
        if (cardDetails.action === "freeze") {
          const { freezeCard } = useCardStore.getState();
          freezeCard(cardDetails.cardId);
        } else if (cardDetails.action === "unfreeze") {
          const { unfreezeCard } = useCardStore.getState();
          unfreezeCard(cardDetails.cardId);
        }
      } else if (selectedApproval.type === "DELETE_CARD") {
        const cardDetails = selectedApproval.cardDetails;
        const { deleteCard } = useCardStore.getState();
        deleteCard(cardDetails.cardId);
      }
      // Add other action types as needed (SET_LIMIT)

      // Mark approval as approved
      approveApproval(selectedApproval.id, currentUser.email, currentUser.name);

      // Send notifications
      addNotification({
        type: "success",
        title: "Action Approved",
        message: `${rbacUtils.getActionName(selectedApproval.type as any)} approved successfully`,
      });

      addNotification({
        type: "success",
        title: `${selectedApproval.initiatorName}'s Request Approved`,
        message: `${selectedApproval.initiatorName}'s ${rbacUtils.getActionName(selectedApproval.type as any)} has been approved`,
        duration: 7000,
      });

      setSelectedApprovalId(null);
      return true;
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to process approval",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (approvalId: string) => {
    if (!currentUser) return;

    const approval = pendingApprovals.find((a) => a.id === approvalId);
    if (!approval) return;

    rejectApproval(approvalId, currentUser.email, currentUser.name);

    addNotification({
      type: "info",
      title: "Action Rejected",
      message: `${rbacUtils.getActionName(approval.type as any)} request has been rejected`,
    });

    setConfirmReject(null);
  };

  const getActionBadgeColor = (type: string) => {
    switch (type) {
      case "CREATE_CARD":
        return "bg-blue-100 text-blue-800";
      case "FREEZE_CARD":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE_CARD":
        return "bg-red-100 text-red-800";
      case "SET_LIMIT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Pending Approvals
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {pendingApprovals.length} action(s) awaiting approval
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-neutral-400 hover:text-neutral-600 transition disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-500">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <Card key={approval.id}>
                    <CardBody className="space-y-4">
                      {/* Action Type & Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={getActionBadgeColor(approval.type)}
                          >
                            {rbacUtils.getActionName(approval.type as any)}
                          </Badge>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {approval.cardDetails?.nickname || "Card Action"}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {approval.cardDetails?.department || "N/A"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800"
                        >
                          Pending
                        </Badge>
                      </div>

                      {/* Initiator & Timestamp */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500">Initiator</p>
                          <div className="flex items-center gap-2 mt-1">
                            <User size={16} className="text-neutral-400" />
                            <div>
                              <p className="font-medium text-neutral-900">
                                {approval.initiatorName}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {approval.initiatorEmail}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-neutral-500">Requested</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={16} className="text-neutral-400" />
                            <p className="text-neutral-900">
                              {formatDate(approval.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Details (if applicable) */}
                      {approval.cardDetails && (
                        <div className="bg-neutral-50 rounded p-3 space-y-2 text-sm">
                          {approval.cardDetails.softLimit && (
                            <div className="flex justify-between">
                              <span className="text-neutral-600">
                                Soft Limit:
                              </span>
                              <span className="font-medium">
                                ₦
                                {approval.cardDetails.softLimit.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {approval.cardDetails.hardLimit && (
                            <div className="flex justify-between">
                              <span className="text-neutral-600">
                                Hard Limit:
                              </span>
                              <span className="font-medium">
                                ₦
                                {approval.cardDetails.hardLimit.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {approval.cardDetails.merchantCategories?.length >
                            0 && (
                            <div>
                              <p className="text-neutral-600 mb-1">
                                Merchant Categories:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {approval.cardDetails.merchantCategories.map(
                                  (cat: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {cat}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {confirmReject === approval.id ? (
                        <div className="bg-red-50 rounded p-3 space-y-2">
                          <p className="text-sm text-red-800">
                            Are you sure you want to reject this action?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmReject(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(approval.id)}
                              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Confirm Reject
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => setConfirmReject(approval.id)}
                            disabled={isProcessing}
                          >
                            <XCircle size={16} className="mr-1" />
                            Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleApproveClick(approval.id)}
                            disabled={isProcessing}
                          >
                            <Check size={16} className="mr-1" />
                            Approve with OTP
                          </Button>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 flex-shrink-0">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        title="Verify to Approve"
        description="Enter the 6-digit OTP to approve this action"
      />
    </>
  );
};
