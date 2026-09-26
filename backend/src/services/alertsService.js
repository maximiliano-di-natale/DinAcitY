import { db } from '../db/database.js';

export class AlertsService {
  constructor() {
    this.queries = {
      getByUserId: db.prepare('SELECT * FROM price_alerts WHERE user_id = ? ORDER BY created_at DESC'),
      getByEmail: db.prepare('SELECT * FROM price_alerts WHERE email = ? ORDER BY created_at DESC'),
      getById: db.prepare('SELECT * FROM price_alerts WHERE id = ?'),
      insert: db.prepare(`
        INSERT INTO price_alerts (id, user_id, email, whatsapp, part_query, vehicle_brand, vehicle_model, vehicle_year, target_price, current_lowest_price, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `),
      delete: db.prepare('DELETE FROM price_alerts WHERE id = ? AND (user_id = ? OR email = ?)')
    };
  }

  createAlert({
    userId = null,
    email,
    whatsapp = null,
    partQuery,
    vehicleBrand = '',
    vehicleModel = '',
    vehicleYear = '',
    targetPrice = null,
    currentLowestPrice = null
  }) {
    if (!email || !partQuery) {
      throw new Error('Email y término del repuesto son obligatorios para crear la alerta');
    }

    const alertId = `alt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    this.queries.insert.run(
      alertId,
      userId || null,
      email.trim().toLowerCase(),
      whatsapp ? whatsapp.trim() : null,
      partQuery.trim(),
      vehicleBrand ? vehicleBrand.trim() : null,
      vehicleModel ? vehicleModel.trim() : null,
      vehicleYear ? String(vehicleYear).trim() : null,
      targetPrice ? Number(targetPrice) : null,
      currentLowestPrice ? Number(currentLowestPrice) : null,
      1,
      now
    );

    return this.queries.getById.get(alertId);
  }

  getUserAlerts(userId, email = null) {
    if (userId) {
      return this.queries.getByUserId.all(userId);
    }
    if (email) {
      return this.queries.getByEmail.all(email.trim().toLowerCase());
    }
    return [];
  }

  deleteAlert(alertId, userId, email = null) {
    if (!alertId) return false;
    this.queries.delete.run(alertId, userId || '', email || '');
    return true;
  }
}
