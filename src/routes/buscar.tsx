import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccessibility } from "@/lib/accessibility";
import { catalogQueryOptions } from "@/lib/catalog";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, Search, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/buscar")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Buscar produtos | ConectaMercado" },
      {
        name: "description",
        content:
          "Busque produtos por texto ou por voz e compare preços entre as lojas parceiras do ConectaMercado.",
      },
      { property: "og:title", content: "Buscar produtos | ConectaMercado" },
      {
        property: "og:description",
        content: "Busca acessível de produtos por texto ou por voz, com comparação de preços.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data, isLoading } = useQuery(catalogQueryOptions);
  const { isListening, startListening, stopListening, voiceSupportError, speak } =
    useAccessibility();
  const [term, setTerm] = useState(q);
  const [category, setCategory] = useState<string | null>(null);
  const [onlyPromo, setOnlyPromo] = useState(false);

  useEffect(() => {
    setTerm(q);
  }, [q]);

  const results = useMemo(() => {
    const products = data?.products ?? [];
    const normalized = term.trim().toLowerCase();
    return products.filter((product) => {
      const matchesTerm =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);
      const matchesCategory = !category || product.category === category;
      const matchesPromo =
        !onlyPromo ||
        product.stocks.some((stock) => stock.promoPrice !== null && stock.promoPrice < stock.price);
      return matchesTerm && matchesCategory && matchesPromo;
    });
  }, [data, term, category, onlyPromo]);

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening((transcript) => {
      setTerm(transcript);
      speak(`Buscando por ${transcript}`);
    });
  };

  return (
    <main className="container space-y-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Buscar produtos</h1>
        <p className="text-muted-foreground">Digite o nome do produto ou use a busca por voz.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Ex.: arroz, leite, feijão…"
            className="pl-9"
            aria-label="Buscar produtos por nome"
          />
        </div>
        <Button
          variant={isListening ? "default" : "outline"}
          onClick={handleVoiceSearch}
          aria-pressed={isListening}
        >
          {isListening ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
          {isListening ? "Ouvindo…" : "Buscar por voz"}
        </Button>
      </div>
      {voiceSupportError && (
        <p role="alert" className="text-sm text-destructive">
          {voiceSupportError}
        </p>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
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
          variant={category === null ? "default" : "outline"}
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
        >
          Todas
        </Button>
        {(data?.categories ?? []).map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={category === cat ? "default" : "outline"}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {isLoading ? "Carregando produtos…" : `${results.length} produto(s) encontrado(s).`}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))
          : results.map((product) => (
              <ProductCard key={product.id} product={product} stores={data?.stores ?? []} />
            ))}
      </div>

      {!isLoading && results.length === 0 && (
        <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Nenhum produto encontrado. Tente outro termo.
        </p>
      )}
    </main>
  );
}
