"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Clock,
  CreditCard,
  Store,
  UserCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react"

import {
  OverviewBarChart,
  OverviewPieChart,
} from "@/components/dashboard/overview-charts"
import { StatCard } from "@/components/dashboard/stat-card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAdminStats, type AdminStats } from "@/services/admin.service"

// Sample monthly trend data for chart
const monthlyOrdersData = [
  { name: "Jan", value: 42 },
  { name: "Feb", value: 58 },
  { name: "Mar", value: 71 },
  { name: "Apr", value: 84 },
  { name: "May", value: 95 },
  { name: "Jun", value: 112 },
]

export function AdminOverviewView({
  userName,
}: {
  userName: string
}) {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    pendingMenuItems: 0,
    approvedMenuItems: 0,
    totalTransactions: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real-time statistics on mount
  useEffect(() => {
    getAdminStats()
      .then((data) => {
        setStats(data)
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Live Pie Chart breakdown
  const adminCount = Math.max(
    0,
    stats.totalUsers - stats.totalVendors - stats.totalCustomers
  )

  const usersBreakdownData = [
    { name: "Customers", value: stats.totalCustomers, color: "#ea580c" },
    { name: "Vendors", value: stats.totalVendors, color: "#15803d" },
    { name: "Admins", value: adminCount || 1, color: "#f59e0b" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform summary for {userName} — live counts of users, menu approvals, and subscriptions.
          </p>
        </div>

        <Link
          href="/dashboard/admin/menu-items"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 rounded-full bg-gradient-to-r from-primary to-tomato px-5 font-semibold text-white shadow-xs"
          )}
        >
          Review Pending Items ({isLoading ? "..." : stats.pendingMenuItems})
        </Link>
      </div>

      {/* 6 Required Live KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Registered Users"
          value={isLoading ? "..." : stats.totalUsers}
          subtitle="All active platform accounts"
          icon={Users}
          tone="primary"
        />
        <StatCard
          title="Total Vendors"
          value={isLoading ? "..." : stats.totalVendors}
          subtitle="Registered pizza shops"
          icon={Store}
          tone="basil"
        />
        <StatCard
          title="Total Customers"
          value={isLoading ? "..." : stats.totalCustomers}
          subtitle="Registered pizza lovers"
          icon={UserCheck}
          tone="amber"
        />
        <StatCard
          title="Total Menu Items"
          value={isLoading ? "..." : stats.totalMenuItems}
          subtitle="Across all restaurants"
          icon={UtensilsCrossed}
          tone="primary"
        />
        <StatCard
          title="Pending Menu Items"
          value={isLoading ? "..." : stats.pendingMenuItems}
          subtitle="Waiting for admin approval"
          icon={Clock}
          tone="tomato"
        />
        <StatCard
          title="Total Transactions"
          value={isLoading ? "..." : stats.totalTransactions}
          subtitle="Verified Stripe subscriptions"
          icon={CreditCard}
          tone="basil"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OverviewBarChart
          title="Monthly Platform Orders"
          subtitle="Platform order volume trend"
          data={monthlyOrdersData}
        />
        <OverviewPieChart
          title="Registered Users by Role"
          subtitle="Live distribution of customers, vendors, and admins"
          data={usersBreakdownData}
        />
      </div>
    </div>
  )
}
