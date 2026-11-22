import type { Metadata } from "next"

import { VendorOverviewView } from "@/components/dashboard/vendor/vendor-overview-view"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Vendor Overview | PizzaHub",
  description:
    "Manage your pizza shop menu items, incoming orders, and subscription.",
}

export default async function VendorOverviewPage() {
  const user = await requireRole("vendor")

  return <VendorOverviewView user={user} />
}
