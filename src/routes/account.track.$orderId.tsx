import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useUserStore } from "@/store/userStore";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/constants";
import { Check, Package, Truck, Home, Paintbrush } from "lucide-react";

export const Route = createFileRoute("/account/track/$orderId")({
  component: TrackOrder,
  head: () => ({ meta: [{ title: "Track Order — CustomWorks" }] }),
});

interface OrderDetail {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    customization_data: Record<string, string> | null;
    design_snapshot_url: string | null;
  }[];
}

const STEPS = [
  { key: "designing", label: "Designing", icon: Paintbrush },
  { key: "processing", label: "Processing", icon: Package },
  { key: "ready_to_ship", label: "Ready to Ship", icon: Package },
  { key: "dispatched", label: "Dispatched", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

function getStepIndex(status: string) {
  return STEPS.findIndex((s) => s.key === status);
}

function TrackOrder() {
  const { orderId } = Route.useParams();
  const user = useUserStore((s) => s.user);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("orders")
      .select(
        "id, status, total_amount, shipping_address, created_at, order_items(id, quantity, price_at_time, customization_data, design_snapshot_url)"
      )
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setOrder(data as OrderDetail);
        }
        setLoading(false);
      });
  }, [orderId, user]);

  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Account", to: "/account" },
    { label: "Orders", to: "/account/orders" },
    { label: "Track" },
  ];

  if (!user) {
    return (
      <Layout>
        <PageHeader eyebrow="Account" title="Track Order" crumbs={crumbs} />
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

  if (loading) {
    return (
      <Layout>
        <PageHeader eyebrow="Account" title="Track Order" crumbs={crumbs} />
        <div className="mx-auto max-w-3xl px-6 py-12 space-y-4">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
          <div className="h-48 bg-muted animate-pulse rounded" />
        </div>
      </Layout>
    );
  }

  if (notFound || !order) {
    return (
      <Layout>
        <PageHeader eyebrow="Account" title="Order not found" crumbs={crumbs} />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            This order doesn't exist or doesn't belong to your account.
          </p>
          <Link
            to="/account/orders"
            className="inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
          >
            Back to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  const currentStep = getStepIndex(order.status);

  return (
    <Layout>
      <PageHeader
        eyebrow="Account"
        title={`Order #${order.id.slice(0, 8).toUpperCase()}`}
        crumbs={crumbs}
      />

      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-12 space-y-10">
        {/* Status timeline */}
        <div className="border border-border p-6 lg:p-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Order Status
          </h2>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-5 left-5 right-5 h-px bg-border" />
            <div
              className="absolute top-5 left-5 h-px bg-foreground transition-all duration-500"
              style={{
                width:
                  currentStep <= 0
                    ? "0%"
                    : `${(currentStep / (STEPS.length - 1)) * 100}%`,
              }}
            />

            <div className="relative flex justify-between">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center gap-2 w-16"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 ${
                        done
                          ? "bg-foreground border-foreground text-background"
                          : active
                            ? "bg-background border-foreground text-foreground"
                            : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-[0.1em] text-center leading-tight ${
                        active
                          ? "text-foreground font-medium"
                          : done
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="border border-border p-6 lg:p-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Order Summary
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{order.order_items.length}</span>
            </div>
            {order.shipping_address && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">
                  Ship to
                </span>
                <span className="text-right">{order.shipping_address}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border mt-2 font-medium">
              <span>Total</span>
              <span>{formatINR(Number(order.total_amount))}</span>
            </div>
          </div>
        </div>

        {/* Order items */}
        {order.order_items.length > 0 && (
          <div className="border border-border p-6 lg:p-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Items
            </h2>
            <ul className="divide-y divide-border">
              {order.order_items.map((item) => (
                <li key={item.id} className="py-4 flex gap-4">
                  {item.design_snapshot_url && (
                    <img
                      src={item.design_snapshot_url}
                      alt="Design preview"
                      className="w-16 h-16 object-cover border border-border shrink-0"
                    />
                  )}
                  <div className="flex-1 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-mono">
                        {formatINR(Number(item.price_at_time))}
                      </span>
                    </div>
                    {item.customization_data &&
                      Object.entries(item.customization_data).map(
                        ([k, v]) => (
                          <p key={k} className="text-xs text-muted-foreground">
                            {k}: {v}
                          </p>
                        )
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          to="/account/orders"
          className="inline-block text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5"
        >
          ← Back to Orders
        </Link>
      </div>
    </Layout>
  );
}