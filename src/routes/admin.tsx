import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { LayoutDashboard, Package, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const user = useUserStore((s) => s.user);
  const signOut = useUserStore((s) => s.signOut);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user || !supabase) {
      setChecking(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data);
        setChecking(false);
      });
  }, [user]);

  if (checking) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            Verifying access…
          </p>
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-destructive mb-4">
              Access Denied
            </p>
            <h1 className="font-serif text-3xl mb-4">
              Admin area
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              You don't have permission to view this page.
            </p>
            <Link
              to="/"
              className="inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
            >
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-border">
          <p className="font-serif text-lg">CustomWorks</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
            Admin
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:bg-foreground [&.active]:text-background"
          >
            <LayoutDashboard size={14} /> Overview
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:bg-foreground [&.active]:text-background"
          >
            <Package size={14} /> Orders
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground px-3 mb-2 truncate">
            {user.email}
          </p>
          <button
            onClick={() => {
              supabase?.auth.signOut();
              signOut();
            }}
            className="flex items-center gap-2.5 px-3 py-2 w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}