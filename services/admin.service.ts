import { apiFetch } from "@/lib/api"
import type { MenuItem, PlatformUser, TransactionItem } from "@/types"

// ==========================================
// Admin Overview / Stats Actions
// ==========================================

export interface AdminStats {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalMenuItems: number
  pendingMenuItems: number
  approvedMenuItems: number
  totalTransactions: number
}

/**
 * Fetch real-time platform statistics for admin dashboard overview
 */
export async function getAdminStats(): Promise<AdminStats> {
  const data = await apiFetch("/api/admin/stats")
  return data.stats
}

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

/**
 * Delete any menu item (Admin only, DELETE /api/admin/menu-items/:id)
 */
export async function deleteAdminMenuItem(id: string) {
  return apiFetch(`/api/admin/menu-items/${id}`, {
    method: "DELETE",
  })
}

// ==========================================
// Admin User Management Actions
// ==========================================

/**
 * Fetch registered users with backend query filtering (GET /api/admin/users?role=...&search=...)
 */
export async function getAdminUsers(params?: {
  role?: string
  search?: string
}): Promise<PlatformUser[]> {
  const query = new URLSearchParams()
  if (params?.role && params.role !== "all") {
    query.set("role", params.role)
  }
  if (params?.search && params.search.trim()) {
    query.set("search", params.search.trim())
  }

  const queryString = query.toString() ? `?${query.toString()}` : ""
  const data = await apiFetch(`/api/admin/users${queryString}`)
  return (data.users || []) as PlatformUser[]
}

/**
 * Toggle user blocked status (Admin only, PATCH /api/admin/users/:id/block)
 */
export async function toggleUserBlockStatus(
  id: string
): Promise<{ success: boolean; isBlocked: boolean; message: string }> {
  return apiFetch(`/api/admin/users/${id}/block`, {
    method: "PATCH",
  })
}

// ==========================================
// Admin Transactions Actions (Strictly Read-Only)
// ==========================================

export interface AdminTransactionsResponse {
  transactions: TransactionItem[]
  count: number
  totalRevenue: number
}

/**
 * Fetch all platform subscription transactions (Admin only, Strictly Read-Only)
 */
export async function getAdminTransactions(params?: {
  search?: string
  status?: string
}): Promise<AdminTransactionsResponse> {
  const query = new URLSearchParams()
  if (params?.search && params.search.trim()) {
    query.set("search", params.search.trim())
  }
  if (params?.status && params.status !== "all") {
    query.set("status", params.status)
  }

  const queryString = query.toString() ? `?${query.toString()}` : ""
  const data = await apiFetch(`/api/admin/transactions${queryString}`)
  return {
    transactions: (data.transactions || []) as TransactionItem[],
    count: Number(data.count ?? 0),
    totalRevenue: Number(data.totalRevenue ?? 0),
  }
}





