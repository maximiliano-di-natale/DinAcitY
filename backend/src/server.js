import express from 'express';
import cors from 'cors';
import { VEHICLE_TAXONOMY, PART_CATEGORIES, YEARS_LIST } from './data/vehicleTaxonomy.js';
import { AggregatorService } from './services/aggregatorService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const aggregatorService = new AggregatorService();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'DinAcitY Backend Aggregator API',
    timestamp: new Date().toISOString()
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor DinAcitY corriendo en http://localhost:${PORT}`);
  console.log(`🚗 Sistema comparador de repuestos listo para Autos, Motos y Camiones`);
});
