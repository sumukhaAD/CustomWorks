import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  profiles: { name: string | null; email?: string } | null;
}

const STATUS_OPTIONS = [
  "all", "designing", "processing", "ready_to_ship", "dispatched", "delivered",
];

const STATUS_LABEL: Record<string, string> = {
  designing: "Designing",
  processing: "Processing",
  ready_to_ship: "Ready to Ship",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const STATUS_COLOR: Record<string, string> = {
  designing: "text-yellow-700 bg-yellow-50",
  processing: "text-blue-700 bg-blue-50",
  ready_to_ship: "text-purple-700 bg-purple-50",
  dispatched: "text-orange-700 bg-orange-50",
  delivered: "text-green-700 bg-green-50",
};

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("orders")
      .select("id, status, total_amount, created_at, profiles(name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "all"
    ? orders
    : orders.filter(o => o.status === filter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs uppercase tracking-[0.15em] border transition-colors ${
              filter === s
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-14 bg-muted animate-pulse rounded border border-border" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No orders found.</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {/* Header */}
          <div className="grid grid-cols-12 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground bg-muted">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1" />
          </div>

          {filtered.map(o => (
            <Link
              key={o.id}
              to="/admin/orders/$orderId"
              params={{ orderId: o.id }}
              className="grid grid-cols-12 px-4 py-3.5 items-center hover:bg-muted/50 transition-colors group"
            >
              <div className="col-span-3 font-mono text-xs">
                #{o.id.slice(0, 8).toUpperCase()}
              </div>
              <div className="col-span-3 text-sm truncate">
                {o.profiles?.name || <span className="text-muted-foreground italic">Unknown</span>}
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </div>
              <div className="col-span-2 font-mono text-sm">
                {formatINR(Number(o.total_amount))}
              </div>
              <div className="col-span-1">
                <span className={`text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm font-medium ${STATUS_COLOR[o.status] || "bg-muted text-muted-foreground"}`}>
                  {STATUS_LABEL[o.status] || o.status}
                </span>
              </div>
              <div className="col-span-1 flex justify-end text-muted-foreground group-hover:text-foreground transition-colors">
                <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}