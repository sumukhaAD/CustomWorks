import { Scissors, Star, Truck, Headphones } from "lucide-react";
import { WHY_WORKS } from "@/lib/constants";

const ICONS = { Scissors, Star, Truck, Headphones } as const;

export function WhyCustomWorks() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">Why CustomWorks?</p>
          <h2 className="mt-3 font-serif text-3xl lg:text-5xl text-foreground">A craft-first approach to commerce.</h2>
        </div>
        <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_WORKS.map((w) => {
            const Icon = ICONS[w.icon as keyof typeof ICONS];
            return (
              <div key={w.title} className="bg-paper p-8 border border-border">
                <div className="h-12 w-12 rounded-full bg-cream flex items-center justify-center text-accent-dark">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-serif text-xl text-foreground">{w.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
