import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ubicación del archivo de base de datos SQLite seguro
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = process.env.DATABASE_FILE || path.join(dataDir, 'dinacity.sqlite');

export const db = new DatabaseSync(DB_PATH);

export function initDatabase() {
  // Pragmas de seguridad y alto rendimiento
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');

  // 1. Tabla de Usuarios con contraseñas hasheadas y datos en Mendoza
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      direccion TEXT,
      telefono TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 2. Tabla de Vehículos Guardados por el Usuario (con patente DNRPA)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_vehicles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      patente TEXT,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      anio TEXT NOT NULL,
      motor TEXT,
      vin TEXT,
      radicacion TEXT,
      is_primary INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Tabla de Alertas de Precios de Repuestos
  db.exec(`
    CREATE TABLE IF NOT EXISTS price_alerts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      email TEXT NOT NULL,
      whatsapp TEXT,
      part_query TEXT NOT NULL,
      vehicle_brand TEXT,
      vehicle_model TEXT,
      vehicle_year TEXT,
      target_price REAL,
      current_lowest_price REAL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 4. Tabla de Solicitudes de Turnos e Instalación en Talleres Mecánicos de Mendoza
  db.exec(`
    CREATE TABLE IF NOT EXISTS workshop_bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      workshop_name TEXT NOT NULL,
      workshop_zone TEXT NOT NULL,
      part_title TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_vehicle TEXT NOT NULL,
      preferred_date TEXT,
      status TEXT DEFAULT 'solicitado',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 5. Catálogo Maestro Normalizado (Centrado en Código OEM / Número de Pieza Unificado)
  db.exec(`
    CREATE TABLE IF NOT EXISTS catalog_parts (
      id TEXT PRIMARY KEY,
      oem_code TEXT UNIQUE NOT NULL,
      codigo_fabricante TEXT,
      nombre_estandar TEXT NOT NULL,
      categoria TEXT NOT NULL,
      marca_vehiculo TEXT NOT NULL,
      modelo_vehiculo TEXT NOT NULL,
      anio_desde INTEGER,
      anio_hasta INTEGER,
      motor_compatible TEXT,
      tipo_repuesto TEXT DEFAULT 'original',
      marca_pieza TEXT,
      descripcion TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // 6. Ofertas Canónicas Pre-indexadas con URLs Directas a la Ficha del Repuesto
  db.exec(`
    CREATE TABLE IF NOT EXISTS canonical_part_offers (
      id TEXT PRIMARY KEY,
      part_id TEXT NOT NULL,
      oem_code TEXT NOT NULL,
      tienda TEXT NOT NULL,
      tienda_tipo TEXT NOT NULL,
      titulo_publicacion TEXT NOT NULL,
      precio REAL NOT NULL,
      moneda TEXT DEFAULT 'ARS',
      stock INTEGER DEFAULT 1,
      url_directa_producto TEXT NOT NULL,
      es_oficial INTEGER DEFAULT 0,
      ubicacion_mendoza TEXT,
      condicion TEXT DEFAULT 'nuevo',
      garantia_meses INTEGER DEFAULT 6,
      fecha_actualizacion TEXT NOT NULL,
      fecha_extraccion TEXT NOT NULL,
      estado TEXT DEFAULT 'activo',
      FOREIGN KEY (part_id) REFERENCES catalog_parts(id) ON DELETE CASCADE
    );
  `);

  // Índices para optimizar búsquedas frecuentes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON user_vehicles(user_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON price_alerts(user_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_email ON price_alerts(email);
    CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON workshop_bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_catalog_oem ON catalog_parts(oem_code);
    CREATE INDEX IF NOT EXISTS idx_catalog_veh ON catalog_parts(marca_vehiculo, modelo_vehiculo);
    CREATE INDEX IF NOT EXISTS idx_catalog_cat ON catalog_parts(categoria);
    CREATE INDEX IF NOT EXISTS idx_offers_part_id ON canonical_part_offers(part_id);
    CREATE INDEX IF NOT EXISTS idx_offers_oem ON canonical_part_offers(oem_code);
    CREATE INDEX IF NOT EXISTS idx_offers_tienda ON canonical_part_offers(tienda_tipo);
    CREATE INDEX IF NOT EXISTS idx_offers_precio ON canonical_part_offers(precio);
  `);

  // Migración automática de users.json preexistente a la base de datos SQL
  migrateLegacyUsers();

  // Sincronización del Catálogo Maestro OEM y Ofertas Canónicas Directas
  seedCatalogAndOffers();

  console.log('✅ Base de datos SQLite inicializada correctamente en:', DB_PATH);
}

function seedCatalogAndOffers() {
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM catalog_parts').get().count;
    if (count > 0) return; // Ya contiene registros

    // Cargar dataset inicial de piezas normalizadas
    import('../data/canonicalCatalogData.js').then(({ INITIAL_CATALOG_PARTS }) => {
      const insertPartStmt = db.prepare(`
        INSERT OR IGNORE INTO catalog_parts (
          id, oem_code, codigo_fabricante, nombre_estandar, categoria,
          marca_vehiculo, modelo_vehiculo, anio_desde, anio_hasta,
          motor_compatible, tipo_repuesto, marca_pieza, descripcion, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertOfferStmt = db.prepare(`
        INSERT OR IGNORE INTO canonical_part_offers (
          id, part_id, oem_code, tienda, tienda_tipo, titulo_publicacion,
          precio, moneda, stock, url_directa_producto, es_oficial,
          ubicacion_mendoza, condicion, garantia_meses, fecha_actualizacion,
          fecha_extraccion, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = new Date().toISOString();
      let partsCount = 0;
      let offersCount = 0;

      for (const part of INITIAL_CATALOG_PARTS) {
        insertPartStmt.run(
          part.id,
          part.oem_code,
          part.codigo_fabricante || null,
          part.nombre_estandar,
          part.categoria,
          part.marca_vehiculo,
          part.modelo_vehiculo,
          part.anio_desde || 2010,
          part.anio_hasta || 2024,
          part.motor_compatible || null,
          part.tipo_repuesto || 'original',
          part.marca_pieza || 'OEM',
          part.descripcion || null,
          now
        );
        partsCount++;

        if (Array.isArray(part.offers)) {
          for (const offer of part.offers) {
            insertOfferStmt.run(
              offer.id,
              part.id,
              part.oem_code,
              offer.tienda,
              offer.tienda_tipo,
              offer.titulo_publicacion,
              offer.precio,
              offer.moneda || 'ARS',
              offer.stock !== undefined ? offer.stock : 1,
              offer.url_directa_producto,
              offer.es_oficial ? 1 : 0,
              offer.ubicacion_mendoza || 'Mendoza, Argentina',
              offer.condicion || 'nuevo',
              offer.garantia_meses || 6,
              now,
              now,
              'activo'
            );
            offersCount++;
          }
        }
      }
      console.log(`📦 Catálogo Maestro inicializado con éxito: ${partsCount} piezas OEM y ${offersCount} ofertas canónicas indexadas.`);
    }).catch(err => {
      console.error('Error al sembrar catálogo inicial:', err.message);
    });
  } catch (err) {
    console.error('Error al inicializar catálogo:', err.message);
  }
}

function migrateLegacyUsers() {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount > 0) return; // Ya contiene datos

    const legacyPath = path.join(dataDir, 'users.json');
    if (fs.existsSync(legacyPath)) {
      const content = fs.readFileSync(legacyPath, 'utf-8');
      const legacyUsers = JSON.parse(content || '[]');

      if (Array.isArray(legacyUsers) && legacyUsers.length > 0) {
        const insertStmt = db.prepare(`
          INSERT INTO users (id, email, password_hash, nombre, apellido, direccion, telefono, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const u of legacyUsers) {
          insertStmt.run(
            u.id || `usr_${Date.now()}`,
            (u.email || '').toLowerCase().trim(),
            u.passwordHash || '',
            u.nombre || '',
            u.apellido || '',
            u.direccion || 'Mendoza',
            u.telefono || null,
            u.role || 'user',
            u.createdAt || new Date().toISOString(),
            new Date().toISOString()
          );
        }
        console.log(`📦 Se migraron exitosamente ${legacyUsers.length} usuarios existentes a SQLite.`);
      }
    }
  } catch (err) {
    console.error('Advertencia al migrar usuarios antiguos:', err.message);
  }
}
