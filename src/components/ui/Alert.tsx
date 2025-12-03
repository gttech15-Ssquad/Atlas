import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  onClose?: () => void;
}

export const Alert = ({ type, title, message, onClose }: AlertProps) => {
  const typeClasses: Record<
    string,
    {
      bg: string;
      border: string;
      icon: React.ReactNode;
      titleColor: string;
      messageColor: string;
    }
  > = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: <Info className="text-blue-500" size={20} />,
      titleColor: "text-blue-900",
      messageColor: "text-blue-700",
    },
    success: {
      bg: "bg-success/10",
      border: "border-success/30",
      icon: <CheckCircle className="text-success" size={20} />,
      titleColor: "text-success",
      messageColor: "text-success/80",
    },
    warning: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: <AlertTriangle className="text-warning" size={20} />,
      titleColor: "text-warning",
      messageColor: "text-warning/80",
    },
    error: {
      bg: "bg-error/10",
      border: "border-error/30",
      icon: <AlertCircle className="text-error" size={20} />,
      titleColor: "text-error",
      messageColor: "text-error/80",
    },
  };

  const config = typeClasses[type];

  return (
    <div
      className={cn(
        "border rounded-lg p-4 flex gap-4 items-start",
        config.bg,
        config.border
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1">
        <h3 className={cn("font-semibold", config.titleColor)}>{title}</h3>
        <p className={cn("text-sm mt-1", config.messageColor)}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
