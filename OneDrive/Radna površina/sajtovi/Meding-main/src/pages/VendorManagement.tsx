import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import './VendorManagement.css';

interface Vendor {
  idvendor: number;
  name: string;
  address?: string;
  zip?: number;
  city?: string;
  country?: string;
  vat?: string;
  mb?: string;
  phone?: string;
  contact_person?: string;
  email?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

interface VendorFormData {
  name: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  vat: string;
  mb: string;
  phone: string;
  contact_person: string;
  email: string;
  website: string;
}

type SortField = 'id' | 'name';
type SortOrder = 'asc' | 'desc';

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    address: '',
    zip: '',
    city: '',
    country: 'Srbija',
    vat: '',
    mb: '',
    phone: '',
    contact_person: '',
    email: '',
    website: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    loadVendors();
  }, [currentPage, searchTerm, sortField, sortOrder, itemsPerPage]);

  async function checkAuthAndLoadData() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
      await loadVendors();
    } catch (error) {
      navigate('/admin/login');
    }
  }

  async function loadVendors() {
    setLoading(true);
    console.log(`🔍 Loading vendors (page ${currentPage}, ${itemsPerPage} per page)...`);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('vendor')
        .select('*', { count: 'exact' });

      // Search filter
      if (searchTerm.trim()) {
        const term = `%${searchTerm}%`;
        query = query.or(`name.ilike.${term},city.ilike.${term},country.ilike.${term},email.ilike.${term}`);
      }

      // Sorting
      const sortColumn = sortField === 'id' ? 'idvendor' : sortField;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} vendors (${from + 1}-${Math.min(to + 1, count || 0)} of ${count || 0})`);
      setVendors(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('❌ Error loading vendors:', error);
      setError('Greška pri učitavanju vendora');
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

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);
  const currentVendors = vendors;

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleItemsPerPageChange(newItemsPerPage: number) {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openAddModal() {
    setEditingVendor(null);
    setFormData({
      name: '',
      address: '',
      zip: '',
      city: '',
      country: 'Srbija',
      vat: '',
      mb: '',
      phone: '',
      contact_person: '',
      email: '',
      website: ''
    });
    setError('');
    setShowModal(true);
  }

  function openEditModal(vendor: Vendor) {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || '',
      address: vendor.address || '',
      zip: vendor.zip?.toString() || '',
      city: vendor.city || '',
      country: vendor.country || 'Srbija',
      vat: vendor.vat || '',
      mb: vendor.mb || '',
      phone: vendor.phone || '',
      contact_person: vendor.contact_person || '',
      email: vendor.email || '',
      website: vendor.website || ''
    });
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingVendor(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Naziv vendora je obavezan');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const vendorData: any = {
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        zip: formData.zip ? parseInt(formData.zip) : null,
        city: formData.city.trim() || null,
        country: formData.country.trim() || 'Srbija',
        vat: formData.vat.trim() || null,
        mb: formData.mb.trim() || null,
        phone: formData.phone.trim() || null,
        contact_person: formData.contact_person.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        updated_at: new Date().toISOString()
      };

      if (editingVendor) {
        // Update existing vendor
        const { error } = await supabase
          .from('vendor')
          .update(vendorData)
          .eq('idvendor', editingVendor.idvendor);

        if (error) throw error;
      } else {
        // Create new vendor
        const { error } = await supabase
          .from('vendor')
          .insert([vendorData]);

        if (error) throw error;
      }

      closeModal();
      await loadVendors();
    } catch (error: any) {
      console.error('Error saving vendor:', error);
      setError(error.message || 'Greška pri čuvanju vendora');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(vendor: Vendor) {
    if (!window.confirm(`Da li ste sigurni da želite da obrišete vendora "${vendor.name}"?\n\nNAPOMENA: Proizvodi povezani sa ovim vendorom neće biti obrisani.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vendor')
        .delete()
        .eq('idvendor', vendor.idvendor);

      if (error) throw error;

      await loadVendors();
    } catch (error: any) {
      console.error('Error deleting vendor:', error);
      alert('Greška pri brisanju vendora: ' + (error.message || 'Nepoznata greška'));
    }
  }

  if (loading) {
    return (
      <div className="vendor-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Učitavanje vendora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-management">
      {/* Header */}
      <div className="vendor-header">
        <div className="vendor-header-left">
          <Link to="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Admin Panel
          </Link>
          <h1>Upravljanje Vendorima</h1>
          <p className="vendor-count">Ukupno vendora: {vendors.length}</p>
        </div>
        <button onClick={openAddModal} className="btn-add-vendor">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
          </svg>
          Dodaj Novog Vendora
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Pretraži vendore po imenu, gradu, državi, PIB-u, MB-u..."
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
          <p className="search-results">Pronađeno: {totalCount} vendora</p>
        )}
      </div>

      {/* Sort & Pagination Info */}
      {totalCount > 0 && (
        <div className="table-controls">
          <div className="sort-controls">
            <span className="sort-label">Sortiraj po:</span>
            <button
              onClick={() => handleSort('id')}
              className={`sort-btn ${sortField === 'id' ? 'active' : ''}`}
            >
              ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`sort-btn ${sortField === 'name' ? 'active' : ''}`}
            >
              Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>

            {/* Pagination Controls na vrhu */}
            {totalPages > 1 && (
              <div className="top-pagination-controls">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Prethodna
                </button>

                <div className="pagination-numbers">
                  {currentPage > 3 && (
                    <>
                      <button onClick={() => handlePageChange(1)} className="pagination-number">
                        1
                      </button>
                      {currentPage > 4 && <span className="pagination-dots">...</span>}
                    </>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page === currentPage ||
                        page === currentPage - 1 ||
                        page === currentPage + 1 ||
                        page === currentPage - 2 ||
                        page === currentPage + 2;
                    })
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="pagination-dots">...</span>}
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
                  Sledeća →
                </button>
              </div>
            )}
          </div>
          
          <div className="items-per-page-control">
            <span className="items-label">Prikaži:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="items-select"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <span className="items-label-suffix">po stranici</span>
          </div>

          <div className="pagination-info">
            <span>
              Prikazano: {startIndex + 1}-{endIndex} od {totalCount}
            </span>
          </div>
        </div>
      )}

      {/* Vendors Table */}
      <div className="table-container">
        {totalCount === 0 ? (
          <div className="no-vendors">
            <p>{searchTerm ? 'Nema rezultata za zadatu pretragu' : 'Nema vendora u sistemu'}</p>
            {!searchTerm && (
              <button onClick={openAddModal} className="btn-add-first">
                Dodaj Prvog Vendora
              </button>
            )}
          </div>
        ) : (
          <table className="vendors-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">
                  ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Adresa</th>
                <th>Grad</th>
                <th>Kontakt</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>PIB</th>
                <th>MB</th>
                <th>Website</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {currentVendors.map((vendor) => (
                <tr key={vendor.idvendor}>
                  <td>{vendor.idvendor}</td>
                  <td className="vendor-name">{vendor.name}</td>
                  <td className="vendor-address">{vendor.address || '-'}</td>
                  <td>{vendor.city || '-'}</td>
                  <td>{vendor.contact_person || '-'}</td>
                  <td>{vendor.phone || '-'}</td>
                  <td className="vendor-email">{vendor.email || '-'}</td>
                  <td>{vendor.vat || '-'}</td>
                  <td>{vendor.mb || '-'}</td>
                  <td className="vendor-website">
                    {vendor.website ? (
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" title={vendor.website}>
                        {vendor.website.length > 30 ? vendor.website.substring(0, 30) + '...' : vendor.website}
                      </a>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="btn-edit"
                        title="Izmeni"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(vendor)}
                        className="btn-delete"
                        title="Obriši"
                      >
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
        )}
      </div>

      {/* Pagination Controls */}
      {totalCount > 0 && totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Prethodna
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
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="pagination-number"
                >
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
              Sledeća →
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingVendor ? 'Izmeni Vendora' : 'Dodaj Novog Vendora'}</h2>
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

            <form onSubmit={handleSubmit} className="vendor-form">
              <div className="form-grid">
                <div className="form-group required">
                  <label htmlFor="name">Naziv Vendora *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Unesite naziv vendora"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact_person">Kontakt Osoba</label>
                  <input
                    type="text"
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="Ime i prezime"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+381 11 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@vendor.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Adresa</label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ulica i broj"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zip">PTT Broj</label>
                  <input
                    type="text"
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="11000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">Grad</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Beograd"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Država</label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Srbija"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vat">PIB</label>
                  <input
                    type="text"
                    id="vat"
                    value={formData.vat}
                    onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                    placeholder="123456789"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mb">Matični Broj</label>
                  <input
                    type="text"
                    id="mb"
                    value={formData.mb}
                    onChange={(e) => setFormData({ ...formData, mb: e.target.value })}
                    placeholder="12345678"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.vendor.com"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-cancel"
                  disabled={submitting}
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner-small"></div>
                      {editingVendor ? 'Čuvanje...' : 'Dodavanje...'}
                    </>
                  ) : (
                    editingVendor ? 'Sačuvaj Izmene' : 'Dodaj Vendora'
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
