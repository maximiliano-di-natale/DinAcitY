import { db } from '../db/database.js';

export class UserVehiclesService {
  constructor() {
    this.queries = {
      getByUserId: db.prepare('SELECT * FROM user_vehicles WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC'),
      getById: db.prepare('SELECT * FROM user_vehicles WHERE id = ?'),
      clearPrimary: db.prepare('UPDATE user_vehicles SET is_primary = 0 WHERE user_id = ?'),
      setPrimary: db.prepare('UPDATE user_vehicles SET is_primary = 1 WHERE id = ? AND user_id = ?'),
      insert: db.prepare(`
        INSERT INTO user_vehicles (id, user_id, patente, marca, modelo, anio, motor, vin, radicacion, is_primary, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `),
      delete: db.prepare('DELETE FROM user_vehicles WHERE id = ? AND user_id = ?'),
      countByUser: db.prepare('SELECT COUNT(*) as count FROM user_vehicles WHERE user_id = ?')
    };
  }

  addVehicle({ userId, patente, marca, modelo, anio, motor = null, vin = null, radicacion = null, isPrimary = false }) {
    if (!userId) throw new Error('ID de usuario requerido');
    if (!marca || !modelo || !anio) throw new Error('Marca, modelo y año son requeridos');

    const cleanPatente = patente ? patente.replace(/\s+/g, '').toUpperCase().trim() : null;
    const vehicleId = `veh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const existingCount = this.queries.countByUser.get(userId).count;
    const makePrimary = isPrimary || existingCount === 0;

    if (makePrimary) {
      this.queries.clearPrimary.run(userId);
    }

    this.queries.insert.run(
      vehicleId,
      userId,
      cleanPatente,
      marca.trim(),
      modelo.trim(),
      String(anio).trim(),
      motor ? motor.trim() : null,
      vin ? vin.trim() : null,
      radicacion ? radicacion.trim() : null,
      makePrimary ? 1 : 0,
      now
    );

    return this.queries.getById.get(vehicleId);
  }

  getUserVehicles(userId) {
    if (!userId) return [];
    return this.queries.getByUserId.all(userId);
  }

  deleteVehicle(userId, vehicleId) {
    if (!userId || !vehicleId) return false;
    this.queries.delete.run(vehicleId, userId);
    return true;
  }

  setPrimaryVehicle(userId, vehicleId) {
    if (!userId || !vehicleId) return false;
    this.queries.clearPrimary.run(userId);
    this.queries.setPrimary.run(vehicleId, userId);
    return true;
  }
}
