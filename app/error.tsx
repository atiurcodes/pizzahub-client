"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, Home, RotateCcw } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-xs">
          <AlertCircle className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while processing your request. Please try again or return to the homepage.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            onClick={reset}
            className="rounded-full font-bold text-xs px-5 bg-gradient-to-r from-primary to-tomato text-white shadow-xs gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "rounded-full text-xs font-semibold px-5 border-border/80 gap-1.5"
            )}
          >
            <Home className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
