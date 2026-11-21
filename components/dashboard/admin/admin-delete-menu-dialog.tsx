"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

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
import { deleteAdminMenuItem } from "@/services/admin.service"
import type { MenuItem } from "@/types"

interface AdminDeleteMenuDialogProps {
  item: MenuItem | null
  onClose: () => void
  onDeleted: (itemId: string) => void
}

/**
 * Isolated Delete Confirmation Dialog for Admin Menu Item management.
 * Encapsulates modal open state, deletion API call, and error handling.
 */
export function AdminDeleteMenuDialog({
  item,
  onClose,
  onDeleted,
}: AdminDeleteMenuDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!item) return
    setIsDeleting(true)

    try {
      await deleteAdminMenuItem(item._id)

      toast.add({
        title: "Item Deleted",
        description: `"${item.itemName}" has been deleted.`,
        type: "success",
      })
      onDeleted(item._id)
      onClose()
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

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{item?.itemName}&quot;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" disabled={isDeleting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
