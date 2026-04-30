import { Link } from "@tanstack/react-router";
import { Camera, Send, Briefcase, MessageCircle } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-cream border-t border-border mt-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-20 grid gap-12 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl text-foreground">CustomWorks</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Made-to-order apparel, accessories, and corporate gifts — crafted in India, designed for you.
          </p>
          <div className="flex items-center gap-2 mt-6">
            {[
              { icon: Camera, href: "https://instagram.com", label: "Instagram" },
              { icon: Send, href: "https://twitter.com", label: "Twitter / X" },
              { icon: Briefcase, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: MessageCircle, href: "https://wa.me/910000000000", label: "WhatsApp" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="h-10 w-10 flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {(["shop", "help", "company"] as const).map((key) => (
          <div key={key}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{key}</p>
            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS[key].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-foreground hover:text-accent-dark transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CustomWorks. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono uppercase tracking-widest">Visa</span>
            <span className="font-mono uppercase tracking-widest">Mastercard</span>
            <span className="font-mono uppercase tracking-widest">Razorpay</span>
            <span className="font-mono uppercase tracking-widest">UPI</span>
          </div>
          <p className="uppercase tracking-[0.2em]">Made in India</p>
        </div>
      </div>
    </footer>
  );
}
