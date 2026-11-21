import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, Crown, Lock, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Upgrade to Premium — One-Time Payment | PizzaHub",
  description: "One-time upgrade to unlock unlimited menu items and lifetime verified vendor status.",
}

/**
 * One-Time Payment Checkout Page for Vendor Premium Upgrade.
 * No recurring monthly subscriptions — pay once, enjoy lifetime benefits.
 */
export default async function VendorSubscriptionPage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const { cancelled } = await searchParams

  if (cancelled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }
  return (
    <div className="min-h-[calc(100svh-5rem)] flex items-center justify-center bg-background bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.08),_transparent_60%)] px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        {/* Back Link */}
        <Link
          href="/dashboard/vendor"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* One-Time Payment Card */}
        <Card className="border border-border/80 shadow-xl overflow-hidden bg-card">
          {/* Top Ember Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-tomato" />

          <CardHeader className="text-center pt-6 pb-2 space-y-3">
            <div className="mx-auto size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
              <Crown className="size-7 fill-primary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-2">
                <Sparkles className="size-3" />
                <span>Lifetime Access Pass</span>
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground tracking-tight">
                Vendor Premium Upgrade
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Pay once, unlock unlimited pizzas, and keep benefits forever
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-2">
            {/* Price Box */}
            <div className="rounded-2xl bg-muted/50 border border-border/60 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                One-Time Payment
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1.5">
                <span className="font-heading text-4xl font-extrabold text-foreground">
                  $19.99
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  USD (Flat Fee)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                No monthly bills • Zero hidden fees • Lifetime validity
              </p>
            </div>

            {/* Quick Benefits List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Unlimited menu items</strong> (No 3-item limit)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Golden verified crown badge</strong> on restaurant profile
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Featured homepage placement</strong> to boost orders
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Lifetime access</strong> — Never renew or pay again
                </span>
              </div>
            </div>

            {/* Stripe Native Checkout Form */}
            <form action="/api/checkout_sessions" method="POST" className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-tomato font-semibold text-white shadow-md shadow-primary/20 hover:opacity-95 transition-all text-sm"
              >
                <Lock className="size-4 mr-1.5" />
                <span>Pay $19.99 with Stripe</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center pt-0 pb-6 text-[11px] text-muted-foreground gap-1">
            <div className="flex items-center gap-1.5">
              <Lock className="size-3 text-emerald-500" />
              <span>256-bit SSL encrypted one-time payment powered by Stripe</span>
            </div>
            <span>No recurring subscription. You will only be charged once.</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
