import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";

const SECTIONS = [
  { id: "overview", title: "Overview", body: "This Privacy Policy describes how CustomWorks collects, uses, and protects your information when you use our website and services. (Placeholder text — to be reviewed by counsel.)" },
  { id: "info", title: "Information We Collect", body: "We collect information you provide directly (name, email, address, payment details) and information collected automatically (device info, cookies, usage data)." },
  { id: "use", title: "How We Use Information", body: "We use your information to fulfill orders, provide customer support, improve our products, and send marketing communications you've opted into." },
  { id: "sharing", title: "Sharing", body: "We don't sell personal data. We share information only with vetted service providers — payment, shipping, analytics — under strict data-protection agreements." },
  { id: "rights", title: "Your Rights", body: "You can request access, correction, or deletion of your personal data at any time by writing to privacy@customworks.in." },
  { id: "contact", title: "Contact", body: "Questions about this policy? Email privacy@customworks.in or write to our Bangalore studio." },
];

export const Route = createFileRoute("/privacy-policy")({
  component: Privacy,
  head: () => ({ meta: [{ title: "Privacy Policy — CustomWorks" }] }),
});

function Privacy() {
  return (
    <Layout>
      <PageHeader eyebrow="Legal" title="Privacy Policy" crumbs={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]} />
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
