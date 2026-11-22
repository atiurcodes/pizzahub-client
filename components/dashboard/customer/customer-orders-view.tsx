"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Pizza,
  RotateCcw,
  Search,
  ShoppingBag,
  Store,
  XCircle,
} from "lucide-react"

import { OrderCancelDialog } from "@/components/dashboard/customer/order-cancel-dialog"
import { OrderDetailsDialog } from "@/components/dashboard/customer/order-details-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getCustomerOrders } from "@/services/customer.service"
import type { CustomerOrder } from "@/types"

interface CustomerOrdersViewProps {
  initialOrders?: CustomerOrder[]
}

export function CustomerOrdersView({
  initialOrders = [],
}: CustomerOrdersViewProps = {}) {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders)
  const [isLoading, setIsLoading] = useState(initialOrders.length === 0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  // Modals state
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<CustomerOrder | null>(null)
  const [selectedOrderForCancel, setSelectedOrderForCancel] =
    useState<CustomerOrder | null>(null)

  useEffect(() => {
    let active = true

    getCustomerOrders()
      .then((data) => {
        if (active) setOrders(data)
      })
      .catch((err) => {
        console.error("Failed to load customer orders:", err)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const data = await getCustomerOrders()
      setOrders(data)
    } catch (err) {
      console.error("Failed to load customer orders:", err)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  function handleOrderCancelled(orderId: string) {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
    )
  }

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesSearch =
      search.trim() === "" ||
      order.itemName.toLowerCase().includes(search.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(search.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // Status counts for tabs
  const pendingCount = orders.filter((o) => o.status === "pending").length
  const acceptedCount = orders.filter((o) => o.status === "accepted").length
  const rejectedCount = orders.filter((o) => o.status === "rejected").length
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Pizza Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Track real-time baking and delivery status, view timeline receipts, or cancel pending requests.
          </p>
        </div>

        <Link
          href="/menu"
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "rounded-full font-bold text-xs bg-gradient-to-r from-primary to-tomato shadow-md shadow-primary/20 gap-1.5"
          )}
        >
          <Pizza className="size-3.5" />
          <span>Browse Pizza Menu</span>
        </Link>
      </div>

      {/* 2. Filter & Status Pills Toolbar */}
      <Card className="border-border/70 bg-card/60">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by pizza, restaurant, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl text-xs sm:text-sm bg-background border-border/70"
              />
            </div>

            {/* Refresh Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-10 text-xs font-semibold rounded-xl gap-1.5 text-muted-foreground hover:text-foreground shrink-0 w-full sm:w-auto"
            >
              <RotateCcw className={cn("size-3.5", isRefreshing && "animate-spin text-primary")} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh Orders"}</span>
            </Button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-border/50 scrollbar-none">
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={cn(
                "h-8 rounded-full text-xs font-semibold shrink-0 gap-1.5",
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
              )}
            >
              All Orders
              <span className="text-[10px] font-bold opacity-80">({orders.length})</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              className={cn(
                "h-8 rounded-full text-xs font-semibold shrink-0 gap-1.5",
                statusFilter === "pending"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs border-amber-400"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
              )}
            >
              Pending
              <span className="text-[10px] font-bold opacity-80">({pendingCount})</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={statusFilter === "accepted" ? "default" : "outline"}
              onClick={() => setStatusFilter("accepted")}
              className={cn(
                "h-8 rounded-full text-xs font-semibold shrink-0 gap-1.5",
                statusFilter === "accepted"
                  ? "bg-emerald-600 text-white font-bold shadow-xs border-emerald-500"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
              )}
            >
              Accepted
              <span className="text-[10px] font-bold opacity-80">({acceptedCount})</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={statusFilter === "rejected" ? "default" : "outline"}
              onClick={() => setStatusFilter("rejected")}
              className={cn(
                "h-8 rounded-full text-xs font-semibold shrink-0 gap-1.5",
                statusFilter === "rejected"
                  ? "bg-destructive text-destructive-foreground font-bold shadow-xs"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
              )}
            >
              Rejected
              <span className="text-[10px] font-bold opacity-80">({rejectedCount})</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={statusFilter === "cancelled" ? "default" : "outline"}
              onClick={() => setStatusFilter("cancelled")}
              className={cn(
                "h-8 rounded-full text-xs font-semibold shrink-0 gap-1.5",
                statusFilter === "cancelled"
                  ? "bg-secondary text-secondary-foreground font-bold shadow-xs"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
              )}
            >
              Cancelled
              <span className="text-[10px] font-bold opacity-80">({cancelledCount})</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Orders Grid / List */}
      {isLoading || isRefreshing ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="border-border/60 p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Skeleton className="size-20 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 w-full">
                  <Skeleton className="h-5 w-1/3 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                  <Skeleton className="h-3 w-1/4 rounded-md" />
                </div>
                <Skeleton className="h-9 w-28 rounded-xl shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-5 max-w-md mx-auto">
          <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-xs">
            <ShoppingBag className="size-10" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-heading text-xl font-bold text-foreground">
              {orders.length === 0
                ? "No Orders Placed Yet"
                : "No Orders Match Filter"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {orders.length === 0
                ? "You haven't ordered any pizzas yet. Browse our verified restaurants to find hot and fresh pizzas delivered straight to your door!"
                : "Try selecting a different status filter or clearing your search term."}
            </p>
          </div>

          {orders.length === 0 ? (
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "rounded-full font-bold text-xs bg-gradient-to-r from-primary to-tomato shadow-md shadow-primary/20"
              )}
            >
              Explore Menu Now
            </Link>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStatusFilter("all")
                setSearch("")
              }}
              className="rounded-full text-xs font-semibold"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const thumbnail =
              order.itemImage ||
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"

            const isPending = order.status === "pending"
            const isAccepted = order.status === "accepted"
            const isRejected = order.status === "rejected"
            const isCancelled = order.status === "cancelled"

            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"

            return (
              <Card
                key={order._id}
                className="border-border/70 bg-card hover:border-primary/40 transition-all duration-200 overflow-hidden shadow-xs"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Item Thumbnail & Basic Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnail}
                        alt={order.itemName}
                        className="size-20 rounded-2xl object-cover shrink-0 border border-border/60 bg-muted"
                      />

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] px-2 py-0 border-border/80 text-muted-foreground">
                            {order.category}
                          </Badge>

                          {/* Status Badge */}
                          {isPending && (
                            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="size-3" />
                              Pending Approval
                            </Badge>
                          )}
                          {isAccepted && (
                            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="size-3" />
                              Accepted & Baking
                            </Badge>
                          )}
                          {isRejected && (
                            <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <XCircle className="size-3" />
                              Rejected
                            </Badge>
                          )}
                          {isCancelled && (
                            <Badge variant="secondary" className="font-semibold text-[11px] px-2.5 py-0.5 rounded-full">
                              Cancelled
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-heading font-extrabold text-base text-foreground truncate">
                          {order.itemName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 truncate">
                            <Store className="size-3 text-primary shrink-0" />
                            <strong className="text-foreground">{order.vendorName}</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3 text-primary shrink-0" />
                            Delivery: <strong className="text-foreground">{order.deliveryDate}</strong>
                          </span>
                          <span>•</span>
                          <span>Ordered on: {formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate pt-0.5">
                          <MapPin className="size-3 text-muted-foreground shrink-0" />
                          <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50 gap-3">
                      <div className="text-left lg:text-right">
                        <span className="font-heading font-extrabold text-xl text-primary">
                          ${Number(order.totalPrice).toFixed(2)}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {order.quantity} {order.quantity === 1 ? "pizza" : "pizzas"} • Cash/Card on Delivery
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Details Button with Timeline Modal */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrderForDetails(order)}
                          className="h-9 rounded-xl text-xs font-semibold gap-1.5"
                        >
                          <Eye className="size-3.5" />
                          <span>View Timeline</span>
                        </Button>

                        {/* Cancel Button: Enabled ONLY for pending orders per AGENTS.md rule */}
                        {isPending && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedOrderForCancel(order)}
                            className="h-9 rounded-xl text-xs font-semibold"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Details & Status Timeline Modal */}
      <OrderDetailsDialog
        order={selectedOrderForDetails}
        isOpen={Boolean(selectedOrderForDetails)}
        onClose={() => setSelectedOrderForDetails(null)}
      />

      {/* Cancel Confirmation Modal */}
      <OrderCancelDialog
        order={selectedOrderForCancel}
        isOpen={Boolean(selectedOrderForCancel)}
        onClose={() => setSelectedOrderForCancel(null)}
        onCancelled={handleOrderCancelled}
      />
    </div>
  )
}
