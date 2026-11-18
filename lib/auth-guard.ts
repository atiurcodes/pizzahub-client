import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export type UserRole = "admin" | "vendor" | "customer"

// Safe user info passed to dashboard layouts and pages
export interface DashboardUser {
  id: string
  name: string
  email: string
  image?: string | null
  role: UserRole
  isBlocked: boolean
  businessName?: string
  subscriptionPlan: "free" | "premium"
}

// Helper: returns the home dashboard URL for a given role
export function getDashboardHome(role?: string | null): string {
  if (role === "admin") return "/dashboard/admin"
  if (role === "vendor") return "/dashboard/vendor"
  return "/dashboard/customer"
}

// Helper: checks if the user is logged in (runs on the server)
export async function requireAuth(): Promise<DashboardUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Not logged in -> send to Sign In page
  if (!session?.user) {
    redirect("/sign-in")
  }

  // Blocked user -> cannot access protected dashboards
  if (session.user.isBlocked) {
    redirect("/sign-in?blocked=true")
  }

  const role: UserRole =
    session.user.role === "admin" || session.user.role === "vendor"
      ? session.user.role
      : "customer"

  const subscriptionPlan: "free" | "premium" =
    session.user.subscriptionPlan === "premium" ? "premium" : "free"

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role,
    isBlocked: Boolean(session.user.isBlocked),
    businessName: session.user.businessName || "",
    subscriptionPlan,
  }
}

// Helper: ensures ONLY users with the matching role can open a dashboard
export async function requireRole(allowedRole: UserRole): Promise<DashboardUser> {
  const user = await requireAuth()

  // If a customer tries to visit /dashboard/admin (or vice versa), redirect them to their own dashboard
  if (user.role !== allowedRole) {
    redirect(getDashboardHome(user.role))
  }

  return user
}
