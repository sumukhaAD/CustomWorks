import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useUserStore } from "@/store/userStore";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import { Package, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/account/orders")({
  component: Orders,
  head: () => ({ meta: [{ title: "Orders — CustomWorks" }] }),
});

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: { count: number }[];
}

const STATUS_LABEL: Record<string, string> = {
  designing: "Designing",
  processing: "Processing",
  ready_to_ship: "Ready to Ship",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const STATUS_COLOR: Record<string, string> = {
  designing: "text-yellow-600 bg-yellow-50",
  processing: "text-blue-600 bg-blue-50",
  ready_to_ship: "text-purple-600 bg-purple-50",
  dispatched: "text-orange-600 bg-orange-50",
  delivered: "text-green-600 bg-green-50",
};

function Orders() {
  const user = useUserStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("orders")
      .select("id, status, total_amount, created_at, order_items(count)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data as Order[]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <PageHeader
          eyebrow="Account"
          title="Sign in to view orders"
          crumbs={[
            { label: "Home", to: "/" },
            { label: "Account", to: "/account" },
            { label: "Orders" },
          ]}
        />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <Link
            to="/login"
            className="inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
          >
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        eyebrow="Account"
        title="Order history"
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Orders" },
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 grid lg:grid-cols-12 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-1 text-sm">
          <Link
            to="/account"
            className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            Overview
          </Link>
          <Link
            to="/account/orders"
            className="flex items-center gap-2 py-2 px-3 bg-foreground text-background font-medium"
          >
            <Package size={14} /> Orders
          </Link>
          <Link
            to="/account"
            className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            Addresses
          </Link>
        </aside>

        {/* Orders list */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted animate-pulse rounded border border-border"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-border p-12 text-center">
              <Package
                size={32}
                className="mx-auto text-muted-foreground mb-4"
              />
              <p className="text-sm text-muted-foreground mb-4">
                You haven't placed any orders yet.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border border border-border">
              {orders.map((o) => {
                const itemCount =
                  (o.order_items as any)?.[0]?.count ?? 0;
                return (
                  <li
                    key={o.id}
                    className="py-5 px-6 flex items-center justify-between gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        · {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm">
                        {formatINR(Number(o.total_amount))}
                      </p>
                      <span
                        className={`inline-block mt-1 text-xs uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm font-medium ${STATUS_COLOR[o.status] || "text-muted-foreground bg-muted"}`}
                      >
                        {STATUS_LABEL[o.status] || o.status}
                      </span>
                    </div>

                    <Link
                      to="/account/track/$orderId"
                      params={{ orderId: o.id }}
                      className="shrink-0 flex items-center gap-1 text-xs uppercase tracking-[0.15em] border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity"
                    >
                      Track <ChevronRight size={12} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}