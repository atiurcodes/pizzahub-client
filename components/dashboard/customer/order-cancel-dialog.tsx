"use client"

import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

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
import { cancelCustomerOrder } from "@/services/customer.service"
import type { CustomerOrder } from "@/types"

interface OrderCancelDialogProps {
  order: CustomerOrder | null
  isOpen: boolean
  onClose: () => void
  onCancelled: (orderId: string) => void
}

export function OrderCancelDialog({
  order,
  isOpen,
  onClose,
  onCancelled,
}: OrderCancelDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false)

  if (!order) return null

  async function handleConfirmCancel() {
    if (!order) return
    setIsCancelling(true)

    try {
      const res = await cancelCustomerOrder(order._id)
      if (res.success) {
        toast.add({
          title: "Order Cancelled",
          description: `Your order for "${order.itemName}" has been cancelled.`,
          type: "success",
        })
        onCancelled(order._id)
        onClose()
      }
    } catch (err) {
      toast.add({
        title: "Cancellation Failed",
        description: err instanceof Error ? err.message : "Failed to cancel order.",
        type: "error",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-destructive">
            <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-5" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              Cancel Pizza Order
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to cancel your order for <strong>{order.itemName}</strong> scheduled for delivery on <strong>{order.deliveryDate}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Pizzeria:</span>
            <span className="font-medium text-foreground">{order.vendorName}</span>
          </div>
          <div className="flex justify-between">
            <span>Order Total:</span>
            <span className="font-bold text-primary">${Number(order.totalPrice).toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-1">
            Note: Once cancelled, the restaurant will be notified and will not prepare this pizza.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isCancelling}
            className="w-full sm:w-auto rounded-xl text-xs font-semibold"
          >
            Keep Order
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmCancel}
            disabled={isCancelling}
            className="w-full sm:w-auto rounded-xl text-xs font-semibold"
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Yes, Cancel Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
