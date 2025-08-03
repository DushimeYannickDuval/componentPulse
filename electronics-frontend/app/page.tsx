import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import { CategoryGrid } from "@/components/category-grid"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Footer } from "@/components/footer"
import WhatsAppChat from "@/components/whatsAppChat"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
      <NewsletterSignup />
      <Footer />
    </div>
  )
}
