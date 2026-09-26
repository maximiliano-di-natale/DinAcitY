import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../src/db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exportDir = path.resolve(__dirname, '../exports');

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

console.log('\n======================================================');
console.log('       💾 EXPORTADOR DE BASE DE DATOS DINACITY');
console.log('======================================================\n');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
const fullBackup = {};

for (const t of tables) {
  const rows = db.prepare(`SELECT * FROM ${t.name}`).all();
  fullBackup[t.name] = rows;

  const tableFile = path.join(exportDir, `${t.name}.json`);
  fs.writeFileSync(tableFile, JSON.stringify(rows, null, 2), 'utf-8');
  console.log(`✅ Exportada tabla ${t.name.padEnd(20)} (${rows.length} filas) -> exports/${t.name}.json`);
}

const completeBackupFile = path.join(exportDir, 'dinacity_full_backup.json');
fs.writeFileSync(completeBackupFile, JSON.stringify(fullBackup, null, 2), 'utf-8');
console.log(`\n🎉 Backup completo guardado en: exports/dinacity_full_backup.json`);
console.log(`📍 Carpeta completa: ${exportDir}\n`);
