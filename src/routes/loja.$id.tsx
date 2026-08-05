import ProductImage from "@/components/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioDescribe } from "@/lib/accessibility";
import { useCart } from "@/lib/cart";
import { catalogQueryOptions } from "@/lib/catalog";
import {
  STORE_TYPE_LABEL,
  discountPercent,
  effectivePrice,
  formatPrice,
} from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, PackageCheck, Plus, Tag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/loja/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search['q'] === "string" ? (search['q'] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Produtos da loja | ConectaMercado" },
      {
        name: "description",
        content:
          "Veja todos os produtos disponíveis nesta loja parceira, com preços, promoções e estoque em tempo real.",
      },
      { property: "og:title", content: "Produtos da loja | ConectaMercado" },
      {
        property: "og:description",
        content: "Catálogo completo da loja parceira com preços e estoque.",
      },
    ],
  }),
  component: StoreDetail,
});

function StoreDetail() {
  const { id } = Route.useParams();
  const { q } = Route.useSearch();
  const { data, isLoading } = useQuery(catalogQueryOptions);
  const { addItem } = useCart();
  const describe = useAudioDescribe();
  const [category, setCategory] = useState<string>("todas");
  const [onlyPromo, setOnlyPromo] = useState(false);

  const store = data?.stores.find((item) => item.id === id);

  if (isLoading) {
    return (
      <main className="container space-y-4 py-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </main>
    );
  }

  if (!store) {
    return (
      <main className="container space-y-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Loja não encontrada</h1>
        <Button asChild>
          <Link to="/lojas">Ver lojas parceiras</Link>
        </Button>
      </main>
    );
  }

  const entries = (data?.products ?? [])
    .map((product) => {
      const stock = product.stocks.find((item) => item.storeId === store.id);
      return stock ? { product, stock } : null;
    })
    .filter(Boolean) as {
    product: NonNullable<typeof data>["products"][number];
    stock: NonNullable<typeof data>["products"][number]["stocks"][number];
  }[];

  const categories = Array.from(new Set(entries.map((e) => e.product.category))).sort();
  const term = q.trim().toLowerCase();
  const byCategory =
    category === "todas"
      ? entries
      : entries.filter((entry) => entry.product.category === category);
  const bySearch = term
    ? byCategory.filter(
        (entry) =>
          entry.product.name.toLowerCase().includes(term) ||
          entry.product.category.toLowerCase().includes(term),
      )
    : byCategory;
  const visible = onlyPromo
    ? bySearch.filter(
        (entry) =>
          entry.stock.promoPrice !== null && entry.stock.promoPrice < entry.stock.price,
      )
    : bySearch;

  return (
    <main className="container space-y-8 py-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
          <Badge variant="secondary">{STORE_TYPE_LABEL[store.type] ?? store.type}</Badge>
        </div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
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
              <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" /> Clique e retire
            </span>
          )}
        </div>
      </header>

      {term && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Filtrando por "{q}" — {visible.length} produto(s).{" "}
          <Link to="/loja/$id" params={{ id: store.id }} search={{ q: "" }} className="underline">
            Limpar busca
          </Link>
        </p>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar categoria">
        <Button
          size="sm"
          variant={onlyPromo ? "destructive" : "outline"}
          onClick={() => setOnlyPromo((value) => !value)}
          aria-pressed={onlyPromo}
        >
          <Tag className="mr-1 h-4 w-4" aria-hidden="true" />
          Só promoções
        </Button>
        <Button
          size="sm"
          variant={category === "todas" ? "default" : "outline"}
          onClick={() => setCategory("todas")}
        >
          Todas ({entries.length})
        </Button>
        {categories.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={category === item ? "default" : "outline"}
            onClick={() => setCategory(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ product, stock }) => {
          const off = discountPercent(stock);
          return (
            <Card key={product.id} className="flex h-full flex-col">
              <Link
                to="/produto/$id"
                params={{ id: product.id }}
                aria-label={`Ver detalhes de ${product.name}`}
                className="block"
              >
                <ProductImage
                  product={product}
                  className="aspect-[4/3] w-full rounded-b-none transition-opacity hover:opacity-90"
                />
              </Link>
              <CardContent className="flex flex-1 flex-col gap-3 pt-4">
                <div className="flex items-start justify-between gap-2">
                  {off !== null ? (
                    <Badge className="bg-destructive text-destructive-foreground">
                      -{off}% OFF
                    </Badge>
                  ) : (
                    <span />
                  )}
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div>
                  <h2 className="font-semibold leading-tight">
                    <Link
                      to="/produto/$id"
                      params={{ id: product.id }}
                      className="hover:underline"
                    >
                      {product.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-muted-foreground">{product.unit}</p>
                </div>
                <p className="flex items-baseline gap-2">
                  <strong className="text-2xl font-extrabold text-primary">
                    {formatPrice(effectivePrice(stock))}
                  </strong>
                  {off !== null && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(stock.price)}
                    </span>
                  )}
                </p>
                <p
                  className={`rounded-md px-3 py-2 text-base font-bold ${
                    stock.stock > 0
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {stock.stock > 0
                    ? `${stock.stock} unidade(s) em estoque`
                    : "Sem estoque"}
                </p>
                <Button
                  className="mt-auto"
                  size="sm"
                  disabled={stock.stock <= 0}
                  onClick={() => {
                    addItem(product.id, store.id);
                    toast.success(`${product.name} adicionado ao carrinho.`);
                    describe(`${product.name} adicionado ao carrinho na loja ${store.name}.`);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar ao carrinho
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {visible.length === 0 && (
        <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          Nenhum produto disponível nesta loja.
        </p>
      )}
    </main>
  );
}