/* eslint-disable prettier/prettier */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useUserStore } from "@/store/userStore";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import { User, Package, MapPin, ChevronRight, LogOut } from "lucide-react";

export const Route = createFileRoute("/account/")({
  component: AccountOverview,
  head: () => ({ meta: [{ title: "My Account — CustomWorks" }] }),
});

interface Profile {
  name: string | null;
  phone: string | null;
}

interface OrderSummary {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  designing: "Designing",
  processing: "Processing",
  ready_to_ship: "Ready to Ship",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const STATUS_COLOR: Record<string, string> = {
  designing: "text-yellow-600",
  processing: "text-blue-600",
  ready_to_ship: "text-purple-600",
  dispatched: "text-orange-600",
  delivered: "text-green-600",
};

function AccountOverview() {
  const user = useUserStore((s) => s.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !supabase) { setLoading(false); return; }
    Promise.all([
      supabase.from("profiles").select("name, phone").eq("id", user.id).single(),
      supabase.from("orders").select("id, status, total_amount, created_at")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
    ]).then(([profileRes, ordersRes]) => {
      if (profileRes.data) setProfile(profileRes.data);
      if (ordersRes.data) setRecentOrders(ordersRes.data);
      setLoading(false);
    });
  }, [user]);

  const displayName = profile?.name || user?.name || user?.email || "there";

  return (
    <Layout>
      <PageHeader
        eyebrow="Account"
        title={`Hi, ${displayName}`}
        crumbs={[{ label: "Home", to: "/" }, { label: "Account" }]}
      />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 grid lg:grid-cols-12 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-1 text-sm">
          <Link to="/account" className="flex items-center gap-2 py-2 px-3 bg-foreground text-background font-medium">
            <User size={14} /> Overview
          </Link>
          <Link to="/account/orders" className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-colors">
            <Package size={14} /> Orders
          </Link>
          <Link to="/account/addresses" className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-colors">
            <MapPin size={14} /> Addresses
          </Link>
          <button
            onClick={async () => {
              if (supabase) await supabase.auth.signOut();
              useUserStore.getState().signOut();
              window.location.href = "/";
            }}
            className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </aside>

        {/* Main */}
        <div className="lg:col-span-9 space-y-8">
          {/* Profile */}
          <div className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Profile</h2>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground w-20 inline-block">Name</span>{profile?.name || <span className="text-muted-foreground italic">Not set</span>}</p>
                <p><span className="text-muted-foreground w-20 inline-block">Email</span>{user?.email}</p>
                <p><span className="text-muted-foreground w-20 inline-block">Phone</span>{profile?.phone || <span className="text-muted-foreground italic">Not set</span>}</p>
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div className="border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recent Orders</h2>
              <Link to="/account/orders" className="text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No orders yet. <Link to="/shop" className="underline">Start shopping</Link></p>
            ) : (
              <ul className="divide-y divide-border">
                {recentOrders.map(o => (
                  <li key={o.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm">#{o.id.slice(0,8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{formatINR(Number(o.total_amount))}</p>
                      <p className={`text-xs uppercase tracking-[0.15em] mt-0.5 ${STATUS_COLOR[o.status] || "text-muted-foreground"}`}>
                        {STATUS_LABEL[o.status] || o.status}
                      </p>
                    </div>
                    <Link to="/account/track/$orderId" params={{ orderId: o.id }} className="text-muted-foreground hover:text-foreground">
                      <ChevronRight size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}