import type { Metadata } from "next"

import { AdminOverviewView } from "@/components/dashboard/admin/admin-overview-view"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Admin Overview | PizzaHub",
  description: "Platform summary — live analytics, users, menu items, and subscriptions.",
}

export default async function AdminOverviewPage() {
  // Server-side authentication and admin role check
  const user = await requireRole("admin")

  return <AdminOverviewView userName={user.name} />
}
