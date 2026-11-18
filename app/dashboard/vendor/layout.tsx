import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireRole } from "@/lib/auth-guard"

export default async function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side guard: only "vendor" users can open any /dashboard/vendor/* route
  const user = await requireRole("vendor")

  return <DashboardShell user={user}>{children}</DashboardShell>
}
