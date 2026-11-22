"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Beef,
  Coffee,
  Crown,
  Layers,
  Leaf,
  Pizza,
  UtensilsCrossed,
} from "lucide-react"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// The 6 exact categories defined in AGENTS.md with curated imagery and descriptions
const CATEGORIES_DATA = [
  {
    name: "Classic Pizzas",
    tagline: "Timeless Neapolitan, Margherita & Pepperoni icons baked on sourdough crust.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
    icon: Pizza,
    accent: "from-amber-500/20 to-primary/10",
    badge: "Most Popular",
  },
  {
    name: "Vegetarian Pizzas",
    tagline: "Farm-fresh bell peppers, wild mushrooms, olives, spinach & rich mozzarella.",
    image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&auto=format&fit=crop&q=80",
    icon: Leaf,
    accent: "from-emerald-500/20 to-basil/10",
    badge: "Plant-Based",
  },
  {
    name: "Meat Lovers",
    tagline: "Generously loaded with spicy pepperoni, Italian sausage, bacon & minced beef.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80",
    icon: Beef,
    accent: "from-red-500/20 to-tomato/10",
    badge: "High Protein",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    tagline: "Truffle glaze, creamy burrata, artisanal prosciutto & wood-smoked artisan crusts.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    icon: Crown,
    accent: "from-purple-500/20 to-amber-500/10",
    badge: "Chef Signature",
  },
  {
    name: "Sides & Appetizers",
    tagline: "Golden garlic knots, cheesy mozzarella sticks, seasoned potato wedges & wings.",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&auto=format&fit=crop&q=80",
    icon: UtensilsCrossed,
    accent: "from-orange-500/20 to-amber-500/10",
    badge: "Crispy Bites",
  },
  {
    name: "Beverages & Desserts",
    tagline: "Chilled craft Italian sodas, creamy tiramisu, and decadent molten lava cakes.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    icon: Coffee,
    accent: "from-blue-500/20 to-indigo-500/10",
    badge: "Sweet & Cold",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden border-t border-border/50">
      {/* Background radial accent */}
      <div className="absolute bottom-0 right-1/4 size-80 rounded-full bg-tomato/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full gap-1.5 shadow-xs inline-flex"
          >
            <Layers className="size-3.5" />
            <span>Interactive Exploration</span>
          </Badge>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Explore by Pizza Category
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Whether you crave traditional wood-fired crusts, loaded carnivore feasts, or artisan gourmet creations — browse our handcrafted styles.
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES_DATA.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.07,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <Link
                  href={`/menu?category=${encodeURIComponent(cat.name)}`}
                  className="group block h-full focus:outline-none"
                >
                  <Card className="h-full overflow-hidden border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                    {/* Top Image Banner */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-108"
                        unoptimized
                      />

                      {/* Dark overlay for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-md shadow-xs text-[10px] font-bold border-border/60">
                          {cat.badge}
                        </Badge>
                      </div>

                      {/* Floating Category Icon Button */}
                      <div className="absolute bottom-3 left-3 size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30 group-hover:rotate-6 transition-transform">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-heading font-extrabold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                          <span>{cat.name}</span>
                          <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {cat.tagline}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                        <span>Browse pizzas &amp; items</span>
                        <span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
                          View Menu →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
