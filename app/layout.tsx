import { Suspense } from "react"
import type { Metadata } from "next"
import { Bricolage_Grotesque, DM_Sans, Geist_Mono } from "next/font/google"

import { AuthToastListener } from "@/components/auth-toast-listener"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

import "./globals.css"

// Modern, clean body font
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Bold, distinctive display font for headings & brand wordmark
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "PizzaHub — Hot & Fresh Pizza Delivered to Your Door",
  description:
    "Discover local pizza shops, browse fresh wood-fired menus, and order your favorite slices delivered hot to your door.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans",
        dmSans.variable,
        bricolageGrotesque.variable,
        fontMono.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Toaster>
            <Suspense fallback={null}>
              <AuthToastListener />
            </Suspense>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  )
}
