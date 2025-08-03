"use client";

import { useEffect, useState } from "react";
import {
  fetchFeaturedProducts,
  fetchDailyDeals,
  fetchPackages,
  fetchBundles,
} from "@/lib/products-api";
import ProductCard from "./product-card";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
async function fetchFeatured() {
  try {
    const featured = await fetchFeaturedProducts()

    const normalizeProduct = (item: any) => ({
      ...item,
      image: item.image || item.main_image || item.main_image_url || "/placeholder.svg"
    })

    setFeaturedProducts(featured.map(normalizeProduct))
  } catch (err) {
    console.error("Failed to load featured products:", err)
    setError("Failed to load featured products")
  }
}


    async function loadAllDeals() {
      try {
        const [daily, packages, bundles] = await Promise.all([
          fetchDailyDeals(),
          fetchPackages(),
          fetchBundles(),
        ]);

        const normalize = (item: any, type: string) => ({
          id: item.id,
          title: item.title || item.name || "Untitled",
          image: item.image || item.main_image || item.main_image_url || null,
          price: item.price || item.package_price || item.bundle_price || 0,
          description: item.description || "",
          type,
          featured: true,
        });

        const labeledDeals = [
          ...daily.map((item: any) => normalize(item, "Daily Deal")),
          ...packages.map((item: any) => normalize(item, "Package")),
          ...bundles.map((item: any) => normalize(item, "Bundle")),
        ];

        setDeals(labeledDeals);
        setFilteredDeals(labeledDeals);
      } catch (err) {
        console.error("Failed to load deals:", err);
        setError("Failed to load deals");
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchFeatured();
    loadAllDeals();
  }, []);

  useEffect(() => {
    if (selectedType === "All") {
      setFilteredDeals(deals);
    } else {
      setFilteredDeals(deals.filter((deal) => deal.type === selectedType));
    }
  }, [selectedType, deals]);

  if (loading) return <p>Loading deals and products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          className="border px-4 py-2 rounded text-emerald-600"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Deals</option>
          <option value="Daily Deal">Daily Deals</option>
          <option value="Package">Packages</option>
          <option value="Bundle">Bundles</option>
        </select>
      </div>

      {/* Deals Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Deals</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Save big on premium electronic components, development boards, and project kits.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredDeals.map((deal) => (
          <ProductCard
            key={`deal-${deal.type}-${deal.id}`}
            title={deal.title}
            image={deal.image}
            price={deal.price}
            description={deal.description}
            type={deal.type}
            featured={deal.featured}
            showCartButton={true}
          />
        ))}
      </div>

      {/* Featured Products Section */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
        <p className="text-gray-600">
          Top-selling embedded system components
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((p: any) => (
          <ProductCard
            key={`product-${p.id}`}
            title={p.name}
            image={p.image}
            price={p.price}
            description={p.description}
            type="Product"
            featured={true}
            showCartButton={true}
          />
        ))}
      </div>
    </section>
  );
}
