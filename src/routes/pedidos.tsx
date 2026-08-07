import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { catalogQueryOptions } from "@/lib/catalog";
import { ORDER_MODE_LABEL, formatPrice } from "@/lib/format";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Meus pedidos | ConectaMercado" },
      {
        name: "description",
        content:
          "Acompanhe o histórico dos seus pedidos no ConectaMercado, com itens, lojas e valores.",
      },
      { property: "og:title", content: "Meus pedidos | ConectaMercado" },
      {
        property: "og:description",
        content: "Histórico de pedidos com detalhes de itens, lojas e totais.",
      },
    ],
  }),
  component: OrdersPage,
});

interface OrderRow {
  id: string;
  order_mode: string;
  total: number;
  created_at: string;
}

interface OrderItemRow {
  order_id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  unit_price: number;
}

function OrdersPage() {
  const { user, isLoading: sessionLoading } = useSession();
  const { data: catalog } = useQuery(catalogQueryOptions);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const [ordersRes, itemsRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("order_items").select("*"),
      ]);
      const error = ordersRes.error ?? itemsRes.error;
      if (error) throw new Error(error.message);
      return {
        orders: (ordersRes.data ?? []) as unknown as OrderRow[],
        items: (itemsRes.data ?? []) as unknown as OrderItemRow[],
      };
    },
  });

  if (sessionLoading) {
    return (
      <main className="container space-y-4 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container space-y-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Meus pedidos</h1>
        <p className="text-muted-foreground">Entre na sua conta para ver o histórico de pedidos.</p>
        <Button asChild>
          <Link to="/auth">Entrar</Link>
        </Button>
      </main>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <main className="container space-y-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Meus pedidos</h1>
        <p className="text-muted-foreground">Histórico das suas compras.</p>
      </div>

      {isLoading && <Skeleton className="h-32 w-full rounded-xl" />}

      {!isLoading && orders.length === 0 && (
        <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">Você ainda não fez pedidos.</p>
          <Button asChild>
            <Link to="/buscar">Buscar produtos</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const orderItems = (data?.items ?? []).filter((item) => item.order_id === order.id);
          return (
            <Card key={order.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleString("pt-BR")}
                    </p>
                    <Badge variant="secondary">
                      {ORDER_MODE_LABEL[order.order_mode] ?? order.order_mode}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(Number(order.total))}
                  </p>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {orderItems.map((item, index) => {
                    const product = catalog?.products.find((p) => p.id === item.product_id);
                    const store = catalog?.stores.find((s) => s.id === item.store_id);
                    return (
                      <li key={`${item.order_id}-${index}`}>
                        {item.quantity}× {product?.name ?? "Produto"}
                        {store ? ` — ${store.name}` : ""} ·{" "}
                        {formatPrice(Number(item.unit_price) * item.quantity)}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
