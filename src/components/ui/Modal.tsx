import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  onEscapeClose?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  onEscapeClose = true,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (onEscapeClose && e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, onEscapeClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: "w-96",
    md: "w-[500px]",
    lg: "w-[700px]",
    xl: "w-[900px]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "bg-white rounded-lg shadow-modal max-h-[90vh] overflow-y-auto",
          sizeClasses[size]
        )}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
