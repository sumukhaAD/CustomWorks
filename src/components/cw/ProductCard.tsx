import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Badge } from "./Badge";
import { formatINR } from "@/lib/constants";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

export function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      productName: product.name,
      variantId: "default",
      variantName: "Standard",
      image: product.images[0],
      basePrice: product.basePrice,
      customizations: {},
      quantity: 1,
      totalPrice: product.basePrice,
    });
  };

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden bg-cream aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge tone="new">New</Badge>}
          {product.tags.includes("bestseller") && <Badge tone="custom">Bestseller</Badge>}
        </div>

        <button
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            setWished((w) => !w);
          }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-paper/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-paper transition-colors"
        >
          <Heart className="h-4 w-4" fill={wished ? "currentColor" : "none"} />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={quickAdd}
            className="w-full bg-foreground/90 backdrop-blur text-background py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-foreground"
          >
            Customize Now
          </button>
        </div>
      </div>

      <div className="pt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{product.category}</p>
        </div>
        <p className="font-mono text-sm text-foreground whitespace-nowrap">From {formatINR(product.basePrice)}</p>
      </div>
    </Link>
  );
}
