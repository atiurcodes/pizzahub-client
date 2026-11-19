// ==========================================
// PizzaHub Centralized TypeScript Definitions
// ==========================================

// 1. Strictly the 6 exact categories defined in project specifications
export const PIZZA_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

export type PizzaCategory = (typeof PIZZA_CATEGORIES)[number]

// 2. Status types
export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive"
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled"
export type UserRole = "admin" | "vendor" | "customer"
export type SubscriptionPlan = "free" | "premium"

// 3. Menu Item Data (Input payload for creating a menu item)
export interface MenuItemData {
  itemName: string
  category: PizzaCategory | string
  price: number
  location: string
  description: string
  images: string[]
  vendorEmail: string // Sole vendor identifier
}

// 4. Stored Menu Item (Retrieved from MongoDB)
export interface MenuItem extends MenuItemData {
  _id: string
  status: MenuItemStatus
  createdAt: string
}
