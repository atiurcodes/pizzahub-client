import type { Metadata } from "next"

import { AdminTransactionsView } from "@/components/dashboard/admin/admin-transactions-view"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Transactions — PizzaHub Admin",
  description:
    "Review platform transactions, subscription upgrades, and Stripe checkout payments.",
}

export default async function AdminTransactionsPage() {
  // Server-side guard: Only verified admin users can access this page
  await requireRole("admin")

  return <AdminTransactionsView />
}
