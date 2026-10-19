-- Kuota download gratis (1x, khusus CV ATS). Jalankan di Supabase → SQL Editor (aman dijalankan ulang).
alter table public.profiles add column if not exists free_downloads_used integer not null default 0;

-- Pakai 1 kuota gratis secara atomic. true = berhasil, false = kuota habis.
create or replace function public.use_free_download(p_user uuid, p_limit integer default 1)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare v_ok boolean;
begin
  update public.profiles
     set free_downloads_used = free_downloads_used + 1
   where id = p_user and free_downloads_used < p_limit
  returning true into v_ok;
  return coalesce(v_ok, false);
end;
$$;

revoke all on function public.use_free_download(uuid, integer) from public, anon, authenticated;

-- Kembalikan kuota kalau pembuatan PDF gagal
create or replace function public.refund_free_download(p_user uuid)
returns void
language sql
security definer set search_path = public
as $$
  update public.profiles set free_downloads_used = greatest(free_downloads_used - 1, 0) where id = p_user;
$$;
revoke all on function public.refund_free_download(uuid) from public, anon, authenticated;
