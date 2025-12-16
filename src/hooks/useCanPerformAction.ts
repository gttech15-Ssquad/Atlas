import { useRBACStore } from "@/store/rbacStore";
import { rbacUtils, Action } from "@/lib/rbacUtils";

export const useCanPerformAction = () => {
  const { currentUser } = useRBACStore();

  const canPerform = (action: Action): boolean => {
    if (!currentUser) return false;
    return rbacUtils.canPerformAction(currentUser.role, action);
  };

  const canPerformCardAction = (
    action: string
  ): "immediate" | "approval" | "denied" => {
    if (!currentUser) return "denied";
    return rbacUtils.canPerformCardAction(currentUser.role, action as any);
  };

  const canManageUsers = (): boolean => {
    if (!currentUser) return false;
    return rbacUtils.canManageUsers(currentUser.role);
  };

  const canViewCardDetails = (): boolean => {
    if (!currentUser) return false;
    return rbacUtils.canViewCardDetails(currentUser.role);
  };

  const canApproveActions = (): boolean => {
    if (!currentUser) return false;
    return rbacUtils.canApproveActions(currentUser.role);
  };

  return {
    canPerform,
    canPerformCardAction,
    canManageUsers,
    canViewCardDetails,
    canApproveActions,
    currentUserRole: currentUser?.role,
  };
};
