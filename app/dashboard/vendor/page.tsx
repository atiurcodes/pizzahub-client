import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  PlusCircle,
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
const vendorStats = {
  totalMenuItems: 3,
  activeMenuItems: 2,
  pendingOrders: 4,
  acceptedOrders: 19,
  rejectedOrders: 2,
}

const weeklyOrdersData = [
  { name: "Mon", value: 3 },
  { name: "Tue", value: 5 },
  { name: "Wed", value: 4 },
  { name: "Thu", value: 6 },
  { name: "Fri", value: 9 },
  { name: "Sat", value: 11 },
  { name: "Sun", value: 8 },
]

const vendorOrderStatusData = [
  { name: "Pending", value: vendorStats.pendingOrders, color: "#f59e0b" },
  { name: "Accepted", value: vendorStats.acceptedOrders, color: "#15803d" },
  { name: "Rejected", value: vendorStats.rejectedOrders, color: "#d9381e" },
]

export default async function VendorOverviewPage() {
  const user = await requireRole("vendor")
  const isPremium = user.subscriptionPlan === "premium"

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Vendor Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage {user.businessName || "your pizza shop"} menu items, incoming
            orders, and subscription.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/vendor/add-item"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 rounded-full bg-gradient-to-r from-primary to-tomato px-5 font-semibold"
            )}
          >
            <PlusCircle className="mr-1.5 size-4" />
            Add Menu Item
          </Link>

          {!isPremium && (
            <Link
              href="/dashboard/vendor/subscription"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 rounded-full px-5 font-semibold"
              )}
            >
              <Crown className="mr-1.5 size-4 text-amber-500" />
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>

      {/* 5 Required Vendor KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Menu Items"
          value={vendorStats.totalMenuItems}
          subtitle="All submitted items"
          icon={UtensilsCrossed}
          tone="primary"
        />
        <StatCard
          title="Active Menu Items"
          value={
            isPremium
              ? vendorStats.activeMenuItems
              : `${vendorStats.activeMenuItems} / 3`
          }
          subtitle={isPremium ? "Unlimited active items" : "Free plan limit: 3"}
          icon={Flame}
          tone="basil"
        />
        <StatCard
          title="Pending Orders"
          value={vendorStats.pendingOrders}
          subtitle="Needs your action"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          title="Accepted Orders"
          value={vendorStats.acceptedOrders}
          subtitle="Confirmed deliveries"
          icon={CheckCircle2}
          tone="basil"
        />
        <StatCard
          title="Subscription Plan"
          value={isPremium ? "Premium" : "Free"}
          subtitle={isPremium ? "Featured badge active" : "Upgrade for unlimited"}
          icon={Crown}
          tone={isPremium ? "amber" : "tomato"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OverviewBarChart
          title="Weekly Customer Orders"
          subtitle="Sample overview data — connect to Express vendor API"
          data={weeklyOrdersData}
        />
        <OverviewPieChart
          title="Order Status Breakdown"
          subtitle="Pending, accepted, and rejected orders"
          data={vendorOrderStatusData}
        />
      </div>
    </div>
  )
}
