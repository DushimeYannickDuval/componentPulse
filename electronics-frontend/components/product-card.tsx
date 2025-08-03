"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { toast } from "@/components/toast"

type ProductCardProps = {
  id: string | number;
  slug: string;
  title: string;
  image?: string;
  price: number;
  description?: string;
  category?: string;
  type?: string;
  featured?: boolean;
  showCartButton?: boolean;
};

export default function ProductCard({
  id,
  slug,
  title,
  image,
  price,
  description,
  category,
  type,
  featured = false,
  showCartButton = false,
}: ProductCardProps) {
  const { dispatch } = useCart()

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id,
        name: title,
        price,
        image,
        category: category || type || "Product"
      }
    })
    toast.success(`${title} added to cart!`)
  }

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardContent className="p-4 flex flex-col gap-3">
        <Link href={`/products/${slug}`}>
          <div className="relative w-full h-48 cursor-pointer">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </Link>

        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-primary text-xl font-bold">UGX {price.toLocaleString()}</p>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}

        <div className="flex justify-between items-center mt-auto gap-2">
          <Link href={`/products/${slug}`}>
            <Button variant="outline" className="text-sm">
              View More Details
            </Button>
          </Link>

          {showCartButton && (
            <Button onClick={addToCart} className="text-sm">
              <ShoppingCart className="mr-2 w-4 h-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
