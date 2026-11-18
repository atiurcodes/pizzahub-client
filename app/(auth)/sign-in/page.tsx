"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Loader2, Pizza, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

// Simple form validation before sending request
function validateSignInForm(email: string, password: string) {
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    return "Please enter a valid email address."
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters."
  }

  return null
}

export default function SignInPage() {
  const router = useRouter()

  // 1. Form field states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 2. UI states
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 3. Handle Email & Password Sign In
  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage("")

    // Step A: Validate email and password first
    const validationError = validateSignInForm(email, password)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    // Step B: Call Better Auth signIn.email()
    setIsLoading(true)
    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (res.error) {
        const message =
          res.error.message || "Invalid email or password. Please try again."
        setErrorMessage(message)
        toast.add({
          title: "Sign in failed",
          description: message,
          type: "error",
        })
        return
      }

      // Step C: Check if the user account is blocked by an admin
      const session = await authClient.getSession()
      if (session.data?.user?.isBlocked) {
        await authClient.signOut()
        const blockedMsg = "Your account is blocked. Please contact support."
        setErrorMessage(blockedMsg)
        toast.add({
          title: "Account blocked",
          description: blockedMsg,
          type: "error",
        })
        return
      }

      toast.add({
        title: "Welcome back!",
        description: `Signed in as ${res.data.user.name}.`,
        type: "success",
      })

      // Later, redirect by role:
      // admin -> "/dashboard/admin", vendor -> "/dashboard/vendor", customer -> "/dashboard/customer"
      router.push("/")
      router.refresh()
    } catch {
      const message = "Something went wrong. Please try again."
      setErrorMessage(message)
      toast.add({
        title: "Error",
        description: message,
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Handle Google Sign In
  async function handleGoogleSignIn() {
    setErrorMessage("")
    setIsLoading(true)

    toast.add({
      title: "Connecting to Google...",
      description: "Redirecting you to Google Sign In.",
      type: "info",
    })

    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/?auth=google-signin",
      })

      if (res.error) {
        const message =
          res.error.message || "Google sign in failed. Please try again."
        setErrorMessage(message)
        toast.add({
          title: "Google sign in failed",
          description: message,
          type: "error",
        })
      }
    } catch {
      const message = "Unable to connect to Google right now."
      setErrorMessage(message)
      toast.add({
        title: "Error",
        description: message,
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
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

          {/* Inline Error Box */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {errorMessage}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} noValidate className="mt-6 space-y-5">
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
                disabled={isLoading}
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
                  disabled={isLoading}
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
              disabled={isLoading}
              className="h-12 w-full rounded-full bg-gradient-to-r from-primary to-tomato text-base font-semibold shadow-md shadow-primary/20 hover:opacity-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-1 size-4" />
                </>
              )}
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
            disabled={isLoading}
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
