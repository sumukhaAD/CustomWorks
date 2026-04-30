import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-muted-foreground tracking-wide">
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {c.to && !isLast ? (
              <Link to={c.to} className="hover:text-foreground transition-colors uppercase">{c.label}</Link>
            ) : (
              <span className={`uppercase ${isLast ? "text-foreground" : ""}`}>{c.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3" />}
          </span>
        );
      })}
    </nav>
  );
}
