import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { analytics } from '../lib/analytics';
import Navbar from '../components/Navbar';
import './ProductPage.css';

interface Product {
  idproducts: number;
  name: string;
  description?: string;
  sku?: string;
  alimsname?: string;
  price?: number;
  instock: boolean;
  quantity?: number;
  class?: string;
  type?: string;
  manufacturer?: { name: string };
  vendor?: { name: string };
  generic?: { name: string };
  category?: { name: string };
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const trackedId = useRef<string | null>(null);

  useEffect(() => {
    // Loguj samo ako je nov ID (sprečava duplicate u StrictMode)
    if (id && id !== trackedId.current) {
      trackedId.current = id;
      
      // Track product view (samo view, ne click jer je već logovan u SimpleSearch)
      const fromQuery = searchParams.get('from');
      analytics.trackProductView(id, fromQuery || undefined);
      
      fetchProduct(id);
    }
  }, [id, searchParams]);

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const { data, error} = await supabase
        .from('products')
        .select(`
          *,
          manufacturer:idmanufacturer(name),
          vendor:idvendor(name),
          generic:idgeneric(name),
          category:category_id(name)
        `)
        .eq('idproducts', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="product-page">
        <div className="loading">Učitavanje...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="not-found">
          <h2>Proizvod nije pronađen</h2>
          <Link to="/" className="back-link">← Nazad na pretragu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <Navbar />
      
      <div className="product-container">
        <button onClick={() => navigate(-1)} className="back-btn">← Nazad</button>
        <div className="product-content">
          <h1 className="product-title">{product.name}</h1>

          {product.alimsname && (
            <p className="product-alims">
              <strong>ALIMS:</strong> {product.alimsname}
            </p>
          )}

          <div className="product-info-grid">
            {product.manufacturer?.name && (
              <div className="info-item">
                <span className="info-label">Proizvođač:</span>
                <span className="info-value">{product.manufacturer.name}</span>
              </div>
            )}

            {product.vendor?.name && (
              <div className="info-item">
                <span className="info-label">Dobavljač:</span>
                <span className="info-value">{product.vendor.name}</span>
              </div>
            )}

            {product.sku && (
              <div className="info-item">
                <span className="info-label">SKU:</span>
                <span className="info-value">{product.sku}</span>
              </div>
            )}

            {product.class && (
              <div className="info-item">
                <span className="info-label">Klasa:</span>
                <span className="info-value">{product.class}</span>
              </div>
            )}

            {product.category?.name && (
              <div className="info-item">
                <span className="info-label">Kategorija:</span>
                <span className="info-value">{product.category.name}</span>
              </div>
            )}

            {product.generic?.name && (
              <div className="info-item">
                <span className="info-label">Generički naziv:</span>
                <span className="info-value">{product.generic.name}</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="product-description">
              <h3>Opis</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="product-purchase">
            <div className="price-section">
              {product.price ? (
                <span className="price">{product.price.toFixed(2)} RSD</span>
              ) : (
                <span className="price-inquiry">Cena na upit</span>
              )}
              <span className={`stock ${product.instock ? 'in-stock' : 'out-stock'}`}>
                {product.instock 
                  ? `Na stanju${product.quantity ? `: ${product.quantity}` : ''}` 
                  : 'Nema na stanju'}
              </span>
            </div>
            <button className="contact-btn">Kontaktirajte nas</button>
          </div>
        </div>
      </div>
    </div>
  );
}

