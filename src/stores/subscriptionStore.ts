import { create } from "zustand";

export interface Subscription {
  id: string;
  vendor: string;
  subscriptionType: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  nextBillingDate: string;
  status: "active" | "paused" | "expiring" | "expired";
  startDate: string;
  endDate?: string;
  category: string;
  autoRenewal: boolean;
}

export interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getAllSubscriptions: () => Subscription[];
  getActiveSubscriptions: () => Subscription[];
  getPausedSubscriptions: () => Subscription[];
  getExpiringSubscriptions: () => Subscription[];
  getTotalMonthlySpending: () => number;
  getTotalAnnualSpending: () => number;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  addSubscription: (sub) =>
    set((state) => ({
      subscriptions: [...state.subscriptions, sub],
    })),
  updateSubscription: (id, updates) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updates } : sub
      ),
    })),
  deleteSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
    })),
  getAllSubscriptions: () => get().subscriptions,
  getActiveSubscriptions: () =>
    get().subscriptions.filter((sub) => sub.status === "active"),
  getPausedSubscriptions: () =>
    get().subscriptions.filter((sub) => sub.status === "paused"),
  getExpiringSubscriptions: () =>
    get().subscriptions.filter((sub) => sub.status === "expiring"),
  getTotalMonthlySpending: () => {
    const subs = get().subscriptions.filter((sub) => sub.status === "active");
    return subs.reduce((total, sub) => {
      if (sub.frequency === "monthly") return total + sub.amount;
      if (sub.frequency === "yearly") return total + sub.amount / 12;
      if (sub.frequency === "weekly") return total + sub.amount * 4.33;
      if (sub.frequency === "daily") return total + sub.amount * 30;
      return total;
    }, 0);
  },
  getTotalAnnualSpending: () => {
    const subs = get().subscriptions.filter((sub) => sub.status === "active");
    return subs.reduce((total, sub) => {
      if (sub.frequency === "yearly") return total + sub.amount;
      if (sub.frequency === "monthly") return total + sub.amount * 12;
      if (sub.frequency === "weekly") return total + sub.amount * 52;
      if (sub.frequency === "daily") return total + sub.amount * 365;
      return total;
    }, 0);
  },
}));
