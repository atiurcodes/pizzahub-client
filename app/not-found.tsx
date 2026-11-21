import Link from "next/link"
import { ArrowLeft, Home, Pizza } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="size-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm border border-primary/20">
          <Pizza className="size-12 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            404 — Page Not Found
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Slice Out of Bounds!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We searched every oven, but the page you are looking for has either been eaten or moved to a different address.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full sm:w-auto rounded-full font-semibold text-sm gap-2"
            )}
          >
            <ArrowLeft className="size-4" />
            <span>Browse Pizza Menu</span>
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto rounded-full font-semibold text-sm gap-2"
            )}
          >
            <Home className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
