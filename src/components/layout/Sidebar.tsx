"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const iconMap: Record<string, any> = {
  BarChart3: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.BarChart3 }))
  ),
  Wallet: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Wallet }))
  ),
  ArrowRightLeft: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.ArrowRightLeft }))
  ),
  Send: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Send }))
  ),
  Users: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Users }))
  ),
  Bell: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Bell }))
  ),
  FileText: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.FileText }))
  ),
  Shield: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Shield }))
  ),
  ClipboardList: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.ClipboardList }))
  ),
  Globe: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Globe }))
  ),
  CreditCard: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.CreditCard }))
  ),
  TrendingUp: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.TrendingUp }))
  ),
  Zap: dynamic(() => import("lucide-react").then((m) => ({ default: m.Zap }))),
  Package: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Package }))
  ),
  Smartphone: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Smartphone }))
  ),
  Settings: dynamic(() =>
    import("lucide-react").then((m) => ({ default: m.Settings }))
  ),
};

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  submenu?: Array<{
    id: string;
    label: string;
    href: string;
  }>;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName]?.default || iconMap[iconName];
    return IconComponent ? (
      <IconComponent size={18} className="flex-shrink-0" />
    ) : (
      <div className="w-4 h-4 flex-shrink-0" />
    );
  };

  const isSubmenuActive = (submenu: SidebarItem["submenu"]) => {
    if (!submenu) return false;
    return submenu.some((item) => pathname === item.href);
  };

  return (
    <>
      {/* Mobile overlay - only shown on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:static left-0 top-16 md:top-0 h-[calc(100vh-64px)] md:h-full w-64 bg-white border-r border-neutral-200 overflow-y-auto transition-all z-40 md:z-auto",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item: SidebarItem) => {
            const isActive = pathname === item.href;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const submenuActive = isSubmenuActive(item.submenu);
            const isExpanded = expandedItems.includes(item.id);

            if (hasSubmenu) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                      submenuActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary pl-3"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {getIcon(item.icon)}
                    <span className="flex-1 text-left">{item.label}</span>
                    <span
                      className={cn(
                        "transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 10 10 14 14 10"></polyline>
                      </svg>
                    </span>
                  </button>

                  {/* Submenu */}
                  {isExpanded && (
                    <div className="mt-1 ml-4 border-l border-neutral-200 space-y-0">
                      {item.submenu?.map((subitem) => {
                        const isSubActive = pathname === subitem.href;
                        return (
                          <Link
                            key={subitem.id}
                            href={subitem.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm pl-3",
                              isSubActive
                                ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                          >
                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                            <span>{subitem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary pl-3"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                {getIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
