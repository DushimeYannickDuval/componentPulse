"use client"

import type React from "react"
import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ShoppingCart, User, Menu, X, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthModal } from "@/components/auth-modal"
import { fetchCategories } from "@/lib/category-api"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin")
  const { state } = useCart()
  const router = useRouter()
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([])

   useEffect(() => {
   fetchCategories().then((data) => {
   setDynamicCategories(["All", ...data])
  })
    }, [])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const openAuthModal = (tab: "signin" | "signup") => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-slate-800 dark:bg-slate-900 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white-600" />
                  <a href="tel:+256 790 270 840
                  "
                     target="_blank"
                     rel="noopener noreferrer">
                    <span>+256 790 270 840</span>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                      <a href="https://wa.me/+256 790 270 840"
                         target="_blank"
                         rel="noopener noreferrer">
                        <span>Chat on WhatsApp</span>
                      </a>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <span>Free delivery within Kampala for orders above UGX 500,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
{/* Logo */}
<Link href="/" className="flex items-center gap-2">
  {/* Replace text logo with an image */}
  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
    <img
      src="/images/Cp logo.png" 
      alt="Component Pulse Logo"
      className="w-10 h-10 object-contain"
    />
  </div>

  {/* Brand Name and Tagline */}
  <div>
    <h1 className="font-bold text-xl text-foreground">componentPulse</h1>
    <p className="text-xs text-muted-foreground">Innovation Without Limits.</p>
  </div>
</Link>


            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for components, boards, sensors..."
                  className="pl-10 pr-20 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8">
                  Search
                </Button>
              </form>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User className="h-5 w-5 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openAuthModal("signin")}>Sign In</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openAuthModal("signup")}>Create Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {state.itemCount}
                    </Badge>
                  )}
                  <span className="hidden md:inline ml-2">Cart</span>
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search components..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="hidden md:flex items-center gap-8 py-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-medium">
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {dynamicCategories.map((category) => (
                    <DropdownMenuItem key={category} asChild>
                      <Link
                        href={category === "All" ? "/products" : `/products?category=${encodeURIComponent(category)}`}
                        className="w-full cursor-pointer"
                      >
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/products" className="font-medium hover:text-primary">
                Products
              </Link>
              <Link href="/deals" className="font-medium hover:text-primary">
                Deals
              </Link>
              <Link href="/training" className="font-medium hover:text-primary">
                Training
              </Link>
              <Link href="/about" className="font-medium hover:text-primary">
                About
              </Link>
              <Link href="/support" className="font-medium hover:text-primary">
                Contact & Support
              </Link>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t">
                <div className="flex flex-col gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="justify-start font-medium">
                      Categories
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                       {dynamicCategories.map((category) => (
                        <DropdownMenuItem key={category} asChild>
                          <Link
                            href={
                              category === "All" ? "/products" : `/products?category=${encodeURIComponent(category)}`
                            }
                            className="w-full cursor-pointer"
                          >
                            {category}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link href="/products" className="font-medium">
                    Products
                  </Link>
                  <Link href="/deals" className="font-medium">
                    Deals
                  </Link>
                  <Link href="/training" className="font-medium">
                    Training
                  </Link>
                  <Link href="/about" className="font-medium">
                    About
                  </Link>
                  <Link href="/support" className="font-medium">
                Contact & Support
                  </Link>
                  <hr />
                  <Button variant="ghost" onClick={() => openAuthModal("signin")} className="justify-start">
                    Sign In
                  </Button>
                  <Button variant="ghost" onClick={() => openAuthModal("signup")} className="justify-start">
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab={authModalTab} />
    </>
  )
}
