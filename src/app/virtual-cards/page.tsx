"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { useCardStore } from "@/store/cardStore";
import { useRBACStore } from "@/store/rbacStore";
import { useApprovalsStore } from "@/store/approvalsStore";
import { useNotificationStore } from "@/store/notificationStore";
import { PendingApprovalsModal } from "@/components/modals/PendingApprovalsModal";
import { PermissionDeniedModal } from "@/components/modals/PermissionDeniedModal";
import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
import { CARD_STATUS_LABELS } from "@/lib/constants";
import {
  Plus,
  Lock,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { auditLogger } from "@/lib/auditLogger";

export default function VirtualCardsPage() {
  const cards = useCardStore((state) => state.cards);
  const { freezeCard, unfreezeCard, deleteCard } = useCardStore();
  const { currentUser } = useRBACStore();
  const { createApproval } = useApprovalsStore();
  const { getPendingApprovals } = useApprovalsStore();
  const { addNotification } = useNotificationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [showPendingApprovals, setShowPendingApprovals] = useState(false);
  const [showAdminAlert, setShowAdminAlert] = useState(false);
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const [permissionDeniedAction, setPermissionDeniedAction] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pendingCount = getPendingApprovals().length;
  const isAdmin = currentUser?.role === "ADMINISTRATOR";
  const isApprover = currentUser?.role === "APPROVER";
  const isViewer = currentUser?.role === "VIEWER";

  useEffect(() => {
    if (isAdmin && !showAdminAlert) {
      setShowAdminAlert(true);
    }
  }, [isAdmin, showAdminAlert]);

  const handleViewCard = (cardId: string) => {
    if (isViewer) {
      setPermissionDeniedAction("View Card Details");
      setShowPermissionDenied(true);
      return;
    }
    if (isAdmin) {
      setPermissionDeniedAction("View Card Details");
      setShowPermissionDenied(true);
      return;
    }
    // APPROVER can view
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      auditLogger.logCardViewed(cardId, card.nickname);
    }
    window.location.href = `/virtual-cards/${cardId}`;
  };

  const handleFreezeCard = (card: any) => {
    if (isViewer) {
      setPermissionDeniedAction("Freeze Card");
      setShowPermissionDenied(true);
      return;
    }
    if (isAdmin) {
      // Send for approval
      createApproval({
        type: "FREEZE_CARD",
        initiatorEmail: currentUser?.email || "",
        initiatorName: currentUser?.name || "",
        cardDetails: {
          cardId: card.id,
          nickname: card.nickname,
          action: card.status === "active" ? "freeze" : "unfreeze",
        },
        status: "PENDING",
      });
      auditLogger.logApprovalRequested(
        `approval-freeze-${card.id}`,
        "FREEZE_CARD",
        card.nickname
      );
      addNotification({
        type: "info",
        title: "Approval Sent",
        message: `${card.status === "active" ? "Freeze" : "Unfreeze"} request for "${card.nickname}" has been sent to Approver`,
        duration: 5000,
      });
      return;
    }
    // APPROVER can freeze immediately
    if (card.status === "active") {
      freezeCard(card.id);
      auditLogger.logCardFrozen(card.id, card.nickname);
    } else {
      unfreezeCard(card.id);
      auditLogger.logCardUnfrozen(card.id, card.nickname);
    }
    addNotification({
      type: "success",
      title: "Card Updated",
      message: `Card "${card.nickname}" has been ${card.status === "active" ? "frozen" : "unfrozen"}`,
      duration: 3000,
    });
  };

  const handleDeleteCard = (card: any) => {
    if (isViewer) {
      setPermissionDeniedAction("Delete Card");
      setShowPermissionDenied(true);
      return;
    }
    if (isAdmin) {
      // Send for approval
      createApproval({
        type: "DELETE_CARD",
        initiatorEmail: currentUser?.email || "",
        initiatorName: currentUser?.name || "",
        cardDetails: {
          cardId: card.id,
          nickname: card.nickname,
        },
        status: "PENDING",
      });
      auditLogger.logApprovalRequested(
        `approval-delete-${card.id}`,
        "DELETE_CARD",
        card.nickname
      );
      addNotification({
        type: "info",
        title: "Approval Sent",
        message: `Delete request for "${card.nickname}" has been sent to Approver`,
        duration: 5000,
      });
      return;
    }
    // APPROVER must confirm with multi-signatory authorization for sensitive deletion
    setCardToDelete(card);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async (_ceoOTP: string, _cfoOTP: string) => {
    if (!cardToDelete) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      deleteCard(cardToDelete.id);
      auditLogger.logCardDeleted(cardToDelete.id, cardToDelete.nickname);
      addNotification({
        type: "success",
        title: "Card Permanently Deleted",
        message: `Card "${cardToDelete.nickname}" has been permanently deleted`,
        duration: 3000,
      });

      setShowDeleteConfirmation(false);
      setCardToDelete(null);
    } catch (error) {
      auditLogger.logFailedAction(
        "Card Deletion",
        "Virtual Card",
        cardToDelete.id,
        error instanceof Error ? error.message : "Unknown error"
      );
      addNotification({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete the card. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCards = useMemo(() => {
    return cards.filter((card: any) => {
      const matchesSearch =
        card.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.maskedNumber.includes(searchTerm);
      const matchesStatus = !filterStatus || card.status === filterStatus;
      const matchesDepartment =
        !filterDepartment || card.department === filterDepartment;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [cards, searchTerm, filterStatus, filterDepartment]);

  const departments = [...new Set(cards.map((c: any) => c.department))];

  const tableRows = filteredCards.map((card: any) => [
    card.nickname,
    card.maskedNumber,
    card.department,
    formatCurrency(card.currentSpend) + " / " + formatCurrency(card.softLimit),
    <Badge
      key={card.id}
      variant={card.status === "active" ? "success" : "warning"}
    >
      {CARD_STATUS_LABELS[card.status] || card.status}
    </Badge>,
    <div key={card.id} className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewCard(card.id)}
        disabled={isViewer}
        title={
          isViewer ? "Viewers cannot view card details" : "View card details"
        }
      >
        <Eye size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFreezeCard(card)}
        disabled={isViewer}
        title={
          isViewer ? "Viewers cannot freeze cards" : "Freeze or unfreeze card"
        }
      >
        <Lock size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-error"
        onClick={() => handleDeleteCard(card)}
        disabled={isViewer}
        title={isViewer ? "Viewers cannot delete cards" : "Delete card"}
      >
        <Trash2 size={16} />
      </Button>
    </div>,
  ]);

  return (
    <div className="space-y-6">
      {/* Admin Alert */}
      {showAdminAlert && isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-blue-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="font-semibold text-blue-900">
              Note for Administrators
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Your card actions will require approval from an Approver.
              Approvers can create, freeze, and delete cards immediately.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Virtual Cards</h1>
          <p className="text-neutral-600 mt-1">
            {isViewer
              ? "View your corporate virtual cards"
              : "Manage your corporate virtual cards"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Pending Approvals Button - Only for APPROVER */}
          {isApprover && (
            <button
              onClick={() => setShowPendingApprovals(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition group"
            >
              <CheckCircle2 size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-neutral-900">
                Pending Approvals
              </span>
              {pendingCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* Create Card Button - Only for APPROVER and ADMINISTRATOR */}
          {(isApprover || isAdmin) && (
            <Link href="/virtual-cards/create">
              <Button variant="primary" size="lg">
                <Plus size={18} className="mr-2" />
                Create Card
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-neutral-900">Filters</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by nickname or card number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "frozen", label: "Frozen" },
              ]}
            />
            <Select
              placeholder="Filter by department"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              options={departments.map((dept: any) => ({
                value: dept,
                label: dept,
              }))}
            />
          </div>
        </CardBody>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-neutral-900">
            {filteredCards.length} Cards
          </h3>
        </CardHeader>
        <CardBody>
          <Table
            headers={[
              "Card Name",
              "Card Number",
              "Department",
              "Spending",
              "Status",
              "Actions",
            ]}
            rows={tableRows}
          />
        </CardBody>
      </Card>

      {filteredCards.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-neutral-500">No virtual cards found</p>
          {(isApprover || isAdmin) && (
            <Link href="/virtual-cards/create" className="mt-4">
              <Button variant="primary">Create Your First Card</Button>
            </Link>
          )}
        </Card>
      )}

      {/* Pending Approvals Modal */}
      <PendingApprovalsModal
        isOpen={showPendingApprovals}
        onClose={() => setShowPendingApprovals(false)}
      />

      {/* Permission Denied Modal */}
      <PermissionDeniedModal
        isOpen={showPermissionDenied}
        onClose={() => {
          setShowPermissionDenied(false);
          setPermissionDeniedAction("");
        }}
        message={`You do not have permission to ${permissionDeniedAction?.toLowerCase() || "perform this action"}.`}
      />

      {/* Delete Card Multi-Signatory Modal */}
      <MultiSignatoryModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setCardToDelete(null);
        }}
        onApprove={handleConfirmDelete}
        cardNickname={cardToDelete?.nickname || ""}
        action={`Delete Card - ${cardToDelete?.department || "Corporate"}`}
        isLoading={isDeleting}
        warningMessage="⚠️ PERMANENT ACTION: This card will be permanently deleted and cannot be recovered. All associated records and transaction history will be retained for compliance purposes only."
        suggestion="Consider freezing the card instead if you just want to prevent further transactions."
      />
    </div>
  );
}
