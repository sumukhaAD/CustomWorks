import { Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/cw/ProductCard";

export function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 border-t border-border">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">Bestsellers</p>
          <h2 className="mt-3 font-serif text-3xl lg:text-5xl text-foreground">Loved by our customers</h2>
        </div>
        <Link to="/shop" className="hidden sm:inline-block text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent-dark border-b border-foreground pb-1">
          Shop all
        </Link>
      </div>
      <div className="flex gap-5 overflow-x-auto -mx-6 px-6 pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
        {featured.map((p) => (
          <div key={p.id} className="min-w-[260px] lg:min-w-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
