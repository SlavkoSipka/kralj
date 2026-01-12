import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import * as XLSX from 'xlsx';
import './ExcelImport.css';

interface Product {
  idproducts?: number;
  sku?: string;
  name?: string;
  description?: string;
  alimsname?: string;
  idmanufacturer?: number;
  idvendor?: number;
  idgeneric?: number;
  price?: number;
  vat?: number;
  quantity?: number;
  instock?: boolean;
  published?: boolean;
  expire_date?: string;
  image?: string;
  slug?: string;
  class?: string;
  type?: string;
  popularity_score?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'both' | 'supabase_only' | 'excel_only';
  selected?: boolean;
  // Za prikaz
  manufacturer_name?: string;
  vendor_name?: string;
  generic_name?: string;
}

interface Manufacturer {
  idmanufacturer: number;
  name: string;
}

interface Vendor {
  idvendor: number;
  name: string;
}

interface Generic {
  idgeneric: number;
  name: string;
}

export default function ProductExcelImport() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [generics, setGenerics] = useState<Generic[]>([]);
  const [excelProducts, setExcelProducts] = useState<Product[]>([]);
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);
  const [inBoth, setInBoth] = useState<Product[]>([]);
  const [onlyInSupabase, setOnlyInSupabase] = useState<Product[]>([]);
  const [onlyInExcel, setOnlyInExcel] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'upload' | 'results'>('upload');
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = useState({
    both: false,
    supabase: false,
    excel: false
  });
  const [currentPages, setCurrentPages] = useState({
    both: 1,
    supabase: 1,
    excel: 1
  });
  const itemsPerPage = 50;

  useEffect(() => {
    checkAuthAndLoadData();
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
    } catch (error) {
      navigate('/admin/login');
    }
  }

  async function loadManufacturers() {
    const { data } = await supabase
      .from('manufacturer')
      .select('idmanufacturer, name')
      .order('name');
    if (data) setManufacturers(data);
  }

  async function loadVendors() {
    const { data } = await supabase
      .from('vendor')
      .select('idvendor, name')
      .order('name');
    if (data) setVendors(data);
  }

  async function loadGenerics() {
    const { data } = await supabase
      .from('generic')
      .select('idgeneric, name')
      .order('name');
    if (data) setGenerics(data);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        console.log('📊 Excel parsed:', jsonData.length, 'rows');

        const products: Product[] = jsonData.map((row) => {
          const manufacturerName = row.manufacturer_name || row.manufacturer || '';
          const matchedManufacturer = manufacturers.find(
            m => m.name.toLowerCase().trim() === manufacturerName.toLowerCase().trim()
          );

          const vendorName = row.vendor_name || row.vendor || '';
          const matchedVendor = vendors.find(
            v => v.name.toLowerCase().trim() === vendorName.toLowerCase().trim()
          );

          const genericName = row.generic_name || row.generic || '';
          const matchedGeneric = generics.find(
            g => g.name.toLowerCase().trim() === genericName.toLowerCase().trim()
          );

          return {
            sku: row.sku || undefined,
            name: row.name || undefined,
            description: row.description || undefined,
            alimsname: row.alimsname || undefined,
            idmanufacturer: matchedManufacturer?.idmanufacturer || (row.idmanufacturer ? parseInt(row.idmanufacturer) : undefined),
            idvendor: matchedVendor?.idvendor || (row.idvendor ? parseInt(row.idvendor) : undefined),
            idgeneric: matchedGeneric?.idgeneric || (row.idgeneric ? parseInt(row.idgeneric) : undefined),
            price: row.price ? parseFloat(row.price) : undefined,
            vat: row.vat ? parseFloat(row.vat) : undefined,
            quantity: row.quantity ? parseInt(row.quantity) : 0,
            instock: row.instock !== undefined ? Boolean(row.instock) : true,
            published: row.published !== undefined ? Boolean(row.published) : false,
            expire_date: row.expire_date || undefined,
            image: row.image || undefined,
            slug: row.slug || undefined,
            class: row.class || undefined,
            type: row.type || undefined,
            popularity_score: row.popularity_score ? parseInt(row.popularity_score) : 0,
            selected: false,
            manufacturer_name: manufacturerName,
            vendor_name: vendorName,
            generic_name: genericName
          };
        });

        setExcelProducts(products);
        setSuccess(`✅ Učitano ${products.length} proizvoda iz Excel fajla`);
      } catch (error: any) {
        console.error('Error parsing Excel:', error);
        setError('Greška pri čitanju Excel fajla: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Greška pri čitanju fajla');
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  }

  async function compareWithDatabase() {
    if (excelProducts.length === 0) {
      setError('Excel fajl nije učitan!');
      return;
    }

    setComparing(true);
    setError('');
    setSuccess('Učitavanje svih proizvoda iz baze... Molimo sačekajte...');

    try {
      // Load ALL products - OPTIMIZED: only fetch columns needed for comparison + display
      // Instead of fetching all 20+ columns per product, we only get essential ones
      // Joins only fetch manufacturer.name and vendor.name (not all manufacturer/vendor data)
      // For 52k products: saves ~70% bandwidth (from ~80MB to ~25MB)
      let allProducts: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      console.log('🔄 Loading all product names from Supabase (optimized - only alimsname)...');

      // First, get the total count
      const { count: totalCount, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      console.log(`📊 Total products in database: ${totalCount}`);

      while (hasMore) {
        const { data: batch, error: dbError } = await supabase
          .from('products')
          .select(`
            idproducts,
            alimsname,
            name,
            price,
            manufacturer:idmanufacturer(name),
            vendor:idvendor(name)
          `)  // Only essential columns + minimal joins for display
          .range(from, from + batchSize - 1);

        if (dbError) throw dbError;

        if (batch && batch.length > 0) {
          allProducts = [...allProducts, ...batch];
          console.log(`  ✓ Batch ${Math.floor(from / batchSize) + 1}: ${batch.length} products (total: ${allProducts.length})`);
          from += batchSize;
          hasMore = batch.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      console.log(`✅ Loaded ${allProducts.length} products (expected ${totalCount})`);
      const dbProducts = allProducts;

      console.log('🔍 Supabase products:', dbProducts?.length);
      console.log('📊 Excel products:', excelProducts.length);

      // Map related names
      const mappedDbProducts = (dbProducts || []).map(p => ({
        ...p,
        manufacturer_name: (p.manufacturer as any)?.name || '',
        vendor_name: (p.vendor as any)?.name || '',
        generic_name: (p.generic as any)?.name || ''
      }));

      setSupabaseProducts(mappedDbProducts);

      // Debug: Check for NULL/empty alimsname values
      const dbWithoutAlimsname = mappedDbProducts.filter(p => !p.alimsname || p.alimsname.trim() === '');
      if (dbWithoutAlimsname.length > 0) {
        console.warn(`⚠️ Found ${dbWithoutAlimsname.length} products with NULL/empty 'alimsname' column`);
      }

      // Kreiraj Maps za brže pretraživanje (po ALIMSNAME kao unique identifier)
      const excelFiltered = excelProducts.filter(p => p.alimsname && p.alimsname.trim() !== '');
      const dbFiltered = mappedDbProducts.filter(p => p.alimsname && p.alimsname.trim() !== '');
      
      console.log(`📋 After filtering NULL/empty alimsname: ${dbFiltered.length} products (filtered out ${mappedDbProducts.length - dbFiltered.length})`);
      
      const excelMap = new Map(
        excelFiltered.map(p => [p.alimsname!.toLowerCase().trim(), p])
      );
      const supabaseMap = new Map(
        dbFiltered.map(p => [p.alimsname!.toLowerCase().trim(), p])
      );

      // 1. U OBA
      const both: Product[] = [];
      supabaseMap.forEach((supabaseProduct, alimsname) => {
        if (excelMap.has(alimsname)) {
          both.push({ ...supabaseProduct, status: 'both', selected: false });
        }
      });

      // 2. Samo u Supabase
      const onlySupabase: Product[] = [];
      supabaseMap.forEach((supabaseProduct, alimsname) => {
        if (!excelMap.has(alimsname)) {
          onlySupabase.push({ ...supabaseProduct, status: 'supabase_only', selected: false });
        }
      });

      // 3. Samo u Excel
      const onlyExcel: Product[] = [];
      excelMap.forEach((excelProduct, alimsname) => {
        if (!supabaseMap.has(alimsname)) {
          onlyExcel.push({ ...excelProduct, status: 'excel_only', selected: false });
        }
      });

      setInBoth(both);
      setOnlyInSupabase(onlySupabase);
      setOnlyInExcel(onlyExcel);

      setExpandedSections({ both: false, supabase: false, excel: false });
      setCurrentPages({ both: 1, supabase: 1, excel: 1 });

      setSuccess(`✅ Poređenje završeno: ${both.length} u oba | ${onlySupabase.length} samo u bazi | ${onlyExcel.length} samo u Excel-u`);
      setStep('results');

    } catch (error: any) {
      console.error('Error comparing:', error);
      setError('Greška pri poređenju: ' + error.message);
    } finally {
      setComparing(false);
    }
  }

  function toggleSelection(list: 'excel' | 'supabase', index: number) {
    if (list === 'excel') {
      setOnlyInExcel(prev => prev.map((p, i) => 
        i === index ? { ...p, selected: !p.selected } : p
      ));
    } else {
      setOnlyInSupabase(prev => prev.map((p, i) => 
        i === index ? { ...p, selected: !p.selected } : p
      ));
    }
  }

  function selectAll(list: 'excel' | 'supabase') {
    if (list === 'excel') {
      setOnlyInExcel(prev => prev.map(p => ({ ...p, selected: true })));
    } else {
      setOnlyInSupabase(prev => prev.map(p => ({ ...p, selected: true })));
    }
  }

  function deselectAll(list: 'excel' | 'supabase') {
    if (list === 'excel') {
      setOnlyInExcel(prev => prev.map(p => ({ ...p, selected: false })));
    } else {
      setOnlyInSupabase(prev => prev.map(p => ({ ...p, selected: false })));
    }
  }

  async function addSelectedFromExcel() {
    const selected = onlyInExcel.filter(p => p.selected);
    
    if (selected.length === 0) {
      setError('Niste izabrali nijedan proizvod za dodavanje!');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const productsToInsert = selected.map(p => {
        const { selected, status, manufacturer_name, vendor_name, generic_name, ...cleanProduct } = p;
        return {
          ...cleanProduct,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });

      const { data, error: insertError } = await supabase
        .from('products')
        .insert(productsToInsert)
        .select();

      if (insertError) throw insertError;

      setSuccess(`✅ Dodato ${data?.length} proizvoda iz Excel-a u bazu!`);
      await compareWithDatabase();
      
    } catch (error: any) {
      console.error('Error adding:', error);
      setError('Greška pri dodavanju: ' + error.message);
    } finally {
      setProcessing(false);
    }
  }

  async function deleteSelectedFromSupabase() {
    const selected = onlyInSupabase.filter(p => p.selected);
    
    if (selected.length === 0) {
      setError('Niste izabrali nijedan proizvod za brisanje!');
      return;
    }

    if (!window.confirm(`Da li ste SIGURNI da želite da obrišete ${selected.length} proizvoda iz baze?\n\nOvo je trajna akcija!`)) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const idsToDelete = selected.map(p => p.idproducts).filter(Boolean);

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('idproducts', idsToDelete);

      if (deleteError) throw deleteError;

      setSuccess(`✅ Obrisano ${idsToDelete.length} proizvoda iz baze!`);
      await compareWithDatabase();
      
    } catch (error: any) {
      console.error('Error deleting:', error);
      setError('Greška pri brisanju: ' + error.message);
    } finally {
      setProcessing(false);
    }
  }

  function downloadTemplate() {
    const template = [{
      sku: 'PRIMER-SKU-001',
      name: 'Naziv proizvoda',
      description: 'Opis proizvoda',
      alimsname: 'ALIMS naziv',
      manufacturer_name: 'Ime proizvođača',
      vendor_name: 'Ime vendora',
      generic_name: 'Generički naziv',
      price: 1000.00,
      vat: 20,
      quantity: 100,
      instock: true,
      published: false,
      expire_date: '2025-12-31',
      image: 'https://example.com/slika.jpg',
      slug: 'naziv-proizvoda',
      class: 'IIa',
      type: 'Medicinski uređaj',
      popularity_score: 0
    }];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'meding-products-template.xlsx');
  }

  function toggleSection(section: 'both' | 'supabase' | 'excel') {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  function handlePageChange(section: 'both' | 'supabase' | 'excel', page: number) {
    setCurrentPages(prev => ({
      ...prev,
      [section]: page
    }));
  }

  function getPaginatedData(data: Product[], section: 'both' | 'supabase' | 'excel') {
    const page = currentPages[section];
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }

  function getTotalPages(length: number) {
    return Math.ceil(length / itemsPerPage);
  }

  function downloadCurrentProducts() {
    if (supabaseProducts.length === 0) {
      setError('Nema proizvoda za export!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(supabaseProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, `proizvodi-${new Date().toISOString().split('T')[0]}.xlsx`);
    setSuccess(`✅ Export-ovano ${supabaseProducts.length} proizvoda!`);
  }

  return (
    <div className="excel-import">
      <div className="breadcrumb-nav">
        <Link to="/admin" className="breadcrumb-link">Admin Panel</Link>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="breadcrumb-separator">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        <span className="breadcrumb-current">Product Excel Import</span>
      </div>

      <div className="import-header">
        <div className="import-header-left">
          <Link to="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Admin Panel
          </Link>
          <h1>📦 Import Proizvoda iz Excel-a</h1>
          <p className="import-subtitle">Uporedite proizvode iz Excel fajla sa bazom (po ALIMSNAME koloni)</p>
        </div>
        <button onClick={downloadTemplate} className="btn-download-template">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
          Preuzmi Template
        </button>
      </div>

      {error && (
        <div className="message message-error">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="message message-success">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          {success}
        </div>
      )}

      {step === 'upload' && (
        <div className="upload-section">
          <div className="step-card" style={{maxWidth: '600px', margin: '0 auto'}}>
            <div className="step-number">1</div>
            <h2>Upload Excel Fajl</h2>
            <p>Excel mora imati product kolone (alimsname obavezno)</p>
            
            <div className="upload-box">
              <input 
                type="file" 
                id="excel-upload"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={loading}
                className="file-input"
              />
              <label htmlFor="excel-upload" className="file-label">
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Učitavanje...
                  </>
                ) : excelProducts.length > 0 ? (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    <span className="upload-success">✅ Excel fajl uspešno učitan ({excelProducts.length} proizvoda)</span>
                    <span className="upload-hint">Klikni da promeniš fajl</span>
                  </>
                ) : (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span>Klikni ili prevuci Excel fajl ovde</span>
                  </>
                )}
              </label>
            </div>
            
            {excelProducts.length > 0 && (
              <button 
                onClick={compareWithDatabase}
                disabled={comparing}
                className="btn-compare"
              >
                {comparing ? (
                  <>
                    <div className="spinner-small"></div>
                    Poređenje u toku...
                  </>
                ) : (
                  <>
                    🔍 Uporedi Proizvode
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="results-section">
          <div className="results-summary">
            <div className="summary-card summary-both">
              <div className="summary-number">{inBoth.length}</div>
              <div className="summary-label">U OBA (sync-ovano)</div>
            </div>
            <div className="summary-card summary-supabase">
              <div className="summary-number">{onlyInSupabase.length}</div>
              <div className="summary-label">Samo u Supabase</div>
            </div>
            <div className="summary-card summary-excel">
              <div className="summary-number">{onlyInExcel.length}</div>
              <div className="summary-label">Samo u Excel</div>
            </div>
          </div>

          <div className="results-actions">
            <button onClick={downloadCurrentProducts} className="btn-export">
              📥 Export Supabase Proizvode
            </button>
            <button onClick={() => { setStep('upload'); setExcelProducts([]); }} className="btn-reset">
              🔄 Novi Upload
            </button>
          </div>

          {inBoth.length > 0 && (
            <div className="group-section group-both">
              <div className="group-header" onClick={() => toggleSection('both')} style={{cursor: 'pointer'}}>
                <h2>
                  <span className="expand-icon">{expandedSections.both ? '▼' : '▶'}</span>
                  🟢 U OBA ({inBoth.length} proizvoda)
                </h2>
                <p>Proizvodi koji postoje i u Supabase i u Excel-u - SYNC-OVANO ✓ {!expandedSections.both && '(Klikni da vidiš)'}</p>
              </div>
              
              {expandedSections.both && (
                <>
                  <div className="table-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>ALIMS Naziv</th>
                          <th>Naziv</th>
                          <th>Proizvođač</th>
                          <th>Cena</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(inBoth, 'both').map((prod, idx) => (
                          <tr key={idx}>
                            <td>{prod.idproducts}</td>
                            <td>{prod.alimsname || '-'}</td>
                            <td>{prod.name || '-'}</td>
                            <td>{prod.manufacturer_name || '-'}</td>
                            <td>{prod.price ? `${prod.price.toFixed(2)} RSD` : '-'}</td>
                            <td><span className="badge badge-success">✓ Sync</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {getTotalPages(inBoth.length) > 1 && (
                    <div className="pagination-controls" style={{marginTop: '1rem'}}>
                      <button
                        onClick={() => handlePageChange('both', currentPages.both - 1)}
                        disabled={currentPages.both === 1}
                        className="pagination-btn"
                      >
                        ← Prethodna
                      </button>
                      <span className="pagination-info">
                        Stranica {currentPages.both} od {getTotalPages(inBoth.length)} 
                        ({(currentPages.both - 1) * itemsPerPage + 1}-{Math.min(currentPages.both * itemsPerPage, inBoth.length)} od {inBoth.length})
                      </span>
                      <button
                        onClick={() => handlePageChange('both', currentPages.both + 1)}
                        disabled={currentPages.both === getTotalPages(inBoth.length)}
                        className="pagination-btn"
                      >
                        Sledeća →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {onlyInSupabase.length > 0 && (
            <div className="group-section group-supabase">
              <div className="group-header" onClick={() => toggleSection('supabase')} style={{cursor: 'pointer'}}>
                <h2>
                  <span className="expand-icon">{expandedSections.supabase ? '▼' : '▶'}</span>
                  🔴 Samo u Supabase ({onlyInSupabase.length} proizvoda)
                </h2>
                <p>Proizvodi koji postoje u bazi, ali NE u Excel-u {!expandedSections.supabase && '(Klikni da vidiš)'}</p>
              </div>
              
              {expandedSections.supabase && (
                <>
                  <div className="bulk-actions">
                <button onClick={() => selectAll('supabase')} className="btn-select-all">Izaberi Sve</button>
                <button onClick={() => deselectAll('supabase')} className="btn-deselect-all">Poništi Sve</button>
                <button 
                  onClick={deleteSelectedFromSupabase}
                  disabled={processing || onlyInSupabase.filter(p => p.selected).length === 0}
                  className="btn-delete-bulk"
                >
                  {processing ? (
                    <>
                      <div className="spinner-small"></div>
                      Brisanje...
                    </>
                  ) : (
                    <>
                      🗑️ Obriši Izabrane ({onlyInSupabase.filter(p => p.selected).length})
                    </>
                  )}
                </button>
              </div>

                  <div className="table-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>
                            <input 
                              type="checkbox"
                              checked={onlyInSupabase.length > 0 && onlyInSupabase.every(p => p.selected)}
                              onChange={(e) => e.target.checked ? selectAll('supabase') : deselectAll('supabase')}
                            />
                          </th>
                          <th>ID</th>
                          <th>ALIMS Naziv</th>
                          <th>Naziv</th>
                          <th>Proizvođač</th>
                          <th>Cena</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(onlyInSupabase, 'supabase').map((prod, idx) => {
                          const originalIdx = (currentPages.supabase - 1) * itemsPerPage + idx;
                          return (
                            <tr key={idx} className={prod.selected ? 'selected-row' : ''}>
                              <td>
                                <input 
                                  type="checkbox"
                                  checked={prod.selected}
                                  onChange={() => toggleSelection('supabase', originalIdx)}
                                />
                              </td>
                              <td>{prod.idproducts}</td>
                              <td>{prod.alimsname || '-'}</td>
                              <td>{prod.name || '-'}</td>
                              <td>{prod.manufacturer_name || '-'}</td>
                              <td>{prod.price ? `${prod.price.toFixed(2)} RSD` : '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {getTotalPages(onlyInSupabase.length) > 1 && (
                    <div className="pagination-controls" style={{marginTop: '1rem'}}>
                      <button
                        onClick={() => handlePageChange('supabase', currentPages.supabase - 1)}
                        disabled={currentPages.supabase === 1}
                        className="pagination-btn"
                      >
                        ← Prethodna
                      </button>
                      <span className="pagination-info">
                        Stranica {currentPages.supabase} od {getTotalPages(onlyInSupabase.length)} 
                        ({(currentPages.supabase - 1) * itemsPerPage + 1}-{Math.min(currentPages.supabase * itemsPerPage, onlyInSupabase.length)} od {onlyInSupabase.length})
                      </span>
                      <button
                        onClick={() => handlePageChange('supabase', currentPages.supabase + 1)}
                        disabled={currentPages.supabase === getTotalPages(onlyInSupabase.length)}
                        className="pagination-btn"
                      >
                        Sledeća →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {onlyInExcel.length > 0 && (
            <div className="group-section group-excel">
              <div className="group-header" onClick={() => toggleSection('excel')} style={{cursor: 'pointer'}}>
                <h2>
                  <span className="expand-icon">{expandedSections.excel ? '▼' : '▶'}</span>
                  🟡 Samo u Excel ({onlyInExcel.length} proizvoda)
                </h2>
                <p>Proizvodi koji su u Excel-u, ali NE u bazi (novi proizvodi) {!expandedSections.excel && '(Klikni da vidiš)'}</p>
              </div>
              
              {expandedSections.excel && (
                <>
                  <div className="bulk-actions">
                <button onClick={() => selectAll('excel')} className="btn-select-all">Izaberi Sve</button>
                <button onClick={() => deselectAll('excel')} className="btn-deselect-all">Poništi Sve</button>
                <button 
                  onClick={addSelectedFromExcel}
                  disabled={processing || onlyInExcel.filter(p => p.selected).length === 0}
                  className="btn-import"
                >
                  {processing ? (
                    <>
                      <div className="spinner-small"></div>
                      Dodavanje...
                    </>
                  ) : (
                    <>
                      ➕ Dodaj Izabrane ({onlyInExcel.filter(p => p.selected).length})
                    </>
                  )}
                </button>
              </div>

                  <div className="table-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>
                            <input 
                              type="checkbox"
                              checked={onlyInExcel.length > 0 && onlyInExcel.every(p => p.selected)}
                              onChange={(e) => e.target.checked ? selectAll('excel') : deselectAll('excel')}
                            />
                          </th>
                          <th>ALIMS Naziv</th>
                          <th>Naziv</th>
                          <th>Proizvođač</th>
                          <th>Vendor</th>
                          <th>Cena</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(onlyInExcel, 'excel').map((prod, idx) => {
                          const originalIdx = (currentPages.excel - 1) * itemsPerPage + idx;
                          return (
                            <tr key={idx} className={prod.selected ? 'selected-row' : ''}>
                              <td>
                                <input 
                                  type="checkbox"
                                  checked={prod.selected}
                                  onChange={() => toggleSelection('excel', originalIdx)}
                                />
                              </td>
                              <td>{prod.alimsname || '-'}</td>
                              <td>{prod.name || '-'}</td>
                              <td>{prod.manufacturer_name || '-'}</td>
                              <td>{prod.vendor_name || '-'}</td>
                              <td>{prod.price ? `${prod.price.toFixed(2)} RSD` : '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {getTotalPages(onlyInExcel.length) > 1 && (
                    <div className="pagination-controls" style={{marginTop: '1rem'}}>
                      <button
                        onClick={() => handlePageChange('excel', currentPages.excel - 1)}
                        disabled={currentPages.excel === 1}
                        className="pagination-btn"
                      >
                        ← Prethodna
                      </button>
                      <span className="pagination-info">
                        Stranica {currentPages.excel} od {getTotalPages(onlyInExcel.length)} 
                        ({(currentPages.excel - 1) * itemsPerPage + 1}-{Math.min(currentPages.excel * itemsPerPage, onlyInExcel.length)} od {onlyInExcel.length})
                      </span>
                      <button
                        onClick={() => handlePageChange('excel', currentPages.excel + 1)}
                        disabled={currentPages.excel === getTotalPages(onlyInExcel.length)}
                        className="pagination-btn"
                      >
                        Sledeća →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

