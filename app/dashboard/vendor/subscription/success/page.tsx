import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, CheckCircle2, Crown, PlusCircle, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { stripe } from "@/lib/stripe"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)")
  }

  // 1. Retrieve session securely from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  if (session.status === "open") {
    return redirect("/dashboard/vendor/subscription")
  }

  // 2. If payment is completed & paid, ensure user is upgraded in MongoDB (safety sync for localhost)
  if (session.status === "complete" && session.payment_status === "paid") {
    const vendorEmail =
      session.metadata?.vendorEmail ||
      session.customer_details?.email ||
      session.customer_email

    if (vendorEmail && process.env.MONGODB_URI) {
      try {
        const { MongoClient } = await import("mongodb")
        const client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()
        const db = client.db("pizzahubdb")

        const hasUserCol = await db.listCollections({ name: "user" }).hasNext()
        const userCollection = hasUserCol
          ? db.collection("user")
          : db.collection("users")

        // 1. Update user collection: subscriptionPlan -> "premium"
        await userCollection.updateOne(
          { email: vendorEmail },
          {
            $set: {
              subscriptionPlan: "premium",
              updatedAt: new Date(),
            },
          }
        )

        // 2. Prepare payment record
        const paymentRecord = {
          vendorEmail,
          plan: "premium",
          amount: session.amount_total ? session.amount_total / 100 : 19.99,
          currency: session.currency?.toUpperCase() || "USD",
          stripeSessionId: session.id,
          status: "paid",
          createdAt: new Date(),
        }

        // 3. Save into "payments" collection
        await db.collection("payments").updateOne(
          { stripeSessionId: session.id },
          { $setOnInsert: paymentRecord },
          { upsert: true }
        )

        // Also save into "transactions" collection
        await db.collection("transactions").updateOne(
          { stripeSessionId: session.id },
          { $setOnInsert: paymentRecord },
          { upsert: true }
        )

        await client.close()
      } catch (dbErr) {
        console.error("Local sync error in success page:", dbErr)
      }
    }

    return (
      <div className="min-h-[calc(100svh-5rem)] flex items-center justify-center bg-background bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.08),_transparent_60%)] px-4 py-12">
        <Card className="w-full max-w-lg border border-border/80 shadow-2xl overflow-hidden bg-card text-center">
          {/* Top Gold/Ember Accent Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-tomato" />

          <CardHeader className="pt-8 pb-3 space-y-3">
            <div className="relative mx-auto size-20 rounded-3xl bg-amber-500/15 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Crown className="size-10 fill-amber-500" />
              <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="size-4" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                <Sparkles className="size-3" />
                <span>Payment Confirmed</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Welcome to PizzaHub Premium!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Your account has been upgraded to Premium. All menu limits are now unlocked permanently.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2 text-left">
            {/* Receipt Summary Box */}
            <div className="rounded-2xl bg-muted/40 border border-border/60 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Account Email</span>
                <span className="font-semibold text-foreground">
                  {vendorEmail}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Plan</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Crown className="size-3 fill-amber-500" />
                  Vendor Premium (Lifetime)
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Amount Paid</span>
                <span className="font-semibold text-foreground">
                  ${session.amount_total ? (session.amount_total / 100).toFixed(2) : "19.99"} USD
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground border-t border-border/40 pt-2">
                <span>Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                  Paid &amp; Active
                </span>
              </div>
            </div>

            {/* Unlocked Benefits Checklist */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span><strong>Unlimited menu uploads</strong> (No 3-item limit anymore)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span><strong>Golden verified badge</strong> visible across platform</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span><strong>Featured placement</strong> for your pizzas</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <Link
              href="/dashboard/vendor/add-item"
              className={cn(
                buttonVariants({ size: "lg" }),
                "flex-1 h-12 rounded-full bg-gradient-to-r from-primary to-tomato font-semibold text-white shadow-md shadow-primary/20"
              )}
            >
              <PlusCircle className="size-4 mr-1.5" />
              <span>Add New Menu Item</span>
            </Link>
            <Link
              href="/dashboard/vendor"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "flex-1 h-12 rounded-full text-xs font-semibold"
              )}
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Fallback if payment is not yet paid or cancelled
  return (
    <div className="min-h-[calc(100svh-5rem)] flex items-center justify-center p-6 text-center">
      <Card className="max-w-md p-6">
        <h2 className="text-lg font-bold text-foreground">Processing Payment</h2>
        <p className="text-xs text-muted-foreground mt-2">
          Your payment status is being processed. Please refresh in a moment.
        </p>
        <Link
          href="/dashboard/vendor"
          className={cn(buttonVariants({ size: "sm" }), "mt-4")}
        >
          Go to Dashboard
        </Link>
      </Card>
    </div>
  )
}
