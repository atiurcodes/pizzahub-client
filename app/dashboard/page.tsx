import { redirect } from "next/navigation"

import { getDashboardHome, requireAuth } from "@/lib/auth-guard"

// Visiting /dashboard automatically sends the user to their role's dashboard
export default async function DashboardIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await requireAuth()
  const resolvedParams = await searchParams
  const authStatus = resolvedParams.auth
  const authVal = Array.isArray(authStatus) ? authStatus[0] : authStatus
  const target = getDashboardHome(user.role)
  const destination = authVal ? `${target}?auth=${authVal}` : target

  redirect(destination)
}
