import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import './GenericManagement.css';

interface Generic {
  idgeneric: number;
  alimsname?: string;
  name?: string;
  category_id?: number;
  category_name?: string;
  sinonim?: string;
}

interface GenericFormData {
  alimsname: string;
  name: string;
  category_id: string;
  sinonim: string;
}

interface Category {
  idcategory: number;
  name: string;
}

type SortField = 'id' | 'name';
type SortOrder = 'asc' | 'desc';

export default function GenericManagement() {
  const [generics, setGenerics] = useState<Generic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGeneric, setEditingGeneric] = useState<Generic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [formData, setFormData] = useState<GenericFormData>({
    alimsname: '',
    name: '',
    category_id: '',
    sinonim: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    loadGenerics();
  }, [currentPage, searchTerm, sortField, sortOrder, itemsPerPage]);

  async function checkAuthAndLoadData() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
      await Promise.all([
        loadCategories(),
        loadGenerics()
      ]);
    } catch (error) {
      navigate('/admin/login');
    }
  }

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('idcategory, name')
      .order('name');
    if (data) setCategories(data);
  }

  async function loadGenerics() {
    setLoading(true);
    console.log(`🔍 Loading generics (page ${currentPage}, ${itemsPerPage} per page)...`);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('generic')
        .select(`
          *,
          category:category_id (name)
        `, { count: 'exact' });

      // Search filter
      if (searchTerm.trim()) {
        const term = `%${searchTerm}%`;
        query = query.or(`name.ilike.${term},alimsname.ilike.${term},sinonim.ilike.${term}`);
      }

      // Sorting
      const sortColumn = sortField === 'id' ? 'idgeneric' : sortField;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Map category name
      const mappedData = (data || []).map(g => ({
        ...g,
        category_name: (g.category as any)?.name || '-'
      }));

      console.log(`✅ Loaded ${mappedData.length} generics (${from + 1}-${Math.min(to + 1, count || 0)} of ${count || 0})`);
      setGenerics(mappedData);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('❌ Error loading generics:', error);
      setError('Greška pri učitavanju generičkih naziva');
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
  const currentGenerics = generics;

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
    setEditingGeneric(null);
    setFormData({
      alimsname: '',
      name: '',
      category_id: '',
      sinonim: ''
    });
    setError('');
    setShowModal(true);
  }

  function openEditModal(generic: Generic) {
    setEditingGeneric(generic);
    setFormData({
      alimsname: generic.alimsname || '',
      name: generic.name || '',
      category_id: generic.category_id?.toString() || '',
      sinonim: generic.sinonim || ''
    });
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingGeneric(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Naziv je obavezan');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const genericData: any = {
        name: formData.name.trim(),
        alimsname: formData.alimsname.trim() || null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        sinonim: formData.sinonim.trim() || null
      };

      if (editingGeneric) {
        // Update existing generic
        const { error } = await supabase
          .from('generic')
          .update(genericData)
          .eq('idgeneric', editingGeneric.idgeneric);

        if (error) throw error;
      } else {
        // Create new generic
        const { error } = await supabase
          .from('generic')
          .insert([genericData]);

        if (error) throw error;
      }

      closeModal();
      await loadGenerics();
    } catch (error: any) {
      console.error('Error saving generic:', error);
      setError(error.message || 'Greška pri čuvanju generičkog naziva');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(generic: Generic) {
    if (!window.confirm(`Da li ste sigurni da želite da obrišete generički naziv "${generic.name}"?\n\nNAPOMENA: Proizvodi povezani sa ovim generičkim nazivom neće biti obrisani.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('generic')
        .delete()
        .eq('idgeneric', generic.idgeneric);

      if (error) throw error;

      await loadGenerics();
    } catch (error: any) {
      console.error('Error deleting generic:', error);
      alert('Greška pri brisanju generičkog naziva: ' + (error.message || 'Nepoznata greška'));
    }
  }

  if (loading) {
    return (
      <div className="generic-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Učitavanje generičkih naziva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="generic-management">
      {/* Header */}
      <div className="generic-header">
        <div className="generic-header-left">
          <Link to="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Admin Panel
          </Link>
          <h1>Upravljanje Generičkim Nazivima</h1>
          <p className="generic-count">Ukupno generičkih naziva: {generics.length}</p>
        </div>
        <button onClick={openAddModal} className="btn-add-generic">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
          </svg>
          Dodaj Novi Generički Naziv
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
            placeholder="Pretraži po nazivu, ALIMS nazivu ili sinonimu..."
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
          <p className="search-results">Pronađeno: {totalCount} generičkih naziva</p>
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

      {/* Generics Table */}
      <div className="table-container">
        {totalCount === 0 ? (
          <div className="no-generics">
            <p>{searchTerm ? 'Nema rezultata za zadatu pretragu' : 'Nema generičkih naziva u sistemu'}</p>
            {!searchTerm && (
              <button onClick={openAddModal} className="btn-add-first">
                Dodaj Prvi Generički Naziv
              </button>
            )}
          </div>
        ) : (
          <table className="generics-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">
                  ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>ALIMS Naziv</th>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Kategorija</th>
                <th>Sinonim</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {currentGenerics.map((generic) => (
                <tr key={generic.idgeneric}>
                  <td>{generic.idgeneric}</td>
                  <td className="generic-alims">{generic.alimsname || '-'}</td>
                  <td className="generic-name">{generic.name || '-'}</td>
                  <td className="generic-category">{generic.category_name || '-'}</td>
                  <td className="generic-sinonim">{generic.sinonim || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(generic)}
                        className="btn-edit"
                        title="Izmeni"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(generic)}
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
              <h2>{editingGeneric ? 'Izmeni Generički Naziv' : 'Dodaj Novi Generički Naziv'}</h2>
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

            <form onSubmit={handleSubmit} className="generic-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="alimsname">ALIMS Naziv</label>
                  <input
                    type="text"
                    id="alimsname"
                    value={formData.alimsname}
                    onChange={(e) => setFormData({ ...formData, alimsname: e.target.value })}
                    placeholder="Unesite ALIMS naziv"
                    disabled={!!editingGeneric}
                    className={editingGeneric ? 'input-disabled' : ''}
                  />
                  {editingGeneric && (
                    <small style={{color: '#666', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block'}}>
                      ALIMS naziv ne može biti promenjen nakon kreiranja
                    </small>
                  )}
                </div>

                <div className="form-group required full-width">
                  <label htmlFor="name">Naziv *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Unesite naziv"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="category_id">Kategorija</label>
                  <select
                    id="category_id"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">-- Izaberi Kategoriju --</option>
                    {categories.map(cat => (
                      <option key={cat.idcategory} value={cat.idcategory}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="sinonim">Sinonim</label>
                  <input
                    type="text"
                    id="sinonim"
                    value={formData.sinonim}
                    onChange={(e) => setFormData({ ...formData, sinonim: e.target.value })}
                    placeholder="Unesite sinonim"
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
                      {editingGeneric ? 'Čuvanje...' : 'Dodavanje...'}
                    </>
                  ) : (
                    editingGeneric ? 'Sačuvaj Izmene' : 'Dodaj Generički Naziv'
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
