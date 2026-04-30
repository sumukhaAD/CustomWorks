import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "new" | "sale" | "custom" | "neutral";

const tones: Record<Tone, string> = {
  new: "bg-foreground text-background",
  sale: "bg-destructive text-destructive-foreground",
  custom: "bg-accent text-accent-foreground",
  neutral: "bg-cream text-foreground border border-border",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
