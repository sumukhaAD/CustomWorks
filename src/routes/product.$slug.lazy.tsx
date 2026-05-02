/* eslint-disable prettier/prettier */
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { getProductBySlug, type PriceTier } from "@/lib/products";
import { formatINR } from "@/lib/constants";
import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { MessageCircle, Upload, Clock, CheckCircle } from "lucide-react";

export const Route = createLazyFileRoute("/product/$slug")({
  component: ProductPage,
});

const WHATSAPP_NUMBER = "918310529922";

function ProductPage() {
  const { slug } = Route.useParams();
  const product = useMemo(() => getProductBySlug(slug), [slug]);

  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(
    product?.priceTiers[0] ?? null,
  );
  const [customQty, setCustomQty] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [artworkName, setArtworkName] = useState("");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    return (
      <Layout>
        <PageHeader
          eyebrow="Shop"
          title="Product not found"
          crumbs={[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/shop" },
            { label: "Not found" },
          ]}
        />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <p className="text-muted-foreground text-sm mb-6">
            This product doesn't exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.25em]"
          >
            Browse Catalogue
          </Link>
        </div>
      </Layout>
    );
  }

  const effectiveQty = customQty ? parseInt(customQty) || 0 : (selectedTier?.qty ?? 0);

  const effectivePrice = selectedTier
    ? customQty
      ? Math.ceil((selectedTier.price / selectedTier.qty) * effectiveQty)
      : selectedTier.price
    : 0;

  const pricePerPiece = effectiveQty > 0 ? effectivePrice / effectiveQty : 0;

  const customDetails = Object.entries(fields)
    .map(([k, v]) => k + ": " + v)
    .join(" | ");

  const orderText =
    "Hi, I would like to order: " +
    product.name +
    " | Qty: " +
    effectiveQty +
    " pcs | Amount: " +
    formatINR(effectivePrice) +
    " | Details: " +
    customDetails +
    " | Artwork: " +
    (artworkName || "Will share separately");

  const bulkText = "Hi, I need bulk pricing for " + product.name;
  const orderUrl = useMemo(
    () => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(orderText),
    [orderText],
  );
  const bulkUrl = useMemo(
    () => "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(bulkText),
    [bulkText],
  );
  function handleAddToCart() {
    if (effectiveQty === 0) return;
    addItem({
      id: product.id + "-" + effectiveQty,
      productId: String(product.id),
      productName: product.name,
      variantId: "default",
      variantName: effectiveQty + " pcs",
      image: product.image,
      basePrice: effectivePrice,
      customizations: fields,
      quantity: 1,
      totalPrice: effectivePrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  }

  return (
    <Layout>
      <PageHeader
        eyebrow={product.category}
        title={product.name}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          <div className="space-y-6">
            <div className="bg-[#0e0c0a] rounded-sm p-8 flex items-center justify-center aspect-[4/3]">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.2em] border border-border px-3 py-1 text-muted-foreground">
                {product.category}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] bg-foreground text-background px-3 py-1">
                {product.tag}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="border border-border p-5">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Specifications
              </h3>
              <ul className="space-y-1.5">
                {product.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={13} className="text-foreground mt-0.5 shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>
                Estimated turnaround:{" "}
                <strong className="text-foreground">{product.turnaround}</strong>
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Select Quantity
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {product.priceTiers.map((tier) => (
                  <button
                    key={tier.qty}
                    onClick={() => {
                      setSelectedTier(tier);
                      setCustomQty("");
                    }}
                    className={
                      "border p-4 text-left transition-colors " +
                      (selectedTier?.qty === tier.qty && !customQty
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground")
                    }
                  >
                    <p className="font-mono text-lg font-medium">{tier.qty}</p>
                    <p className="text-[10px] uppercase tracking-[0.1em] mt-0.5 opacity-70">
                      pieces
                    </p>
                    <p className="font-mono text-sm mt-2">{formatINR(tier.price)}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">
                      {formatINR(Math.round(tier.price / tier.qty))} / pc
                    </p>
                  </button>
                ))}
              </div>

              <div className="border border-border p-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                  Custom Quantity
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={customQty}
                    onChange={(e) => {
                      setCustomQty(e.target.value);
                      setSelectedTier(product.priceTiers[product.priceTiers.length - 1]);
                    }}
                    placeholder={"Min " + (product.priceTiers[0]?.qty ?? 1)}
                    className="flex-1 bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-1 font-mono"
                  />
                  {customQty && effectiveQty > 0 && (
                    <span className="text-sm font-mono text-foreground">
                      {formatINR(effectivePrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Need 500+ units?{" "}
                  <a href={bulkUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    Get bulk pricing
                  </a>
                </p>
              </div>
            </div>

            {effectiveQty > 0 && (
              <div className="bg-muted p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.15em]">
                    {effectiveQty} pieces
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatINR(Math.round(pricePerPiece))} per piece
                  </p>
                </div>
                <p className="font-mono text-2xl font-medium">{formatINR(effectivePrice)}</p>
              </div>
            )}

            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Customisation Details
              </h2>
              <div className="space-y-4">
                {product.customizationFields.map((field) => (
                  <div key={field}>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {field}
                    </label>
                    {field === "Design Notes" ? (
                      <textarea
                        value={fields[field] || ""}
                        onChange={(e) => setFields((f) => ({ ...f, [field]: e.target.value }))}
                        placeholder="Any specific instructions or requirements"
                        rows={3}
                        className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2 resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={fields[field] || ""}
                        onChange={(e) => setFields((f) => ({ ...f, [field]: e.target.value }))}
                        className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border p-4 flex items-start gap-3">
              <Upload size={14} className="text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium">Artwork Upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Share your design file (PDF, AI, CDR, PNG at 300 DPI) via WhatsApp after placing
                  the order. Our team will confirm within 2 hours.
                </p>
                <div className="mt-2 space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.15em] hover:border-foreground transition-colors">
                    <Upload size={12} />
                    {artworkName ? artworkName : "Choose File"}
                    <input
                      type="file"
                      accept=".pdf,.ai,.cdr,.png,.jpg,.jpeg,.eps,.psd"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setArtworkName(file.name);
                      }}
                    />
                  </label>
                  {artworkName && (
                    <p className="text-xs text-muted-foreground">{artworkName}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Accepted: PDF, AI, CDR, PNG, JPG, EPS, PSD · Max 50MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={effectiveQty === 0}
                className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </button>

              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-border py-4 text-xs uppercase tracking-[0.25em] hover:border-foreground transition-colors"
              >
                <MessageCircle size={14} />
                Order via WhatsApp
              </a>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              GST will be added at checkout · Free delivery above Rs. 999
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
