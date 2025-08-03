"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { fetchProductsFromAPI } from "@/lib/products-api";
import { fetchCategories } from "@/lib/category-api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Grid, List } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart-provider";
import { toast, ToastContainer } from "@/components/toast";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product-card";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number;
  image: string;
  description: string;
  category: { name: string };
  is_in_stock: boolean;
};

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { dispatch } = useCart();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryParam = searchParams.get("category") || "";

  useEffect(() => {
    fetchCategories().then((data) =>
      setCategories(data.map((c: any) => c.name))
    );
    fetchProductsFromAPI().then((data) => {
      console.log("Products fetched:", data);
      setProducts(data);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(searchQuery);
        const categoryMatch = p.category?.name?.toLowerCase().includes(searchQuery);
        const matchesSearch = searchQuery === "" || nameMatch || categoryMatch;

        const withinPrice =
          p.price >= priceRange[0] && p.price <= priceRange[1];

        const categoryFilter =
          categoryParam && categoryParam !== "All"
            ? p.category?.name === categoryParam
            : selectedCategories.length === 0 ||
              selectedCategories.includes(p.category?.name);

        return matchesSearch && withinPrice && categoryFilter;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [products, priceRange, selectedCategories, sortBy, searchQuery, categoryParam]);

  const addToCart = (p: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category?.name || "General",
      },
    });
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
              <Grid />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
              <List />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
                    title={p.name}
                    image={p.image}
                    price={p.price}
                    description={p.description}
                    category={p.category?.name}
                    showCartButton
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
                    title={p.name}
                    image={p.image}
                    price={p.price}
                    description={p.description}
                    category={p.category?.name}
                    showCartButton
                  />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <p className="text-center py-8">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProductsContent />
    </Suspense>
  );
}
