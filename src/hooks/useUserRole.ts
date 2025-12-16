import { useRBACStore } from "@/store/rbacStore";

export const useUserRole = () => {
  const { currentUser } = useRBACStore();
  return currentUser?.role || null;
};
