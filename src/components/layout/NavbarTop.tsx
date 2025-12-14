"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Bell, Settings, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRBACStore } from "@/store/rbacStore";
import { cn } from "@/lib/utils";
import { rbacUtils } from "@/lib/rbacUtils";

export const NavbarTop = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { logout } = useAuthStore();
  const { currentUser, logoutUser } = useRBACStore();
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    logout();
    router.push("/login");
  };

  if (!currentUser) {
    return (
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div className="text-neutral-500">Loading...</div>
        </div>
      </nav>
    );
  }

  const roleColor = rbacUtils.getRoleBadgeColor(currentUser.role);
  const roleColorClasses = {
    blue: "bg-[#E15C42] text-white font-semibold rounded-[5px]",
    orange: "bg-[#E15C42] text-white font-semibold rounded-[5px]",
    gray: "bg-[#E15C42] text-white font-semibold rounded-[5px]",
    purple: "bg-[#E15C42] text-white font-semibold rounded-[5px]",
  };

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* Left Side - Logo and Menu */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onMenuClick}
            className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/gtco.png"
              alt="GT Bank"
              className="h-10 w-auto flex-shrink-0"
            />
            <span className="font-bold text-lg text-neutral-900 hidden sm:inline">
              Dangote Cement PLC <span className="text-primary"></span>
            </span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
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
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 inline-block mt-0.5",
                    roleColorClasses[roleColor]
                  )}
                >
                  {currentUser.role}
                </span>
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
                        "text-xs px-2 py-0.5 inline-block",
                        roleColorClasses[roleColor]
                      )}
                    >
                      {currentUser.role}
                    </span>
                  </div>
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
        </div>
      </div>
    </nav>
  );
};
