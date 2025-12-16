"use client";

import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // milliseconds, undefined = persistent
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];

  // Add notification
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => string;

  // Remove notification
  removeNotification: (id: string) => void;

  // Clear all
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date().toISOString(),
      duration: notification.duration || 5000, // Default 5 seconds
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
