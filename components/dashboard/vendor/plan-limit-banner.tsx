import Link from "next/link"
import { AlertTriangle, Crown, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

interface PlanLimitBannerProps {
  isPremium: boolean
  activeItemCount: number | null
}

/**
 * Reusable banner showing the vendor's subscription plan,
 * current item usage, and an alert when the Free plan 3-item limit is reached.
 */
export function PlanLimitBanner({
  isPremium,
  activeItemCount,
}: PlanLimitBannerProps) {
  // Free plan limit is 3 items
  const isLimitReached = !isPremium && activeItemCount !== null && activeItemCount >= 3
  const remainingSlots = isPremium ? null : Math.max(0, 3 - (activeItemCount ?? 0))

  // ==========================================
  // Case 1: Free Plan Limit Reached (3 of 3 used)
  // ==========================================
  if (isLimitReached) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-sm">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              <span>Free Plan Limit Reached</span>
              <Badge variant="destructive" className="text-[11px]">
                3 of 3 Slots Used
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              You have reached your Free Plan limit of 3 menu items. Upgrade to
              Premium to list unlimited pizzas, receive a verified badge, and get
              featured on the homepage!
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({
            className:
              "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shrink-0",
          })}
        >
          <Crown className="size-3.5 mr-1 fill-amber-300" />
          <span>Upgrade to Premium</span>
        </Link>
      </div>
    )
  }

  // ==========================================
  // Case 2: Premium Vendor (Unlimited items)
  // ==========================================
  if (isPremium) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200 text-sm">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Crown className="size-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              <span>Premium Vendor Plan</span>
              <Badge className="bg-amber-500 text-white font-medium text-[11px]">
                Unlimited Items
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              You have unlimited active item listings and priority placement on
              the homepage.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // Case 3: Free Vendor with Slots Remaining (0, 1, or 2 items)
  // ==========================================
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Info className="size-5" />
        </div>
        <div>
          <div className="font-semibold flex items-center gap-2 text-foreground">
            <span>Free Vendor Plan</span>
            <Badge variant="secondary" className="text-[11px]">
              {activeItemCount !== null
                ? `${activeItemCount}/3 Items Used`
                : "Max 3 Active Items"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {remainingSlots !== null
              ? `You have ${remainingSlots} item slot${
                  remainingSlots === 1 ? "" : "s"
                } remaining. Upgrade to Premium for unlimited listings.`
              : "Free plan vendors can publish up to 3 active menu items. Upgrade to Premium for unlimited listings."}
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/vendor/subscription"
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className:
            "shrink-0 border-primary/30 text-primary hover:bg-primary/10 text-xs",
        })}
      >
        <span>Upgrade Plan</span>
      </Link>
    </div>
  )
}
