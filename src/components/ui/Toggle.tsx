import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const Toggle = ({
  checked,
  onChange,
  disabled = false,
  label,
}: ToggleProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-neutral-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && (
        <label className="text-sm font-medium text-neutral-700">{label}</label>
      )}
    </div>
  );
};
