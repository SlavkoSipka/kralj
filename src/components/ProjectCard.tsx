import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Clock } from 'lucide-react';

export interface ProjectCardData {
  name: string;
  image: string;
  size: string;
  apartments: number;
  features: string[];
  status: 'Dostupno' | 'Prodato' | 'Uskoro';
  to?: string;
}

const statusChip = (status: ProjectCardData['status']) => {
  if (status === 'Prodato') return { cls: 'chip-sold', label: 'Prodato' };
  if (status === 'Uskoro') return { cls: 'chip-soon', label: 'Uskoro' };
  return { cls: 'chip-available', label: 'U prodaji' };
};

interface ProjectCardProps {
  data: ProjectCardData;
  variant?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ data, variant = 'light', compact = false, className = '' }) => {
  const sold = data.status === 'Prodato';
  const soon = data.status === 'Uskoro';
  const isDark = variant === 'dark';
  const chip = statusChip(data.status);

  if (compact) {
    const unavailable = sold || soon;
    const available = !unavailable;
    const inner = (
      <article className="card-royal group flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={data.image}
            alt={`${data.name} — Kralj Residence Vrnjačka Banja`}
            className={`h-full w-full object-cover transition-all duration-[900ms] ease-out ${
              unavailable ? 'grayscale' : 'group-hover:scale-105'
            }`}
            loading="lazy"
            decoding="async"
          />
          <div
            className={`absolute inset-0 ${
              unavailable ? 'bg-night/55' : 'bg-gradient-to-t from-night/45 via-transparent to-transparent'
            }`}
          />

          {unavailable ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.22em] backdrop-blur-sm ${
                  sold ? 'border-white/80 bg-night/45 text-white' : 'border-gold bg-night/45 text-gold'
                }`}
              >
                {sold ? <Lock className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                {sold ? 'Prodato' : 'Uskoro'}
              </span>
            </div>
          ) : (
            <span className="chip-status chip-available absolute left-4 top-4 shadow-royal-sm">U prodaji</span>
          )}
        </div>

        {/* White info strip */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="heading text-ts-h5 text-royal-ink" style={{ fontFamily: 'Playfair Display' }}>
            {data.name}
          </h3>
          <p className="mt-1 text-sm text-royal-stone">
            {soon ? 'Detalji uskoro' : `${data.size} · ${data.apartments} stanova`}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-royal-ink/10 pt-4">
            {available ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep transition-colors group-hover:text-gold">
                Pogledaj ponudu
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-royal-stone/55">
                {sold ? <Lock className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                {sold ? 'Rasprodato' : 'Uskoro u ponudi'}
              </span>
            )}
          </div>
        </div>
      </article>
    );

    return available && data.to ? (
      <Link to={data.to} className="block h-full" aria-label={`${data.name} — ponuda stanova`}>
        {inner}
      </Link>
    ) : (
      inner
    );
  }

  const titleColor = isDark ? 'text-cream-100' : 'text-royal-ink';
  const metaLabel = isDark ? 'text-gold' : 'text-gold-deep';
  const metaValue = isDark ? 'text-cream-100' : 'text-royal-ink';
  const featureText = isDark ? 'text-cream-100/70' : 'text-royal-stone';
  const divider = isDark ? 'border-gold/15' : 'border-royal-ink/10';

  return (
    <article
      className={`${isDark ? 'card-royal-dark' : 'card-royal'} h-full flex flex-col ${
        sold ? 'hover:-translate-y-0 hover:shadow-royal-sm' : ''
      } ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={data.image}
          alt={`${data.name} — Kralj Residence Vrnjačka Banja`}
          className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out ${
            sold ? 'grayscale' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          decoding="async"
        />
        <div
          className={`absolute inset-0 ${
            sold ? 'bg-night/55' : 'bg-gradient-to-t from-black/55 via-black/5 to-transparent'
          }`}
        />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-night/45 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
              <Lock className="h-4 w-4" />
              Prodato
            </span>
          </div>
        )}
        {!sold && <span className={`chip-status absolute left-5 top-5 ${chip.cls}`}>{chip.label}</span>}
        <h3
          className="heading absolute bottom-5 left-6 right-6 text-ts-h4 text-cream-100 drop-shadow"
          style={{ fontFamily: 'Playfair Display' }}
        >
          {data.name}
        </h3>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Meta row (inline, compact) */}
        <div className={`flex items-stretch divide-x ${divider} border-b ${divider} pb-5`}>
          <div className="flex-1 pr-6">
            <p className={`text-xs uppercase tracking-[0.14em] ${metaLabel}`}>Površina</p>
            <p className={`mt-1 text-ts-h5 font-medium ${metaValue}`} style={{ fontFamily: 'Playfair Display' }}>
              {data.size}
            </p>
          </div>
          <div className="flex-1 pl-6">
            <p className={`text-xs uppercase tracking-[0.14em] ${metaLabel}`}>Stanovi</p>
            <p className={`mt-1 text-ts-h5 font-medium ${metaValue}`} style={{ fontFamily: 'Playfair Display' }}>
              {data.apartments}
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5">
          {data.features.map((feature) => (
            <li key={feature} className={`flex items-center text-ts-p ${featureText}`}>
              <span className="mr-2.5 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-auto pt-7">
          {data.to && !sold ? (
            <Link to={data.to} className="btn-royal w-full">
              Ponuda stanova
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : soon ? (
            <span className="chip-status chip-soon">Uskoro u prodaji</span>
          ) : (
            <span className="chip-status chip-sold">Prodato</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
