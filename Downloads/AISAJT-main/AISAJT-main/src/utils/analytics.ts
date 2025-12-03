// Google Analytics & Facebook Pixel Helper Functions

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Track Google Analytics Event
 */
export const trackEvent = (
  eventName: string,
  params?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track Facebook Pixel Event
 */
export const trackFBEvent = (
  eventName: string,
  params?: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
  }
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

/**
 * ⭐ GLAVNI LEAD EVENT - Uspešno poslata kontakt forma
 */
export const trackLeadGeneration = (
  source: 'contact_page' | 'home_page',
  userName: string,
  language: string
) => {
  // Google Analytics
  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    event_label: `${source === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Success`,
    value: 1,
    currency: 'EUR',
    lead_source: source,
    language: language,
    user_name: userName
  });

  // Facebook Pixel
  trackFBEvent('Lead', {
    content_name: `${source === 'contact_page' ? 'Contact' : 'Home'} Form Submission`,
    content_category: 'Lead Generation',
    value: 1,
    currency: 'EUR'
  });

  console.log('✅ Lead tracked:', { source, userName, language });
};

/**
 * Track Form Interaction (kada korisnik počne da popunjava formu)
 */
export const trackFormInteraction = (
  fieldName: string,
  formLocation: 'contact_page' | 'home_page',
  language: string
) => {
  trackEvent('form_interaction', {
    event_category: 'Lead Generation',
    event_label: `${formLocation === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Started Filling ${fieldName}`,
    language: language
  });
};

/**
 * Track Form Submit Attempt
 */
export const trackFormSubmitAttempt = (
  formLocation: 'contact_page' | 'home_page',
  language: string
) => {
  trackEvent('form_submit_attempt', {
    event_category: 'Lead Generation',
    event_label: `${formLocation === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Submit Clicked`,
    language: language,
    page_path: window.location.pathname
  });
};

/**
 * Track Form Error
 */
export const trackFormError = (
  formLocation: 'contact_page' | 'home_page',
  language: string,
  errorMessage: string
) => {
  trackEvent('form_submit_error', {
    event_category: 'Lead Generation',
    event_label: `${formLocation === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Error`,
    language: language,
    error_message: errorMessage
  });
};

/**
 * Track CTA Button Click
 */
export const trackCTAClick = (
  buttonLabel: string,
  location: string,
  language: string
) => {
  trackEvent('cta_click', {
    event_category: 'Engagement',
    event_label: buttonLabel,
    location: location,
    language: language
  });
};

/**
 * Track Portfolio Project Click
 */
export const trackPortfolioClick = (
  projectName: string,
  projectUrl: string,
  language: string
) => {
  trackEvent('portfolio_click', {
    event_category: 'Engagement',
    event_label: projectName,
    project_url: projectUrl,
    language: language
  });
};

/**
 * Track Contact Info Click (email, phone)
 */
export const trackContactInfoClick = (
  contactType: 'email' | 'phone',
  value: string,
  language: string
) => {
  trackEvent('contact_info_click', {
    event_category: 'Engagement',
    event_label: `${contactType} - ${value}`,
    language: language
  });
};

/**
 * Track Navigation Click
 */
export const trackNavigationClick = (
  destination: string,
  language: string
) => {
  trackEvent('navigation_click', {
    event_category: 'Navigation',
    event_label: destination,
    language: language
  });
};

/**
 * Track Language Change
 */
export const trackLanguageChange = (
  from: string,
  to: string
) => {
  trackEvent('language_change', {
    event_category: 'User Preference',
    event_label: `${from} to ${to}`,
    from_language: from,
    to_language: to
  });
};

/**
 * Track Video Play
 */
export const trackVideoPlay = (
  videoTitle: string,
  videoId: string,
  language: string
) => {
  trackEvent('video_play', {
    event_category: 'Engagement',
    event_label: videoTitle,
    video_id: videoId,
    language: language
  });
};

