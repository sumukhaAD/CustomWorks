import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";

export const Route = createFileRoute("/account")({
  component: AccountLayout,
});

function AccountLayout() {
  const user = useUserStore((s) => s.user);

  if (!user) {
    return (
      <Layout>
        <PageHeader
          eyebrow="Account"
          title="Sign in to your account"
          crumbs={[{ label: "Home", to: "/" }, { label: "Account" }]}
        />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <p className="text-muted-foreground">
            You're not signed in. Sign in to view your orders and account details.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
          >
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  return <Outlet />;
}

void redirect;