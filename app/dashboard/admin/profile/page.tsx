import type { Metadata } from "next"

import { AdminProfileForm } from "@/components/dashboard/admin/admin-profile-form"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Admin Profile Settings — PizzaHub Admin",
  description: "Manage your administrator account details and platform preferences.",
}

export default async function AdminProfilePage() {
  // Server-side guard: Only verified admin users can access this page
  const user = await requireRole("admin")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          Admin Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your administrator profile details and view system moderation authority.
        </p>
      </div>

      {/* Admin Profile Form Component */}
      <AdminProfileForm initialUser={user} />
    </div>
  )
}
