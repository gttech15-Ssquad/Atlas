"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PermissionDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  requiredRole?: string;
}

export const PermissionDeniedModal: React.FC<PermissionDeniedModalProps> = ({
  isOpen,
  onClose,
  title = "Access Denied",
  message,
  requiredRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-600" />
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-neutral-700">{message}</p>

          {requiredRole && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Required role:</strong> {requiredRole}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          <Button variant="primary" onClick={onClose} className="w-full">
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
};
