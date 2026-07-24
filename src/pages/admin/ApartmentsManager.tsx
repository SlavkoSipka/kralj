import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft, X } from 'lucide-react';
import {
  type Building,
  type ApartmentRow,
  fetchAllApartments,
  insertApartment,
  updateApartment,
  deleteApartment,
} from '../../lib/buildingsApi';
import { Field, TextInput, TextArea, Select, Toggle, ImageUpload } from './ui';

const FLOOR_OPTIONS = [
  'Nisko prizemlje',
  'Visoko prizemlje',
  'Prizemlje',
  'Prvi sprat',
  'Drugi sprat',
  'Treći sprat',
  'Povučeni sprat',
];

const TYPE_OPTIONS = ['Garsonjera', 'Jednosoban', 'Dvosoban', 'Trosoban', 'Četvorosoban'];

interface FormState {
  id?: string;
  number: string;
  type: string;
  size_label: string;
  floor_name: string;
  card_image_url: string;
  plan_image_url: string;
  outdoor_label: string;
  description: string;
  sold: boolean;
  visible: boolean;
  sort_order: string;
}

const emptyForm: FormState = {
  number: '',
  type: 'Jednosoban',
  size_label: '',
  floor_name: 'Prizemlje',
  card_image_url: '',
  plan_image_url: '',
  outdoor_label: 'Terasa',
  description: '',
  sold: false,
  visible: true,
  sort_order: '',
};

const ApartmentsManager = ({ building, onBack }: { building: Building; onBack: () => void }) => {
  const [apartments, setApartments] = useState<ApartmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setApartments(await fetchAllApartments(building.id));
    } finally {
      setLoading(false);
    }
  }, [building.id]);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    const nextNumber = apartments.length ? Math.max(...apartments.map((a) => a.number)) + 1 : 1;
    setForm({ ...emptyForm, number: String(nextNumber), sort_order: String(nextNumber) });
  };

  const startEdit = (a: ApartmentRow) =>
    setForm({
      id: a.id,
      number: String(a.number),
      type: a.type,
      size_label: a.size_label,
      floor_name: a.floor_name,
      card_image_url: a.card_image_url ?? '',
      plan_image_url: a.plan_image_url ?? '',
      outdoor_label: a.outdoor_label,
      description: a.description ?? '',
      sold: a.sold,
      visible: a.visible,
      sort_order: String(a.sort_order),
    });

  const save = async () => {
    if (!form || !form.number) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        building_id: building.id,
        number: parseInt(form.number, 10),
        type: form.type,
        size_label: form.size_label.trim(),
        floor_name: form.floor_name,
        card_image_url: form.card_image_url.trim() || null,
        plan_image_url: form.plan_image_url.trim() || null,
        outdoor_label: form.outdoor_label,
        description: form.description.trim() || null,
        sold: form.sold,
        visible: form.visible,
        sort_order: form.sort_order ? parseInt(form.sort_order, 10) : parseInt(form.number, 10),
      };
      if (form.id) {
        await updateApartment(form.id, payload);
      } else {
        await insertApartment(payload);
      }
      setForm(null);
      load();
    } catch (err: any) {
      setError(err?.message ?? 'Greška pri čuvanju');
    } finally {
      setSaving(false);
    }
  };

  const quickUpdate = async (a: ApartmentRow, patch: Partial<ApartmentRow>) => {
    await updateApartment(a.id, patch);
    load();
  };

  const remove = async (a: ApartmentRow) => {
    if (!window.confirm(`Obrisati stan broj ${a.number}?`)) return;
    await deleteApartment(a.id);
    load();
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-deep transition hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Nazad na zgrade
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="heading text-ts-h4 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
          {building.name} — stanovi ({apartments.length})
        </h2>
        <button onClick={startNew} className="btn-royal !px-5 !py-2.5 text-xs">
          <Plus className="h-4 w-4" />
          Novi stan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {apartments.map((a) => (
            <div
              key={a.id}
              className={`flex flex-wrap items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-royal-sm ${
                a.visible ? 'border-royal-ink/10' : 'border-dashed border-royal-ink/20 opacity-60'
              }`}
            >
              {a.card_image_url && (
                <img src={a.card_image_url} alt={`Stan ${a.number}`} className="h-12 w-16 rounded-md object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-royal-ink">Stan {a.number}</span>
                <span className="ml-2 text-sm text-royal-stone">
                  {a.type} · {a.size_label} · {a.floor_name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Toggle
                  checked={!a.sold}
                  onChange={(available) => quickUpdate(a, { sold: !available })}
                  labelOn="Dostupan"
                  labelOff="Prodat"
                />
                <Toggle
                  checked={a.visible}
                  onChange={(v) => quickUpdate(a, { visible: v })}
                  labelOn="Vidljiv"
                  labelOff="Skriven"
                />
                <button
                  onClick={() => startEdit(a)}
                  className="rounded-full border border-royal-ink/15 p-2 text-royal-stone transition hover:border-gold hover:text-gold-deep"
                  aria-label="Izmeni"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(a)}
                  className="rounded-full border border-royal-ink/15 p-2 text-royal-stone transition hover:border-red-400 hover:text-red-600"
                  aria-label="Obriši"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {apartments.length === 0 && (
            <p className="rounded-xl2 border border-dashed border-royal-ink/20 p-8 text-center text-royal-stone">
              Nema stanova. Dodaj prvi stan za ovu zgradu.
            </p>
          )}
        </div>
      )}

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
              {form.id ? `Izmena stana ${form.number}` : 'Novi stan'}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Broj stana *">
                <TextInput type="number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
              </Field>
              <Field label="Tip">
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Površina (labela)">
                <TextInput value={form.size_label} onChange={(e) => setForm({ ...form, size_label: e.target.value })} placeholder="42.50 m²" />
              </Field>
              <Field label="Sprat">
                <Select value={form.floor_name} onChange={(e) => setForm({ ...form, floor_name: e.target.value })}>
                  {FLOOR_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Spoljni prostor">
                <Select value={form.outdoor_label} onChange={(e) => setForm({ ...form, outdoor_label: e.target.value })}>
                  <option value="Terasa">Terasa</option>
                  <option value="Dvorište">Dvorište</option>
                  <option value="Balkon">Balkon</option>
                </Select>
              </Field>
              <Field label="Redosled prikaza">
                <TextInput type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} placeholder="isto kao broj stana" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Slika kartice (3D prikaz)">
                  <ImageUpload value={form.card_image_url} onChange={(url) => setForm({ ...form, card_image_url: url })} folder={`apartments/${building.slug}`} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Slika tlocrta (popup)">
                  <ImageUpload value={form.plan_image_url} onChange={(url) => setForm({ ...form, plan_image_url: url })} folder={`apartments/${building.slug}/plans`} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Opis (popup, opciono)">
                  <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ostavi prazno za podrazumevani tekst" />
                </Field>
              </div>
              <div className="flex items-center gap-3">
                <Toggle checked={!form.sold} onChange={(available) => setForm({ ...form, sold: !available })} labelOn="Dostupan" labelOff="Prodat" />
                <Toggle checked={form.visible} onChange={(v) => setForm({ ...form, visible: v })} labelOn="Vidljiv" labelOff="Skriven" />
              </div>
            </div>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <div className="mt-7 flex justify-end gap-3">
              <button onClick={() => setForm(null)} className="btn-royal-outline !px-6 !py-2.5 text-xs">
                Otkaži
              </button>
              <button onClick={save} disabled={saving || !form.number} className="btn-royal !px-6 !py-2.5 text-xs disabled:opacity-50">
                {saving ? 'Čuvanje...' : 'Sačuvaj'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentsManager;
