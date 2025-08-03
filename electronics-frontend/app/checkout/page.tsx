"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { state: cartState } = useCart()
  const { user, loading: authLoading, isAuthenticated } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [cartItems, setCartItems] = useState(cartState?.items || [])

  // Update cartItems if cartState changes
  useEffect(() => {
    setCartItems(cartState?.items || [])
  }, [cartState])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please sign in to proceed with checkout")
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && isAuthenticated && (!cartItems || cartItems.length === 0)) {
      toast.info("Your cart is empty. Add some products before checkout.")
      router.push("/products")
    }
  }, [cartItems, isAuthenticated, authLoading, router])

  if (authLoading) {
    return <p className="p-4 text-center">Loading authentication status...</p>
  }

  if (!cartItems || cartItems.length === 0) {
    return <p className="p-4 text-center">Your cart is empty.</p>
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Example: handle placing order - adapt this to your backend
  async function handlePlaceOrder() {
    setIsLoading(true)
    try {
      // Example payload structure:
      const orderPayload = {
        items: cartItems.map(({ id, quantity }) => ({ product: id, quantity })),
        user_id: user?.id, // Using request user on backend
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`, // if you use cookie for token
        },
        body: JSON.stringify(orderPayload),
      })

      if (!response.ok) {
        throw new Error("Failed to place order")
      }

      // Clear cart after successful order, then redirect
      router.push("/thank-you")
      toast.success("Order placed successfully!")
    } catch (error) {
      toast.error((error as Error).message || "Error placing order")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <ul className="mb-2 border rounded p-4 space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>UGX {(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>UGX {totalAmount.toLocaleString()}</span>
        </div>
      </section>

      <Button
        onClick={handlePlaceOrder}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Placing order..." : "Place Order"}
      </Button>
    </div>
  )
}
