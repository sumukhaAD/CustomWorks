import { HOW_IT_WORKS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
        <div className="lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">How It Works</p>
          <h2 className="mt-3 font-serif text-3xl lg:text-5xl text-foreground">Three simple steps to your custom piece.</h2>
        </div>
        <p className="lg:col-span-6 lg:col-start-7 text-muted-foreground leading-relaxed">
          From idea to doorstep in under a week. No minimums, no surprises — just a calm, considered process built for people who care about the details.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
        {HOW_IT_WORKS.map((s) => (
          <div key={s.n} className="bg-paper p-8 lg:p-10 flex flex-col gap-5">
            <p className="font-mono text-sm text-accent-dark">{s.n}</p>
            <h3 className="font-serif text-2xl lg:text-3xl text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
