-- =========================================================
-- CVku — schema Supabase
-- Jalankan sekali di Supabase Dashboard → SQL Editor
-- =========================================================

-- ---------- PROFILES (status Pro disimpan di sini) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  pro_until   timestamptz,               -- null / lewat = bukan Pro
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- User cuma boleh BACA profilnya sendiri.
-- Tidak ada policy UPDATE → pro_until hanya bisa diubah server (service role) via webhook.
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

-- Bikin profil otomatis saat user daftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- CVS ----------
create table if not exists public.cvs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null default 'CV Tanpa Judul',
  template_id  text not null default 'ats-classic',
  data         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists cvs_user_id_idx on public.cvs(user_id, updated_at desc);

alter table public.cvs enable row level security;

drop policy if exists "cvs: select own" on public.cvs;
create policy "cvs: select own" on public.cvs for select using (auth.uid() = user_id);
drop policy if exists "cvs: insert own" on public.cvs;
create policy "cvs: insert own" on public.cvs for insert with check (auth.uid() = user_id);
drop policy if exists "cvs: update own" on public.cvs;
create policy "cvs: update own" on public.cvs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "cvs: delete own" on public.cvs;
create policy "cvs: delete own" on public.cvs for delete using (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists cvs_touch on public.cvs;
create trigger cvs_touch before update on public.cvs
  for each row execute function public.touch_updated_at();

-- ---------- PAYMENTS ----------
create table if not exists public.payments (
  order_id     text primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  plan         text not null,
  amount       integer not null,
  status       text not null default 'pending',   -- pending | paid | failed | expired
  raw          jsonb,
  paid_at      timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.payments enable row level security;

-- User boleh lihat riwayat bayarnya sendiri. Insert/update hanya lewat server (service role).
drop policy if exists "payments: read own" on public.payments;
create policy "payments: read own" on public.payments for select using (auth.uid() = user_id);

-- ---------- Aktivasi Pro (atomic + idempotent) ----------
-- Dipanggil webhook. Kalau order sudah 'paid', tidak menambah hari lagi.
create or replace function public.activate_pro(p_order_id text, p_days integer, p_raw jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid;
begin
  update public.payments
     set status = 'paid', paid_at = now(), raw = p_raw
   where order_id = p_order_id and status <> 'paid'
  returning user_id into v_user;

  if v_user is null then
    return; -- order tidak ada / sudah diproses
  end if;

  update public.profiles
     set pro_until = greatest(coalesce(pro_until, now()), now()) + make_interval(days => p_days)
   where id = v_user;
end;
$$;

revoke all on function public.activate_pro(text, integer, jsonb) from public, anon, authenticated;

-- ---------- CARDS (kartu ucapan) ----------
create table if not exists public.cards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null default 'Kartu Ucapan',
  template_id  text not null,
  data         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists cards_user_id_idx on public.cards(user_id, updated_at desc);
alter table public.cards enable row level security;

drop policy if exists "cards: select own" on public.cards;
create policy "cards: select own" on public.cards for select using (auth.uid() = user_id);
drop policy if exists "cards: insert own" on public.cards;
create policy "cards: insert own" on public.cards for insert with check (auth.uid() = user_id);
drop policy if exists "cards: update own" on public.cards;
create policy "cards: update own" on public.cards for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "cards: delete own" on public.cards;
create policy "cards: delete own" on public.cards for delete using (auth.uid() = user_id);

drop trigger if exists cards_touch on public.cards;
create trigger cards_touch before update on public.cards
  for each row execute function public.touch_updated_at();
