"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Mock login flow
      if (!email.includes("@")) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }

      // Move to 2FA step
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

      // Mock 2FA verification
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("2FA verification failed");
      setLoading(false);
    }
  };

  const presetCredentials = [
    { role: "CEO", email: "ceo@gtbank.com", password: "password" },
    { role: "CFO", email: "cfo@gtbank.com", password: "password" },
    { role: "Admin", email: "admin@gtbank.com", password: "password" },
  ];

  const handlePresetLogin = async (preset: (typeof presetCredentials)[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setStep("2fa");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2"> GAPS</h1>
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

        {/* Demo credentials */}
        {/* <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-sm mb-3 text-neutral-900">
            Demo Credentials
          </h3>
          <div className="space-y-2">
            {presetCredentials.map((preset) => (
              <button
                key={preset.email}
                type="button"
                onClick={() => handlePresetLogin(preset)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 hover:bg-primary/10 border border-neutral-200 rounded transition text-left"
              >
                <div className="font-medium text-primary">{preset.role}</div>
                <div className="text-xs text-neutral-600">{preset.email}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-neutral-500">
          Use any demo credential to login. 2FA code can be any 6 digits.
        </p> */}
      </div>
    </div>
  );
}
