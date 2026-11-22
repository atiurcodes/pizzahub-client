import type { Metadata } from "next"

import { CustomerOrdersView } from "@/components/dashboard/customer/customer-orders-view"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "My Orders — PizzaHub Customer",
  description:
    "Track your live pizza orders, view delivery status timelines, and manage your orders.",
}

export default async function CustomerOrdersPage() {
  // Server-side guard: Only logged-in customers can access
  await requireRole("customer")

  return <CustomerOrdersView />
}
