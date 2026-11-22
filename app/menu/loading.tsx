import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl space-y-8">
        {/* Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Skeleton className="h-6 w-32 rounded-full mx-auto" />
          <Skeleton className="h-10 w-3/4 rounded-xl mx-auto" />
          <Skeleton className="h-4 w-full rounded-md mx-auto" />
        </div>

        {/* Filter Bar Skeleton */}
        <Card className="border-border/60 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <Skeleton className="h-10 w-full lg:max-w-md rounded-full" />
            <div className="flex gap-2 w-full lg:w-auto">
              <Skeleton className="h-10 w-36 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>
        </Card>

        {/* 6 Pizza Cards Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden border-border/60">
              <Skeleton className="aspect-[4/3] w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
                <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
