"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import {
  ArrowDownUp,
  MapPin,
  Pizza,
  RotateCcw,
  Search,
  X,
} from "lucide-react"

import { MenuCard } from "@/components/menu/menu-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getPublicMenuItems } from "@/services/customer.service"
import { PIZZA_CATEGORIES, type MenuItem } from "@/types"

interface MenuBrowseViewProps {
  initialItems: MenuItem[]
  initialLocations: string[]
}

export function MenuBrowseView({
  initialItems,
  initialLocations,
}: MenuBrowseViewProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [locations, setLocations] = useState<string[]>(initialLocations)
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Filter States
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("all")
  const [sort, setSort] = useState("newest")

  const isInitialMount = useRef(true)

  // Fetch filtered items whenever filters change
  const fetchFilteredItems = useCallback(
    async (
      searchQuery: string,
      categoryFilter: string,
      locationFilter: string,
      sortOrder: string
    ) => {
      setIsLoading(true)
      try {
        const res = await getPublicMenuItems({
          search: searchQuery,
          category: categoryFilter,
          location: locationFilter,
          sort: sortOrder,
        })
        setItems(res.items)
        if (res.locations && res.locations.length > 0) {
          setLocations(res.locations)
        }
      } catch (err) {
        console.error("Failed to load filtered menu items:", err)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Debounced search & filter sync
  useEffect(() => {
    // Skip initial mount to prevent duplicate fetch of server-rendered data
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timer = setTimeout(() => {
      startTransition(() => {
        fetchFilteredItems(search, category, location, sort)
      })
    }, 280)

    return () => clearTimeout(timer)
  }, [search, category, location, sort, fetchFilteredItems])

  function handleResetFilters() {
    setSearch("")
    setCategory("all")
    setLocation("all")
    setSort("newest")
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "all" ||
    location !== "all" ||
    sort !== "newest"

  return (
    <div className="space-y-8">
      {/* 1. Search & Filter Control Bar */}
      <div className="rounded-3xl border border-border/80 bg-card/80 p-4 sm:p-6 shadow-sm space-y-4 backdrop-blur-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* A. Search Box (6 cols on md) */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pizzas by name, crust, or ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10 pr-9 rounded-2xl bg-background text-sm border-border/80"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* B. Location Filter (3 cols on md) */}
          <div className="relative md:col-span-3">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-primary pointer-events-none" />
              <select
                aria-label="Filter by restaurant location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 w-full pl-10 pr-8 rounded-2xl bg-background text-xs sm:text-sm font-medium border border-border/80 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* C. Sort by Price & Newest (3 cols on md) */}
          <div className="relative md:col-span-3">
            <div className="relative">
              <ArrowDownUp className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-primary pointer-events-none" />
              <select
                aria-label="Sort pizzas by price or date"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 w-full pl-10 pr-8 rounded-2xl bg-background text-xs sm:text-sm font-medium border border-border/80 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
                <option value="name-asc">Sort: Name (A to Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <Button
            type="button"
            size="sm"
            variant={category === "all" ? "default" : "outline"}
            onClick={() => setCategory("all")}
            className={cn(
              "h-8 rounded-full text-xs font-semibold shrink-0 transition-all",
              category === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border-border/70 hover:border-primary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            All Pizzas
          </Button>

          {PIZZA_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              type="button"
              size="sm"
              variant={category === cat ? "default" : "outline"}
              onClick={() => setCategory(cat)}
              className={cn(
                "h-8 rounded-full text-xs font-semibold shrink-0 transition-all",
                category === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border-border/70 hover:border-primary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* 3. Filter Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-foreground font-semibold">{items.length}</strong> {items.length === 1 ? "pizza" : "pizzas"}
            </span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-[10px] rounded-full">
                Filtered
              </Badge>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold hover:underline"
            >
              <RotateCcw className="size-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Loading Skeletons */}
      {(isLoading || isPending) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/60 bg-card overflow-hidden space-y-3 p-3"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="space-y-2 p-1">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Empty State */}
      {!isLoading && !isPending && items.length === 0 && (
        <div className="text-center py-16 px-4 space-y-5 max-w-md mx-auto">
          <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-xs">
            <Pizza className="size-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-bold text-foreground">
              No Pizzas Found
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {hasActiveFilters
                ? "We couldn't find any pizzas matching your current search or filters. Try adjusting your search term or clearing filters."
                : "No approved pizzas are currently available on the menu. Check back soon!"}
            </p>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              onClick={handleResetFilters}
              className="rounded-full font-semibold text-xs gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              <span>Clear All Filters</span>
            </Button>
          )}
        </div>
      )}

      {/* 6. Pizza Card Grid */}
      {!isLoading && !isPending && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
