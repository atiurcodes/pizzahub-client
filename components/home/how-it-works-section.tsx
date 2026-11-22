"use client"

import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Pizza,
  Search,
  Truck,
  Utensils,
} from "lucide-react"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    step: "01",
    title: "Discover Local Pizzerias",
    tagline: "Explore artisanal crusts & recipes",
    description:
      "Browse verified neighborhood pizza shops. Filter by authentic categories, price, or location to find the perfect wood-fired kitchen.",
    icon: Search,
    color: "from-orange-500 to-amber-500",
  },
  {
    step: "02",
    title: "Customize & Submit Order",
    tagline: "Set delivery date & kitchen instructions",
    description:
      "Select your favorite pies and sides. Choose your desired delivery date, drop-off address, and add custom baking notes for the pizzaiolo.",
    icon: Utensils,
    color: "from-primary to-tomato",
  },
  {
    step: "03",
    title: "Track Live & Enjoy Hot",
    tagline: "Real-time timeline right to your table",
    description:
      "Watch your order progress through our Order Status Timeline from pending review to oven baking and hot thermal delivery.",
    icon: Truck,
    color: "from-emerald-600 to-basil",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/40 relative overflow-hidden border-t border-border/50">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full gap-1.5 shadow-xs inline-flex"
          >
            <Compass className="size-3.5" />
            <span>Simple 3-Step Journey</span>
          </Badge>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            How PizzaHub Works
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From discovering independent wood-fired pizzerias to tracking live oven progress — ordering hot pizza has never been easier.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.12,
                  ease: "easeOut",
                }}
                className="h-full relative"
              >
                <Card className="h-full border-border/70 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden">
                  {/* Faint Step Number Watermark */}
                  <div className="absolute -top-3 -right-2 text-6xl font-heading font-black text-foreground/5 select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                    {step.step}
                  </div>

                  <div className="space-y-5">
                    {/* Step Icon & Number Badge */}
                    <div className="flex items-center justify-between">
                      <div className="size-13 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xs">
                        <Icon className="size-6" />
                      </div>

                      <span className="font-heading font-extrabold text-sm px-3 py-1 rounded-full bg-muted border border-border/60 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                        Step {step.step}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs font-semibold text-primary/80">
                        {step.tagline}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-border/50 flex items-center text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Seamless &amp; Fast</span>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Call-to-Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-tomato/5 to-accent/30 p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-6 shadow-xs"
        >
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
            <Pizza className="size-7" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
              Hungry for genuine wood-fired pizza?
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Skip the long queues. Order from verified artisan pizzerias in your area and enjoy hot, crispy crusts at home.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-gradient-to-r from-primary to-tomato px-8 font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 gap-2"
              )}
            >
              <Pizza className="size-4" />
              <span>Explore Pizza Menu</span>
            </Link>

            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full font-bold px-6 border-border/80 hover:border-primary/50"
              )}
            >
              <span>Join as Customer or Vendor</span>
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
