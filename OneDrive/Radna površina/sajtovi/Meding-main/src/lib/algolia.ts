import { liteClient as algoliasearch } from 'algoliasearch/lite';

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || 'dummy-app-id';
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || 'dummy-search-key';
const ALGOLIA_CONFIGURED = import.meta.env.VITE_ALGOLIA_APP_ID && import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

if (!ALGOLIA_CONFIGURED) {
  console.warn('⚠️ UPOZORENJE: Algolia nije konfigurisan za algolia.ts modul');
}

export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

export const PRODUCTS_INDEX = 'products';

