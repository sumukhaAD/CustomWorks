import { Link } from "@tanstack/react-router";
import { X, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { NAV_LINKS, SHOP_CATEGORIES } from "@/lib/constants";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[88%] max-w-sm bg-paper transition-transform duration-300 lg:hidden flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <span className="font-serif text-xl">CustomWorks</span>
          <button onClick={onClose} aria-label="Close menu" className="h-10 w-10 flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {NAV_LINKS.filter((l) => l.label !== "Shop").map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={onClose}
              className="flex items-center justify-between px-4 h-14 font-serif text-xl text-foreground hover:bg-cream"
            >
              {l.label}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}

          <p className="mt-6 px-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Shop</p>
          <div className="mt-2">
            {SHOP_CATEGORIES.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                onClick={onClose}
                className="flex items-center justify-between px-4 h-12 text-sm text-foreground hover:bg-cream"
              >
                {c.label}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-border p-6 space-y-2">
          <Link
            to="/login"
            onClick={onClose}
            className="block w-full text-center bg-foreground text-background py-3.5 text-xs uppercase tracking-[0.2em]"
          >
            Sign In
          </Link>
          <Link
            to="/account"
            onClick={onClose}
            className="block w-full text-center border border-foreground py-3.5 text-xs uppercase tracking-[0.2em]"
          >
            My Account
          </Link>
        </div>
      </aside>
    </>
  );
}
