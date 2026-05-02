import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { Menu, ShoppingBag, User, Heart, Search, X } from "lucide-react";
import { useCartStore, selectTotalItems } from "@/store/cartStore";
import { SHOP_CATEGORIES, NAV_LINKS } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore(selectTotalItems);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openMega = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMegaOpen(true), 150);
  }, []);
  const closeMega = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMegaOpen(false), 100);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-paper/95 backdrop-blur shadow-[0_1px_0_0_var(--border)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-6">
          {/* Mobile left */}
          <button
            className="lg:hidden h-10 w-10 -ml-2 flex items-center justify-center"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop left: logo */}
          <Link to="/" className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="font-serif text-2xl tracking-tight text-foreground">CustomWorks</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hidden xl:inline">India</span>
          </Link>

          {/* Mobile center logo */}
          <Link to="/" className="lg:hidden font-serif text-xl text-foreground">
            CustomWorks
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              if (link.label === "Shop") {
                return (
                  <div key={link.label} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <Link
                      to={link.to}
                      className="text-xs uppercase tracking-[0.22em] text-foreground hover:text-accent-dark transition-colors"
                      activeProps={{ className: "text-accent-dark" }}
                    >
                      {link.label}
                    </Link>
                  </div>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-xs uppercase tracking-[0.22em] text-foreground hover:text-accent-dark transition-colors"
                  activeProps={{ className: "text-accent-dark" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex h-10 w-10 items-center justify-center text-foreground hover:bg-cream rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              to="/account"
              className="hidden lg:flex h-10 w-10 items-center justify-center text-foreground hover:bg-cream rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
            </Link>
            <button
              onClick={() => toggleCart(true)}
              className="relative h-10 w-10 flex items-center justify-center text-foreground hover:bg-cream rounded-full transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-foreground text-background text-[10px] font-mono flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Link
              to="/account"
              className="h-10 w-10 flex items-center justify-center text-foreground hover:bg-cream rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Mega dropdown */}
        <div
          className={`hidden lg:block absolute inset-x-0 top-full bg-paper border-t border-border transition-all duration-300 ${
            megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
          }`}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="mx-auto max-w-[1400px] px-10 py-10 grid grid-cols-5 gap-6">
            {SHOP_CATEGORIES.map((c) => (
              <Link key={c.label} to={c.to} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-cream">
                  <img
                    src={c.image}
                    alt={c.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-foreground group-hover:text-accent-dark transition-colors">
                  {c.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Search overlay (lightweight placeholder) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-paper/95 backdrop-blur flex items-start pt-24 px-6 justify-center">
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 border-b border-foreground pb-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search products, categories…"
                className="flex-1 bg-transparent outline-none font-serif text-2xl text-foreground placeholder:text-muted-foreground"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Try: hoodie, monogram, corporate</p>
          </div>
        </div>
      )}
    </>
  );
}
