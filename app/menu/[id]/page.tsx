import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { ItemDetailsView } from "@/components/menu/item-details-view"
import { auth } from "@/lib/auth"
import { getPublicMenuItemById } from "@/services/customer.service"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MenuItemDetailsPage({ params }: PageProps) {
  const { id } = await params

  // 1. Check session (AGENTS.md Requirement: Redirect to Sign In if unauthenticated)
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/menu/${id}`)
  }

  // 2. Fetch the menu item
  const item = await getPublicMenuItemById(id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <ItemDetailsView
        item={item}
        currentUser={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }}
      />
    </div>
  )
}
