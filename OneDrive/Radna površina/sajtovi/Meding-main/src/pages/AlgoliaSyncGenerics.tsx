import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser, isAdmin } from '../lib/auth';
import { algoliasearch } from 'algoliasearch';
import './ExcelImport.css';

export default function AlgoliaSyncGenerics() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState<{ total: number; synced: number } | null>(null);
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

  async function handleSync() {
    // Check Algolia credentials
    const algoliaAppId = import.meta.env.VITE_ALGOLIA_APP_ID;
    const algoliaAdminKey = import.meta.env.VITE_ALGOLIA_ADMIN_KEY;

    if (!algoliaAppId || !algoliaAdminKey) {
      setError('❌ Algolia credentials nisu postavljene! Potrebne su VITE_ALGOLIA_APP_ID i VITE_ALGOLIA_ADMIN_KEY environment varijable.');
      return;
    }

    setSyncing(true);
    setProgress(0);
    setError('');
    setSuccess('');
    setStats(null);

    try {
      console.log('🔄 Starting Algolia Generics Sync...');

      // Initialize Algolia client
      const client = algoliasearch(algoliaAppId, algoliaAdminKey);
      const index = client.initIndex('generics');

      // Fetch all generics with category info
      console.log('📊 Fetching generics from Supabase...');
      const { data: generics, error: genericsError } = await supabase
        .from('generic')
        .select(`
          idgeneric,
          name,
          alimsname,
          category_id,
          categories:category_id (name)
        `)
        .not('name', 'is', null)
        .order('name');

      if (genericsError) throw genericsError;

      console.log(`✅ Fetched ${generics?.length || 0} generics`);
      setProgress(30);

      // Count products for each generic (in batches)
      console.log('🔢 Counting products per generic...');
      const genericsWithCount = await Promise.all(
        (generics || []).map(async (generic, index) => {
          // Update progress every 10 generics
          if (index % 10 === 0) {
            const progressPercent = 30 + Math.round((index / generics.length) * 40);
            setProgress(progressPercent);
          }

          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('idgeneric', generic.idgeneric);

          return {
            objectID: generic.idgeneric.toString(),
            idgeneric: generic.idgeneric,
            name: generic.name,
            alimsname: generic.alimsname || null,
            category_id: generic.category_id || null,
            category_name: (generic.categories as any)?.name || null,
            product_count: count || 0
          };
        })
      );

      setProgress(70);

      // Clear existing index
      console.log('🗑️ Clearing old data...');
      await index.clearObjects();

      setProgress(80);

      // Upload to Algolia in batches
      console.log(`📤 Uploading ${genericsWithCount.length} records to Algolia...`);
      const result = await index.saveObjects(genericsWithCount);

      setProgress(100);

      console.log('✅ Sync complete!', result);
      setSuccess(`✅ Uspešno sync-ovano ${genericsWithCount.length} generika u Algolia index "generics"!`);
      setStats({
        total: genericsWithCount.length,
        synced: genericsWithCount.length
      });

      // Configure index settings
      console.log('⚙️ Configuring index settings...');
      await index.setSettings({
        searchableAttributes: [
          'name',
          'alimsname',
          'category_name'
        ],
        attributesForFaceting: [
          'category_name',
          'product_count'
        ],
        customRanking: [
          'desc(product_count)'
        ],
        typoTolerance: true,
        minWordSizefor1Typo: 4,
        minWordSizefor2Typos: 8
      });

      console.log('✅ Index settings configured!');

    } catch (error: any) {
      console.error('Error syncing to Algolia:', error);
      setError(`❌ Greška: ${error.message || 'Nepoznata greška'}`);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="excel-import">
      {/* Breadcrumb */}
      <nav className="breadcrumb-nav">
        <Link to="/admin" className="breadcrumb-link">Admin Panel</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Algolia: Sync Generics</span>
      </nav>

      {/* Header */}
      <div className="import-header">
        <div className="import-header-left">
          <h1>🔄 Algolia: Sync Generics</h1>
          <p className="import-subtitle">Sync-uj generičke nazive iz Supabase u Algolia "generics" index</p>
        </div>
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
        <div className="import-card" style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2>📋 Uputstvo</h2>
          <div className="import-info">
            <p><strong>Ovaj proces će:</strong></p>
            <ol>
              <li>Učitati sve generičke nazive iz Supabase</li>
              <li>Prebrojati koliko proizvoda ima svaki generic</li>
              <li>Upload-ovati sve u Algolia "generics" index</li>
              <li>Konfigurisati search settings</li>
            </ol>
            
            <p style={{marginTop: '1rem'}}><strong>⚠️ Potrebno:</strong></p>
            <ul>
              <li><code>VITE_ALGOLIA_APP_ID</code> - Algolia App ID</li>
              <li><code>VITE_ALGOLIA_ADMIN_KEY</code> - Algolia Admin API Key (ne Search Key!)</li>
            </ul>

            <p style={{marginTop: '1rem', color: '#dc2626', fontWeight: 600}}>
              ⚠️ Admin API Key ne koristi za Search Key - on ima write permissions!
            </p>
          </div>

          {stats && (
            <div className="import-card success-card" style={{marginTop: '2rem'}}>
              <h3>✅ Sync Statistika</h3>
              <div className="success-stats">
                <div className="stat-item success">
                  <span className="stat-number">{stats.synced}</span>
                  <span className="stat-label">Sync-ovano generika</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.total}</span>
                  <span className="stat-label">Ukupno</span>
                </div>
              </div>
            </div>
          )}

          <div style={{marginTop: '2rem', textAlign: 'center'}}>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="btn-compare"
              style={{minWidth: '300px'}}
            >
              {syncing ? (
                <>
                  <div className="spinner-small"></div>
                  Sync u toku... {progress}%
                </>
              ) : (
                <>
                  🔄 Sync Generics sa Algolia
                </>
              )}
            </button>
          </div>

          {syncing && (
            <div style={{marginTop: '1.5rem'}}>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <p style={{
                textAlign: 'center',
                marginTop: '0.5rem',
                fontSize: '14px',
                color: '#666'
              }}>
                {progress < 30 && 'Učitavanje generika...'}
                {progress >= 30 && progress < 70 && 'Prebrojavanje proizvoda...'}
                {progress >= 70 && progress < 80 && 'Brisanje starih podataka...'}
                {progress >= 80 && progress < 100 && 'Upload u Algolia...'}
                {progress === 100 && 'Završeno!'}
              </p>
            </div>
          )}
        </div>

        <div className="import-card" style={{maxWidth: '800px', margin: '2rem auto 0'}}>
          <h2>🔑 Gde Naći Algolia Admin Key?</h2>
          <ol style={{textAlign: 'left', lineHeight: '1.8'}}>
            <li>Uloguj se na <a href="https://www.algolia.com/dashboard" target="_blank" rel="noopener noreferrer" style={{color: '#E31E24', textDecoration: 'underline'}}>Algolia Dashboard</a></li>
            <li>Idi na <strong>Settings</strong> → <strong>API Keys</strong></li>
            <li>Kopiraj <strong>Admin API Key</strong></li>
            <li>Dodaj u <code>.env</code> fajl:
              <pre style={{
                background: '#1f2937',
                color: '#10b981',
                padding: '12px',
                borderRadius: '6px',
                marginTop: '8px',
                fontSize: '13px'
              }}>
                VITE_ALGOLIA_ADMIN_KEY=your_admin_key_here
              </pre>
            </li>
            <li>Restart dev server: <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

