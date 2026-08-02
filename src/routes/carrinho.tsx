import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioDescribe } from "@/lib/accessibility";
import { useCart } from "@/lib/cart";
import { catalogQueryOptions } from "@/lib/catalog";
import { ORDER_MODE_LABEL, formatPrice } from "@/lib/format";
import { placeOrder } from "@/lib/orders";
import { useSession } from "@/lib/session";
import type { OrderMode } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho | ConectaMercado" },
      {
        name: "description",
        content:
          "Revise seus itens, escolha entrega, clique e retire ou consulta de preços e finalize seu pedido.",
      },
      { property: "og:title", content: "Carrinho | ConectaMercado" },
      {
        property: "og:description",
        content: "Finalize seu pedido com entrega ou retirada nas lojas parceiras.",
      },
    ],
  }),
  component: CartPage,
});

const MODES: OrderMode[] = ["delivery", "pickup", "lookup"];

function CartPage() {
  const { data, isLoading } = useQuery(catalogQueryOptions);
  const { items, orderMode, setOrderMode, updateQuantity, removeItem, clearCart } =
    useCart();
  const { user } = useSession();
  const describe = useAudioDescribe();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const rows = items
    .map((item) => {
      const product = data?.products.find((p) => p.id === item.productId);
      const store = data?.stores.find((s) => s.id === item.storeId);
      const stock = product?.stocks.find((s) => s.storeId === item.storeId);
      if (!product || !store || !stock) return null;
      return { item, product, store, price: stock.price };
    })
    .filter(Boolean) as {
    item: (typeof items)[number];
    product: NonNullable<typeof data>["products"][number];
    store: NonNullable<typeof data>["stores"][number];
    price: number;
  }[];

  const total = rows.reduce((sum, row) => sum + row.price * row.item.quantity, 0);

  const handleConfirm = async () => {
    if (!user) {
      toast.error("Entre na sua conta para finalizar o pedido.");
      navigate({ to: "/auth" });
      return;
    }
    setSubmitting(true);
    try {
      await placeOrder({
        userId: user.id,
        orderMode,
        items,
        products: data?.products ?? [],
      });
      clearCart();
      toast.success("Pedido confirmado!");
      describe(
        `Pedido confirmado no modo ${ORDER_MODE_LABEL[orderMode]}, total ${formatPrice(total)}.`,
      );
      navigate({ to: "/pedidos" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível confirmar o pedido.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="container space-y-4 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </main>
    );
  }

  return (
    <main className="container space-y-8 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Seu carrinho</h1>
        <p className="text-muted-foreground">
          Revise seus itens e escolha como quer receber.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Como você quer receber?</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Modo do pedido">
          {MODES.map((mode) => (
            <Button
              key={mode}
              variant={orderMode === mode ? "default" : "outline"}
              onClick={() => setOrderMode(mode)}
              aria-pressed={orderMode === mode}
            >
              {ORDER_MODE_LABEL[mode]}
            </Button>
          ))}
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Button asChild>
            <Link to="/buscar">Buscar produtos</Link>
          </Button>
        </div>
      ) : (
        <>
          <section className="space-y-3">
            {rows.map(({ item, product, store, price }) => (
              <Card key={`${item.productId}-${item.storeId}`}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <ProductImage
                      product={product}
                      className="h-16 w-16 shrink-0"
                      emojiClassName="text-3xl"
                    />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {store.name} · {formatPrice(price)} / {product.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.productId, item.storeId, item.quantity - 1)
                      }
                      aria-label={`Diminuir quantidade de ${product.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center" aria-live="polite">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.productId, item.storeId, item.quantity + 1)
                      }
                      aria-label={`Aumentar quantidade de ${product.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-24 text-right font-semibold">
                      {formatPrice(price * item.quantity)}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => removeItem(item.productId, item.storeId)}
                      aria-label={`Remover ${product.name} do carrinho`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <Separator />

          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {ORDER_MODE_LABEL[orderMode]}
              </p>
              <p className="text-2xl font-bold">Total: {formatPrice(total)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearCart}>
                Limpar carrinho
              </Button>
              <Button onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Confirmando…" : "Confirmar pedido"}
              </Button>
            </div>
          </section>
          {!user && (
            <p className="text-sm text-muted-foreground">
              Você precisa <Link to="/auth" className="underline">entrar na sua conta</Link>{" "}
              para confirmar o pedido.
            </p>
          )}
        </>
      )}
    </main>
  );
}
