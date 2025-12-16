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

/**
 * Luhn Algorithm - validates and generates valid credit card numbers
 */
function luhnChecksum(num: string): number {
  let sum = 0;
  let isEven = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Generate a valid Mastercard number using Luhn algorithm
 * Mastercard BIN ranges: 51-55, 2221-2720
 */
export function generateCardNumber(): string {
  // Mastercard prefix (using 51-55 range)
  const mastercardPrefixes = ["51", "52", "53", "54", "55"];
  const prefix =
    mastercardPrefixes[Math.floor(Math.random() * mastercardPrefixes.length)];

  // Generate 14 random digits (total 16 digits for Mastercard)
  let cardNumber = prefix;
  for (let i = 0; i < 14; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  // Calculate the Luhn checksum digit
  const checksum = luhnChecksum(cardNumber);
  cardNumber += checksum;

  // Format as spaced groups (e.g., "5234 1234 5678 9010")
  return (
    cardNumber.slice(0, 4) +
    " " +
    cardNumber.slice(4, 8) +
    " " +
    cardNumber.slice(8, 12) +
    " " +
    cardNumber.slice(12, 16)
  );
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
