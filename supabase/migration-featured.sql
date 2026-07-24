-- Pokreni CEO fajl u Supabase SQL Editoru (bezbedno i ako je deo već pokrenut)

-- 1. Istaknuti stanovi ("Izdvajamo iz ponude" na početnoj)
alter table public.apartments add column if not exists featured boolean not null default false;

-- 2. Zgrade na početnoj stranici (velike sekcije) + redosled + SEO naslov
alter table public.buildings add column if not exists featured_home boolean not null default false;
alter table public.buildings add column if not exists home_sort int not null default 0;
alter table public.buildings add column if not exists home_title text;

-- 3. Početno stanje: Vila V i Royal Aqua na početnoj, sa postojećim SEO naslovima
update public.buildings
  set featured_home = true, home_sort = 1, home_title = 'Novogradnja stanova u Vrnjačkoj Banji'
  where slug = 'vila-5';

update public.buildings
  set featured_home = true, home_sort = 2, home_title = 'Novi stanovi u Vrnjačkoj Banji uz Aqua park'
  where slug = 'royal-aqua';

-- 4. Podešavanja sajta (tema: 'light' ili 'dark')
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings" on public.site_settings for select using (true);

drop policy if exists "Auth write settings" on public.site_settings;
create policy "Auth write settings" on public.site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into public.site_settings (key, value) values ('theme', 'light')
  on conflict (key) do nothing;
