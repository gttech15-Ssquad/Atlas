"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardBody, SummaryCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { SpendingChart } from "@/components/charts/SpendingChart";
import {
  CreditCard,
  Users,
  TrendingUp,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { mockDashboardData, mockChartData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: "Account Balance",
      value: formatCurrency(mockDashboardData.totalBalance),
      icon: <TrendingUp className="text-primary" size={24} />,
      trend: "up" as const,
      trendLabel: "+2.5% from last month",
    },
    {
      title: "Virtual Cards",
      value: mockDashboardData.cardCount,
      icon: <CreditCard className="text-info" size={24} />,
      trend: null,
      trendLabel: `${mockDashboardData.activeCards} Active`,
    },
    {
      title: "Monthly Spending",
      value: formatCurrency(mockDashboardData.monthlySpend),
      icon: <ArrowUpRight className="text-warning" size={24} />,
      trend: "up" as const,
      trendLabel: `${Math.round((mockDashboardData.monthlySpend / mockDashboardData.monthlyLimit) * 100)}% of limit`,
    },
    {
      title: "Team Members",
      value: "12",
      icon: <Users className="text-success" size={24} />,
      trend: null,
      trendLabel: "4 pending approvals",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-neutral-600">
          {user?.role === "CEO" &&
            "You have full system access and approval authority."}
          {user?.role === "CFO" &&
            "You have financial oversight and approval authority."}
          {user?.role === "Admin" &&
            "Manage users, roles, and system settings."}
          {user?.role === "DepartmentHead" &&
            "You can submit initial approvals."}
          {user?.role === "Auditor" &&
            "You have read-only access to audit logs."}
        </p>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {mockDashboardData.alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type as any}
            title={alert.message}
            message={new Date(alert.timestamp).toLocaleString()}
          />
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <SummaryCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendLabel={stat.trendLabel}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className="lg:col-span-2">
          <SpendingChart data={mockChartData} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">
              Quick Actions
            </h3>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <Link href="/virtual-cards/create">
              <Button variant="primary" size="md" className="w-full">
                <Plus size={18} className="mr-2" />
                Create Card
              </Button>
            </Link>
            <Link href="/payments">
              <Button variant="outline" size="md" className="w-full">
                Make Payment
              </Button>
            </Link>
            <Link href="/virtual-cards">
              <Button variant="outline" size="md" className="w-full">
                View All Cards
              </Button>
            </Link>
            <Link href="/subscriptions">
              <Button variant="outline" size="md" className="w-full">
                Manage Subscriptions
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Recent Transactions and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                Recent Transactions
              </h3>
              <Link href="/transactions">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody className="space-y-0">
            <div className="divide-y divide-neutral-200">
              {mockDashboardData.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-neutral-50 px-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {tx.description}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-neutral-900">
                      {formatCurrency(tx.amount)}
                    </p>
                    <Badge variant="success">{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">
              System Status
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {[
              { name: "API Status", status: "operational" },
              { name: "Database", status: "operational" },
              { name: "Payment Gateway", status: "operational" },
              { name: "2FA Service", status: "operational" },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between pb-4 border-b border-neutral-200 last:border-0 last:pb-0"
              >
                <span className="text-sm font-medium text-neutral-700">
                  {service.name}
                </span>
                <Badge variant="success">
                  {service.status === "operational" ? "Operational" : "Error"}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
