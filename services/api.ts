import { apiFetch } from "@/lib/api"
import type { MenuItem, MenuItemData } from "@/types"

// Re-export types for convenience
export type { MenuItem, MenuItemData }

// ==========================================
// 1. Image Upload Service (ImgBB)
// ==========================================

/**
 * Uploads an image file to ImgBB and returns its hosted public URL.
 * Falls back to a demo placeholder image during development if API key is not yet set.
 */
export async function uploadImage(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

  if (!apiKey) {
    console.warn("NEXT_PUBLIC_IMGBB_API_KEY is not set. Using demo image fallback.")
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591"
  }

  const formData = new FormData()
  formData.append("image", file)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to upload image.")
  }

  return data.data.url as string
}

// ==========================================
// 2. Menu Item API Actions
// ==========================================

/**
 * Create a new menu item (Vendor only, sends POST /api/menu with JWT Bearer)
 */
export async function createMenuItem(menuData: MenuItemData) {
  return apiFetch("/api/menu", {
    method: "POST",
    body: JSON.stringify(menuData),
  })
}

/**
 * Fetch all menu items belonging to the logged-in vendor (Vendor only, GET /api/menu/my-items)
 */
export async function getMyMenuItems(): Promise<MenuItem[]> {
  const data = await apiFetch("/api/menu/my-items")
  return (data.items || []) as MenuItem[]
}

/**
 * Fetch a single menu item by ID (GET /api/menu/:id)
 */
export async function getMenuItemById(id: string): Promise<MenuItem> {
  const data = await apiFetch(`/api/menu/${id}`)
  return data.item as MenuItem
}

/**
 * Update an existing menu item (Vendor only, PATCH /api/menu/:id)
 */
export async function updateMenuItem(
  id: string,
  menuData: Partial<MenuItemData>
) {
  return apiFetch(`/api/menu/${id}`, {
    method: "PATCH",
    body: JSON.stringify(menuData),
  })
}
