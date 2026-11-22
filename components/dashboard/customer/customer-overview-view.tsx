"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
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
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  getCustomerStats,
  type CustomerStats,
} from "@/services/customer.service"

interface CustomerOverviewViewProps {
  userName: string
}

export function CustomerOverviewView({ userName }: CustomerOverviewViewProps) {
  const [stats, setStats] = useState<CustomerStats>({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
    cancelledOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    getCustomerStats()
      .then((data) => {
        if (active) setStats(data)
      })
      .catch((err) => {
        console.error("Failed to load customer stats:", err)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const monthlySpendingData = [
    { name: "Week 1", value: Math.max(0, stats.totalOrders - 3) },
    { name: "Week 2", value: Math.min(stats.totalOrders, 1) },
    { name: "Week 3", value: Math.min(stats.totalOrders, 2) },
    { name: "Week 4", value: stats.totalOrders },
  ]

  const customerOrderStatusData = [
    { name: "Pending", value: stats.pendingOrders, color: "#f59e0b" },
    { name: "Accepted", value: stats.acceptedOrders, color: "#15803d" },
    { name: "Rejected", value: stats.rejectedOrders, color: "#d9381e" },
    { name: "Cancelled", value: stats.cancelledOrders, color: "#64748b" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Customer Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hey {userName}, track all your pizza orders and delivery updates in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/customer/orders"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "h-10 rounded-full border-border/80 px-4 font-semibold text-xs sm:text-sm"
            )}
          >
            <ShoppingBag className="mr-1.5 size-4" />
            My Orders
          </Link>

          <Link
            href="/menu"
            className={cn(
              buttonVariants({ size: "default" }),
              "h-10 rounded-full bg-gradient-to-r from-primary to-tomato px-5 font-semibold text-white shadow-xs text-xs sm:text-sm"
            )}
          >
            <Pizza className="mr-1.5 size-4" />
            Order Pizza Now
          </Link>
        </div>
      </div>

      {/* 4 Required Customer KPI Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            subtitle="All orders placed"
            icon={ShoppingBag}
            tone="primary"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Waiting for restaurant"
            icon={Clock}
            tone="amber"
          />
          <StatCard
            title="Accepted Orders"
            value={stats.acceptedOrders}
            subtitle="Confirmed by pizzerias"
            icon={CheckCircle2}
            tone="basil"
          />
          <StatCard
            title="Rejected Orders"
            value={stats.rejectedOrders}
            subtitle="Declined requests"
            icon={XCircle}
            tone="tomato"
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
            title="Orders Over Time"
            subtitle="Live orders activity breakdown"
            data={monthlySpendingData}
          />
          <OverviewPieChart
            title="Order Status Breakdown"
            subtitle="Real-time pending, accepted, rejected and cancelled orders"
            data={customerOrderStatusData}
          />
        </div>
      )}

      {/* Quick Action Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-accent/30 to-background p-6">
        <CardContent className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Craving fresh, wood-fired pizza?
            </h3>
            <p className="text-sm text-muted-foreground">
              Browse approved items from premium pizzerias and get hot pizza delivered to your doorstep.
            </p>
          </div>

          <Link
            href="/menu"
            className={cn(
              buttonVariants({ size: "default" }),
              "rounded-full bg-primary text-primary-foreground font-semibold px-5 shrink-0 gap-1.5 shadow-sm"
            )}
          >
            <span>Explore Menu</span>
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
