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
 * Uses a small 350ms delay to guarantee that Base UI's <ToastProvider> has finished
 * mounting and subscribing to the global toastManager before toast.add() is emitted.
 */
export function AuthToastListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    // Avoid double firing within the same session/view
    if (hasTriggeredRef.current) return

    const authFromUrl = searchParams.get("auth")
    const pendingToast =
      typeof window !== "undefined"
        ? sessionStorage.getItem("pending_auth_toast")
        : null

    const authStatus =
      authFromUrl === "google-signin" || authFromUrl === "google-signup"
        ? authFromUrl
        : pendingToast === "google-signin" || pendingToast === "google-signup"
          ? pendingToast
          : null

    if (!authStatus) return

    // If detected via sessionStorage without URL query, wait until session user is loaded
    if (!authFromUrl && pendingToast && !session?.user) {
      return
    }

    hasTriggeredRef.current = true

    // Remove from sessionStorage immediately so it won't fire again
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pending_auth_toast")
    }

    // Delay ensures <ToastProvider> has subscribed to toastManager
    const timer = setTimeout(() => {
      const isSignUp = authStatus === "google-signup"
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

      // Clean the ?auth= query parameter without triggering full page re-render
      if (
        typeof window !== "undefined" &&
        window.location.search.includes("auth=")
      ) {
        const params = new URLSearchParams(window.location.search)
        params.delete("auth")
        const cleanQuery = params.toString()
        const cleanUrl = cleanQuery
          ? `${window.location.pathname}?${cleanQuery}`
          : window.location.pathname
        window.history.replaceState({}, "", cleanUrl)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [searchParams, pathname, session])

  return null
}
