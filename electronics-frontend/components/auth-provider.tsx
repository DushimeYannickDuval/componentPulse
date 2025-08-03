"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"

interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  full_name: string
  phone?: string
  profile_picture?: string
  is_email_verified: boolean
  created_at: string
}

interface RegisterData {
  email: string
  username: string
  first_name: string
  last_name: string
  phone?: string
  password: string
  password_confirm: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  googleLogin: (googleToken: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get("access_token")
      if (!token) return setLoading(false)

      const response = await fetch(`${API_BASE_URL}/auth/profile/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Login failed")
    }

    const data = await response.json()
    Cookies.set("access_token", data.tokens.access, { expires: 1 })
    Cookies.set("refresh_token", data.tokens.refresh, { expires: 7 })
    setUser(data.user)
  }

  const register = async (userData: RegisterData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Registration failed")
    }

    const data = await response.json()
    Cookies.set("access_token", data.tokens.access, { expires: 1 })
    Cookies.set("refresh_token", data.tokens.refresh, { expires: 7 })
    setUser(data.user)
  }

  const googleLogin = async (googleToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/google-auth/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ google_token: googleToken }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Google login failed")
    }

    const data = await response.json()
    Cookies.set("access_token", data.tokens.access, { expires: 1 })
    Cookies.set("refresh_token", data.tokens.refresh, { expires: 7 })
    setUser(data.user)
  }

  const logout = async () => {
    try {
      const refreshToken = Cookies.get("refresh_token")
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      Cookies.remove("access_token")
      Cookies.remove("refresh_token")
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    googleLogin,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
