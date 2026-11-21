import type { MenuItem } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// ==========================================
// Customer & Public Menu API Services
// ==========================================

/**
 * Fetch approved menu items for customer/public browsing (GET /api/customer/menu)
 * Accessible without login
 */
export async function getPublicMenuItems(): Promise<MenuItem[]> {
  const res = await fetch(`${API_URL}/api/customer/menu`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load public menu items.")
  }

  const data = await res.json()
  return (data.items || []) as MenuItem[]
}

/**
 * Fetch a single menu item by ID for the details page (GET /api/menu/:id)
 */
export async function getPublicMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const res = await fetch(`${API_URL}/api/menu/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return (data.item || null) as MenuItem | null
  } catch (error) {
    console.error("Error fetching single menu item:", error)
    return null
  }
}
