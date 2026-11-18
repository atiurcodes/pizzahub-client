import { redirect } from "next/navigation"

import { getDashboardHome, requireAuth } from "@/lib/auth-guard"

// Visiting /dashboard automatically sends the user to their role's dashboard
export default async function DashboardIndexPage() {
  const user = await requireAuth()
  redirect(getDashboardHome(user.role))
}
