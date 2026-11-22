"use client"

import {
  Award,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const VALUE_PROPS = [
  {
    icon: Flame,
    title: "Wood-Fired Artisanal Craft",
    description:
      "48-hour slow-fermented sourdough baked at searing 800°F in volcanic stone ovens for the iconic blistered, airy crust.",
    badge: "Authentic Crust",
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: ShieldCheck,
    title: "100% Verified Local Pizzerias",
    description:
      "We strictly vet independent neighborhood pizza artisans and award verified badges to high-standard kitchens.",
    badge: "Strictly Vetted",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Clock,
    title: "Live Order Status Timeline",
    description:
      "Real-time visual tracking from the moment the kitchen confirms your dough to oven baking and doorstep delivery.",
    badge: "Real-Time Tracking",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Truck,
    title: "Insulated Hot-Box Delivery",
    description:
      "Specially designed thermal delivery keeps cheese bubbling and crusts crispy — never soggy, guaranteed hot.",
    badge: "Piping Hot",
    color: "text-primary bg-primary/10 border-primary/20",
  },
]

const STATS_RIBBON = [
  { value: "48 Hrs", label: "Slow Dough Fermentation", icon: ChefHat },
  { value: "100%", label: "Approved Artisanal Pizzerias", icon: Award },
  { value: "30 Min", label: "Average Oven-to-Door Time", icon: Clock },
  { value: "4.9 / 5", label: "Customer Satisfaction", icon: HeartHandshake },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden border-t border-border/50">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 size-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full gap-1.5 shadow-xs inline-flex"
          >
            <Sparkles className="size-3.5" />
            <span>The PizzaHub Standard</span>
          </Badge>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Why Choose PizzaHub?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We are not a generic delivery app. We are a specialized pizza platform connecting genuine pizza artisans with lovers of hot, authentic slices.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPS.map((prop, idx) => {
            const Icon = prop.icon
            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <Card className="h-full border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`size-12 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform ${prop.color}`}
                      >
                        <Icon className="size-6" />
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold border-border/60 text-muted-foreground"
                      >
                        {prop.badge}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {prop.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/40 flex items-center gap-1.5 text-xs text-primary font-semibold">
                    <CheckCircle2 className="size-3.5" />
                    <span>PizzaHub Certified</span>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Highlight Stats Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-muted/40 to-card p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-border/60">
            {STATS_RIBBON.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className={`space-y-1.5 ${i > 0 ? "pt-4 lg:pt-0" : ""}`}>
                  <div className="inline-flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
                    <Icon className="size-4" />
                  </div>
                  <div className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
