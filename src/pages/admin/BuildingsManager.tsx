import { useState } from 'react';
import { Plus, Pencil, Trash2, Building2, ArrowRight, X } from 'lucide-react';
import {
  type Building,
  type BuildingStatus,
  updateBuilding,
  deleteBuilding,
  upsertBuilding,
} from '../../lib/buildingsApi';
import { supabase } from '../../lib/supabase';
import { Field, TextInput, TextArea, Select, Toggle, ImageUpload } from './ui';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

interface FormState {
  id?: string;
  name: string;
  slug: string;
  eyebrow: string;
  description: string;
  image_url: string;
  size_label: string;
  features: string;
  status: BuildingStatus;
  visible: boolean;
  sort_order: number;
  total_apartments: string;
  home_title: string;
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  eyebrow: 'U prodaji',
  description: '',
  image_url: '',
  size_label: '',
  features: 'Privatni bazen, Uređeno dvorište, Parking',
  status: 'Uskoro',
  visible: true,
  sort_order: 0,
  total_apartments: '',
  home_title: '',
};

interface Props {
  buildings: Building[];
  onChanged: () => void;
  onOpenApartments: (b: Building) => void;
}

const BuildingsManager = ({ buildings, onChanged, onOpenApartments }: Props) => {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startNew = () => setForm({ ...emptyForm, sort_order: buildings.length + 1 });

  const startEdit = (b: Building) =>
    setForm({
      id: b.id,
      name: b.name,
      slug: b.slug,
      eyebrow: b.eyebrow ?? '',
      description: b.description ?? '',
      image_url: b.image_url ?? '',
      size_label: b.size_label ?? '',
      features: b.features.join(', '),
      status: b.status,
      visible: b.visible,
      sort_order: b.sort_order,
      total_apartments: b.total_apartments?.toString() ?? '',
      home_title: b.home_title ?? '',
    });

  const save = async () => {
    if (!form || !form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        slug: form.slug.trim() || slugify(form.name),
        name: form.name.trim(),
        eyebrow: form.eyebrow.trim() || null,
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        size_label: form.size_label.trim() || null,
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
        status: form.status,
        visible: form.visible,
        sort_order: form.sort_order,
        total_apartments: form.total_apartments ? parseInt(form.total_apartments, 10) : null,
        home_title: form.home_title.trim() || null,
      };
      if (form.id) {
        await updateBuilding(form.id, payload);
      } else {
        await upsertBuilding(payload);
      }
      setForm(null);
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? 'Greška pri čuvanju');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (b: Building) => {
    await updateBuilding(b.id, { visible: !b.visible });
    onChanged();
  };

  const remove = async (b: Building) => {
    if (!window.confirm(`Obrisati zgradu "${b.name}" i SVE njene stanove? Ovo je nepovratno.`)) return;
    await deleteBuilding(b.id);
    onChanged();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="heading text-ts-h4 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
          Zgrade
        </h2>
        <button onClick={startNew} className="btn-royal !px-5 !py-2.5 text-xs">
          <Plus className="h-4 w-4" />
          Nova zgrada
        </button>
      </div>

      {/* Lista zgrada */}
      <div className="space-y-3">
        {buildings.map((b) => (
          <div
            key={b.id}
            className={`flex flex-wrap items-center gap-4 rounded-xl2 border bg-white p-4 shadow-royal-sm ${
              b.visible ? 'border-royal-ink/10' : 'border-dashed border-royal-ink/20 opacity-60'
            }`}
          >
            {b.image_url ? (
              <img src={b.image_url} alt={b.name} className="h-16 w-24 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-royal-sand">
                <Building2 className="h-6 w-6 text-gold-deep" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="heading text-ts-h6 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
                  {b.name}
                </span>
                <span
                  className={`chip-status ${
                    b.status === 'Prodato' ? 'chip-sold' : b.status === 'Uskoro' ? 'chip-soon' : 'chip-available'
                  } !px-2.5 !py-0.5 !text-[10px]`}
                >
                  {b.status}
                </span>
              </div>
              <p className="mt-0.5 truncate text-sm text-royal-stone">
                /{b.slug} · {b.size_label ?? '—'} · redosled: {b.sort_order}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Toggle checked={b.visible} onChange={() => toggleVisible(b)} labelOn="Vidljiva" labelOff="Skrivena" />
              <button
                onClick={() => onOpenApartments(b)}
                className="inline-flex items-center gap-1.5 rounded-full bg-royal-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold transition hover:bg-royal-charcoal"
              >
                Stanovi
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => startEdit(b)}
                className="rounded-full border border-royal-ink/15 p-2.5 text-royal-stone transition hover:border-gold hover:text-gold-deep"
                aria-label="Izmeni"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(b)}
                className="rounded-full border border-royal-ink/15 p-2.5 text-royal-stone transition hover:border-red-400 hover:text-red-600"
                aria-label="Obriši"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {buildings.length === 0 && (
          <p className="rounded-xl2 border border-dashed border-royal-ink/20 p-8 text-center text-royal-stone">
            {supabase ? 'Nema zgrada u bazi. Dodaj prvu zgradu ili pokreni seed SQL.' : 'Supabase nije konfigurisan (.env).'}
          </p>
        )}
      </div>

      {/* Forma (modal) */}
      {form && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-royal-ink/70 p-4 backdrop-blur-sm md:items-center">
          <div className="relative w-full max-w-2xl rounded-xl2 bg-royal-ivory p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setForm(null)}
              className="absolute right-4 top-4 rounded-full bg-royal-ink/90 p-2 text-gold transition hover:bg-royal-ink"
              aria-label="Zatvori"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="heading mb-6 text-ts-h5 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
              {form.id ? `Izmena: ${form.name}` : 'Nova zgrada'}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Naziv *">
                <TextInput
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })}
                  placeholder="Vila VI"
                />
              </Field>
              <Field label="Slug (URL)">
                <TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="vila-6" />
              </Field>
              <Field label="Nadnaslov (eyebrow)">
                <TextInput value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="U prodaji" />
              </Field>
              <Field label="Površina (labela)">
                <TextInput value={form.size_label} onChange={(e) => setForm({ ...form, size_label: e.target.value })} placeholder="1500 m²" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Opis">
                  <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Glavna slika">
                  <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="buildings" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Karakteristike (odvojene zarezom)">
                  <TextInput value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Naslov sekcije na početnoj (opciono, za SEO)">
                  <TextInput
                    value={form.home_title}
                    onChange={(e) => setForm({ ...form, home_title: e.target.value })}
                    placeholder="npr. Novogradnja stanova u Vrnjačkoj Banji"
                  />
                </Field>
              </div>
              <Field label="Status">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BuildingStatus })}>
                  <option value="Dostupno">Dostupno (u prodaji)</option>
                  <option value="Uskoro">Uskoro</option>
                  <option value="Prodato">Prodato</option>
                </Select>
              </Field>
              <Field label="Ukupno stanova (za prikaz)">
                <TextInput
                  type="number"
                  value={form.total_apartments}
                  onChange={(e) => setForm({ ...form, total_apartments: e.target.value })}
                  placeholder="27"
                />
              </Field>
              <Field label="Redosled prikaza">
                <TextInput
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value || '0', 10) })}
                />
              </Field>
              <div className="flex items-end pb-1">
                <Toggle checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} labelOn="Vidljiva na sajtu" labelOff="Skrivena sa sajta" />
              </div>
            </div>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <div className="mt-7 flex justify-end gap-3">
              <button onClick={() => setForm(null)} className="btn-royal-outline !px-6 !py-2.5 text-xs">
                Otkaži
              </button>
              <button onClick={save} disabled={saving || !form.name.trim()} className="btn-royal !px-6 !py-2.5 text-xs disabled:opacity-50">
                {saving ? 'Čuvanje...' : 'Sačuvaj'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingsManager;
