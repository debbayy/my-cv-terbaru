-- Jalankan ini SAJA kalau schema.sql versi lama sudah pernah dijalankan.
-- (Menjalankan ulang schema.sql penuh juga aman.)
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
