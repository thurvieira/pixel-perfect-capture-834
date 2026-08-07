import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioDescribe } from "@/lib/accessibility";
import { useCart } from "@/lib/cart";
import { catalogQueryOptions } from "@/lib/catalog";
import { ORDER_MODE_LABEL, discountPercent, effectivePrice, formatPrice } from "@/lib/format";
import { checkCartAvailability, placeOrder, type AvailabilityRow } from "@/lib/orders";
import { useSession } from "@/lib/session";
import type { OrderMode } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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

type OrderStatus =
  | { step: "idle" }
  | { step: "validating" }
  | { step: "invalid"; rows: AvailabilityRow[] }
  | { step: "validated"; rows: AvailabilityRow[] }
  | { step: "placing" }
  | { step: "confirmed"; orderId: string };

const STATUS_LABEL: Record<OrderStatus["step"], string> = {
  idle: "Aguardando confirmação",
  validating: "Validando estoque nas lojas…",
  invalid: "Estoque insuficiente — ajuste as quantidades",
  validated: "Estoque confirmado — finalizando",
  placing: "Reservando itens e criando o pedido…",
  confirmed: "Pedido confirmado",
};

function CartPage() {
  const { data, isLoading } = useQuery(catalogQueryOptions);
  const { items, orderMode, setOrderMode, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useSession();
  const describe = useAudioDescribe();
  const navigate = useNavigate();
  const [status, setStatus] = useState<OrderStatus>({ step: "idle" });
  const submitting = status.step === "validating" || status.step === "placing";

  const rows = items
    .map((item) => {
      const product = data?.products.find((p) => p.id === item.productId);
      const store = data?.stores.find((s) => s.id === item.storeId);
      const stock = product?.stocks.find((s) => s.storeId === item.storeId);
      if (!product || !store || !stock) return null;
      return { item, product, store, price: effectivePrice(stock), stock };
    })
    .filter(Boolean) as {
    item: (typeof items)[number];
    product: NonNullable<typeof data>["products"][number];
    store: NonNullable<typeof data>["stores"][number];
    price: number;
    stock: NonNullable<typeof data>["products"][number]["stocks"][number];
  }[];

  const total = rows.reduce((sum, row) => sum + row.price * row.item.quantity, 0);

  const issues = status.step === "invalid" ? status.rows.filter((r) => !r.isAvailable) : [];
  const issueFor = (productId: string, storeId: string) =>
    issues.find((r) => r.productId === productId && r.storeId === storeId);

  const handleConfirm = async () => {
    if (!user) {
      toast.error("Entre na sua conta para finalizar o pedido.");
      navigate({ to: "/auth" });
      return;
    }
    try {
      // Segunda validação: confere o estoque real de cada unidade no servidor.
      setStatus({ step: "validating" });
      const availability = await checkCartAvailability(items);
      const unavailable = availability.filter((row) => !row.isAvailable);
      if (unavailable.length > 0) {
        setStatus({ step: "invalid", rows: availability });
        describe("Alguns itens não têm estoque suficiente. Ajuste as quantidades.");
        toast.error("Alguns itens não têm estoque suficiente.");
        return;
      }

      setStatus({ step: "validated", rows: availability });
      setStatus({ step: "placing" });
      const orderId = await placeOrder({ orderMode, items });
      clearCart();
      setStatus({ step: "confirmed", orderId });
      toast.success("Pedido confirmado!");
      describe(
        `Pedido confirmado no modo ${ORDER_MODE_LABEL[orderMode]}, total ${formatPrice(total)}.`,
      );
    } catch (error) {
      setStatus({ step: "idle" });
      toast.error(error instanceof Error ? error.message : "Não foi possível confirmar o pedido.");
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
        <p className="text-muted-foreground">Revise seus itens e escolha como quer receber.</p>
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

      {status.step === "confirmed" ? (
        <Card>
          <CardContent className="space-y-4 py-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <div aria-live="polite">
              <h2 className="text-xl font-semibold">Pedido confirmado</h2>
              <p className="text-sm text-muted-foreground">
                Status: <strong>Confirmado</strong> · Código {status.orderId.slice(0, 8)}
              </p>
              <p className="text-sm text-muted-foreground">
                Todas as unidades foram reservadas no estoque da loja.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link to="/pedidos">Ver meus pedidos</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/buscar">Continuar comprando</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : rows.length === 0 ? (
        <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Button asChild>
            <Link to="/buscar">Buscar produtos</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-lg border p-3 text-sm" aria-live="polite">
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : status.step === "invalid" ? (
              <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
            <span>
              Status do pedido: <strong>{STATUS_LABEL[status.step]}</strong>
            </span>
          </div>

          <section className="space-y-3">
            {rows.map(({ item, product, store, price, stock }) => {
              const issue = issueFor(item.productId, item.storeId);
              const off = discountPercent(stock);
              return (
                <Card
                  key={`${item.productId}-${item.storeId}`}
                  className={issue ? "border-destructive" : undefined}
                >
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
                        {off !== null && (
                          <Badge className="mt-1 bg-destructive text-destructive-foreground">
                            -{off}% OFF
                          </Badge>
                        )}
                        {issue && (
                          <p className="mt-1 text-xs font-medium text-destructive">
                            Apenas {issue.available} unidade(s) em estoque de {issue.requested}{" "}
                            pedida(s).
                          </p>
                        )}
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
              );
            })}
          </section>

          <Separator />

          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{ORDER_MODE_LABEL[orderMode]}</p>
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
              Você precisa{" "}
              <Link to="/auth" className="underline">
                entrar na sua conta
              </Link>{" "}
              para confirmar o pedido.
            </p>
          )}
        </>
      )}
    </main>
  );
}
