import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-dark">Error 404</p>
        <h1 className="mt-4 font-serif text-6xl text-foreground">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-accent-dark transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CustomWorks — Made-to-Order Apparel & Gifts, Crafted in India" },
      {
        name: "description",
        content:
          "CustomWorks crafts premium made-to-order apparel, accessories, and corporate gifts in India. Design it, customize it, and we'll ship it in days.",
      },
      { name: "author", content: "CustomWorks" },
      { property: "og:title", content: "CustomWorks — Made-to-Order Apparel & Gifts" },
      { property: "og:description", content: "Premium customization, crafted in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});


function RootComponent() {
  const setUser = useUserStore((s) => s.setUser);
  const signOut = useUserStore((s) => s.signOut);

  useEffect(() => {
    if (!supabase) return;

    // On first load — restore any existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name:
            session.user.user_metadata?.full_name ??
            session.user.user_metadata?.name ??
            "",
          addresses: [],
        });
      }
    });

    // Listen for login / logout / token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            name:
              session.user.user_metadata?.full_name ??
              session.user.user_metadata?.name ??
              "",
            addresses: [],
          });
        } else {
          signOut();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Outlet />;
}