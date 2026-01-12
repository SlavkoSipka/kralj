import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import * as XLSX from 'xlsx';
import './ExcelImport.css';

interface VariantRow {
  parent_product_sku?: string;
  parent_product_id?: number;
  variant_name: string;
  variant_type?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  instock?: boolean;
  sort_order?: number;
  active?: boolean;
}

export default function ProductVariantsExcelImport() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<VariantRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const userData = await getCurrentUser();
      if (!userData || !isAdmin(userData.roleData)) {
        navigate('/admin/login');
      }
    } catch (error) {
      navigate('/admin/login');
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setData([]);
    setError('');
    setSuccess('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const variants: VariantRow[] = jsonData.map((row: any) => ({
          parent_product_sku: row['SKU Proizvoda'] || row['parent_product_sku'] || row['Parent SKU'],
          parent_product_id: row['ID Proizvoda'] || row['parent_product_id'] || row['Parent ID'],
          variant_name: row['Naziv Varijante'] || row['variant_name'] || row['Variant Name'] || '',
          variant_type: row['Tip Varijante'] || row['variant_type'] || row['Type'],
          sku: row['SKU Varijante'] || row['sku'] || row['SKU'],
          price: parseFloat(row['Cena'] || row['price'] || row['Price'] || 0),
          quantity: parseInt(row['Količina'] || row['quantity'] || row['Quantity'] || 0),
          instock: row['Na Stanju'] === undefined ? true : 
                   (row['Na Stanju'] === 'Da' || row['Na Stanju'] === true || 
                    row['instock'] === 'true' || row['instock'] === true),
          sort_order: parseInt(row['Redosled'] || row['sort_order'] || row['Sort Order'] || 0),
          active: row['Aktivan'] === undefined ? true :
                  (row['Aktivan'] === 'Da' || row['Aktivan'] === true ||
                   row['active'] === 'true' || row['active'] === true)
        }));

        setData(variants);
        setSuccess(`✅ Excel fajl uspešno učitan (${variants.length} varijanti)`);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setError('Greška pri čitanju Excel fajla. Proverite format fajla.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(uploadedFile);
  }

  async function handleImport() {
    if (data.length === 0) {
      setError('Nema podataka za import');
      return;
    }

    setImporting(true);
    setProgress(0);
    setError('');

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    console.log(`📊 Importing ${data.length} product variants...`);

    for (let i = 0; i < data.length; i++) {
      const variant = data[i];

      try {
        // Validation
        if (!variant.parent_product_sku && !variant.parent_product_id) {
          errors.push(`Red ${i + 2}: Mora biti definisan SKU ili ID parent proizvoda`);
          failedCount++;
          continue;
        }

        if (!variant.variant_name || variant.variant_name.trim() === '') {
          errors.push(`Red ${i + 2}: Naziv varijante je obavezan`);
          failedCount++;
          continue;
        }

        // Find parent product by SKU or ID
        let parentProductId: number | null = null;

        if (variant.parent_product_id) {
          parentProductId = variant.parent_product_id;
        } else if (variant.parent_product_sku) {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('idproducts')
            .eq('sku', variant.parent_product_sku)
            .single();

          if (productError || !productData) {
            errors.push(`Red ${i + 2}: Parent proizvod "${variant.parent_product_sku}" nije pronađen`);
            failedCount++;
            continue;
          }

          parentProductId = productData.idproducts;
        }

        if (!parentProductId) {
          errors.push(`Red ${i + 2}: Parent proizvod nije pronađen`);
          failedCount++;
          continue;
        }

        // Prepare variant data
        const variantData: any = {
          id_product: parentProductId,
          variant_name: variant.variant_name.trim(),
          variant_type: variant.variant_type || null,
          sku: variant.sku || null,
          price: variant.price || null,
          quantity: variant.quantity || 0,
          instock: variant.instock !== false,
          sort_order: variant.sort_order || 0,
          active: variant.active !== false,
          updated_at: new Date().toISOString()
        };

        // Check if variant with this SKU already exists
        if (variant.sku) {
          const { data: existing } = await supabase
            .from('product_variants')
            .select('id_variant')
            .eq('sku', variant.sku)
            .single();

          if (existing) {
            // Update existing
            const { error: updateError } = await supabase
              .from('product_variants')
              .update(variantData)
              .eq('id_variant', existing.id_variant);

            if (updateError) {
              errors.push(`Red ${i + 2}: Greška pri update-u - ${updateError.message}`);
              failedCount++;
            } else {
              successCount++;
            }
          } else {
            // Insert new
            const { error: insertError } = await supabase
              .from('product_variants')
              .insert([variantData]);

            if (insertError) {
              errors.push(`Red ${i + 2}: Greška pri unosu - ${insertError.message}`);
              failedCount++;
            } else {
              successCount++;
            }
          }
        } else {
          // No SKU, always insert new
          const { error: insertError } = await supabase
            .from('product_variants')
            .insert([variantData]);

          if (insertError) {
            errors.push(`Red ${i + 2}: Greška pri unosu - ${insertError.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        }
      } catch (error: any) {
        errors.push(`Red ${i + 2}: ${error.message}`);
        failedCount++;
      }

      setProgress(Math.round(((i + 1) / data.length) * 100));
    }

    setImporting(false);
    
    if (errors.length > 0) {
      setError(`⚠️ Import završen sa greškama:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... i još ${errors.length - 5} greška(ka)` : ''}`);
    }
    
    if (successCount > 0) {
      setSuccess(`✅ Uspešno importovano ${successCount} varijanti${failedCount > 0 ? ` (${failedCount} neuspešno)` : ''}`);
    } else {
      setError('❌ Nijedna varijanta nije importovana');
    }

    console.log(`✅ Import complete: ${successCount} success, ${failedCount} failed`);
  }

  function downloadTemplate() {
    const template = [
      {
        'SKU Proizvoda': 'PROD-001',
        'Naziv Varijante': '500mg',
        'Tip Varijante': 'Pakovanje',
        'SKU Varijante': 'PROD-001-500MG',
        'Cena': 1250.00,
        'Količina': 100,
        'Na Stanju': 'Da',
        'Redosled': 0,
        'Aktivan': 'Da'
      },
      {
        'SKU Proizvoda': 'PROD-001',
        'Naziv Varijante': '1000mg',
        'Tip Varijante': 'Pakovanje',
        'SKU Varijante': 'PROD-001-1000MG',
        'Cena': 2100.00,
        'Količina': 50,
        'Na Stanju': 'Da',
        'Redosled': 1,
        'Aktivan': 'Da'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Varijante');
    XLSX.writeFile(wb, 'template_product_variants.xlsx');
  }

  return (
    <div className="excel-import">
      {/* Breadcrumb */}
      <nav className="breadcrumb-nav">
        <Link to="/admin" className="breadcrumb-link">Admin Panel</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Excel Import: Varijante</span>
      </nav>

      {/* Header */}
      <div className="import-header">
        <div className="import-header-left">
          <h1>📊 Import Varijanti iz Excel-a</h1>
          <p className="import-subtitle">Uvezite varijante proizvoda iz Excel fajla sa bazom (po SKU Proizvoda)</p>
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
              disabled={loading || importing}
              className="file-input"
            />
            <label htmlFor="excel-upload" className="file-label">
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Učitavanje...
                </>
              ) : data.length > 0 ? (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  <span className="upload-success">✅ Excel fajl uspešno učitan ({data.length} varijanti)</span>
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

          {data.length > 0 && (
            <>
              <div className="import-info">
                <h3>📋 Kolone u Excel-u:</h3>
                <ul>
                  <li><strong>SKU Proizvoda</strong> (obavezno) - SKU parent proizvoda</li>
                  <li><strong>Naziv Varijante</strong> (obavezno) - Npr. "500mg", "Plava boja"</li>
                  <li><strong>Tip Varijante</strong> - Npr. "Pakovanje", "Boja"</li>
                  <li><strong>SKU Varijante</strong> - Jedinstveni SKU</li>
                  <li><strong>Cena</strong>, <strong>Količina</strong>, <strong>Na Stanju</strong>, <strong>Redosled</strong>, <strong>Aktivan</strong></li>
                </ul>
              </div>

              <button 
                onClick={handleImport}
                disabled={importing}
                className="btn-compare"
              >
                {importing ? (
                  <>
                    <div className="spinner-small"></div>
                    Importovanje... {progress}%
                  </>
                ) : (
                  <>
                    📥 Importuj Varijante ({data.length})
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
