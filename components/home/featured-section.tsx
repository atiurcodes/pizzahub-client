"use client"

import Link from "next/link"
import { ArrowRight, Flame, Pizza, Sparkles } from "lucide-react"
import { motion } from "motion/react"

import { MenuCard } from "@/components/menu/menu-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types"

interface FeaturedSectionProps {
  items: MenuItem[]
}

export function FeaturedSection({ items }: FeaturedSectionProps) {
  // We guarantee at least minimum items or show what is available from DB
  const displayItems = items.slice(0, Math.max(6, items.length))

  return (
    <section className="py-20 bg-background relative overflow-hidden border-t border-border/50">
      {/* Background warm ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full gap-1.5 shadow-xs inline-flex"
            >
              <Flame className="size-3.5 fill-primary text-primary" />
              <span>Chef&apos;s Handcrafted Picks</span>
            </Badge>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Featured Artisan Pizzas
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore freshly baked pies made with slow-fermented dough and authentic local ingredients.
              Featuring verified <span className="font-semibold text-amber-500">Premium Pizzerias</span> first.
            </p>
          </div>

          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full font-bold text-xs sm:text-sm border-border/80 px-6 gap-2 shrink-0 hover:border-primary/40"
            )}
          >
            <span>Explore All Pizzas</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* 6 Featured Menu Item Cards Grid */}
        {displayItems.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-card/50 max-w-lg mx-auto space-y-4">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Pizza className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-foreground">
                Pizzas Are in the Oven!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Our local restaurants are currently prepping delicious wood-fired pies. Check our full menu or check back shortly!
              </p>
            </div>
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ size: "default" }),
                "rounded-full font-semibold text-xs px-5 bg-gradient-to-r from-primary to-tomato text-white"
              )}
            >
              Go to Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="pt-6 text-center">
          <p className="text-xs text-muted-foreground mb-4 flex items-center justify-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            Looking for vegetarian, gluten-free, or meat lovers options?
          </p>
          <Link
            href="/menu"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-gradient-to-r from-primary to-tomato px-8 font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 gap-2"
            )}
          >
            <Pizza className="size-4" />
            <span>View Full Menu &amp; Order</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
