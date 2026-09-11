import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from './ContactForm';
import SectionHeading from './SectionHeading';

const CONTACT_ROWS = [
  { icon: <Phone className="h-5 w-5" />, label: 'Telefon', value: '+381 60 611 2327', href: 'tel:+381606112327' },
  { icon: <Phone className="h-5 w-5" />, label: 'Telefon', value: '+381 60 611 2328', href: 'tel:+381606112328' },
  { icon: <Mail className="h-5 w-5" />, label: 'Email', value: 'office@kraljresidence.rs', href: 'mailto:office@kraljresidence.rs' },
  { icon: <MapPin className="h-5 w-5" />, label: 'Adresa', value: 'Kneza Miloša 6, Vrnjačka Banja' },
  { icon: <Clock className="h-5 w-5" />, label: 'Radno vreme', value: 'Ponedeljak – Nedelja, 09:00 – 20:00' },
];

interface ContactSectionProps {
  title: string;
  onSuccess: () => void;
  /** Početni tekst poruke u formi */
  defaultMessage?: string;
}

/** Tamna kontakt sekcija sa telefonima, adresom i formom za upit (stranice zgrada i stanova). */
const ContactSection = ({ title, onSuccess, defaultMessage }: ContactSectionProps) => (
  <section id="contact" className="section-dark overflow-hidden">
    <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="scroll-animate from-left">
          <SectionHeading
            align="left"
            eyebrow="Kontakt"
            title={title}
            subtitle="Pošaljite poruku ili pozovite, naš tim vam se javlja u najkraćem roku, bez ikakve obaveze."
          />
          <div className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
            {CONTACT_ROWS.map((row, i) =>
              row.href ? (
                <a key={i} href={row.href} className="group flex items-center gap-4 py-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-night">
                    {row.icon}
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-gold">{row.label}</span>
                    <span className="block text-ts-h6 text-cream-100 transition-colors group-hover:text-gold">{row.value}</span>
                  </span>
                </a>
              ) : (
                <div key={i} className="flex items-center gap-4 py-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    {row.icon}
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-gold">{row.label}</span>
                    <span className="block text-ts-h6 text-cream-100">{row.value}</span>
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="scroll-animate from-right">
          <div className="rounded-xl2 border border-gold/15 bg-royal-espresso p-7 shadow-royal md:p-10">
            <h3 className="heading text-ts-h5 text-cream-100" style={{ fontFamily: 'Playfair Display' }}>
              Pošaljite upit
            </h3>
            <p className="mt-2 text-ts-p text-cream-100/60">Popunite formu i javljamo vam se sa svim detaljima.</p>
            <div className="mt-7">
              <ContactForm onSuccess={onSuccess} defaultMessage={defaultMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
