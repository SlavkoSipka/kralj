import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import * as XLSX from 'xlsx';
import './ExcelImport.css';

interface VendorItem {
  idvendor?: number;
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
  status?: 'both' | 'supabase_only' | 'excel_only';
  selected?: boolean;
}

export default function VendorExcelImport() {
  const [excelVendors, setExcelVendors] = useState<VendorItem[]>([]);
  const [supabaseVendors, setSupabaseVendors] = useState<VendorItem[]>([]);
  const [inBoth, setInBoth] = useState<VendorItem[]>([]);
  const [onlyInSupabase, setOnlyInSupabase] = useState<VendorItem[]>([]);
  const [onlyInExcel, setOnlyInExcel] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'upload' | 'results'>('upload');
  const navigate = useNavigate();

  // Collapse/expand states
  const [expandedSections, setExpandedSections] = useState({
    both: false,
    supabase: false,
    excel: false
  });

  // Pagination for each section
  const [currentPages, setCurrentPages] = useState({
    both: 1,
    supabase: 1,
    excel: 1
  });

  const itemsPerPage = 50;

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const data = await getCurrentUser();
      if (!data || !isAdmin(data.roleData)) {
        navigate('/admin/login');
        return;
      }
    } catch (error) {
      navigate('/admin/login');
    }
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

        const vendors: VendorItem[] = jsonData.map((row) => ({
          name: row.name || '',
          address: row.address || undefined,
          zip: row.zip ? parseInt(row.zip) : undefined,
          city: row.city || undefined,
          country: row.country || undefined,
          vat: row.vat || undefined,
          mb: row.mb || undefined,
          phone: row.phone || undefined,
          contact_person: row.contact_person || undefined,
          email: row.email || undefined,
          website: row.website || undefined,
          selected: false
        }));

        setExcelVendors(vendors);
        setSuccess(`✅ Učitano ${vendors.length} vendora iz Excel fajla`);
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
    if (excelVendors.length === 0) {
      setError('Excel fajl nije učitan!');
      return;
    }

    setComparing(true);
    setError('');
    setSuccess('Učitavanje svih vendora iz baze... Molimo sačekajte...');

    try {
      // Load ALL vendors - OPTIMIZED: only fetch columns needed for comparison + display
      // Excludes unnecessary columns like country, zip, address, phone2, etc.
      let allVendors: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      console.log('🔄 Loading all vendor names from Supabase (optimized)...');

      // First, get the total count
      const { count: totalCount, error: countError } = await supabase
        .from('vendor')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      console.log(`📊 Total vendors in database: ${totalCount}`);

      while (hasMore) {
        const { data: batch, error: dbError } = await supabase
          .from('vendor')
          .select('idvendor, name, city, email, phone')  // Only columns used for comparison + display
          .range(from, from + batchSize - 1);

        if (dbError) throw dbError;

        if (batch && batch.length > 0) {
          allVendors = [...allVendors, ...batch];
          console.log(`  ✓ Batch ${Math.floor(from / batchSize) + 1}: ${batch.length} vendors (total: ${allVendors.length})`);
          from += batchSize;
          hasMore = batch.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      console.log(`✅ Loaded ${allVendors.length} vendors (expected ${totalCount})`);
      const dbVendors = allVendors;

      console.log('🔍 Supabase vendors:', dbVendors?.length);
      console.log('📊 Excel vendors:', excelVendors.length);

      setSupabaseVendors(dbVendors || []);

      // Debug: Check for NULL/empty name values
      const dbWithoutName = (dbVendors || []).filter(v => !v.name || v.name.trim() === '');
      if (dbWithoutName.length > 0) {
        console.warn(`⚠️ Found ${dbWithoutName.length} vendors with NULL/empty 'name' column`);
      }

      // Kreiraj Maps za brže pretraživanje (po NAME kao unique identifier)
      const excelFiltered = excelVendors.filter(v => v.name && v.name.trim() !== '');
      const dbFiltered = (dbVendors || []).filter(v => v.name && v.name.trim() !== '');
      
      console.log(`📋 After filtering: ${dbFiltered.length} vendors (filtered out ${(dbVendors?.length || 0) - dbFiltered.length})`);
      
      const excelMap = new Map(
        excelFiltered.map(v => [v.name.toLowerCase().trim(), v])
      );
      const supabaseMap = new Map(
        dbFiltered.map(v => [v.name.toLowerCase().trim(), v])
      );

      // 1. U OBA
      const both: VendorItem[] = [];
      supabaseMap.forEach((supabaseVendor, name) => {
        if (excelMap.has(name)) {
          both.push({ ...supabaseVendor, status: 'both', selected: false });
        }
      });

      // 2. Samo u Supabase
      const onlySupabase: VendorItem[] = [];
      supabaseMap.forEach((supabaseVendor, name) => {
        if (!excelMap.has(name)) {
          onlySupabase.push({ ...supabaseVendor, status: 'supabase_only', selected: false });
        }
      });

      // 3. Samo u Excel
      const onlyExcel: VendorItem[] = [];
      excelMap.forEach((excelVendor, name) => {
        if (!supabaseMap.has(name)) {
          onlyExcel.push({ ...excelVendor, status: 'excel_only', selected: false });
        }
      });

      setInBoth(both);
      setOnlyInSupabase(onlySupabase);
      setOnlyInExcel(onlyExcel);

      // Reset expand/page states
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
      setOnlyInExcel(prev => prev.map((v, i) => 
        i === index ? { ...v, selected: !v.selected } : v
      ));
    } else {
      setOnlyInSupabase(prev => prev.map((v, i) => 
        i === index ? { ...v, selected: !v.selected } : v
      ));
    }
  }

  function selectAll(list: 'excel' | 'supabase') {
    if (list === 'excel') {
      setOnlyInExcel(prev => prev.map(v => ({ ...v, selected: true })));
    } else {
      setOnlyInSupabase(prev => prev.map(v => ({ ...v, selected: true })));
    }
  }

  function deselectAll(list: 'excel' | 'supabase') {
    if (list === 'excel') {
      setOnlyInExcel(prev => prev.map(v => ({ ...v, selected: false })));
    } else {
      setOnlyInSupabase(prev => prev.map(v => ({ ...v, selected: false })));
    }
  }

  async function addSelectedFromExcel() {
    const selected = onlyInExcel.filter(v => v.selected);
    
    if (selected.length === 0) {
      setError('Niste izabrali nijednog vendora za dodavanje!');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const vendorsToInsert = selected.map(v => {
        const { selected, status, ...cleanVendor } = v;
        return {
          ...cleanVendor,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });

      const { data, error: insertError } = await supabase
        .from('vendor')
        .insert(vendorsToInsert)
        .select();

      if (insertError) throw insertError;

      setSuccess(`✅ Dodato ${data?.length} vendora iz Excel-a u bazu!`);
      await compareWithDatabase();
      
    } catch (error: any) {
      console.error('Error adding:', error);
      setError('Greška pri dodavanju: ' + error.message);
    } finally {
      setProcessing(false);
    }
  }

  async function deleteSelectedFromSupabase() {
    const selected = onlyInSupabase.filter(v => v.selected);
    
    if (selected.length === 0) {
      setError('Niste izabrali nijednog vendora za brisanje!');
      return;
    }

    if (!window.confirm(`Da li ste SIGURNI da želite da obrišete ${selected.length} vendora iz baze?\n\nOvo je trajna akcija!`)) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const idsToDelete = selected.map(v => v.idvendor).filter(Boolean);

      const { error: deleteError } = await supabase
        .from('vendor')
        .delete()
        .in('idvendor', idsToDelete);

      if (deleteError) throw deleteError;

      setSuccess(`✅ Obrisano ${idsToDelete.length} vendora iz baze!`);
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
      name: 'Primer Vendor d.o.o.',
      address: 'Bulevar Kralja Aleksandra 123',
      zip: 11000,
      city: 'Beograd',
      country: 'Srbija',
      vat: '123456789',
      mb: '12345678',
      phone: '+381 11 1234567',
      contact_person: 'Ime Prezime',
      email: 'kontakt@vendor.rs',
      website: 'https://www.vendor.rs'
    }];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
    XLSX.writeFile(workbook, 'meding-vendors-template.xlsx');
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

  function getPaginatedData(data: VendorItem[], section: 'both' | 'supabase' | 'excel') {
    const page = currentPages[section];
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }

  function getTotalPages(length: number) {
    return Math.ceil(length / itemsPerPage);
  }

  function downloadCurrentVendors() {
    if (supabaseVendors.length === 0) {
      setError('Nema vendora za export!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(supabaseVendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
    XLSX.writeFile(workbook, `vendori-${new Date().toISOString().split('T')[0]}.xlsx`);
    setSuccess(`✅ Export-ovano ${supabaseVendors.length} vendora!`);
  }

  return (
    <div className="excel-import">
      <div className="breadcrumb-nav">
        <Link to="/admin" className="breadcrumb-link">Admin Panel</Link>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="breadcrumb-separator">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        <span className="breadcrumb-current">Vendor Excel Import</span>
      </div>

      <div className="import-header">
        <div className="import-header-left">
          <Link to="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
            </svg>
            Nazad na Admin Panel
          </Link>
          <h1>🏢 Import Vendora iz Excel-a</h1>
          <p className="import-subtitle">Uporedite vendore iz Excel fajla sa bazom (po NAME koloni)</p>
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
            <p>Excel mora imati vendor kolone (name obavezno)</p>
            
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
                ) : excelVendors.length > 0 ? (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    <span className="upload-success">✅ Excel fajl uspešno učitan ({excelVendors.length} vendora)</span>
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
            
            {excelVendors.length > 0 && (
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
                    🔍 Uporedi Vendore
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
            <button onClick={downloadCurrentVendors} className="btn-export">
              📥 Export Supabase Vendore
            </button>
            <button onClick={() => { setStep('upload'); setExcelVendors([]); }} className="btn-reset">
              🔄 Novi Upload
            </button>
          </div>

          {inBoth.length > 0 && (
            <div className="group-section group-both">
              <div className="group-header" onClick={() => toggleSection('both')} style={{cursor: 'pointer'}}>
                <h2>
                  <span className="expand-icon">{expandedSections.both ? '▼' : '▶'}</span>
                  🟢 U OBA ({inBoth.length} vendora)
                </h2>
                <p>Vendori koji postoje i u Supabase i u Excel-u - SYNC-OVANO ✓ {!expandedSections.both && '(Klikni da vidiš)'}</p>
              </div>
              
              {expandedSections.both && (
                <>
                  <div className="table-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Naziv</th>
                          <th>Grad</th>
                          <th>Email</th>
                          <th>Telefon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(inBoth, 'both').map((vendor, idx) => (
                          <tr key={idx}>
                            <td>{vendor.idvendor}</td>
                            <td>{vendor.name}</td>
                            <td>{vendor.city || '-'}</td>
                            <td>{vendor.email || '-'}</td>
                            <td>{vendor.phone || '-'}</td>
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
                  🔴 Samo u Supabase ({onlyInSupabase.length} vendora)
                </h2>
                <p>Vendori koji postoje u bazi, ali NE u Excel-u {!expandedSections.supabase && '(Klikni da vidiš)'}</p>
              </div>
              
              {expandedSections.supabase && (
                <>
                  <div className="bulk-actions">
                <button onClick={() => selectAll('supabase')} className="btn-select-all">Izaberi Sve</button>
                <button onClick={() => deselectAll('supabase')} className="btn-deselect-all">Poništi Sve</button>
                <button 
                  onClick={deleteSelectedFromSupabase}
                  disabled={processing || onlyInSupabase.filter(v => v.selected).length === 0}
                  className="btn-delete-bulk"
                >
                  {processing ? (
                    <>
                      <div className="spinner-small"></div>
                      Brisanje...
                    </>
                  ) : (
                    <>
                      🗑️ Obriši Izabrane ({onlyInSupabase.filter(v => v.selected).length})
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
                              checked={onlyInSupabase.length > 0 && onlyInSupabase.every(v => v.selected)}
                              onChange={(e) => e.target.checked ? selectAll('supabase') : deselectAll('supabase')}
                            />
                          </th>
                          <th>ID</th>
                          <th>Naziv</th>
                          <th>Grad</th>
                          <th>Email</th>
                          <th>Telefon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(onlyInSupabase, 'supabase').map((vendor, idx) => {
                          const originalIdx = (currentPages.supabase - 1) * itemsPerPage + idx;
                          return (
                            <tr key={idx} className={vendor.selected ? 'selected-row' : ''}>
                              <td>
                                <input 
                                  type="checkbox"
                                  checked={vendor.selected}
                                  onChange={() => toggleSelection('supabase', originalIdx)}
                                />
                              </td>
                              <td>{vendor.idvendor}</td>
                              <td>{vendor.name}</td>
                              <td>{vendor.city || '-'}</td>
                              <td>{vendor.email || '-'}</td>
                              <td>{vendor.phone || '-'}</td>
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
                  🟡 Samo u Excel ({onlyInExcel.length} vendora)
                </h2>
                <p>Vendori koji su u Excel-u, ali NE u bazi (novi vendori) {!expandedSections.excel && '(Klikni da vidiš)'}</p>
              </div>
              
              {expandedSections.excel && (
                <>
                  <div className="bulk-actions">
                <button onClick={() => selectAll('excel')} className="btn-select-all">Izaberi Sve</button>
                <button onClick={() => deselectAll('excel')} className="btn-deselect-all">Poništi Sve</button>
                <button 
                  onClick={addSelectedFromExcel}
                  disabled={processing || onlyInExcel.filter(v => v.selected).length === 0}
                  className="btn-import"
                >
                  {processing ? (
                    <>
                      <div className="spinner-small"></div>
                      Dodavanje...
                    </>
                  ) : (
                    <>
                      ➕ Dodaj Izabrane ({onlyInExcel.filter(v => v.selected).length})
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
                              checked={onlyInExcel.length > 0 && onlyInExcel.every(v => v.selected)}
                              onChange={(e) => e.target.checked ? selectAll('excel') : deselectAll('excel')}
                            />
                          </th>
                          <th>Naziv</th>
                          <th>Grad</th>
                          <th>Email</th>
                          <th>Telefon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(onlyInExcel, 'excel').map((vendor, idx) => {
                          const originalIdx = (currentPages.excel - 1) * itemsPerPage + idx;
                          return (
                            <tr key={idx} className={vendor.selected ? 'selected-row' : ''}>
                              <td>
                                <input 
                                  type="checkbox"
                                  checked={vendor.selected}
                                  onChange={() => toggleSelection('excel', originalIdx)}
                                />
                              </td>
                              <td>{vendor.name}</td>
                              <td>{vendor.city || '-'}</td>
                              <td>{vendor.email || '-'}</td>
                              <td>{vendor.phone || '-'}</td>
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

