export type StoreType = "supermercado" | "hipermercado" | "atacadista";

export interface Store {
  id: string;
  name: string;
  network: string;
  type: StoreType;
  address: string;
  distanceKm: number;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
}

export interface ProductStock {
  storeId: string;
  price: number;
  promoPrice: number | null;
  stock: number;
}

export type DietTag = "vegano" | "zero-acucar" | "sem-gluten" | "sem-lactose";

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  description: string;
  audioDescription: string;
  imageEmoji: string;
  imageUrl: string;
  dietTags: DietTag[];
  stocks: ProductStock[];
}

export type OrderMode = "delivery" | "pickup" | "lookup";

export interface CartItem {
  productId: string;
  storeId: string;
  quantity: number;
}
