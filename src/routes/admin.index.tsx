import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

interface Stats {
  total: number;
  designing: number;
  processing: number;
  dispatched: number;
  delivered: number;
  revenue: number;
}

function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    total: 0, designing: 0, processing: 0,
    dispatched: 0, delivered: 0, revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("orders")
      .select("status, total_amount")
      .then(({ data }) => {
        if (!data) return;
        const s: Stats = {
          total: data.length,
          designing: data.filter(o => o.status === "designing").length,
          processing: data.filter(o => o.status === "processing").length,
          dispatched: data.filter(o => o.status === "dispatched").length,
          delivered: data.filter(o => o.status === "delivered").length,
          revenue: data.reduce((sum, o) => sum + Number(o.total_amount), 0),
        };
        setStats(s);
        setLoading(false);
      });
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.total, icon: Package, color: "text-foreground" },
    { label: "In Design / Processing", value: stats.designing + stats.processing, icon: Clock, color: "text-yellow-600" },
    { label: "Dispatched", value: stats.dispatched, icon: Truck, color: "text-orange-600" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-600" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {card.label}
                </p>
                <Icon size={14} className={card.color} />
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <p className="font-mono text-3xl">{card.value}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue */}
      <div className="border border-border p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Total Revenue
        </p>
        {loading ? (
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        ) : (
          <p className="font-mono text-4xl">{formatINR(stats.revenue)}</p>
        )}
      </div>
    </div>
  );
}