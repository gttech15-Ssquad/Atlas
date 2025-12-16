// OTP Manager - Demo version always returns 123456

export interface OTPData {
  otp: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  isValid: boolean;
}

const OTP_VALIDITY_MS = 10 * 60 * 1000; // 10 minutes
const DEMO_OTP = "123456";
const MAX_ATTEMPTS = 3;

let currentOTP: OTPData | null = null;

export const otpManager = {
  // Generate OTP (demo: always 123456)
  generateOTP: (): string => {
    const now = Date.now();
    currentOTP = {
      otp: DEMO_OTP,
      createdAt: now,
      expiresAt: now + OTP_VALIDITY_MS,
      attempts: 0,
      isValid: true,
    };
    return DEMO_OTP;
  },

  // Validate OTP
  validateOTP: (inputOTP: string): { valid: boolean; message: string } => {
    if (!currentOTP || !currentOTP.isValid) {
      return { valid: false, message: "No OTP generated. Request a new one." };
    }

    if (Date.now() > currentOTP.expiresAt) {
      currentOTP.isValid = false;
      return {
        valid: false,
        message: "OTP has expired. Please request a new one.",
      };
    }

    currentOTP.attempts++;

    if (currentOTP.attempts > MAX_ATTEMPTS) {
      currentOTP.isValid = false;
      return {
        valid: false,
        message: "Maximum attempts exceeded. Please request a new OTP.",
      };
    }

    if (inputOTP === currentOTP.otp) {
      currentOTP.isValid = false; // OTP is single-use
      return { valid: true, message: "OTP verified successfully" };
    }

    const remainingAttempts = MAX_ATTEMPTS - currentOTP.attempts;
    return {
      valid: false,
      message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
    };
  },

  // Get remaining time for current OTP (in seconds)
  getRemainingTime: (): number => {
    if (!currentOTP || !currentOTP.isValid) return 0;

    const remaining = currentOTP.expiresAt - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  },

  // Check if OTP is still valid (not expired and not used)
  isOTPValid: (): boolean => {
    if (!currentOTP || !currentOTP.isValid) return false;
    return Date.now() <= currentOTP.expiresAt;
  },

  // Clear current OTP
  clearOTP: (): void => {
    currentOTP = null;
  },

  // Get current OTP data (for debugging/testing)
  getCurrentOTP: (): OTPData | null => {
    return currentOTP;
  },
};
