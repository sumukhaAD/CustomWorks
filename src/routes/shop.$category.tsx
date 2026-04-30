import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { ProductCard } from "@/components/cw/ProductCard";
import { PRODUCTS } from "@/lib/constants";

export const Route = createFileRoute("/shop/$category")({
  component: ShopCategory,
  head: ({ params }) => ({
    meta: [
      { title: `${(params.category || "").replace(/^./, (c) => c.toUpperCase())} — CustomWorks Shop` },
      { name: "description", content: "Made-to-order pieces, crafted in India and shipped in days." },
    ],
  }),
});

function ShopCategory() {
  const { category } = Route.useParams();
  const products = category === "new" ? PRODUCTS.filter((p) => p.isNew) : PRODUCTS.filter((p) => p.category === category);
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <Layout>
      <PageHeader
        eyebrow="Shop"
        title={title}
        description="Curated, made-to-order, and crafted with care."
        crumbs={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, { label: title }]}
      />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16">
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
