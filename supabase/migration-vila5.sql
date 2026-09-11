-- ============================================================
-- Vila V: 30 stanova u admin panelu + stranice stanova
--
-- Pokreni CEO fajl u Supabase SQL Editoru. Bezbedno je i ako je raniju verziju ovog fajla
-- već pokrenuo: postojećim stanovima se dopunjuju samo prazna polja, izmene iz admin panela ostaju.
-- Podaci su isti kao u src/constants/villa5Apartments.ts, pa sajt izgleda isto
-- bez obzira da li se Vila V prikazuje iz baze ili iz koda.
-- ============================================================

-- 1. Nova polja stana
--    outdoor_value: vrednost spoljnog prostora na kartici ("1.52 m²", "Ne"...). Prazno = "Da".
--    pdf_url: PDF osnova za preuzimanje na stranici stana.
alter table public.apartments add column if not exists outdoor_value text;
alter table public.apartments add column if not exists pdf_url text;

-- 2. Stanovi Vile V
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
on conflict (building_id, number) do update set
  plan_image_url = coalesce(public.apartments.plan_image_url, excluded.plan_image_url),
  pdf_url = coalesce(public.apartments.pdf_url, excluded.pdf_url),
  outdoor_value = coalesce(public.apartments.outdoor_value, excluded.outdoor_value);

-- 3. Provera: treba da vrati 30 stanova, svi sa PDF-om
select count(*) as stanova_u_vili_5, count(a.pdf_url) as sa_pdf_om
from public.apartments a
join public.buildings b on b.id = a.building_id
where b.slug = 'vila-5';
