import { Product } from "./products"

export async function fetchDealsFromAPI() {
  const response = await fetch("http://127.0.0.1:8000/api/deals/", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch deals");
  }

  return response.json();
}


export async function fetchProductsFromAPI(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:8000/api/products/", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    const products = Array.isArray(data.results) ? data.results : [];

    return products.map((item: any) => ({
      id: item.id,
      slug:item.slug,
      name: item.name,
      price: parseFloat(item.price),
      originalPrice: item.compare_at_price ? parseFloat(item.compare_at_price) : parseFloat(item.price) + 10000,
      image: item.main_image_url || "/images/default-product.svg",
      badge: item.is_featured ? "Featured" : item.is_on_sale ? "On Sale" : "",
      rating: item.rating || 4.5, // if you add ratings later
      reviews: item.reviews || 10, // same
      category: item.category || { name: "General", slug: "general" },
      inStock: item.is_in_stock,
      stockQuantity: item.stock_quantity,
      description: item.description || "No description provided.",
      specifications: item.specifications || ["Not specified"],
      features: item.features || ["Standard quality"],
      tags: item.tags || [],
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchDailyDeals() {
  const response = await fetch("http://127.0.0.1:8000/api/deals/daily-deals/");
  if (!response.ok) throw new Error("Failed to fetch daily deals");
  return response.json();
}

export async function fetchPackages() {
  const response = await fetch("http://127.0.0.1:8000/api/deals/packages/");
  if (!response.ok) throw new Error("Failed to fetch packages");
  return response.json();
}

export async function fetchBundles() {
  const response = await fetch("http://127.0.0.1:8000/api/deals/bundles/");
  if (!response.ok) throw new Error("Failed to fetch bundles");
  return response.json();
}

// products-api.ts
export async function fetchFeaturedProducts() {
  const res = await fetch("http://127.0.0.1:8000/api/products/featured/");
  if (!res.ok) throw new Error("Failed to fetch featured products");
  return res.json();
}


export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/products/${slug}/`);

  if (!res.ok) throw new Error(`Failed to fetch product with slug: ${slug}`);

  return res.json();
}



