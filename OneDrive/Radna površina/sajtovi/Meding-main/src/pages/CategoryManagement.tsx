import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import './CategoryManagement.css';

interface Category {
  idcategory: number;
  name: string;
  slug?: string;
  parent_category?: number;
  sort_order?: number;
  updated_at?: string;
  // Dodatna polja za prikaz
  parent_name?: string;
  generics_count?: number;
  children?: Category[];
  level?: number;
}

interface Generic {
  idgeneric: number;
  name?: string;
  alimsname?: string;
  category_id?: number;
  sinonim?: string;
}

interface CategoryFormData {
  name: string;
  parent_category: string;
  sort_order: string;
}

type SortField = 'id' | 'name' | 'sort_order';
type SortOrder = 'asc' | 'desc';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'flat'>('tree');
  const [sortField, setSortField] = useState<SortField>('sort_order');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parent_category: '',
    sort_order: '0'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Parent selection modal
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentSearchTerm, setParentSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);

  // Generics modal state
  const [showGenericsModal, setShowGenericsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryGenerics, setCategoryGenerics] = useState<Generic[]>([]);
  const [availableGenerics, setAvailableGenerics] = useState<Generic[]>([]);
  const [genericsLoading, setGenericsLoading] = useState(false);
  const [genericSearchTerm, setGenericSearchTerm] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    loadCategories();
  }, [searchTerm, sortField, sortOrder]);

  async function checkAuthAndLoadData() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
      await loadCategories();
    } catch (error) {
      navigate('/admin/login');
    }
  }

  async function loadCategories() {
    setLoading(true);
    console.log('🔍 Loading categories...');
    try {
      // Load categories with parent name
      let query = supabase
        .from('categories')
        .select(`
          *,
          parent:parent_category (name)
        `);

      // Search filter
      if (searchTerm.trim()) {
        const term = `%${searchTerm}%`;
        query = query.or(`name.ilike.${term},slug.ilike.${term}`);
      }

      // Sorting
      const sortColumn = sortField === 'id' ? 'idcategory' : sortField;
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) throw error;

      // Get generics count for each category
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (cat) => {
          // Count generics for this category
          const { count, error: countError } = await supabase
            .from('generic')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', cat.idcategory);

          if (countError) {
            console.error(`Error counting generics for category ${cat.idcategory}:`, countError);
          }

          return {
            ...cat,
            parent_name: (cat.parent as any)?.name || '-',
            generics_count: count || 0
          };
        })
      );

      console.log(`✅ Loaded ${categoriesWithCounts.length} categories with generic counts`);
      
      // Build tree structure
      const tree = buildCategoryTree(categoriesWithCounts);
      setCategories(tree);
      setFlatCategories(categoriesWithCounts);
      setTotalCount(categoriesWithCounts.length);
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      setError('Greška pri učitavanju kategorija');
    } finally {
      setLoading(false);
    }
  }

  function buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map and initialize children arrays
    categories.forEach(cat => {
      categoryMap.set(cat.idcategory, { ...cat, children: [], level: 0 });
    });

    // Second pass: build tree structure
    categories.forEach(cat => {
      const category = categoryMap.get(cat.idcategory)!;
      
      if (cat.parent_category) {
        const parent = categoryMap.get(cat.parent_category);
        if (parent) {
          category.level = (parent.level || 0) + 1;
          parent.children!.push(category);
        } else {
          rootCategories.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    // Sort children by sort_order
    const sortChildren = (cats: Category[]) => {
      cats.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortChildren(cat.children);
        }
      });
    };

    sortChildren(rootCategories);
    return rootCategories;
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  function handleSearchSubmit() {
    setSearchTerm(searchInput);
  }

  function handleSearchClear() {
    setSearchInput('');
    setSearchTerm('');
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  }

  function openAddModal() {
    setEditingCategory(null);
    setFormData({
      name: '',
      parent_category: '',
      sort_order: '0'
    });
    setSelectedParent(null);
    setError('');
    setShowModal(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      parent_category: category.parent_category?.toString() || '',
      sort_order: category.sort_order?.toString() || '0'
    });
    // Set selected parent
    if (category.parent_category) {
      const parent = flatCategories.find(c => c.idcategory === category.parent_category);
      setSelectedParent(parent || null);
    } else {
      setSelectedParent(null);
    }
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setSelectedParent(null);
    setError('');
  }

  function openParentModal() {
    setShowParentModal(true);
    setParentSearchTerm('');
  }

  function closeParentModal() {
    setShowParentModal(false);
    setParentSearchTerm('');
  }

  function selectParent(category: Category | null) {
    setSelectedParent(category);
    setFormData({ ...formData, parent_category: category ? category.idcategory.toString() : '' });
    closeParentModal();
  }

  function getCategoryPath(categoryId: number): string {
    const category = flatCategories.find(c => c.idcategory === categoryId);
    if (!category) return '';
    
    if (category.parent_category) {
      const parentPath = getCategoryPath(category.parent_category);
      return parentPath ? `${parentPath} → ${category.name}` : category.name;
    }
    
    return category.name;
  }

  // Filter categories for parent selection based on search
  function getFilteredCategories(): Category[] {
    if (!parentSearchTerm.trim()) {
      return categories;
    }
    
    const searchLower = parentSearchTerm.toLowerCase();
    
    // Recursive filter function
    function filterCategory(cat: Category): Category | null {
      const matchesSearch = cat.name.toLowerCase().includes(searchLower) || 
                           (cat.slug && cat.slug.toLowerCase().includes(searchLower));
      
      const filteredChildren = cat.children
        ?.map(child => filterCategory(child))
        .filter(c => c !== null) as Category[] || [];
      
      if (matchesSearch || filteredChildren.length > 0) {
        return {
          ...cat,
          children: filteredChildren
        };
      }
      
      return null;
    }
    
    return categories
      .map(cat => filterCategory(cat))
      .filter(c => c !== null) as Category[];
  }

  function generateSlug(name: string): string {
    // Remove Serbian special characters and convert to Latin
    const latinMap: { [key: string]: string } = {
      'š': 's', 'đ': 'dj', 'č': 'c', 'ć': 'c', 'ž': 'z',
      'Š': 's', 'Đ': 'dj', 'Č': 'c', 'Ć': 'c', 'Ž': 'z'
    };
    
    let slug = name;
    Object.keys(latinMap).forEach(key => {
      slug = slug.replace(new RegExp(key, 'g'), latinMap[key]);
    });
    
    return slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Naziv kategorije je obavezan');
      return;
    }

    // Check for circular parent reference
    if (editingCategory && formData.parent_category) {
      const parentId = parseInt(formData.parent_category);
      if (parentId === editingCategory.idcategory) {
        setError('Kategorija ne može biti svoj parent');
        return;
      }
      
      // Check if parent is a child of current category
      const isChildOfCurrent = (categoryId: number, potentialParentId: number): boolean => {
        const category = flatCategories.find(c => c.idcategory === categoryId);
        if (!category || !category.parent_category) return false;
        if (category.parent_category === potentialParentId) return true;
        return isChildOfCurrent(category.parent_category, potentialParentId);
      };
      
      if (isChildOfCurrent(parentId, editingCategory.idcategory)) {
        setError('Ne možete izabrati child kategoriju kao parent');
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      const slug = generateSlug(formData.name);
      
      const categoryData: any = {
        name: formData.name.trim(),
        slug: slug,
        parent_category: formData.parent_category ? parseInt(formData.parent_category) : null,
        sort_order: parseInt(formData.sort_order) || 0,
        updated_at: new Date().toISOString()
      };

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('idcategory', editingCategory.idcategory);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
      }

      closeModal();
      await loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      if (error.code === '23505') {
        setError('Kategorija sa ovim slug-om već postoji');
      } else {
        setError(error.message || 'Greška pri čuvanju kategorije');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function openGenericsModal(category: Category) {
    setSelectedCategory(category);
    setShowGenericsModal(true);
    loadGenericsForCategory(category.idcategory);
  }

  function closeGenericsModal() {
    setShowGenericsModal(false);
    setSelectedCategory(null);
    setCategoryGenerics([]);
    setAvailableGenerics([]);
    setGenericSearchTerm('');
  }

  async function loadGenericsForCategory(categoryId: number) {
    setGenericsLoading(true);
    try {
      // Load all generics
      const { data: allGenericsData, error: allError } = await supabase
        .from('generic')
        .select('*')
        .order('name');

      if (allError) throw allError;

      // Filter generics for this category
      const categoryGens = (allGenericsData || []).filter(g => g.category_id === categoryId);
      const availableGens = (allGenericsData || []).filter(g => !g.category_id || g.category_id === categoryId);

      setCategoryGenerics(categoryGens);
      setAvailableGenerics(availableGens);
    } catch (error) {
      console.error('Error loading generics:', error);
      alert('Greška pri učitavanju generika');
    } finally {
      setGenericsLoading(false);
    }
  }

  async function handleAddGenericToCategory(generic: Generic) {
    if (!selectedCategory) return;

    try {
      const { error } = await supabase
        .from('generic')
        .update({ category_id: selectedCategory.idcategory })
        .eq('idgeneric', generic.idgeneric);

      if (error) throw error;

      // Reload generics
      await loadGenericsForCategory(selectedCategory.idcategory);
      await loadCategories();
    } catch (error: any) {
      console.error('Error adding generic to category:', error);
      alert('Greška pri dodavanju generika: ' + (error.message || 'Nepoznata greška'));
    }
  }

  async function handleRemoveGenericFromCategory(generic: Generic) {
    if (!selectedCategory) return;

    if (!window.confirm(`Da li ste sigurni da želite da uklonite generik "${generic.name}" iz kategorije "${selectedCategory.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('generic')
        .update({ category_id: null })
        .eq('idgeneric', generic.idgeneric);

      if (error) throw error;

      // Reload generics
      await loadGenericsForCategory(selectedCategory.idcategory);
      await loadCategories();
    } catch (error: any) {
      console.error('Error removing generic from category:', error);
      alert('Greška pri uklanjanju generika: ' + (error.message || 'Nepoznata greška'));
    }
  }

  async function handleDelete(category: Category) {
    // Check if category has children
    const hasChildren = flatCategories.some(c => c.parent_category === category.idcategory);
    
    if (hasChildren) {
      alert('Ne možete obrisati kategoriju koja ima podkategorije. Prvo obrišite ili premestite podkategorije.');
      return;
    }

    // Check if category has generics
    if (category.generics_count && category.generics_count > 0) {
      if (!window.confirm(
        `Kategorija "${category.name}" ima ${category.generics_count} generik(a) povezanih.\n\n` +
        'Da li ste sigurni da želite da obrišete ovu kategoriju?\n\n' +
        'NAPOMENA: Generici neće biti obrisani, samo će ostati bez kategorije.'
      )) {
        return;
      }
    } else {
      if (!window.confirm(`Da li ste sigurni da želite da obrišete kategoriju "${category.name}"?`)) {
        return;
      }
    }

    try {
      // PRVO: Ukloni sve generike iz ove kategorije
      if (category.generics_count && category.generics_count > 0) {
        console.log(`🔄 Uklanjanje ${category.generics_count} generika iz kategorije "${category.name}"...`);
        
        const { error: updateError } = await supabase
          .from('generic')
          .update({ category_id: null })
          .eq('category_id', category.idcategory);

        if (updateError) {
          console.error('❌ Greška pri uklanjanju generika:', updateError);
          throw updateError;
        }

        console.log('✅ Generici uspešno uklonjeni iz kategorije');
      }

      // DRUGO: Obriši kategoriju
      console.log(`🗑️ Brisanje kategorije "${category.name}"...`);
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('idcategory', category.idcategory);

      if (error) throw error;

      console.log('✅ Kategorija uspešno obrisana');
      await loadCategories();
    } catch (error: any) {
      console.error('❌ Greška pri brisanju kategorije:', error);
      alert('Greška pri brisanju kategorije: ' + (error.message || 'Nepoznata greška'));
    }
  }

  if (loading) {
    return (
      <div className="category-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Učitavanje kategorija...</p>
        </div>
      </div>
    );
  }

  const displayCategories = viewMode === 'tree' ? categories : flatCategories;

  return (
    <div className="category-management">
      {/* Header */}
      <div className="category-header">
        <div className="category-header-left">
          <Link to="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Admin Panel
          </Link>
          <h1>Upravljanje Kategorijama</h1>
          <p className="category-count">Ukupno kategorija: {totalCount}</p>
        </div>
        <button onClick={openAddModal} className="btn-add-category">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
          </svg>
          Dodaj Novu Kategoriju
        </button>
      </div>

      {/* Search Bar & View Mode */}
      <div className="search-container">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Pretraži po nazivu ili slug-u..."
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
        
        <div className="view-mode-toggle">
          <span className="view-label">Prikaz:</span>
          <button
            onClick={() => setViewMode('tree')}
            className={`view-btn ${viewMode === 'tree' ? 'active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z"/>
            </svg>
            Stablo
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={`view-btn ${viewMode === 'flat' ? 'active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
            </svg>
            Lista
          </button>
        </div>
        
        {searchTerm && (
          <p className="search-results">Pronađeno: {totalCount} kategorija</p>
        )}
      </div>

      {/* Sort Controls */}
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
            <button
              onClick={() => handleSort('sort_order')}
              className={`sort-btn ${sortField === 'sort_order' ? 'active' : ''}`}
            >
              Redosled {sortField === 'sort_order' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      )}

      {/* Categories Display */}
      <div className="table-container">
        {totalCount === 0 ? (
          <div className="no-categories">
            <p>{searchTerm ? 'Nema rezultata za zadatu pretragu' : 'Nema kategorija u sistemu'}</p>
            {!searchTerm && (
              <button onClick={openAddModal} className="btn-add-first">
                Dodaj Prvu Kategoriju
              </button>
            )}
          </div>
        ) : viewMode === 'tree' ? (
          <div className="categories-tree">
            <CategoryTreeView
              categories={displayCategories as Category[]}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onManageGenerics={openGenericsModal}
            />
          </div>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">
                  ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Naziv {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Parent Kategorija</th>
                <th onClick={() => handleSort('sort_order')} className="sortable-header">
                  Redosled {sortField === 'sort_order' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Generici</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {displayCategories.map((category) => (
                <tr key={category.idcategory}>
                  <td>{category.idcategory}</td>
                  <td className="category-name">{category.name}</td>
                  <td className="category-parent">
                    {category.parent_name && category.parent_name !== '-' ? (
                      <span className="parent-badge">📁 {category.parent_name}</span>
                    ) : (
                      <span className="parent-badge root">🏠 ROOT</span>
                    )}
                  </td>
                  <td className="category-order">{category.sort_order || 0}</td>
                  <td className="category-generics">
                    <button
                      onClick={() => openGenericsModal(category)}
                      className="generics-badge-btn"
                      title="Upravljaj genericima"
                    >
                      <span className="generics-badge">{category.generics_count || 0}</span>
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openGenericsModal(category)}
                        className="btn-link"
                        title="Poveži generike"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditModal(category)}
                        className="btn-edit"
                        title="Izmeni"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCategory ? 'Izmeni Kategoriju' : 'Dodaj Novu Kategoriju'}</h2>
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

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-grid">
                <div className="form-group required full-width">
                  <label htmlFor="name">Naziv Kategorije *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Unesite naziv kategorije"
                    required
                  />
                  <small className="form-hint">
                    Slug će biti automatski generisan iz naziva: <strong>{generateSlug(formData.name) || '(prazan)'}</strong>
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="parent_category">Parent Kategorija</label>
                  <button
                    type="button"
                    onClick={openParentModal}
                    className="parent-selector-btn"
                  >
                    <span className="parent-selector-icon">
                      {selectedParent ? '📂' : '🏠'}
                    </span>
                    <span className="parent-selector-text">
                      {selectedParent ? (
                        <>
                          <span className="parent-name">{selectedParent.name}</span>
                          <span className="parent-path">{getCategoryPath(selectedParent.idcategory)}</span>
                        </>
                      ) : (
                        <span className="parent-name">ROOT (Nema Parent-a)</span>
                      )}
                    </span>
                    <svg className="parent-selector-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  {selectedParent && (
                    <button
                      type="button"
                      onClick={() => selectParent(null)}
                      className="clear-parent-btn"
                    >
                      ✕ Obriši selekciju
                    </button>
                  )}
                  <small className="form-hint">
                    Kliknite da izaberete parent kategoriju ili ostavite ROOT za glavnu kategoriju
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="sort_order">Redosled Sortiranja</label>
                  <input
                    type="number"
                    id="sort_order"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                  <small className="form-hint">Manji broj = viši prioritet u prikazu</small>
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
                      {editingCategory ? 'Čuvanje...' : 'Dodavanje...'}
                    </>
                  ) : (
                    editingCategory ? 'Sačuvaj Izmene' : 'Dodaj Kategoriju'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parent Category Selection Modal */}
      {showParentModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-parent-selector">
            <div className="modal-header">
              <h2>Izaberite Parent Kategoriju</h2>
              <button onClick={closeParentModal} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="parent-modal-search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Pretraži kategorije po nazivu ili slug-u..."
                value={parentSearchTerm}
                onChange={(e) => setParentSearchTerm(e.target.value)}
                className="parent-search-input"
                autoFocus
              />
              {parentSearchTerm && (
                <button
                  onClick={() => setParentSearchTerm('')}
                  className="clear-search-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              )}
            </div>

            {/* ROOT Option */}
            <div className="parent-options-container">
              <button
                type="button"
                onClick={() => selectParent(null)}
                className={`parent-option-item root-option ${!selectedParent ? 'selected' : ''}`}
              >
                <span className="parent-option-icon">🏠</span>
                <div className="parent-option-info">
                  <span className="parent-option-name">ROOT</span>
                  <span className="parent-option-desc">Glavna kategorija bez parent-a</span>
                </div>
                {!selectedParent && (
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>

              {/* Category Tree */}
              <ParentSelectorTree
                categories={getFilteredCategories()}
                selectedParent={selectedParent}
                onSelect={selectParent}
                editingCategoryId={editingCategory?.idcategory}
                getCategoryPath={getCategoryPath}
              />
            </div>

            <div className="modal-footer">
              <button onClick={closeParentModal} className="btn-close-modal">
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generics Modal */}
      {showGenericsModal && selectedCategory && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h2>Generici za kategoriju: {selectedCategory.name}</h2>
              <button onClick={closeGenericsModal} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            {genericsLoading ? (
              <div className="modal-loading">
                <div className="spinner"></div>
                <p>Učitavanje generika...</p>
              </div>
            ) : (
              <div className="generics-modal-content">
                <div className="generics-section">
                  <h3>Povezani Generici ({categoryGenerics.length})</h3>
                  {categoryGenerics.length === 0 ? (
                    <p className="no-data">Nema povezanih generika</p>
                  ) : (
                    <div className="generics-list">
                      {categoryGenerics.map(generic => (
                        <div key={generic.idgeneric} className="generic-item">
                          <div className="generic-info">
                            <span className="generic-name">{generic.name || '-'}</span>
                            {generic.alimsname && (
                              <span className="generic-alims">{generic.alimsname}</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveGenericFromCategory(generic)}
                            className="btn-remove"
                            title="Ukloni iz kategorije"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="generics-section">
                  <div className="section-header">
                    <h3>Dostupni Generici ({availableGenerics.filter(g => !g.category_id).length})</h3>
                    <input
                      type="text"
                      placeholder="Pretraži generike..."
                      value={genericSearchTerm}
                      onChange={(e) => setGenericSearchTerm(e.target.value)}
                      className="generic-search"
                    />
                  </div>
                  {availableGenerics.filter(g => 
                    !g.category_id && 
                    (genericSearchTerm === '' || 
                     (g.name && g.name.toLowerCase().includes(genericSearchTerm.toLowerCase())) ||
                     (g.alimsname && g.alimsname.toLowerCase().includes(genericSearchTerm.toLowerCase())))
                  ).length === 0 ? (
                    <p className="no-data">Nema dostupnih generika</p>
                  ) : (
                    <div className="generics-list">
                      {availableGenerics
                        .filter(g => 
                          !g.category_id && 
                          (genericSearchTerm === '' || 
                           (g.name && g.name.toLowerCase().includes(genericSearchTerm.toLowerCase())) ||
                           (g.alimsname && g.alimsname.toLowerCase().includes(genericSearchTerm.toLowerCase())))
                        )
                        .map(generic => (
                          <div key={generic.idgeneric} className="generic-item">
                            <div className="generic-info">
                              <span className="generic-name">{generic.name || '-'}</span>
                              {generic.alimsname && (
                                <span className="generic-alims">{generic.alimsname}</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddGenericToCategory(generic)}
                              className="btn-add"
                              title="Dodaj u kategoriju"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button onClick={closeGenericsModal} className="btn-close-modal">
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Parent Selector Tree Component
function ParentSelectorTree({
  categories,
  selectedParent,
  onSelect,
  editingCategoryId,
  getCategoryPath,
  level = 0
}: {
  categories: Category[];
  selectedParent: Category | null;
  onSelect: (category: Category) => void;
  editingCategoryId?: number;
  getCategoryPath: (id: number) => string;
  level?: number;
}) {
  return (
    <div className={`parent-tree-level level-${level}`}>
      {categories.map((category) => {
        // Can't select itself as parent
        if (editingCategoryId && category.idcategory === editingCategoryId) {
          return null;
        }

        const isSelected = selectedParent?.idcategory === category.idcategory;
        const fullPath = getCategoryPath(category.idcategory);

        return (
          <div key={category.idcategory} className="parent-tree-item">
            <button
              type="button"
              onClick={() => onSelect(category)}
              className={`parent-option-item ${isSelected ? 'selected' : ''}`}
            >
              <span className="parent-option-icon">
                {level === 0 ? '📁' : level === 1 ? '📂' : '📄'}
              </span>
              <div className="parent-option-info">
                <span className="parent-option-name">{category.name}</span>
                <span className="parent-option-desc">
                  {fullPath}
                  {category.generics_count ? ` • ${category.generics_count} generika` : ''}
                </span>
              </div>
              {isSelected && (
                <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
            
            {category.children && category.children.length > 0 && (
              <ParentSelectorTree
                categories={category.children}
                selectedParent={selectedParent}
                onSelect={onSelect}
                editingCategoryId={editingCategoryId}
                getCategoryPath={getCategoryPath}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Tree View Component
function CategoryTreeView({
  categories,
  onEdit,
  onDelete,
  onManageGenerics,
  level = 0
}: {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onManageGenerics: (category: Category) => void;
  level?: number;
}) {
  return (
    <div className={`tree-level level-${level}`}>
      {categories.map((category) => (
        <div key={category.idcategory} className="tree-item">
          <div className="tree-node">
            <div className="tree-node-content">
              <div className="tree-node-info">
                <span className="tree-node-name">{category.name}</span>
                {category.parent_name && category.parent_name !== '-' ? (
                  <span className="tree-node-parent">
                    📁 Parent: {category.parent_name}
                  </span>
                ) : (
                  <span className="tree-node-parent root-category">
                    🏠 ROOT Kategorija
                  </span>
                )}
                {category.generics_count !== undefined && (
                  <button
                    onClick={() => onManageGenerics(category)}
                    className="generics-badge-btn"
                    title="Upravljaj genericima"
                  >
                    <span className="generics-badge">{category.generics_count} generika</span>
                  </button>
                )}
                <span className="tree-node-order">Redosled: {category.sort_order || 0}</span>
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => onManageGenerics(category)}
                  className="btn-link"
                  title="Poveži generike"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(category)}
                  className="btn-edit"
                  title="Izmeni"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="btn-delete"
                  title="Obriši"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </div>
            {category.children && category.children.length > 0 && (
              <CategoryTreeView
                categories={category.children}
                onEdit={onEdit}
                onDelete={onDelete}
                onManageGenerics={onManageGenerics}
                level={level + 1}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

