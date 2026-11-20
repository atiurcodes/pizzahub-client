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
