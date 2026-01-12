import { supabase } from './supabase';

/**
 * Analytics Service - Prati sve korisničke akcije
 */
export const analytics = {
  /**
   * Track search query
   */
  trackSearch: async (query: string, resultCount: number) => {
    try {
      if (!query || query.trim().length === 0) return;

      // Log search
      await supabase.from('product_analytics').insert({
        event_type: 'search',
        query: query.trim(),
        metadata: { result_count: resultCount }
      });

      // Ako nema rezultata - важно за optimizaciju!
      if (resultCount === 0) {
        await supabase.from('no_results_searches').insert({
          query: query.trim()
        });
      }
    } catch (error) {
      console.error('Analytics error (trackSearch):', error);
    }
  },

  /**
   * Track product view (kad korisnik uđe na stranicu proizvoda)
   */
  trackProductView: async (productId: string, fromQuery?: string) => {
    try {
      await supabase.from('product_analytics').insert({
        product_id: parseInt(productId),
        event_type: 'view',
        query: fromQuery || null,
        metadata: { page: 'product_page' }
      });
    } catch (error) {
      console.error('Analytics error (trackProductView):', error);
    }
  },

  /**
   * Track product click (kad korisnik klikne na proizvod u rezultatima)
   */
  trackProductClick: async (
    productId: string, 
    query: string, 
    position: number
  ) => {
    try {
      await supabase.from('product_analytics').insert({
        product_id: parseInt(productId),
        event_type: 'click',
        query: query.trim(),
        metadata: { 
          position: position,
          page: 'search_results'
        }
      });
    } catch (error) {
      console.error('Analytics error (trackProductClick):', error);
    }
  },

  /**
   * Track purchase (za kasnije kad dodaš košaricu)
   */
  trackPurchase: async (productId: string, price?: number) => {
    try {
      await supabase.from('product_analytics').insert({
        product_id: parseInt(productId),
        event_type: 'purchase',
        metadata: { 
          price: price,
          currency: 'RSD'
        }
      });
    } catch (error) {
      console.error('Analytics error (trackPurchase):', error);
    }
  },

  /**
   * Track autocomplete selection
   */
  trackAutocompleteClick: async (productId: string, query: string, position: number) => {
    try {
      await supabase.from('product_analytics').insert({
        product_id: parseInt(productId),
        event_type: 'autocomplete_click',
        query: query.trim(),
        metadata: { 
          position: position,
          source: 'autocomplete'
        }
      });
    } catch (error) {
      console.error('Analytics error (trackAutocompleteClick):', error);
    }
  }
};

/**
 * Debounce funkcija - sprečava spam tracking
 */
let searchDebounceTimer: ReturnType<typeof setTimeout>;
export const debouncedTrackSearch = (query: string, resultCount: number, delay = 1000) => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    analytics.trackSearch(query, resultCount);
  }, delay);
};

