"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useRBACStore } from "@/store/rbacStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { authValidation } from "@/lib/authValidation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { loginUser } = useRBACStore();
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate credentials against demo users
      const validation = authValidation.validateCredentials(email, password);

      if (!validation.valid) {
        setError(validation.message);
        setLoading(false);
        return;
      }

      // Credentials are valid, move to 2FA step
      setStep("2fa");
      setLoading(false);
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (otp.length !== 6) {
        setError("OTP must be 6 digits");
        setLoading(false);
        return;
      }

      // Login with RBAC store
      loginUser(email);

      // Also call authStore login for backward compatibility
      await login(email);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("2FA verification failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">GTBank GAPS</h1>
          <p className="text-neutral-600">
            Corporate Account Management Platform
          </p>
        </div>

        {error && <Alert type="error" title="Error" message={error} />}

        {step === "login" ? (
          <form
            onSubmit={handleLogin}
            className="space-y-4 bg-white p-6 rounded-lg border border-neutral-200 shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Login</h2>

            <Input
              label="Organization ID"
              type="text"
              placeholder="Enter your organization ID"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="your.email@gtbank.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full"
            >
              Continue to 2FA
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handle2FA}
            className="space-y-4 bg-white p-6 rounded-lg border border-neutral-200 shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Two-Factor Authentication
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              Enter the 6-digit code sent to your email or app
            </p>

            <Input
              label="6-Digit OTP Code"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full"
            >
              Verify & Login
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStep("login");
                setOtp("");
              }}
              className="w-full"
            >
              Back to Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
