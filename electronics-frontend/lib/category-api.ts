// lib/category-api.ts
export async function fetchCategories(): Promise<string[]> {
  try {
const res = await fetch("http://localhost:8000/api/products/categories/", {
  cache: "no-store"
});


    if (!res.ok) throw new Error("Failed to fetch categories");

    const data = await res.json();
    if (!Array.isArray(data.results)) throw new Error("Unexpected response structure");


    // Extract only names and return
    return data.results.map((cat: any) => cat.name);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ["All"] // fallback
  }
}
