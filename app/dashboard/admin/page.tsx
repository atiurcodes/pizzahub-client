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
import { requireRole } from "@/lib/auth-guard"
import { cn } from "@/lib/utils"

// Sample starter stats (replace with your Express API call later)
const adminStats = {
  totalUsers: 148,
  totalVendors: 24,
  totalCustomers: 123,
  totalMenuItems: 96,
  pendingMenuItems: 7,
  totalTransactions: 18,
}

const monthlyOrdersData = [
  { name: "Jan", value: 42 },
  { name: "Feb", value: 58 },
  { name: "Mar", value: 71 },
  { name: "Apr", value: 84 },
  { name: "May", value: 95 },
  { name: "Jun", value: 112 },
]

const usersBreakdownData = [
  { name: "Customers", value: adminStats.totalCustomers, color: "#ea580c" },
  { name: "Vendors", value: adminStats.totalVendors, color: "#15803d" },
  { name: "Admins", value: 1, color: "#f59e0b" },
]

export default async function AdminOverviewPage() {
  const user = await requireRole("admin")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform summary for {user.name} — monitor users, menu approvals,
            and subscriptions.
          </p>
        </div>

        <Link
          href="/dashboard/admin/menu-items"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 rounded-full bg-gradient-to-r from-primary to-tomato px-5 font-semibold"
          )}
        >
          Review Pending Items ({adminStats.pendingMenuItems})
        </Link>
      </div>

      {/* 6 Required Admin KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Registered Users"
          value={adminStats.totalUsers}
          subtitle="All active platform accounts"
          icon={Users}
          tone="primary"
        />
        <StatCard
          title="Total Vendors"
          value={adminStats.totalVendors}
          subtitle="Local pizza shops"
          icon={Store}
          tone="basil"
        />
        <StatCard
          title="Total Customers"
          value={adminStats.totalCustomers}
          subtitle="Registered pizza lovers"
          icon={UserCheck}
          tone="amber"
        />
        <StatCard
          title="Total Menu Items"
          value={adminStats.totalMenuItems}
          subtitle="Across all restaurants"
          icon={UtensilsCrossed}
          tone="primary"
        />
        <StatCard
          title="Pending Menu Items"
          value={adminStats.pendingMenuItems}
          subtitle="Waiting for admin approval"
          icon={Clock}
          tone="tomato"
        />
        <StatCard
          title="Total Transactions"
          value={adminStats.totalTransactions}
          subtitle="Verified Stripe subscriptions"
          icon={CreditCard}
          tone="basil"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OverviewBarChart
          title="Monthly Platform Orders"
          subtitle="Sample overview data — connect to Express analytics API"
          data={monthlyOrdersData}
        />
        <OverviewPieChart
          title="Registered Users by Role"
          subtitle="Distribution across customers, vendors, and admins"
          data={usersBreakdownData}
        />
      </div>
    </div>
  )
}
