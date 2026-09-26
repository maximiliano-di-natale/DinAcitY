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

  // Índices para optimizar búsquedas frecuentes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON user_vehicles(user_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON price_alerts(user_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_email ON price_alerts(email);
    CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON workshop_bookings(user_id);
  `);

  // Migración automática de users.json preexistente a la base de datos SQL
  migrateLegacyUsers();

  console.log('✅ Base de datos SQLite inicializada correctamente en:', DB_PATH);
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
