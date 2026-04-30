import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "icon";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:bg-accent-dark hover:text-paper",
  secondary: "bg-cream text-foreground hover:bg-border",
  ghost: "bg-transparent text-foreground hover:bg-cream",
  outline: "bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background",
  icon: "bg-transparent text-foreground hover:bg-cream rounded-full",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-wide",
  md: "h-11 px-6 text-sm tracking-wide",
  lg: "h-14 px-8 text-sm tracking-widest",
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium uppercase transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const isIcon = variant === "icon";
  return (
    <button
      className={cn(base, variantClass[variant], !isIcon && sizeClass[size], isIcon && "h-10 w-10", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps extends BaseProps {
  to: string;
  params?: Record<string, string>;
}

export function LinkButton({ variant = "primary", size = "md", className, to, params, children }: LinkButtonProps) {
  const isIcon = variant === "icon";
  return (
    <Link
      to={to}
      params={params as never}
      className={cn(base, variantClass[variant], !isIcon && sizeClass[size], isIcon && "h-10 w-10", className)}
    >
      {children}
    </Link>
  );
}
