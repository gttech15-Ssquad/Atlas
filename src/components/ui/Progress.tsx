import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  color?: "primary" | "success" | "warning" | "error";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Progress = ({
  value,
  max = 100,
  color = "primary",
  showLabel = false,
  size = "md",
}: ProgressProps) => {
  const percentage = (value / max) * 100;

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  };

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "w-full bg-neutral-200 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            colorClasses[color]
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-neutral-600 text-right">
          {value.toLocaleString()} / {max.toLocaleString()}
        </div>
      )}
    </div>
  );
};
