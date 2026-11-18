import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireRole } from "@/lib/auth-guard"

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side guard: only "customer" users can open any /dashboard/customer/* route
  const user = await requireRole("customer")

  return <DashboardShell user={user}>{children}</DashboardShell>
}
