import ProductImage from "@/components/ProductImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAudioDescribe } from "@/lib/accessibility";
import { discountPercent, effectivePrice, formatPrice } from "@/lib/format";
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
  const bestPrice = best ? effectivePrice(best) : null;
  const off = best ? discountPercent(best) : null;

  const summary = `${product.name}, ${product.unit}. ${product.audioDescription}. ${
    best
      ? `Melhor preço ${formatPrice(bestPrice ?? 0)} no ${bestStore?.name ?? "parceiro"}.`
      : "Sem estoque disponível."
  }`;

  return (
    <Card className="flex h-full flex-col">
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
      <CardContent className="flex-1 space-y-3 pt-4">
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
            <strong className="text-2xl font-extrabold text-primary">
              {formatPrice(bestPrice ?? best.price)}
            </strong>
            {off !== null && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatPrice(best.price)}
              </span>
            )}
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
