import { apiFetch } from "@/lib/api"
import type { CreateOrderPayload, CustomerOrder, MenuItem } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// ==========================================
// Customer & Public Menu API Services
// ==========================================

export interface MenuQueryParams {
  search?: string
  category?: string
  location?: string
  sort?: string
  sortBy?: string
  sortOrder?: string
}

export interface MenuApiResponse {
  items: MenuItem[]
  locations: string[]
  count: number
}

/**
 * Fetch approved menu items for customer/public browsing (GET /api/customer/menu)
 * Supports query parameters for search, category, location, and price sorting
 */
export async function getPublicMenuItems(
  params?: MenuQueryParams
): Promise<MenuApiResponse> {
  const query = new URLSearchParams()
  if (params?.search && params.search.trim()) {
    query.append("search", params.search.trim())
  }
  if (params?.category && params.category !== "all") {
    query.append("category", params.category)
  }
  if (params?.location && params.location !== "all") {
    query.append("location", params.location)
  }
  if (params?.sort) {
    query.append("sort", params.sort)
  }
  if (params?.sortBy) {
    query.append("sortBy", params.sortBy)
  }
  if (params?.sortOrder) {
    query.append("sortOrder", params.sortOrder)
  }

  const queryString = query.toString() ? `?${query.toString()}` : ""

  const res = await fetch(`${API_URL}/api/customer/menu${queryString}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load public menu items.")
  }

  const data = await res.json()
  return {
    items: (data.items || []) as MenuItem[],
    locations: (data.locations || []) as string[],
    count: Number(data.count ?? 0),
  }
}

/**
 * Fetch featured menu items for homepage (minimum 6 items, prioritizing premium vendors)
 */
export async function getFeaturedMenuItems(limit = 6): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/customer/menu/featured?limit=${limit}`, {
      cache: "no-store",
    })

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.items) && data.items.length > 0) {
        return data.items as MenuItem[]
      }
    }
  } catch (e) {
    console.warn("Featured endpoint unavailable, falling back to general menu:", e)
  }

  // Fallback: fetch from general menu and apply client-side prioritization
  try {
    const res = await getPublicMenuItems()
    const items = res.items || []

    const sorted = [...items].sort((a, b) => {
      const aPremium = a.vendor?.isPremium ? 1 : 0
      const bPremium = b.vendor?.isPremium ? 1 : 0
      if (bPremium !== aPremium) return bPremium - aPremium
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return sorted.slice(0, Math.max(limit, 6))
  } catch (err) {
    console.error("Failed to load featured menu items:", err)
    return []
  }
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

// ==========================================
// Customer Order API Services
// ==========================================

/**
 * Submit a new customer pizza order (POST /api/customer/orders)
 */
export async function createCustomerOrder(payload: CreateOrderPayload): Promise<{
  success: boolean
  message: string
  orderId: string
  order: CustomerOrder
}> {
  return apiFetch("/api/customer/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

/**
 * Fetch all orders placed by the logged-in customer (GET /api/customer/orders)
 */
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const data = await apiFetch("/api/customer/orders")
  return (data.orders || []) as CustomerOrder[]
}

/**
 * Cancel a pending customer order (PATCH /api/customer/orders/:id/cancel)
 */
export async function cancelCustomerOrder(orderId: string): Promise<{
  success: boolean
  message: string
}> {
  return apiFetch(`/api/customer/orders/${orderId}/cancel`, {
    method: "PATCH",
  })
}

export interface CustomerStats {
  totalOrders: number
  pendingOrders: number
  acceptedOrders: number
  rejectedOrders: number
  cancelledOrders: number
}

/**
 * Fetch real-time order statistics for customer dashboard overview (GET /api/customer/stats)
 */
export async function getCustomerStats(): Promise<CustomerStats> {
  const data = await apiFetch("/api/customer/stats")
  return data.stats as CustomerStats
}
