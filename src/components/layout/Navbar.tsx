"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
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
    </>
  );
};
