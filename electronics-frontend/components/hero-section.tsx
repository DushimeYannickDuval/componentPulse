import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white py-20 min-h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
          alt="Technology Innovation Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Animated Overlay Elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-400/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-teal-400/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-20 h-20 bg-cyan-400/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-400/10 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your Gateway to
              <span className="text-emerald-400"> Embedded Systems</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Discover premium electronic components, development boards, and everything you need for your embedded
              projects. From Arduino to advanced microcontrollers at componentPulse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <Link href="/products">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>
              <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-emerald-600 hover:bg-white hover:text-gray-900">
                View Catalog
              </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                  <h3 className="text-2xl font-bold mb-4 text-emerald-400">Innovation Meets Technology</h3>
                  <p className="text-gray-200">
                    Where human creativity and artificial intelligence come together to build the future of embedded
                    systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
