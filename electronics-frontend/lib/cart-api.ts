// lib/cart-api.ts
import { CartItem } from "@/components/cart-provider"
import { toast } from "@/components/toast"

interface BackendCartItem {
  id: number
  product: {
    id: number
    name: string
    price: number
    image: string
    category: string
  }
  quantity: number
}

interface BackendCartResponse {
  items: BackendCartItem[]
}

export async function fetchBackendCart(token: string): Promise<BackendCartItem[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data: BackendCartResponse = await res.json()
    return data.items || []
  } catch (error) {
    console.error("Failed to fetch cart:", error)
    toast.error("Failed to load your cart. Please refresh the page.")
    return []
  }
}

export function mapBackendCartToFrontend(items: BackendCartItem[]): CartItem[] {
  return items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image || "/placeholder.svg",
    category: item.product.category || "Uncategorized",
    quantity: item.quantity,
  }))
}

export async function addToBackendCart(
  productId: number,
  quantity: number,
  token: string
): Promise<BackendCartItem> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/cart/add/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    })

    if (!res.ok) {
      throw new Error(`Failed to add item: ${res.statusText}`)
    }

    return await res.json()
  } catch (error) {
    console.error("Add to cart failed:", error)
    toast.error("Failed to add item to cart. Please try again.")
    throw error
  }
}

export async function updateBackendCartItem(
  itemId: number,
  quantity: number,
  token: string
): Promise<void> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/cart/update/${itemId}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    })

    if (!res.ok) {
      throw new Error(`Failed to update item: ${res.statusText}`)
    }
  } catch (error) {
    console.error("Update cart item failed:", error)
    toast.error("Failed to update quantity. Please refresh and try again.")
    throw error
  }
}

export async function removeFromBackendCart(itemId: number, token: string): Promise<void> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to remove item: ${res.statusText}`)
    }
  } catch (error) {
    console.error("Remove item failed:", error)
    toast.error("Failed to remove item. Please try again.")
    throw error
  }
}

// ✅ Safely added missing clear function
export async function clearBackendCart(token: string): Promise<void> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/cart/clear/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to clear cart: ${res.statusText}`)
    }
  } catch (error) {
    console.error("Clear cart failed:", error)
    toast.error("Failed to clear cart. Please try again.")
    throw error
  }
}
