import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";

const SECTIONS = [
  { id: "policy", title: "Refund Policy", body: "Custom-made products are non-returnable. However, if you receive a defective or incorrect item, we'll replace or refund it — no questions asked. (Placeholder text — to be reviewed by counsel.)" },
  { id: "eligibility", title: "Eligibility", body: "Defects, print/embroidery errors, and shipping damage are eligible. Change of mind on customized goods is not eligible." },
  { id: "process", title: "Process", body: "Email care@customworks.in within 48 hours of delivery with photos. We'll respond within one business day with a resolution." },
  { id: "timeline", title: "Refund Timeline", body: "Approved refunds are issued to the original payment method and typically reflect within 5–7 business days." },
  { id: "contact", title: "Contact", body: "Questions? Email care@customworks.in." },
];

export const Route = createFileRoute("/refund-policy")({
  component: Refund,
  head: () => ({ meta: [{ title: "Refund Policy — CustomWorks" }] }),
});

function Refund() {
  return (
    <Layout>
      <PageHeader eyebrow="Legal" title="Refund Policy" crumbs={[{ label: "Home", to: "/" }, { label: "Refund Policy" }]} />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 grid lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 lg:sticky lg:top-28 self-start hidden lg:block">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">On this page</p>
          <ul className="space-y-2 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">{s.title}</a></li>
            ))}
          </ul>
        </aside>
        <article className="lg:col-span-9 max-w-2xl space-y-10">
          <p className="text-xs text-muted-foreground">Last updated: 1 April 2026 · TODO: legal review.</p>
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="font-serif text-2xl text-foreground">{s.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}
        </article>
      </div>
    </Layout>
  );
}
