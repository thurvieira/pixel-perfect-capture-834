const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function effectivePrice(stock: { price: number; promoPrice?: number | null }): number {
  return stock.promoPrice ?? stock.price;
}

export function discountPercent(stock: {
  price: number;
  promoPrice?: number | null;
}): number | null {
  if (!stock.promoPrice || stock.promoPrice >= stock.price) return null;
  return Math.round((1 - stock.promoPrice / stock.price) * 100);
}

export const STORE_TYPE_LABEL: Record<string, string> = {
  supermercado: "Supermercado",
  hipermercado: "Hipermercado",
  atacadista: "Atacadista",
};

export const ORDER_MODE_LABEL: Record<string, string> = {
  delivery: "Entrega em casa",
  pickup: "Clique e retire",
  lookup: "Só consultar preços",
};
