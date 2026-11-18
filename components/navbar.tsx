"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Pizza,
  Settings,
  Sun,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { authClient, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

// Helper: get the right dashboard route for each user role
function getDashboardPath(role?: string | null) {
  if (role === "admin") return "/dashboard/admin"
  if (role === "vendor") return "/dashboard/vendor"
  return "/dashboard/customer"
}

// Helper: get the profile settings route for each user role
function getProfilePath(role?: string | null) {
  if (role === "admin") return "/dashboard/admin"
  if (role === "vendor") return "/dashboard/vendor/profile"
  return "/dashboard/customer/profile"
}

// Helper: get first 1-2 letters of the user's name for avatar fallback
function getInitials(name?: string | null) {
  if (!name) return "U"
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  // Live Better Auth session (automatically updates after sign in / sign out)
  const { data: session, isPending } = useSession()
  const user = session?.user
  const role = user?.role || "customer"

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const dashboardHref = getDashboardPath(role)
  const profileHref = getProfilePath(role)

  // Build navigation links based on login state and role
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
    ...(user ? [{ label: "Dashboard", href: dashboardHref }] : []),
  ]

  // Show a success toast after returning from Google Sign In / Sign Up
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authStatus = params.get("auth")

    if (authStatus === "google-signin" || authStatus === "google-signup") {
      toast.add({
        title:
          authStatus === "google-signup"
            ? "Account created with Google!"
            : "Signed in with Google!",
        description: "Welcome to PizzaHub.",
        type: "success",
      })

      params.delete("auth")
      const cleanUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname
      window.history.replaceState({}, "", cleanUrl)
    }
  }, [pathname])

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // Handle Logout button click
  async function handleLogout() {
    try {
      await authClient.signOut()
      setMobileMenuOpen(false)
      toast.add({
        title: "Signed out",
        description: "You have been logged out of PizzaHub.",
        type: "success",
      })
      router.push("/")
      router.refresh()
    } catch {
      toast.add({
        title: "Logout failed",
        description: "Please try again.",
        type: "error",
      })
    }
  }

  // Hide the public navbar on /dashboard pages (dashboards use their own sidebar layout)
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 1. Brand Logo (Left) */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-tomato text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
            <Pizza className="size-5" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
              Pizza<span className="text-primary">Hub</span>
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-basil" />
              Fresh Wood-Fired
            </span>
          </div>
        </Link>

        {/* 2. Desktop Pill Navigation (Center) */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-border bg-secondary/70 p-1 md:flex"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-card text-primary font-semibold shadow-xs"
                    : "text-foreground/75 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* 3. Right Side Actions (Theme Toggle + Auth or Profile Dropdown) */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark or light theme"
            className="rounded-full text-foreground/80 hover:bg-secondary hover:text-primary"
          >
            <Sun className="hidden size-4 dark:block" />
            <Moon className="block size-4 dark:hidden" />
          </Button>

          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            /* Logged-In Profile Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pr-3.5 pl-1.5 text-sm font-semibold text-foreground shadow-xs transition-colors outline-none hover:border-primary/40 hover:bg-secondary/60">
                <Avatar size="default">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary/15 font-bold text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate">{user.name}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-60 rounded-2xl p-2"
              >
                {/* User Info Header */}
                <div className="px-2.5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground capitalize">
                      {role}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                {/* Dashboard Link */}
                <DropdownMenuItem
                  onClick={() => router.push(dashboardHref)}
                  className="cursor-pointer rounded-xl px-2.5 py-2"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </DropdownMenuItem>

                {/* Profile Settings Link */}
                <DropdownMenuItem
                  onClick={() => router.push(profileHref)}
                  className="cursor-pointer rounded-xl px-2.5 py-2"
                >
                  <Settings className="size-4" />
                  Profile Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout Button */}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl px-2.5 py-2"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged-Out Buttons */
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/85 transition-colors hover:bg-secondary hover:text-primary"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 rounded-full bg-gradient-to-r from-primary to-tomato px-6 font-semibold shadow-md shadow-primary/20 transition-all hover:opacity-95"
                )}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* 4. Mobile Action Buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark or light theme"
            className="rounded-full"
          >
            <Sun className="hidden size-4 dark:block" />
            <Moon className="block size-4 dark:hidden" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="rounded-full"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* 5. Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 pt-3 pb-5 md:hidden">
          {/* Show logged-in user summary at top of mobile menu */}
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <Avatar size="lg">
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
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground capitalize">
                {role}
              </span>
            </div>
          )}

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-primary font-semibold"
                      : "text-foreground/85 hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 w-full justify-start gap-2 rounded-xl px-4"
                  )}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
                <Link
                  href={profileHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 w-full justify-start gap-2 rounded-xl px-4"
                  )}
                >
                  <Settings className="size-4" />
                  Profile Settings
                </Link>
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  onClick={handleLogout}
                  className="h-11 w-full justify-start gap-2 rounded-xl px-4"
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 w-full justify-center rounded-full"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 w-full justify-center rounded-full bg-gradient-to-r from-primary to-tomato font-semibold"
                  )}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
