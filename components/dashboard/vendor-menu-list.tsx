"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Edit, MapPin, Pizza, PlusCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMyMenuItems, type MenuItem } from "@/services/api"

export function VendorMenuList() {
  // শুধুমাত্র ১টি সহজ স্টেট — আইটেমের তালিকা রাখার জন্য
  const [items, setItems] = useState<MenuItem[]>([])

  // পেজ লোড হলে ব্যাকএন্ড থেকে আইটেমগুলো নিয়ে আসা
  useEffect(() => {
    getMyMenuItems()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Error loading menu items:", err)
      })
  }, [])

  // ১. কোনো আইটেম না থাকলে সহজ এমপ্টি মেসেজ
  if (items.length === 0) {
    return (
      <Card className="text-center p-12 border-dashed border-border/80">
        <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
          <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Pizza className="size-7" />
          </div>
          <h3 className="font-heading text-lg font-bold">No Menu Items Yet</h3>
          <p className="text-xs text-muted-foreground">
            You haven&apos;t added any pizza or dishes yet. Add your first item to start receiving orders.
          </p>
          <Link
            href="/dashboard/vendor/add-item"
            className={buttonVariants({
              size: "sm",
              className: "bg-primary text-primary-foreground font-semibold text-xs mt-2",
            })}
          >
            <PlusCircle className="size-4 mr-1.5" />
            <span>Add New Item</span>
          </Link>
        </div>
      </Card>
    )
  }

  // ২. আইটেম থাকলে সিম্পল কার্ড গ্রিডে দেখানো
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item._id}
          className="overflow-hidden border-border/60 hover:border-primary/40 transition-colors shadow-xs"
        >
          {/* পিৎজার ছবি ও প্রাইস */}
          <div className="relative aspect-4/3 w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                item.images?.[0] ||
                "https://images.unsplash.com/photo-1513104890138-7c749659a591"
              }
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 text-[11px] font-medium bg-black/70 text-white px-2 py-0.5 rounded-full">
              {item.category}
            </span>
            <span className="absolute bottom-2 right-2 text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-md">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>

          {/* নাম, স্ট্যাটাস ও লোকেশন */}
          <CardHeader className="p-4 pb-2 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-bold line-clamp-1">
                {item.itemName}
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-[11px] capitalize shrink-0 ${
                  item.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : item.status === "rejected"
                    ? "bg-destructive/10 text-destructive border-destructive/30"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                }`}
              >
                {item.status}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 text-primary shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          </CardHeader>

          {/* ডেসক্রিপশন ও তারিখ */}
          <CardContent className="p-4 pt-1 space-y-2">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>
            <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "Recent"}
                </span>
              </span>

              {/* Edit Item Link */}
              <Link
                href={`/dashboard/vendor/menu-items/${item._id}/edit`}
                className={buttonVariants({
                  variant: "outline",
                  size: "xs",
                  className:
                    "h-6 text-[11px] border-primary/30 text-primary hover:bg-primary/10 gap-1 px-2 font-medium",
                })}
              >
                <Edit className="size-3" />
                <span>Edit</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
