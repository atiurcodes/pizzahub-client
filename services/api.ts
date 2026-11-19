import { apiFetch } from "@/lib/api"
import type { MenuItemData } from "@/types"

export type { MenuItemData }

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

export async function createMenuItem(menuData: MenuItemData) {
  return apiFetch("/api/menu", {
    method: "POST",
    body: JSON.stringify(menuData),
  })
}
