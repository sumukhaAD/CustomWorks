import { Breadcrumb, type Crumb } from "@/components/cw/Breadcrumb";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}

export function PageHeader({ eyebrow, title, description, crumbs }: Props) {
  return (
    <section className="bg-cream border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
        {crumbs && <div className="mb-6"><Breadcrumb items={crumbs} /></div>}
        {eyebrow && <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">{eyebrow}</p>}
        <h1 className="mt-3 font-serif text-4xl lg:text-6xl text-foreground max-w-4xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-base lg:text-lg text-muted-foreground leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
