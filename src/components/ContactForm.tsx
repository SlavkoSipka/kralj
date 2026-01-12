import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Loader2 } from 'lucide-react';

interface ContactFormProps {
  onSuccess: () => void; // Callback kada je poruka uspešno poslata
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    const form = e.currentTarget;

    try {
      await emailjs.sendForm(
        'service_2usuvxd',
        'template_ayau86a',
        form,
        'zxKlqClN1_VeYPEiL'
      );

      setStatus('success');
      onSuccess(); // Pozovi callback kada je poruka uspešno poslata
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', {
        error,
        form: Object.fromEntries(new FormData(form))
      });
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-16">
        <div>
          <label className="block text-[#D4AF37] text-sm mb-2">Ime</label>
          <input
            type="text"
            name="from_name"
            required
            className="w-full px-4 py-3 bg-black/30 border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] focus:outline-none text-cream-100 placeholder-cream-100/50 transition-colors"
            placeholder="Unesite vaše ime"
          />
        </div>
        <div>
          <label className="block text-[#D4AF37] text-sm mb-2">Prezime</label>
          <input
            type="text"
            name="from_lastname"
            required
            className="w-full px-4 py-3 bg-black/30 border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] focus:outline-none text-cream-100 placeholder-cream-100/50 transition-colors"
            placeholder="Unesite vaše prezime"
          />
        </div>
      </div>
      <div>
        <label className="block text-[#D4AF37] text-sm mb-2">Email</label>
        <input
          type="email"
          name="from_email"
          required
          className="w-full px-4 py-3 bg-black/30 border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] focus:outline-none text-cream-100 placeholder-cream-100/50 transition-colors"
          placeholder="Unesite vašu email adresu"
        />
      </div>
      <div>
        <label className="block text-[#D4AF37] text-sm mb-2">Telefon</label>
        <input
          type="tel"
          name="from_phone"
          required
          className="w-full px-4 py-3 bg-black/30 border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] focus:outline-none text-cream-100 placeholder-cream-100/50 transition-colors"
          placeholder="Unesite vaš broj telefona"
        />
      </div>
      <div>
        <label className="block text-[#D4AF37] text-sm mb-2">Poruka</label>
        <textarea
          rows={4}
          name="message"
          required
          className="w-full px-4 py-3 bg-black/30 border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] focus:outline-none text-cream-100 placeholder-cream-100/50 transition-colors resize-none"
          placeholder="Unesite vašu poruku"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#D4AF37] text-black py-4 rounded-lg text-sm uppercase tracking-wider font-medium hover:bg-[#E5C048] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Slanje...
          </>
        ) : (
          'Pošaljite Poruku'
        )}
      </button>

      {status === 'success' && (
        <p className="text-green-500 text-center">Poruka je uspešno poslata!</p>
      )}
      {status === 'error' && (
        <p className="text-red-500 text-center">Došlo je do greške. Molimo pokušajte ponovo.</p>
      )}
    </form>
  );
};

export default ContactForm;