import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_NAME, APP_TAGLINE } from "@/lib/const";
import { catalogQueryOptions } from "@/lib/catalog";
import { STORE_TYPE_LABEL } from "@/lib/format";
import { discountPercent } from "@/lib/format";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Ear, MapPin, Mic, Search, Truck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConectaMercado — compare preços de mercado com acessibilidade" },
      {
        name: "description",
        content:
          "Encontre produtos, compare preços entre supermercados, hipermercados e atacadistas e compre com áudio-descrição, busca por voz e Libras.",
      },
      { property: "og:title", content: "ConectaMercado — mercados acessíveis" },
      {
        property: "og:description",
        content:
          "Compare preços e estoque em mercados perto de você, com recursos completos de acessibilidade.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: Search,
    title: "Compare preços",
    text: "Veja o preço do mesmo produto em várias lojas parceiras antes de comprar.",
  },
  {
    icon: Truck,
    title: "Entrega ou retirada",
    text: "Escolha entrega em casa, clique e retire ou apenas consultar preços.",
  },
  {
    icon: Mic,
    title: "Busca por voz",
    text: "Fale o nome do produto e encontre sem digitar nada.",
  },
  {
    icon: Ear,
    title: "Áudio-descrição e Libras",
    text: "Descrições faladas dos produtos e tradução automática em Libras.",
  },
];

function Index() {
  const { data, isLoading } = useQuery(catalogQueryOptions);
  const promos = (data?.products ?? [])
    .filter((product) => product.stocks.some((stock) => discountPercent(stock) !== null))
    .sort((a, b) => {
      const da = Math.max(...a.stocks.map((s) => discountPercent(s) ?? 0));
      const db = Math.max(...b.stocks.map((s) => discountPercent(s) ?? 0));
      return db - da;
    })
    .slice(0, 6);
  const highlights = data?.products.slice(0, 12) ?? [];

  return (
    <main className="pb-16">
      <section className="border-b bg-secondary/40">
        <div className="container flex flex-col items-center gap-6 py-14 text-center">
          <img src="/favicon.png" alt="Conecta Mercado" />
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{APP_NAME}</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">{APP_TAGLINE}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/buscar">Buscar produtos</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/lojas">Ver lojas parceiras</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container pt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">🔥 Produtos em promoção</h2>
            <p className="text-sm text-muted-foreground">
              Preços com desconto nas lojas parceiras, por tempo limitado.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/buscar">Ver todos</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))
            : promos.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  stores={data?.stores ?? []}
                />
              ))}
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-2xl font-semibold">Feito para todos</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="space-y-2 pt-6">
                <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold">Produtos em destaque</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/buscar">Ver todos</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))
            : highlights.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  stores={data?.stores ?? []}
                />
              ))}
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-2xl font-semibold">Lojas perto de você</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.stores ?? []).slice(0, 6).map((store) => (
            <Card key={store.id}>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{store.name}</h3>
                  <Badge variant="secondary">
                    {STORE_TYPE_LABEL[store.type] ?? store.type}
                  </Badge>
                </div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {store.address} · {store.distanceKm.toFixed(1)} km
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/loja/$id" params={{ id: store.id }}>
                    Ver produtos da loja
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
