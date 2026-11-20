import { apiFetch } from "@/lib/api"
import type { MenuItem } from "@/types"

// ==========================================
// Admin Menu Management Actions
// ==========================================

/**
 * Fetch all menu items for admin review (Admin only, GET /api/admin/menu-items)
 * Supports optional status parameter (e.g. "pending", "approved", or undefined for all)
 */
export async function getAdminMenuItems(status?: string): Promise<MenuItem[]> {
  const query = status ? `?status=${status}` : ""
  const data = await apiFetch(`/api/admin/menu-items${query}`)
  return (data.items || []) as MenuItem[]
}

/**
 * Update a menu item's status (Admin only, PATCH /api/admin/menu-items/:id/status)
 */
export async function updateAdminMenuItemStatus(
  id: string,
  status: "approved" | "rejected" | "pending" | "inactive"
) {
  return apiFetch(`/api/admin/menu-items/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}


