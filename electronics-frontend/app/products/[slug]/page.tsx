"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Share2,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/components/cart-provider"
import { toast } from "@/components/toast"
import api, { type Product } from "@/lib/api"

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { dispatch } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!slug || typeof slug !== "string") {
      setError("Invalid product slug")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const productData = await api.getProductBySlug(slug)
        setProduct(productData)

        const relatedData = await api.getRelatedProducts(productData.id).catch(() => [])
        setRelated(relatedData)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Product not found")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        category:
          typeof product.category === "string"
            ? product.category
            : product.category.name,
      },
    })
    toast.success(`${quantity} × ${product.name} added to cart`)
  }

  const onShare = () => {
    if (!product) return
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: `${window.location.origin}/products/${product.slug}`,
    }

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Share failed:", error))
    } else {
      navigator.clipboard
        .writeText(shareData.url)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Unable to copy link"))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-32 text-lg animate-pulse">Loading product...</div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-32">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400" />
          <h1 className="text-xl font-semibold mt-4">Product Not Found</h1>
          <p className="text-gray-500 mt-2">We couldn’t find that item.</p>
          <Link href="/products">
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const price = parseFloat(product.price)
  const isInStock = product.stock_quantity > 0

  const renderDescription = () => {
    const items = product.description.split(/\n|•|\*/).map((item) => item.trim()).filter(Boolean)
    if (items.length > 1) {
      return (
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
    }
    return <p className="text-muted-foreground">{product.description}</p>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Home</Link> /
          <Link href="/products" className="hover:underline ml-1">Products</Link> /
          <span className="ml-1 font-medium text-foreground">{product.name}</span>
        </nav>

        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="w-full">
            <Image
              src={product.main_image_url || product.image || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-auto rounded-lg border object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{product.category.name}</Badge>
                {product.is_featured && <Badge className="bg-emerald-500">Featured</Badge>}
              </div>

              <h1 className="text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-2 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-sm ml-2 text-muted-foreground">(Available)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-emerald-600">
              UGX {price.toLocaleString()}
            </div>

            <div>
              {renderDescription()}
              <div className="mt-4">
                <Badge variant={isInStock ? "default" : "destructive"}>
                  {isInStock ? `${product.stock_quantity} in stock` : "Out of stock"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >−</Button>
                <span className="px-4">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >+</Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!isInStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="h-5 w-5 mr-1" /> Back to Products
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={onShare}>
                <Share2 className="h-5 w-5 mr-1" /> Share
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">You may also like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <Card key={item.id} className="hover:shadow-md">
                  <CardContent className="p-4">
                    <Link href={`/products/${item.slug}`}>
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="rounded-md w-full h-32 object-cover mb-3"
                      />
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-emerald-600 font-semibold">
                        UGX {Number(item.price).toLocaleString()}
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
