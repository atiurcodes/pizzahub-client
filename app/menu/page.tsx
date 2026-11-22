import type { Metadata } from "next"

import { MenuBrowseView } from "@/components/menu/menu-browse-view"
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
  let locations: string[] = []
  let errorMsg = ""

  try {
    const res = await getPublicMenuItems()
    items = res.items
    locations = res.locations
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

        {/* Interactive Browse View with Search, Category & Location Filter and Price Sorting */}
        {!errorMsg && (
          <MenuBrowseView initialItems={items} initialLocations={locations} />
        )}
      </div>
    </div>
  )
}
