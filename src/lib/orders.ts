import { supabase } from "@/integrations/supabase/client";
import type { CartItem, OrderMode } from "@/lib/types";

/** Loose RPC caller: these functions are newer than the generated types. */
const rpc = (
  supabase as unknown as {
    rpc: (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: { message: string } | null }>;
  }
).rpc;

export interface AvailabilityRow {
  productId: string;
  storeId: string;
  requested: number;
  available: number;
  unitPrice: number;
  isAvailable: boolean;
}

function toPayload(items: CartItem[]) {
  return items.map((item) => ({
    product_id: item.productId,
    store_id: item.storeId,
    quantity: item.quantity,
  }));
}

/**
 * Second validation: re-checks live stock for every cart line right before
 * confirming, so quantities are guaranteed against the store inventory.
 */
export async function checkCartAvailability(
  items: CartItem[],
): Promise<AvailabilityRow[]> {
  if (items.length === 0) return [];
  const { data, error } = await rpc.call(supabase, "check_cart_availability", {
    p_items: toPayload(items),
  });
  if (error) throw new Error(error.message);
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    productId: String(row["product_id"]),
    storeId: String(row["store_id"]),
    requested: Number(row["requested"]),
    available: Number(row["available"]),
    unitPrice: Number(row["unit_price"] ?? 0),
    isAvailable: Boolean(row["is_available"]),
  }));
}

/**
 * Creates the order atomically on the server: stock is reserved per line and
 * the whole transaction fails if any unit is no longer available.
 */
export async function placeOrder({
  orderMode,
  items,
}: {
  orderMode: OrderMode;
  items: CartItem[];
}): Promise<string> {
  const { data, error } = await rpc.call(supabase, "place_order", {
    p_mode: orderMode,
    p_items: toPayload(items),
  });
  if (error) throw new Error(error.message);
  return String(data);
}
