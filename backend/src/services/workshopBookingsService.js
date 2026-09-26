import { db } from '../db/database.js';

export class WorkshopBookingsService {
  constructor() {
    this.queries = {
      getByUserId: db.prepare('SELECT * FROM workshop_bookings WHERE user_id = ? ORDER BY created_at DESC'),
      getById: db.prepare('SELECT * FROM workshop_bookings WHERE id = ?'),
      insert: db.prepare(`
        INSERT INTO workshop_bookings (id, user_id, workshop_name, workshop_zone, part_title, customer_name, customer_phone, customer_vehicle, preferred_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `),
      updateStatus: db.prepare('UPDATE workshop_bookings SET status = ? WHERE id = ?')
    };
  }

  createBooking({
    userId = null,
    workshopName,
    workshopZone,
    partTitle,
    customerName,
    customerPhone,
    customerVehicle,
    preferredDate = null
  }) {
    if (!workshopName || !customerName || !customerPhone) {
      throw new Error('Taller, nombre del cliente y teléfono son requeridos para agendar el turno');
    }

    const bookingId = `wb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    this.queries.insert.run(
      bookingId,
      userId || null,
      workshopName.trim(),
      (workshopZone || 'Gran Mendoza').trim(),
      (partTitle || 'Repuesto automotor').trim(),
      customerName.trim(),
      customerPhone.trim(),
      (customerVehicle || 'Vehículo').trim(),
      preferredDate ? String(preferredDate).trim() : null,
      'solicitado',
      now
    );

    return this.queries.getById.get(bookingId);
  }

  getUserBookings(userId) {
    if (!userId) return [];
    return this.queries.getByUserId.all(userId);
  }

  updateStatus(bookingId, status) {
    if (!bookingId || !status) return false;
    this.queries.updateStatus.run(status, bookingId);
    return true;
  }
}
