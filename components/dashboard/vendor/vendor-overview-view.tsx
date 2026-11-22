"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  PlusCircle,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react"

import {
  OverviewBarChart,
  OverviewPieChart,
} from "@/components/dashboard/overview-charts"
import { StatCard } from "@/components/dashboard/stat-card"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardUser } from "@/lib/auth-guard"
import { cn } from "@/lib/utils"
import { getVendorStats } from "@/services/vendor.service"
import type { VendorStats } from "@/types"

interface VendorOverviewViewProps {
  user: DashboardUser
}

export function VendorOverviewView({ user }: VendorOverviewViewProps) {
  const isPremium = user.subscriptionPlan === "premium"

  const [stats, setStats] = useState<VendorStats>({
    totalMenuItems: 0,
    activeMenuItems: 0,
    pendingMenuItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    getVendorStats()
      .then((data) => {
        if (active) setStats(data)
      })
      .catch((err) => {
        console.error("Failed to load vendor stats:", err)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const weeklyOrdersData = [
    { name: "Total Orders", value: stats.totalOrders },
    { name: "Pending", value: stats.pendingOrders },
    { name: "Accepted", value: stats.acceptedOrders },
    { name: "Declined", value: stats.rejectedOrders },
  ]

  const vendorOrderStatusData = [
    { name: "Pending", value: stats.pendingOrders, color: "#f59e0b" },
    { name: "Accepted", value: stats.acceptedOrders, color: "#15803d" },
    { name: "Declined", value: stats.rejectedOrders, color: "#d9381e" },
    { name: "Cancelled", value: stats.cancelledOrders, color: "#64748b" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Vendor Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage {user.businessName || "your pizza shop"} menu items, incoming orders, and subscription.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/vendor/orders"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "h-10 rounded-full border-border/80 px-4 font-semibold text-xs sm:text-sm"
            )}
          >
            <ShoppingBag className="mr-1.5 size-4 text-primary" />
            Customer Orders ({isLoading ? "..." : stats.pendingOrders})
          </Link>

          <Link
            href="/dashboard/vendor/add-item"
            className={cn(
              buttonVariants({ size: "default" }),
              "h-10 rounded-full bg-gradient-to-r from-primary to-tomato px-5 font-semibold text-white shadow-xs text-xs sm:text-sm"
            )}
          >
            <PlusCircle className="mr-1.5 size-4" />
            Add Menu Item
          </Link>

          {!isPremium && (
            <Link
              href="/dashboard/vendor/subscription"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "h-10 rounded-full px-5 font-semibold text-xs sm:text-sm border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              )}
            >
              <Crown className="mr-1.5 size-4 text-amber-500" />
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>

      {/* 5 Required Vendor KPI Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border/70 p-5">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Menu Items"
            value={stats.totalMenuItems}
            subtitle="All submitted items"
            icon={UtensilsCrossed}
            tone="primary"
          />
          <StatCard
            title="Active Menu Items"
            value={isPremium ? stats.activeMenuItems : `${stats.activeMenuItems} / 3`}
            subtitle={isPremium ? "Unlimited active items" : "Free plan limit: 3"}
            icon={Flame}
            tone="basil"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Needs your action"
            icon={Clock}
            tone="amber"
          />
          <StatCard
            title="Accepted Orders"
            value={stats.acceptedOrders}
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
      )}

      {/* Charts Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-border/70 p-6">
            <Skeleton className="h-6 w-36 mb-2 rounded-md" />
            <Skeleton className="h-4 w-52 mb-6 rounded-md" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </Card>
          <Card className="border-border/70 p-6">
            <Skeleton className="h-6 w-36 mb-2 rounded-md" />
            <Skeleton className="h-4 w-52 mb-6 rounded-md" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OverviewBarChart
            title="Orders Activity"
            subtitle="Real-time order requests and status volume"
            data={weeklyOrdersData}
          />
          <OverviewPieChart
            title="Order Status Breakdown"
            subtitle="Pending, accepted, declined, and cancelled orders"
            data={vendorOrderStatusData}
          />
        </div>
      )}
    </div>
  )
}
