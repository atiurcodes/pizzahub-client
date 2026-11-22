"use client"

import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Pizza,
  Store,
  Truck,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { CustomerOrder } from "@/types"

interface OrderDetailsDialogProps {
  order: CustomerOrder | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
}: OrderDetailsDialogProps) {
  if (!order) return null

  const thumbnail =
    order.itemImage ||
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"

  const isPending = order.status === "pending"
  const isAccepted = order.status === "accepted"
  const isRejected = order.status === "rejected"
  const isCancelled = order.status === "cancelled"

  const formattedCreated = order.createdAt
    ? new Date(order.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 gap-5">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Pizza className="size-4" />
              </div>
              <DialogTitle className="font-heading text-lg font-bold text-foreground">
                Order Details & Status
              </DialogTitle>
            </div>

            {/* Status Badge */}
            {isPending && (
              <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs capitalize">
                Pending Approval
              </Badge>
            )}
            {isAccepted && (
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs capitalize">
                Accepted & Baking
              </Badge>
            )}
            {isRejected && (
              <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive font-bold text-xs capitalize">
                Rejected by Restaurant
              </Badge>
            )}
            {isCancelled && (
              <Badge variant="secondary" className="font-bold text-xs capitalize">
                Cancelled
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Order ID: <span className="font-mono text-foreground font-medium">{order._id}</span> • Placed on {formattedCreated}
          </DialogDescription>
        </DialogHeader>

        {/* ==================================================== */}
        {/* OPTIONAL FEATURE: Order Status Timeline */}
        {/* ==================================================== */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Order Status Timeline
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {/* Step 1: Placed */}
            <div className="relative">
              <span className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                <CheckCircle2 className="size-3.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">1. Order Placed</p>
                <p className="text-[11px] text-muted-foreground">
                  Order successfully transmitted to {order.vendorName}.
                </p>
              </div>
            </div>

            {/* Step 2: Restaurant Review */}
            <div className="relative">
              <span
                className={cn(
                  "absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full shadow-xs",
                  isPending
                    ? "bg-amber-500 text-white animate-pulse"
                    : isAccepted
                    ? "bg-emerald-500 text-white"
                    : isRejected
                    ? "bg-destructive text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isPending && <Clock className="size-3.5" />}
                {isAccepted && <CheckCircle2 className="size-3.5" />}
                {isRejected && <XCircle className="size-3.5" />}
                {isCancelled && <XCircle className="size-3.5" />}
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">
                  2. Pizzeria Review & Kitchen
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isPending && "The restaurant has received your order and is reviewing it."}
                  {isAccepted && "Confirmed by restaurant! Dough hand-tossed and baking in oven."}
                  {isRejected && "The pizzeria was unable to accept this order at this time."}
                  {isCancelled && "Order was cancelled before kitchen preparation."}
                </p>
              </div>
            </div>

            {/* Step 3: Dispatch & Delivery */}
            <div className="relative">
              <span
                className={cn(
                  "absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full shadow-xs",
                  isAccepted
                    ? "bg-emerald-500 text-white animate-pulse"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Truck className="size-3" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">
                  3. Delivery to Your Address
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isAccepted
                    ? `Scheduled for hot delivery on ${order.deliveryDate}.`
                    : isPending
                    ? `Dispatches on ${order.deliveryDate} once confirmed.`
                    : "Order will not be delivered."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Item & Pricing Summary */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-3.5 pb-3 border-b border-border/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={order.itemName}
              className="size-16 rounded-xl object-cover shrink-0 border border-border/50"
            />
            <div className="flex-1 min-w-0">
              <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary">
                {order.category}
              </Badge>
              <h4 className="font-heading font-bold text-sm text-foreground truncate mt-0.5">
                {order.itemName}
              </h4>
              <p className="text-xs text-muted-foreground">
                Quantity: <strong className="text-foreground">{order.quantity}</strong> • ${Number(order.unitPrice).toFixed(2)} each
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-heading font-extrabold text-base text-primary">
                ${Number(order.totalPrice).toFixed(2)}
              </span>
              <p className="text-[10px] text-muted-foreground">Total Due</p>
            </div>
          </div>

          {/* Restaurant & Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Store className="size-3 text-primary" /> Pizzeria
              </span>
              <p className="font-semibold text-foreground">{order.vendorName}</p>
              <p className="text-[11px] text-muted-foreground">{order.vendorEmail}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3 text-primary" /> Delivery Date
              </span>
              <p className="font-semibold text-foreground">{order.deliveryDate}</p>
            </div>
          </div>

          <div className="space-y-1 text-xs pt-2 border-t border-border/60">
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3 text-primary" /> Delivery Address
            </span>
            <p className="font-medium text-foreground">{order.deliveryAddress}</p>
          </div>

          {order.message && (
            <div className="space-y-1 text-xs pt-2 border-t border-border/60">
              <span className="text-muted-foreground flex items-center gap-1">
                <MessageSquare className="size-3 text-muted-foreground" /> Special Instructions
              </span>
              <p className="text-foreground italic">{order.message}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl text-xs font-semibold"
          >
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
