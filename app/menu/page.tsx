import type { Metadata } from "next"
import { Pizza } from "lucide-react"

import { MenuCard } from "@/components/menu/menu-card"
import { Badge } from "@/components/ui/badge"
import { getPublicMenuItems } from "@/services/customer.service"
import type { MenuItem } from "@/types"

export const metadata: Metadata = {
  title: "Browse Pizza Menu | PizzaHub",
  description:
    "Explore our authentic, handcrafted pizzas from local restaurants. Order fresh pizza delivered straight to your door.",
}

// Ensure fresh data on every request
export const dynamic = "force-dynamic"

export default async function BrowseMenuPage() {
  let items: MenuItem[] = []
  let errorMsg = ""

  try {
    items = await getPublicMenuItems()
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Failed to load pizzas."
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl space-y-8">
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full"
          >
            Fresh from the Oven
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Our Pizza Menu
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Handcrafted pizzas made by verified local restaurants with fresh ingredients and authentic crusts.
          </p>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center max-w-md mx-auto">
            <p className="text-sm text-destructive font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Empty State */}
        {!errorMsg && items.length === 0 && (
          <div className="text-center py-16 space-y-4 max-w-md mx-auto">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Pizza className="size-8" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              No Pizzas Available Yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Local restaurants are baking their menu items. Check back soon for hot and fresh pizzas!
            </p>
          </div>
        )}

        {/* Pizza Card Grid */}
        {!errorMsg && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
