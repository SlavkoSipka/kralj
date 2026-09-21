-- ============================================================
-- Kralj Residence — Supabase šema + početni podaci
--
-- KAKO POKRENUTI:
-- 1. Supabase dashboard → SQL Editor → New query
-- 2. Nalepi ceo ovaj fajl i klikni RUN
-- 3. Authentication → Users → Add user → napravi admin nalog
--    (email + lozinka kojom se loguješ na /admin)
-- ============================================================

-- ---------- TABELE ----------

create table if not exists public.buildings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  eyebrow text,
  description text,
  image_url text,
  size_label text,
  features text[] not null default '{}',
  status text not null default 'Dostupno' check (status in ('Dostupno', 'Prodato', 'Uskoro')),
  visible boolean not null default true,
  sort_order int not null default 0,
  total_apartments int,
  featured_home boolean not null default false,
  home_sort int not null default 0,
  home_title text,
  created_at timestamptz not null default now()
);

create table if not exists public.apartments (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  number int not null,
  type text not null default 'Jednosoban',
  size_label text not null default '',
  floor_name text not null default 'Prizemlje',
  card_image_url text,
  plan_image_url text,
  pdf_url text,
  outdoor_label text not null default 'Terasa',
  outdoor_value text,
  description text,
  sold boolean not null default false,
  visible boolean not null default true,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (building_id, number)
);

create index if not exists apartments_building_idx on public.apartments (building_id, sort_order);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values ('theme', 'light')
  on conflict (key) do nothing;

-- ---------- RLS ----------

alter table public.buildings enable row level security;
alter table public.apartments enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);

drop policy if exists "auth write settings" on public.site_settings;
create policy "auth write settings" on public.site_settings
  for all to authenticated using (true) with check (true);

drop policy if exists "public read buildings" on public.buildings;
create policy "public read buildings" on public.buildings for select using (true);

drop policy if exists "auth write buildings" on public.buildings;
create policy "auth write buildings" on public.buildings
  for all to authenticated using (true) with check (true);

drop policy if exists "public read apartments" on public.apartments;
create policy "public read apartments" on public.apartments for select using (true);

drop policy if exists "auth write apartments" on public.apartments;
create policy "auth write apartments" on public.apartments
  for all to authenticated using (true) with check (true);

-- ---------- STORAGE (slike) ----------

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "auth insert images" on storage.objects;
create policy "auth insert images" on storage.objects
  for insert to authenticated with check (bucket_id = 'images');

drop policy if exists "auth update images" on storage.objects;
create policy "auth update images" on storage.objects
  for update to authenticated using (bucket_id = 'images');

drop policy if exists "auth delete images" on storage.objects;
create policy "auth delete images" on storage.objects
  for delete to authenticated using (bucket_id = 'images');

-- ---------- SEED: ZGRADE ----------

insert into public.buildings (slug, name, eyebrow, description, image_url, size_label, features, status, visible, sort_order, total_apartments) values
  ('vila-5', 'Vila V', 'Novo · Počela prodaja',
   'Nastavak projekta Kralj Residence Resort. Novo uređeno dvorište, sopstveni bazen i 30 luksuznih stanova. Prodaja je počela, direktno od investitora.',
   '/images/vila-5.webp', '1400 m²', array['Privatni bazen', 'Uređeno dvorište', 'Parking'], 'Dostupno', true, 1, 30),
  ('royal-aqua', 'Royal Aqua', 'U prodaji',
   'Ekskluzivni stambeni kompleks sa privatnim bazenom, uređenim dvorištem i parkingom. 27 stanova na koraku od Aqua parka i centra Vrnjačke Banje.',
   '/images/Rudjinci A2.webp', '1500 m²', array['Privatni bazen', 'Uređeno dvorište', 'Ekskluzivna lokacija'], 'Dostupno', true, 2, 27),
  ('villa-4', 'Vila IV', 'U prodaji',
   'Poslednji dostupni stanovi u Kralj Residence Resort kompleksu. Privatni bazen, igralište za decu i paviljon za roštilj u mirnom okruženju.',
   '/images/A15.webp', '1500 m²', array['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'], 'Dostupno', true, 3, 27),
  ('villa-3', 'Vila III', 'Rasprodato',
   'Deo Kralj Residence Resort kompleksa. Svi stanovi su prodati.',
   '/images/A11.webp', '1500 m²', array['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'], 'Prodato', true, 4, 27),
  ('vila-2', 'Vila II', 'Rasprodato',
   'Deo prve faze Kralj Residence Resort projekta. Svi stanovi su prodati.',
   '/images/A13.webp', '1200 m²', array['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'], 'Prodato', true, 5, 23),
  ('vila-1', 'Vila I', 'Rasprodato',
   'Prva vila u Kralj Residence Resort kompleksu. Svi stanovi su prodati.',
   '/images/A12.webp', '1200 m²', array['Privatni bazen', 'Igralište za decu', 'Paviljon za roštilj'], 'Prodato', true, 6, 23)
on conflict (slug) do nothing;

-- ---------- SEED: STANOVI — ROYAL AQUA ----------
-- Dostupni: 17, 19, 20, 24, 25

insert into public.apartments (building_id, number, type, size_label, floor_name, card_image_url, plan_image_url, outdoor_label, sold, sort_order)
select b.id, a.num, a.typ, a.size_label, a.floor_name, a.card_img, a.plan_img, a.outdoor, a.sold, a.num
from public.buildings b,
(values
  (1,  'Jednosoban', '45.44 m²', 'Nisko prizemlje',  '/images/royal/stan 1.webp',  '/images/royal/crtez/STAN 1.webp',  'Dvorište', true),
  (2,  'Jednosoban', '29.11 m²', 'Nisko prizemlje',  '/images/royal/stan 2.webp',  '/images/royal/crtez/STAN 2.webp',  'Dvorište', true),
  (3,  'Garsonjera', '24.44 m²', 'Nisko prizemlje',  '/images/royal/stan 3.webp',  '/images/royal/crtez/STAN 3.webp',  'Dvorište', true),
  (4,  'Jednosoban', '43.56 m²', 'Nisko prizemlje',  '/images/royal/stan 4.webp',  '/images/royal/crtez/STAN 4.webp',  'Dvorište', true),
  (5,  'Jednosoban', '36.01 m²', 'Visoko prizemlje', '/images/royal/stan 5.webp',  '/images/royal/crtez/STAN 5.webp',  'Dvorište', true),
  (6,  'Jednosoban', '36.62 m²', 'Visoko prizemlje', '/images/royal/stan 6.webp',  '/images/royal/crtez/STAN 6.webp',  'Dvorište', true),
  (7,  'Dvosoban',   '45.73 m²', 'Visoko prizemlje', '/images/royal/stan 7.webp',  '/images/royal/crtez/STAN 7.webp',  'Terasa',   true),
  (8,  'Jednosoban', '32.13 m²', 'Visoko prizemlje', '/images/royal/stan 8.webp',  '/images/royal/crtez/STAN 8.webp',  'Terasa',   true),
  (9,  'Dvosoban',   '45.73 m²', 'Visoko prizemlje', '/images/royal/stan 9.webp',  '/images/royal/crtez/STAN 9.webp',  'Terasa',   true),
  (10, 'Jednosoban', '36.62 m²', 'Visoko prizemlje', '/images/royal/stan 10.webp', '/images/royal/crtez/STAN 10.webp', 'Dvorište', true),
  (11, 'Jednosoban', '36.01 m²', 'Visoko prizemlje', '/images/royal/stan 11.webp', '/images/royal/crtez/STAN 11.webp', 'Dvorište', true),
  (12, 'Jednosoban', '38.49 m²', 'Prvi sprat',       '/images/royal/stan 5.webp',  '/images/royal/crtez/STAN 12.webp', 'Terasa',   true),
  (13, 'Jednosoban', '39.10 m²', 'Prvi sprat',       '/images/royal/stan 6.webp',  '/images/royal/crtez/STAN 13.webp', 'Terasa',   true),
  (14, 'Dvosoban',   '45.73 m²', 'Prvi sprat',       '/images/royal/stan 7.webp',  '/images/royal/crtez/STAN 14.webp', 'Terasa',   true),
  (15, 'Jednosoban', '32.13 m²', 'Prvi sprat',       '/images/royal/stan 8.webp',  '/images/royal/crtez/STAN 15.webp', 'Terasa',   true),
  (16, 'Dvosoban',   '45.73 m²', 'Prvi sprat',       '/images/royal/stan 9.webp',  '/images/royal/crtez/STAN 16.webp', 'Terasa',   true),
  (17, 'Jednosoban', '39.10 m²', 'Prvi sprat',       '/images/royal/stan 10.webp', '/images/royal/crtez/STAN 17.webp', 'Terasa',   false),
  (18, 'Jednosoban', '38.49 m²', 'Prvi sprat',       '/images/royal/stan 11.webp', '/images/royal/crtez/STAN 18.webp', 'Terasa',   true),
  (19, 'Jednosoban', '38.49 m²', 'Drugi sprat',      '/images/royal/stan 5.webp',  '/images/royal/crtez/STAN 19.webp', 'Terasa',   false),
  (20, 'Jednosoban', '39.10 m²', 'Drugi sprat',      '/images/royal/stan 6.webp',  '/images/royal/crtez/STAN 20.webp', 'Terasa',   false),
  (21, 'Dvosoban',   '45.73 m²', 'Drugi sprat',      '/images/royal/stan 7.webp',  '/images/royal/crtez/STAN 21.webp', 'Terasa',   true),
  (22, 'Jednosoban', '32.13 m²', 'Drugi sprat',      '/images/royal/stan 8.webp',  '/images/royal/crtez/STAN 22.webp', 'Terasa',   true),
  (23, 'Dvosoban',   '45.73 m²', 'Drugi sprat',      '/images/royal/stan 9.webp',  '/images/royal/crtez/STAN 23.webp', 'Terasa',   true),
  (24, 'Jednosoban', '39.10 m²', 'Drugi sprat',      '/images/royal/stan 10.webp', '/images/royal/crtez/STAN 24.webp', 'Terasa',   false),
  (25, 'Jednosoban', '38.49 m²', 'Drugi sprat',      '/images/royal/stan 11.webp', '/images/royal/crtez/STAN 25.webp', 'Terasa',   false),
  (26, 'Trosoban',   '65,33 + 70 m²', 'Povučeni sprat', '/images/royal/stan 26.webp', '/images/royal/crtez/STAN 26.webp', 'Terasa', true),
  (27, 'Dvosoban',   '62,27 + 70 m²', 'Povučeni sprat', '/images/royal/stan 27.webp', '/images/royal/crtez/stan 27.webp', 'Terasa', true)
) as a(num, typ, size_label, floor_name, card_img, plan_img, outdoor, sold)
where b.slug = 'royal-aqua'
on conflict (building_id, number) do nothing;

-- ---------- SEED: STANOVI — VILA IV ----------
-- Dostupni: 3, 4, 5, 23

insert into public.apartments (building_id, number, type, size_label, floor_name, card_image_url, plan_image_url, outdoor_label, sold, sort_order)
select b.id, a.num, a.typ, a.size_label, a.floor_name, a.card_img, a.plan_img, 'Terasa', a.sold, a.num
from public.buildings b,
(values
  (1,  'Jednosoban', '43.01 m²', 'Nisko prizemlje',  '/images/vila3/kosa3d.webp',        '/images/vila4/stan 1 - 7 - 13 - 19.webp', true),
  (2,  'Jednosoban', '40.98 m²', 'Nisko prizemlje',  '/images/vila3/basic3d.webp',       '/images/vila3/stan 5-11-17.webp',         true),
  (3,  'Jednosoban', '39.83 m²', 'Nisko prizemlje',  '/images/vila3/basic3d.webp',       '/images/vila4/stan 3 - 9 - 15 - 21.webp', false),
  (4,  'Garsonjera', '25.00 m²', 'Visoko prizemlje', '/images/vila3/3d garsonjera.webp', '/images/vila4/stan 4 - 10 - 16..webp',    false),
  (5,  'Jednosoban', '38.41 m²', 'Visoko prizemlje', '/images/vila3/basic3d.webp',       '/images/vila4/stan 5 - 11 - 17.webp',     false),
  (6,  'Jednosoban', '38.78 m²', 'Visoko prizemlje', '/images/vila3/basic3d.webp',       '/images/vila4/stan 6 - 12 - 18.webp',     true),
  (7,  'Jednosoban', '43.01 m²', 'Visoko prizemlje', '/images/vila3/kosa3d.webp',        '/images/vila4/stan 1 - 7 - 13 - 19.webp', true),
  (8,  'Jednosoban', '40.98 m²', 'Visoko prizemlje', '/images/vila3/basic3d.webp',       '/images/vila3/stan 5-11-17.webp',         true),
  (9,  'Jednosoban', '39.83 m²', 'Visoko prizemlje', '/images/vila3/basic3d.webp',       '/images/vila4/stan 3 - 9 - 15 - 21.webp', true),
  (10, 'Garsonjera', '25.00 m²', 'Prvi sprat',       '/images/vila3/3d garsonjera.webp', '/images/vila4/stan 4 - 10 - 16..webp',    true),
  (11, 'Jednosoban', '38.41 m²', 'Prvi sprat',       '/images/vila3/basic3d.webp',       '/images/vila4/stan 5 - 11 - 17.webp',     true),
  (12, 'Jednosoban', '38.78 m²', 'Prvi sprat',       '/images/vila3/basic3d.webp',       '/images/vila4/stan 6 - 12 - 18.webp',     true),
  (13, 'Jednosoban', '43.01 m²', 'Prvi sprat',       '/images/vila3/kosa3d.webp',        '/images/vila4/stan 1 - 7 - 13 - 19.webp', true),
  (14, 'Jednosoban', '40.98 m²', 'Prvi sprat',       '/images/vila3/basic3d.webp',       '/images/vila3/stan 5-11-17.webp',         true),
  (15, 'Jednosoban', '39.83 m²', 'Prvi sprat',       '/images/vila3/basic3d.webp',       '/images/vila4/stan 3 - 9 - 15 - 21.webp', true),
  (16, 'Garsonjera', '25.00 m²', 'Drugi sprat',      '/images/vila3/3d garsonjera.webp', '/images/vila4/stan 4 - 10 - 16..webp',    true),
  (17, 'Jednosoban', '38.41 m²', 'Drugi sprat',      '/images/vila3/basic3d.webp',       '/images/vila4/stan 5 - 11 - 17.webp',     true),
  (18, 'Jednosoban', '38.78 m²', 'Drugi sprat',      '/images/vila3/basic3d.webp',       '/images/vila4/stan 6 - 12 - 18.webp',     true),
  (19, 'Jednosoban', '43.01 m²', 'Drugi sprat',      '/images/vila3/kosa3d.webp',        '/images/vila4/stan 1 - 7 - 13 - 19.webp', true),
  (20, 'Jednosoban', '40.98 m²', 'Drugi sprat',      '/images/vila3/basic3d.webp',       '/images/vila3/stan 5-11-17.webp',         true),
  (21, 'Jednosoban', '39.83 m²', 'Drugi sprat',      '/images/vila3/basic3d.webp',       '/images/vila4/stan 3 - 9 - 15 - 21.webp', true),
  (22, 'Garsonjera', '25.27 m²', 'Povučeni sprat',   '/images/vila3/3d garsonjera.webp', '/images/vila4/stan 22.webp',              true),
  (23, 'Jednosoban', '38.52 m²', 'Povučeni sprat',   '/images/vila3/basic3d.webp',       '/images/vila4/stan 23.webp',              false),
  (24, 'Jednosoban', '38.82 m²', 'Povučeni sprat',   '/images/vila3/basic3d.webp',       '/images/vila4/stan 24.webp',              true),
  (25, 'Jednosoban', '44.37 m²', 'Povučeni sprat',   '/images/vila3/kosa3d.webp',        '/images/vila4/stan 25.webp',              true),
  (26, 'Jednosoban', '40.64 m²', 'Povučeni sprat',   '/images/vila3/basic3d.webp',       '/images/vila4/stan 26.webp',              true),
  (27, 'Jednosoban', '39.73 m²', 'Povučeni sprat',   '/images/vila3/basic3d.webp',       '/images/vila4/stan 27.webp',              true)
) as a(num, typ, size_label, floor_name, card_img, plan_img, sold)
where b.slug = 'villa-4'
on conflict (building_id, number) do nothing;

-- ---------- SEED: STANOVI — VILA III ----------
-- Svi prodati

insert into public.apartments (building_id, number, type, size_label, floor_name, card_image_url, plan_image_url, outdoor_label, sold, sort_order)
select b.id, a.num, a.typ, a.size_label, a.floor_name, a.card_img, a.plan_img, 'Terasa', true, a.num
from public.buildings b,
(values
  (1,  'Jednosoban', '36.04 m²', 'Nisko prizemlje',  '/images/vila3/lift3d.webp',        '/images/vila3/stan 1-4-10-16.webp'),
  (2,  'Jednosoban', '40.98 m²', 'Nisko prizemlje',  '/images/vila3/basic3d.webp',       '/images/vila3/stan 2-8-14-20.webp'),
  (3,  'Dvosoban',   '45.48 m²', 'Nisko prizemlje',  '/images/vila3/3d dvosoban.webp',   '/images/vila3/stan 3-6-12-18.webp'),
  (4,  'Jednosoban', '36.04 m²', 'Visoko prizemlje', '/images/vila3/lift3d.webp',        '/images/vila3/stan 1-4-10-16.webp'),
  (5,  'Jednosoban', '40.98 m²', 'Visoko prizemlje', '/images/vila3/basic3d.webp',       '/images/vila3/stan 5-11-17.webp'),
  (6,  'Dvosoban',   '45.48 m²', 'Visoko prizemlje', '/images/vila3/3d dvosoban.webp',   '/images/vila3/stan 3-6-12-18.webp'),
  (7,  'Jednosoban', '38.71 m²', 'Visoko prizemlje', '/images/vila3/basic3d.webp',       '/images/vila3/stan 7 - 13 - 19.webp'),
  (8,  'Jednosoban', '38.41 m²', 'Visoko prizemlje', '/images/vila3/basic3d.webp',       '/images/vila3/stan 2-8-14-20.webp'),
  (9,  'Garsonjera', '25.00 m²', 'Visoko prizemlje', '/images/vila3/3d garsonjera.webp', '/images/vila3/stan 9-15-21.webp'),
  (10, 'Jednosoban', '36.04 m²', 'Prvi sprat',       '/images/vila3/lift3d.webp',        '/images/vila3/stan 1-4-10-16.webp'),
  (11, 'Jednosoban', '40.98 m²', 'Prvi sprat',       '/images/vila3/basic3d.webp',       '/images/vila3/stan 5-11-17.webp'),
  (12, 'Dvosoban',   '45.48 m²', 'Prvi sprat',       '/images/vila3/3d dvosoban.webp',   '/images/vila3/stan 3-6-12-18.webp'),
  (13, 'Jednosoban', '38.71 m²', 'Prvi sprat',       '/images/vila3/basic3d.webp',       '/images/vila3/stan 7 - 13 - 19.webp'),
  (14, 'Jednosoban', '38.41 m²', 'Prvi sprat',       '/images/vila3/basic3d.webp',       '/images/vila3/stan 2-8-14-20.webp'),
  (15, 'Garsonjera', '25.00 m²', 'Prvi sprat',       '/images/vila3/3d garsonjera.webp', '/images/vila3/stan 9-15-21.webp'),
  (16, 'Jednosoban', '36.04 m²', 'Drugi sprat',      '/images/vila3/lift3d.webp',        '/images/vila3/stan 1-4-10-16.webp'),
  (17, 'Jednosoban', '40.98 m²', 'Drugi sprat',      '/images/vila3/basic3d.webp',       '/images/vila3/stan 5-11-17.webp'),
  (18, 'Dvosoban',   '45.48 m²', 'Drugi sprat',      '/images/vila3/3d dvosoban.webp',   '/images/vila3/stan 3-6-12-18.webp'),
  (19, 'Jednosoban', '38.71 m²', 'Drugi sprat',      '/images/vila3/basic3d.webp',       '/images/vila3/stan 7 - 13 - 19.webp'),
  (20, 'Jednosoban', '38.41 m²', 'Drugi sprat',      '/images/vila3/basic3d.webp',       '/images/vila3/stan 2-8-14-20.webp'),
  (21, 'Garsonjera', '25.00 m²', 'Drugi sprat',      '/images/vila3/3d garsonjera.webp', '/images/vila3/stan 9-15-21.webp'),
  (22, 'Jednosoban', '36.68 m²', 'Povučeni sprat',   '/images/vila3/lift3d.webp',        '/images/vila3/stan 22.webp'),
  (23, 'Jednosoban', '40.64 m²', 'Povučeni sprat',   '/images/vila3/basic3d.webp',       '/images/vila3/stan 23.webp'),
  (24, 'Dvosoban',   '45.82 m²', 'Povučeni sprat',   '/images/vila3/3d dvosoban.webp',   '/images/vila3/stan 24.webp'),
  (25, 'Jednosoban', '38.82 m²', 'Povučeni sprat',   '/images/vila3/basic3d.webp',       '/images/vila3/stan 25.webp'),
  (26, 'Jednosoban', '38.52 m²', 'Povučeni sprat',   '/images/vila3/basic3d.webp',       '/images/vila3/stan 26.webp'),
  (27, 'Garsonjera', '24.77 m²', 'Povučeni sprat',   '/images/vila3/3d garsonjera.webp', '/images/vila3/stan 27.webp')
) as a(num, typ, size_label, floor_name, card_img, plan_img)
where b.slug = 'villa-3'
on conflict (building_id, number) do nothing;

-- ---------- SEED: STANOVI · VILA V ----------
-- Svi dostupni. Isti podaci kao supabase/migration-vila5.sql i src/constants/villa5Apartments.ts

insert into public.apartments (building_id, number, type, size_label, floor_name, card_image_url, plan_image_url, pdf_url, outdoor_label, outdoor_value, sold, sort_order)
select b.id, a.num, a.typ, a.size_label, a.floor_name, a.card_img, a.plan_img, a.pdf, 'Terasa', a.outdoor_value, false, a.num
from public.buildings b,
(values
  (1,  'Trosoban',   '57.87 m²', 'Suteren',        '/images/vila5/3d/stan-1-3.webp',      '/images/vila5/osnove/stan-1.webp',        '/images/vila5/pdf/stan-1.pdf',        'Ne'),
  (2,  'Dvosoban',   '37.14 m²', 'Suteren',        '/images/vila5/3d/stan-2.webp',        '/images/vila5/osnove/stan-2.webp',        '/images/vila5/pdf/stan-2.pdf',        'Ne'),
  (3,  'Trosoban',   '56.33 m²', 'Suteren',        '/images/vila5/3d/stan-1-3.webp',      '/images/vila5/osnove/stan-3.webp',        '/images/vila5/pdf/stan-3.pdf',        'Ne'),
  (4,  'Dvosoban',   '31.48 m²', 'Prizemlje',      '/images/vila5/3d/stan-4-11-18.webp',  '/images/vila5/osnove/stan-4-11-18.webp',  '/images/vila5/pdf/stan-4-11-18.pdf',  '1.52 m²'),
  (5,  'Dvosoban',   '34.53 m²', 'Prizemlje',      '/images/vila5/3d/stan-5-12-19.webp',  '/images/vila5/osnove/stan-5-12-19.webp',  '/images/vila5/pdf/stan-5-12-19.pdf',  '2.32 m²'),
  (6,  'Dvosoban',   '37.45 m²', 'Prizemlje',      '/images/vila5/3d/stan-6-13-20.webp',  '/images/vila5/osnove/stan-6-13-20.webp',  '/images/vila5/pdf/stan-6-13-20.pdf',  '2.15 m²'),
  (7,  'Dvosoban',   '36.12 m²', 'Prizemlje',      '/images/vila5/3d/stan-7-14-21.webp',  '/images/vila5/osnove/stan-7-14-21.webp',  '/images/vila5/pdf/stan-7-14-21.pdf',  '2.34 m²'),
  (8,  'Dvosoban',   '37.52 m²', 'Prizemlje',      '/images/vila5/3d/stan-8-15-22.webp',  '/images/vila5/osnove/stan-8-15-22.webp',  '/images/vila5/pdf/stan-8-15-22.pdf',  '2.22 m²'),
  (9,  'Dvosoban',   '34.53 m²', 'Prizemlje',      '/images/vila5/3d/stan-9-16-23.webp',  '/images/vila5/osnove/stan-9-16-23.webp',  '/images/vila5/pdf/stan-9-16-23.pdf',  '2.32 m²'),
  (10, 'Dvosoban',   '31.48 m²', 'Prizemlje',      '/images/vila5/3d/stan-10-17-24.webp', '/images/vila5/osnove/stan-10-17-24.webp', '/images/vila5/pdf/stan-10-17-24.pdf', '1.52 m²'),
  (11, 'Dvosoban',   '31.48 m²', 'Prvi sprat',     '/images/vila5/3d/stan-4-11-18.webp',  '/images/vila5/osnove/stan-4-11-18.webp',  '/images/vila5/pdf/stan-4-11-18.pdf',  '1.52 m²'),
  (12, 'Dvosoban',   '34.53 m²', 'Prvi sprat',     '/images/vila5/3d/stan-5-12-19.webp',  '/images/vila5/osnove/stan-5-12-19.webp',  '/images/vila5/pdf/stan-5-12-19.pdf',  '2.32 m²'),
  (13, 'Dvosoban',   '37.45 m²', 'Prvi sprat',     '/images/vila5/3d/stan-6-13-20.webp',  '/images/vila5/osnove/stan-6-13-20.webp',  '/images/vila5/pdf/stan-6-13-20.pdf',  '2.15 m²'),
  (14, 'Dvosoban',   '36.12 m²', 'Prvi sprat',     '/images/vila5/3d/stan-7-14-21.webp',  '/images/vila5/osnove/stan-7-14-21.webp',  '/images/vila5/pdf/stan-7-14-21.pdf',  '2.34 m²'),
  (15, 'Dvosoban',   '37.52 m²', 'Prvi sprat',     '/images/vila5/3d/stan-8-15-22.webp',  '/images/vila5/osnove/stan-8-15-22.webp',  '/images/vila5/pdf/stan-8-15-22.pdf',  '2.22 m²'),
  (16, 'Dvosoban',   '34.53 m²', 'Prvi sprat',     '/images/vila5/3d/stan-9-16-23.webp',  '/images/vila5/osnove/stan-9-16-23.webp',  '/images/vila5/pdf/stan-9-16-23.pdf',  '2.32 m²'),
  (17, 'Dvosoban',   '31.48 m²', 'Prvi sprat',     '/images/vila5/3d/stan-10-17-24.webp', '/images/vila5/osnove/stan-10-17-24.webp', '/images/vila5/pdf/stan-10-17-24.pdf', '1.52 m²'),
  (18, 'Dvosoban',   '31.48 m²', 'Drugi sprat',    '/images/vila5/3d/stan-4-11-18.webp',  '/images/vila5/osnove/stan-4-11-18.webp',  '/images/vila5/pdf/stan-4-11-18.pdf',  '1.52 m²'),
  (19, 'Dvosoban',   '34.53 m²', 'Drugi sprat',    '/images/vila5/3d/stan-5-12-19.webp',  '/images/vila5/osnove/stan-5-12-19.webp',  '/images/vila5/pdf/stan-5-12-19.pdf',  '2.32 m²'),
  (20, 'Dvosoban',   '37.45 m²', 'Drugi sprat',    '/images/vila5/3d/stan-6-13-20.webp',  '/images/vila5/osnove/stan-6-13-20.webp',  '/images/vila5/pdf/stan-6-13-20.pdf',  '2.15 m²'),
  (21, 'Dvosoban',   '36.12 m²', 'Drugi sprat',    '/images/vila5/3d/stan-7-14-21.webp',  '/images/vila5/osnove/stan-7-14-21.webp',  '/images/vila5/pdf/stan-7-14-21.pdf',  '2.34 m²'),
  (22, 'Dvosoban',   '37.52 m²', 'Drugi sprat',    '/images/vila5/3d/stan-8-15-22.webp',  '/images/vila5/osnove/stan-8-15-22.webp',  '/images/vila5/pdf/stan-8-15-22.pdf',  '2.22 m²'),
  (23, 'Dvosoban',   '34.53 m²', 'Drugi sprat',    '/images/vila5/3d/stan-9-16-23.webp',  '/images/vila5/osnove/stan-9-16-23.webp',  '/images/vila5/pdf/stan-9-16-23.pdf',  '2.32 m²'),
  (24, 'Dvosoban',   '31.48 m²', 'Drugi sprat',    '/images/vila5/3d/stan-10-17-24.webp', '/images/vila5/osnove/stan-10-17-24.webp', '/images/vila5/pdf/stan-10-17-24.pdf', '1.52 m²'),
  (25, 'Dvosoban',   '25.09 m²', 'Povučeni sprat', '/images/vila5/3d/stan-25.webp',       '/images/vila5/osnove/stan-25.webp',       '/images/vila5/pdf/stan-25.pdf',       'Ne'),
  (26, 'Jednosoban', '23.09 m²', 'Povučeni sprat', '/images/vila5/3d/stan-26.webp',       '/images/vila5/osnove/stan-26.webp',       '/images/vila5/pdf/stan-26.pdf',       'Ne'),
  (27, 'Trosoban',   '49.86 m²', 'Povučeni sprat', '/images/vila5/3d/stan-27-28.webp',    '/images/vila5/osnove/stan-27.webp',       '/images/vila5/pdf/stan-27.pdf',       'Ne'),
  (28, 'Trosoban',   '49.86 m²', 'Povučeni sprat', '/images/vila5/3d/stan-27-28.webp',    '/images/vila5/osnove/stan-28.webp',       '/images/vila5/pdf/stan-28.pdf',       'Ne'),
  (29, 'Jednosoban', '23.09 m²', 'Povučeni sprat', '/images/vila5/3d/stan-29.webp',       '/images/vila5/osnove/stan-29.webp',       '/images/vila5/pdf/stan-29.pdf',       'Ne'),
  (30, 'Dvosoban',   '25.09 m²', 'Povučeni sprat', '/images/vila5/3d/stan-30.webp',       '/images/vila5/osnove/stan-30.webp',       '/images/vila5/pdf/stan-30.pdf',       'Ne')
) as a(num, typ, size_label, floor_name, card_img, plan_img, pdf, outdoor_value)
where b.slug = 'vila-5'
on conflict (building_id, number) do nothing;
