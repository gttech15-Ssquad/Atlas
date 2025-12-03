import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:border-primary transition",
            error && "border-error focus:ring-error",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-neutral-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
