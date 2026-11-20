import type { Metadata } from "next"

import { EditMenuItemContainer } from "@/components/dashboard/vendor/edit-menu-container"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Edit Menu Item — PizzaHub Vendor",
  description: "Update details, price, or image for your menu item.",
}

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // 1. Role Guard: Vendor only
  await requireRole("vendor")

  // 2. Read item ID from route params (Next.js 15/16 requires awaiting params)
  const { id } = await params

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Edit Menu Item
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update item information, price, description, or food photo. Edited items undergo a quick admin re-review.
        </p>
      </div>

      {/* Edit Form Container */}
      <EditMenuItemContainer itemId={id} />
    </div>
  )
}
