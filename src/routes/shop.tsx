import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useState } from "react";
import { PRINT_PRODUCTS, PRINT_CATEGORIES } from "@/lib/products";
import { formatINR } from "@/lib/constants";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop — CustomWorks" },
      { name: "description", content: "Browse our full catalogue of premium print and customisation products." },
    ],
  }),
});

function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PRINT_PRODUCTS.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      <PageHeader
        eyebrow="Shop"
        title="Product Catalogue"
        description="Premium print solutions — designed with you, crafted for your brand."
        crumbs={[{ label: "Home", to: "/" }, { label: "Shop" }]}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10">
        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full max-w-sm bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {PRINT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.15em] border transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-[0.15em]">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="group border border-border hover:border-foreground transition-all duration-200 flex flex-col"
              >
                {/* Product image */}
                <div className="bg-[#0e0c0a] p-4 aspect-[4/3] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-medium text-foreground leading-snug">
                    {product.name}
                  </h3>
                  <span className="text-[9px] uppercase tracking-[0.1em] text-accent-dark bg-muted px-2 py-0.5 self-start">
                    {product.tag}
                  </span>
                  <p className="text-xs text-muted-foreground mt-auto pt-2">
                    From{" "}
                    <span className="text-foreground font-medium">
                      {formatINR(product.priceTiers[0]?.price ?? 0)}
                    </span>
                    {" "}/ {product.priceTiers[0]?.qty} pcs
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}