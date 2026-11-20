import type { Metadata } from "next"

import { AdminUsersList } from "@/components/dashboard/admin/admin-users-list"
import { requireRole } from "@/lib/auth-guard"

export const metadata: Metadata = {
  title: "Manage Users | PizzaHub Admin",
  description: "View and manage registered platform accounts.",
}

export default async function AdminUsersPage() {
  // Server-side auth & role guard
  await requireRole("admin")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Manage Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all registered customers, vendors, and admins across the platform.
        </p>
      </div>

      {/* Users List Table */}
      <AdminUsersList />
    </div>
  )
}
