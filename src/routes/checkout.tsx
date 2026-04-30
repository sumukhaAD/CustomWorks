import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/lib/constants";
import { useState, useEffect } from "react";
import { CheckCircle, MapPin, ShoppingBag, Tag, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — CustomWorks" }] }),
});

type Step = "address" | "review" | "confirm";

interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface Coupon {
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
}

function Checkout() {
  const user = useUserStore((s) => s.user);
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placeError, setPlaceError] = useState("");

  // New address form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "Home", line1: "", line2: "", city: "", state: "", pincode: ""
  });

  const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
    "Jammu and Kashmir","Ladakh","Puducherry","Chandigarh",
  ];

  useEffect(() => {
    if (!user || !supabase) { setLoadingAddresses(false); return; }
    supabase
      .from("addresses")
      .select("id, label, line1, line2, city, state, pincode, is_default")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAddresses(data);
          setSelectedAddress(data[0]);
        }
        setLoadingAddresses(false);
      });
  }, [user]);

  // Totals
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const discountAmount = coupon
    ? coupon.discount_type === "percent"
      ? Math.round((subtotal * coupon.discount_value) / 100)
      : Math.min(coupon.discount_value, subtotal)
    : 0;
  const afterDiscount = subtotal - discountAmount;
  const gst = Math.round(afterDiscount * 0.18);
  const shipping = afterDiscount > 999 || afterDiscount === 0 ? 0 : 99;
  const total = afterDiscount + gst + shipping;

  async function handleApplyCoupon() {
    if (!couponCode.trim() || !supabase) return;
    setApplyingCoupon(true);
    setCouponError("");
    setCoupon(null);
    const { data, error } = await supabase
      .from("coupons")
      .select("code, discount_type, discount_value, min_order_amount, is_active")
      .eq("code", couponCode.trim().toUpperCase())
      .eq("is_active", true)
      .single();
    if (error || !data) {
      setCouponError("Invalid or expired coupon code.");
    } else if (data.min_order_amount && subtotal < data.min_order_amount) {
      setCouponError(
        "Minimum order amount for this coupon is " + formatINR(data.min_order_amount) + "."
      );
    } else {
      setCoupon(data);
    }
    setApplyingCoupon(false);
  }

  async function handlePlaceOrder() {
    if (!user || !supabase || !selectedAddress) return;
    setPlacing(true);
    setPlaceError("");

    const shippingText =
      selectedAddress.line1 +
      (selectedAddress.line2 ? ", " + selectedAddress.line2 : "") +
      ", " + selectedAddress.city +
      ", " + selectedAddress.state +
      " - " + selectedAddress.pincode;

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "Designing",
        total_amount: total,
        shipping_address: shippingText,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setPlaceError("Failed to place order. Please try again.");
      setPlacing(false);
      return;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: null,
      quantity: item.quantity,
      price_at_time: item.totalPrice,
      customization_data: {
        productName: item.productName,
        variantName: item.variantName,
        customizations: item.customizations,
        couponApplied: coupon?.code || null,
      },
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      setPlaceError("Order created but items failed to save. Contact support with order ID: " + order.id);
      setPlacing(false);
      return;
    }

    clearCart();
    setPlacedOrderId(order.id);
    setStep("confirm");
    setPlacing(false);
  }

  // ── Not signed in ──────────────────────────────────────────────
  if (!user) {
    return (
      <Layout>
        <PageHeader
          eyebrow="Checkout"
          title="Sign in to continue"
          crumbs={[{ label: "Home", to: "/" }, { label: "Checkout" }]}
        />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <p className="text-muted-foreground text-sm mb-6">
            You need to be signed in to place an order.
          </p>
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

  // ── Empty cart ──────────────────────────────────────────────────
  if (items.length === 0 && step !== "confirm") {
    return (
      <Layout>
        <PageHeader
          eyebrow="Checkout"
          title="Your cart is empty"
          crumbs={[{ label: "Home", to: "/" }, { label: "Checkout" }]}
        />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <Link
            to="/shop"
            className="inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
          >
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }

  // ── Order confirmed ─────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <Layout>
        <PageHeader
          eyebrow="Checkout"
          title="Order placed"
          crumbs={[{ label: "Home", to: "/" }, { label: "Checkout" }, { label: "Confirmed" }]}
        />
        <div className="mx-auto max-w-xl px-6 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-background" />
          </div>
          <div>
            <h2 className="font-serif text-2xl mb-2">Thank you for your order!</h2>
            <p className="text-muted-foreground text-sm">
              Your order has been received and our team will start working on it shortly.
            </p>
          </div>
          {placedOrderId && (
            <div className="border border-border p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Order ID
              </p>
              <p className="font-mono text-sm">
                {"#" + placedOrderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}
          <div className="bg-muted p-4 text-sm text-muted-foreground text-left space-y-1">
            <p>What happens next:</p>
            <p>1. Share your artwork file via WhatsApp</p>
            <p>2. Our team sends a digital proof within 24 hours</p>
            <p>3. After your approval, production begins</p>
            <p>4. Delivery in {" "}<strong className="text-foreground">3–7 business days</strong></p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/account/orders"
              className="inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="inline-block border border-border px-6 py-3 text-xs uppercase tracking-[0.25em] hover:border-foreground transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Step indicators ─────────────────────────────────────────────
  const steps = [
    { key: "address", label: "Address", icon: MapPin },
    { key: "review", label: "Review", icon: ShoppingBag },
  ];

  return (
    <Layout>
      <PageHeader
        eyebrow="Checkout"
        title="Complete your order"
        crumbs={[{ label: "Home", to: "/" }, { label: "Checkout" }]}
      />

      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-10">
        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.key;
            const done =
              (s.key === "address" && step === "review");
            return (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={
                      "w-7 h-7 rounded-full flex items-center justify-center border transition-colors " +
                      (done
                        ? "bg-foreground border-foreground text-background"
                        : active
                        ? "border-foreground text-foreground"
                        : "border-border text-muted-foreground")
                    }
                  >
                    {done ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Icon size={12} />
                    )}
                  </div>
                  <span
                    className={
                      "text-xs uppercase tracking-[0.15em] " +
                      (active ? "text-foreground font-medium" : "text-muted-foreground")
                    }
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2">

            {/* ── STEP 1: Address ── */}
            {step === "address" && (
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Delivery Address
                </h2>

                {loadingAddresses ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded border border-border" />
                    ))}
                  </div>
                ) : (
                  <>
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowNewAddress(false);
                        }}
                        className={
                          "border p-4 cursor-pointer transition-colors " +
                          (selectedAddress?.id === addr.id && !showNewAddress
                            ? "border-foreground"
                            : "border-border hover:border-foreground")
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center " +
                                (selectedAddress?.id === addr.id && !showNewAddress
                                  ? "border-foreground bg-foreground"
                                  : "border-border")
                              }
                            >
                              {selectedAddress?.id === addr.id && !showNewAddress && (
                                <div className="w-1.5 h-1.5 rounded-full bg-background" />
                              )}
                            </div>
                            <span className="text-xs uppercase tracking-[0.15em] font-medium">
                              {addr.label}
                            </span>
                            {addr.is_default && (
                              <span className="text-[9px] uppercase tracking-[0.1em] bg-muted px-2 py-0.5">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 ml-6">
                          {addr.line1}
                          {addr.line2 ? ", " + addr.line2 : ""}
                          <br />
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </div>
                    ))}

                    {/* New address toggle */}
                    <div
                      onClick={() => {
                        setShowNewAddress(true);
                        setSelectedAddress(null);
                      }}
                      className={
                        "border p-4 cursor-pointer transition-colors " +
                        (showNewAddress
                          ? "border-foreground"
                          : "border-border border-dashed hover:border-foreground")
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center " +
                            (showNewAddress ? "border-foreground bg-foreground" : "border-border")
                          }
                        >
                          {showNewAddress && (
                            <div className="w-1.5 h-1.5 rounded-full bg-background" />
                          )}
                        </div>
                        <span className="text-xs uppercase tracking-[0.15em]">
                          Use a different address
                        </span>
                      </div>
                    </div>

                    {/* New address form */}
                    {showNewAddress && (
                      <div className="border border-border p-5 space-y-4">
                        <div className="flex gap-2 mb-2">
                          {["Home", "Work", "Other"].map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setNewAddr((a) => ({ ...a, label: l }))}
                              className={
                                "px-3 py-1.5 text-xs border transition-colors " +
                                (newAddr.label === l
                                  ? "bg-foreground text-background border-foreground"
                                  : "border-border text-muted-foreground hover:border-foreground")
                              }
                            >
                              {l}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            Address Line 1
                          </label>
                          <input
                            value={newAddr.line1}
                            onChange={(e) => setNewAddr((a) => ({ ...a, line1: e.target.value }))}
                            placeholder="House no., street, area"
                            className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            Address Line 2 (optional)
                          </label>
                          <input
                            value={newAddr.line2}
                            onChange={(e) => setNewAddr((a) => ({ ...a, line2: e.target.value }))}
                            placeholder="Landmark, locality"
                            className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                              City
                            </label>
                            <input
                              value={newAddr.city}
                              onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                              className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                              Pincode
                            </label>
                            <input
                              value={newAddr.pincode}
                              onChange={(e) =>
                                setNewAddr((a) => ({
                                  ...a,
                                  pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                                }))
                              }
                              className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2 font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            State
                          </label>
                          <select
                            value={newAddr.state}
                            onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))}
                            className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2 cursor-pointer"
                          >
                            <option value="">Select state</option>
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => {
                    if (showNewAddress) {
                      if (!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.pincode) return;
                      setSelectedAddress({
                        id: "new",
                        label: newAddr.label,
                        line1: newAddr.line1,
                        line2: newAddr.line2 || null,
                        city: newAddr.city,
                        state: newAddr.state,
                        pincode: newAddr.pincode,
                        is_default: false,
                      });
                    }
                    setStep("review");
                  }}
                  disabled={!selectedAddress && !showNewAddress}
                  className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.25em] hover:opacity-80 transition-opacity disabled:opacity-40 mt-4"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {/* ── STEP 2: Review + Coupon ── */}
            {step === "review" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Order Review
                  </h2>
                  <button
                    onClick={() => setStep("address")}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Change address
                  </button>
                </div>

                {/* Selected address */}
                {selectedAddress && (
                  <div className="border border-border p-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                      Delivering to
                    </p>
                    <p className="font-medium">{selectedAddress.label}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {selectedAddress.line1}
                      {selectedAddress.line2 ? ", " + selectedAddress.line2 : ""}
                      {", "}{selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                    </p>
                  </div>
                )}

                {/* Cart items */}
                <div className="border border-border divide-y divide-border">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#0e0c0a] shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
                      </div>
                      <p className="font-mono text-sm shrink-0">
                        {formatINR(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="border border-border p-4">
                  <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 mb-3">
                    <Tag size={12} /> Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                        if (!e.target.value) setCoupon(null);
                      }}
                      placeholder="Enter code"
                      disabled={!!coupon}
                      className="flex-1 bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-1 font-mono uppercase disabled:opacity-50"
                    />
                    {coupon ? (
                      <button
                        onClick={() => { setCoupon(null); setCouponCode(""); }}
                        className="text-xs text-destructive uppercase tracking-[0.1em] shrink-0"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || applyingCoupon}
                        className="text-xs uppercase tracking-[0.15em] border border-border px-3 py-1 hover:border-foreground transition-colors disabled:opacity-40 shrink-0"
                      >
                        {applyingCoupon ? "..." : "Apply"}
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-xs text-destructive mt-2">{couponError}</p>
                  )}
                  {coupon && (
                    <p className="text-xs text-green-700 mt-2">
                      {"Coupon applied! Saving " + formatINR(discountAmount)}
                    </p>
                  )}
                </div>

                {placeError && (
                  <p className="text-xs text-destructive border border-destructive p-3">
                    {placeError}
                  </p>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || !selectedAddress}
                  className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                  {placing ? "Placing order..." : "Place Order — " + formatINR(total)}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Payment will be collected via bank transfer or Cashfree — our team will share details after order confirmation.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: order summary */}
          <div className="lg:col-span-1">
            <div className="border border-border p-5 sticky top-24">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Order Summary
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                  </dt>
                  <dd className="font-mono">{formatINR(subtotal)}</dd>
                </div>
                {coupon && discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <dt>Discount ({coupon.code})</dt>
                    <dd className="font-mono">{"- " + formatINR(discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">GST (18%)</dt>
                  <dd className="font-mono">{formatINR(gst)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-mono">
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-medium text-base">
                  <dt>Total</dt>
                  <dd className="font-mono">{formatINR(total)}</dd>
                </div>
              </dl>
              {shipping > 0 && (
                <p className="text-[10px] text-muted-foreground mt-3">
                  {"Free shipping on orders above " + formatINR(999)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
