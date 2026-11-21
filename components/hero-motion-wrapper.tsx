"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

interface HeroMotionWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * Isolated client wrapper for Framer Motion / Motion animation.
 * Allows the parent HeroSection to remain a pure Server Component.
 */
export function HeroMotionWrapper({
  children,
  className,
}: HeroMotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
