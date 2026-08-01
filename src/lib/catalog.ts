import { supabase } from "@/integrations/supabase/client";
import type { Product, Store } from "@/lib/types";
import { queryOptions } from "@tanstack/react-query";

interface StoreRow {
  id: string;
  name: string;
  network: string;
  type: Store["type"];
  address: string;
  distance_km: number;
  delivery_available: boolean;
  pickup_available: boolean;
}

interface ProductRow {
  id: string;
  name: string;
  category: string;
  unit: string;
  description: string;
  audio_description: string;
  image_emoji: string;
}

interface StockRow {
  product_id: string;
  store_id: string;
  price: number;
  stock: number;
}

export interface Catalog {
  stores: Store[];
  products: Product[];
  categories: string[];
}

export async function fetchCatalog(): Promise<Catalog> {
  const [storesRes, productsRes, stocksRes] = await Promise.all([
    supabase.from("stores").select("*").order("distance_km"),
    supabase.from("products").select("*").order("name"),
    supabase.from("product_stocks").select("*"),
  ]);

  const error = storesRes.error ?? productsRes.error ?? stocksRes.error;
  if (error) {
    throw new Error(error.message || "Não foi possível carregar o catálogo.");
  }

  const storeRows = (storesRes.data ?? []) as unknown as StoreRow[];
  const productRows = (productsRes.data ?? []) as unknown as ProductRow[];
  const stockRows = (stocksRes.data ?? []) as unknown as StockRow[];

  const stores: Store[] = storeRows.map((row) => ({
    id: row.id,
    name: row.name,
    network: row.network,
    type: row.type,
    address: row.address,
    distanceKm: Number(row.distance_km),
    deliveryAvailable: row.delivery_available,
    pickupAvailable: row.pickup_available,
  }));

  const products: Product[] = productRows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    description: row.description,
    audioDescription: row.audio_description,
    imageEmoji: row.image_emoji,
    stocks: stockRows
      .filter((stock) => stock.product_id === row.id)
      .map((stock) => ({
        storeId: stock.store_id,
        price: Number(stock.price),
        stock: stock.stock,
      }))
      .sort((a, b) => a.price - b.price),
  }));

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  return { stores, products, categories };
}

export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: fetchCatalog,
  staleTime: 60_000,
});
