import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireRole } from "@/lib/auth-guard"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side guard: only "admin" users can open any /dashboard/admin/* route
  const user = await requireRole("admin")

  return <DashboardShell user={user}>{children}</DashboardShell>
}
