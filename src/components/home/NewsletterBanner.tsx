import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    // TODO: connect to Lovable Cloud / Supabase newsletter table
  };

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-20 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Newsletter</p>
          <h2 className="mt-3 font-serif text-3xl lg:text-5xl">Get the inside line.</h2>
          <p className="mt-3 text-sm text-background/70 max-w-md">
            Get updates on new products, behind-the-scenes craft notes, and exclusive offers.
          </p>
        </div>
        <form onSubmit={submit} className="lg:col-span-6">
          {submitted ? (
            <p className="font-serif text-2xl text-accent">Thanks — see you in your inbox.</p>
          ) : (
            <>
              <div className="flex border-b border-background/40 focus-within:border-accent transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 bg-transparent py-4 outline-none text-base placeholder:text-background/40"
                  aria-label="Email address"
                />
                <button type="submit" className="px-4 hover:text-accent transition-colors" aria-label="Subscribe">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-accent">{error}</p>}
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-background/50">No spam. Unsubscribe any time.</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
