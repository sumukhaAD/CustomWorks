import { Link } from "@tanstack/react-router";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useCartStore, selectSubtotal } from "@/store/cartStore";
import { formatINR } from "@/lib/constants";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <>
      <div
        onClick={() => toggleCart(false)}
        className={`fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-paper transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <p className="text-[10px] uppercase tracking-[0.25em]">Your Bag · {items.length}</p>
          <button onClick={() => toggleCart(false)} aria-label="Close cart" className="h-10 w-10 flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl text-foreground">Your bag is empty</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">Discover our made-to-order collection — designed and shipped in days.</p>
              <Link
                to="/shop"
                onClick={() => toggleCart(false)}
                className="mt-6 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.2em]"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4">
                  <div className="h-24 w-20 bg-cream overflow-hidden shrink-0">
                    <img src={i.image} alt={i.productName} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{i.productName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{i.variantName}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(i.id, i.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-cream"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs">{i.quantity}</span>
                        <button
                          onClick={() => updateQuantity(i.id, i.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-cream"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-mono text-sm">{formatINR(i.totalPrice)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(i.id)} aria-label="Remove" className="self-start text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 bg-cream">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subtotal</p>
              <p className="font-mono text-lg text-foreground">{formatINR(subtotal)}</p>
            </div>
            <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
            <Link
              to="/checkout"
              onClick={() => toggleCart(false)}
              className="block w-full text-center bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent-dark transition-colors"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => toggleCart(false)}
              className="block w-full text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
