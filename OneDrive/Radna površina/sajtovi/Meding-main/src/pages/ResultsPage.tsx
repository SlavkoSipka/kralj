import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import './ResultsPage.css';

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || 'dummy-app-id';
const ALGOLIA_SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || 'dummy-search-key';
const ALGOLIA_CONFIGURED = import.meta.env.VITE_ALGOLIA_APP_ID && import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

interface Product {
  objectID: string;
  name: string;
  manufacturer_name?: string;
  vendor_name?: string;
  alimsname?: string;
  generic_name?: string;
  price?: number;
  instock: boolean;
  sku?: string;
}

interface Generic {
  objectID: string;
  idgeneric: number;
  name: string;
  alimsname?: string;
  category_name?: string;
  product_count?: number;
}

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'name_asc';

export default function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const genericFilter = searchParams.get('generic');
  
  const [results, setResults] = useState<Product[]>([]);
  const [generics, setGenerics] = useState<Generic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalHits, setTotalHits] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState({
    manufacturers: [] as string[],
    vendors: [] as string[],
    inStock: false,
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const resultsPerPage = 24;

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, currentPage, sortBy, genericFilter]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      let genericResults: Generic[] = [];
      let productResults: Product[] = [];
      let total = 0;

      // IF GENERIC FILTER IS ACTIVE: Use Supabase directly (more reliable)
      if (genericFilter) {
        console.log(`🔍 Filtering by generic ${genericFilter} via Supabase`);
        
        const offset = (currentPage - 1) * resultsPerPage;
        
        let dbQuery = supabase
          .from('products')
          .select(`
            idproducts,
            name,
            alimsname,
            price,
            instock,
            sku,
            manufacturer:idmanufacturer(name),
            vendor:idvendor(name),
            generic:idgeneric(name)
          `, { count: 'exact' })
          .eq('idgeneric', parseInt(genericFilter));

        // Apply sorting
        if (sortBy === 'price_asc') {
          dbQuery = dbQuery.order('price', { ascending: true, nullsFirst: false });
        } else if (sortBy === 'price_desc') {
          dbQuery = dbQuery.order('price', { ascending: false, nullsFirst: false });
        } else if (sortBy === 'name_asc') {
          dbQuery = dbQuery.order('name', { ascending: true });
        } else {
          dbQuery = dbQuery.order('name', { ascending: true }); // Default
        }

        const { data: supabaseProducts, error, count } = await dbQuery.range(offset, offset + resultsPerPage - 1);

        if (!error && supabaseProducts) {
          productResults = supabaseProducts.map(p => ({
            objectID: p.idproducts.toString(),
            name: p.name || '',
            manufacturer_name: (p.manufacturer as any)?.name,
            vendor_name: (p.vendor as any)?.name,
            alimsname: p.alimsname,
            generic_name: (p.generic as any)?.name,
            price: p.price,
            instock: p.instock || false,
            sku: p.sku
          }));
          total = count || 0;
          console.log(`✅ Found ${productResults.length} products (total: ${total})`);
        } else {
          console.error('Supabase error:', error);
        }
      } 
      // NO GENERIC FILTER: Use Algolia for search
      else {
        if (!ALGOLIA_CONFIGURED) {
          console.warn('Algolia not configured');
          setResults([]);
          setGenerics([]);
          setIsLoading(false);
          return;
        }

        const requests = [
          {
            indexName: 'generics',
            query: query,
            hitsPerPage: 6,
          },
          {
            indexName: 'products',
            query: query,
            hitsPerPage: resultsPerPage,
            page: currentPage - 1,
          }
        ];

        const { results: searchResults } = await searchClient.search({ requests });

        // Parse generics
        genericResults = ('hits' in searchResults[0] ? searchResults[0].hits : []) as Generic[];
        
        // Parse products
        productResults = ('hits' in searchResults[1] ? searchResults[1].hits : []) as Product[];
        total = 'nbHits' in searchResults[1] && searchResults[1].nbHits !== undefined ? searchResults[1].nbHits : 0;
      }

      // Sort products if needed (only for Algolia results, Supabase already sorted)
      if (!genericFilter && sortBy !== 'relevance') {
        productResults = sortProducts(productResults, sortBy);
      }

      setGenerics(genericResults);
      setResults(productResults);
      setTotalHits(total);
    } catch (error: any) {
      console.error('Search error:', error);
      // Fallback to products only
      if (error?.message?.includes('generics')) {
        try {
          const { results: fallbackResults } = await searchClient.search({
            requests: [{
              indexName: 'products',
              query: query,
              hitsPerPage: resultsPerPage,
              page: currentPage - 1,
            }],
          });
          const productResults = ('hits' in fallbackResults[0] ? fallbackResults[0].hits : []) as Product[];
          setResults(sortProducts(productResults, sortBy));
          setTotalHits('nbHits' in fallbackResults[0] && fallbackResults[0].nbHits !== undefined ? fallbackResults[0].nbHits : 0);
          setGenerics([]);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setResults([]);
          setGenerics([]);
        }
      } else {
        setResults([]);
        setGenerics([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sortProducts = (products: Product[], sort: SortOption): Product[] => {
    const sorted = [...products];
    switch (sort) {
      case 'price_asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleGenericClick = (generic: Generic) => {
    navigate(`/rezultati?generic=${generic.idgeneric}&q=${encodeURIComponent(generic.name)}`);
    setCurrentPage(1);
  };

  const clearGenericFilter = () => {
    navigate(`/rezultati?q=${encodeURIComponent(query)}`);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalHits / resultsPerPage);

  return (
    <div className="results-page">
      <Navbar />
      
      <div className="results-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Početna</Link>
          <span className="separator">›</span>
          <span className="current">Pretraga: "{query}"</span>
        </div>

        {/* Generic Filter Badge */}
        {genericFilter && (
          <div className="active-filter-badge">
            <span className="filter-label">Filtriranje po generiku:</span>
            <span className="filter-value">{query}</span>
            <button onClick={clearGenericFilter} className="clear-filter">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
              Ukloni filter
            </button>
          </div>
        )}

        {/* Generic Cards Section */}
        {!isLoading && !genericFilter && generics.length > 0 && (
          <div className="generics-section">
            <div className="section-header">
              <h2>🏷️ Generički Nazivi ({generics.length})</h2>
              <p>Kliknite na karticu da vidite sve proizvode za izabrani generički naziv</p>
            </div>
            <div className="generics-grid">
              {generics.map((generic) => (
                <div
                  key={generic.objectID}
                  className="generic-card-large"
                  onClick={() => handleGenericClick(generic)}
                >
                  <div className="generic-icon">💊</div>
                  <div className="generic-info">
                    <h3 className="generic-name">{generic.name}</h3>
                    {generic.alimsname && (
                      <p className="generic-alims">{generic.alimsname}</p>
                    )}
                    {generic.category_name && (
                      <span className="generic-category">{generic.category_name}</span>
                    )}
                  </div>
                  <div className="generic-count">
                    {generic.product_count || 0} proizvoda →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Header with Sort */}
        <div className="results-controls">
          <div className="results-info">
            <h2>
              {genericFilter ? 'Proizvodi' : 'Svi Rezultati'}
              <span className="count">({totalHits})</span>
            </h2>
          </div>
          
          <div className="sort-controls">
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
              </svg>
              Filteri
            </button>

            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
            >
              <option value="relevance">Relevantnost</option>
              <option value="price_asc">Cena: Najniža</option>
              <option value="price_desc">Cena: Najviša</option>
              <option value="name_asc">Naziv: A-Z</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Pretraga u toku...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && results.length === 0 && (
          <div className="no-results-state">
            <div className="no-results-icon">🔍</div>
            <h3>Nema rezultata za "{query}"</h3>
            <p>Pokušajte sa drugim ključnim rečima ili proverite pravopis</p>
            <Link to="/" className="btn-back-home">
              Nazad na početnu
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && results.length > 0 && (
          <>
            <div className="products-grid">
              {results.map((product, index) => (
                <Link 
                  to={`/proizvod/${product.objectID}?from=${encodeURIComponent(query)}&pos=${index}`} 
                  key={product.objectID}
                  className="product-card-modern"
                >
                  <div className="product-header">
                    <span className={`stock-badge ${product.instock ? 'in-stock' : 'out-stock'}`}>
                      {product.instock ? '✓ Na stanju' : '✗ Nema na stanju'}
                    </span>
                  </div>
                  
                  <div className="product-body">
                    <h3 className="product-title">{product.name}</h3>
                    
                    <div className="product-details">
                      {product.manufacturer_name && (
                        <p className="detail-item">
                          <span className="detail-label">Proizvođač:</span>
                          <span className="detail-value">{product.manufacturer_name}</span>
                        </p>
                      )}
                      {product.vendor_name && (
                        <p className="detail-item">
                          <span className="detail-label">Dobavljač:</span>
                          <span className="detail-value">{product.vendor_name}</span>
                        </p>
                      )}
                      {product.alimsname && (
                        <p className="detail-item alims">
                          <span className="detail-label">ALIMS:</span>
                          <span className="detail-value">{product.alimsname}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="product-footer">
                    {product.price && product.price > 0 ? (
                      <div className="price-tag">
                        <span className="price-amount">{product.price.toFixed(2)}</span>
                        <span className="price-currency">RSD</span>
                      </div>
                    ) : (
                      <div className="price-tag price-request">
                        <span className="price-amount">Kontaktirajte nas</span>
                      </div>
                    )}
                    <button className="view-btn">Detalji →</button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Prethodna
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sledeća →
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="results-summary">
              Prikazano {((currentPage - 1) * resultsPerPage) + 1}-{Math.min(currentPage * resultsPerPage, totalHits)} od {totalHits} rezultata
            </div>
          </>
        )}
      </div>
    </div>
  );
}
