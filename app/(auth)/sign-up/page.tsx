import type { Metadata } from "next"
import Link from "next/link"
import { Pizza, ShieldCheck, X } from "lucide-react"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create an Account | PizzaHub",
  description: "Join PizzaHub as a customer to order fresh pizzas or as a vendor to sell delicious pies.",
}

/**
 * SignUpPage: Server Component shell for the Sign Up route.
 * Contains page metadata and static layout elements.
 * Form inputs, role selection, and client actions are handled by <SignUpForm />.
 */
export default function SignUpPage() {
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center bg-background bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.09),_transparent_58%)] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
        {/* Top Ember-to-Tomato Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-tomato" />

        <div className="p-7 sm:p-9">
          {/* Top Row: Brand Badge + Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-tomato text-primary-foreground shadow-sm shadow-primary/25">
                <Pizza className="size-5" />
              </div>
              <span className="font-heading text-base font-bold text-foreground">
                Pizza<span className="text-primary">Hub</span>
              </span>
            </div>

            <Link
              href="/"
              aria-label="Back to home"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-5" />
            </Link>
          </div>

          {/* Page Heading */}
          <div className="mt-6">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Join PizzaHub
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Create your account to order fresh pizza or grow your restaurant.
            </p>
          </div>

          {/* Interactive Client Form */}
          <div className="mt-6">
            <SignUpForm />
          </div>

          {/* Footer Switch Link */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>

          {/* Admin Restriction Security Note */}
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-secondary/70 px-3 py-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0 text-basil" />
            <span>
              Admin accounts are assigned securely and cannot be registered
              publicly.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
