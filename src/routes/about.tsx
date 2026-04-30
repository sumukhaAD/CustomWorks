import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — CustomWorks" },
      { name: "description", content: "CustomWorks is a craft-first, made-to-order Indian brand. Read our story, values, and meet the team." },
    ],
  }),
});

function About() {
  return (
    <Layout>
      <PageHeader
        eyebrow="About"
        title="Crafted with intent, made for you."
        description="A small team of designers and craftspeople in India making considered, customizable goods — one order at a time."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 aspect-[4/5] bg-cream overflow-hidden">
          <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80" alt="Studio workspace" className="h-full w-full object-cover" />
        </div>
        <div className="lg:col-span-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">Our Story</p>
          <h2 className="mt-3 font-serif text-3xl lg:text-5xl text-foreground">A studio, not a warehouse.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            CustomWorks began in a single Bangalore studio with a quiet idea: what if every piece of clothing or merchandise
            was made only after someone wanted it? No overstock, no markdowns, no waste — just thoughtful pieces, made to last.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Today we work with a small network of master craftspeople across India to bring that idea to life — for individuals,
            small brands, and large companies who care about how things are made.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
          <h2 className="font-serif text-3xl lg:text-5xl text-center">Our values</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { t: "Quality", d: "We obsess over fabric weight, stitch density, and finishing — the details you only notice years later." },
              { t: "Sustainability", d: "Made-to-order means almost zero waste. Recycled packaging, low-impact dyes, and fair pay all the way down." },
              { t: "Customer First", d: "A real human reads every message. Proofs in 24 hours. Replacements without arguments." },
            ].map((v) => (
              <div key={v.t} className="bg-paper p-8 border border-border">
                <p className="font-serif text-2xl text-foreground">{v.t}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">The Team</p>
        <h2 className="mt-3 font-serif text-3xl lg:text-5xl">Meet the makers</h2>
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {[
            { n: "Tanmay THE GAME", r: "Founder & Creative Director", img: "/2.jpeg" },
            { n: "Priya Sharma", r: "Head of Production", img: "https://i.pravatar.cc/400?img=44" },
            { n: "Katte", r: "Customer Craft Lead", img: "/1.jpeg" },
          ].map((m) => (
            <div key={m.n}>
              <div className="aspect-[4/5] bg-cream overflow-hidden">
                <img src={m.img} alt={m.n} className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 font-serif text-xl">{m.n}</p>
              <p className="text-sm text-muted-foreground">{m.r}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
