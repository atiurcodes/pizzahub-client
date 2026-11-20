"use client"

import { useState } from "react"
import { Ban, CheckCircle, Loader2, ShieldAlert } from "lucide-react"

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
import { toggleUserBlockStatus } from "@/services/admin.service"
import type { PlatformUser } from "@/types"

interface UserBlockButtonProps {
  user: PlatformUser
  onStatusChange: (userId: string, isBlocked: boolean) => void
}

export function UserBlockButton({ user, onStatusChange }: UserBlockButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 1. Admins cannot be blocked (security rule)
  if (user.role === "admin") {
    return (
      <span className="text-xs text-muted-foreground/60 italic font-mono">
        Protected
      </span>
    )
  }

  // 2. Toggle block/unblock handler
  const handleToggleBlock = async () => {
    setIsLoading(true)

    try {
      const res = await toggleUserBlockStatus(user._id)
      onStatusChange(user._id, res.isBlocked)

      toast.add({
        title: res.isBlocked ? "User Blocked" : "User Unblocked",
        description: res.isBlocked
          ? `${user.name} (${user.email}) has been blocked from accessing the platform.`
          : `${user.name} (${user.email}) has been unblocked.`,
        type: res.isBlocked ? "warning" : "success",
      })

      setIsOpen(false)
    } catch (err) {
      toast.add({
        title: "Action Failed",
        description:
          err instanceof Error ? err.message : "Failed to update user status.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If user is already blocked -> Show "Unblock" button directly
  if (user.isBlocked) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={isLoading}
        onClick={handleToggleBlock}
        className="h-7 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 font-medium"
      >
        {isLoading ? (
          <Loader2 className="size-3 animate-spin mr-1" />
        ) : (
          <CheckCircle className="size-3 mr-1" />
        )}
        Unblock
      </Button>
    )
  }

  // If user is active -> Show "Block" button that opens confirmation dialog
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 font-medium"
      >
        <Ban className="size-3 mr-1" />
        Block
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <ShieldAlert className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Block User Account?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to block{" "}
              <strong className="text-foreground font-semibold">
                {user.name} ({user.email})
              </strong>
              ? Once blocked, this user cannot access the dashboard or place orders.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isLoading}
              onClick={handleToggleBlock}
              className="text-xs font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                  <span>Blocking...</span>
                </>
              ) : (
                <span>Yes, Block User</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
