"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NavbarTop } from "@/components/layout/NavbarTop";
import { Sidebar } from "@/components/layout/Sidebar";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { NotificationContainer } from "@/components/NotificationContainer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <html lang="en">
      <body className="bg-neutral-50">
        <QueryClientProvider>
          {isLoginPage ? (
            children
          ) : (
            <div className="flex flex-col min-h-screen">
              <NavbarTop onMenuClick={toggleSidebar} />
              <div className="flex flex-1 overflow-hidden">
                {/* Desktop and Mobile Sidebar */}
                {mounted && sidebarOpen && (
                  <div className="w-64 bg-white border-r border-neutral-200 overflow-y-auto">
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                  </div>
                )}
                {/* Mobile overlay when sidebar is open */}
                {mounted && sidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={closeSidebar}
                  />
                )}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          )}
          <NotificationContainer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
