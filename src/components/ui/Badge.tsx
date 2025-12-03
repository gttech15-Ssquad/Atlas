import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({
  variant = "primary",
  children,
  className = "",
}: BadgeProps) => {
  const variants = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
