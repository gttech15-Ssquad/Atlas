"use client";

import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
