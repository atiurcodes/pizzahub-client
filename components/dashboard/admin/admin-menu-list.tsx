"use client"

import { useEffect, useState } from "react"
import { Loader2, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import {
  getAdminMenuItems,
  updateAdminMenuItemStatus,
} from "@/services/admin.service"
import type { MenuItem } from "@/types"
import { AdminDeleteMenuDialog } from "./admin-delete-menu-dialog"

export function AdminMenuList() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Selected item for delete dialog
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)

  // 1. Fetch all menu items from server
  useEffect(() => {
    getAdminMenuItems()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error("Failed to load menu items:", err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // 2. Handle Status Edit (Approve / Reject)
  const handleStatusChange = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    setUpdatingId(id)
    try {
      await updateAdminMenuItemStatus(id, newStatus)

      // UI তে তাৎক্ষণিক স্ট্যাটাস আপডেট করা
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      )

      toast.add({
        title: "Status Updated",
        description: `Item marked as ${newStatus}.`,
        type: "success",
      })
    } catch (err) {
      toast.add({
        title: "Update Failed",
        description:
          err instanceof Error ? err.message : "Failed to update status.",
        type: "error",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-2">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading menu items...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-sm text-muted-foreground">No menu items found.</p>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border/60 overflow-hidden shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-16">Item</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const isUpdating = updatingId === item._id

                return (
                  <TableRow key={item._id}>
                    {/* Image */}
                    <TableCell>
                      <div className="size-12 rounded-md bg-muted overflow-hidden relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            item.images?.[0] ||
                            "https://images.unsplash.com/photo-1513104890138-7c749659a591"
                          }
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell className="font-medium text-sm">
                      {item.itemName}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-xs text-muted-foreground">
                      {item.category}
                    </TableCell>

                    {/* Vendor Email */}
                    <TableCell className="text-xs text-muted-foreground">
                      {item.vendorEmail}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="text-sm font-semibold">
                      ${Number(item.price).toFixed(2)}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs ${
                          item.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : item.status === "rejected"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* Action Buttons: Approve, Reject, Delete */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          disabled={isUpdating || item.status === "approved"}
                          onClick={() => handleStatusChange(item._id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {isUpdating && <Loader2 className="size-3 animate-spin mr-1" />}
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating || item.status === "rejected"}
                          onClick={() => handleStatusChange(item._id, "rejected")}
                          className="text-destructive border-destructive/40 hover:bg-destructive/10"
                        >
                          {isUpdating && <Loader2 className="size-3 animate-spin mr-1" />}
                          Reject
                        </Button>

                        {/* Delete Button (Triggers ShadCN Dialog) */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setItemToDelete(item)}
                          className="text-destructive hover:bg-destructive/10 h-7 px-2"
                          title="Delete Item"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Admin Delete Confirmation Dialog */}
      <AdminDeleteMenuDialog
        item={itemToDelete}
        onClose={() => setItemToDelete(null)}
        onDeleted={(deletedId) =>
          setItems((prev) => prev.filter((i) => i._id !== deletedId))
        }
      />
    </>
  )
}
