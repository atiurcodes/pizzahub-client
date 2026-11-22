import type { Metadata } from "next"

import { CustomerOverviewView } from "@/components/dashboard/customer/customer-overview-view"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Customer Overview | PizzaHub",
  description: "Track your pizza orders, spending, and recent activity.",
}

export default async function CustomerOverviewPage() {
  const user = await requireRole("customer")

  return <CustomerOverviewView userName={user.name} />
}
