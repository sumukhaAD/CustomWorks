-- ============================================================
-- CustomWorks — initial schema
-- ============================================================

-- Helper: updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- ROLES (separate table — never store roles on profiles)
-- ============================================================
create type public.app_role as enum ('admin', 'customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles without recursive RLS
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create policy "users view own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "admins manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users view own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "users insert own profile" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy "users update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ADDRESSES
-- ============================================================
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses(user_id);

alter table public.addresses enable row level security;

create policy "users manage own addresses" on public.addresses
  for all to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (user_id = auth.uid());

-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  base_price numeric(10,2) not null check (base_price >= 0),
  images jsonb not null default '[]'::jsonb,
  category text not null,
  tags text[] not null default '{}',
  is_new boolean not null default false,
  is_featured boolean not null default false,
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products(category);
create index products_is_active_idx on public.products(is_active);

alter table public.products enable row level security;

create policy "anyone views active products" on public.products
  for select to anon, authenticated
  using (is_active = true or public.has_role(auth.uid(), 'admin'));

create policy "admins manage products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
create type public.variant_type as enum ('size', 'color', 'material');

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  type public.variant_type not null,
  options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index product_variants_product_id_idx on public.product_variants(product_id);

alter table public.product_variants enable row level security;

create policy "anyone views variants" on public.product_variants
  for select to anon, authenticated using (true);

create policy "admins manage variants" on public.product_variants
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- ORDERS
-- ============================================================
create type public.order_status as enum (
  'designing', 'processing', 'ready_to_ship', 'dispatched', 'delivered'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  status public.order_status not null default 'designing',
  subtotal numeric(10,2) not null check (subtotal >= 0),
  gst numeric(10,2) not null default 0 check (gst >= 0),
  shipping_cost numeric(10,2) not null default 0 check (shipping_cost >= 0),
  coupon_code text,
  discount_amount numeric(10,2) not null default 0 check (discount_amount >= 0),
  total numeric(10,2) not null check (total >= 0),
  tracking_id text,
  admin_notes text,
  customer_notes text,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);

alter table public.orders enable row level security;

create policy "users view own orders" on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "users create own orders" on public.orders
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "admins update orders" on public.orders
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete orders" on public.orders
  for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  variant_id text,
  variant_name text,
  image text,
  base_price numeric(10,2) not null check (base_price >= 0),
  customizations jsonb not null default '{}'::jsonb,
  quantity integer not null check (quantity > 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items(order_id);

alter table public.order_items enable row level security;

create policy "users view own order items" on public.order_items
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
    )
  );

create policy "users create items on own orders" on public.order_items
  for insert to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "admins update order items" on public.order_items
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete order items" on public.order_items
  for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- CUSTOM DESIGNS
-- ============================================================
create type public.design_status as enum (
  'pending_review', 'approved', 'rejected', 'revision_requested'
);

create table public.custom_designs (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid references public.order_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  design_data jsonb not null default '{}'::jsonb,
  upload_urls text[] not null default '{}',
  status public.design_status not null default 'pending_review',
  admin_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index custom_designs_user_id_idx on public.custom_designs(user_id);
create index custom_designs_order_item_idx on public.custom_designs(order_item_id);

alter table public.custom_designs enable row level security;

create policy "users view own designs" on public.custom_designs
  for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "users insert own designs" on public.custom_designs
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "users update own designs" on public.custom_designs
  for update to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "users delete own designs" on public.custom_designs
  for delete to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create trigger custom_designs_set_updated_at
  before update on public.custom_designs
  for each row execute function public.set_updated_at();

-- ============================================================
-- REVIEWS
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  is_verified_purchase boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index reviews_product_id_idx on public.reviews(product_id);

alter table public.reviews enable row level security;

create policy "anyone views reviews" on public.reviews
  for select to anon, authenticated using (true);

create policy "users insert own reviews" on public.reviews
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "users update own reviews" on public.reviews
  for update to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "users delete own reviews" on public.reviews
  for delete to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- COUPONS
-- ============================================================
create type public.coupon_type as enum ('percent', 'fixed');

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type public.coupon_type not null,
  value numeric(10,2) not null check (value > 0),
  min_order_amount numeric(10,2) not null default 0 check (min_order_amount >= 0),
  max_uses integer,
  current_uses integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

create policy "anyone views active coupons" on public.coupons
  for select to anon, authenticated
  using (is_active = true or public.has_role(auth.uid(), 'admin'));

create policy "admins manage coupons" on public.coupons
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- WISHLISTS
-- ============================================================
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index wishlists_user_id_idx on public.wishlists(user_id);

alter table public.wishlists enable row level security;

create policy "users manage own wishlist" on public.wishlists
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'design-uploads',
  'design-uploads',
  false,
  10485760,
  array['image/png','image/jpeg','image/jpg','image/webp','image/svg+xml','image/gif']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- product-images: public read, admins write
create policy "anyone reads product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

create policy "admins write product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- design-uploads: each user can manage files in their own folder (path prefix = user id)
create policy "users read own design uploads"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'design-uploads'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(), 'admin'))
  );

create policy "users upload own design uploads"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'design-uploads'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users update own design uploads"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'design-uploads'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users delete own design uploads"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'design-uploads'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(), 'admin'))
  );
