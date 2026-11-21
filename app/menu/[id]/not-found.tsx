import Link from "next/link"
import { ArrowLeft, Pizza } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PizzaNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto space-y-5">
        <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
          <Pizza className="size-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Pizza Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The pizza you are looking for does not exist, may have been removed by the restaurant, or is pending approval.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "w-full sm:w-auto rounded-full font-semibold text-xs gap-2"
            )}
          >
            <ArrowLeft className="size-4" />
            <span>Back to Menu</span>
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full sm:w-auto rounded-full font-semibold text-xs"
            )}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
