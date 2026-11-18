"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Flame, Star, Store } from "lucide-react"
import { motion } from "motion/react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Highlight metrics shown under the hero buttons
const heroStats = [
  { icon: Star, value: "4.9/5", label: "Customer Rating", accent: "text-amber-400" },
  { icon: Clock, value: "30 min", label: "Avg. Delivery", accent: "text-orange-400" },
  { icon: Store, value: "50+", label: "Local Pizzerias", accent: "text-emerald-400" },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] w-full items-center overflow-hidden bg-[#14100D]">
      {/* 1. Full-Bleed Wood-Fired Pizza Background */}
      <Image
        src="/images/hero-pizza.jpg"
        alt="Freshly baked wood-fired Neapolitan pizza on a rustic wooden board"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* 2. Dark Ember Gradient Overlay (keeps text crisp and readable) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#140E0A]/95 via-[#18100B]/78 to-[#140E0A]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A]/80 via-transparent to-[#140E0A]/30" />

      {/* 3. Main Left Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Live Status Pill with Basil Green Dot */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-xs font-semibold tracking-wide text-orange-100">
              Hot Ovens Open Now • Neighborhood Delivery
            </span>
          </div>

          {/* Bold Modern Display Headline */}
          <h1 className="font-heading text-4xl leading-[1.06] font-extrabold tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            Hot &amp; Fresh Pizza.
            <span className="block bg-gradient-to-r from-[#FDBA74] via-[#FB923C] to-[#EA580C] bg-clip-text text-transparent">
              Wood-Fired Locally.
            </span>
            Delivered to Your Door.
          </h1>

          {/* Short Supporting Description */}
          <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-200 sm:text-lg">
            Browse authentic neighborhood pizzerias, pick your favorite cheesy
            pies, crispy sides, and cold drinks — delivered piping hot right on
            schedule.
          </p>

          {/* Primary & Secondary Pill Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full bg-gradient-to-r from-primary to-tomato px-8 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 hover:opacity-95"
              )}
            >
              Explore Pizza Menu
              <ArrowRight className="ml-1.5 size-4" />
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Become a Vendor
            </Link>
          </div>

          {/* Quick Trust Stats Strip */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-7">
            {heroStats.map((stat) => {
              const Icon = stat.icon

              return (
                <div key={stat.label} className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <Icon className={cn("size-4", stat.accent)} />
                    <span className="font-heading text-lg font-bold text-white sm:text-xl">
                      {stat.value}
                    </span>
                  </div>
                  <span className="mt-0.5 text-xs text-stone-300">
                    {stat.label}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* 4. Floating Freshness Card (Bottom Right on Tablet & Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="absolute right-6 bottom-6 z-10 hidden items-center gap-3.5 rounded-2xl border border-white/20 bg-card/95 px-4 py-3.5 text-card-foreground shadow-2xl backdrop-blur-md sm:flex lg:right-10 lg:bottom-10"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-tomato/15 text-primary">
          <Flame className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-sm font-bold leading-tight">
              Baked Fresh to Order
            </p>
            <span className="rounded-full bg-basil/15 px-2 py-0.5 text-[10px] font-bold text-basil">
              LIVE
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Verified local pizza shops near you
          </p>
        </div>
      </motion.div>
    </section>
  )
}
