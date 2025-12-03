import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  center?: boolean;
}

export const LoadingSpinner = ({
  size = "md",
  message = "Loading...",
  center = true,
}: LoadingSpinnerProps) => {
  const sizeClasses: Record<string, string> = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        center && "min-h-[300px]"
      )}
    >
      <div
        className={cn(
          "border-4 border-neutral-200 border-t-primary rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
      {message && <p className="text-sm text-neutral-500">{message}</p>}
    </div>
  );
};
