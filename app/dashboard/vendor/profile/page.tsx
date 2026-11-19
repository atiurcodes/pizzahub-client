import type { Metadata } from "next"

import { VendorProfileForm } from "@/components/dashboard/vendor-profile-form"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Profile Settings — PizzaHub Vendor",
  description: "Manage your restaurant identity, public profile, and contact details.",
}

export default async function VendorProfilePage() {
  // Server-side guard: fetches fresh user data directly from the verified session
  const user = await requireRole("vendor")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your restaurant brand identity, owner contact details, and view your subscription status.
        </p>
      </div>

      {/* Profile Form & Overview */}
      <VendorProfileForm initialUser={user} />
    </div>
  )
}
