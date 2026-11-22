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

// 3. Vendor Public Profile
export interface VendorPublicInfo {
  name: string
  businessName: string
  email: string
  subscriptionPlan: SubscriptionPlan
  isPremium: boolean
  image?: string | null
}

// 4. Menu Item Data (Input payload for creating a menu item)
export interface MenuItemData {
  itemName: string
  category: PizzaCategory | string
  price: number
  location: string
  description: string
  images: string[]
  vendorEmail: string // Sole vendor identifier
}

// 5. Stored Menu Item (Retrieved from MongoDB)
export interface MenuItem extends MenuItemData {
  _id: string
  status: MenuItemStatus
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  vendor?: VendorPublicInfo | null
}

// 6. Platform User Account (Retrieved from MongoDB for Admin)
export interface PlatformUser {
  _id: string
  name: string
  email: string
  role: UserRole
  image?: string | null
  isBlocked: boolean
  businessName?: string | null
  subscriptionPlan?: SubscriptionPlan
  createdAt: string
  updatedAt?: string
}

// 7. Customer Order Data
export interface CreateOrderPayload {
  itemId: string
  deliveryDate: string
  deliveryAddress: string
  message?: string
  quantity?: number
}

export interface CustomerOrder {
  _id: string
  itemId: string
  itemName: string
  itemImage?: string | null
  category: string
  unitPrice: number
  quantity: number
  totalPrice: number
  vendorId?: string | null
  vendorEmail: string
  vendorName: string
  customerId: string
  customerName: string
  customerEmail: string
  deliveryDate: string
  deliveryAddress: string
  message?: string
  status: OrderStatus
  createdAt: string
  cancelledAt?: string
  updatedAt?: string
}

// 8. Subscription Transaction (Admin Read-Only)
export interface TransactionItem {
  _id: string
  vendorId?: string
  vendorEmail: string
  vendorName?: string
  businessName?: string
  vendorImage?: string | null
  plan: "premium" | string
  amount: number
  currency: string
  stripeSessionId: string
  stripeSubscriptionId?: string
  status: string
  createdAt: string
}

