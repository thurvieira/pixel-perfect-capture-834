import { supabase } from "@/integrations/supabase/client";
import type { CartItem, OrderMode, Product } from "@/lib/types";

interface PlaceOrderParams {
  userId: string;
  orderMode: OrderMode;
  items: CartItem[];
  products: Product[];
}

/**
 * Persists a confirmed order and its items for the signed-in user.
 * Relies on RLS (auth.uid() = user_id) — the userId must come from the
 * current authenticated session, never from unrelated input.
 */
export async function placeOrder({
  userId,
  orderMode,
  items,
  products,
}: PlaceOrderParams) {
  const enriched = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const stock = product?.stocks.find((s) => s.storeId === item.storeId);
      if (!product || !stock) return null;
      return { item, unitPrice: stock.price };
    })
    .filter(Boolean) as { item: CartItem; unitPrice: number }[];

  const total = enriched.reduce(
    (sum, entry) => sum + entry.unitPrice * entry.item.quantity,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: userId, order_mode: orderMode, total })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Não foi possível criar o pedido.");
  }

  if (enriched.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      enriched.map(({ item, unitPrice }) => ({
        order_id: order.id,
        user_id: userId,
        product_id: item.productId,
        store_id: item.storeId,
        quantity: item.quantity,
        unit_price: unitPrice,
      })),
    );

    if (itemsError) throw new Error(itemsError.message);
  }

  return order;
}
