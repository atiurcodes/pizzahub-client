import { HeroSection } from "@/components/hero-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { getFeaturedMenuItems } from "@/services/customer.service"

// Ensure fresh data on every request
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const featuredItems = await getFeaturedMenuItems(6)

  return (
    <>
      <HeroSection />
      <FeaturedSection items={featuredItems} />
    </>
  )
}
