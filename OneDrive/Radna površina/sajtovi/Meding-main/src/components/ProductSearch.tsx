import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  Stats,
  Configure,
  ClearRefinements,
  CurrentRefinements,
  RangeInput,
  HitsPerPage,
} from 'react-instantsearch';
import { searchClient, PRODUCTS_INDEX } from '../lib/algolia';
import './ProductSearch.css';

interface Product {
  objectID: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  manufacturer_name?: string;
  vendor_name?: string;
  sku: string;
  instock: boolean;
  quantity: number;
  slug: string;
  alimsname?: string;
  class?: string;
  type?: string;
}

// Komponenta koja renderuje jedan rezultat
function Hit({ hit }: { hit: Product }) {
  return (
    <div className="product-card">
      {hit.image && (
        <img 
          src={hit.image} 
          alt={hit.name}
          className="product-image"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="product-info">
        <h3>{hit.name}</h3>
        {hit.alimsname && (
          <p className="alimsname">
            <strong>ALIMS:</strong> {hit.alimsname}
          </p>
        )}
        {hit.manufacturer_name && (
          <p className="manufacturer">
            <strong>Proizvođač:</strong> {hit.manufacturer_name}
          </p>
        )}
        {hit.vendor_name && (
          <p className="vendor">
            <strong>Dobavljač:</strong> {hit.vendor_name}
          </p>
        )}
        <p className="sku">
          <strong>SKU:</strong> {hit.sku || 'N/A'}
        </p>
        {hit.class && (
          <p className="class">
            <strong>Klasa:</strong> {hit.class}
          </p>
        )}
        {hit.description && (
          <p className="description">{hit.description}</p>
        )}
        <div className="product-footer">
          <span className="price">
            {hit.price ? `${hit.price.toFixed(2)} RSD` : 'Cena na upit'}
          </span>
          <span className={`stock ${hit.instock ? 'in-stock' : 'out-of-stock'}`}>
            {hit.instock 
              ? `Na stanju${hit.quantity ? `: ${hit.quantity}` : ''}` 
              : 'Nema na stanju'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductSearch() {
  return (
    <div className="search-container">
      <InstantSearch
        searchClient={searchClient}
        indexName={PRODUCTS_INDEX}
      >
        <Configure
          hitsPerPage={20}
        />
        
        <div className="search-header">
          <h1>Pretraga Medicinskih Proizvoda</h1>
          <p className="subtitle">Pretražite preko 52,000 proizvoda</p>
          
          <SearchBox
            placeholder="Pretražite proizvode, generičke nazive, SKU, proizvođače..."
            classNames={{
              root: 'search-box',
              input: 'search-input',
              submit: 'search-submit',
              reset: 'search-reset',
              submitIcon: 'search-icon',
              resetIcon: 'reset-icon',
            }}
          />
          
          <div className="search-stats">
            <Stats
              translations={{
                rootElementText({ nbHits, processingTimeMS }) {
                  return `${nbHits.toLocaleString('sr-RS')} proizvoda pronađeno (${processingTimeMS}ms)`;
                },
              }}
            />
            <HitsPerPage
              items={[
                { label: '20 po stranici', value: 20, default: true },
                { label: '40 po stranici', value: 40 },
                { label: '60 po stranici', value: 60 },
              ]}
            />
          </div>
        </div>

        <div className="search-layout">
          {/* Sidebar sa filterima */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h2>Filteri</h2>
              <ClearRefinements
                translations={{
                  resetButtonText: 'Obriši sve',
                }}
              />
            </div>
            
            <CurrentRefinements
              classNames={{
                root: 'current-refinements',
              }}
            />

            {/* Filter po dostupnosti */}
            <div className="filter-section">
              <h3>Dostupnost</h3>
              <RefinementList
                attribute="instock"
                transformItems={(items) =>
                  items.map((item) => ({
                    ...item,
                    label: item.label === 'true' ? 'Na stanju' : 'Nema na stanju',
                  }))
                }
              />
            </div>

            {/* Filter po proizvođaču */}
            <div className="filter-section">
              <h3>Proizvođač</h3>
              <RefinementList
                attribute="manufacturer_name"
                searchable
                searchablePlaceholder="Pretraži..."
                showMore
                limit={5}
                showMoreLimit={20}
                translations={{
                  noResultsText: 'Nema rezultata',
                }}
              />
            </div>

            {/* Filter po kategoriji */}
            <div className="filter-section">
              <h3>Kategorija</h3>
              <RefinementList
                attribute="category_name"
                searchable
                searchablePlaceholder="Pretraži..."
                showMore
                limit={5}
                showMoreLimit={20}
                translations={{
                  noResultsText: 'Nema rezultata',
                }}
              />
            </div>

            {/* Filter po dobavljaču */}
            <div className="filter-section">
              <h3>Dobavljač</h3>
              <RefinementList
                attribute="vendor_name"
                searchable
                searchablePlaceholder="Pretraži..."
                showMore
                limit={5}
                showMoreLimit={20}
                translations={{
                  noResultsText: 'Nema rezultata',
                }}
              />
            </div>

            {/* Filter po klasi */}
            <div className="filter-section">
              <h3>Klasa</h3>
              <RefinementList
                attribute="class"
                showMore
                limit={5}
                showMoreLimit={15}
              />
            </div>

            {/* Filter po tipu */}
            <div className="filter-section">
              <h3>Tip</h3>
              <RefinementList
                attribute="type"
                showMore
                limit={5}
                showMoreLimit={15}
              />
            </div>

            {/* Filter po ceni */}
            <div className="filter-section">
              <h3>Cena (RSD)</h3>
              <RangeInput
                attribute="price"
                translations={{
                  separatorElementText: 'do',
                  submitButtonText: 'Primeni',
                }}
              />
            </div>
          </aside>

          {/* Rezultati pretrage */}
          <main className="search-results">
            <Hits hitComponent={Hit} />
            <div className="pagination-container">
              <Pagination
                padding={2}
                showFirst={true}
                showLast={true}
                translations={{
                  firstPageItemText: '« Prva',
                  lastPageItemText: 'Poslednja »',
                  previousPageItemText: '‹ Prethodna',
                  nextPageItemText: 'Sledeća ›',
                }}
              />
            </div>
          </main>
        </div>
      </InstantSearch>
    </div>
  );
}

