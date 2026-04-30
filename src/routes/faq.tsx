import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { FAQ_DATA } from "@/lib/constants";
import { FAQItem } from "@/components/cw/FAQItem";

export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({
    meta: [
      { title: "FAQ — CustomWorks" },
      { name: "description", content: "Answers to common questions about ordering, customization, shipping, and returns at CustomWorks." },
    ],
  }),
});

function FAQ() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Help Center"
        title="Frequently asked questions."
        description="Everything you'd want to know about ordering, customization, shipping, and returns."
        crumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      />
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-12 lg:py-16 space-y-14">
        {FAQ_DATA.map((cat) => (
          <section key={cat.category}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent-dark">{cat.category}</p>
            <h2 className="mt-2 font-serif text-3xl text-foreground mb-4">{cat.category}</h2>
            <div>
              {cat.items.map((i) => (
                <FAQItem key={i.q} q={i.q} a={i.a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}
