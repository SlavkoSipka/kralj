import React, { createContext, useContext, useState } from 'react';

type Language = 'sr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  sr: {
    // Navigation
    'nav.home': 'Početna',
    'nav.location': 'Lokacija',
    'nav.about': 'O nama',
    'nav.contact': 'Kontakt',
    'nav.properties': 'Nekretnine',

    // Hero Section
    'hero.title': 'KRALJ RESIDENCE',
    'hero.subtitle': 'Ekskluzivni stambeni kompleks u najlepšem delu Vrnjačke Banje, gde se luksuz susreće sa prirodom',
    'hero.properties': 'Nekretnine',
    'hero.resort': 'Kralj Residence Resort',
    'hero.aqua': 'Kralj Residence Royal Aqua',

    // About Section
    'about.title': 'O nama',
    'about.subtitle': 'Kralj Residence',
    'about.description1': 'Kralj Residence je ogranak kompanije Kralj doo, koja već tri decenije uspešno posluje u Vrnjačkoj Banji. Sa iskustvom u ugostiteljstvu i turizmu, kao i radom u prestižnom hotelu Kralj koji je prisutan na tržištu skoro 20 godina, Kralj doo je stekao izuzetnu reputaciju za kvalitet i uslugu.',
    'about.description2': 'Od 2008. godine, ogranak Kralj Residence se specijalizovao za izgradnju luksuznih stambenih kompleksa i ekskluzivnih stanova. Naša posvećenost vrhunskom dizajnu, sigurnosti i udobnosti garantuje visok standard stanovanja koji zadovoljava potrebe savremenih kupaca.',
    'about.vision.title': 'Naša Vizija',
    'about.vision.description1': 'Naša vizija je da Kralj Residence postane sinonim za kvalitetnu gradnju i luksuz u Vrnjačkoj Banji. Nastojimo da svaka naša investicija doprinese unapređenju infrastrukture i životnog standarda, stvarajući domove koji su više od mesta za život.',
    'about.vision.description2': 'Kroz inovativne projekte i pažljivo odabrane lokacije, želimo da nastavimo da razvijamo prepoznatljiv brend koji inspiriše i zadovoljava naše klijente.',

    // Contact Section
    'contact.title': 'Kontakt',
    'contact.subtitle': 'Kontaktirajte Nas',
    'contact.description': 'Zainteresovani ste za neku od naših nekretnina? Pošaljite nam poruku i naš tim će vas kontaktirati u najkraćem mogućem roku.',
    'contact.form.name': 'Ime',
    'contact.form.lastname': 'Prezime',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Telefon',
    'contact.form.message': 'Poruka',
    'contact.form.submit': 'Pošaljite Poruku',
    'contact.form.sending': 'Slanje...',
    'contact.form.success': 'Poruka je uspešno poslata!',
    'contact.form.error': 'Došlo je do greške. Molimo pokušajte ponovo.',

    // Footer
    'footer.description': 'Kralj Residence predstavlja vrhunac luksuza i elegancije u Vrnjačkoj Banji. Naš kompleks nudi ekskluzivne nekretnine koje spajaju moderan dizajn sa prirodnim okruženjem.',
    'footer.quickLinks': 'Brzi Linkovi',
    'footer.contact': 'Kontakt',
    'footer.rights': '© 2024 Kralj Residence. Sva prava zadržana.',
    'footer.design': 'Dizajn i razvoj:',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.location': 'Location',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.properties': 'Properties',

    // Hero Section
    'hero.title': 'KRALJ RESIDENCE',
    'hero.subtitle': 'Exclusive residential complex in the most beautiful part of Vrnjačka Banja, where luxury meets nature',
    'hero.properties': 'Properties',
    'hero.resort': 'Kralj Residence Resort',
    'hero.aqua': 'Kralj Residence Royal Aqua',

    // About Section
    'about.title': 'About Us',
    'about.subtitle': 'Kralj Residence',
    'about.description1': 'Kralj Residence is a branch of Kralj doo company, which has been successfully operating in Vrnjačka Banja for three decades. With experience in hospitality and tourism, as well as working in the prestigious Hotel Kralj that has been present in the market for almost 20 years, Kralj doo has gained an exceptional reputation for quality and service.',
    'about.description2': 'Since 2008, the Kralj Residence branch has specialized in building luxury residential complexes and exclusive apartments. Our commitment to superior design, safety, and comfort guarantees a high standard of living that meets the needs of modern buyers.',
    'about.vision.title': 'Our Vision',
    'about.vision.description1': 'Our vision is for Kralj Residence to become synonymous with quality construction and luxury in Vrnjačka Banja. We strive for each of our investments to contribute to the improvement of infrastructure and living standards, creating homes that are more than just places to live.',
    'about.vision.description2': 'Through innovative projects and carefully selected locations, we want to continue developing a recognizable brand that inspires and satisfies our clients.',

    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Contact Us',
    'contact.description': 'Interested in one of our properties? Send us a message and our team will contact you as soon as possible.',
    'contact.form.name': 'Name',
    'contact.form.lastname': 'Last Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Message sent successfully!',
    'contact.form.error': 'An error occurred. Please try again.',

    // Footer
    'footer.description': 'Kralj Residence represents the pinnacle of luxury and elegance in Vrnjačka Banja. Our complex offers exclusive properties that combine modern design with natural surroundings.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.rights': '© 2024 Kralj Residence. All rights reserved.',
    'footer.design': 'Design and development by:',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.sr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};