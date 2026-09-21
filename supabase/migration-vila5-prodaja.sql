-- ============================================================
-- Vila V: počela prodaja
--
-- Pokreni u Supabase SQL Editoru. Isto može i u admin panelu:
-- Nekretnine, Vila V, izmeni: Status "Dostupno (u prodaji)", nadnaslov i opis kao ispod.
-- Posle ovoga Vila V svuda na sajtu ima oznaku "U prodaji" i aktivno dugme ka stranici /vila-5.
-- ============================================================

update public.buildings
set status = 'Dostupno',
    eyebrow = 'Novo · Počela prodaja',
    description = 'Nastavak projekta Kralj Residence Resort. Novo uređeno dvorište, sopstveni bazen i 30 luksuznih stanova. Prodaja je počela, direktno od investitora.'
where slug = 'vila-5';

-- Provera: status treba da bude Dostupno
select slug, status, eyebrow from public.buildings where slug = 'vila-5';
