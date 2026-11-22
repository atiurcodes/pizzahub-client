import { redirect } from "next/navigation"

import { requireAuth } from "@/lib/auth-guard"

export default async function ProfilePage() {
  const user = await requireAuth()

  if (user.role === "admin") {
    redirect("/dashboard/admin/profile")
  }

  if (user.role === "vendor") {
    redirect("/dashboard/vendor/profile")
  }

  redirect("/dashboard/customer/profile")
}
