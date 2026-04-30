import { TESTIMONIALS } from "@/lib/constants";
import { TestimonialCard } from "@/components/cw/TestimonialCard";

export function Testimonials() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">Testimonials</p>
          <h2 className="mt-3 font-serif text-3xl lg:text-5xl text-foreground">What our customers say.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
