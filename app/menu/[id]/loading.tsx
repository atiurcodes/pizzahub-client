import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ItemDetailsLoading() {
  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* Breadcrumb / Back button skeleton */}
        <Skeleton className="h-9 w-32 rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery Skeleton (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            <div className="flex gap-3">
              <Skeleton className="size-20 rounded-xl" />
              <Skeleton className="size-20 rounded-xl" />
              <Skeleton className="size-20 rounded-xl" />
            </div>
          </div>

          {/* Right Column: Item Details & Order Form Skeleton (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>

            {/* Vendor card skeleton */}
            <Card className="border-border/60 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
            </Card>

            {/* Order Card Skeleton */}
            <Card className="border-border/60 p-6 space-y-4">
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-full" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
