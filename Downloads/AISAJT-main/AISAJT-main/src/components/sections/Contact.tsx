import React, { useState } from 'react';
import { ArrowRight, CheckCircle, PartyPopper, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { Language, Translation } from '../../types/language';
import { trackLeadGeneration, trackFormInteraction, trackFormSubmitAttempt, trackFormError } from '../../utils/analytics';

// Initialize EmailJS
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "X82U5O5R8avB-lWeL";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_j5ciudw";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_k5lvrwi";

emailjs.init(EMAILJS_PUBLIC_KEY);

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ContactProps {
  language: Language;
  t: Translation;
}

export function Contact({ language, t }: ContactProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Track when user starts filling the form (only once per field)
    if (value && !formData[name as keyof FormData]) {
      trackFormInteraction(name, 'home_page', language);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission attempt
    trackFormSubmitAttempt('home_page', language);

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'office@aisajt.com',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          message: `Nova prijava za konsultacije:
            Ime: ${formData.name}
            Email: ${formData.email}
            Telefon: ${formData.phone}`
        }
      );

      if (result.status === 200) {
        // ⭐ GLAVNI LEAD EVENT - USPEŠNO POSLATA FORMA ⭐
        trackLeadGeneration('home_page', formData.name, language);

        setShowSuccess(true);
        setFormData({ name: '', email: '', phone: '' });
        setTimeout(() => {
          setShowSuccess(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 3000);
      }
    } catch (error) {
      // Track form error
      trackFormError('home_page', language, String(error));

      toast.error('Došlo je do greške. Molimo pokušajte ponovo.');
      console.error('EmailJS error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 bg-white/98 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center p-8 max-w-2xl mx-auto">
            <div className="flex justify-center space-x-6 mb-8">
              <div className="animate-bounce-delayed-1">
                <PartyPopper className="w-12 h-12 text-violet-500" />
              </div>
              <div className="animate-bounce-delayed-2">
                <Sparkles className="w-12 h-12 text-indigo-500" />
              </div>
              <div className="animate-bounce-delayed-3">
                <PartyPopper className="w-12 h-12 text-pink-500" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.thankYou}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {t.consultationScheduled.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index === 0 && <br />}
                </React.Fragment>
              ))}
            </p>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
        </div>
      )}

      <section className="py-24 md:py-40 relative" id="contact">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
        
        <Toaster position="top-center" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              
              {/* Left - Contact Info */}
              <div className="space-y-12">
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
                    {language === 'sr' ? 'Kontakt' : 'Contact'}
                  </p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    <span className="gradient-text">{language === 'sr' ? 'Besplatne' : 'Free'}</span>
                    <br />
                    {language === 'sr' ? 'Konsultacije' : 'Consultations'}
                  </h2>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  {language === 'sr' 
                    ? 'Javite nam se i zajedno ćemo pronaći najbolje rešenje za vaš projekat.'
                    : 'Get in touch and together we will find the best solution for your project.'
                  }
                </p>
                
                {/* Contact Details - Minimal Style */}
                <div className="space-y-8 pt-8 border-t border-violet-100">
                  <div>
                    <p className="text-xs font-medium text-violet-400 uppercase tracking-widest mb-2">
                      {language === 'sr' ? 'Lokacija' : 'Location'}
                    </p>
                    <p className="text-xl text-gray-900 font-medium">Beograd, Srbija</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-2">
                      Email
                    </p>
                    <a href="mailto:office@aisajt.com" className="text-xl text-gray-900 font-medium hover:text-violet-600 transition-colors">
                      office@aisajt.com
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-pink-400 uppercase tracking-widest mb-2">
                      {language === 'sr' ? 'Telefon' : 'Phone'}
                    </p>
                    <a href="tel:+381613091583" className="text-xl text-gray-900 font-medium hover:text-violet-600 transition-colors">
                      +381 61 309 1583
                    </a>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div className="lg:pt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Field */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-xs font-medium text-violet-400 uppercase tracking-widest mb-3"
                    >
                      {t.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder={language === 'sr' ? 'Vaše ime i prezime' : 'Your full name'}
                      className={`w-full px-0 py-4 bg-transparent border-0 border-b-2 text-gray-900 text-lg placeholder-gray-300 focus:outline-none transition-colors duration-300 ${
                        focusedField === 'name' ? 'border-violet-500' : 'border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3"
                    >
                      {t.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder={language === 'sr' ? 'vas@email.com' : 'your@email.com'}
                      className={`w-full px-0 py-4 bg-transparent border-0 border-b-2 text-gray-900 text-lg placeholder-gray-300 focus:outline-none transition-colors duration-300 ${
                        focusedField === 'email' ? 'border-indigo-500' : 'border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label 
                      htmlFor="phone" 
                      className="block text-xs font-medium text-pink-400 uppercase tracking-widest mb-3"
                    >
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder={language === 'sr' ? '+381 XX XXX XXXX' : '+381 XX XXX XXXX'}
                      className={`w-full px-0 py-4 bg-transparent border-0 border-b-2 text-gray-900 text-lg placeholder-gray-300 focus:outline-none transition-colors duration-300 ${
                        focusedField === 'phone' ? 'border-pink-500' : 'border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group px-10 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 inline-flex items-center gap-3 ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting 
                        ? (language === 'sr' ? 'Šaljem...' : 'Sending...') 
                        : (language === 'sr' ? 'Pošalji' : 'Send')
                      }
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                  
                  {/* Small note */}
                  <p className="text-sm text-gray-500 pt-4">
                    {language === 'sr' 
                      ? '* Odgovaramo u roku od 24 sata. Bez obaveza.'
                      : '* We respond within 24 hours. No obligations.'
                    }
                  </p>
                </form>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
