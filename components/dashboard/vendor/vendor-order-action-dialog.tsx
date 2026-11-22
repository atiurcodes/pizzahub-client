"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Clock, Loader2, MapPin, Pizza, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { updateVendorOrderStatus } from "@/services/vendor.service"
import type { CustomerOrder } from "@/types"

interface VendorOrderActionDialogProps {
  order: CustomerOrder | null
  action: "accepted" | "rejected" | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (orderId: string, newStatus: "accepted" | "rejected") => void
}

export function VendorOrderActionDialog({
  order,
  action,
  isOpen,
  onClose,
  onSuccess,
}: VendorOrderActionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!order || !action) return null

  const isAccept = action === "accepted"

  async function handleConfirm() {
    if (!order || !action) return
    setIsSubmitting(true)

    try {
      const res = await updateVendorOrderStatus(order._id, action)
      if (res.success) {
        toast.add({
          title: isAccept ? "Order Accepted" : "Order Declined",
          description: isAccept
            ? `Order for "${order.itemName}" is now confirmed. The kitchen can start baking!`
            : `Order for "${order.itemName}" has been declined.`,
          type: "success",
        })
        onSuccess(order._id, action)
        onClose()
      }
    } catch (err) {
      toast.add({
        title: "Action Failed",
        description:
          err instanceof Error ? err.message : "Failed to update order status.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <div
              className={`flex size-9 items-center justify-center rounded-full ${
                isAccept
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {isAccept ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
            </div>
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              {isAccept ? "Accept Customer Order" : "Decline Customer Order"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {isAccept
              ? `Are you sure you want to accept this order for ${order.customerName}? Once accepted, the customer will be notified to expect delivery.`
              : `Are you sure you want to decline this order for ${order.customerName}? Per platform rules, this action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        {/* Order Preview Card */}
        <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-foreground border-b border-border/50 pb-2">
            <span className="flex items-center gap-1.5 truncate">
              <Pizza className="size-3.5 text-primary shrink-0" />
              {order.itemName} (x{order.quantity})
            </span>
            <span className="text-primary font-bold">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="space-y-1 text-muted-foreground text-[11px]">
            <p className="flex items-center gap-1.5">
              <User className="size-3 shrink-0" />
              <span>Customer:</span>
              <strong className="text-foreground font-medium">
                {order.customerName} ({order.customerEmail})
              </strong>
            </p>
            <p className="flex items-center gap-1.5">
              <Clock className="size-3 shrink-0" />
              <span>Delivery Date:</span>
              <strong className="text-foreground font-medium">
                {order.deliveryDate}
              </strong>
            </p>
            <p className="flex items-center gap-1.5 truncate">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{order.deliveryAddress}</span>
            </p>
            {order.message && (
              <p className="pt-1 italic text-muted-foreground border-t border-border/40">
                &quot;{order.message}&quot;
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full text-xs font-semibold px-4"
          >
            Go Back
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`rounded-full text-xs font-bold px-5 text-white shadow-xs ${
              isAccept
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-destructive hover:bg-destructive/90"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Updating...
              </>
            ) : isAccept ? (
              "Confirm & Accept"
            ) : (
              "Confirm & Decline"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
