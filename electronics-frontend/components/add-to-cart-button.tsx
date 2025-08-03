"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { toast } from "@/components/toast"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  inStock: boolean
}

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { dispatch } = useCart()

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Button className={`w-full ${className}`} disabled={!product.inStock} onClick={addToCart}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      {product.inStock ? "Add to Cart" : "Out of Stock"}
    </Button>
  )
}
