-- Fix function search path
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict product-images: drop broad SELECT, keep public access via signed/public URLs
-- (Public buckets serve files directly via /object/public/<bucket>/<path> without needing
-- a SELECT policy — removing the policy prevents listing the bucket contents.)
drop policy if exists "anyone reads product images" on storage.objects;
