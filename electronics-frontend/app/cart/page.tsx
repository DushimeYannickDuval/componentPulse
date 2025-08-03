"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/components/cart-provider"

export default function CartPage() {
  const { state, dispatch } = useCart()

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const shipping = state.total >= 500000 ? 0 : 5000
  const finalTotal = state.total + shipping

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <span>Home</span> / <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>

        {/* Back to Products */}
        <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Button variant="outline" size="sm" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-lg"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.category}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xl font-bold text-blue-600">UGX {item.price.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-12 text-center font-medium">{item.quantity}</span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            UGX {(item.price * item.quantity).toLocaleString()}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {item !== state.items[state.items.length - 1] && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>UGX {state.total.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <div className="text-right">
                      {shipping === 0 ? (
                        <div>
                          <span className="text-green-600 font-medium">FREE</span>
                          <div className="text-xs text-gray-500">Orders over UGX 500,000</div>
                        </div>
                      ) : (
                        <span>UGX {shipping.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>UGX {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                {state.total < 500000 && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      Add UGX {(500000 - state.total).toLocaleString()} more for free shipping
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="font-medium">Secure Checkout</p>
                  <p>Your payment information is secure and encrypted. We accept:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">MTN Money</Badge>
                    <Badge variant="outline">Airtel Money</Badge>
                    <Badge variant="outline">Pay on Delivery</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">You might also like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Recommended product"
                      width={60}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Arduino Starter Kit</h4>
                      <p className="text-blue-600 font-semibold">UGX 150,000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Recommended product"
                      width={60}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Sensor Kit Pro</h4>
                      <p className="text-blue-600 font-semibold">UGX 95,000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
