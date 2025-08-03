"use client";

import { useEffect, useState } from "react";
import { fetchDailyDeals, fetchPackages, fetchBundles } from "@/lib/products-api";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Package,
  Sparkles,
  Zap,
  GiftIcon,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default function DealsPage() {
  const [dailyDeals, setDailyDeals] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        const [daily, pkg, bndl] = await Promise.all([
          fetchDailyDeals(),
          fetchPackages(),
          fetchBundles(),
        ]);

        // Map daily deals with safe discount calculation and default values
        setDailyDeals(
          (daily.results || daily).map((deal: any) => {
            const previous_price = deal.previous_price ?? deal.price; // fallback if no previous price
            const discount =
              previous_price && previous_price > deal.price
                ? Math.round(((previous_price - deal.price) / previous_price) * 100)
                : 0;

            return {
              id: deal.id,
              title: deal.title,
              image: deal.image || "/placeholder.svg",
              slug: deal.slug,
              price: deal.price,
              previous_price,
              rating: deal.rating || 4,
              reviews: deal.reviews || 10,
              discount,
              type: "daily",
            };
          })
        );

        // Map small item packages
        setPackages(
          (pkg.results || pkg).map((item: any) => ({
            id: item.id,
            title: item.title,
            image: item.image || "/placeholder.svg",
            price: item.price,
            slug: item.slug,
            description: "Small Item Package",
            type: "package",
          }))
        );

        // Map bundles - ensure description is array for listing items
        setBundles(
          (bndl.results || bndl).map((item: any) => ({
            id: item.id,
            title: item.title,
            image: item.image || "/placeholder.svg",
            price: item.price,
            slug: item.slug,
            description: Array.isArray(item.items) ? item.items : [], // backend sends 'items' list
            type: "bundle",
          }))
        );
      } catch (err) {
        console.error("Failed to load deals:", err);
        setError("Unable to fetch deals.");
      }
    }

    loadDeals();
  }, []);

  if (error) {
    return <div className="p-8 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8" />
            <Badge className="bg-yellow-500 text-black text-lg px-4 py-2">MEGA DEALS</Badge>
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Unbeatable Electronics Deals</h1>
          <p className="text-xl mb-8 text-red-100">
            Save big on premium electronic components, development boards, and project kits. Limited time offers with up to 50% off selected items!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Zap className="mr-2 h-5 w-5" />
              View Deals
            </Button>
            <Button size="lg" variant="outline" className="border-white text-yellow-700 hover:bg-white hover:text-red-600">
              View All Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Daily Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <Star className="h-8 w-8 text-yellow-500" />
            Today's Best Deals
          </h2>
          <p className="text-gray-400 text-center mb-4">
            Hand-picked deals updated daily. Don't miss out on these amazing offers!
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyDeals.map((deal: any) => (
              <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {deal.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        -{deal.discount}%
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{deal.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < deal.rating ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({deal.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-green-600">
                      UGX {deal.price?.toLocaleString()}
                    </span>
                    {deal.previous_price && deal.previous_price > deal.price && (
                      <span className="text-sm text-gray-500 line-through">
                        UGX {deal.previous_price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <AddToCartButton
                      product={{
                        id: deal.id,
                        name: deal.title,
                        price: deal.price,
                        image: deal.image,
                        category: "Daily Deal",
                        inStock: true,
                      }}
                      className="w-full"
                    />
                    <Link href={`/deals/daily/${deal.slug}`}>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <GiftIcon className="h-8 w-8 text-yellow-600" />
            Bundle Deals
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle: any) => (
              <Card key={bundle.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Image
                    src={bundle.image}
                    alt={bundle.title}
                    width={300}
                    height={180}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg mb-2">{bundle.title}</h3>
                  <ul className="text-sm text-gray-700 list-disc pl-5 mb-3">
                    {bundle.description.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="text-xl font-bold text-green-600 mb-2">
                    UGX {bundle.price?.toLocaleString()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <AddToCartButton
                      product={{
                        id: bundle.id,
                        name: bundle.title,
                        price: bundle.price,
                        image: bundle.image,
                        category: "Bundle",
                        inStock: true,
                      }}
                      className="w-full"
                    />
                    <Link href={`/deals/bundles/${bundle.slug}`}>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Package Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-blue-600" />
            Package Deals
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={180}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="text-xl font-bold text-blue-600 mb-2">
                    UGX {item.price?.toLocaleString()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <AddToCartButton
                      product={{
                        id: item.id,
                        name: item.title,
                        price: item.price,
                        image: item.image,
                        category: "Package",
                        inStock: true,
                      }}
                      className="w-full"
                    />
                    <Link href={`/deals/packages/${item.slug}`}>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
