-- Admin role + secure order access
-- Run this in Supabase SQL Editor for project: kxvtjoeipzsgfonvntxf

-- 1) User roles table
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
before update on public.user_roles
for each row
execute function public.update_timestamp();

alter table public.user_roles enable row level security;

drop policy if exists "users can read own role" on public.user_roles;
create policy "users can read own role"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "admins can manage roles" on public.user_roles;
create policy "admins can manage roles"
on public.user_roles
for all
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'
  )
);

-- 2) Helper function used in policies
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 3) Secure orders table
alter table public.orders enable row level security;

drop policy if exists "create orders from storefront" on public.orders;
create policy "create orders from storefront"
on public.orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can read orders" on public.orders;
create policy "admins can read orders"
on public.orders
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can update orders" on public.orders;
create policy "admins can update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can delete orders" on public.orders;
create policy "admins can delete orders"
on public.orders
for delete
to authenticated
using (public.is_admin());

-- 4) Secure order items table
alter table public.order_items enable row level security;

drop policy if exists "create order items from storefront" on public.order_items;
create policy "create order items from storefront"
on public.order_items
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can read order items" on public.order_items;
create policy "admins can read order items"
on public.order_items
for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can update order items" on public.order_items;
create policy "admins can update order items"
on public.order_items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can delete order items" on public.order_items;
create policy "admins can delete order items"
on public.order_items
for delete
to authenticated
using (public.is_admin());

-- 5) Bootstrap first admin (replace with your real login email)
insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where email = 'admin@femi9outfit.com'
on conflict (user_id) do update
set role = excluded.role;
