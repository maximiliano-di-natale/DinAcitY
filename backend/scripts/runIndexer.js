import { initDatabase, db } from '../src/db/database.js';
import { catalogIndexer } from '../src/crawler/catalogIndexer.js';

console.log('\n===============================================================');
console.log('  ⚙️  DINACITY CRAWLER & INDEXADOR DE URLs CANÓNICAS (OEM)');
console.log('===============================================================\n');

// 1. Inicializar DB
initDatabase();

// 2. Ejecutar sincronización de catálogo OEM y ofertas canónicas
const syncResult = catalogIndexer.syncCatalogAndOffers();
console.log(`✅ Piezas OEM sincronizadas: ${syncResult.partsInserted}`);
console.log(`✅ Ofertas canónicas directas indexadas: ${syncResult.offersInserted}\n`);

// 3. Ejecutar ciclo del crawler para actualizar stock y fechas
console.log('🔄 Ejecutando ciclo de verificación y actualización del crawler...');
const crawlResult = catalogIndexer.runCrawlerCycle();
console.log(`📡 Publicaciones verificadas: ${crawlResult.refreshedOffers}`);
console.log(`⏰ Timestamp de actualización: ${crawlResult.timestamp}\n`);

// 4. Mostrar estadísticas
const stats = catalogIndexer.getStats();
console.log('📊 ESTADÍSTICAS DEL CATÁLOGO EN DBeaver / SQLite:');
console.log(`   - Piezas OEM únicas normalizadas: ${stats.catalogPartsCount}`);
console.log(`   - Ofertas y URLs canónicas directas: ${stats.canonicalOffersCount}`);
console.log(`   - Tiendas y distribuidores indexados: ${stats.distinctStoresCount}`);
console.log(`   - Stock total verificado en Mendoza: ${stats.totalStockVerified} unidades\n`);

// 5. Muestra de las URLs Canónicas directas indexadas
console.log('🔍 MUESTRA DE OFERTAS CON URLS CANÓNICAS DIRECTAS A FICHA DE PRODUCTO:');
const sampleOffers = db.prepare(`
  SELECT 
    c.oem_code,
    c.marca_vehiculo || ' ' || c.modelo_vehiculo as vehiculo,
    c.nombre_estandar as pieza,
    o.tienda,
    o.precio,
    o.stock,
    o.url_directa_producto,
    o.fecha_actualizacion
  FROM catalog_parts c
  JOIN canonical_part_offers o ON c.id = o.part_id
  LIMIT 8
`).all();

console.table(sampleOffers);
console.log('\n===============================================================\n');
