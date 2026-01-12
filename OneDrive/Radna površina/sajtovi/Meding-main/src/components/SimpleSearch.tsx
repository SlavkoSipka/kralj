import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { analytics } from '../lib/analytics';
import './SimpleSearch.css';

// Check if Algolia credentials are set
const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || 'dummy-app-id';
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || 'dummy-search-key';
const ALGOLIA_CONFIGURED = import.meta.env.VITE_ALGOLIA_APP_ID && import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

if (!ALGOLIA_CONFIGURED) {
  console.warn('⚠️ UPOZORENJE: Algolia environment varijable nisu postavljene!');
  console.warn('Pretraga neće raditi dok ne konfigurišete VITE_ALGOLIA_APP_ID i VITE_ALGOLIA_SEARCH_KEY');
}

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

interface Product {
  objectID: string;
  name: string;
  manufacturer_name?: string;
  alimsname?: string;
  sku: string;
}

interface Generic {
  objectID: string;
  idgeneric: number;
  name: string;
  alimsname?: string;
  category_name?: string;
  product_count?: number;
}

export default function SimpleSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [genericSuggestions, setGenericSuggestions] = useState<Generic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pretraga dok korisnik kuca (Multi-index: Generics + Products)
  const handleSearchChange = async (value: string) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setGenericSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Check if Algolia is configured
      if (!ALGOLIA_CONFIGURED) {
        console.warn('Algolia not configured, skipping search');
        setSuggestions([]);
        setGenericSuggestions([]);
        setIsLoading(false);
        return;
      }

      // 🔥 MULTI-INDEX SEARCH: Pretraži generics + products paralelno
      const { results } = await searchClient.search({
        requests: [
          {
            indexName: 'generics',
            query: value,
            hitsPerPage: 4, // Top 4 generika
          },
          {
            indexName: 'products',
            query: value,
            hitsPerPage: 6, // Top 6 proizvoda
          },
        ],
      });

      // Generics iz prvog index-a (može biti prazan ako index ne postoji)
      const genericHits = ('hits' in results[0] ? results[0].hits : []) as Generic[];
      setGenericSuggestions(genericHits);

      // Products iz drugog index-a
      const productHits = ('hits' in results[1] ? results[1].hits : []) as Product[];
      setSuggestions(productHits);

      console.log(`🔍 Search: ${genericHits.length} generics, ${productHits.length} products`);
    } catch (error: any) {
      console.error('Search error:', error);
      // If generics index doesn't exist, just show products
      if (error?.message?.includes('generics')) {
        console.warn('Generics index not found, searching only products...');
        try {
          const { results } = await searchClient.search({
            requests: [
              {
                indexName: 'products',
                query: value,
                hitsPerPage: 6,
              },
            ],
          });
          const productHits = ('hits' in results[0] ? results[0].hits : []) as Product[];
          setSuggestions(productHits);
          setGenericSuggestions([]);
        } catch (fallbackError) {
          console.error('Fallback search error:', fallbackError);
          setSuggestions([]);
          setGenericSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setGenericSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Kad klikne Enter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Prebroj rezultate za tracking
      try {
        const { results } = await searchClient.search({
          requests: [
            {
              indexName: 'products',
              query: query,
              hitsPerPage: 1, // Trebaju nam samo count
            },
          ],
        });
        const resultCount = ('nbHits' in results[0] && results[0].nbHits !== undefined ? results[0].nbHits : 0);
        
        // Track search event
        analytics.trackSearch(query.trim(), resultCount);
      } catch (error) {
        console.error('Error tracking search:', error);
      }
      
      // Navigate to results
      navigate(`/rezultati?q=${encodeURIComponent(query)}`);
    }
  };

  // Kad klikne na generic karticu
  const handleGenericClick = (generic: Generic) => {
    // Track generic click
    analytics.trackSearch(generic.name, generic.product_count || 0);
    
    // Navigate to results filtered by generic
    navigate(`/rezultati?generic=${generic.idgeneric}&q=${encodeURIComponent(generic.name)}`);
  };

  // Kad klikne na preporuku proizvoda
  const handleSuggestionClick = (product: Product, index: number) => {
    // Track autocomplete click
    analytics.trackAutocompleteClick(product.objectID, query, index);
    
    // Navigate sa query parametrom za tracking na product page
    navigate(`/proizvod/${product.objectID}?from=${encodeURIComponent(query)}`);
  };

  return (
    <div className="simple-search-container">
      {/* Hero Section with Search */}
      <div className="hero-section">
        <div className="search-content">
          {/* Headline */}
          <h1 className="hero-headline">
            Najveća ponuda medicinske opreme u Srbiji
          </h1>
          <p className="hero-subheadline">
            Pretražite proizvode od svih dobavljača u Srbiji
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-box">
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Unesite naziv proizvoda, SKU ili proizvođača..."
                className="search-input"
                autoFocus
              />
              {isLoading && <div className="loading-spinner"></div>}
              
              {/* Search Button */}
              <button type="submit" className="search-button">
                Pretraži
              </button>
            </div>

            {/* Suggestions Dropdown with Generics + Products */}
            {(genericSuggestions.length > 0 || suggestions.length > 0) && (
              <div className="suggestions-dropdown">
                {/* 🏷️ GENERIC KARTICE (kao Amazon kategorije) */}
                {genericSuggestions.length > 0 && (
                  <div className="generic-suggestions-section">
                    <div className="section-header">
                      <span className="section-icon">🏷️</span>
                      <span className="section-title">Generički Nazivi</span>
                    </div>
                    <div className="generic-cards">
                      {genericSuggestions.map((generic) => (
                        <div
                          key={generic.objectID}
                          className="generic-card"
                          onClick={() => handleGenericClick(generic)}
                        >
                          <div className="generic-card-icon">💊</div>
                          <div className="generic-card-content">
                            <div className="generic-card-name">{generic.name}</div>
                            {generic.alimsname && (
                              <div className="generic-card-alims">{generic.alimsname}</div>
                            )}
                            {generic.product_count && generic.product_count > 0 && (
                              <div className="generic-card-count">
                                {generic.product_count} proizvoda
                              </div>
                            )}
                          </div>
                          <div className="generic-card-arrow">→</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 📦 PROIZVODI */}
                {suggestions.length > 0 && (
                  <div className="product-suggestions-section">
                    <div className="section-header">
                      <span className="section-icon">📦</span>
                      <span className="section-title">Proizvodi</span>
                    </div>
                    {suggestions.map((product, index) => (
                      <div
                        key={product.objectID}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(product, index)}
                      >
                        <div className="suggestion-icon">🔍</div>
                        <div className="suggestion-content">
                          <div className="suggestion-name">{product.name}</div>
                          <div className="suggestion-meta">
                            {product.manufacturer_name && (
                              <span>{product.manufacturer_name}</span>
                            )}
                            {product.alimsname && product.manufacturer_name && ' • '}
                            {product.alimsname && (
                              <span className="alimsname">{product.alimsname}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Info tekst */}
          <p className="info-text">
            <strong>Enter</strong> za sve rezultate ili izaberite iz predloga
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">📦</div>
            <h3 className="feature-title">52.000+ Proizvoda</h3>
            <p className="feature-description">
              Najveća baza medicinske opreme na jednom mestu
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Brza pretraga</h3>
            <p className="feature-description">
              Pronađite željeni proizvod u sekundi uz naprednu pretragu
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <h3 className="feature-title">Verifikovani dobavljači</h3>
            <p className="feature-description">
              Svi proizvodi od proverenih i licenciranih dobavljača
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

