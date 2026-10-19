-- =========================================================
-- Akun OWNER: dbts92@gmail.com → Pro Max permanen (tanpa iklan, semua template, download tanpa batas)
-- Jalankan di Supabase → SQL Editor. Aman dijalankan berulang.
-- =========================================================

-- 1) Kalau akun sudah pernah daftar → langsung jadikan owner
update public.profiles
   set promax_until = '2099-12-31 00:00:00+00',
       pro_until    = '2099-12-31 00:00:00+00'
 where lower(email) = 'dbts92@gmail.com';

-- 2) Kalau belum daftar → otomatis jadi owner saat daftar / login Google pertama kali
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_owner boolean := lower(new.email) = 'dbts92@gmail.com';
begin
  insert into public.profiles (id, email, full_name, pro_until, promax_until)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    case when v_owner then '2099-12-31 00:00:00+00'::timestamptz end,
    case when v_owner then '2099-12-31 00:00:00+00'::timestamptz end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Cek hasilnya:
select email, pro_until, promax_until from public.profiles where lower(email) = 'dbts92@gmail.com';
