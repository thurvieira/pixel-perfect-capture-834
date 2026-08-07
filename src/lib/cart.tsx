import type { CartItem, OrderMode } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CartContextValue {
  items: CartItem[];
  orderMode: OrderMode;
  setOrderMode: (mode: OrderMode) => void;
  addItem: (productId: string, storeId: string, quantity?: number) => void;
  removeItem: (productId: string, storeId: string) => void;
  updateQuantity: (productId: string, storeId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "conectamercado.cart.draft";
const MODE_STORAGE_KEY = "conectamercado.cart.mode";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderMode, setOrderModeState] = useState<OrderMode>("delivery");
  const [hydrated, setHydrated] = useState(false);

  // Read persisted state after hydration to avoid SSR mismatches.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
      const mode = localStorage.getItem(MODE_STORAGE_KEY);
      if (mode === "delivery" || mode === "pickup" || mode === "lookup") {
        setOrderModeState(mode);
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(MODE_STORAGE_KEY, orderMode);
  }, [orderMode, hydrated]);

  const addItem = useCallback((productId: string, storeId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.storeId === storeId,
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.storeId === storeId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { productId, storeId, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string, storeId: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.storeId === storeId)),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, storeId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, storeId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId && item.storeId === storeId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const setOrderMode = useCallback((mode: OrderMode) => setOrderModeState(mode), []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      orderMode,
      setOrderMode,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
    }),
    [items, orderMode, setOrderMode, addItem, removeItem, updateQuantity, clearCart, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
