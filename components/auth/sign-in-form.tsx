"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"

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

/**
 * Isolated Client Component containing interactive form state and handlers.
 * Kept separated from the parent Server Component page.
 */
export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

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

      // Redirect user to destination callbackUrl or dashboard
      router.push(callbackUrl)
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
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pending_auth_toast", "google-signin")
      }

      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/?auth=google-signin",
        newUserCallbackURL: "/?auth=google-signup",
      })

      if (res.error) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pending_auth_toast")
        }
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
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pending_auth_toast")
      }
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
    <div className="space-y-6">
      {/* Inline Error Box */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleSignIn} noValidate className="space-y-5">
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
      <div className="flex items-center gap-3">
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
        <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 size-4">
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
    </div>
  )
}
