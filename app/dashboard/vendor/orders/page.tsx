import type { Metadata } from "next"

import { VendorOrdersView } from "@/components/dashboard/vendor/vendor-orders-view"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Customer Orders — PizzaHub Vendor",
  description:
    "Review incoming pizza delivery orders from hungry customers and accept or decline requests.",
}

export default async function VendorOrdersPage() {
  // Server-side guard: Only logged-in vendors can access
  await requireRole("vendor")

  return <VendorOrdersView />
}
