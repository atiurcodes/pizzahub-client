"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  Pizza,
} from "lucide-react"

// Exact 6 categories from AGENTS.md
const CATEGORY_LINKS = [
  { label: "Classic Pizzas", href: "/menu?category=Classic%20Pizzas" },
  { label: "Vegetarian Pizzas", href: "/menu?category=Vegetarian%20Pizzas" },
  { label: "Meat Lovers", href: "/menu?category=Meat%20Lovers" },
  {
    label: "Specialty / Gourmet",
    href: "/menu?category=Specialty%20%2F%20Gourmet%20Pizzas",
  },
  { label: "Sides & Appetizers", href: "/menu?category=Sides%20%26%20Appetizers" },
  { label: "Beverages & Desserts", href: "/menu?category=Beverages%20%26%20Desserts" },
]

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Full Menu", href: "/menu" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Create Customer Account", href: "/sign-up" },
  { label: "Partner as a Vendor", href: "/sign-up?role=vendor" },
]

/**
 * Modern SVG icon for X (formerly Twitter) per AGENTS.md requirement
 * "use the new X logo, NOT the old Twitter bird"
 */
function XSocialIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "size-4"}
      aria-label="X (formerly Twitter)"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "size-4"}
      aria-label="Facebook"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "size-4"}
      aria-label="Instagram"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "size-4"}
      aria-label="YouTube"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function Footer() {
  const pathname = usePathname()

  // Hide the global public footer on /dashboard routes (dashboards use their own shell)
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/80 bg-card text-foreground">
      {/* Main Multi-Column Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand Info (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-tomato text-white shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
                <Pizza className="size-5" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
                  Pizza<span className="text-primary">Hub</span>
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  Fresh Wood-Fired
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              PizzaHub is a dedicated pizza ordering and delivery platform connecting independent artisanal pizzerias with pizza lovers. Fresh sourdough, authentic ovens, and hot doorstep delivery.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-foreground">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ovens Open &amp; Baking • Neighborhood Delivery</span>
            </div>
          </div>

          {/* Column 2: Explore Categories */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold tracking-tight text-foreground uppercase">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold tracking-tight text-foreground uppercase">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Kitchen Info */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold tracking-tight text-foreground uppercase">
              Contact &amp; Hours
            </h4>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>120 Wood-Fired Way, Artisan District</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary shrink-0" />
                <span>+1 (800) 749-9248 (PIZZAHUB)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary shrink-0" />
                <span>support@pizzahub.com</span>
              </p>
              <p className="flex items-center gap-2 pt-1 text-[11px] font-medium text-foreground">
                <Clock className="size-3.5 text-amber-500 shrink-0" />
                <span>Mon – Sun: 11:00 AM – 11:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <span>© {currentYear} PizzaHub Platform. Handcrafted with</span>
            <Heart className="size-3 text-primary fill-primary inline" />
            <span>for authentic pizza lovers.</span>
          </p>

          {/* Social Links (Strictly modern X logo per AGENTS.md) */}
          <div className="flex items-center gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow PizzaHub on X"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            >
              <XSocialIcon className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow PizzaHub on Facebook"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow PizzaHub on Instagram"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch PizzaHub on YouTube"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            >
              <YouTubeIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
