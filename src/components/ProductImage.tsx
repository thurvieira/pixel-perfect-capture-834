import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useState } from "react";

interface ProductImageProps {
  product: Product;
  className?: string;
  emojiClassName?: string;
}

export default function ProductImage({ product, className, emojiClassName }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(product.imageUrl) && !failed;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-lg bg-muted",
        className,
      )}
    >
      {showImage ? (
        <img
          src={product.imageUrl}
          alt={`Foto de ${product.name}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={cn("text-4xl", emojiClassName)} aria-hidden="true">
          {product.imageEmoji}
        </span>
      )}
    </div>
  );
}
