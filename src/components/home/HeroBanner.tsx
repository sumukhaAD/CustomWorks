import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  const scrollToHow = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-cream grain">
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 min-h-[80vh] lg:min-h-[calc(100vh-5rem)] grid lg:grid-cols-12 gap-10 items-center py-16 lg:py-0">
        <div className="lg:col-span-7 fade-in-up">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">CustomWorks · India</p>
          <h1 className="mt-6 font-serif text-[44px] sm:text-6xl lg:text-7xl xl:text-[88px] leading-[1.02] text-foreground">
            Crafted with intent.<br />
            <span className="italic text-accent-dark">Made just for you.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base lg:text-lg text-muted-foreground leading-relaxed">
            Premium made-to-order apparel, accessories, and corporate gifts — designed in your studio,
            crafted in ours, shipped across India in days.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 h-14 text-xs uppercase tracking-[0.25em] hover:bg-accent-dark transition-colors"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              onClick={scrollToHow}
              className="inline-flex items-center justify-center gap-3 border border-foreground px-8 h-14 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
            >
              How It Works
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
            {[
              { n: "12k+", l: "Pieces Crafted" },
              { n: "5–7", l: "Day Turnaround" },
              { n: "4.9★", l: "Customer Rating" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-serif text-2xl text-foreground">{s.n}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-paper">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
              alt="Custom embroidered apparel hanging in a studio"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="hidden lg:block absolute -bottom-6 -left-10 bg-paper border border-border p-5 max-w-[220px] shadow-sm">
            <p className="font-serif text-sm text-foreground">"Felt like a couture piece."</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">— Aanya, Mumbai</p>
          </div>
        </div>
      </div>
    </section>
  );
}
