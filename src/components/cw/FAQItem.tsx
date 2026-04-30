import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-6 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-serif text-lg text-foreground group-hover:text-accent-dark transition-colors">{q}</span>
        <span className="shrink-0 h-8 w-8 rounded-full border border-border flex items-center justify-center text-foreground">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="text-muted-foreground leading-relaxed pr-12">{a}</p>
        </div>
      </div>
    </div>
  );
}
