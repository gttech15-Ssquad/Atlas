"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useRBACStore } from "@/store/rbacStore";
import { authValidation } from "@/lib/authValidation";
import { Alert } from "@/components/ui/Alert";
import { Eye, EyeOff, Check, Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { loginUser } = useRBACStore();
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberUserId, setRememberUserId] = useState(false);
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

      // Store remember preference
      if (rememberUserId) {
        localStorage.setItem("orgfrontend_remembered_email", email);
      } else {
        localStorage.removeItem("orgfrontend_remembered_email");
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

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert("Password reset link will be sent to your email");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation - Full Width */}
      <div className="border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/images/gtco1.png"
            alt="GTCO Logo"
            className="w-8 h-8 object-contain"
            onError={(e) => console.error("GTCO image failed to load:", e)}
          />
          <span className="font-semibold text-gray-900">
            Automated Payment System
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition">
            Contact Support
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition">
            <Globe size={16} />
            <span>EN</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Column - Hero Section */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex-col justify-between p-8 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/building.png"
              alt="Building Background"
              className="w-full h-full object-cover"
              // style={{ opacity: 0.7 }}
              // onError={(e) =>
              //   console.error("Building image failed to load:", e)
              // }
            />
            {/* <img
              src="/building.png"
              alt="Building Background"
              className="w-full h-full object-cover"
              style={{ opacity: 0.7 }}
            />
           */}
          </div>
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-blue-900 opacity-40 z-0"></div>
          Content
          <div className="relative z-10 flex flex-col justify-end h-full">
            {/* <div className="flex justify-start">
              <div className="bg-yellow-400 p-3 rounded-lg">
                <Shield size={28} className="text-blue-900" />
              </div>
            </div> */}

            {/* Bottom - Hero Message */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Secure Banking for Your Enterprise
                </h2>
                <p className="text-gray-100 text-lg leading-relaxed">
                  Manage your global corporate finances with our
                  state-of-the-art secure portal. Experience real-time analytics
                  and seamless transfers.
                </p>
              </div>

              {/* Security Badges */}
              <div className="flex gap-6 pt-4">
                <div className="flex items-center gap-2 text-white">
                  <Check size={20} className="text-yellow-400" />
                  <span className="text-sm font-medium">
                    256-bit Encryption
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Check size={20} className="text-yellow-400" />
                  <span className="text-sm font-medium">Fraud Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-[55%] flex flex-col">
          {/* Form Container */}
          <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md">
              {step === "login" ? (
                <>
                  {/* Login Form Header */}
                  <div className="mb-8">
                    <h1
                      className="text-4xl font-bold mb-2"
                      style={{ color: "#E15C42" }}
                    >
                      GAPS
                    </h1>
                    <p className="text-gray-700">
                      Please enter your corporate credentials to access your
                      dashboard.
                    </p>
                  </div>

                  {error && (
                    <Alert type="error" title="Error" message={error} />
                  )}

                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* Organization ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Organization ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Organization ID"
                        value={organizationId}
                        onChange={(e) => setOrganizationId(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E15C42] focus:border-transparent transition"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E15C42] focus:border-transparent transition"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-900">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm font-medium transition"
                          style={{ color: "#E15C42" }}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E15C42] focus:border-transparent transition pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberUserId}
                        onChange={(e) => setRememberUserId(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#E15C42] focus:ring-[#E15C42] cursor-pointer"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                      >
                        Remember my User ID
                      </label>
                    </div>

                    {/* Primary Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ backgroundColor: "#E15C42" }}
                      className="w-full py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Logging in...
                        </>
                      ) : (
                        <>
                          Secure Login
                          <span className="text-lg">→</span>
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          New to Corporate Banking?
                        </span>
                      </div>
                    </div>

                    {/* Secondary Button */}
                    <button
                      type="button"
                      className="w-full py-2.5 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      Open a Corporate Account
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* 2FA Form Header */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Two-Factor Authentication
                    </h1>
                    <p className="text-gray-600">
                      Enter the 6-digit code sent to your email or app
                    </p>
                  </div>

                  {error && (
                    <Alert type="error" title="Error" message={error} />
                  )}

                  <form onSubmit={handle2FA} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E15C42] focus:border-transparent transition text-center text-2xl tracking-widest"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{ backgroundColor: "#E15C42" }}
                      className="w-full py-2.5 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep("login");
                        setOtp("");
                      }}
                      className="w-full py-2.5 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      Back to Login
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
