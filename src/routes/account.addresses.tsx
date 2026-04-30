import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/cw/PageHeader";
import { useUserStore } from "@/store/userStore";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Star, User, Package } from "lucide-react";

export const Route = createFileRoute("/account/addresses")({
  component: Addresses,
  head: () => ({ meta: [{ title: "Addresses — CustomWorks" }] }),
});

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

interface FormState {
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_FORM: FormState = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

function Addresses() {
  const user = useUserStore((s) => s.user);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchAddresses() {
    if (!user || !supabase) return;
    const { data } = await supabase
      .from("addresses")
      .select("id, label, line1, line2, city, state, pincode, is_default")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    if (data) setAddresses(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.label || !form.line1 || !form.city || !form.state || !form.pincode) {
      setErr("Please fill in all required fields.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setErr("Pincode must be 6 digits.");
      return;
    }
    if (!supabase || !user) return;
    setSaving(true);

    const isFirst = addresses.length === 0;
    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      label: form.label,
      line1: form.line1,
      line2: form.line2 || null,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      is_default: isFirst,
    });

    if (error) {
      setErr(error.message);
    } else {
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchAddresses();
    }
    setSaving(false);
  }

  async function handleSetDefault(id: string) {
    if (!supabase || !user) return;
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);
    await fetchAddresses();
  }

  async function handleDelete(id: string) {
    if (!supabase) return;
    setDeleting(id);
    await supabase.from("addresses").delete().eq("id", id);
    await fetchAddresses();
    setDeleting(null);
  }

  const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
    "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
    "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
  ];

  return (
    <Layout>
      <PageHeader
        eyebrow="Account"
        title="Saved addresses"
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Addresses" },
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 grid lg:grid-cols-12 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-1 text-sm">
          <Link to="/account" className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-colors">
            <User size={14} /> Overview
          </Link>
          <Link to="/account/orders" className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-colors">
            <Package size={14} /> Orders
          </Link>
          <Link to="/account/addresses" className="flex items-center gap-2 py-2 px-3 bg-foreground text-background font-medium">
            <MapPin size={14} /> Addresses
          </Link>
        </aside>

        {/* Main */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity"
              >
                <Plus size={12} /> Add new
              </button>
            )}
          </div>

          {/* Add form */}
          {showForm && (
            <form
              onSubmit={handleSave}
              className="border border-border p-6 space-y-4"
            >
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                New address
              </h3>

              {/* Label */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Label <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2 mt-1">
                  {["Home", "Work", "Other"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, label: l }))}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        form.label === l
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                  <input
                    value={["Home","Work","Other"].includes(form.label) ? "" : form.label}
                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="Custom..."
                    className="flex-1 bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-1 px-1"
                  />
                </div>
              </div>

              {/* Line 1 */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Address line 1 <span className="text-destructive">*</span>
                </label>
                <input
                  value={form.line1}
                  onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                  placeholder="House/flat no., street, area"
                  className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2"
                />
              </div>

              {/* Line 2 */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Address line 2 <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  value={form.line2}
                  onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                  placeholder="Landmark, locality"
                  className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2"
                />
              </div>

              {/* City + Pincode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    City <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Bengaluru"
                    className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Pincode <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={form.pincode}
                    onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    placeholder="560001"
                    className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2 font-mono"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  State <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  className="mt-1 w-full bg-transparent border-b border-border focus:border-foreground outline-none text-sm py-2 cursor-pointer"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {err && <p className="text-xs text-destructive">{err}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-foreground text-background px-6 py-2.5 text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save address"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErr(""); }}
                  className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] border border-border hover:border-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Address cards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-muted animate-pulse rounded border border-border" />
              ))}
            </div>
          ) : addresses.length === 0 && !showForm ? (
            <div className="border border-border p-12 text-center">
              <MapPin size={32} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No saved addresses yet. Add one to speed up checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`border p-5 flex items-start justify-between gap-4 ${
                    addr.is_default ? "border-foreground" : "border-border"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] font-medium">
                        {addr.label}
                      </span>
                      {addr.is_default && (
                        <span className="text-[10px] uppercase tracking-[0.15em] bg-foreground text-background px-2 py-0.5">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {addr.line1}
                      {addr.line2 && `, ${addr.line2}`}
                      <br />
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        title="Set as default"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Star size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={deleting === addr.id}
                      title="Delete"
                      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}