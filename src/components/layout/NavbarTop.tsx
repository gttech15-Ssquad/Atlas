"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Bell, Settings, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export const NavbarTop = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
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
              GTBank <span className="text-primary">GAPS</span>
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
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                {user?.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-neutral-900 truncate w-24">
                  {user?.name}
                </p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
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
