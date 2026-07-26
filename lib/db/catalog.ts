import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Read-side catalog helpers for the (upcoming) DB-backed storefront. They degrade
// to empty results until Supabase is configured, so pages using them build and
// render an empty state rather than throwing. Wire these into /store and
// /products in the storefront phase.

export async function listProducts() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("product_list")
    .select("*")
    .eq("active", true)
    .order("name");
  return data ?? [];
}

export async function getProductBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("product_list")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;

  const [{ data: variants }, { data: reviews }] = await Promise.all([
    supabase.from("product_variants").select("*").eq("product_id", data.id).order("sort_order"),
    supabase.from("product_reviews").select("*").eq("product_id", data.id).eq("approved", true),
  ]);
  return { ...data, variants: variants ?? [], reviews: reviews ?? [] };
}

export async function listCategories() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data ?? [];
}
