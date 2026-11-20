"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Edit,
  Loader2,
  MapPin,
  Pizza,
  PlusCircle,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { deleteMenuItem, getMyMenuItems, type MenuItem } from "@/services/api"

export function VendorMenuList() {
  // আইটেম স্টেট
  const [items, setItems] = useState<MenuItem[]>([])

  // ডিলিট মোডাল ও লোডিং স্টেট
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // পেজ লোড হলে ব্যাকএন্ড থেকে আইটেমগুলো নিয়ে আসা
  useEffect(() => {
    getMyMenuItems()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Error loading menu items:", err)
      })
  }, [])

  // ডিলিট কনফার্ম হ্যান্ডলার
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      await deleteMenuItem(itemToDelete._id)

      // UI থেকে তাৎক্ষণিক আইটেমটি রিমুভ করা
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id))

      toast.add({
        title: "Item Deleted",
        description: `"${itemToDelete.itemName}" has been deleted successfully.`,
        type: "success",
      })

      setItemToDelete(null)
    } catch (err) {
      toast.add({
        title: "Delete Failed",
        description:
          err instanceof Error ? err.message : "Failed to delete item.",
        type: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

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
    <>
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

            {/* ডেসক্রিপশন, তারিখ ও অ্যাকশন বাটনসমূহ */}
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

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5">
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

                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setItemToDelete(item)}
                    className="h-6 text-[11px] border-destructive/30 text-destructive hover:bg-destructive/10 gap-1 px-2 font-medium"
                  >
                    <Trash2 className="size-3" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ShadCN Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setItemToDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Delete Menu Item?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground font-semibold">
                &ldquo;{itemToDelete?.itemName}&rdquo;
              </strong>
              ? This item will be permanently removed from your menu and cannot be recovered.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setItemToDelete(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="text-xs font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Yes, Delete Item</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
