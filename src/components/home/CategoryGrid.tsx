import { Link } from "@tanstack/react-router";
import { SHOP_CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  const cats = SHOP_CATEGORIES.slice(1); // exclude "All Products"
  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">Categories</p>
          <h2 className="mt-3 font-serif text-3xl lg:text-5xl text-foreground">Browse the collection</h2>
        </div>
        <Link to="/shop" className="hidden sm:inline-block text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent-dark border-b border-foreground pb-1">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cats.map((c) => (
          <Link key={c.label} to={c.to} className="group relative overflow-hidden block aspect-[4/5] bg-cream">
            <img src={c.image} alt={c.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-serif text-xl lg:text-2xl text-paper">{c.label}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-paper/80">Explore →</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
