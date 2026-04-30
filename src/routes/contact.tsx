import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — CustomWorks" },
      { name: "description", content: "Get in touch with the CustomWorks team for orders, customization queries, or corporate gifting." },
    ],
  }),
});

const SUBJECTS = ["General enquiry", "Custom order", "Corporate gifting", "Order issue"];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Required";
    if (!form.email) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message) e.message = "Required";
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setDone(true);
      // TODO: persist to Lovable Cloud / send email via edge function
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Contact"
        title="We're around. Say hello."
        description="Questions about a custom order, corporate gifting, or something else? Drop us a line and a real human will get back within one business day."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          {done ? (
            <div className="border border-border p-10 bg-cream">
              <p className="font-serif text-3xl">Thanks — we got it.</p>
              <p className="mt-3 text-muted-foreground">We'll be in touch within one business day.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6" noValidate>
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Subject</span>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground py-2 outline-none text-foreground"
                >
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Message</span>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground py-2 outline-none text-foreground resize-none"
                />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </label>
              <button type="submit" className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent-dark transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-cream p-8 space-y-4">
            <Detail icon={Mail} label="Email" value="hello@customworks.in" />
            <Detail icon={Phone} label="Phone" value="+91 80 4567 8910" />
            <Detail icon={MapPin} label="Studio" value="14, Indiranagar, Bangalore — 560038" />
            <Detail icon={Clock} label="Hours" value="Mon–Sat · 10:00–19:00 IST" />
          </div>
          <a
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 text-xs uppercase tracking-[0.25em] hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </aside>
      </section>
    </Layout>
  );
}

function Field({ label, value, onChange, error, type = "text" }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-transparent border-b border-border focus:border-foreground py-2 outline-none text-foreground" />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </label>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-full bg-paper flex items-center justify-center text-accent-dark shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground mt-1">{value}</p>
      </div>
    </div>
  );
}
