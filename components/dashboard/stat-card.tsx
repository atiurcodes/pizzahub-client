import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  tone?: "primary" | "basil" | "amber" | "tomato"
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/12 text-primary",
  basil: "bg-basil/12 text-basil",
  amber: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  tomato: "bg-tomato/12 text-tomato",
}

// Reusable KPI Stat Card used across Admin, Vendor, and Customer dashboards
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "primary",
}: StatCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            toneClasses[tone]
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-4">
        <p className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
