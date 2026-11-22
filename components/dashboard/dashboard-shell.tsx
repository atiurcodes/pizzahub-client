"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ClipboardList,
  CreditCard,
  Crown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Pizza,
  PlusCircle,
  Settings,
  ShoppingBag,
  Sun,
  Users,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { clearAuthToken } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import type { DashboardUser, UserRole } from "@/lib/auth-guard"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// Role-specific sidebar links (matches AGENTS.md dashboard requirements)
const sidebarLinksByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Manage Menu Items",
      href: "/dashboard/admin/menu-items",
      icon: UtensilsCrossed,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/admin/profile",
      icon: Settings,
    },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    {
      label: "My Menu Items",
      href: "/dashboard/vendor/menu-items",
      icon: UtensilsCrossed,
    },
    {
      label: "Add Menu Item",
      href: "/dashboard/vendor/add-item",
      icon: PlusCircle,
    },
    {
      label: "Customer Orders",
      href: "/dashboard/vendor/orders",
      icon: ClipboardList,
    },
    {
      label: "Subscription",
      href: "/dashboard/vendor/subscription",
      icon: Crown,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/vendor/profile",
      icon: Settings,
    },
  ],
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    {
      label: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/customer/profile",
      icon: Settings,
    },
  ],
}

const roleTitleMap: Record<UserRole, string> = {
  admin: "Admin Panel",
  vendor: "Vendor Studio",
  customer: "Customer Hub",
}

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

interface DashboardShellProps {
  user: DashboardUser
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = sidebarLinksByRole[user.role]
  const roleTitle = roleTitleMap[user.role]

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  async function handleLogout() {
    try {
      await authClient.signOut()
      clearAuthToken()
      toast.add({
        title: "Signed out",
        description: "You have been logged out of PizzaHub.",
        type: "success",
      })
      router.push("/sign-in")
      router.refresh()
    } catch {
      toast.add({
        title: "Logout failed",
        description: "Please try again.",
        type: "error",
      })
    }
  }

  // Reusable sidebar inner content (shared between desktop and mobile drawer)
  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-tomato text-primary-foreground shadow-sm shadow-primary/25">
            <Pizza className="size-5" />
          </div>
          <div className="leading-none">
            <p className="font-heading text-lg font-extrabold tracking-tight">
              Pizza<span className="text-primary">Hub</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {roleTitle}
            </p>
          </div>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          className="rounded-full lg:hidden"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Role Navigation Links */}
      <nav aria-label="Dashboard navigation" className="flex-1 space-y-1.5 p-4">
        <p className="px-3 pb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-primary to-tomato text-primary-foreground font-semibold shadow-sm shadow-primary/25"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Quick Site Links */}
        <div className="pt-5">
          <p className="px-3 pb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            Quick Links
          </p>
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Home className="size-4 shrink-0" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/menu"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Pizza className="size-4 shrink-0" />
            <span>Browse Menu</span>
          </Link>
        </div>
      </nav>

      {/* Bottom User Profile Block + Logout */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-card p-3">
          <Avatar size="default">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/15 font-bold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="lg"
          onClick={handleLogout}
          className="mt-3 h-10 w-full justify-center gap-2 rounded-xl text-sm font-semibold"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-svh w-full bg-background">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden w-68 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-svh">{sidebarContent}</div>
      </aside>

      {/* Mobile & Tablet Slide-Over Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <aside className="relative z-10 h-full w-72 max-w-[82vw] border-r border-sidebar-border shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Dashboard Header Bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open dashboard menu"
              className="rounded-xl lg:hidden"
            >
              <Menu className="size-5" />
            </Button>

            <div>
              <h2 className="font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {roleTitle}
              </h2>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Welcome back, {user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Vendor Subscription Badge */}
            {user.role === "vendor" && (
              <span
                className={cn(
                  "hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold sm:inline-flex",
                  user.subscriptionPlan === "premium"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <Crown className="size-3.5" />
                {user.subscriptionPlan === "premium"
                  ? "Premium Plan"
                  : "Free Plan"}
              </span>
            )}

            {/* Theme Toggle Pill Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle dark or light theme"
              className="h-9 gap-2 rounded-full border-border bg-card px-3.5 text-xs font-semibold text-foreground shadow-xs hover:bg-secondary hover:text-primary"
            >
              <Sun className="hidden size-4 text-amber-500 dark:block" />
              <Moon className="block size-4 text-primary dark:hidden" />
              <span className="hidden dark:inline">Light Mode</span>
              <span className="inline dark:hidden">Dark Mode</span>
            </Button>

            {/* User Role Pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold capitalize">
              <span className="size-2 rounded-full bg-basil" />
              {user.role}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  )
}
