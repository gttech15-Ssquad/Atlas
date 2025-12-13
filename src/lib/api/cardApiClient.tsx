import { instance } from "../utils/axios";
import { endpoints } from "./endpoints";

export const cardapiClient = {
  // --- QUERY ENDPOINTS ---
  getCardDetails: (cardId: string) =>
    instance.get(endpoints().cards.getComprehensiveCardInfo(cardId)),

  getApprovalHistoryForCard: (cardId: string) =>
    instance.get(endpoints().approvals.getCardApprovalHistory(cardId)),

  // --- MUTATION ENDPOINTS ---
  // PUT /api/Cards/{cardId}
  updateCard: (cardId: string, data: any) =>
    instance.put(endpoints().cards.updateCard(cardId), data),

  // POST /api/Cards/{cardId}/freeze
  freezeCard: (cardId: string) =>
    instance.post(endpoints().cards.freezeCard(cardId)),

  // POST /api/Cards/{cardId}/unfreeze
  unfreezeCard: (cardId: string) =>
    instance.post(endpoints().cards.unfreezeCard(cardId)),

  // DELETE /api/Cards/{cardId}
  deleteCard: (cardId: string) =>
    instance.delete(endpoints().cards.deleteCard(cardId)),

  // --- APPROVAL MUTATION ENDPOINTS (for MultiSig Modal) ---
  requestApproval: (action: string, data: any) =>
    instance.post(endpoints().approvals.requestApproval, { action, ...data }),
};
