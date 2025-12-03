import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Mail, Phone, MapPin, CheckCircle, Send, PartyPopper, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { trackLeadGeneration, trackFormInteraction, trackFormSubmitAttempt, trackFormError, trackContactInfoClick } from '../../utils/analytics';

// Initialize EmailJS
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "O6sCZaCGoXrFHvBGT";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_rsasqr9";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_jf2rgsy";

emailjs.init(EMAILJS_PUBLIC_KEY);

type Language = 'sr' | 'en';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const translations = {
  sr: {
    services: 'Usluge',
    portfolio: 'Portfolio',
    aboutUs: 'O Nama',
    contact: 'Kontakt',
    name: 'Ime',
    email: 'Email',
    phone: 'Telefon',
    footerDesc: 'Profesionalna izrada web sajtova uz pomoć najnovije AI tehnologije.',
    company: 'Kompanija',
  },
  en: {
    services: 'Services',
    portfolio: 'Portfolio',
    aboutUs: 'About Us',
    contact: 'Contact',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    footerDesc: 'Professional website development using the latest AI technology.',
    company: 'Company',
  }
};

export function ContactPage() {
  const [language, setLanguage] = useState<Language>('sr');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  const t = translations[language];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'sr' 
      ? 'Besplatne Konsultacije za Website | AI Izrada Sajtova - AI Websajt Izrada' 
      : 'Free Website Consultations | AI Website Development';
  }, [language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Track when user starts filling the form (only once per field)
    if (value && !formData[name as keyof FormData]) {
      trackFormInteraction(name, 'contact_page', language);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission attempt
    trackFormSubmitAttempt('contact_page', language);

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
        trackLeadGeneration('contact_page', formData.name, language);

        setShowSuccess(true);
        setFormData({ name: '', email: '', phone: '' });
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      // Track form error
      trackFormError('contact_page', language, String(error));

      toast.error('Došlo je do greške. Molimo pokušajte ponovo.');
      console.error('EmailJS error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white/98 backdrop-blur-md flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-2xl mx-auto">
            <div className="flex justify-center space-x-6 mb-8">
              <PartyPopper className="w-12 h-12 text-violet-500 animate-bounce" />
              <Sparkles className="w-12 h-12 text-indigo-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <PartyPopper className="w-12 h-12 text-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'sr' ? 'Hvala Vam!' : 'Thank You!'}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'sr' 
                ? 'Vaša poruka je uspešno poslata. Javićemo vam se uskoro!'
                : 'Your message has been sent successfully. We will get back to you soon!'
              }
            </p>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center group">
              <img 
                src="/images/providna2.png" 
                alt="AiSajt Logo" 
                className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                {language === 'sr' ? 'Početna' : 'Home'}
              </Link>
              <span className="text-gray-900 font-semibold border-b-2 border-violet-500 pb-1">
                {t.contact}
              </span>
              
              {/* Language Switcher */}
              <div className="flex gap-1 border-2 border-gray-900 rounded-full p-1">
                <button
                  onClick={() => setLanguage('sr')}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                    language === 'sr' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  SR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                    language === 'en' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-700 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <div className="container mx-auto px-4 space-y-4">
              <Link to="/" className="block text-gray-600 py-2">{language === 'sr' ? 'Početna' : 'Home'}</Link>
              <span className="block text-gray-900 font-semibold py-2">{t.contact}</span>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Contact Form */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>
        
        {/* Animated Background Circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Animated Logos - Varied sizes and opacity for depth */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large - Far back */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-20 left-[6%] w-24 h-24 md:w-36 md:h-36 object-contain opacity-8 animate-float"
            style={{ animationDelay: '0s', animationDuration: '8s' }}
          />
          {/* Medium - Mid depth */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-28 right-[10%] w-16 h-16 md:w-24 md:h-24 object-contain opacity-15 animate-float"
            style={{ animationDelay: '1.2s', animationDuration: '7s' }}
          />
          {/* Small - Close */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-40 left-[15%] w-10 h-10 md:w-14 md:h-14 object-contain opacity-25 animate-float"
            style={{ animationDelay: '2.5s', animationDuration: '6s' }}
          />
          {/* Large - Middle left */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute top-[45%] left-[4%] w-20 h-20 md:w-32 md:h-32 object-contain opacity-10 animate-float"
            style={{ animationDelay: '3s', animationDuration: '9s' }}
          />
          {/* Small - Middle */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-[35%] left-[25%] w-8 h-8 md:w-12 md:h-12 object-contain opacity-20 animate-float"
            style={{ animationDelay: '0.8s', animationDuration: '5.5s' }}
          />
          {/* Medium - Bottom left */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[35%] left-[8%] w-14 h-14 md:w-20 md:h-20 object-contain opacity-12 animate-float"
            style={{ animationDelay: '1.5s', animationDuration: '7.5s' }}
          />
          {/* Large - Bottom right */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[28%] right-[6%] w-28 h-28 md:w-40 md:h-40 object-contain opacity-8 animate-float"
            style={{ animationDelay: '2s', animationDuration: '8.5s' }}
          />
          {/* Small - Top center */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-[18%] left-[42%] w-12 h-12 object-contain opacity-18 animate-float"
            style={{ animationDelay: '3.5s', animationDuration: '6.5s' }}
          />
          {/* Medium - Bottom center */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[20%] left-[35%] w-16 h-16 object-contain opacity-10 animate-float"
            style={{ animationDelay: '4s', animationDuration: '7s' }}
          />
          {/* Small - Far right top */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute top-[52%] right-[3%] w-10 h-10 object-contain opacity-22 animate-float"
            style={{ animationDelay: '2.2s', animationDuration: '5s' }}
          />
          {/* Medium - Right middle */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute top-[70%] right-[12%] w-18 h-18 md:w-24 md:h-24 object-contain opacity-12 animate-float"
            style={{ animationDelay: '1s', animationDuration: '6.8s' }}
          />
          {/* Large - Top far left */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="hidden md:block absolute top-[12%] left-[2%] w-32 h-32 md:w-44 md:h-44 object-contain opacity-6 animate-float"
            style={{ animationDelay: '0.5s', animationDuration: '9.5s' }}
          />
          {/* Small - Bottom far right */}
          <img 
            src="/images/providna 1.png" 
            alt="" 
            className="absolute bottom-[12%] right-[2%] w-8 h-8 md:w-12 md:h-12 object-contain opacity-25 animate-float"
            style={{ animationDelay: '3.8s', animationDuration: '5.8s' }}
          />
        </div>

        {/* Giant Background Letter */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none">
          <h1 className="text-[400px] md:text-[600px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-[0.04]">
            @
          </h1>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
              
              {/* Left - Hero Content */}
              <div className="space-y-6 md:space-y-8">
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
                    {language === 'sr' ? 'Stupite u kontakt' : 'Get in Touch'}
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    <span className="gradient-text">{language === 'sr' ? 'Besplatne Konsultacije' : 'Free Consultations'}</span>
                    <br />
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{language === 'sr' ? 'za Vaš Website' : 'for Your Website'}</span>
                  </h1>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
                    {language === 'sr' 
                      ? 'Spremni smo da saslušamo vašu ideju i pretvorimo je u moderan, funkcionalan website koji privlači klijente. Kontaktirajte nas danas i započnimo saradnju.'
                      : 'We are ready to hear your idea and turn it into a modern, functional website that attracts clients. Contact us today and let\'s start working together.'
                    }
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-6 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{language === 'sr' ? 'Lokacija' : 'Location'}</p>
                      <p className="text-lg text-gray-900 font-medium">Beograd, Srbija</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a 
                        href="mailto:office@aisajt.com"
                        onClick={() => trackContactInfoClick('email', 'office@aisajt.com', language)}
                        className="text-lg text-gray-900 font-medium hover:text-violet-600 transition-colors"
                      >
                        office@aisajt.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{language === 'sr' ? 'Telefon' : 'Phone'}</p>
                      <a 
                        href="tel:+381613091583"
                        onClick={() => trackContactInfoClick('phone', '+381613091583', language)}
                        className="text-lg text-gray-900 font-medium hover:text-violet-600 transition-colors"
                      >
                        +381 61 309 1583
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right - Form */}
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-violet-200 rounded-2xl opacity-50"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-pink-200 rounded-2xl opacity-50"></div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-violet-500/10 p-6 md:p-8 lg:p-10 border border-gray-100 relative">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {language === 'sr' ? 'Pošaljite nam poruku' : 'Send us a message'}
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">
                    {language === 'sr' ? 'Popunite formular ispod' : 'Fill out the form below'}
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-violet-400 uppercase tracking-widest mb-3">
                        {t.name} *
                      </label>
                      <input
                        type="text"
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

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-indigo-400 uppercase tracking-widest mb-3">
                        {t.email} *
                      </label>
                      <input
                        type="email"
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

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-pink-400 uppercase tracking-widest mb-3">
                        {t.phone} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="+381 XX XXX XXXX"
                        className={`w-full px-0 py-4 bg-transparent border-0 border-b-2 text-gray-900 text-lg placeholder-gray-300 focus:outline-none transition-colors duration-300 ${
                          focusedField === 'phone' ? 'border-pink-500' : 'border-gray-200'
                        }`}
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full group px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'}`} />
                        {isSubmitting 
                          ? (language === 'sr' ? 'Šaljem...' : 'Sending...') 
                          : (language === 'sr' ? 'Pošalji' : 'Send')
                        }
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>

                  {/* Trust note */}
                  <p className="text-sm text-gray-400 text-center mt-6">
                    {language === 'sr' 
                      ? '✨ Odgovaramo u roku od 24h. Bez obaveza.'
                      : '✨ We respond within 24h. No obligations.'
                    }
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

          {/* Footer */}
          <footer className="relative text-gray-900 py-12 md:py-16 border-t border-violet-200/30">
            {/* Smooth layered gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-violet-50/35 to-pink-50/40"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-50/20 via-transparent to-indigo-50/25"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="space-y-4">
                  <Link 
                    to="/"
                    className="flex items-center hover:opacity-80 transition-opacity duration-300 group"
                  >
                    <img 
                      src="/images/providna2.png" 
                      alt="AiSajt Logo" 
                      className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <p className="text-gray-600">
                    {t.footerDesc}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">{t.services}</h4>
                  <ul className="space-y-2">
                    <li><Link to="/#services" className="text-gray-600 hover:text-violet-600 transition-colors duration-300" aria-label={language === 'sr' ? 'Web Dizajn' : 'Web Design'}>{language === 'sr' ? 'Web Dizajn' : 'Web Design'}</Link></li>
                    <li><Link to="/#services" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300" aria-label={language === 'sr' ? 'Baze Podataka' : 'Database Management'}>{language === 'sr' ? 'Baze Podataka' : 'Database Management'}</Link></li>
                    <li><Link to="/#services" className="text-gray-600 hover:text-pink-600 transition-colors duration-300" aria-label={language === 'sr' ? 'Online Marketing' : 'Online Marketing'}>{language === 'sr' ? 'Online Marketing' : 'Online Marketing'}</Link></li>
                    <li><Link to="/#services" className="text-gray-600 hover:text-violet-600 transition-colors duration-300" aria-label={language === 'sr' ? 'E-commerce' : 'E-commerce'}>{language === 'sr' ? 'E-commerce' : 'E-commerce'}</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">{t.company}</h4>
                  <ul className="space-y-2">
                    <li><Link to="/#video-section" className="text-gray-600 hover:text-violet-600 transition-colors duration-300" aria-label={t.aboutUs}>{t.aboutUs}</Link></li>
                    <li><Link to="/#why-us" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300" aria-label={t.portfolio}>{t.portfolio}</Link></li>
                    <li><Link to="/contact" className="text-gray-600 hover:text-pink-600 transition-colors duration-300" aria-label={t.contact}>{t.contact}</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">{t.contact}</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-violet-600" aria-hidden="true" />
                      <a 
                        href="mailto:office@aisajt.com"
                        onClick={() => trackContactInfoClick('email', 'office@aisajt.com', language)}
                        className="text-gray-600 hover:text-violet-600 transition-colors duration-300"
                        aria-label="Pošaljite email na office@aisajt.com"
                      >
                        office@aisajt.com
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                      <a 
                        href="tel:+381613091583"
                        onClick={() => trackContactInfoClick('phone', '+381613091583', language)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                        aria-label="Pozovite na broj +381 61 3091583"
                      >
                        +381 61 3091583
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-600" aria-hidden="true" />
                      <span className="text-gray-600">{language === 'sr' ? 'Beograd, Srbija' : 'Belgrade, Serbia'}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-violet-200 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} AiSajt.com | {language === 'sr' ? 'Profesionalna izrada web sajtova' : 'Professional web development'}
                  </p>
                  <div className="flex gap-6">
                    <Link 
                      to="/privacy" 
                      className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                      aria-label={language === 'sr' ? 'Politika privatnosti' : 'Privacy Policy'}
                    >
                      {language === 'sr' ? 'Privatnost' : 'Privacy'}
                    </Link>
                    <Link 
                      to="/terms" 
                      className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                      aria-label={language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
                    >
                      {language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
    </div>
  );
}

