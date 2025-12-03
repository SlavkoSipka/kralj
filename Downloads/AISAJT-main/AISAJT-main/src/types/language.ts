export type Language = 'sr' | 'en';

export interface Translation {
  // Navigation
  services: string;
  pricing: string;
  portfolio: string;
  contact: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButton: string;
  scheduleConsultation: string;
  
  // Features
  fastDevelopment: string;
  fastDevelopmentDesc: string;
  aiTechnology: string;
  aiTechnologyDesc: string;
  guaranteedQuality: string;
  guaranteedQualityDesc: string;
  
  // Services section
  professionalWebDev: string;
  professionalWebDevDesc: string;
  professionalAiWebDesign: string;
  professionalAiWebDesignDesc: string;
  aiSeoOptimization: string;
  aiSeoOptimizationDesc: string;
  aiSupport247: string;
  aiSupport247Desc: string;
  
  // Digital Marketing
  digitalMarketingTitle: string;
  digitalMarketingDesc: string;
  socialMediaManagement: string;
  socialMediaManagementDesc: string;
  instagramManagement: string;
  contentCreation: string;
  engagementStrategy: string;
  professionalPhotos: string;
  videoProduction: string;
  copywriting: string;
  mediaProduction: string;
  professionalPhotography: string;
  professionalPhotographyDesc: string;
  productsServices: string;
  interiorsExteriors: string;
  eventsPromotions: string;
  videoProductionTitle: string;
  promoVideo: string;
  advertisements: string;
  editing: string;
  
  // Pricing
  affordableWebDev: string;
  affordableWebDevDesc: string;
  pricingTitle: 'Most Affordable Web Development',
  pricingDescription: 'Professional websites at the most affordable prices with AI technology',
  pricingTitle: 'Najpovoljnija Izrada Web Sajtova',
  pricingDescription: 'Profesionalni web sajtovi po najpovoljnijim cenama uz AI tehnologiju',
  pricingTitle: string;
  pricingDescription: string;
  ecommerceWebsite: string;
  ecommerceFeatures: {
    onlineStore: string;
    paymentSystem: string;
    productManagement: string;
    seoOptimization: string;
    socialMediaIntegration: string;
    premiumSupport: string;
  };
  website: string;
  websiteFeatures: {
    responsiveDesign: string;
    upToPages: string;
    contactForm: string;
    seoOptimization: string;
    sslCertificate: string;
    hostingSetup: string;
  };
  qrMenu: string;
  qrMenuFeatures: {
    digitalMenuQr: string;
    unlimitedDishes: string;
    dishPhotos: string;
    multiLanguage: string;
    instantUpdate: string;
    responsiveDesign: string;
  };
  mostPopular: string;
  choose: string;
  
  // Portfolio
  portfolioTitle: string;
  portfolioDesc: string;
  viewWebsite: string;
  
  // Contact
  contactTitle: string;
  contactDesc: string;
  name: string;
  email: string;
  phone: string;
  send: string;
  sending: string;
  whyChooseUs: string;
  
  // Footer
  footerDesc: string;
  company: string;
  aboutUs: string;
  
  // Success message
  thankYou: string;
  consultationScheduled: string;
  
  // Time indicators
  hours24: string;
  days1to2: string;
  day1: string;
  monthly: string;
}

export const translations: Record<Language, Translation> = {
  sr: {
    // Navigation
    services: 'Usluge',
    pricing: 'Cene',
    portfolio: 'Portfolio',
    contact: 'Kontakt',
    
    // Hero section
    heroTitle: 'Za 24h',
    heroSubtitle: 'Zakažite konsultacije i dobijte sajt za 24h',
    heroDescription: 'Zakažite besplatne konsultacije danas i otkrijte našu kompletnu ponudu usluga - od izrade web sajtova i digitalnog marketinga do profesionalnog fotografisanja i vođenja društvenih mreža. Zajedno ćemo kreirati strategiju koja najbolje odgovara vašem brendu.',
    heroButton: 'Zakažite Besplatne Konsultacije',
    scheduleConsultation: 'Zakažite besplatne konsultacije danas!',
    
    // Features
    fastDevelopment: 'Brza Izrada',
    fastDevelopmentDesc: 'Vaš sajt je spreman u roku od 24 časa',
    aiTechnology: 'AI Tehnologija',
    aiTechnologyDesc: 'Najmodernija AI rešenja za vaš profesionalni sajt',
    guaranteedQuality: 'Garantovan Kvalitet',
    guaranteedQualityDesc: '100% zadovoljstvo ili povrat novca',
    
    // Services section
    professionalWebDev: 'Profesionalna Izrada Web Sajtova',
    professionalWebDevDesc: 'Brza i profesionalna izrada web sajtova uz pomoć najnovije AI tehnologije',
    professionalAiWebDesign: 'Profesionalni AI Web Dizajn',
    professionalAiWebDesignDesc: 'Naš napredni AI sistem kreira moderne, jedinstvene i optimizovane web sajtove.',
    aiSeoOptimization: 'AI SEO Optimizacija',
    aiSeoOptimizationDesc: 'AI tehnologija optimizuje vaš web sajt za bolje rangiranje na pretraživačima.',
    aiSupport247: '24/7 AI Podrška',
    aiSupport247Desc: 'AI chatbot dostupan non-stop za podršku.',
    
    // Digital Marketing
    digitalMarketingTitle: 'Digital Marketing i Medija Produkcija',
    digitalMarketingDesc: 'Kompletna usluga digitalnog marketinga i profesionalne produkcije za vaš brend',
    socialMediaManagement: 'Social Media Management',
    socialMediaManagementDesc: 'Profesionalno vođenje društvenih mreža uz kreiranje engaging sadržaja i strategije rasta. Naš tim kreira autentičan sadržaj koji povezuje vašu publiku sa brendom.',
    instagramManagement: 'Instagram Management',
    contentCreation: 'Content Creation',
    engagementStrategy: 'Engagement strategija',
    professionalPhotos: 'Profesionalne fotografije',
    videoProduction: 'Video produkcija',
    copywriting: 'Copywriting',
    mediaProduction: 'Media Production',
    professionalPhotography: 'Profesionalno Fotografisanje',
    professionalPhotographyDesc: '',
    productsServices: 'Proizvodi i usluge',
    interiorsExteriors: 'Enterijeri i eksterijeri',
    eventsPromotions: 'Događaji i promocije',
    videoProductionTitle: 'Video Produkcija',
    promoVideo: 'Promo video',
    advertisements: 'Reklame',
    editing: 'Montaža',
    
    // Pricing
    affordableWebDev: 'Najpovoljnija Izrada Web Sajtova',
    affordableWebDevDesc: 'Profesionalni web sajtovi po najpovoljnijim cenama uz AI tehnologiju',
    ecommerceWebsite: 'E-commerce Web Sajt',
    ecommerceFeatures: {
      onlineStore: 'Online prodavnica',
      paymentSystem: 'Sistem plaćanja',
      productManagement: 'Upravljanje proizvodima',
      seoOptimization: 'SEO optimizacija',
      socialMediaIntegration: 'Integracija sa društvenim mrežama',
      premiumSupport: 'Premium podrška'
    },
    website: 'Web Sajt',
    websiteFeatures: {
      responsiveDesign: 'Responzivan dizajn',
      upToPages: 'Do 5 stranica',
      contactForm: 'Kontakt forma',
      seoOptimization: 'SEO optimizacija',
      sslCertificate: 'SSL sertifikat',
      hostingSetup: 'Hosting setup'
    },
    qrMenu: 'QR Online Meni',
    qrMenuFeatures: {
      digitalMenuQr: 'Digitalni meni sa QR kodom',
      unlimitedDishes: 'Neograničen broj jela',
      dishPhotos: 'Fotografije jela',
      multiLanguage: 'Višejezična podrška',
      instantUpdate: 'Instant ažuriranje',
      responsiveDesign: 'Responzivan dizajn'
    },
    mostPopular: 'Najpopularnije',
    choose: 'Izaberite',
    
    // Portfolio
    portfolioTitle: 'Portfolio AI Web Sajtova',
    portfolioDesc: 'Pogledajte naše najnovije web sajtove kreirane uz pomoć AI tehnologije',
    viewWebsite: 'Pogledaj Sajt',
    
    // Contact
    contactTitle: 'Zakažite Besplatne Konsultacije',
    contactDesc: 'Popunite formu i započnite vaš projekat odmah',
    name: 'Ime',
    email: 'Email',
    phone: 'Broj telefona',
    send: 'Pošaljite',
    sending: 'Slanje...',
    whyChooseUs: 'Zašto izabrati nas?',
    
    // Footer
    footerDesc: 'Profesionalna izrada web sajtova uz pomoć najsavremenije AI tehnologije. Brza i kvalitetna izrada modernih sajtova.',
    company: 'Kompanija',
    aboutUs: 'O nama',
    
    // Success message
    thankYou: 'Hvala na poverenju!',
    consultationScheduled: 'Uspešno ste zakazali konsultacije.\nJavićemo vam se u najkraćem mogućem roku!',
    
    // Time indicators
    hours24: '24h',
    days1to2: '1-2 dana',
    day1: '1 dan',
    monthly: 'mesečno'
  },
  en: {
    // Navigation
    services: 'Services',
    pricing: 'Pricing',
    portfolio: 'Portfolio',
    contact: 'Contact',
    
    // Hero section
    heroTitle: 'In 24h',
    heroSubtitle: 'Schedule consultation and get your website in 24h',
    heroDescription: 'Schedule free consultation today and discover our complete service offering - from web development and digital marketing to professional photography and social media management. Together we\'ll create a strategy that best fits your brand.',
    heroButton: 'Schedule Free Consultation',
    scheduleConsultation: 'Schedule free consultation today!',
    
    // Features
    fastDevelopment: 'Fast Development',
    fastDevelopmentDesc: 'Your website is ready within 24 hours',
    aiTechnology: 'AI Technology',
    aiTechnologyDesc: 'Most advanced AI solutions for your professional website',
    guaranteedQuality: 'Guaranteed Quality',
    guaranteedQualityDesc: '100% satisfaction or money back',
    
    // Services section
    professionalWebDev: 'Professional Web Development',
    professionalWebDevDesc: 'Fast and professional web development using the latest AI technology',
    professionalAiWebDesign: 'Professional AI Web Design',
    professionalAiWebDesignDesc: 'Our advanced AI system creates modern, unique and optimized websites.',
    aiSeoOptimization: 'AI SEO Optimization',
    aiSeoOptimizationDesc: 'AI technology optimizes your website for better search engine rankings.',
    aiSupport247: '24/7 AI Support',
    aiSupport247Desc: 'AI chatbot available 24/7 for support.',
    
    // Digital Marketing
    digitalMarketingTitle: 'Digital Marketing & Media Production',
    digitalMarketingDesc: 'Complete digital marketing service and professional production for your brand',
    socialMediaManagement: 'Social Media Management',
    socialMediaManagementDesc: 'Professional social media management with engaging content creation and growth strategies. Our team creates authentic content that connects your audience with your brand.',
    instagramManagement: 'Instagram Management',
    contentCreation: 'Content Creation',
    engagementStrategy: 'Engagement strategy',
    professionalPhotos: 'Professional photography',
    videoProduction: 'Video production',
    copywriting: 'Copywriting',
    mediaProduction: 'Media Production',
    professionalPhotography: 'Professional Photography',
    professionalPhotographyDesc: '',
    productsServices: 'Products and services',
    interiorsExteriors: 'Interiors and exteriors',
    eventsPromotions: 'Events and promotions',
    videoProductionTitle: 'Video Production',
    promoVideo: 'Promo video',
    advertisements: 'Advertisements',
    editing: 'Editing',
    
    // Pricing
    affordableWebDev: 'Most Affordable Web Development',
    affordableWebDevDesc: 'Professional websites at the most affordable prices with AI technology',
    ecommerceWebsite: 'E-commerce Website',
    ecommerceFeatures: {
      onlineStore: 'Online store',
      paymentSystem: 'Payment system',
      productManagement: 'Product management',
      seoOptimization: 'SEO optimization',
      socialMediaIntegration: 'Social media integration',
      premiumSupport: 'Premium support'
    },
    website: 'Website',
    websiteFeatures: {
      responsiveDesign: 'Responsive design',
      upToPages: 'Up to 5 pages',
      contactForm: 'Contact form',
      seoOptimization: 'SEO optimization',
      sslCertificate: 'SSL certificate',
      hostingSetup: 'Hosting setup'
    },
    qrMenu: 'QR Online Menu',
    qrMenuFeatures: {
      digitalMenuQr: 'Digital menu with QR code',
      unlimitedDishes: 'Unlimited dishes',
      dishPhotos: 'Dish photos',
      multiLanguage: 'Multi-language support',
      instantUpdate: 'Instant updates',
      responsiveDesign: 'Responsive design'
    },
    mostPopular: 'Most Popular',
    choose: 'Choose',
    
    // Portfolio
    portfolioTitle: 'AI Website Portfolio',
    portfolioDesc: 'Check out our latest websites created with AI technology',
    viewWebsite: 'View Website',
    
    // Contact
    contactTitle: 'Schedule Free Consultation',
    contactDesc: 'Fill out the form and start your project immediately',
    name: 'Name',
    email: 'Email',
    phone: 'Phone number',
    send: 'Send',
    sending: 'Sending...',
    whyChooseUs: 'Why choose us?',
    
    // Footer
    footerDesc: 'Professional web development using the most advanced AI technology. Fast and quality development of modern websites.',
    company: 'Company',
    aboutUs: 'About us',
    
    // Success message
    thankYou: 'Thank you for your trust!',
    consultationScheduled: 'You have successfully scheduled a consultation.\nWe will contact you as soon as possible!',
    
    // Time indicators
    hours24: '24h',
    days1to2: '1-2 days',
    day1: '1 day',
    monthly: 'monthly'
  }
};