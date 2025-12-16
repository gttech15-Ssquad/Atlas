"use client";

import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { UserRole } from "@/store/rbacStore";

interface RoleBasedRenderProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  const userRole = useUserRole();

  if (!userRole) {
    return <>{fallback}</>;
  }

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
