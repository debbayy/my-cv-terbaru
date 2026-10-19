-- Paket Pro Max. Jalankan di Supabase → SQL Editor (aman dijalankan ulang).
alter table public.profiles add column if not exists promax_until timestamptz;

-- Aktivasi sesuai paket di tabel payments (pro_* → pro_until, promax_* → promax_until). Idempotent.
create or replace function public.activate_pro(p_order_id text, p_days integer, p_raw jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid;
  v_plan text;
begin
  update public.payments
     set status = 'paid', paid_at = now(), raw = p_raw
   where order_id = p_order_id and status <> 'paid'
  returning user_id, plan into v_user, v_plan;

  if v_user is null then
    return;
  end if;

  if v_plan like 'promax%' then
    update public.profiles
       set promax_until = greatest(coalesce(promax_until, now()), now()) + make_interval(days => p_days)
     where id = v_user;
  else
    update public.profiles
       set pro_until = greatest(coalesce(pro_until, now()), now()) + make_interval(days => p_days)
     where id = v_user;
  end if;
end;
$$;

revoke all on function public.activate_pro(text, integer, jsonb) from public, anon, authenticated;
