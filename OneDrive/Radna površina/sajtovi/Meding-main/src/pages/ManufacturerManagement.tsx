import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import './ManufacturerManagement.css';

interface Manufacturer {
  idmanufacturer: number;
  manufacturer?: string;
  name?: string;
  slug?: string;
  email?: string;
  url?: string;
  active?: boolean;
  description?: string;
  logo?: string;
  country?: string;
  city?: string;
  updated_at?: string;
}

interface ManufacturerFormData {
  manufacturer: string;
  name: string;
  email: string;
  url: string;
  description: string;
  logo: string;
  country: string;
  city: string;
}

type SortField = 'id' | 'name';
type SortOrder = 'asc' | 'desc';

export default function ManufacturerManagement() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [formData, setFormData] = useState<ManufacturerFormData>({
    manufacturer: '',
    name: '',
    email: '',
    url: '',
    description: '',
    logo: '',
    country: 'Srbija',
    city: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    loadManufacturers();
  }, [currentPage, searchTerm, sortField, sortOrder, itemsPerPage]);

  async function checkAuthAndLoadData() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
      await loadManufacturers();
    } catch (error) {
      navigate('/admin/login');
    }
  }

  async function loadManufacturers() {
    setLoading(true);
    console.log(`🔍 Loading manufacturers (page ${currentPage}, ${itemsPerPage} per page)...`);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('manufacturer')
        .select('*', { count: 'exact' });

      // Search filter
      if (searchTerm.trim()) {
        const term = `%${searchTerm}%`;
        query = query.or(`name.ilike.${term},manufacturer.ilike.${term},slug.ilike.${term},city.ilike.${term},country.ilike.${term},email.ilike.${term},url.ilike.${term},description.ilike.${term}`);
      }

      // Sorting
      const sortColumn = sortField === 'id' ? 'idmanufacturer' : sortField;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      console.log(`✅ Loaded ${data?.length || 0} manufacturers (${from + 1}-${Math.min(to + 1, count || 0)} of ${count || 0})`);
      setManufacturers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('❌ Error loading manufacturers:', error);
      setError('Greška pri učitavanju proizvođača');
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
  const currentManufacturers = manufacturers;

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
    setEditingManufacturer(null);
    setFormData({
      manufacturer: '',
      name: '',
      email: '',
      url: '',
      description: '',
      logo: '',
      country: 'Srbija',
      city: ''
    });
    setError('');
    setShowModal(true);
  }

  function openEditModal(manufacturer: Manufacturer) {
    setEditingManufacturer(manufacturer);
    setFormData({
      manufacturer: manufacturer.manufacturer || '',
      name: manufacturer.name || '',
      email: manufacturer.email || '',
      url: manufacturer.url || '',
      description: manufacturer.description || '',
      logo: manufacturer.logo || '',
      country: manufacturer.country || 'Srbija',
      city: manufacturer.city || ''
    });
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingManufacturer(null);
    setError('');
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Naziv proizvođača je obavezan');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const slug = generateSlug(formData.name);
      
      const manufacturerData: any = {
        manufacturer: formData.manufacturer.trim() || null,
        name: formData.name.trim(),
        slug: slug,
        email: formData.email.trim() || null,
        url: formData.url.trim() || null,
        description: formData.description.trim() || null,
        logo: formData.logo.trim() || null,
        country: formData.country.trim() || 'Srbija',
        city: formData.city.trim() || null,
        updated_at: new Date().toISOString()
      };

      if (editingManufacturer) {
        // Update existing manufacturer
        const { error } = await supabase
          .from('manufacturer')
          .update(manufacturerData)
          .eq('idmanufacturer', editingManufacturer.idmanufacturer);

        if (error) throw error;
      } else {
        // Create new manufacturer
        manufacturerData.active = true; // Default active
        const { error } = await supabase
          .from('manufacturer')
          .insert([manufacturerData]);

        if (error) throw error;
      }

      closeModal();
      await loadManufacturers();
    } catch (error: any) {
      console.error('Error saving manufacturer:', error);
      setError(error.message || 'Greška pri čuvanju proizvođača');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(manufacturer: Manufacturer) {
    const newStatus = !manufacturer.active;
    const action = newStatus ? 'aktivirate' : 'blokirate';
    
    if (!window.confirm(`Da li ste sigurni da želite da ${action} proizvođača "${manufacturer.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('manufacturer')
        .update({ 
          active: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('idmanufacturer', manufacturer.idmanufacturer);

      if (error) throw error;

      await loadManufacturers();
    } catch (error: any) {
      console.error('Error toggling manufacturer status:', error);
      alert('Greška pri promeni statusa proizvođača: ' + (error.message || 'Nepoznata greška'));
    }
  }

  async function handleDelete(manufacturer: Manufacturer) {
    if (!window.confirm(`Da li ste sigurni da želite da obrišete proizvođača "${manufacturer.name}"?\n\nNAPOMENA: Proizvodi povezani sa ovim proizvođačem neće biti obrisani.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('manufacturer')
        .delete()
        .eq('idmanufacturer', manufacturer.idmanufacturer);

      if (error) throw error;

      await loadManufacturers();
    } catch (error: any) {
      console.error('Error deleting manufacturer:', error);
      alert('Greška pri brisanju proizvođača: ' + (error.message || 'Nepoznata greška'));
    }
  }

  if (loading) {
    return (
      <div className="manufacturer-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Učitavanje proizvođača...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manufacturer-management">
      {/* Header */}
      <div className="manufacturer-header">
        <div className="manufacturer-header-left">
          <Link to="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Admin Panel
          </Link>
          <h1>Upravljanje Proizvođačima</h1>
          <p className="manufacturer-count">Ukupno proizvođača: {manufacturers.length}</p>
        </div>
        <button onClick={openAddModal} className="btn-add-manufacturer">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
          </svg>
          Dodaj Novog Proizvođača
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
            placeholder="Pretraži po imenu, slug-u, opisu, gradu, email-u..."
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
          <p className="search-results">Pronađeno: {totalCount} proizvođača</p>
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

      {/* Manufacturers Table */}
      <div className="table-container">
        {totalCount === 0 ? (
          <div className="no-manufacturers">
            <p>{searchTerm ? 'Nema rezultata za zadatu pretragu' : 'Nema proizvođača u sistemu'}</p>
            {!searchTerm && (
              <button onClick={openAddModal} className="btn-add-first">
                Dodaj Prvog Proizvođača
              </button>
            )}
          </div>
        ) : (
          <table className="manufacturers-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">
                  ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Slug</th>
                <th>Proizvođač</th>
                <th>Logo</th>
                <th>Email</th>
                <th>Website</th>
                <th>Država</th>
                <th>Grad</th>
                <th>Opis</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {currentManufacturers.map((manufacturer) => (
                <tr key={manufacturer.idmanufacturer} className={!manufacturer.active ? 'inactive-row' : ''}>
                  <td>{manufacturer.idmanufacturer}</td>
                  <td className="manufacturer-name">{manufacturer.name || '-'}</td>
                  <td className="manufacturer-slug">{manufacturer.slug || '-'}</td>
                  <td>{manufacturer.manufacturer || '-'}</td>
                  <td className="manufacturer-logo">
                    {manufacturer.logo ? (
                      <a href={manufacturer.logo} target="_blank" rel="noopener noreferrer" title="Vidi logo">
                        <img src={manufacturer.logo} alt={manufacturer.name} className="logo-thumbnail" />
                      </a>
                    ) : '-'}
                  </td>
                  <td className="manufacturer-email">{manufacturer.email || '-'}</td>
                  <td className="manufacturer-url">
                    {manufacturer.url ? (
                      <a href={manufacturer.url} target="_blank" rel="noopener noreferrer" title={manufacturer.url}>
                        {manufacturer.url.length > 30 ? manufacturer.url.substring(0, 30) + '...' : manufacturer.url}
                      </a>
                    ) : '-'}
                  </td>
                  <td>{manufacturer.country || '-'}</td>
                  <td>{manufacturer.city || '-'}</td>
                  <td className="manufacturer-description" title={manufacturer.description || ''}>
                    {manufacturer.description 
                      ? (manufacturer.description.length > 50 
                          ? manufacturer.description.substring(0, 50) + '...' 
                          : manufacturer.description)
                      : '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${manufacturer.active ? 'status-active' : 'status-inactive'}`}>
                      {manufacturer.active ? 'Aktivan' : 'Blokiran'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(manufacturer)}
                        className="btn-edit"
                        title="Izmeni"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleActive(manufacturer)}
                        className={`btn-block ${manufacturer.active ? 'btn-block-active' : 'btn-unblock'}`}
                        title={manufacturer.active ? 'Blokiraj' : 'Aktiviraj'}
                      >
                        {manufacturer.active ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M11.354 4.646a.5.5 0 0 0-.708 0L8 7.293 5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(manufacturer)}
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
              <h2>{editingManufacturer ? 'Izmeni Proizvođača' : 'Dodaj Novog Proizvođača'}</h2>
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

            <form onSubmit={handleSubmit} className="manufacturer-form">
              <div className="form-grid">
                <div className="form-group required">
                  <label htmlFor="name">Naziv Proizvođača *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Unesite naziv proizvođača"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="manufacturer">Proizvođač (Dodatno ime)</label>
                  <input
                    type="text"
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Dodatni naziv"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@manufacturer.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="url">Website</label>
                  <input
                    type="url"
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.manufacturer.com"
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
                  <label htmlFor="city">Grad</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Beograd"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Opis</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kratak opis proizvođača"
                    rows={3}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="logo">Logo URL</label>
                  <input
                    type="url"
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
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
                      {editingManufacturer ? 'Čuvanje...' : 'Dodavanje...'}
                    </>
                  ) : (
                    editingManufacturer ? 'Sačuvaj Izmene' : 'Dodaj Proizvođača'
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
