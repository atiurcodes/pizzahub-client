import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { ItemDetailsView } from "@/components/menu/item-details-view"
import { auth } from "@/lib/auth"
import { getPublicMenuItemById } from "@/services/customer.service"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const item = await getPublicMenuItemById(id)

  if (!item) {
    return {
      title: "Pizza Not Found | PizzaHub",
      description: "The requested pizza item could not be found on PizzaHub.",
    }
  }

  return {
    title: `${item.itemName} ($${Number(item.price).toFixed(2)}) | PizzaHub Menu`,
    description: item.description.slice(0, 160),
    openGraph: {
      title: `${item.itemName} | Handcrafted Pizza`,
      description: item.description,
      images: item.images && item.images.length > 0 ? [item.images[0]] : [],
    },
  }
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
