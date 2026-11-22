"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Pizza,
  RotateCcw,
  Search,
  ShoppingBag,
  Store,
  User,
  XCircle,
} from "lucide-react"

import { VendorOrderActionDialog } from "@/components/dashboard/vendor/vendor-order-action-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getVendorOrders } from "@/services/vendor.service"
import type { CustomerOrder } from "@/types"

export function VendorOrdersView() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  // Action Dialog State
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)
  const [actionType, setActionType] = useState<"accepted" | "rejected" | null>(
    null
  )

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getVendorOrders()
      setOrders(data)
    } catch (err) {
      console.error("Failed to load vendor customer orders:", err)
    }
  }, [])

  useEffect(() => {
    let active = true

    getVendorOrders()
      .then((data) => {
        if (active) setOrders(data)
      })
      .catch((err) => {
        console.error("Failed to load vendor orders on mount:", err)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchOrders()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleActionSuccess = (
    orderId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
      )
    )
  }

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesSearch =
      search.trim() === "" ||
      order.itemName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
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
            Customer Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Review incoming pizza delivery orders from hungry customers and accept or decline requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="rounded-full h-9 text-xs font-semibold gap-1.5 border-border/80"
          >
            <RotateCcw
              className={cn("size-3.5", isRefreshing && "animate-spin text-primary")}
            />
            <span>Refresh</span>
          </Button>

          <Link
            href="/dashboard/vendor/menu-items"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full h-9 text-xs font-semibold gap-1.5 border-border/80"
            )}
          >
            <Store className="size-3.5" />
            <span>My Menu Items</span>
          </Link>
        </div>
      </div>

      {/* 2. Filters & Status Tabs */}
      <Card className="border-border/70 bg-card/60">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by pizza, customer, email, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-full border-border/70 bg-background text-xs sm:text-sm shadow-xs"
              />
            </div>

            {/* Quick summary pill */}
            <div className="text-xs font-medium text-muted-foreground self-start sm:self-auto">
              Showing <span className="font-bold text-foreground">{filteredOrders.length}</span> of{" "}
              <span className="font-bold text-foreground">{orders.length}</span> total orders
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-border/50">
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={cn(
                "h-8 rounded-full text-xs font-semibold shrink-0 gap-1.5",
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
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
                  ? "bg-amber-500 text-white font-bold shadow-xs hover:bg-amber-600"
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
                  ? "bg-emerald-600 text-white font-bold shadow-xs hover:bg-emerald-700"
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
              Declined
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
              Cancelled by Customer
              <span className="text-[10px] font-bold opacity-80">({cancelledCount})</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Orders List Table & Cards */}
      {isLoading || isRefreshing ? (
        <Card className="border-border/70 p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border/50"
            >
              <Skeleton className="size-16 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 w-full">
                <Skeleton className="h-5 w-1/3 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
                <Skeleton className="h-3 w-1/4 rounded-md" />
              </div>
              <Skeleton className="h-9 w-32 rounded-xl shrink-0" />
            </div>
          ))}
        </Card>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 space-y-4 max-w-md mx-auto">
          <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-xs">
            <ShoppingBag className="size-10" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-heading text-xl font-bold text-foreground">
              {orders.length === 0
                ? "No Customer Orders Yet"
                : "No Orders Match Filter"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {orders.length === 0
                ? "When customers place delivery orders for your pizza menu items, they will appear here for you to accept or decline."
                : "Try selecting a different status filter or clearing your search term."}
            </p>
          </div>

          {search && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("")
                setStatusFilter("all")
              }}
              className="rounded-full text-xs font-semibold"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/70 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-bold text-xs">Pizza Item</TableHead>
                  <TableHead className="font-bold text-xs">Customer</TableHead>
                  <TableHead className="font-bold text-xs">Delivery Info</TableHead>
                  <TableHead className="font-bold text-xs">Total Amount</TableHead>
                  <TableHead className="font-bold text-xs">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    {/* Item */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 rounded-xl overflow-hidden bg-muted/60 shrink-0 border border-border/60">
                          {order.itemImage ? (
                            <Image
                              src={order.itemImage}
                              alt={order.itemName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-primary/40">
                              <Pizza className="size-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-sm text-foreground line-clamp-1">
                            {order.itemName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {order.category}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Qty: <strong className="text-foreground">{order.quantity}</strong> × ${order.unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                          <User className="size-3 text-primary shrink-0" />
                          <span>{order.customerName}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>

                    {/* Delivery Info */}
                    <TableCell className="py-4">
                      <div className="space-y-1 max-w-xs text-xs">
                        <p className="flex items-center gap-1.5 font-medium text-foreground">
                          <Calendar className="size-3 text-primary shrink-0" />
                          <span>{order.deliveryDate}</span>
                        </p>
                        <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground line-clamp-2">
                          <MapPin className="size-3 text-muted-foreground shrink-0 mt-0.5" />
                          <span>{order.deliveryAddress}</span>
                        </p>
                        {order.message && (
                          <p className="text-[10px] italic text-primary/90 bg-primary/5 px-2 py-0.5 rounded-md inline-block">
                            Note: {order.message}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Total Amount */}
                    <TableCell className="py-4">
                      <div className="font-heading font-extrabold text-sm text-primary">
                        ${order.totalPrice.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-4">
                      {order.status === "pending" && (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-[11px] px-2.5 py-0.5">
                          <Clock className="size-3 mr-1" />
                          Pending Review
                        </Badge>
                      )}
                      {order.status === "accepted" && (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[11px] px-2.5 py-0.5">
                          <CheckCircle2 className="size-3 mr-1" />
                          Accepted
                        </Badge>
                      )}
                      {order.status === "rejected" && (
                        <Badge className="bg-destructive/15 text-destructive border border-destructive/30 font-bold text-[11px] px-2.5 py-0.5">
                          <XCircle className="size-3 mr-1" />
                          Declined
                        </Badge>
                      )}
                      {order.status === "cancelled" && (
                        <Badge variant="outline" className="text-muted-foreground border-border/80 font-bold text-[11px] px-2.5 py-0.5">
                          <AlertCircle className="size-3 mr-1" />
                          Cancelled by Customer
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 text-right pr-6">
                      {order.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order)
                              setActionType("accepted")
                            }}
                            className="h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Accept</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order)
                              setActionType("rejected")
                            }}
                            className="h-8 rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 font-bold text-xs px-3 gap-1"
                          >
                            <XCircle className="size-3.5" />
                            <span>Decline</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Action completed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile / Tablet Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredOrders.map((order) => (
              <Card
                key={order._id}
                className="border-border/80 bg-card p-4 space-y-4 shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative size-16 rounded-xl overflow-hidden bg-muted/60 shrink-0 border border-border/60">
                    {order.itemImage ? (
                      <Image
                        src={order.itemImage}
                        alt={order.itemName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-primary/40">
                        <Pizza className="size-7" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-foreground truncate">
                        {order.itemName}
                      </h4>
                      <span className="font-heading font-extrabold text-sm text-primary shrink-0">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      {order.category} • Qty: <strong className="text-foreground">{order.quantity}</strong>
                    </p>

                    <div>
                      {order.status === "pending" && (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px] px-2 py-0">
                          Pending Review
                        </Badge>
                      )}
                      {order.status === "accepted" && (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[10px] px-2 py-0">
                          Accepted
                        </Badge>
                      )}
                      {order.status === "rejected" && (
                        <Badge className="bg-destructive/15 text-destructive border border-destructive/30 font-bold text-[10px] px-2 py-0">
                          Declined
                        </Badge>
                      )}
                      {order.status === "cancelled" && (
                        <Badge variant="outline" className="text-muted-foreground border-border/80 font-bold text-[10px] px-2 py-0">
                          Cancelled
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery and Customer Info */}
                <div className="rounded-xl bg-muted/40 p-3 space-y-1.5 text-xs text-muted-foreground border border-border/50">
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    <User className="size-3 text-primary shrink-0" />
                    <span>{order.customerName} ({order.customerEmail})</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3 text-primary shrink-0" />
                    <span>Deliver on: <strong className="text-foreground">{order.deliveryDate}</strong></span>
                  </p>
                  <p className="flex items-start gap-1.5 text-[11px]">
                    <MapPin className="size-3 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.deliveryAddress}</span>
                  </p>
                  {order.message && (
                    <p className="text-[10px] italic text-primary/90 bg-primary/5 p-1.5 rounded-md">
                      &quot;{order.message}&quot;
                    </p>
                  )}
                </div>

                {/* Action Buttons for Mobile */}
                {order.status === "pending" ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order)
                        setActionType("accepted")
                      }}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Accept</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order)
                        setActionType("rejected")
                      }}
                      className="rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 font-bold text-xs gap-1"
                    >
                      <XCircle className="size-3.5" />
                      <span>Decline</span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-1 text-xs text-muted-foreground italic border-t border-border/40">
                    Order finalized as {order.status}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 4. Action Confirmation Dialog */}
      <VendorOrderActionDialog
        order={selectedOrder}
        action={actionType}
        isOpen={Boolean(selectedOrder && actionType)}
        onClose={() => {
          setSelectedOrder(null)
          setActionType(null)
        }}
        onSuccess={handleActionSuccess}
      />
    </div>
  )
}
