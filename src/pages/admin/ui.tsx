import { useState, type ReactNode, type ChangeEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '../../lib/buildingsApi';

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep">{label}</span>
    {children}
  </label>
);

const inputCls =
  'w-full rounded-lg border border-royal-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-royal-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20';

export const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${inputCls} ${props.className ?? ''}`} />
);

export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea rows={3} {...props} className={`${inputCls} ${props.className ?? ''}`} />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`${inputCls} ${props.className ?? ''}`} />
);

export const Toggle = ({
  checked,
  onChange,
  labelOn = 'Uključeno',
  labelOff = 'Isključeno',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
      checked ? 'bg-emerald-100 text-emerald-800' : 'bg-royal-ink/10 text-royal-stone'
    }`}
  >
    <span className={`h-2 w-2 rounded-full ${checked ? 'bg-emerald-500' : 'bg-royal-stone/50'}`} />
    {checked ? labelOn : labelOff}
  </button>
);

interface UploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

/** Upload fajla u Supabase Storage ili ručni unos URL-a. */
const UploadField = ({
  value,
  onChange,
  folder,
  accept,
  buttonLabel,
  placeholder,
  preview,
}: UploadProps & { accept: string; buttonLabel: string; placeholder: string; preview: ReactNode }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri upload-u');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {value && preview}
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gold/50 bg-gold/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-gold-deep transition hover:bg-gold hover:text-royal-ink">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Upload...' : buttonLabel}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-royal-ink/15 bg-white px-3 py-2 text-xs text-royal-ink outline-none focus:border-gold"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

/** Upload slike u Supabase Storage ili ručni unos URL-a. */
export const ImageUpload = (props: UploadProps) => (
  <UploadField
    {...props}
    accept="image/*"
    buttonLabel="Otpremi sliku"
    placeholder="ili nalepi URL / putanju slike"
    preview={<img src={props.value} alt="Pregled" className="h-28 w-full rounded-lg border border-royal-ink/10 object-cover" />}
  />
);

/** Upload PDF-a u Supabase Storage ili ručni unos URL-a. */
export const FileUpload = (props: UploadProps) => (
  <UploadField
    {...props}
    accept="application/pdf"
    buttonLabel="Otpremi PDF"
    placeholder="ili nalepi URL / putanju PDF-a"
    preview={
      <a
        href={props.value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-xs font-semibold uppercase tracking-wider text-gold-deep underline underline-offset-4 hover:text-gold"
      >
        Otvori trenutni PDF
      </a>
    }
  />
);
