import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import './ProductVariantsManagement.css';

interface Variant {
  id_variant: number;
  id_product: number;
  variant_name: string;
  variant_type?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  instock?: boolean;
  sort_order?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ParentProduct {
  idproducts: number;
  name: string;
  sku?: string;
  price?: number;
  quantity?: number;
  alimsname?: string;
  manufacturer_name?: string;
  vendor_name?: string;
}

interface VariantFormData {
  variant_name: string;
  variant_type: string;
  sku: string;
  price: string;
  quantity: string;
  instock: boolean;
  sort_order: string;
  active: boolean;
}

type SortField = 'id' | 'name' | 'price';
type SortOrder = 'asc' | 'desc';

export default function ProductVariantsManagement() {
  const { productId } = useParams<{ productId: string }>();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [parentProduct, setParentProduct] = useState<ParentProduct | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [formData, setFormData] = useState<VariantFormData>({
    variant_name: '',
    variant_type: 'size',
    sku: '',
    price: '',
    quantity: '',
    instock: true,
    sort_order: '0',
    active: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, [productId]);

  useEffect(() => {
    if (productId) {
      loadVariants();
    }
  }, [currentPage, searchTerm, sortField, sortOrder, itemsPerPage, productId]);

  async function checkAuthAndLoadData() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
      
      if (!productId) {
        navigate('/admin/products');
        return;
      }

      await loadParentProduct();
    } catch (error) {
      navigate('/admin/login');
    }
  }

  async function loadParentProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          idproducts, 
          name, 
          sku, 
          price, 
          quantity,
          alimsname,
          manufacturer:idmanufacturer (name),
          vendor:idvendor (name)
        `)
        .eq('idproducts', parseInt(productId!))
        .single();

      if (error) throw error;
      
      // Map the related data
      const mappedProduct = {
        ...data,
        manufacturer_name: (data.manufacturer as any)?.name || '-',
        vendor_name: (data.vendor as any)?.name || '-'
      };
      
      setParentProduct(mappedProduct);
    } catch (error) {
      console.error('Error loading parent product:', error);
      setError('Greška pri učitavanju proizvoda');
    }
  }

  async function loadVariants() {
    setLoading(true);
    console.log(`🔍 Loading variants for product ${productId} (page ${currentPage})...`);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('product_variants')
        .select('*', { count: 'exact' })
        .eq('id_product', parseInt(productId!));

      // Search filter
      if (searchTerm.trim()) {
        const term = `%${searchTerm}%`;
        query = query.or(`variant_name.ilike.${term},sku.ilike.${term},variant_type.ilike.${term}`);
      }

      // Sorting
      const sortColumn = sortField === 'id' ? 'id_variant' : sortField === 'name' ? 'variant_name' : sortField;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} variants (${from + 1}-${Math.min(to + 1, count || 0)} of ${count || 0})`);
      setVariants(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('❌ Error loading variants:', error);
      setError('Greška pri učitavanju varijanti');
    } finally {
      setLoading(false);
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  }

  function handleSearchSubmit() {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  }

  function handleSearchClear() {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleItemsPerPageChange(newItemsPerPage: number) {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);
  const currentVariants = variants;

  function openAddModal() {
    setEditingVariant(null);
    setFormData({
      variant_name: '',
      variant_type: 'size',
      sku: '',
      price: '',
      quantity: '',
      instock: true,
      sort_order: '0',
      active: true
    });
    setError('');
    setShowModal(true);
  }

  function openEditModal(variant: Variant) {
    setEditingVariant(variant);
    setFormData({
      variant_name: variant.variant_name || '',
      variant_type: variant.variant_type || 'size',
      sku: variant.sku || '',
      price: variant.price?.toString() || '',
      quantity: variant.quantity?.toString() || '',
      instock: variant.instock ?? true,
      sort_order: variant.sort_order?.toString() || '0',
      active: variant.active ?? true
    });
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingVariant(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const variantData: any = {
        id_product: parseInt(productId!),
        variant_name: formData.variant_name.trim() || null,
        variant_type: formData.variant_type.trim() || null,
        sku: formData.sku.trim() || null,
        price: formData.price ? parseFloat(formData.price) : null,
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        instock: formData.instock,
        sort_order: formData.sort_order ? parseInt(formData.sort_order) : 0,
        active: formData.active,
        updated_at: new Date().toISOString()
      };

      if (editingVariant) {
        const { error } = await supabase
          .from('product_variants')
          .update(variantData)
          .eq('id_variant', editingVariant.id_variant);

        if (error) throw error;
        console.log('✅ Variant updated successfully');
      } else {
        const { error } = await supabase
          .from('product_variants')
          .insert([variantData]);

        if (error) throw error;
        console.log('✅ Variant added successfully');
      }

      await loadVariants();
      closeModal();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      setError(error.message || 'Greška pri čuvanju varijante');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(variant: Variant) {
    const newStatus = !variant.active;
    const action = newStatus ? 'aktivirate' : 'deaktivirate';
    
    if (!window.confirm(`Da li ste sigurni da želite da ${action} varijantu "${variant.variant_name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ 
          active: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id_variant', variant.id_variant);

      if (error) throw error;
      await loadVariants();
    } catch (error: any) {
      console.error('Error toggling variant status:', error);
      alert('Greška pri promeni statusa varijante: ' + (error.message || 'Nepoznata greška'));
    }
  }

  async function handleDelete(variant: Variant) {
    if (!window.confirm(`Da li ste sigurni da želite da obrišete varijantu "${variant.variant_name}"?\n\nNAPOMENA: Ovo je trajna akcija i ne može se vratiti.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id_variant', variant.id_variant);

      if (error) throw error;
      await loadVariants();
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      alert('Greška pri brisanju varijante: ' + (error.message || 'Nepoznata greška'));
    }
  }

  if (loading) {
    return (
      <div className="variant-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Učitavanje varijanti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="variant-management">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <Link to="/admin" className="breadcrumb-link">Admin Panel</Link>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="breadcrumb-separator">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        <Link to="/admin/products" className="breadcrumb-link">Proizvodi</Link>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="breadcrumb-separator">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        <span className="breadcrumb-current">
          {parentProduct ? parentProduct.name : 'Varijante'}
        </span>
      </div>

      <div className="variant-header">
        <div className="variant-header-left">
          <Link to="/admin/products" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Proizvode
          </Link>
          <h1>Varijante Proizvoda</h1>
          {parentProduct && (
            <div className="parent-product-info">
              <div className="product-badge">📦 PROIZVOD</div>
              <h2 className="product-name-highlight">{parentProduct.name}</h2>
              <div className="parent-product-details">
                <span className="detail-item">
                  <strong>ALIMS:</strong> {parentProduct.alimsname || '-'}
                </span>
                <span className="detail-separator">•</span>
                <span className="detail-item">
                  <strong>Naziv:</strong> {parentProduct.name || '-'}
                </span>
                <span className="detail-separator">•</span>
                <span className="detail-item">
                  <strong>Proizvođač:</strong> {parentProduct.manufacturer_name || '-'}
                </span>
                <span className="detail-separator">•</span>
                <span className="detail-item">
                  <strong>Vendor:</strong> {parentProduct.vendor_name || '-'}
                </span>
              </div>
            </div>
          )}
          <p className="variant-count">Ukupno varijanti: {totalCount}</p>
        </div>
        <button onClick={openAddModal} className="btn-add-variant">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
          </svg>
          Dodaj Novu Varijantu
        </button>
      </div>

      <div className="search-container">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Pretraži po nazivu, SKU, tipu..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="search-input"
          />
          <button onClick={handleSearchSubmit} className="search-btn" title="Pretraži (Enter)">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
          </button>
          {searchInput && (
            <button onClick={handleSearchClear} className="clear-search" aria-label="Obriši pretragu">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="controls-container">
        <div className="sort-controls">
          <label>Sortiraj po:</label>
          <select value={sortField} onChange={(e) => handleSort(e.target.value as SortField)} className="sort-select">
            <option value="id">ID</option>
            <option value="name">Naziv</option>
            <option value="price">Cena</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-order-btn">
            {sortOrder === 'asc' ? '↑ Rastuće' : '↓ Opadajuće'}
          </button>
        </div>

        <div className="items-per-page">
          <label>Prikaži po stranici:</label>
          <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))} className="items-select">
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>

        <div className="pagination-info">
          Prikazano {totalCount > 0 ? startIndex + 1 : 0} - {endIndex} od {totalCount} varijanti
        </div>
      </div>

      {totalCount > 0 && (
        <div className="pagination-controls-top">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Prethodna
          </button>

          <div className="pagination-numbers">
            {currentPage > 2 && (
              <>
                <button onClick={() => handlePageChange(1)} className="pagination-number">
                  1
                </button>
                {currentPage > 3 && <span className="pagination-dots">...</span>}
              </>
            )}

            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)} className="pagination-number">
                {currentPage - 1}
              </button>
            )}

            <button className="pagination-number active">
              {currentPage}
            </button>

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="pagination-number"
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="pagination-dots">...</span>}
                <button onClick={() => handlePageChange(totalPages)} className="pagination-number">
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Sledeća
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      )}

      <div className="table-container">
        {totalCount === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <h3>Nema varijanti</h3>
            <p>Dodajte prvu varijantu za ovaj proizvod.</p>
            <button onClick={openAddModal} className="btn-add-first">
              Dodaj Prvu Varijantu
            </button>
          </div>
        ) : (
          <table className="variants-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('name')} className="sortable-header">Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>Tip</th>
                <th>SKU</th>
                <th onClick={() => handleSort('price')} className="sortable-header">Cena {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>Količina</th>
                <th>Na stanju</th>
                <th>Sort Order</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {currentVariants.map((variant) => (
                <tr key={variant.id_variant} className={!variant.active ? 'inactive-row' : ''}>
                  <td>{variant.id_variant}</td>
                  <td className="variant-name">{variant.variant_name}</td>
                  <td className="variant-type">{variant.variant_type || '-'}</td>
                  <td className="variant-sku">{variant.sku || '-'}</td>
                  <td className="variant-price">
                    {variant.price ? `${variant.price.toFixed(2)} RSD` : (
                      <span className="inherit-price" title={`Koristi parent cenu: ${parentProduct?.price?.toFixed(2)} RSD`}>
                        (parent)
                      </span>
                    )}
                  </td>
                  <td className="variant-quantity">{variant.quantity ?? 0}</td>
                  <td className="variant-instock">
                    <span className={`badge ${variant.instock ? 'badge-yes' : 'badge-no'}`}>
                      {variant.instock ? 'Da' : 'Ne'}
                    </span>
                  </td>
                  <td className="variant-sort">{variant.sort_order ?? 0}</td>
                  <td>
                    <span className={`status-badge ${variant.active ? 'status-active' : 'status-inactive'}`}>
                      {variant.active ? 'Aktivna' : 'Neaktivna'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(variant)}
                        className="btn-edit"
                        title="Izmeni"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleActive(variant)}
                        className={variant.active ? 'btn-block' : 'btn-unblock'}
                        title={variant.active ? 'Deaktiviraj' : 'Aktiviraj'}
                      >
                        {variant.active ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884l-12-12 .708-.708 12 12-.708.708z"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(variant)}
                        className="btn-delete"
                        title="Obriši"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalCount > 0 && totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Prethodna
          </button>

          <div className="pagination-numbers">
            {currentPage > 2 && (
              <>
                <button onClick={() => handlePageChange(1)} className="pagination-number">
                  1
                </button>
                {currentPage > 3 && <span className="pagination-dots">...</span>}
              </>
            )}

            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)} className="pagination-number">
                {currentPage - 1}
              </button>
            )}

            <button className="pagination-number active">
              {currentPage}
            </button>

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="pagination-number"
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="pagination-dots">...</span>}
                <button onClick={() => handlePageChange(totalPages)} className="pagination-number">
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Sledeća
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingVariant ? 'Izmeni Varijantu' : 'Dodaj Novu Varijantu'}</h2>
              <button onClick={closeModal} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="variant-form">
              <div className="form-grid-single">
                <div className="form-group">
                  <label htmlFor="variant_name">Naziv Varijante</label>
                  <input 
                    type="text" 
                    id="variant_name" 
                    value={formData.variant_name} 
                    onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })} 
                    placeholder="npr. 2mm, Plava, Velika, itd."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="variant_type">Tip Varijante</label>
                  <select 
                    id="variant_type" 
                    value={formData.variant_type} 
                    onChange={(e) => setFormData({ ...formData, variant_type: e.target.value })}
                  >
                    <option value="size">Size (Veličina)</option>
                    <option value="color">Color (Boja)</option>
                    <option value="length">Length (Dužina)</option>
                    <option value="weight">Weight (Težina)</option>
                    <option value="volume">Volume (Zapremina)</option>
                    <option value="other">Other (Ostalo)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sku">SKU</label>
                  <input 
                    type="text" 
                    id="sku" 
                    value={formData.sku} 
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                    placeholder="Opciono - unikatni SKU za ovu varijantu"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Cena (RSD)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    id="price" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    placeholder={`Prazno = parent cena (${parentProduct?.price?.toFixed(2) || '0'} RSD)`}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Količina</label>
                  <input 
                    type="number" 
                    id="quantity" 
                    value={formData.quantity} 
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sort_order">Sort Order</label>
                  <input 
                    type="number" 
                    id="sort_order" 
                    value={formData.sort_order} 
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} 
                    placeholder="0 = prvo u listi"
                  />
                  <small>Redosled prikazivanja u dropdown-u na sajtu (manji broj = veći prioritet)</small>
                </div>

                <div className="form-group form-checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.instock} 
                      onChange={(e) => setFormData({ ...formData, instock: e.target.checked })} 
                    />
                    Na stanju
                  </label>
                </div>

                <div className="form-group form-checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.active} 
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })} 
                    />
                    Aktivna (vidljiva na sajtu)
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel" disabled={submitting}>Otkaži</button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner-small"></div>
                      {editingVariant ? 'Čuvanje...' : 'Dodavanje...'}
                    </>
                  ) : (
                    editingVariant ? 'Sačuvaj Izmene' : 'Dodaj Varijantu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
