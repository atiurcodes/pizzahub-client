import type { Metadata } from "next"

import { AddMenuItemForm } from "@/components/dashboard/add-menu-item-form"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Add Menu Item — PizzaHub Vendor",
  description: "Create and publish a new pizza or food item to your restaurant menu.",
}

export default async function VendorAddItemPage() {
  // Server-side guard: Only authenticated vendor users can access this page
  const user = await requireRole("vendor")

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Add New Menu Item
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create an appetizing new item for your restaurant. Submitted items are reviewed by moderators before appearing publicly.
        </p>
      </div>

      {/* Main Form Component */}
      <AddMenuItemForm user={user} />
    </div>
  )
}
