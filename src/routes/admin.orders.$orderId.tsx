import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import { ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/admin/orders/$orderId")({
  component: AdminOrderDetail,
});

interface OrderDetail {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
  profiles: { name: string | null; phone: string | null } | null;
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    customization_data: Record<string, string> | null;
    design_snapshot_url: string | null;
  }[];
}

const STATUS_STEPS = [
  { key: "Designing", label: "Designing" },
  { key: "Processing", label: "Processing" },
  { key: "Ready to Ship", label: "Ready to Ship" },
  { key: "Dispatched", label: "Dispatched" },
  { key: "Delivered", label: "Delivered" },
];

function AdminOrderDetail() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("orders")
      .select("id, status, total_amount, shipping_address, created_at, profiles(name, phone), order_items(id, quantity, price_at_time, customization_data, design_snapshot_url)")
      .eq("id", orderId)
      .single()
      .then(({ data }) => {
        if (data) {
          setOrder(data as OrderDetail);
          setSelectedStatus(data.status);
        }
        setLoading(false);
      });
  }, [orderId]);

  async function handleUpdateStatus() {
    if (!supabase || !order || selectedStatus === order.status) return;
    setUpdating(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: selectedStatus })
      .eq("id", order.id);

    if (!error) {
      setOrder(prev => prev ? { ...prev, status: selectedStatus } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setUpdating(false);
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted animate-pulse rounded border border-border" />
        <div className="h-60 bg-muted animate-pulse rounded border border-border" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <Link to="/admin/orders" className="text-xs uppercase tracking-[0.2em] border-b border-foreground mt-4 inline-block">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="p-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/orders"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Placed {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: order info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status timeline */}
          <div className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Order Status
            </h2>
            <div className="relative flex justify-between">
              <div className="absolute top-4 left-4 right-4 h-px bg-border" />
              <div
                className="absolute top-4 left-4 h-px bg-foreground transition-all duration-300"
                style={{
                  width: currentStepIndex <= 0 ? "0%" :
                    `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />
              {STATUS_STEPS.map((step, i) => {
                const done = i < currentStepIndex;
                const active = i === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-colors ${
                      done ? "bg-foreground border-foreground text-background"
                        : active ? "bg-background border-foreground text-foreground"
                          : "bg-background border-border text-muted-foreground"
                    }`}>
                      {done ? <Check size={12} /> : i + 1}
                    </div>
                    <span className={`text-[9px] uppercase tracking-[0.1em] text-center w-14 leading-tight ${
                      active ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order items */}
          <div className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Items ({order.order_items.length})
            </h2>
            <ul className="divide-y divide-border">
              {order.order_items.map(item => (
                <li key={item.id} className="py-4 flex gap-4">
                  {item.design_snapshot_url && (
                    <img
                      src={item.design_snapshot_url}
                      alt="Design"
                      className="w-14 h-14 object-cover border border-border shrink-0"
                    />
                  )}
                  <div className="flex-1 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-mono">{formatINR(Number(item.price_at_time))}</span>
                    </div>
                    {item.customization_data &&
                      Object.entries(item.customization_data).map(([k, v]) => (
                        <p key={k} className="text-xs text-muted-foreground">{k}: {v}</p>
                      ))
                    }
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 mt-2 flex justify-between text-sm font-medium">
              <span>Total</span>
              <span className="font-mono">{formatINR(Number(order.total_amount))}</span>
            </div>
          </div>
        </div>

        {/* Right: actions + customer */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="border border-border p-5">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Customer
            </h2>
            <div className="space-y-1 text-sm">
              <p>{order.profiles?.name || <span className="text-muted-foreground italic">No name</span>}</p>
              {order.profiles?.phone && (
                <p className="text-muted-foreground">{order.profiles.phone}</p>
              )}
              {order.shipping_address && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {order.shipping_address}
                </p>
              )}
            </div>
          </div>

          {/* Update status */}
          <div className="border border-border p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Update Status
            </h2>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-foreground cursor-pointer"
            >
              {STATUS_STEPS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === order.status}
              className="w-full bg-foreground text-background py-2.5 text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              {updating ? "Saving…" : saved ? "✓ Saved" : "Update Status"}
            </button>
          </div>

          {/* Invoice URL */}
          <div className="border border-border p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Invoice URL
            </h2>
            <input
              value={invoiceUrl}
              onChange={e => setInvoiceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-1"
            />
            <p className="text-[10px] text-muted-foreground">
              Paste a Drive/Dropbox link to the invoice PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}