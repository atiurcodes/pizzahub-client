"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Crown,
  Heart,
  Info,
  MapPin,
  Pizza,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types"

interface ItemDetailsViewProps {
  item: MenuItem
  currentUser?: {
    id: string
    name: string
    email: string
    role?: string
  } | null
}

export function ItemDetailsView({ item, currentUser }: ItemDetailsViewProps) {
  const images =
    item.images && item.images.length > 0
      ? item.images
      : ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"]

  const [activeImage, setActiveImage] = useState(images[0])
  const [isFavorite, setIsFavorite] = useState(false)

  const isOwner = currentUser?.email === item.vendorEmail
  const isAdmin = currentUser?.role === "admin"
  const isVendor = currentUser?.role === "vendor"
  const isCustomer = currentUser?.role === "customer" || (!isOwner && !isAdmin && !isVendor)

  const vendorName = item.vendor?.businessName || item.vendor?.name || "Local Pizza Shop"
  const isPremiumVendor = Boolean(item.vendor?.isPremium)

  function handleOrderClick() {
    toast.add({
      title: "Ready for Order Flow!",
      description: "Pizza details are confirmed. Next, we will connect the customer ordering form.",
      type: "info",
    })
  }

  function toggleFavorite() {
    setIsFavorite(!isFavorite)
    toast.add({
      title: !isFavorite ? "Added to favorites!" : "Removed from favorites",
      description: `${item.itemName} has been ${!isFavorite ? "saved to your wishlist" : "removed"}.`,
      type: "success",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl space-y-8">
      {/* 1. Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/menu"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 text-muted-foreground hover:text-foreground -ml-2 rounded-full"
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Back to Menu</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-primary transition-colors">
            Menu
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground truncate max-w-[200px]">
            {item.itemName}
          </span>
        </div>
      </div>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={item.itemName}
              className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
            />

            {/* Category Tag */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-background/95 text-foreground backdrop-blur-md shadow-xs text-xs font-semibold px-3 py-1 border-border/80 rounded-full">
                {item.category}
              </Badge>
            </div>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={toggleFavorite}
              aria-label="Add to favorites"
              className="absolute top-3 right-3 size-9 rounded-full bg-background/90 text-foreground backdrop-blur-md flex items-center justify-center hover:bg-background transition-all shadow-sm group"
            >
              <Heart
                className={cn(
                  "size-4.5 transition-colors",
                  isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
            </button>

            {/* Premium Vendor Badge on Image if applicable */}
            {isPremiumVendor && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 font-bold text-xs shadow-md backdrop-blur-sm border border-amber-300">
                  <Crown className="size-3.5 fill-current" />
                  Premium Vendor Item
                </span>
              </div>
            )}
          </div>

          {/* Multiple Images Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                    activeImage === imgUrl
                      ? "border-primary ring-2 ring-primary/30 scale-102"
                      : "border-border/60 hover:border-primary/50 opacity-80 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${item.itemName} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/40 border border-border/40">
              <Pizza className="size-5 text-primary mb-1" />
              <span className="text-xs font-semibold text-foreground">Hand-Tossed</span>
              <span className="text-[11px] text-muted-foreground">Fresh Dough</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/40 border border-border/40">
              <Clock className="size-5 text-primary mb-1" />
              <span className="text-xs font-semibold text-foreground">30-45 Mins</span>
              <span className="text-[11px] text-muted-foreground">Bake & Deliver</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/40 border border-border/40">
              <Truck className="size-5 text-primary mb-1" />
              <span className="text-xs font-semibold text-foreground">Hot Delivery</span>
              <span className="text-[11px] text-muted-foreground">Direct from oven</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Vendor Info & Order CTA (7 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full"
              >
                {item.category}
              </Badge>
              {item.status === "approved" ? (
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"
                >
                  <CheckCircle2 className="size-3" />
                  Available for Delivery
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {item.status}
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {item.itemName}
            </h1>

            {/* Price & Location Bar */}
            <div className="flex flex-wrap items-baseline gap-4 pt-1">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-primary">
                ${Number(item.price).toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">
                Taxes and restaurant preparation included
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <MapPin className="size-4 text-primary shrink-0" />
              <span>Available in: <strong className="text-foreground font-medium">{item.location}</strong></span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 border-t border-border/60 pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Description & Ingredients
            </h3>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Vendor Showcase Card */}
          <Card className="border-border/70 bg-card/60 shadow-xs overflow-hidden">
            <CardContent className="p-4 sm:p-5 flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Store className="size-6" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-heading font-bold text-base text-foreground truncate">
                    {vendorName}
                  </h4>
                  {isPremiumVendor ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-[11px] shadow-xs">
                      <Sparkles className="size-3" />
                      Premium Partner
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Verified Local Vendor
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground truncate">
                  {item.vendorEmail}
                </p>

                {isPremiumVendor && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium pt-1 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    Priority Kitchen with Verified Fast Preparation
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Action Section with Strict Role Permission Checks */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 space-y-4">
            {/* Condition A: Item Owner (Vendor) cannot order their own items */}
            {isOwner ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Info className="size-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      This is your menu item
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      Platform rules prevent vendors from ordering their own items. You can view or update this item from your vendor dashboard.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/vendor/menu"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full rounded-xl text-xs font-semibold"
                  )}
                >
                  Manage My Menu Items
                </Link>
              </div>
            ) : isAdmin ? (
              /* Condition B: Admin cannot place customer orders */
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Admin Moderation Mode
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      You are signed in with an Administrator account. Admins moderate menu items and transactions, but cannot place customer orders.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/admin/menu"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full rounded-xl text-xs font-semibold"
                  )}
                >
                  Review in Admin Dashboard
                </Link>
              </div>
            ) : isVendor ? (
              /* Condition C: Other vendor trying to order */
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Info className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Vendor Account Detected
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      You are signed in as a restaurant Vendor. To order delicious pizza, please browse with a Customer account.
                    </p>
                  </div>
                </div>
              </div>
            ) : isCustomer ? (
              /* Condition D: Eligible Customer Ordering Block */
              <div className="space-y-3">
                <div>
                  <h4 className="font-heading font-bold text-lg text-foreground">
                    Order Hot & Fresh
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Orders are baked fresh by <strong>{vendorName}</strong>. Specify your delivery address and date on checkout.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    size="lg"
                    onClick={handleOrderClick}
                    className="flex-1 rounded-xl bg-gradient-to-r from-primary to-tomato font-bold text-sm shadow-md shadow-primary/20 hover:opacity-95"
                  >
                    <Pizza className="size-4 mr-2" />
                    Order Now (${Number(item.price).toFixed(2)})
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground text-center sm:text-left">
                  Cash or Card upon delivery. No upfront payment required for customer orders.
                </p>
              </div>
            ) : (
              /* Condition E: Guest fallback */
              <div className="space-y-3">
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground">
                    Sign in to order this pizza
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please sign in with your customer account to place an order.
                  </p>
                </div>
                <Link
                  href={`/sign-in?callbackUrl=/menu/${item._id}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full rounded-xl font-bold text-sm"
                  )}
                >
                  Sign In to Order
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
