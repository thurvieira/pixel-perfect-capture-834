const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
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
