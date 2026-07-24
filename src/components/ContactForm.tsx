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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="label-royal">Ime</label>
          <input type="text" name="from_name" required className="input-royal" placeholder="Vaše ime" />
        </div>
        <div>
          <label className="label-royal">Prezime</label>
          <input type="text" name="from_lastname" required className="input-royal" placeholder="Vaše prezime" />
        </div>
      </div>
      <div>
        <label className="label-royal">Email</label>
        <input type="email" name="from_email" required className="input-royal" placeholder="vasa@adresa.rs" />
      </div>
      <div>
        <label className="label-royal">Telefon</label>
        <input type="tel" name="from_phone" required className="input-royal" placeholder="+381 6X XXX XXXX" />
      </div>
      <div>
        <label className="label-royal">Poruka</label>
        <textarea
          rows={4}
          name="message"
          required
          className="input-royal resize-none"
          placeholder="Za koji projekat ste zainteresovani?"
        ></textarea>
      </div>

      <button type="submit" disabled={isLoading} className="btn-royal w-full disabled:cursor-not-allowed disabled:opacity-60">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Slanje...
          </>
        ) : (
          'Pošaljite upit'
        )}
      </button>

      <p className="text-center text-xs text-cream-100/50">
        Odgovaramo u najkraćem roku. Vaši podaci se koriste isključivo za kontakt.
      </p>

      {status === 'success' && (
        <p className="text-center text-sm text-green-400">Poruka je uspešno poslata. Hvala!</p>
      )}
      {status === 'error' && (
        <p className="text-center text-sm text-red-400">Došlo je do greške. Molimo pokušajte ponovo.</p>
      )}
    </form>
  );
};

export default ContactForm;