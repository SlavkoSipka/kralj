import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import './ProductManagement.css';

interface Product {
  idproducts: number;
  sku?: string;
  name?: string;
  description?: string;
  idmanufacturer?: number;
  manufacturer_name?: string;
  idvendor?: number;
  vendor_name?: string;
  published?: boolean;
  price?: number;
  vat?: number;
  instock?: boolean;
  quantity?: number;
  expire_date?: string;
  image?: string;
  slug?: string;
  class?: string;
  idgeneric?: number;
  generic_name?: string;
  alimsname?: string;
  type?: string;
  popularity_score?: number;
  variant_count?: number;
}

interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  idmanufacturer: string;
  idvendor: string;
  published: boolean;
  price: string;
  vat: string;
  instock: boolean;
  quantity: string;
  expire_date: string;
  image: string;
  slug: string;
  class: string;
  idgeneric: string;
  alimsname: string;
  type: string;
  popularity_score: string;
}

interface SelectOption {
  id: number;
  name: string;
}

type SortField = 'id' | 'name' | 'sku' | 'price';
type SortOrder = 'asc' | 'desc';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [manufacturers, setManufacturers] = useState<SelectOption[]>([]);
  const [vendors, setVendors] = useState<SelectOption[]>([]);
  const [generics, setGenerics] = useState<SelectOption[]>([]);
  
  // Cascading filter - options based on active filters
  const [cascadeManufacturers, setCascadeManufacturers] = useState<SelectOption[]>([]);
  const [cascadeVendors, setCascadeVendors] = useState<SelectOption[]>([]);
  const [cascadeGenerics, setCascadeGenerics] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState<string>('');
  const [filterVendor, setFilterVendor] = useState<string>('');
  const [filterGeneric, setFilterGeneric] = useState<string>('');
  const [manufacturerSearch, setManufacturerSearch] = useState('');
  const [vendorSearch, setVendorSearch] = useState('');
  const [genericSearch, setGenericSearch] = useState('');
  const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showGenericDropdown, setShowGenericDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    description: '',
    idmanufacturer: '',
    idvendor: '',
    published: true,
    price: '',
    vat: '',
    instock: true,
    quantity: '',
    expire_date: '',
    image: '',
    slug: '',
    class: '',
    idgeneric: '',
    alimsname: '',
    type: '',
    popularity_score: '0'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, sortField, sortOrder, itemsPerPage, filterManufacturer, filterVendor, filterGeneric]);

  // Update filtered options when filters change
  useEffect(() => {
    updateFilteredOptions();
  }, [filterVendor, filterManufacturer, filterGeneric, manufacturers, vendors, generics]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.searchable-select')) {
        setShowManufacturerDropdown(false);
        setShowVendorDropdown(false);
        setShowGenericDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function checkAuthAndLoadData() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
      await Promise.all([
        loadManufacturers(),
        loadVendors(),
        loadGenerics()
      ]);
      // loadProducts se poziva automatski iz useEffect
    } catch (error) {
      navigate('/admin/login');
    }
  }

  async function loadProducts() {
    setLoading(true);
    console.log(`🔍 Loading products (page ${currentPage}, ${itemsPerPage} per page)...`);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('products')
        .select(`
          *,
          manufacturer:idmanufacturer (name),
          vendor:idvendor (name),
          generic:idgeneric (name)
        `, { count: 'exact' });

      // Search filter
      if (searchTerm.trim()) {
        const term = `%${searchTerm}%`;
        query = query.or(`name.ilike.${term},sku.ilike.${term},description.ilike.${term},alimsname.ilike.${term},type.ilike.${term}`);
      }

      // Manufacturer filter
      if (filterManufacturer) {
        query = query.eq('idmanufacturer', parseInt(filterManufacturer));
      }

      // Vendor filter
      if (filterVendor) {
        query = query.eq('idvendor', parseInt(filterVendor));
      }

      // Generic filter
      if (filterGeneric) {
        query = query.eq('idgeneric', parseInt(filterGeneric));
      }

      // Sorting
      const sortColumn = sortField === 'id' ? 'idproducts' : sortField;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Supabase error:', error);
        // Check for specific error types
        if (error.message.includes('JWT') || error.message.includes('auth')) {
          throw new Error('Problem sa autentifikacijom. Pokušajte da se ponovo ulogujete.');
        } else if (error.message.includes('RLS') || error.message.includes('policy')) {
          throw new Error('Nemate dozvolu za pristup proizvodima. Proverite da li ste admin.');
        } else {
          throw error;
        }
      }

      // Get variant counts for all products
      const productIds = (data || []).map((p: any) => p.idproducts);
      const variantCounts: Record<number, number> = {};
      
      if (productIds.length > 0) {
        const { data: variantData } = await supabase
          .from('product_variants')
          .select('id_product')
          .in('id_product', productIds);
        
        if (variantData) {
          variantData.forEach((v: any) => {
            variantCounts[v.id_product] = (variantCounts[v.id_product] || 0) + 1;
          });
        }
      }

      const mappedProducts = (data || []).map((p: any) => ({
        ...p,
        manufacturer_name: p.manufacturer?.name,
        vendor_name: p.vendor?.name,
        generic_name: p.generic?.name,
        category_name: p.category?.name,
        variant_count: variantCounts[p.idproducts] || 0
      }));

      console.log(`✅ Loaded ${mappedProducts.length} products (${from + 1}-${Math.min(to + 1, count || 0)} of ${count || 0})`);
      setProducts(mappedProducts);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error('❌ Error loading products:', error);
      const errorMessage = error.message || 'Greška pri učitavanju proizvoda';
      setError(errorMessage);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }

  async function loadManufacturers() {
    console.log('📊 Loading ALL manufacturers...');
    
    // Load ALL manufacturers using pagination to bypass 1000 limit
    let allManufacturers: any[] = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('manufacturer')
        .select('idmanufacturer, name')
        .order('name')
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Error loading manufacturers:', error);
        break;
      }

      if (data && data.length > 0) {
        allManufacturers = [...allManufacturers, ...data];
        from += pageSize;
        hasMore = data.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Loaded ${allManufacturers.length} manufacturers`);
    setManufacturers(allManufacturers.map(m => ({ id: m.idmanufacturer, name: m.name || '' })));
  }

  async function loadVendors() {
    console.log('📊 Loading ALL vendors...');
    
    // Load ALL vendors using pagination to bypass 1000 limit
    let allVendors: any[] = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('vendor')
        .select('idvendor, name')
        .order('name')
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Error loading vendors:', error);
        break;
      }

      if (data && data.length > 0) {
        allVendors = [...allVendors, ...data];
        from += pageSize;
        hasMore = data.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Loaded ${allVendors.length} vendors`);
    setVendors(allVendors.map(v => ({ id: v.idvendor, name: v.name })));
  }

  async function loadGenerics() {
    console.log('📊 Loading ALL generics...');
    
    // Load ALL generics using pagination to bypass 1000 limit
    let allGenerics: any[] = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('generic')
        .select('idgeneric, name')
        .order('name')
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Error loading generics:', error);
        break;
      }

      if (data && data.length > 0) {
        allGenerics = [...allGenerics, ...data];
        from += pageSize;
        hasMore = data.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Loaded ${allGenerics.length} generics`);
    setGenerics(allGenerics.map(g => ({ id: g.idgeneric, name: g.name || '' })));
  }

  // Smart cascading filters - filter options based on active filters
  async function updateFilteredOptions() {
    console.log('🔄 Updating filtered options based on active filters...');
    
    try {
      // Build query to get distinct values from products table based on active filters
      let query = supabase
        .from('products')
        .select('idmanufacturer, idvendor, idgeneric');

      // Apply active filters
      if (filterVendor) {
        query = query.eq('idvendor', parseInt(filterVendor));
      }
      if (filterManufacturer) {
        query = query.eq('idmanufacturer', parseInt(filterManufacturer));
      }
      if (filterGeneric) {
        query = query.eq('idgeneric', parseInt(filterGeneric));
      }

      const { data: productsData } = await query;

      if (productsData) {
        // Get unique IDs
        const uniqueManufacturerIds = [...new Set(productsData.map(p => p.idmanufacturer).filter(Boolean))];
        const uniqueVendorIds = [...new Set(productsData.map(p => p.idvendor).filter(Boolean))];
        const uniqueGenericIds = [...new Set(productsData.map(p => p.idgeneric).filter(Boolean))];

        // Filter options based on what's actually in filtered products
        const newFilteredManufacturers = filterVendor || filterGeneric
          ? manufacturers.filter(m => uniqueManufacturerIds.includes(m.id))
          : manufacturers;

        const newFilteredVendors = filterManufacturer || filterGeneric
          ? vendors.filter(v => uniqueVendorIds.includes(v.id))
          : vendors;

        const newFilteredGenerics = filterVendor || filterManufacturer
          ? generics.filter(g => uniqueGenericIds.includes(g.id))
          : generics;

        setCascadeManufacturers(newFilteredManufacturers);
        setCascadeVendors(newFilteredVendors);
        setCascadeGenerics(newFilteredGenerics);

        console.log(`✅ Cascading filter: ${newFilteredManufacturers.length} manufacturers, ${newFilteredVendors.length} vendors, ${newFilteredGenerics.length} generics`);
      } else {
        // No filters active, show all options
        setCascadeManufacturers(manufacturers);
        setCascadeVendors(vendors);
        setCascadeGenerics(generics);
      }
    } catch (error) {
      console.error('Error updating filtered options:', error);
      // On error, show all options
      setCascadeManufacturers(manufacturers);
      setCascadeVendors(vendors);
      setCascadeGenerics(generics);
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

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);
  const currentProducts = products;

  // Filtered options for searchable dropdowns
  // First apply cascading filter, then apply search filter
  const filteredManufacturers = (cascadeManufacturers.length > 0 ? cascadeManufacturers : manufacturers).filter(m => 
    m.name.toLowerCase().includes(manufacturerSearch.toLowerCase())
  );
  const filteredVendors = (cascadeVendors.length > 0 ? cascadeVendors : vendors).filter(v => 
    v.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );
  const filteredGenerics = (cascadeGenerics.length > 0 ? cascadeGenerics : generics).filter(g => 
    g.name.toLowerCase().includes(genericSearch.toLowerCase())
  );

  // Get selected names
  const selectedManufacturerName = manufacturers.find(m => m.id.toString() === filterManufacturer)?.name || '';
  const selectedVendorName = vendors.find(v => v.id.toString() === filterVendor)?.name || '';
  const selectedGenericName = generics.find(g => g.id.toString() === filterGeneric)?.name || '';

  function handleItemsPerPageChange(newItemsPerPage: number) {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openAddModal() {
    setEditingProduct(null);
    setFormData({
      sku: '',
      name: '',
      description: '',
      idmanufacturer: '',
      idvendor: '',
      published: true,
      price: '',
      vat: '',
      instock: true,
      quantity: '',
      expire_date: '',
      image: '',
      slug: '',
      class: '',
      idgeneric: '',
      alimsname: '',
      type: '',
      popularity_score: '0'
    });
    setError('');
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      idmanufacturer: product.idmanufacturer?.toString() || '',
      idvendor: product.idvendor?.toString() || '',
      published: product.published ?? true,
      price: product.price?.toString() || '',
      vat: product.vat?.toString() || '',
      instock: product.instock ?? true,
      quantity: product.quantity?.toString() || '',
      expire_date: product.expire_date ? product.expire_date.split('T')[0] : '',
      image: product.image || '',
      slug: product.slug || '',
      class: product.class || '',
      idgeneric: product.idgeneric?.toString() || '',
      alimsname: product.alimsname || '',
      type: product.type || '',
      popularity_score: product.popularity_score?.toString() || '0'
    });
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProduct(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const productData: any = {
        sku: formData.sku.trim() || null,
        name: formData.name.trim() || null,
        description: formData.description.trim() || null,
        idmanufacturer: formData.idmanufacturer ? parseInt(formData.idmanufacturer) : null,
        idvendor: formData.idvendor ? parseInt(formData.idvendor) : null,
        published: formData.published,
        price: formData.price ? parseFloat(formData.price) : null,
        vat: formData.vat ? parseFloat(formData.vat) : null,
        instock: formData.instock,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        expire_date: formData.expire_date || null,
        image: formData.image.trim() || null,
        slug: formData.slug.trim() || null,
        class: formData.class.trim() || null,
        idgeneric: formData.idgeneric ? parseInt(formData.idgeneric) : null,
        alimsname: formData.alimsname.trim() || null,
        type: formData.type.trim() || null,
        popularity_score: formData.popularity_score ? parseInt(formData.popularity_score) : 0,
        updated_at: new Date().toISOString()
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('idproducts', editingProduct.idproducts);

        if (error) throw error;
        console.log('✅ Product updated successfully, reloading...');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        console.log('✅ Product added successfully, reloading...');
      }

      await loadProducts();
      closeModal();
    } catch (error: any) {
      console.error('Error saving product:', error);
      setError(error.message || 'Greška pri čuvanju proizvoda');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePublished(product: Product) {
    const newStatus = !product.published;
    const action = newStatus ? 'objavite' : 'sakrijete';
    
    if (!window.confirm(`Da li ste sigurni da želite da ${action} proizvod "${product.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          published: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('idproducts', product.idproducts);

      if (error) throw error;
      await loadProducts();
    } catch (error: any) {
      console.error('Error toggling product status:', error);
      alert('Greška pri promeni statusa proizvoda: ' + (error.message || 'Nepoznata greška'));
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Da li ste sigurni da želite da obrišete proizvod "${product.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('idproducts', product.idproducts);

      if (error) throw error;
      await loadProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('Greška pri brisanju proizvoda: ' + (error.message || 'Nepoznata greška'));
    }
  }

  if (loading) {
    return (
      <div className="product-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Učitavanje proizvoda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="product-header">
        <div className="product-header-left">
          <Link to="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Admin Panel
          </Link>
          <h1>Upravljanje Proizvodima</h1>
          <p className="product-count">Ukupno proizvoda: {products.length}</p>
        </div>
        <button onClick={openAddModal} className="btn-add-product">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
          </svg>
          Dodaj Novi Proizvod
        </button>
      </div>

      <div className="search-container">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Pretraži po nazivu, SKU, opisu, ALIMS, tipu..."
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
            <button onClick={handleSearchClear} className="clear-search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="search-results">Pronađeno: {totalCount} proizvoda</p>
        )}
      </div>

      {/* Filters */}
      <div className="filters-container">
        {/* Manufacturer Filter */}
        <div className="filter-group">
          <label>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: '6px'}}>
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
              <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
            </svg>
            Proizvođač:
          </label>
          <div className="searchable-select">
            <input
              type="text"
              placeholder={selectedManufacturerName || "Pretraži proizvođača..."}
              value={manufacturerSearch}
              onChange={(e) => setManufacturerSearch(e.target.value)}
              onFocus={() => setShowManufacturerDropdown(true)}
              className="filter-search-input"
            />
            {showManufacturerDropdown && (
              <div className="searchable-dropdown">
                <div 
                  className={`dropdown-item ${!filterManufacturer ? 'selected' : ''}`}
                  onClick={() => {
                    setFilterManufacturer('');
                    setManufacturerSearch('');
                    setShowManufacturerDropdown(false);
                    setCurrentPage(1);
                  }}
                >
                  Svi proizvođači
                </div>
                {filteredManufacturers.length > 0 ? (
                  filteredManufacturers.map(m => (
                    <div
                      key={m.id}
                      className={`dropdown-item ${filterManufacturer === m.id.toString() ? 'selected' : ''}`}
                      onClick={() => {
                        setFilterManufacturer(m.id.toString());
                        setManufacturerSearch('');
                        setShowManufacturerDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      {m.name}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item disabled">Nema rezultata</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Vendor Filter */}
        <div className="filter-group">
          <label>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: '6px'}}>
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            Vendor:
          </label>
          <div className="searchable-select">
            <input
              type="text"
              placeholder={selectedVendorName || "Pretraži vendora..."}
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              onFocus={() => setShowVendorDropdown(true)}
              className="filter-search-input"
            />
            {showVendorDropdown && (
              <div className="searchable-dropdown">
                <div 
                  className={`dropdown-item ${!filterVendor ? 'selected' : ''}`}
                  onClick={() => {
                    setFilterVendor('');
                    setVendorSearch('');
                    setShowVendorDropdown(false);
                    setCurrentPage(1);
                  }}
                >
                  Svi vendori
                </div>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map(v => (
                    <div
                      key={v.id}
                      className={`dropdown-item ${filterVendor === v.id.toString() ? 'selected' : ''}`}
                      onClick={() => {
                        setFilterVendor(v.id.toString());
                        setVendorSearch('');
                        setShowVendorDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      {v.name}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item disabled">Nema rezultata</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Generic Filter */}
        <div className="filter-group">
          <label>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: '6px'}}>
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
            </svg>
            Generički:
          </label>
          <div className="searchable-select">
            <input
              type="text"
              placeholder={selectedGenericName || "Pretraži generički naziv..."}
              value={genericSearch}
              onChange={(e) => setGenericSearch(e.target.value)}
              onFocus={() => setShowGenericDropdown(true)}
              className="filter-search-input"
            />
            {showGenericDropdown && (
              <div className="searchable-dropdown">
                <div 
                  className={`dropdown-item ${!filterGeneric ? 'selected' : ''}`}
                  onClick={() => {
                    setFilterGeneric('');
                    setGenericSearch('');
                    setShowGenericDropdown(false);
                    setCurrentPage(1);
                  }}
                >
                  Svi generički nazivi
                </div>
                {filteredGenerics.length > 0 ? (
                  filteredGenerics.map(g => (
                    <div
                      key={g.id}
                      className={`dropdown-item ${filterGeneric === g.id.toString() ? 'selected' : ''}`}
                      onClick={() => {
                        setFilterGeneric(g.id.toString());
                        setGenericSearch('');
                        setShowGenericDropdown(false);
                        setCurrentPage(1);
                      }}
                    >
                      {g.name}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item disabled">Nema rezultata</div>
                )}
              </div>
            )}
          </div>
        </div>

        {(filterManufacturer || filterVendor || filterGeneric) && (
          <button 
            onClick={() => {
              setFilterManufacturer('');
              setFilterVendor('');
              setFilterGeneric('');
              setManufacturerSearch('');
              setVendorSearch('');
              setGenericSearch('');
              setCurrentPage(1);
            }}
            className="btn-clear-filters"
            title="Očisti sve filtere"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
            Očisti filtere
          </button>
        )}
      </div>

      {totalCount > 0 && (
        <div className="table-controls">
          <div className="sort-controls">
            <span className="sort-label">Sortiraj po:</span>
            <button onClick={() => handleSort('id')} className={`sort-btn ${sortField === 'id' ? 'active' : ''}`}>
              ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('name')} className={`sort-btn ${sortField === 'name' ? 'active' : ''}`}>
              Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('sku')} className={`sort-btn ${sortField === 'sku' ? 'active' : ''}`}>
              SKU {sortField === 'sku' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button onClick={() => handleSort('price')} className={`sort-btn ${sortField === 'price' ? 'active' : ''}`}>
              Cena {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>

            {totalPages > 1 && (
              <div className="top-pagination-controls">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
                  ← Prethodna
                </button>
                <div className="pagination-numbers">
                  {currentPage > 3 && (
                    <>
                      <button onClick={() => handlePageChange(1)} className="pagination-number">1</button>
                      {currentPage > 4 && <span className="pagination-dots">...</span>}
                    </>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === currentPage || page === currentPage - 1 || page === currentPage + 1 || page === currentPage - 2 || page === currentPage + 2)
                    .map(page => (
                      <button key={page} onClick={() => handlePageChange(page)} className={`pagination-number ${page === currentPage ? 'active' : ''}`}>
                        {page}
                      </button>
                    ))}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="pagination-dots">...</span>}
                      <button onClick={() => handlePageChange(totalPages)} className="pagination-number">{totalPages}</button>
                    </>
                  )}
                </div>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
                  Sledeća →
                </button>
              </div>
            )}
          </div>
          
          <div className="items-per-page-control">
            <span className="items-label">Prikaži:</span>
            <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))} className="items-select">
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <span className="items-label-suffix">po stranici</span>
          </div>

          <div className="pagination-info">
            <span>Prikazano: {startIndex + 1}-{endIndex} od {totalCount}</span>
          </div>
        </div>
      )}

      <div className="table-container">
        {totalCount === 0 ? (
          <div className="no-products">
            <p>{searchTerm ? 'Nema rezultata za zadatu pretragu' : 'Nema proizvoda u sistemu'}</p>
            {!searchTerm && (
              <button onClick={openAddModal} className="btn-add-first">Dodaj Prvi Proizvod</button>
            )}
          </div>
        ) : (
          <>
            <table className="products-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('sku')} className="sortable-header">SKU {sortField === 'sku' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>ALIMS</th>
                <th onClick={() => handleSort('name')} className="sortable-header">Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>Opis</th>
                <th>Slug</th>
                <th>Proizvođač</th>
                <th>Vendor</th>
                <th>Generički</th>
                <th>Varijante</th>
                <th onClick={() => handleSort('price')} className="sortable-header">Cena {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                <th>PDV</th>
                <th>Količina</th>
                <th>Datum isteka</th>
                <th>Slika</th>
                <th>Klasa</th>
                <th>Tip</th>
                <th>Popularnost</th>
                <th>Na stanju</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.idproducts} className={!product.published ? 'unpublished-row' : ''}>
                  <td>{product.idproducts}</td>
                  <td className="product-sku">{product.sku || '-'}</td>
                  <td className="product-alims">{product.alimsname || '-'}</td>
                  <td className="product-name">{product.name || '-'}</td>
                  <td className="product-description" title={product.description || ''}>
                    {product.description ? (product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description) : '-'}
                  </td>
                  <td className="product-slug">{product.slug || '-'}</td>
                  <td className="product-manufacturer">{product.manufacturer_name || '-'}</td>
                  <td className="product-vendor">{product.vendor_name || '-'}</td>
                  <td className="product-generic">{product.generic_name || '-'}</td>
                  <td className="product-variants">
                    {product.variant_count && product.variant_count > 0 ? (
                      <>
                        <span className="variant-count">{product.variant_count} {product.variant_count === 1 ? 'varijanta' : 'varijante'}</span>
                        <Link to={`/admin/products/${product.idproducts}/variants`} className="btn-view-variants">
                          👁️ Variants
                        </Link>
                      </>
                    ) : (
                      <>
                        <span className="no-variants">Nema</span>
                        <Link to={`/admin/products/${product.idproducts}/variants`} className="btn-add-variant">
                          ➕ Add
                        </Link>
                      </>
                    )}
                  </td>
                  <td className="product-price">{product.price ? `${product.price.toFixed(2)}` : '-'}</td>
                  <td className="product-vat">{product.vat ? `${product.vat}%` : '-'}</td>
                  <td className="product-quantity">{product.quantity ?? '-'}</td>
                  <td className="product-expire">{product.expire_date ? new Date(product.expire_date).toLocaleDateString('sr-RS') : '-'}</td>
                  <td className="product-image">
                    {product.image ? (
                      <a href={product.image} target="_blank" rel="noopener noreferrer" title="Vidi sliku">
                        <img src={product.image} alt={product.name || ''} className="image-thumbnail" />
                      </a>
                    ) : '-'}
                  </td>
                  <td className="product-class">{product.class || '-'}</td>
                  <td className="product-type">{product.type || '-'}</td>
                  <td className="product-popularity">{product.popularity_score ?? 0}</td>
                  <td className="product-instock">
                    <span className={`badge-instock ${product.instock ? 'badge-yes' : 'badge-no'}`}>
                      {product.instock ? 'Da' : 'Ne'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${product.published ? 'status-published' : 'status-unpublished'}`}>
                      {product.published ? 'Objavljeno' : 'Sakriveno'}
                    </span>
                  </td>
                  <td className="sticky-actions">
                    <div className="action-buttons">
                      <button onClick={() => openEditModal(product)} className="btn-edit" title="Izmeni">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleTogglePublished(product)}
                        className={product.published ? 'btn-unpublish' : 'btn-publish'}
                        title={product.published ? 'Sakrij' : 'Objavi'}
                      >
                        {product.published ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                          </svg>
                        )}
                      </button>
                      <button onClick={() => handleDelete(product)} className="btn-delete" title="Obriši">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>

      {totalCount > 0 && totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
              ← Prethodna
            </button>
            <div className="pagination-numbers">
              {currentPage > 2 && (
                <>
                  <button onClick={() => handlePageChange(1)} className="pagination-number">1</button>
                  {currentPage > 3 && <span className="pagination-dots">...</span>}
                </>
              )}
              {currentPage > 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)} className="pagination-number">{currentPage - 1}</button>
              )}
              <button className="pagination-number active">{currentPage}</button>
              {currentPage < totalPages && (
                <button onClick={() => handlePageChange(currentPage + 1)} className="pagination-number">{currentPage + 1}</button>
              )}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <span className="pagination-dots">...</span>}
                  <button onClick={() => handlePageChange(totalPages)} className="pagination-number">{totalPages}</button>
                </>
              )}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
              Sledeća →
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h2>{editingProduct ? 'Izmeni Proizvod' : 'Dodaj Novi Proizvod'}</h2>
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

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid-single">
                <div className="form-group">
                  <label htmlFor="name">Naziv</label>
                  <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="alimsname">ALIMS Naziv</label>
                  <input type="text" id="alimsname" value={formData.alimsname} disabled className="input-disabled" />
                </div>

                <div className="form-group">
                  <label htmlFor="sku">SKU</label>
                  <input type="text" id="sku" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="slug">Slug</label>
                  <input type="text" id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Opis</label>
                  <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>

                <div className="form-group">
                  <label htmlFor="idmanufacturer">Proizvođač</label>
                  <select id="idmanufacturer" value={formData.idmanufacturer} disabled className="input-disabled">
                    <option value="">-- Izaberi --</option>
                    {manufacturers.map(m => <option key={m.id} value={m.id.toString()}>{m.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="idvendor">Vendor</label>
                  <select id="idvendor" value={formData.idvendor} disabled className="input-disabled">
                    <option value="">-- Izaberi --</option>
                    {vendors.map(v => <option key={v.id} value={v.id.toString()}>{v.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="idgeneric">Generički Naziv</label>
                  <select id="idgeneric" value={formData.idgeneric} disabled className="input-disabled">
                    <option value="">-- Izaberi --</option>
                    {generics.map(g => <option key={g.id} value={g.id.toString()}>{g.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Cena (RSD)</label>
                  <input type="number" step="0.01" id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="vat">PDV (%)</label>
                  <input type="number" step="0.01" id="vat" value={formData.vat} onChange={(e) => setFormData({ ...formData, vat: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Količina</label>
                  <input type="number" id="quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="expire_date">Datum Isteka</label>
                  <input type="date" id="expire_date" value={formData.expire_date} onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="image">URL Slike</label>
                  <input type="text" id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="class">Klasa</label>
                  <input type="text" id="class" value={formData.class} disabled className="input-disabled" />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Tip</label>
                  <input type="text" id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                </div>

                <div className="form-group">
                  <label htmlFor="popularity_score">Popularnost (Score)</label>
                  <input type="number" id="popularity_score" value={formData.popularity_score} onChange={(e) => setFormData({ ...formData, popularity_score: e.target.value })} />
                </div>

                <div className="form-group form-checkbox">
                  <label>
                    <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                    Objavljeno
                  </label>
                </div>

                <div className="form-group form-checkbox">
                  <label>
                    <input type="checkbox" checked={formData.instock} onChange={(e) => setFormData({ ...formData, instock: e.target.checked })} />
                    Na stanju
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel" disabled={submitting}>Otkaži</button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner-small"></div>
                      {editingProduct ? 'Čuvanje...' : 'Dodavanje...'}
                    </>
                  ) : (
                    editingProduct ? 'Sačuvaj Izmene' : 'Dodaj Proizvod'
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
