"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"

/**
 * AuthToastListener:
 * Listens for returning Google OAuth redirections across all pages.
 * Catches either `?auth=google-signin` / `?auth=google-signup` URL search params
 * or the sessionStorage `pending_auth_toast` flag if query params were sanitized.
 *
 * Uses a safe deferred timer so React StrictMode or initial useSession()
 * resolution does NOT prematurely cancel the toast notification.
 */
export function AuthToastListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    // If already triggered, do not run again
    if (hasTriggeredRef.current) return

    const authFromUrl = searchParams.get("auth")
    let authFromStorage: string | null = null

    if (typeof window !== "undefined") {
      try {
        authFromStorage = sessionStorage.getItem("pending_auth_toast")
      } catch {
        // ignore storage errors
      }
    }

    const authType =
      authFromUrl === "google-signin" || authFromUrl === "google-signup"
        ? authFromUrl
        : authFromStorage === "google-signin" || authFromStorage === "google-signup"
          ? authFromStorage
          : null

    if (!authType) return

    // If detected solely via sessionStorage without URL query, wait until session user is loaded
    if (!authFromUrl && authFromStorage && !session?.user) {
      return
    }

    const timer = setTimeout(() => {
      if (hasTriggeredRef.current) return
      hasTriggeredRef.current = true

      // Clean up sessionStorage
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("pending_auth_toast")
        } catch {
          // ignore
        }
      }

      const isSignUp = authType === "google-signup"
      const userName = session?.user?.name

      toast.add({
        title: isSignUp ? "Account created with Google!" : "Signed in with Google!",
        description: userName
          ? `Welcome back, ${userName}!`
          : isSignUp
            ? "Your PizzaHub account is ready to go."
            : "Welcome back to PizzaHub.",
        type: "success",
      })

      // Clean the ?auth= query parameter from URL without triggering full page re-render
      if (
        typeof window !== "undefined" &&
        window.location.search.includes("auth=")
      ) {
        try {
          const url = new URL(window.location.href)
          url.searchParams.delete("auth")
          window.history.replaceState(
            {},
            "",
            url.pathname + (url.search ? url.search : "")
          )
        } catch {
          // ignore URL parsing errors
        }
      }
    }, 250)

    return () => {
      clearTimeout(timer)
    }
  }, [searchParams, pathname, session])

  return null
}
