"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Pizza, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  // 1. State to store form input values
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // 2. Form submit handler (receives all form data)
  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = {
      email,
      password,
    }

    console.log("Sign In Form Data:", formData)

    // TODO: Add your Better Auth sign-in logic here
  }

  // 3. Google sign-in button handler
  function handleGoogleSignIn() {
    console.log("Google Sign In clicked")

    // TODO: Add your Google OAuth sign-in logic here
  }

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

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="mt-7 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-background px-4 text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-background px-4 pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Pill Button */}
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-full bg-gradient-to-r from-primary to-tomato text-base font-semibold shadow-md shadow-primary/20 hover:opacity-95"
            >
              Sign In
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase">
              or continue with
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleGoogleSignIn}
            className="h-12 w-full rounded-full text-sm font-semibold"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mr-2 size-4"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

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
