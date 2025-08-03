const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/products/categories/`)
  if (!res.ok) throw new Error("Failed to fetch categories")
  return res.json()
}

// Types
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  image: string
  category: {
    id: number
    name: string
    slug: string
  }
  subcategory?: {
    id: number
    name: string
    slug: string
  }
  stock_quantity: number
  is_featured: boolean
  specifications: any
  is_active: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  subcategories: Subcategory[]
  product_count: number
  is_active: boolean
}

export interface Subcategory {
  id: number
  name: string
  slug: string
  description: string
  product_count: number
  is_active: boolean
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  total_price: string
  created_at: string
}

export interface Cart {
  id: number
  items: CartItem[]
  total_items: number
  total_price: string
  created_at: string
  updated_at: string
}

// API Class
class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(this.token && { Authorization: `Token ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = `HTTP error! status: ${response.status}`

        if (contentType?.includes("application/json")) {
          try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorData.detail || errorMessage
          } catch (e) {
            errorMessage = response.statusText || errorMessage
          }
        } else {
          const textResponse = await response.text()
          errorMessage = textResponse.includes("<!DOCTYPE")
            ? `Server returned HTML. Likely a CORS error or missing endpoint.`
            : textResponse.substring(0, 200)
        }

        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        const textResponse = await response.text()
        throw new Error(`Expected JSON response but got: ${contentType}. Response: ${textResponse.substring(0, 200)}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Cannot connect to Django server.")
      }
      throw error
    }
  }

  // Test Connection
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/products/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      throw error
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: User }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    this.token = response.token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.token)
    }
    return response
  }

  async register(userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone?: string
  }) {
    return this.request<{ token: string; user: User }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    if (this.token) {
      await this.request("/auth/logout/", { method: "POST" })
    }
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  async getCurrentUser() {
    return this.request<User>("/auth/user/")
  }

  // Products
  async getProducts(params?: {
    category?: string
    subcategory?: string
    search?: string
    featured?: boolean
  }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append("category", params.category)
    if (params?.subcategory) searchParams.append("subcategory", params.subcategory)
    if (params?.search) searchParams.append("search", params.search)
    if (params?.featured) searchParams.append("featured", "true")
    const query = searchParams.toString()
    return this.request<Product[]>(`/products/${query ? `?${query}` : ""}`)
  }

  async getFeaturedProducts() {
    return this.request<Product[]>("/products/featured/")
  }

  async getProduct(id: number) {
    return this.request<Product>(`/products/${id}/`)
  }

async getProductBySlug(slug: string) {
  return this.request<Product>(`/products/slug/${slug}/`)
}


async getRelatedProducts(productId: number) {
  return this.request<Product[]>(`/${productId}/recommendations/`)
}


  // Categories
  async getCategories() {
    return this.request<Category[]>("/products/categories/")
  }

  async getCategory(slug: string) {
    return this.request<Category>(`/products/categories/${slug}/`)
  }

  // Cart
  async getCart() {
    return this.request<Cart>("/cart/")
  }

  async addToCart(productId: number, quantity = 1) {
    return this.request("/cart/add/", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async updateCartItem(itemId: number, quantity: number) {
    return this.request(`/cart/items/${itemId}/update/`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    })
  }

  async removeFromCart(itemId: number) {
    return this.request(`/cart/items/${itemId}/remove/`, {
      method: "DELETE",
    })
  }

  async clearCart() {
    return this.request("/cart/clear/", { method: "DELETE" })
  }

  async getCartSummary() {
    return this.request("/cart/summary/")
  }

  // Orders
  async getOrders() {
    return this.request("/orders/")
  }

  async createOrder(orderData: {
    payment_method: string
    shipping_address: {
      full_name: string
      phone: string
      address_line_1: string
      address_line_2?: string
      city: string
      district: string
      region: string
      postal_code?: string
    }
    notes?: string
  }) {
    return this.request("/orders/create/", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  // Payment Methods
  async getPaymentMethods() {
    return this.request("/payments/methods/")
  }

  // Reviews
  async getProductReviews(productId: number) {
    return this.request(`/reviews/product/${productId}/`)
  }

  async createReview(reviewData: {
    product: number
    rating: number
    title: string
    comment: string
  }) {
    return this.request("/reviews/create/", {
      method: "POST",
      body: JSON.stringify(reviewData),
    })
  }

  // Support
  async getFAQs(categoryId?: number) {
    const query = categoryId ? `?category=${categoryId}` : ""
    return this.request(`/support/faqs/${query}`)
  }

  async getContactInfo() {
    return this.request("/support/contact/")
  }

  // Training
  async getTrainingCourses() {
    return this.request("/training/courses/")
  }

  async getTrainingCategories() {
    return this.request("/training/categories/")
  }
}

// Export singleton instance
export const api = new ApiService()
export default api
