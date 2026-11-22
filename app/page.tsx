import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedSection } from "@/components/home/featured-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"
import { getFeaturedMenuItems } from "@/services/customer.service"

// Ensure fresh data on every request
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const featuredItems = await getFeaturedMenuItems(6)

  return (
    <>
      <HeroSection />
      <FeaturedSection items={featuredItems} />
      <CategoriesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
    </>
  )
}
