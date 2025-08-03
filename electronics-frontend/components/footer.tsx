import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Instagram, Mail, Phone } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest products and exclusive deals delivered to your inbox</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
<div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
  <img
    src="/images/Cp logo.png"
    alt="Component Pulse Logo"
    className="w-8 h-8 object-contain"
  />
</div>

              <div>
                <h3 className="font-bold text-lg">componentPulse</h3>
                <p className="text-sm text-gray-400">Innovation Without Limits</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for electronic components and embedded systems development in Uganda.
            </p>
<div className="flex gap-4">
  <a
    href="https://twitter.com/@yannick_dushime"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button size="sm" variant="ghost" className="p-2">
      <Twitter className="h-5 w-5" />
    </Button>
  </a>

  <a
    href="https://instagram.com/@yannick_dudu"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button size="sm" variant="ghost" className="p-2">
      <Instagram className="h-5 w-5" />
    </Button>
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/products" className="block text-gray-400 hover:text-white transition-colors">
                All Products
              </Link>
              <Link href="/categories" className="block text-gray-400 hover:text-white transition-colors">
                Categories
              </Link>
              {/* <Link href="/deals" className="block text-gray-400 hover:text-white transition-colors">
                Special Deals
              </Link>
              <Link href="/new-arrivals" className="block text-gray-400 hover:text-white transition-colors">
                New Arrivals
              </Link>
              <Link href="/bestsellers" className="block text-gray-400 hover:text-white transition-colors">
                Best Sellers
              </Link>*/}

              <Link href="/training" className="block text-gray-400 hover:text-white transition-colors">
                Training (Coming Soon)
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <div className="space-y-2">
              <Link href="/support" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>

              {/*<Link href="/shipping" className="block text-gray-400 hover:text-white transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="block text-gray-400 hover:text-white transition-colors">
                Returns & Exchanges
              </Link>
              <Link href="/warranty" className="block text-gray-400 hover:text-white transition-colors">
                Warranty
              </Link>
              <Link href="/faq" className="block text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>*/}

              <Link href="/support" className="block text-gray-400 hover:text-white transition-colors">
                Technical Support
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+256 790 270 840">
                <p className="block text-gray-400 hover:text-white transition-colors">+256 790 270 840</p>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=componentpulse@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
    >
                <p className="block text-gray-400 hover:text-white transition-colors">componentpulse@gmail.com</p>
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <h5 className="font-medium mb-3">Payment Options</h5>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-800 px-3 py-1 rounded text-sm">MTN Money</div>
                <div className="bg-gray-800 px-3 py-1 rounded text-sm">Airtel Money</div>
                <div className="bg-gray-800 px-3 py-1 rounded text-sm">Pay on Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2025 componentPulse Uganda. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
