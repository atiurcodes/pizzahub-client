import type { Metadata } from "next"
import Link from "next/link"
import { Pizza, X } from "lucide-react"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In | PizzaHub",
  description: "Sign in to your account to order delicious pizza or manage your restaurant.",
}

/**
 * SignInPage: Server Component shell for the Sign In route.
 * Contains page-level SEO metadata and static structure.
 * Form state and interactions are encapsulated inside <SignInForm />.
 */
export default function SignInPage() {
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
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to track your pizza orders or manage your restaurant menu.
            </p>
          </div>

          {/* Interactive Client Form */}
          <div className="mt-6">
            <SignInForm />
          </div>

          {/* Footer Switch Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to PizzaHub?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
