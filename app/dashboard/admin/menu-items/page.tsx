import type { Metadata } from "next"

import { AdminMenuList } from "@/components/dashboard/admin/admin-menu-list"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Manage Menu Items | PizzaHub Admin",
  description: "Review, approve, or reject vendor menu item submissions.",
}

export default async function AdminMenuItemsPage() {
  // Server-side authentication & role check
  await requireRole("admin")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Manage Menu Items
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review pending submissions from vendors, approve quality pizzas for the public menu, or reject items that do not meet guidelines.
        </p>
      </div>

      {/* Admin Menu List Table & Moderation Controls */}
      <AdminMenuList />
    </div>
  )
}
