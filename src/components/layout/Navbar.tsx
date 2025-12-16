"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
  User,
  ChevronDown,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRBACStore } from "@/store/rbacStore";
import { useApprovalsStore } from "@/store/approvalsStore";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { rbacUtils } from "@/lib/rbacUtils";
import { PendingApprovalsModal } from "@/components/modals/PendingApprovalsModal";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showPendingApprovals, setShowPendingApprovals] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { logout } = useAuthStore();
  const { currentUser, loginUser, logoutUser, initializeDemoUsers } =
    useRBACStore();
  const { getPendingApprovals } = useApprovalsStore();
  const router = useRouter();

  const pendingCount = getPendingApprovals().length;

  // Initialize RBAC on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeDemoUsers();
      if (!currentUser) {
        // Auto-login with first demo user
        loginUser("aliko.dangote@dangotecement.com");
      }
      setIsInitialized(true);
    }
  }, [isInitialized, currentUser, initializeDemoUsers, loginUser]);

  const handleLogout = () => {
    logoutUser();
    logout();
    router.push("/login");
  };

  const handleSwitchUser = (email: string) => {
    loginUser(email);
    setUserMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  if (!currentUser) {
    return (
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              GT
            </div>
            <span className="font-bold text-lg text-neutral-900 hidden sm:inline">
              GTBank <span className="text-primary">GAPS</span>
            </span>
          </Link>
          <div className="text-neutral-500">Loading...</div>
        </div>
      </nav>
    );
  }

  const roleColor = rbacUtils.getRoleBadgeColor(currentUser.role);
  const roleColorClasses = {
    blue: "bg-blue-100 text-blue-800",
    orange: "bg-orange-100 text-orange-800",
    gray: "bg-gray-100 text-gray-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <>
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition"
            >
              <Menu size={20} className="text-neutral-700" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                GT
              </div>
              <span className="font-bold text-lg text-neutral-900 hidden sm:inline">
                GTBank <span className="text-primary">GAPS</span>
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Pending Approvals Button - Only for APPROVER */}
            {currentUser.role === "APPROVER" && (
              <button
                onClick={() => setShowPendingApprovals(true)}
                className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition group"
              >
                <CheckCircle2 size={20} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell */}
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition",
                  profileDropdownOpen
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white",
                    roleColor === "blue" && "bg-blue-500",
                    roleColor === "orange" && "bg-orange-500",
                    roleColor === "gray" && "bg-gray-500",
                    roleColor === "purple" && "bg-purple-500"
                  )}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left block">
                  <p className="text-xs font-semibold text-neutral-900 truncate w-24">
                    {currentUser.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        roleColorClasses[roleColor]
                      )}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform",
                    profileDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
                  {/* Current User Info */}
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-xs text-neutral-500">Current User</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {currentUser.email}
                    </p>
                    <div className="mt-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full inline-block",
                          roleColorClasses[roleColor]
                        )}
                      >
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Switch User */}
                  <div className="px-4 py-2 border-b border-neutral-200">
                    <p className="text-xs font-medium text-neutral-700 mb-2">
                      Switch User (Demo)
                    </p>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-neutral-700 hover:bg-neutral-50 rounded transition text-xs"
                    >
                      <span>Select User</span>
                      <LogIn size={14} />
                    </button>
                    {userMenuOpen && (
                      <div className="mt-2 space-y-1">
                        {[
                          "aliko.dangote@dangotecement.com",
                          "zainab.hassan@dangotecement.com",
                          "seun.adebayo@dangotecement.com",
                        ].map((email) => (
                          <button
                            key={email}
                            onClick={() => handleSwitchUser(email)}
                            className={cn(
                              "w-full text-left px-3 py-2 text-xs rounded transition",
                              currentUser.email === email
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-neutral-600 hover:bg-neutral-100"
                            )}
                          >
                            {email
                              .split("@")[0]
                              .replace(".", " ")
                              .toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition border-b border-neutral-100"
                  >
                    <User size={16} />
                    <span className="text-sm">Profile Settings</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition border-b border-neutral-100"
                  >
                    <Settings size={16} />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-red-50 transition"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-neutral-200 p-4 space-y-3 bg-neutral-50">
            <Link
              href="/settings/profile"
              className="flex items-center gap-3 p-3 text-neutral-700 hover:bg-white rounded-lg transition"
            >
              <User size={18} />
              <span>Profile Settings</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 p-3 text-neutral-700 hover:bg-white rounded-lg transition"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-error hover:bg-white rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <div className="hidden md:block md:w-64">
          <Sidebar isOpen={true} />
        </div>
        <div className="md:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Pending Approvals Modal */}
      <PendingApprovalsModal
        isOpen={showPendingApprovals}
        onClose={() => setShowPendingApprovals(false)}
      />
    </>
  );
};
