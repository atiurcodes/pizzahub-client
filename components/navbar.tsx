"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon, Pizza, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Main public navigation links
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
]

export function Navbar() {
  // Highlight the active page link
  const pathname = usePathname()

  // Dark / Light mode toggle
  const { resolvedTheme, setTheme } = useTheme()

  // Open or close mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
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

        {/* 3. Right Side Actions (Theme Toggle + Auth Links) */}
        {/* Note: Once Better Auth is connected, show Profile Dropdown here when logged in */}
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
          </div>
        </div>
      )}
    </header>
  )
}
