// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { Card, CardHeader, CardBody } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Badge } from "@/components/ui/Badge";
// import { Progress } from "@/components/ui/Progress";
// import { CardPreview } from "@/components/cards/CardPreview";
// import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
// import { useCardStore } from "@/store/cardStore";
// import { CARD_STATUS_LABELS } from "@/lib/constants";
// import { formatCurrency, calculatePercentage } from "@/lib/utils";
// import { Lock, Trash2, Edit3, ArrowLeft } from "lucide-react";
// import { cardapiClient } from "@/lib/api-client";
// import Link from "next/link";

// export default function CardDetailsPage() {
//   const params = useParams();
//   const cardId = params.id as string;
//   const { cards, selectedCard, selectCard } = useCardStore();
//   const [showCVV, setShowCVV] = useState(false);
//   const [showMultiSig, setShowMultiSig] = useState(false);
//   const [multiSigAction, setMultiSigAction] = useState("");
//   const [activities, setActivities] = useState<any[]>([]);

//   React.useEffect(() => {
//     selectCard(cardId);
//   }, [cardId, selectCard]);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await apiClient.getApprovalHistoryForCard(cardId);
//         const data = res.data;
//         if (mounted) setActivities(data.items ?? data ?? []);
//       } catch (err) {
//         // ignore for now; activities will be empty
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [cardId]);

//   const card = selectedCard || cards.find((c) => c.id === cardId);

//   if (!card) {
//     return (
//       <div className="text-center py-12 space-y-4">
//         <p className="text-neutral-500">Card not found</p>
//         <Link href="/virtual-cards">
//           <Button variant="primary">
//             <ArrowLeft size={16} className="mr-2" />
//             Back to Cards
//           </Button>
//         </Link>
//       </div>
//     );
//   }

//   const softLimitPercentage = calculatePercentage(
//     card.currentSpend,
//     card.softLimit
//   );
//   const hardLimitPercentage = calculatePercentage(
//     card.currentSpend,
//     card.hardLimit
//   );

//   const handleApproveAction = (action: string) => {
//     setMultiSigAction(action);
//     setShowMultiSig(true);
//   };

//   const handleMultiSigApprove = async (_ceoOTP: string, _cfoOTP: string) => {
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     setShowMultiSig(false);
//     setMultiSigAction("");
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link href="/virtual-cards">
//             <Button variant="outline" size="sm">
//               <ArrowLeft size={16} />
//             </Button>
//           </Link>
//           <div>
//             <h1 className="text-3xl font-bold text-neutral-900">
//               {card.nickname}
//             </h1>
//             <p className="text-neutral-600 mt-1">
//               {card.department} Department
//             </p>
//           </div>
//         </div>
//         <Badge variant={card.status === "active" ? "success" : "warning"}>
//           {CARD_STATUS_LABELS[card.status]}
//         </Badge>
//       </div>

//       {/* Card Preview and Info */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Card Preview */}
//         <CardPreview
//           cardNumber={card.cardNumber}
//           expiryDate={card.expiryDate}
//           cvv={card.cvv}
//           cardholderName="CORPORATE CARD"
//           department={card.department}
//           showCVV={showCVV}
//           onShowCVV={setShowCVV}
//         />

//         {/* Card Details */}
//         <Card>
//           <CardHeader>
//             <h3 className="text-lg font-semibold text-neutral-900">
//               Card Details
//             </h3>
//           </CardHeader>
//           <CardBody className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-xs font-medium text-neutral-600">
//                   Card Number
//                 </p>
//                 <p className="font-mono text-sm text-neutral-900 mt-1">
//                   {card.maskedNumber}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-neutral-600">Expiry</p>
//                 <p className="font-mono text-sm text-neutral-900 mt-1">
//                   {card.expiryDate}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-neutral-600">
//                   Department
//                 </p>
//                 <p className="text-sm text-neutral-900 mt-1">
//                   {card.department}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-neutral-600">Status</p>
//                 <Badge
//                   variant={card.status === "active" ? "success" : "warning"}
//                 >
//                   {CARD_STATUS_LABELS[card.status]}
//                 </Badge>
//               </div>
//             </div>

//             <div className="border-t border-neutral-200 pt-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs font-medium text-neutral-600">
//                   Merchants Allowed
//                 </span>
//                 <span className="text-xs text-neutral-500">
//                   {card.merchantCategories.length} categories
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {card.merchantCategories.map((merchant) => (
//                   <Badge key={merchant} variant="primary">
//                     {merchant}
//                   </Badge>
//                 ))}
//               </div>
//             </div>

//             <div className="border-t border-neutral-200 pt-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={card.internationalTransactions}
//                   readOnly
//                   className="rounded"
//                 />
//                 <span className="text-sm text-neutral-700">
//                   International Transactions{" "}
//                   {card.internationalTransactions ? "Enabled" : "Disabled"}
//                 </span>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       </div>

//       {/* Spending Analysis */}
//       <Card>
//         <CardHeader>
//           <h3 className="text-lg font-semibold text-neutral-900">
//             Spending Analysis
//           </h3>
//         </CardHeader>
//         <CardBody className="space-y-6">
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-neutral-700">
//                 Soft Limit
//               </span>
//               <span className="text-sm font-semibold text-neutral-900">
//                 {formatCurrency(card.currentSpend)} /{" "}
//                 {formatCurrency(card.softLimit)}
//               </span>
//             </div>
//             <Progress
//               value={card.currentSpend}
//               max={card.softLimit}
//               color={softLimitPercentage > 80 ? "warning" : "primary"}
//               showLabel
//             />
//           </div>

//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-neutral-700">
//                 Hard Limit
//               </span>
//               <span className="text-sm font-semibold text-neutral-900">
//                 {formatCurrency(card.currentSpend)} /{" "}
//                 {formatCurrency(card.hardLimit)}
//               </span>
//             </div>
//             <Progress
//               value={card.currentSpend}
//               max={card.hardLimit}
//               color={hardLimitPercentage > 90 ? "error" : "primary"}
//               showLabel
//             />
//           </div>
//         </CardBody>
//       </Card>

//       {/* Activity Log */}
//       <Card>
//         <CardHeader>
//           <h3 className="text-lg font-semibold text-neutral-900">
//             Activity Log
//           </h3>
//         </CardHeader>
//         <CardBody>
//           <div className="space-y-3">
//             {activities.slice(0, 5).map((log) => (
//               <div
//                 key={log.id}
//                 className="pb-3 border-b border-neutral-200 last:border-0"
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-neutral-900">
//                       {(log.action || log.type || "")
//                         .toString()
//                         .replace(/_/g, " ")}
//                     </p>
//                     <p className="text-xs text-neutral-500 mt-1">
//                       {log.details ?? log.message ?? ""}
//                     </p>
//                   </div>
//                   <span className="text-xs text-neutral-400">
//                     {new Date(
//                       log.timestamp || log.createdAt || log.date
//                     ).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardBody>
//       </Card>

//       {/* Actions */}
//       <div className="flex flex-wrap gap-3">
//         <Button
//           variant="outline"
//           onClick={() => handleApproveAction("CHANGE_LIMITS")}
//         >
//           <Edit3 size={16} className="mr-2" />
//           Change Limits
//         </Button>
//         <Button
//           variant="warning"
//           onClick={() => handleApproveAction("FREEZE_CARD")}
//         >
//           <Lock size={16} className="mr-2" />
//           Freeze Card
//         </Button>
//         <Button
//           variant="danger"
//           onClick={() => handleApproveAction("DELETE_CARD")}
//         >
//           <Trash2 size={16} className="mr-2" />
//           Delete Card
//         </Button>
//       </div>

//       {/* Multi-Signatory Modal */}
//       <MultiSignatoryModal
//         isOpen={showMultiSig}
//         onClose={() => setShowMultiSig(false)}
//         onApprove={handleMultiSigApprove}
//         cardNickname={card.nickname}
//         action={multiSigAction}
//       />
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { CardPreview } from "@/components/cards/CardPreview";
import { MultiSignatoryModal } from "@/components/modals/MultiSignatoryModal";
// Assuming useCardStore is still used for global state, but reducing its role for this page
// import { useCardStore } from "@/store/cardStore";
import { CARD_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, calculatePercentage } from "@/lib/utils";
import { Lock, Trash2, Edit3, ArrowLeft, Loader2 } from "lucide-react";
// import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { toast } from "react-hot-toast"; // Assuming you have a toast library
import { cardapiClient } from "@/lib/api/cardApiClient";

// Define a key for your query caches
const CARD_QUERY_KEYS = {
  details: (id: string) => ["cardDetails", id],
  history: (id: string) => ["cardHistory", id],
};

export default function CardDetailsPage() {
  const params = useParams();
  const cardId = params.id as string;
  const queryClient = useQueryClient();

  const [showCVV, setShowCVV] = useState(false);
  const [showMultiSig, setShowMultiSig] = useState(false);
  const [multiSigAction, setMultiSigAction] = useState("");

  // --- 1. FETCH CARD DETAILS (useQuery) ---
  const {
    data: cardResponse,
    isLoading: isLoadingCard,
    error: cardError,
  } = useQuery({
    queryKey: CARD_QUERY_KEYS.details(cardId),
    queryFn: () => cardapiClient.getCardDetails(cardId).then((res) => res.data),
    enabled: !!cardId, // Only run query if cardId exists
  });

  const card = cardResponse?.data || cardResponse; // Adjust based on your API response wrapper

  // --- 2. FETCH ACTIVITY LOG (useQuery) ---
  const { data: historyResponse, isLoading: isLoadingHistory } = useQuery({
    queryKey: CARD_QUERY_KEYS.history(cardId),
    queryFn: () =>
      cardapiClient.getApprovalHistoryForCard(cardId).then((res) => res.data),
    enabled: !!cardId,
    // Ensure we get an array, even if the API returns a wrapper object or an empty array
    select: (data) => data.items ?? data ?? [],
  });

  const activities = historyResponse || [];

  // --- 3. MUTATIONS (useMutation) ---

  // Mutation to handle card status changes (e.g., Freeze/Unfreeze)
  const statusMutation = useMutation({
    mutationFn: (action: "freeze" | "unfreeze") => {
      if (action === "freeze") return cardapiClient.freezeCard(cardId);
      if (action === "unfreeze") return cardapiClient.unfreezeCard(cardId);
      throw new Error("Invalid status action");
    },
    onSuccess: () => {
      // Invalidate both queries to refetch the latest card details and history
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.details(cardId),
      });
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.history(cardId),
      });
      toast.success("Card status updated successfully.");
    },
    onError: (err) => {
      toast.error(`Failed to update card status: ${err.message}`);
    },
  });

  // Mutation to handle card deletion
  const deleteMutation = useMutation({
    mutationFn: () => cardapiClient.deleteCard(cardId),
    onSuccess: () => {
      toast.success("Card deleted successfully.");
      // Redirect to the cards list page after successful deletion
      // Example: router.push('/virtual-cards');
    },
    onError: (err) => {
      toast.error(`Failed to delete card: ${err.message}`);
    },
  });

  // --- HANDLERS ---

  // Replaces the old useEffect logic for initial data loading
  if (isLoadingCard) {
    return (
      <div className="text-center py-12">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto" />
        <p className="mt-4 text-neutral-500">Loading card details...</p>
      </div>
    );
  }

  if (cardError || !card) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-neutral-500">
          {cardError
            ? `Error loading card: ${cardError.message}`
            : "Card not found"}
        </p>
        <Link href="/virtual-cards">
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Cards
          </Button>
        </Link>
      </div>
    );
  }

  const handleApproveAction = (action: string) => {
    setMultiSigAction(action);
    setShowMultiSig(true);
  };

  const handleMultiSigApprove = async (ceoOTP: string, cfoOTP: string) => {
    // This action would now trigger an API call to request approval (a POST to /api/Approvals)
    // We are simulating the network wait here, but in a real app, you'd use a mutation here.
    try {
      // Example of a mutation for an approval request (not fully implemented in endpoints)
      // await approvalRequestMutation.mutateAsync({
      //     cardId,
      //     action: multiSigAction,
      //     ceoOTP,
      //     cfoOTP
      // });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Approval request for ${multiSigAction} sent.`);
    } catch (e) {
      toast.error("Failed to send approval request.");
    } finally {
      setShowMultiSig(false);
      setMultiSigAction("");
    }
  };

  const handleFreezeToggle = () => {
    if (card.status === "Active") {
      statusMutation.mutate("freeze");
    } else {
      // Assuming 'unfreeze' is the action for non-active/frozen status
      statusMutation.mutate("unfreeze");
    }
  };

  const softLimitPercentage = calculatePercentage(
    card.currentSpend,
    card.softLimit
  );
  const hardLimitPercentage = calculatePercentage(
    card.currentSpend,
    card.hardLimit
  );

  // Determine if any critical action is pending/loading
  const isMutating = statusMutation.isPending || deleteMutation.isPending;
  const isFrozen = card.status === "frozen" || card.status === "inactive";
  const freezeButtonText = isFrozen ? "Unfreeze Card" : "Freeze Card";
  const freezeAction = isFrozen ? "UNFREEZE_CARD" : "FREEZE_CARD";

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
          expiryDate={card.expiryDateFormatted}
          cvv={card.cvv}
          cardholderName={card.nickname}
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
                  {card.cardNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600">Expiry</p>
                <p className="font-mono text-sm text-neutral-900 mt-1">
                  {card.expiryDateFormatted}
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
                  variant={card.status === "ACTIVE" ? "success" : "warning"}
                >
                  {CARD_STATUS_LABELS[card.status]}
                </Badge>
              </div>
            </div>

            {/* <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-600">
                  Merchants Allowed
                </span>
                <span className="text-xs text-neutral-500">
                  {card.merchantCategories?.length ?? 0} categories
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {card.merchantCategories?.map((merchant: string) => (
                  <Badge key={merchant} variant="primary">
                    {merchant}
                  </Badge>
                ))}
              </div>
            </div> */}

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center gap-2">
                {/* Note: In a real app, toggling this would require an API call (PUT /api/Cards/{cardId}/international) */}
                <input
                  type="checkbox"
                  checked={card.allowInternational}
                  readOnly
                  className="rounded"
                />
                <span className="text-sm text-neutral-700">
                  International Transactions{" "}
                  {card.allowInternational ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Spending Analysis (same as before) */}
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
          {isLoadingHistory ? (
            <p className="text-center text-neutral-500">Loading history...</p>
          ) : (
            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((log: any) => (
                  <div
                    key={log.id}
                    className="pb-3 border-b border-neutral-200 last:border-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {(log.action || log.type || "")
                            .toString()
                            .replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {log.details ?? log.message ?? ""}
                        </p>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {new Date(
                          log.timestamp || log.createdAt || log.date
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutral-500">
                  No recent activity found.
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => handleApproveAction("CHANGE_LIMITS")}
          disabled={isMutating}
        >
          <Edit3 size={16} className="mr-2" />
          Change Limits
        </Button>
        <Button
          variant={isFrozen ? "success" : "warning"}
          onClick={handleFreezeToggle}
          disabled={isMutating}
        >
          {isMutating && statusMutation.isPending && (
            <Loader2 size={16} className="mr-2 animate-spin" />
          )}
          {!isMutating && <Lock size={16} className="mr-2" />}
          {freezeButtonText}
        </Button>
        <Button
          variant="danger"
          onClick={() => handleApproveAction("DELETE_CARD")}
          disabled={isMutating}
        >
          {isMutating && deleteMutation.isPending && (
            <Loader2 size={16} className="mr-2 animate-spin" />
          )}
          {!isMutating && <Trash2 size={16} className="mr-2" />}
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

// {
//     "id": "c34ea1af-eedd-4917-941b-429dd367f1d9",
//     "cardNumber": "51749941021729794",
//     "cvv": "894",
//     "expiryDateFormatted": "12/29",
//     "cardholderName": "User1 name2",
//     "nickname": "Design Team Card",
//     "status": "PENDING",
//     "cardType": "CREDIT",
//     "currency": "NGN",
//     "allowInternational": true,
//     "freezeReason": null,
//     "frozenAt": null,
//     "createdAt": "2025-12-11T07:52:12.9715552",
//     "updatedAt": "2025-12-11T07:52:12.9716079",
//     "balance": null,
//     "limits": [],
//     "merchantRestrictions": [],
//     "recentTransactions": []
// }
