import type { Product, Testimonial } from "@/types";

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const SHOP_CATEGORIES = [
  { label: "All Products", to: "/shop", image: "https://picsum.photos/seed/cw-all/600/400" },
  { label: "Apparel", to: "/shop/apparel", image: "https://picsum.photos/seed/cw-apparel/600/400" },
  { label: "Accessories", to: "/shop/accessories", image: "https://picsum.photos/seed/cw-acc/600/400" },
  { label: "Corporate Gifts", to: "/shop/corporate", image: "https://picsum.photos/seed/cw-corp/600/400" },
  { label: "New Arrivals", to: "/shop/new", image: "https://picsum.photos/seed/cw-new/600/400" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", to: "/shop" },
    { label: "Apparel", to: "/shop/apparel" },
    { label: "Accessories", to: "/shop/accessories" },
    { label: "Corporate Gifts", to: "/shop/corporate" },
  ],
  help: [
    { label: "FAQ", to: "/faq" },
    { label: "Contact Us", to: "/contact" },
    { label: "Track Order", to: "/account/orders" },
    { label: "Refund Policy", to: "/refund-policy" },
  ],
  company: [
    { label: "About Us", to: "/about" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Careers", to: "/about" },
  ],
} as const;

export const WHY_WORKS = [
  { icon: "Scissors", title: "100% Made to Order", desc: "Every piece is crafted only after you order — no warehouses, no waste." },
  { icon: "Star", title: "Premium Quality", desc: "Hand-picked fabrics, archival inks, and obsessive finishing standards." },
  { icon: "Truck", title: "Delivered to Your Door", desc: "Pan-India shipping with real-time tracking and protective packaging." },
  { icon: "Headphones", title: "Dedicated Support", desc: "Talk to a real human on WhatsApp from sketch to delivery." },
] as const;

export const HOW_IT_WORKS = [
  { n: "01", title: "Choose", desc: "Browse our curated collection and pick a base product you love." },
  { n: "02", title: "Customize", desc: "Add your text, artwork, monogram, or upload your own design." },
  { n: "03", title: "Receive", desc: "We craft, quality-check, and ship your one-of-a-kind piece." },
] as const;

export const FAQ_DATA = [
  {
    category: "Ordering",
    items: [
      { q: "How do I place a custom order?", a: "Pick a product, open the customizer, add your details, and check out — that's it. We'll email a digital proof within 24 hours." },
      { q: "Can I order in bulk for my company?", a: "Absolutely. For orders above 25 units, write to corporate@customworks.in for tiered pricing and dedicated account management." },
      { q: "Do you offer gift wrapping?", a: "Yes — opt in at checkout. Premium recycled kraft wrap with hand-tied twine, no extra charge above ₹1499." },
      { q: "Can I save my designs?", a: "Sign in to your account and every customization is auto-saved to your dashboard." },
    ],
  },
  {
    category: "Customization",
    items: [
      { q: "What file formats can I upload?", a: "PNG, JPG, SVG, and PDF up to 25MB. Vector files (SVG/PDF) print sharpest." },
      { q: "Will I see a proof before printing?", a: "Always. Our team sends a digital mockup within 24 hours and waits for your sign-off before production." },
      { q: "Can I use copyrighted artwork?", a: "Only if you own the rights or have written permission. Our team flags anything that looks problematic." },
      { q: "How many colors can I use?", a: "Up to 6 spot colors per print, or full-color CMYK on most apparel." },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      { q: "How long does delivery take?", a: "Standard orders ship in 5–7 business days. Express in 3 days. Bulk and corporate timelines are quoted upfront." },
      { q: "Do you ship internationally?", a: "We currently ship across India. International shipping launches Q3 — join the waitlist." },
      { q: "How do I track my order?", a: "Every order gets a tracking ID emailed at dispatch. You can also track from /account/orders." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "Can I return a custom product?", a: "Custom-made items are non-returnable, but if there's a defect or print error we replace or refund — no questions." },
      { q: "How long do refunds take?", a: "Approved refunds hit your original payment method within 5–7 business days." },
      { q: "What if my package arrives damaged?", a: "Email a photo to care@customworks.in within 48 hours and we'll dispatch a replacement immediately." },
    ],
  },
] as const;

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Aanya Mehta", avatar: "https://i.pravatar.cc/120?img=47", rating: 5, review: "The fabric quality is unreal and the embroidery on my jacket came out exactly as the proof. Felt like a couture piece.", product: "Custom Embroidered Bomber" },
  { id: "t2", name: "Rohan Kapoor", avatar: "https://i.pravatar.cc/120?img=12", rating: 5, review: "Ordered 60 hoodies for our offsite. Proofs in a day, delivery in a week. The team made the whole thing painless.", product: "Corporate Hoodie Set" },
  { id: "t3", name: "Ishita Rao", avatar: "https://i.pravatar.cc/120?img=32", rating: 5, review: "Honestly the most thoughtful packaging I've received from any Indian brand. The product itself is incredible.", product: "Monogrammed Leather Wallet" },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1", slug: "essential-embroidered-tee", name: "Essential Embroidered Tee",
    description: "240gsm combed cotton, garment-dyed for a lived-in softness. Add your monogram or short text in 12 thread colors.",
    basePrice: 899, images: ["https://picsum.photos/seed/cw-p1a/800/1000", "https://picsum.photos/seed/cw-p1b/800/1000"],
    category: "apparel", tags: ["new"], variants: [
      { id: "v1", name: "Size", type: "size", options: [{label:"S",value:"s",priceModifier:0},{label:"M",value:"m",priceModifier:0},{label:"L",value:"l",priceModifier:0},{label:"XL",value:"xl",priceModifier:100}] },
    ], isNew: true, isFeatured: true, rating: 4.9, reviewCount: 128,
  },
  {
    id: "p2", slug: "heritage-oversized-hoodie", name: "Heritage Oversized Hoodie",
    description: "450gsm brushed fleece, drop-shoulder cut. Embroidery and screen-print available across the front, sleeve, or hood.",
    basePrice: 2499, images: ["https://picsum.photos/seed/cw-p2a/800/1000"],
    category: "apparel", tags: ["bestseller"], variants: [
      { id: "v2", name: "Size", type: "size", options: [{label:"M",value:"m",priceModifier:0},{label:"L",value:"l",priceModifier:0},{label:"XL",value:"xl",priceModifier:0}] },
    ], isNew: false, isFeatured: true, rating: 4.8, reviewCount: 96,
  },
  {
    id: "p3", slug: "monogram-leather-wallet", name: "Monogram Leather Wallet",
    description: "Full-grain vegetable-tanned leather, hand-stitched. Foil-stamped initials in gold, silver, or blind deboss.",
    basePrice: 1899, images: ["https://picsum.photos/seed/cw-p3a/800/1000"],
    category: "accessories", tags: [], variants: [], isNew: false, isFeatured: true, rating: 5.0, reviewCount: 212,
  },
  {
    id: "p4", slug: "canvas-tote-personalized", name: "Personalized Canvas Tote",
    description: "16oz natural canvas, reinforced base, full-bleed printing area. Perfect for events and gifting.",
    basePrice: 499, images: ["https://picsum.photos/seed/cw-p4a/800/1000"],
    category: "accessories", tags: ["new"], variants: [], isNew: true, isFeatured: true, rating: 4.7, reviewCount: 64,
  },
  {
    id: "p5", slug: "corporate-gift-set-classic", name: "Corporate Gift Set — Classic",
    description: "Notebook, ceramic mug, ballpoint pen, and tote — co-branded, kraft-boxed, ready to gift.",
    basePrice: 1499, images: ["https://picsum.photos/seed/cw-p5a/800/1000"],
    category: "corporate", tags: ["bestseller"], variants: [], isNew: false, isFeatured: true, rating: 4.9, reviewCount: 41,
  },
  {
    id: "p6", slug: "ceramic-mug-personalized", name: "Personalized Ceramic Mug",
    description: "350ml stoneware mug with sublimation printing. Dishwasher and microwave safe.",
    basePrice: 599, images: ["https://picsum.photos/seed/cw-p6a/800/1000"],
    category: "corporate", tags: [], variants: [], isNew: false, isFeatured: false, rating: 4.6, reviewCount: 87,
  },
  {
    id: "p7", slug: "linen-cap-embroidered", name: "Linen Cap with Embroidery",
    description: "Unstructured 6-panel cap in heavyweight linen. Up to 8 thread colors, 3D puff available.",
    basePrice: 799, images: ["https://picsum.photos/seed/cw-p7a/800/1000"],
    category: "accessories", tags: [], variants: [], isNew: false, isFeatured: false, rating: 4.7, reviewCount: 33,
  },
  {
    id: "p8", slug: "premium-bomber-jacket", name: "Premium Custom Bomber Jacket",
    description: "MA-1 cut in matte nylon shell with satin lining. Patches, embroidery, and back prints supported.",
    basePrice: 4999, images: ["https://picsum.photos/seed/cw-p8a/800/1000"],
    category: "apparel", tags: ["new","bestseller"], variants: [
      { id: "v8", name: "Size", type: "size", options: [{label:"S",value:"s",priceModifier:0},{label:"M",value:"m",priceModifier:0},{label:"L",value:"l",priceModifier:0},{label:"XL",value:"xl",priceModifier:200}] },
    ], isNew: true, isFeatured: true, rating: 5.0, reviewCount: 24,
  },
];

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
