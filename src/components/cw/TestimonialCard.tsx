import { Star } from "lucide-react";
import type { Testimonial } from "@/types";

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-paper border border-border p-8 flex flex-col gap-6 h-full">
      <div className="flex gap-0.5 text-accent-dark">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4" fill="currentColor" />
        ))}
      </div>
      <p className="font-serif text-xl leading-snug text-foreground">"{t.review}"</p>
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border">
        <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
        <div>
          <p className="text-sm font-medium text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.product}</p>
        </div>
      </div>
    </div>
  );
}
