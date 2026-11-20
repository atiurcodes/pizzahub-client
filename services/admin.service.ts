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




