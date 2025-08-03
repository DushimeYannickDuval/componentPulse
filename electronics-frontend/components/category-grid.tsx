// components/category-grid.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  name: string
  count: string | number
  image: string
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of electronic components and development tools
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="text-center hover:shadow-md transition">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={150}
                      height={150}
                      className="rounded-lg mx-auto"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{category.count} Products</p>
                  <Button variant="ghost" className="text-emerald-600 hover:bg-emerald-50">
                    Browse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
