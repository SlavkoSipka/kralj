import { algoliasearch } from 'algoliasearch';
import { createClient } from '@supabase/supabase-js';

// ===== KONFIGURACIJA =====
const ALGOLIA_APP_ID = '1AREX1PYWX';
const ALGOLIA_ADMIN_KEY = 'b227880cead50f9836981470ddcae831'; // ADMIN API KEY
const ALGOLIA_INDEX_NAME = 'products';

const SUPABASE_URL = 'https://mgcrpqsugijxfihaufou.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_ySmfEiIc8jhSoVb4t9-fcA_u1ZxTx_g';

// ===== INIT =====
const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ===== FUNKCIJA ZA SINHRONIZACIJU =====
async function syncProducts() {
  try {
    console.log('🚀 Započinjem sinhronizaciju proizvoda...');
    console.log('📡 Preuzimanje ukupnog broja proizvoda...');
    
    // Prvo sazni koliko ima proizvoda
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Greška pri brojanju: ${countError.message}`);
    }
    
    console.log(`📊 Ukupno proizvoda u bazi: ${count}`);
    
    // Batch processing parametri
    const batchSize = 1000;
    const totalBatches = Math.ceil(count / batchSize);
    let allProducts = [];
    
    console.log(`🔄 Preuzimanje u ${totalBatches} batch-eva (${batchSize} po batch-u)...\n`);
    
    // Preuzmi proizvode batch po batch
    for (let i = 0; i < totalBatches; i++) {
      const from = i * batchSize;
      const to = from + batchSize - 1;
      
      process.stdout.write(`   Batch ${i + 1}/${totalBatches} (proizvodi ${from + 1}-${Math.min(to + 1, count)})... `);
      
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          idproducts,
          sku,
          name,
          description,
          price,
          published,
          instock,
          quantity,
          class,
          alimsname,
          type,
          category_id,
          image,
          slug,
          popularity_score,
          manufacturer:idmanufacturer(manufacturer),
          vendor:idvendor(name),
          generic:idgeneric(alimsname),
          category:category_id(name)
        `)
        .range(from, to);

      if (error) {
        console.log(`❌\n`);
        throw new Error(`Greška pri preuzimanju batch-a ${i + 1}: ${error.message}`);
      }

      if (products && products.length > 0) {
        allProducts = allProducts.concat(products);
        console.log(`✅ (${allProducts.length}/${count})`);
      } else {
        console.log(`⚠️  (prazan batch)`);
      }
    }

    if (allProducts.length === 0) {
      console.log('⚠️  Nema proizvoda za sinhronizaciju.');
      return;
    }

    console.log(`\n✅ Preuzeto ${allProducts.length} proizvoda.`);
    console.log('🔄 Transformacija podataka za Algolia...');

    // Transformacija za Algolia format
    const algoliaRecords = allProducts.map(product => ({
      objectID: product.idproducts.toString(),
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      published: product.published || false,
      instock: product.instock || false,
      quantity: product.quantity || 0,
      class: product.class || '',
      alimsname: product.alimsname || '',
      type: product.type || '',
      category_id: product.category_id,
      manufacturer_name: product.manufacturer?.manufacturer || '',
      vendor_name: product.vendor?.name || '',
      generic_name: product.generic?.alimsname || '',
      category_name: product.category?.name || '',
      image: product.image || '',
      slug: product.slug || '',
      popularity_score: product.popularity_score || 0, // POPULARITY!
    }));

    console.log(`📤 Upload ${algoliaRecords.length} zapisa u Algolia...`);
    console.log(`   (Algolia automatski deli na batch-eve, može trajati 1-2 minuta)\n`);

    // Batch upload u Algolia (v5 API - automatski batch-uje)
    await algoliaClient.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: algoliaRecords,
    });

    console.log(`\n✅ Sinhronizacija uspešna!`);
    console.log(`📊 Statistika:`);
    console.log(`   - Ukupno proizvoda: ${algoliaRecords.length}`);
    console.log(`   - Objavljenih: ${algoliaRecords.filter(p => p.published).length}`);
    console.log(`   - Na stanju: ${algoliaRecords.filter(p => p.instock).length}`);
    console.log(`   - Sa proizvođačem: ${algoliaRecords.filter(p => p.manufacturer_name).length}`);
    console.log(`   - Sa dobavljačem: ${algoliaRecords.filter(p => p.vendor_name).length}`);
    
    // Konfiguracija Index Settings
    console.log('\n⚙️  Postavljanje index konfiguracije...');
    await configureIndex();
    console.log('✅ Konfiguracija završena!');
    
  } catch (error) {
    console.error('\n❌ Greška tokom sinhronizacije:', error);
    if (error.message) {
      console.error('Poruka greške:', error.message);
    }
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

// ===== KONFIGURACIJA INDEX SETTINGS =====
async function configureIndex() {
  try {
    await algoliaClient.setSettings({
      indexName: ALGOLIA_INDEX_NAME,
      indexSettings: {
        // Searchable attributes (polja koja se pretražuju) - po prioritetu
        searchableAttributes: [
          'name',
          'alimsname',
          'sku',
          'generic_name',
          'manufacturer_name',
          'description',
          'category_name',
          'vendor_name'
        ],
        
        // Attributes for faceting (filteri)
        attributesForFaceting: [
          'searchable(manufacturer_name)',
          'searchable(vendor_name)',
          'searchable(category_name)',
          'instock',
          'published',
          'class',
          'type',
          'filterOnly(category_id)'
        ],
        
        // Custom ranking (dodatni ranking faktori)
        customRanking: [
          'desc(popularity_score)', // PRVO po popularnosti!
          'desc(published)',
          'desc(instock)',
          'desc(quantity)',
          'asc(price)'
        ],
        
        // Attributes to retrieve (šta vraća u rezultatima)
        attributesToRetrieve: [
          'objectID',
          'sku',
          'name',
          'description',
          'price',
          'instock',
          'quantity',
          'class',
          'alimsname',
          'type',
          'manufacturer_name',
          'vendor_name',
          'generic_name',
          'category_name',
          'image',
          'slug',
          'popularity_score'
        ],
        
        // Highlighting & Snippeting
        attributesToHighlight: ['name', 'description', 'alimsname', 'manufacturer_name'],
        attributesToSnippet: ['description:20'],
        
        // Pagination
        hitsPerPage: 20,
        paginationLimitedTo: 1000,
        
        // Typo tolerance
        typoTolerance: true,
        minWordSizefor1Typo: 4,
        minWordSizefor2Typos: 8,
      }
    });
    
    console.log('✅ Index settings postavljen.');
  } catch (error) {
    console.error('❌ Greška pri postavljanju settings:', error);
    if (error.message) {
      console.error('Poruka greške:', error.message);
    }
  }
}

// ===== POKRETANJE =====
syncProducts();
