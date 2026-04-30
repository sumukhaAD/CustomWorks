export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  tags: string[];
  variants: ProductVariant[];
  isNew: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: "size" | "color" | "material";
  options: { label: string; value: string; priceModifier: number }[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  image: string;
  basePrice: number;
  customizations: Record<string, string>;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: "designing" | "processing" | "ready_to_ship" | "dispatched" | "delivered";
  subtotal: number;
  gst: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  discountAmount?: number;
  trackingId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  review: string;
  product: string;
}
