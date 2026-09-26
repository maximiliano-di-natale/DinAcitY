import { db } from '../src/db/database.js';

console.log('\n======================================================');
console.log('       🔍 EXPLORADOR DE BASE DE DATOS DINACITY');
console.log('======================================================\n');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

for (const t of tables) {
  console.log(`\n📋 TABLA: [ ${t.name.toUpperCase()} ]`);
  const rows = db.prepare(`SELECT * FROM ${t.name}`).all();
  if (rows.length === 0) {
    console.log('   (Sin registros aún)');
  } else {
    console.table(rows);
  }
}
console.log('\n======================================================\n');
