import ProductImage from "@/components/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccessibility, useAudioDescribe } from "@/lib/accessibility";
import { useCart } from "@/lib/cart";
import { catalogQueryOptions } from "@/lib/catalog";
import { STORE_TYPE_LABEL, discountPercent, effectivePrice, formatPrice } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Plus, Volume2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/produto/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do produto | ConectaMercado" },
      {
        name: "description",
        content:
          "Compare o preço e o estoque deste produto em todas as lojas parceiras e adicione ao carrinho.",
      },
      { property: "og:title", content: "Detalhes do produto | ConectaMercado" },
      {
        property: "og:description",
        content: "Preço e estoque por loja, com áudio-descrição do produto.",
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery(catalogQueryOptions);
  const { addItem } = useCart();
  const describe = useAudioDescribe();
  const { audioDescriptionEnabled } = useAccessibility();

  const product = data?.products.find((item) => item.id === id);

  useEffect(() => {
    if (product && audioDescriptionEnabled) {
      describe(`${product.name}. ${product.audioDescription}`);
    }
  }, [product, audioDescriptionEnabled, describe]);

  if (isLoading) {
    return (
      <main className="container space-y-4 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container space-y-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
        <Button asChild>
          <Link to="/buscar">Voltar para a busca</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container space-y-8 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <ProductImage
          product={product}
          className="aspect-square w-full sm:w-64"
          emojiClassName="text-6xl"
        />
        <div className="flex-1 space-y-2">
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-sm text-muted-foreground">{product.unit}</p>
          <p>{product.description}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => describe(`${product.name}. ${product.audioDescription}`)}
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Ouvir áudio-descrição
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Preços por loja</h2>
        {product.stocks.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            Este produto está sem estoque nas lojas parceiras.
          </p>
        )}
        <div className="grid gap-3">
          {product.stocks.map((stock, index) => {
            const store = data?.stores.find((item) => item.id === stock.storeId);
            if (!store) return null;
            const off = discountPercent(stock);
            return (
              <Card key={stock.storeId}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{store.name}</h3>
                      <Badge variant="secondary">
                        {STORE_TYPE_LABEL[store.type] ?? store.type}
                      </Badge>
                      {index === 0 && <Badge>Melhor preço</Badge>}
                      {off !== null && (
                        <Badge className="bg-destructive text-destructive-foreground">
                          -{off}% OFF
                        </Badge>
                      )}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {store.address} · {store.distanceKm.toFixed(1)} km
                    </p>
                    <p
                      className={`inline-flex rounded-md px-3 py-2 text-base font-bold ${
                        stock.stock > 0
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {stock.stock > 0 ? `${stock.stock} unidade(s) em estoque` : "Sem estoque"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex flex-col items-end">
                      <span className="text-2xl font-extrabold text-primary">
                        {formatPrice(effectivePrice(stock))}
                      </span>
                      {off !== null && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(stock.price)}
                        </span>
                      )}
                    </span>
                    <Button
                      size="sm"
                      disabled={stock.stock <= 0}
                      onClick={() => {
                        addItem(product.id, store.id);
                        toast.success(`${product.name} adicionado ao carrinho.`);
                        describe(`${product.name} adicionado ao carrinho na loja ${store.name}.`);
                      }}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
