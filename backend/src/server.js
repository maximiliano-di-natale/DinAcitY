import express from 'express';
import cors from 'cors';
import { VEHICLE_TAXONOMY, PART_CATEGORIES, YEARS_LIST } from './data/vehicleTaxonomy.js';
import { AggregatorService } from './services/aggregatorService.js';
import { AuthService } from './services/authService.js';
import { PatenteService } from './services/patenteService.js';
import { MENDOZA_WORKSHOPS, getEstimatedLabor } from './data/mendozaWorkshops.js';
import { generateVehicleKits } from './data/combosData.js';
import { CrossSellingService } from './services/crossSellingService.js';
import { initDatabase } from './db/database.js';
import { UserVehiclesService } from './services/userVehiclesService.js';
import { AlertsService } from './services/alertsService.js';
import { WorkshopBookingsService } from './services/workshopBookingsService.js';

// Inicializar base de datos SQL segura y ejecutar migraciones
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const aggregatorService = new AggregatorService();
const authService = new AuthService();
const patenteService = new PatenteService();
const crossSellingService = new CrossSellingService();
const userVehiclesService = new UserVehiclesService();
const alertsService = new AlertsService();
const workshopBookingsService = new WorkshopBookingsService();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'DinAcitY Backend Aggregator API',
    timestamp: new Date().toISOString()
  });
});

// Identificación Vehicular por Patente o VIN (DNRPA Argentina)
app.get('/api/vehicles/lookup-patente', (req, res) => {
  try {
    const { patente, vin } = req.query;
    const query = patente || vin || '';
    const result = patenteService.lookup(query);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Talleres Mecánicos Asociados en Mendoza
app.get('/api/workshops', (req, res) => {
  const { zone, specialty } = req.query;
  let list = [...MENDOZA_WORKSHOPS];
  if (zone && zone !== 'todos') {
    list = list.filter(w => w.zone.toLowerCase().includes(zone.toLowerCase()) || w.department.toLowerCase().includes(zone.toLowerCase()));
  }
  if (specialty && specialty !== 'todos') {
    list = list.filter(w => w.specialties.includes(specialty.toLowerCase()));
  }
  res.json({
    total: list.length,
    workshops: list
  });
});

// Estimación de Mano de Obra para Colocación
app.get('/api/workshops/estimate', (req, res) => {
  const { category, query, zone } = req.query;
  const labor = getEstimatedLabor(category || query);
  let relevantWorkshops = [...MENDOZA_WORKSHOPS];
  if (zone && zone !== 'todos') {
    const filtered = relevantWorkshops.filter(w => w.zone.toLowerCase().includes(zone.toLowerCase()));
    if (filtered.length > 0) relevantWorkshops = filtered;
  }
  res.json({
    laborEstimate: labor,
    recommendedWorkshops: relevantWorkshops.slice(0, 3)
  });
});

// Taxonomía de Vehículos (Autos, Motos, Camiones)
app.get('/api/vehicles/taxonomy', (req, res) => {
  res.json({
    types: VEHICLE_TAXONOMY,
    years: YEARS_LIST
  });
});

// Categorías de Repuestos Automotores
app.get('/api/categories', (req, res) => {
  res.json(PART_CATEGORIES);
});

// Paquetes Dinámicos y Kits para el Vehículo
app.get('/api/combos', (req, res) => {
  try {
    const { vehicleType = 'auto', brand = 'Volkswagen', model = 'Gol Trend', year = '2019' } = req.query;
    const kits = generateVehicleKits({ vehicleType, brand, model, year });
    res.json({
      vehicle: `${brand} ${model} (${year})`,
      totalKits: kits.length,
      kits
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar paquetes dinámicos', message: error.message });
  }
});

// Venta Cruzada (Cross-selling de Repuestos Complementarios)
app.get('/api/parts/cross-sell', (req, res) => {
  try {
    const { query = '', brand = '', model = '', vehicleType = 'auto' } = req.query;
    const recommendations = crossSellingService.getRecommendations({ query, brand, model, vehicleType });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recomendaciones cruzadas', message: error.message });
  }
});

// Búsqueda y Comparador de Precios Agregado
app.get('/api/parts/search', async (req, res) => {
  try {
    const data = await aggregatorService.searchParts(req.query);
    res.json(data);
  } catch (error) {
    console.error('Error en búsqueda de repuestos:', error);
    res.status(500).json({ error: 'Error al procesar la búsqueda en los proveedores', message: error.message });
  }
});

// Ofertas destacadas del día
app.get('/api/parts/featured', async (req, res) => {
  try {
    const autoDeals = await aggregatorService.searchParts({ query: 'radiador', vehicleType: 'auto', brand: 'volkswagen', model: 'Gol Trend' });
    const motoDeals = await aggregatorService.searchParts({ query: 'pastillas de freno', vehicleType: 'moto', brand: 'honda', model: 'XR 250 Tornado' });
    const camionDeals = await aggregatorService.searchParts({ query: 'termostato', vehicleType: 'camion', brand: 'scania', model: '113 H/T' });

    res.json({
      auto: autoDeals.results.slice(0, 3),
      moto: motoDeals.results.slice(0, 3),
      camion: camionDeals.results.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ofertas destacadas', message: error.message });
  }
});

// ==========================================
// Rutas de Autenticación Segura de Usuarios
// ==========================================

// Registro Seguro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, apellido, direccion, email, password } = req.body;
    const result = await authService.register({ nombre, apellido, direccion, email, password });
    res.status(201).json(result);
  } catch (error) {
    console.warn('Fallo en registro:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Inicio de Sesión
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (error) {
    console.warn('Fallo en login:', error.message);
    res.status(401).json({ error: error.message });
  }
});

// Obtener Usuario Autenticado actual
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    const user = await authService.verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Error de autenticación', message: error.message });
  }
});

// Actualizar Perfil / Dirección en Mendoza
app.put('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    const decodedUser = await authService.verifyToken(token);
    if (!decodedUser) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const { nombre, apellido, direccion } = req.body;
    const result = await authService.updateProfile(decodedUser.id, { nombre, apellido, direccion });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Middleware de Autenticación
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  const user = await authService.verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
  req.user = user;
  next();
};

// ==========================================
// Rutas de Vehículos Guardados por el Usuario
// ==========================================
app.get('/api/user/vehicles', requireAuth, (req, res) => {
  try {
    const vehicles = userVehiclesService.getUserVehicles(req.user.id);
    res.json({ vehicles });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar vehículos', message: error.message });
  }
});

app.post('/api/user/vehicles', requireAuth, (req, res) => {
  try {
    const { patente, marca, modelo, anio, motor, vin, radicacion, isPrimary } = req.body;
    const vehicle = userVehiclesService.addVehicle({
      userId: req.user.id,
      patente,
      marca,
      modelo,
      anio,
      motor,
      vin,
      radicacion,
      isPrimary
    });
    res.status(201).json({ vehicle });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/user/vehicles/:id', requireAuth, (req, res) => {
  try {
    const success = userVehiclesService.deleteVehicle(req.user.id, req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// Rutas de Alertas de Precios en Base de Datos
// ==========================================
app.post('/api/alerts', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const user = await authService.verifyToken(authHeader.split(' ')[1]);
      if (user) userId = user.id;
    }

    const { email, whatsapp, partQuery, vehicleBrand, vehicleModel, vehicleYear, targetPrice, currentLowestPrice } = req.body;
    const alert = alertsService.createAlert({
      userId,
      email,
      whatsapp,
      partQuery,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      targetPrice,
      currentLowestPrice
    });
    res.status(201).json({ alert });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/user/alerts', requireAuth, (req, res) => {
  try {
    const alerts = alertsService.getUserAlerts(req.user.id, req.user.email);
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar alertas', message: error.message });
  }
});

app.delete('/api/alerts/:id', requireAuth, (req, res) => {
  try {
    const success = alertsService.deleteAlert(req.params.id, req.user.id, req.user.email);
    res.json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// Rutas de Turnos de Talleres en Base de Datos
// ==========================================
app.post('/api/workshops/bookings', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const user = await authService.verifyToken(authHeader.split(' ')[1]);
      if (user) userId = user.id;
    }

    const { workshopName, workshopZone, partTitle, customerName, customerPhone, customerVehicle, preferredDate } = req.body;
    const booking = workshopBookingsService.createBooking({
      userId,
      workshopName,
      workshopZone,
      partTitle,
      customerName,
      customerPhone,
      customerVehicle,
      preferredDate
    });
    res.status(201).json({ booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/user/bookings', requireAuth, (req, res) => {
  try {
    const bookings = workshopBookingsService.getUserBookings(req.user.id);
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar turnos', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor DinAcitY corriendo en http://localhost:${PORT}`);
  console.log(`🚗 Sistema comparador de repuestos listo para Autos, Motos y Camiones`);
});
