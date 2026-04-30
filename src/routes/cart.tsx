import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useCartStore, selectSubtotal } from "@/store/cartStore";
import { formatINR } from "@/lib/constants";
import { Plus, Minus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Bag — CustomWorks" }] }),
});

function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);
  const gst = Math.round(subtotal * 0.05);
  const shipping = subtotal > 1499 || subtotal === 0 ? 0 : 99;

  return (
    <Layout>
      <PageHeader
        eyebrow="Cart"
        title="Your bag"
        crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
      />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-3xl">Your bag is empty.</p>
            <Link
              to="/shop"
              className="mt-8 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
            >
              Discover the collection
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <ul className="divide-y divide-border border-y border-border">
                {items.map((i) => (
                  <li key={i.id} className="py-6 flex gap-6">
                    <div className="h-32 w-24 lg:h-40 lg:w-32 bg-cream overflow-hidden shrink-0">
                      <img
                        src={i.image}
                        alt={i.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-lg text-foreground">{i.productName}</p>
                          <p className="text-xs text-muted-foreground mt-1">{i.variantName}</p>
                        </div>
                        <p className="font-mono text-foreground">{formatINR(i.totalPrice)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="inline-flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(i.id, i.quantity - 1)}
                            className="h-9 w-9 flex items-center justify-center hover:bg-cream"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center font-mono text-sm">{i.quantity}</span>
                          <button
                            onClick={() => updateQuantity(i.id, i.quantity + 1)}
                            className="h-9 w-9 flex items-center justify-center hover:bg-cream"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(i.id)}
                          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="lg:col-span-4 bg-cream p-8 h-fit">
              <p className="text-[10px] uppercase tracking-[0.25em] text-accent-dark">
                Order Summary
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-mono">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">GST (est.)</dt>
                  <dd className="font-mono">{formatINR(gst)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-mono">{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
                </div>
              </dl>
              <div className="mt-6 pt-6 border-t border-border flex justify-between items-baseline">
                <p className="text-sm uppercase tracking-[0.2em]">Total</p>
                <p className="font-mono text-2xl">{formatINR(subtotal + gst + shipping)}</p>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block text-center bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent-dark transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="mt-3 block text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}
