import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { catalogQueryOptions } from "@/lib/catalog";
import { STORE_TYPE_LABEL, formatPrice } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, PackageCheck, ShoppingBag, Truck } from "lucide-react";

export const Route = createFileRoute("/lojas")({
  head: () => ({
    meta: [
      { title: "Lojas parceiras | ConectaMercado" },
      {
        name: "description",
        content:
          "Veja supermercados, hipermercados e atacadistas parceiros, distância, formas de entrega e produtos disponíveis.",
      },
      { property: "og:title", content: "Lojas parceiras | ConectaMercado" },
      {
        property: "og:description",
        content: "Mercados parceiros perto de você, com entrega e clique e retire.",
      },
    ],
  }),
  component: StoresPage,
});

function StoresPage() {
  const { data, isLoading } = useQuery(catalogQueryOptions);

  return (
    <main className="container space-y-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lojas parceiras</h1>
        <p className="text-muted-foreground">
          Mercados perto de você, com opções de entrega e retirada.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))
          : (data?.stores ?? []).map((store) => {
              const items = (data?.products ?? []).filter((product) =>
                product.stocks.some((stock) => stock.storeId === store.id),
              );
              const cheapest = items
                .flatMap((product) =>
                  product.stocks
                    .filter((stock) => stock.storeId === store.id)
                    .map((stock) => stock.price),
                )
                .sort((a, b) => a - b)[0];

              return (
                <Card key={store.id}>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-semibold">{store.name}</h2>
                        <p className="text-xs text-muted-foreground">{store.network}</p>
                      </div>
                      <Badge variant="secondary">
                        {STORE_TYPE_LABEL[store.type] ?? store.type}
                      </Badge>
                    </div>

                    <p className="flex items-start gap-1 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {store.address} · {store.distanceKm.toFixed(1)} km
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {store.deliveryAvailable && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
                          <Truck className="h-3.5 w-3.5" aria-hidden="true" /> Entrega
                        </span>
                      )}
                      {store.pickupAvailable && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
                          <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" /> Clique
                          e retire
                        </span>
                      )}
                    </div>

                    <p className="flex items-center gap-1 text-sm">
                      <ShoppingBag className="h-4 w-4 text-primary" aria-hidden="true" />
                      {items.length} produto(s)
                      {cheapest !== undefined && (
                        <span className="text-muted-foreground">
                          {" "}
                          · a partir de {formatPrice(cheapest)}
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </main>
  );
}
