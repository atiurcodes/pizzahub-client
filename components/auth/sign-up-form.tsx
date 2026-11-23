"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

// Simple form validation function
function validateSignUpForm(data: {
  name: string
  email: string
  password: string
  image: string
  role: string
}) {
  // 1. Check Full Name
  if (data.name.trim().length < 2) {
    return "Full name must be at least 2 characters."
  }

  // 2. Check Email format
  if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
    return "Please enter a valid email address."
  }

  // 3. Check Password rules (6+ chars, 1 uppercase, 1 lowercase)
  if (data.password.length < 6) {
    return "Password must be at least 6 characters long."
  }
  if (!/[A-Z]/.test(data.password)) {
    return "Password must include at least 1 uppercase letter (A-Z)."
  }
  if (!/[a-z]/.test(data.password)) {
    return "Password must include at least 1 lowercase letter (a-z)."
  }

  // 4. Check Profile Image URL (only if user entered one)
  if (data.image.trim() && !/^https?:\/\/.+/.test(data.image.trim())) {
    return "Profile image must be a valid link starting with http:// or https://"
  }

  // 5. Check Role (only customer or vendor allowed)
  if (data.role !== "customer" && data.role !== "vendor") {
    return "Please choose either Customer or Vendor."
  }

  return null
}

/**
 * Isolated Client Component containing interactive sign-up form states and logic.
 * Encapsulates input fields, role selector, password toggles, and Google registration.
 */
export function SignUpForm() {
  const router = useRouter()

  // 1. Form field states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState("")
  const [role, setRole] = useState<"customer" | "vendor">("customer")

  // 2. UI states
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 3. Handle Email & Password Sign Up
  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage("")

    // Step A: Run form validations
    const validationError = validateSignUpForm({
      name,
      email,
      password,
      image,
      role,
    })

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    // Step B: Send data to Better Auth
    setIsLoading(true)
    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim() || undefined,
        role,
      })

      if (res.error) {
        const message =
          res.error.message || "Could not create account. Please try again."
        setErrorMessage(message)
        toast.add({
          title: "Sign up failed",
          description: message,
          type: "error",
        })
        return
      }

      toast.add({
        title: "Account created!",
        description: `Welcome to PizzaHub, ${name.trim()}!`,
        type: "success",
      })

      // /dashboard automatically redirects based on user role (vendor / customer)
      router.push("/dashboard")
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

  // 4. Handle Google Sign Up
  async function handleGoogleSignUp() {
    setErrorMessage("")
    setIsLoading(true)

    toast.add({
      title: "Connecting to Google...",
      description: "Redirecting you to Google Sign Up.",
      type: "info",
    })

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pending_auth_toast", "google-signup")
      }

      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard?auth=google-signin",
        newUserCallbackURL: "/dashboard?auth=google-signup",
      })

      if (res.error) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pending_auth_toast")
        }
        const message =
          res.error.message || "Google sign up failed. Please try again."
        setErrorMessage(message)
        toast.add({
          title: "Google sign up failed",
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
    <div className="space-y-5">
      {/* Inline Error Box */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleSignUp} noValidate className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-background px-4 text-sm"
          />
        </div>

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
              placeholder="6+ chars, 1 uppercase & 1 lowercase"
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
          <p className="text-xs text-muted-foreground">
            At least 6 characters, 1 uppercase letter, and 1 lowercase letter.
          </p>
        </div>

        {/* Profile Image Field (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-semibold">
            Profile image{" "}
            <span className="font-normal text-muted-foreground">
              (Optional)
            </span>
          </Label>
          <Input
            id="image"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-xl bg-background px-4 text-sm"
          />
        </div>

        {/* Account Role Select (Customer or Vendor Only) */}
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-semibold">
            Account role
          </Label>
          <div className="relative">
            <select
              id="role"
              value={role}
              disabled={isLoading}
              onChange={(e) =>
                setRole(e.target.value as "customer" | "vendor")
              }
              className="h-12 w-full appearance-none rounded-xl border border-input bg-background px-4 pr-10 text-sm font-medium text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            >
              <option value="customer">Customer (Order Pizza)</option>
              <option value="vendor">Vendor (Restaurant Owner)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Submit Pill Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="mt-2 h-12 w-full rounded-full bg-gradient-to-r from-primary to-tomato text-base font-semibold shadow-md shadow-primary/20 hover:opacity-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 size-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-1 size-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground uppercase">
          or continue with
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Google Sign Up Button */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={isLoading}
        onClick={handleGoogleSignUp}
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
