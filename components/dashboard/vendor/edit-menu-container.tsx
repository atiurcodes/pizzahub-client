"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Loader2 } from "lucide-react"

import { EditMenuItemForm } from "@/components/dashboard/vendor/edit-menu-item-form"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getMenuItemById, type MenuItem } from "@/services/api"

export function EditMenuItemContainer({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMenuItemById(itemId)
      .then((data) => {
        if (!data) {
          setError("Menu item not found.")
        } else {
          setItem(data)
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load item.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [itemId])

  if (isLoading) {
    return (
      <Card className="p-12 text-center border-border/60">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading menu item details...</p>
        </div>
      </Card>
    )
  }

  if (error || !item) {
    return (
      <Card className="p-8 text-center border-destructive/40 bg-destructive/5 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="size-8 text-destructive" />
          <h3 className="font-heading font-bold text-base text-foreground">
            Item Not Found
          </h3>
          <p className="text-xs text-muted-foreground">{error || "Could not find this item."}</p>
          <Link
            href="/dashboard/vendor/menu-items"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xs mt-2",
            })}
          >
            Back to My Menu Items
          </Link>
        </div>
      </Card>
    )
  }

  return <EditMenuItemForm item={item} />
}
