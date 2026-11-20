import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { VendorMenuList } from "@/components/dashboard/vendor/vendor-menu-list"
import { buttonVariants } from "@/components/ui/button"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "My Menu Items — PizzaHub Vendor",
  description: "View and manage all menu items created by your restaurant.",
}

export default async function VendorMenuItemsPage() {
  // Server-side guard: Ensures only authenticated vendor accounts can access
  await requireRole("vendor")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            My Menu Items
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all pizzas and dishes created by your restaurant, track approval statuses, and add new items.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-item"
          className={buttonVariants({
            className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shrink-0",
          })}
        >
          <PlusCircle className="size-4 mr-1.5" />
          <span>Add New Item</span>
        </Link>
      </div>

      {/* Menu Items List & Filters */}
      <VendorMenuList />
    </div>
  )
}
