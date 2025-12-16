"use client";

import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { cn } from "@/lib/utils";

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-[60] max-w-sm">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

interface NotificationToastProps {
  notification: any;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
}) => {
  const { removeNotification } = useNotificationStore();
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    if (!notification.duration) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        removeNotification(notification.id);
      }, 300);
    }, notification.duration);

    return () => clearTimeout(timer);
  }, [notification.duration, notification.id, removeNotification]);

  const bgColorMap = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-yellow-50 border-yellow-200",
  };
  const bgColor = bgColorMap[notification.type as keyof typeof bgColorMap];

  const iconColorMap = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
  };
  const iconColor =
    iconColorMap[notification.type as keyof typeof iconColorMap];

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };
  const Icon = iconMap[notification.type as keyof typeof iconMap];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-bottom-4 transition-all duration-300",
        bgColor,
        isExiting && "animate-out slide-out-to-bottom-4"
      )}
    >
      <Icon size={20} className={cn("flex-shrink-0 mt-0.5", iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-neutral-900">
          {notification.title}
        </p>
        <p className="text-sm text-neutral-700 mt-0.5">
          {notification.message}
        </p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            removeNotification(notification.id);
          }, 300);
        }}
        className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition"
      >
        <X size={18} />
      </button>
    </div>
  );
};
