import Link from "next/link"
import { ArrowRight, MapPin, Store } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types"

interface MenuCardProps {
  item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
  const thumbnail =
    item.images?.[0] ||
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
      {/* 1. Image container with uniform aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={item.itemName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <Badge className="bg-background/90 text-foreground backdrop-blur-xs shadow-xs text-[11px] font-medium border-border/60">
            {item.category}
          </Badge>
          {item.vendor?.isPremium && (
            <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] border-amber-300 shadow-xs">
              ★ Premium
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2.5 right-2.5">
          <span className="bg-primary text-primary-foreground font-bold text-sm px-2.5 py-1 rounded-full shadow-xs">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>
      </div>

      {/* 2. Content */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.itemName}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* 3. Location & Vendor Info */}
        <div className="pt-2 border-t border-border/40 space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Store className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{item.vendor?.businessName || item.vendorEmail}</span>
          </div>
        </div>
      </CardContent>

      {/* 4. CTA Button */}
      <CardFooter className="p-4 pt-3.5 border-t border-border/40 bg-card/60">
        <Link
          href={`/menu/${item._id}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full h-10 rounded-xl font-semibold text-sm gap-2 shadow-xs hover:shadow-md transition-all group/btn"
          )}
        >
          <span>View Details</span>
          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  )
}
