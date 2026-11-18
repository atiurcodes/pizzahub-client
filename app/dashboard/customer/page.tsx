import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Pizza,
  ShoppingBag,
  XCircle,
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
const customerStats = {
  totalOrders: 12,
  pendingOrders: 2,
  acceptedOrders: 9,
  rejectedOrders: 1,
}

const monthlySpendingData = [
  { name: "Jan", value: 2 },
  { name: "Feb", value: 1 },
  { name: "Mar", value: 3 },
  { name: "Apr", value: 2 },
  { name: "May", value: 2 },
  { name: "Jun", value: 2 },
]

const customerOrderStatusData = [
  { name: "Pending", value: customerStats.pendingOrders, color: "#f59e0b" },
  { name: "Accepted", value: customerStats.acceptedOrders, color: "#15803d" },
  { name: "Rejected", value: customerStats.rejectedOrders, color: "#d9381e" },
]

export default async function CustomerOverviewPage() {
  const user = await requireRole("customer")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Customer Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hey {user.name}, track all your pizza orders and delivery updates in
            one place.
          </p>
        </div>

        <Link
          href="/menu"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 rounded-full bg-gradient-to-r from-primary to-tomato px-5 font-semibold"
          )}
        >
          <Pizza className="mr-1.5 size-4" />
          Order Pizza Now
        </Link>
      </div>

      {/* 4 Required Customer KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={customerStats.totalOrders}
          subtitle="All orders placed"
          icon={ShoppingBag}
          tone="primary"
        />
        <StatCard
          title="Pending Orders"
          value={customerStats.pendingOrders}
          subtitle="Waiting for restaurant"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          title="Accepted Orders"
          value={customerStats.acceptedOrders}
          subtitle="Confirmed by pizzerias"
          icon={CheckCircle2}
          tone="basil"
        />
        <StatCard
          title="Rejected Orders"
          value={customerStats.rejectedOrders}
          subtitle="Declined requests"
          icon={XCircle}
          tone="tomato"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OverviewBarChart
          title="Orders Over Time"
          subtitle="Sample overview data — connect to Express customer API"
          data={monthlySpendingData}
        />
        <OverviewPieChart
          title="Order Status Breakdown"
          subtitle="Pending, accepted, and rejected orders"
          data={customerOrderStatusData}
        />
      </div>
    </div>
  )
}
