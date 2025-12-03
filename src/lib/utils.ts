import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "NGN"
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s+/g, "");
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s+/g, "");
  const last4 = cleaned.slice(-4);
  return `**** **** **** ${last4}`;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateCardNumber(): string {
  const prefix = "4929"; // Visa prefix
  const randomPart = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return prefix + randomPart;
}

export function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

export function generateExpiryDate(): string {
  const today = new Date();
  const expiryDate = new Date(today.getFullYear() + 3, today.getMonth());
  return `${(expiryDate.getMonth() + 1).toString().padStart(2, "0")}/${expiryDate.getFullYear().toString().slice(-2)}`;
}

export function isHighRiskAction(action: string): boolean {
  const HIGH_RISK = [
    "CHANGE_LIMITS",
    "CHANGE_MERCHANTS",
    "ENABLE_INTERNATIONAL",
    "FREEZE_CARD",
    "DELETE_CARD",
  ];
  return HIGH_RISK.includes(action);
}

export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return (current / total) * 100;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
