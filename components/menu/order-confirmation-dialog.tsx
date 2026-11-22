"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  Minus,
  Pizza,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { createCustomerOrder } from "@/services/customer.service"
import type { CustomerOrder, MenuItem } from "@/types"

interface OrderConfirmationDialogProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  onOrderSuccess?: (order: CustomerOrder) => void
}

export function OrderConfirmationDialog({
  item,
  isOpen,
  onClose,
  onOrderSuccess,
}: OrderConfirmationDialogProps) {
  // Default delivery date to today's date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0]

  const [quantity, setQuantity] = useState(1)
  const [deliveryDate, setDeliveryDate] = useState(todayStr)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [message, setMessage] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [placedOrder, setPlacedOrder] = useState<CustomerOrder | null>(null)

  const thumbnail =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"

  const vendorName = item.vendor?.businessName || item.vendor?.name || "Local Pizza Shop"
  const unitPrice = Number(item.price)
  const totalPrice = Number((unitPrice * quantity).toFixed(2))

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => Math.max(1, Math.min(20, prev + delta)))
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage("")

    if (!deliveryDate) {
      setErrorMessage("Please select a delivery date.")
      return
    }

    if (deliveryDate < todayStr) {
      setErrorMessage("Delivery date cannot be in the past.")
      return
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setErrorMessage("Please enter a complete delivery address (at least 5 characters).")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await createCustomerOrder({
        itemId: item._id,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        message: message.trim(),
        quantity,
      })

      if (res.success) {
        setPlacedOrder(res.order)
        toast.add({
          title: "Order Placed Successfully! 🍕",
          description: `Your order for "${item.itemName}" has been sent to ${vendorName}.`,
          type: "success",
        })
        onOrderSuccess?.(res.order)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to place order."
      setErrorMessage(msg)
      toast.add({
        title: "Order Failed",
        description: msg,
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleResetAndClose() {
    setPlacedOrder(null)
    setErrorMessage("")
    setQuantity(1)
    setDeliveryDate(todayStr)
    setDeliveryAddress("")
    setMessage("")
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleResetAndClose()
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 gap-5">
        {/* State A: Order Confirmation Success Screen */}
        {placedOrder ? (
          <div className="py-4 text-center space-y-5">
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading text-2xl font-extrabold text-foreground">
                Order Received!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Thank you! Your order for <strong>{placedOrder.itemName}</strong> has been submitted to <strong>{placedOrder.vendorName}</strong>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Order Status:</span>
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold uppercase text-[10px]">
                  {placedOrder.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity & Item:</span>
                <span className="font-medium text-foreground">{placedOrder.quantity}x {placedOrder.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Price:</span>
                <span className="font-bold text-primary text-sm">${Number(placedOrder.totalPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Date:</span>
                <span className="font-medium text-foreground">{placedOrder.deliveryDate}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Address:</span>
                <span className="font-medium text-foreground text-right truncate">{placedOrder.deliveryAddress}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/60">
                <span className="text-muted-foreground">Payment:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Cash / Card on Delivery</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/dashboard/customer"
                onClick={handleResetAndClose}
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "w-full rounded-xl font-bold bg-gradient-to-r from-primary to-tomato shadow-md shadow-primary/20"
                )}
              >
                Track in My Orders
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="w-full rounded-xl"
              >
                Back to Pizza Details
              </Button>
            </div>
          </div>
        ) : (
          /* State B: Order Submission Form */
          <>
            <DialogHeader className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Pizza className="size-4" />
                </div>
                <DialogTitle className="font-heading text-xl font-bold text-foreground">
                  Confirm Pizza Order
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Baking fresh by <strong>{vendorName}</strong>. Fill in your delivery details below.
              </DialogDescription>
            </DialogHeader>

            {/* Error Message Box */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Pizza Mini Summary Card */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-border/70 bg-card/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail}
                  alt={item.itemName}
                  className="size-16 rounded-xl object-cover shrink-0 border border-border/50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary">
                      {item.category}
                    </Badge>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-foreground truncate mt-0.5">
                    {item.itemName}
                  </h4>
                  <p className="text-xs font-semibold text-primary">
                    ${unitPrice.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-muted/60 border border-border/60 rounded-xl p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || isSubmitting}
                    className="size-6 rounded-lg bg-background text-foreground flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-xs text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 20 || isSubmitting}
                    className="size-6 rounded-lg bg-background text-foreground flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>

              {/* Form Input 1: Delivery Date */}
              <div className="space-y-1.5">
                <Label htmlFor="deliveryDate" className="text-xs font-semibold flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  <span>Delivery Date <span className="text-destructive">*</span></span>
                </Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  min={todayStr}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-10 text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Select when you want this pizza delivered (today or future date).
                </p>
              </div>

              {/* Form Input 2: Delivery Address */}
              <div className="space-y-1.5">
                <Label htmlFor="deliveryAddress" className="text-xs font-semibold flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" />
                  <span>Delivery Address <span className="text-destructive">*</span></span>
                </Label>
                <Textarea
                  id="deliveryAddress"
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Street address, flat / apartment number, area, city..."
                  required
                  className="text-xs rounded-xl bg-background resize-none"
                />
              </div>

              {/* Form Input 3: Special Instructions */}
              <div className="space-y-1.5">
                <Label htmlFor="orderMessage" className="text-xs font-semibold flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-muted-foreground" />
                  <span>Additional Message / Special Instructions (Optional)</span>
                </Label>
                <Textarea
                  id="orderMessage"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g., Extra crispy crust, please ring the doorbell upon arrival..."
                  className="text-xs rounded-xl bg-background resize-none"
                />
              </div>

              {/* Price Breakdown & Delivery Notice */}
              <div className="rounded-xl bg-muted/40 border border-border/60 p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({quantity} {quantity > 1 ? "pizzas" : "pizza"}):</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="size-3 text-primary" />
                    Delivery:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free Delivery</span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-border/60 font-bold">
                  <span className="text-foreground">Total Due:</span>
                  <span className="text-base text-primary font-heading font-extrabold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Pay upon arrival via Cash or Card. No online prepayment required.</span>
                </div>
              </div>

              {/* Dialog Actions */}
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetAndClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-xl text-xs font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-primary to-tomato font-bold text-xs shadow-md shadow-primary/20 hover:opacity-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Pizza className="mr-1.5 size-3.5" />
                      Confirm & Place Order (${totalPrice.toFixed(2)})
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
