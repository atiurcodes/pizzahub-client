import type { Metadata } from "next"

import { CustomerProfileForm } from "@/components/dashboard/customer/customer-profile-form"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Profile Settings — PizzaHub Customer",
  description:
    "Manage your personal customer profile, update display name, and avatar picture.",
}

export default async function CustomerProfilePage() {
  // Server-side guard: Only logged-in customers can access
  const user = await requireRole("customer")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Customer Profile Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Manage your personal customer account details and profile display settings.
        </p>
      </div>

      {/* Profile Form */}
      <CustomerProfileForm initialUser={user} />
    </div>
  )
}
