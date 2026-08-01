import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAudioDescribe } from "@/lib/accessibility";
import { formatPrice } from "@/lib/format";
import type { Product, Store } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  stores: Store[];
}

export default function ProductCard({ product, stores }: ProductCardProps) {
  const describe = useAudioDescribe();
  const best = product.stocks[0];
  const bestStore = stores.find((store) => store.id === best?.storeId);

  const summary = `${product.name}, ${product.unit}. ${product.audioDescription}. ${
    best
      ? `Melhor preço ${formatPrice(best.price)} no ${bestStore?.name ?? "parceiro"}.`
      : "Sem estoque disponível."
  }`;

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex-1 space-y-3 pt-6">
        <div className="flex items-start justify-between gap-2">
          <span className="text-4xl" aria-hidden="true">
            {product.imageEmoji}
          </span>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <div>
          <h3 className="font-semibold leading-tight">
            <Link to="/produto/$id" params={{ id: product.id }} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <p className="text-xs text-muted-foreground">{product.unit}</p>
        </div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        {best ? (
          <p className="text-sm">
            A partir de{" "}
            <strong className="text-lg text-primary">{formatPrice(best.price)}</strong>
            {bestStore && (
              <span className="block text-xs text-muted-foreground">
                {bestStore.name} · {bestStore.distanceKm.toFixed(1)} km
              </span>
            )}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Sem estoque nas lojas parceiras.</p>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to="/produto/$id" params={{ id: product.id }}>
            Ver preços
          </Link>
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => describe(summary)}
          aria-label={`Ouvir descrição de ${product.name}`}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
