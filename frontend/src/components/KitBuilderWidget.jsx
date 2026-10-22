import React, { useState, useMemo, useEffect } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  MessageCircle,
  Store,
  MapPin,
  Car,
  Wrench,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Search,
  ChevronRight,
  ChevronDown,
  Droplets,
  Disc,
  Cog,
  Activity,
  Thermometer,
  Zap,
  RotateCcw,
  Star,
  ExternalLink,
  Shield,
  Layers,
  Fuel
} from 'lucide-react';
import { MENDOZA_QUOTE_STORES } from '../services/clientFallbackService.js';

// Catálogo de Concesionarios y Casas de Repuestos de Mendoza con especialización por marca
export const BRAND_SPECIALIZED_STORES = [
  // --- CHEVROLET ---
  {
    id: 'chevrolet-yacopini',
    name: 'Chevrolet Yacopini Motors (Concesionario Oficial GM)',
    brandKey: 'chevrolet',
    brandName: 'Chevrolet',
    brandBadge: '💎 Concesionario Oficial Chevrolet Mendoza • GM ACDelco',
    address: 'Av. San Martín Sur 600, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614674741',
    phone: '0261 467-4741',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.9,
    reviews: 580,
    specialties: ['Repuestos Genuinos GM', 'Línea ACDelco Oficial', 'Kits Distribución GM', 'Corsa, Onix, Cruze, Tracker, S10, Spin, Classic'],
    verified: true
  },
  {
    id: 'chevent-mendoza',
    name: 'Chevent Repuestos Chevrolet Mendoza',
    brandKey: 'chevrolet',
    brandName: 'Chevrolet',
    brandBadge: '⚡ Especialista Exclusivo Línea Chevrolet',
    address: 'Av. San Martín 2140, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614245500',
    phone: '0261 424-5500',
    schedule: 'Lun a Vie 8:30 - 18:30 | Sáb 8:30 - 13:00',
    rating: 4.8,
    reviews: 420,
    specialties: ['Línea Corsa, Classic, Onix, Prisma, Spin, Agile, Astra', 'Kits de Embrague y Distribución', 'Frenos y Suspensión GM'],
    verified: true
  },
  {
    id: 'warnes-mendoza-chevrolet',
    name: 'Warnes Mendoza Multimarca (Polo Carril Rodríguez Peña)',
    brandKey: 'multimarca',
    brandName: 'Multimarca / General',
    brandBadge: '📍 Polo Carril Rodríguez Peña • Stock Inmediato',
    address: 'Carril Rodríguez Peña 2450, Godoy Cruz, Mendoza',
    zone: 'Polo Carril Rodríguez Peña',
    whatsapp: '5492614979100',
    phone: '0261 497-9100',
    schedule: 'Lun a Vie 8:30 - 18:30 | Sáb 8:30 - 13:00',
    rating: 4.8,
    reviews: 640,
    specialties: ['Kits de Distribución Gates/SKF', 'Embragues Luk/Valeo', 'Frenos y Tren Delantero', 'Amplio Stock de Mostrador'],
    verified: true
  },
  {
    id: 'san-martin-repuestos',
    name: 'Repuestos San Martín (Motor & Mantenimiento)',
    brandKey: 'multimarca',
    brandName: 'Multimarca / General',
    brandBadge: '🏢 Mostrador Express Godoy Cruz',
    address: 'Av. San Martín 2140, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614245500',
    phone: '0261 424-5500',
    schedule: 'Lun a Vie 8:00 - 19:00 | Sáb 8:30 - 13:30',
    rating: 4.7,
    reviews: 520,
    specialties: ['Filtros Fram/Mann', 'Aceites Sintéticos', 'Bujías NGK/Bosch', 'Bombas Dolz y Termostatos'],
    verified: true
  },

  // --- VOLKSWAGEN ---
  {
    id: 'goldstein-vw',
    name: 'Goldstein Volkswagen Mendoza (Concesionario Oficial VW)',
    brandKey: 'volkswagen',
    brandName: 'Volkswagen',
    brandBadge: '💎 Concesionario Oficial VW Mendoza • Goldstein',
    address: 'Av. San Martín y Catamarca, Ciudad de Mendoza',
    zone: 'Ciudad (Centro)',
    whatsapp: '5492612401252',
    phone: '0261 240-1252',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.9,
    reviews: 620,
    specialties: ['Genuino Volkswagen Original', 'Gol Trend, Amarok, Fox, Suran, Bora, Vento, Polo, Taos', 'Distribución Original VW y Bombas'],
    verified: true
  },
  {
    id: 'yacopini-vw',
    name: 'Yacopini Motors Volkswagen Posventa',
    brandKey: 'volkswagen',
    brandName: 'Volkswagen',
    brandBadge: '💎 Red Oficial Volkswagen Cuyo',
    address: 'Av. San Martín Sur 600, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614674741',
    phone: '0261 467-4741',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.8,
    reviews: 490,
    specialties: ['Repuestos de Chasis y Motor VW', 'Service Oficial', 'Garantía de Fábrica'],
    verified: true
  },

  // --- FORD ---
  {
    id: 'goldstein-ford',
    name: 'Ford Goldstein Mendoza (Concesionario Oficial Ford)',
    brandKey: 'ford',
    brandName: 'Ford',
    brandBadge: '💎 Concesionario Oficial Ford Mendoza • Motorcraft',
    address: 'Pascual Toso 86, San José, Guaymallén, Mendoza',
    zone: 'Guaymallén',
    whatsapp: '5492617097286',
    phone: '0261 709-7286',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.8,
    reviews: 440,
    specialties: ['Línea Genuina Ford Motorcraft', 'Ranger, Focus, Fiesta, Ecosport, Ka, Territory', 'Kits de Distribución y Frenos Motorcraft'],
    verified: true
  },
  {
    id: 'lorenzo-ford',
    name: 'Lorenzo Automotores (División Ford)',
    brandKey: 'ford',
    brandName: 'Ford',
    brandBadge: '🏢 Mostrador Especialista Ford Mendoza',
    address: 'Av. San Martín Sur 1309, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614321000',
    phone: '0261 432-1000',
    schedule: 'Lun a Vie 8:30 - 18:00 | Sáb 9:00 - 13:00',
    rating: 4.8,
    reviews: 380,
    specialties: ['Línea Pick-Up Ranger', 'Repuestos de Motor Duratec y Puma TDCi', 'Embragues Reforzados'],
    verified: true
  },

  // --- FIAT ---
  {
    id: 'lorenzo-fiat',
    name: 'Fiat Lorenzo Automotores (Concesionario Oficial Mopar)',
    brandKey: 'fiat',
    brandName: 'Fiat',
    brandBadge: '💎 Concesionario Oficial Fiat Mopar Mendoza • Lorenzo',
    address: 'Av. San Martín Sur 1309, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614321000',
    phone: '0261 432-1000',
    schedule: 'Lun a Vie 8:30 - 18:00 | Sáb 9:00 - 13:00',
    rating: 4.8,
    reviews: 510,
    specialties: ['Repuestos Genuinos Fiat Mopar', 'Cronos, Toro, Palio, Uno, Siena, Fiorino, Strada, Pulse', 'Kit Distribución Fire / Firefly'],
    verified: true
  },
  {
    id: 'italrepuestos-fiat',
    name: 'Italrepuestos Fiat Mendoza (Especialista Italiano)',
    brandKey: 'fiat',
    brandName: 'Fiat',
    brandBadge: '⚡ Especialista Integral en Motores Fiat',
    address: 'Calle San Juan 780, Ciudad de Mendoza',
    zone: 'Ciudad (Centro)',
    whatsapp: '5492614298811',
    phone: '0261 429-8811',
    schedule: 'Lun a Vie 8:30 - 13:00 y 16:30 - 20:00 | Sáb 9:00 - 13:00',
    rating: 4.7,
    reviews: 350,
    specialties: ['Línea Cronos y Palio completa', 'Tren Delantero y Amortiguación', 'Termostatos, Bomba de Agua y Correas'],
    verified: true
  },

  // --- RENAULT ---
  {
    id: 'mediterraneo-renault',
    name: 'Renault Mediterráneo Automotores (Concesionario Oficial)',
    brandKey: 'renault',
    brandName: 'Renault',
    brandBadge: '💎 Concesionario Oficial Renault Mendoza • Mediterráneo',
    address: 'Av. San Martín 2100, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614221100',
    phone: '0261 422-1100',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.8,
    reviews: 480,
    specialties: ['Genuino Renault & Línea Motrio', 'Sandero, Logan, Kangoo, Duster, Clio, Stepway, Master', 'Kits Distribución K4M / K7M / HR16'],
    verified: true
  },
  {
    id: 'clio-repuestos',
    name: 'Clio Repuestos Mendoza (Especialista Renault)',
    brandKey: 'renault',
    brandName: 'Renault',
    brandBadge: '⚡ Especialista Exclusivo Línea Renault',
    address: 'Bandera de los Andes 1450, Guaymallén, Mendoza',
    zone: 'Guaymallén',
    whatsapp: '5492614312200',
    phone: '0261 431-2200',
    schedule: 'Lun a Vie 8:30 - 13:00 y 16:00 - 19:30 | Sáb 8:30 - 13:00',
    rating: 4.7,
    reviews: 390,
    specialties: ['Tren Delantero, Bujes y Cazoletas', 'Kits de Embrague y Frenos', 'Ópticas y Accesorios Renault'],
    verified: true
  },

  // --- PEUGEOT / CITROËN ---
  {
    id: 'agsm-peugeot',
    name: 'AGSM Peugeot Mendoza (Automotores Gral. San Martín)',
    brandKey: 'peugeot',
    brandName: 'Peugeot',
    brandBadge: '💎 Concesionario Oficial Peugeot Mendoza • Eurorepar',
    address: 'Av. San Martín 320, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614243300',
    phone: '0261 424-3300',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.8,
    reviews: 390,
    specialties: ['Genuino Peugeot & Eurorepar', 'Peugeot 208, 206, 207, 308, 408, Partner, 2008', 'Kits de Distribución TU3 / TU5 / EC5'],
    verified: true
  },
  {
    id: 'surfrance-citroen',
    name: 'Surfrance Citroën Mendoza (Concesionario Oficial)',
    brandKey: 'citroen',
    brandName: 'Citroën',
    brandBadge: '💎 Concesionario Oficial Citroën Mendoza • Surfrance',
    address: 'Av. San Martín 450, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614248800',
    phone: '0261 424-8800',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.7,
    reviews: 320,
    specialties: ['Berlingo, C3, C4, C4 Cactus', 'Repuestos Homologados PSA', 'Embragues y Frenos Genuinos'],
    verified: true
  },
  {
    id: 'leon-franceses',
    name: 'León Repuestos Franceses (Peugeot & Citroën)',
    brandKey: 'peugeot',
    brandName: 'Peugeot / Citroën',
    brandBadge: '⚡ Especialista en Línea Francesa PSA Mendoza',
    address: 'Av. San Martín 2140, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614245500',
    phone: '0261 424-5500',
    schedule: 'Lun a Vie 8:30 - 18:30 | Sáb 8:30 - 13:00',
    rating: 4.8,
    reviews: 310,
    specialties: ['Kits de Distribución con Bomba', 'Eje Trasero y Tren Delantero', 'Bujías, Bobinas y Sensores PSA'],
    verified: true
  },

  // --- TOYOTA ---
  {
    id: 'toyota-yacopini',
    name: 'Toyota Yacopini Mendoza (Concesionario Oficial Toyota)',
    brandKey: 'toyota',
    brandName: 'Toyota',
    brandBadge: '💎 Concesionario Oficial Toyota Mendoza • Yacopini',
    address: 'Carril Rodríguez Peña 1600, Godoy Cruz, Mendoza',
    zone: 'Polo Carril Rodríguez Peña',
    whatsapp: '5492614052800',
    phone: '0261 405-2800',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.9,
    reviews: 690,
    specialties: ['Toyota Genuine Parts', 'Hilux, Corolla, Etios, Yaris, SW4, Corolla Cross', 'Kits de Filtros y Pastillas de Freno Toyota'],
    verified: true
  },
  {
    id: 'distribuidora-cuyo-toyota',
    name: 'Distribuidora Cuyo (Especialista Hilux & 4x4)',
    brandKey: 'toyota',
    brandName: 'Toyota / Pick-Ups',
    brandBadge: '🚛 Especialista en Pick-Ups 4x4 & Tren Pesado',
    address: 'Carril Rodríguez Peña 1820, Maipú, Mendoza',
    zone: 'Polo Carril Rodríguez Peña',
    whatsapp: '5492614977700',
    phone: '0261 497-7700',
    schedule: 'Lun a Vie 8:00 - 18:00 | Sáb 8:00 - 13:00',
    rating: 4.8,
    reviews: 310,
    specialties: ['Hilux 2.4 / 2.8 / 3.0 D-4D', 'Kits de Embrague Aisin/Luk', 'Frenos y Suspensión Pesada', 'Filtros Donaldson'],
    verified: true
  },
  {
    id: 'japon-repuestos',
    name: 'Japón Autopartes Mendoza (Toyota & Asiáticos)',
    brandKey: 'toyota',
    brandName: 'Toyota / Asiáticos',
    brandBadge: '⚡ Especialista en Vehículos Japoneses & Asiáticos',
    address: 'Calle San Juan 780, Ciudad de Mendoza',
    zone: 'Ciudad (Centro)',
    whatsapp: '5492614298811',
    phone: '0261 429-8811',
    schedule: 'Lun a Vie 8:30 - 13:00 y 16:30 - 20:00 | Sáb 9:00 - 13:00',
    rating: 4.7,
    reviews: 280,
    specialties: ['Corolla, Etios, Yaris, Hilux', 'Bomba de Agua y Correas', 'Amortiguadores Kayaba (KYB)'],
    verified: true
  },

  // --- NISSAN ---
  {
    id: 'nissan-yacopini',
    name: 'Nissan Yacopini Mendoza (Concesionario Oficial)',
    brandKey: 'nissan',
    brandName: 'Nissan',
    brandBadge: '💎 Concesionario Oficial Nissan Mendoza • Yacopini',
    address: 'Carril Rodríguez Peña 1600, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614674741',
    phone: '0261 467-4741',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.8,
    reviews: 290,
    specialties: ['Genuino Nissan Value-Tier', 'Frontier, Versa, Kicks, Sentra, March', 'Kits Service Oficial'],
    verified: true
  },

  // --- MOTOS ---
  {
    id: 'modica-motos-kit',
    name: 'Módica Motos Mendoza (Motos & Scooters)',
    brandKey: 'moto',
    brandName: 'Motos',
    brandBadge: '🏍️ Concesionario Oficial Motos Mendoza • Módica Motos',
    address: 'Carlos Pellegrini 364, Guaymallén, Mendoza',
    zone: 'Guaymallén',
    whatsapp: '5492613478973',
    phone: '0261 347-8973',
    schedule: 'Lun a Vie 9:00 - 18:30 | Sáb 9:00 - 13:00',
    rating: 4.9,
    reviews: 490,
    specialties: ['Kits de Transmisión (Cadena, Corona y Piñón DID/Riffel)', 'Pastillas de Freno', 'Aceite Motul 4T y Filtros'],
    verified: true
  },

  // --- PESADOS / CAMIONES ---
  {
    id: 'ficamen-iveco',
    name: 'Ficamen S.A. Iveco Mendoza (Línea Pesada)',
    brandKey: 'iveco',
    brandName: 'Iveco',
    brandBadge: '💎 Concesionario Oficial Iveco Línea Pesada • Ficamen S.A.',
    address: 'Carril Rodríguez Peña 1982, Maipú, Mendoza',
    zone: 'Polo Carril Rodríguez Peña',
    whatsapp: '5492613426972',
    phone: '0261 342-6972',
    schedule: 'Lun a Vie 8:00 - 18:00',
    rating: 4.9,
    reviews: 310,
    specialties: ['Genuino Iveco Origin', 'Tector, Stralis, Daily, Eurocargo', 'Frenos de Aire, Turbos, Embragues'],
    verified: true
  },
  {
    id: 'scania-mendoza',
    name: 'Scania Argentina (Sucursal Cuyo Mendoza)',
    brandKey: 'scania',
    brandName: 'Scania',
    brandBadge: '💎 Concesionario Oficial Scania Cuyo • Scania Argentina',
    address: "O'Higgins y San Francisco del Monte 5519, Guaymallén",
    zone: 'Guaymallén',
    whatsapp: '5492615957745',
    phone: '0261 595-7745',
    schedule: 'Lun a Vie 8:00 - 17:30',
    rating: 4.9,
    reviews: 340,
    specialties: ['Genuino Scania Parts', 'Serie R, P, G, 113, 124', 'Kits de Reparación y Filtros Pesados'],
    verified: true
  }
];

// Kits Preconfigurados Populares
const PRESET_TEMPLATES = [
  {
    id: 'kit-service',
    title: 'Kit Service Completo (Filtros + Aceite)',
    category: 'Mantenimiento 10.000 / 15.000 km',
    icon: 'Droplets',
    badge: 'Mantenimiento Preventivo',
    color: 'from-amber-500 to-yellow-600',
    items: [
      { id: 'ks-1', name: 'Aceite de Motor Sintético 5W-30 / 5W-40 (4 Litros)', brand: 'Total / Castrol / Elaion', price: 48000, selected: true },
      { id: 'ks-2', name: 'Filtro de Aceite de Motor', brand: 'Mann Filter / Bosch', price: 14500, selected: true },
      { id: 'ks-3', name: 'Filtro de Aire de Motor', brand: 'Mann Filter / Wega', price: 18000, selected: true },
      { id: 'ks-4', name: 'Filtro de Habitáculo (Polen / Antipolen)', brand: 'Bosch / Mahle', price: 12000, selected: true },
      { id: 'ks-5', name: 'Filtro de Combustible (Nafta / Diésel)', brand: 'Fram / Bosch', price: 16500, selected: true }
    ]
  },
  {
    id: 'kit-distribucion',
    title: 'Kit Distribución + Bomba de Agua',
    category: 'Distribución y Refrigeración',
    icon: 'Cog',
    badge: 'Mantenimiento Crítico Mayor',
    color: 'from-red-600 to-rose-700',
    items: [
      { id: 'kd-1', name: 'Correa Dentada de Distribución', brand: 'Gates / Dayco', price: 42000, selected: true },
      { id: 'kd-2', name: 'Tensor y Rodillo Guía de Distribución', brand: 'INA / SKF', price: 38000, selected: true },
      { id: 'kd-3', name: 'Bomba de Agua con Junta', brand: 'Dolz / SKF', price: 39000, selected: true },
      { id: 'kd-4', name: 'Correa de Accesorios Poli-V', brand: 'Continental / Gates', price: 16000, selected: true },
      { id: 'kd-5', name: 'Líquido Refrigerante Anticongelante Orgánico (2L)', brand: 'Tir / Glacelf', price: 15000, selected: true }
    ]
  },
  {
    id: 'kit-frenos',
    title: 'Kit de Frenos Delanteros & Líquido',
    category: 'Seguridad y Frenado',
    icon: 'Disc',
    badge: 'Seguridad Máxima',
    color: 'from-rose-600 to-red-700',
    items: [
      { id: 'kf-1', name: 'Juego de Pastillas de Freno Delanteras', brand: 'Bosch / Cobreq / Fras-le', price: 32000, selected: true },
      { id: 'kf-2', name: 'Par de Discos de Freno Ventilados', brand: 'Fremax / Corven', price: 58000, selected: true },
      { id: 'kf-3', name: 'Líquido de Frenos Sintético DOT 4 (1L)', brand: 'Wagner / Bosch', price: 9500, selected: true }
    ]
  },
  {
    id: 'kit-suspension',
    title: 'Kit Tren Delantero y Amortiguación',
    category: 'Suspensión y Dirección',
    icon: 'Activity',
    badge: 'Confort y Control',
    color: 'from-blue-600 to-indigo-700',
    items: [
      { id: 'kt-1', name: 'Par de Amortiguadores Delanteros Reforzados', brand: 'Fric-Rot / Monroe', price: 94000, selected: true },
      { id: 'kt-2', name: 'Juego de Cazoletas con Crapodinas', brand: 'VTH / Axios', price: 29000, selected: true },
      { id: 'kt-3', name: 'Kit Fuelles Guardapolvo y Topes de Rebote', brand: 'RN / VTH', price: 14000, selected: true },
      { id: 'kt-4', name: 'Par de Extremos de Dirección y Rótulas', brand: 'Corven / Nakata', price: 28000, selected: true }
    ]
  },
  {
    id: 'kit-refrigeracion',
    title: 'Kit Refrigeración y Sistema Térmico',
    category: 'Temperatura del Motor',
    icon: 'Thermometer',
    badge: 'Prevención Temperatura',
    color: 'from-teal-600 to-cyan-700',
    items: [
      { id: 'kr-1', name: 'Radiador de Agua de Motor', brand: 'Valeo / Mahle', price: 78000, selected: true },
      { id: 'kr-2', name: 'Termostato con Cuerpo y Carcasa', brand: 'Mahle / Wahler', price: 34000, selected: true },
      { id: 'kr-3', name: 'Juego de Mangueras de Radiador Superior e Inferior', brand: 'Cauplas / Gates', price: 24000, selected: true },
      { id: 'kr-4', name: 'Tapa y Vaso Recuperador de Refrigerante', brand: 'Florio / Cauplas', price: 16000, selected: true },
      { id: 'kr-5', name: 'Refrigerante Orgánico Puro Larga Vida (2L)', brand: 'Tir / Glacelf', price: 15000, selected: true }
    ]
  },
  {
    id: 'kit-embrague',
    title: 'Kit de Embrague Completo',
    category: 'Transmisión y Caja',
    icon: 'Layers',
    badge: 'Tracción Óptima',
    color: 'from-purple-600 to-violet-700',
    items: [
      { id: 'ke-1', name: 'Placa de Embrague Reforzada', brand: 'Luk / Valeo', price: 92000, selected: true },
      { id: 'ke-2', name: 'Disco de Embrague con Amortiguación', brand: 'Luk / Valeo', price: 68000, selected: true },
      { id: 'ke-3', name: 'Crapodina de Empuje / Bombín Hidráulico', brand: 'SKF / Sachs', price: 38000, selected: true },
      { id: 'ke-4', name: 'Aceite de Caja de Cambios Manual (2L)', brand: 'Total / Castrol 75W-80', price: 24000, selected: true }
    ]
  },
  {
    id: 'kit-electricidad',
    title: 'Kit Encendido & Electricidad',
    category: 'Arranque y Chispa',
    icon: 'Zap',
    badge: 'Arranque Instantáneo',
    color: 'from-amber-600 to-orange-700',
    items: [
      { id: 'kz-1', name: 'Juego de 4 Bujías de Encendido de Iridium / Cobre', brand: 'NGK / Bosch', price: 22000, selected: true },
      { id: 'kz-2', name: 'Juego de Cables de Bujías Siliconados', brand: 'NGK / Genoud', price: 26000, selected: true },
      { id: 'kz-3', name: 'Batería 12V 65Ah Reforzada con Garantía', brand: 'Moura / Willard', price: 115000, selected: true }
    ]
  }
];

export function KitBuilderWidget({ vehicle, onOpenPatenteModal, onNavigateCotizador }) {
  // Lista de vehículos del usuario desde localStorage o prop inicial
  const [userVehicles, setUserVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('dinacity_user_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        patente: 'AD 192 OP',
        brand: 'Volkswagen',
        model: 'Gol Trend',
        version: 'Trendline 1.6 MSI 5P',
        year: 2019,
        engine: { name: '1.6 8V MSI Naftero (101 CV)' }
      },
      {
        patente: 'AE 341 KL',
        brand: 'Chevrolet',
        model: 'Onix',
        version: 'LTZ 1.4 SPE/4 5P',
        year: 2021,
        engine: { name: '1.4 SPE/4 Naftero (98 CV)' }
      },
      {
        patente: 'AF 482 QZ',
        brand: 'Toyota',
        model: 'Hilux',
        version: 'SRV 2.8 TDI 4x4',
        year: 2022,
        engine: { name: '2.8 16V D-4D Turbodiésel (204 CV)' }
      }
    ];
  });

  // Vehículo seleccionado actualmente para armar el kit
  const [currentCar, setCurrentCar] = useState(() => {
    if (vehicle && vehicle.brand) return vehicle;
    return userVehicles[0] || {
      patente: 'AD 192 OP',
      brand: 'Volkswagen',
      model: 'Gol Trend',
      version: 'Trendline 1.6 MSI',
      year: 2019,
      engine: { name: '1.6 8V MSI Naftero (101 CV)' }
    };
  });

  // Selector de kit plantilla o personalizado
  const [selectedTemplateId, setSelectedTemplateId] = useState('kit-service');
  
  // Lista activa de repuestos que componen el kit
  const [kitItems, setKitItems] = useState(() => {
    const initialTpl = PRESET_TEMPLATES[0];
    return initialTpl.items.map((it) => ({ ...it, quantity: 1 }));
  });

  // Campo para agregar repuestos personalizados al kit
  const [newPartName, setNewPartName] = useState('');
  const [newPartPrice, setNewPartPrice] = useState('');

  // Selector de marca manual si el usuario quiere cambiar a cualquier otra marca
  const [isChangingBrand, setIsChangingBrand] = useState(false);

  // Normalizar marca actual del auto
  const currentBrandKey = useMemo(() => {
    const b = (currentCar.brand || '').toLowerCase().trim();
    if (b.includes('chevrolet') || b.includes('chevy') || b.includes('corsa') || b.includes('onix')) return 'chevrolet';
    if (b.includes('volkswagen') || b.includes('vw') || b.includes('gol') || b.includes('amarok')) return 'volkswagen';
    if (b.includes('ford') || b.includes('ranger') || b.includes('focus')) return 'ford';
    if (b.includes('fiat') || b.includes('cronos') || b.includes('toro')) return 'fiat';
    if (b.includes('renault') || b.includes('sandero') || b.includes('kangoo') || b.includes('clio')) return 'renault';
    if (b.includes('peugeot') || b.includes('208') || b.includes('partner')) return 'peugeot';
    if (b.includes('citroen') || b.includes('berlingo') || b.includes('c3') || b.includes('c4')) return 'citroen';
    if (b.includes('toyota') || b.includes('hilux') || b.includes('corolla') || b.includes('etios')) return 'toyota';
    if (b.includes('nissan') || b.includes('frontier') || b.includes('kicks')) return 'nissan';
    if (b.includes('moto') || b.includes('honda') || b.includes('yamaha')) return 'moto';
    if (b.includes('iveco') || b.includes('scania') || b.includes('camion')) return 'iveco';
    return 'multimarca';
  }, [currentCar]);

  // Filtrar casas de repuestos especializadas en Mendoza según la marca del auto
  const specializedStores = useMemo(() => {
    return BRAND_SPECIALIZED_STORES.filter((store) => {
      if (currentBrandKey === 'multimarca') return true;
      // Mostrar casas que coincidan exactamente con la marca O que sean multimarca mayorista de Mendoza
      return store.brandKey === currentBrandKey || store.brandKey === 'multimarca';
    }).sort((a, b) => {
      // Priorizar la casa especialista oficial de la marca primero
      if (a.brandKey === currentBrandKey && b.brandKey !== currentBrandKey) return -1;
      if (b.brandKey === currentBrandKey && a.brandKey !== currentBrandKey) return 1;
      return 0;
    });
  }, [currentBrandKey]);

  // Si cambia el auto por prop externa
  useEffect(() => {
    if (vehicle && vehicle.brand) {
      setCurrentCar(vehicle);
    }
  }, [vehicle]);

  // Cargar plantilla cuando el usuario selecciona una
  const handleSelectTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setKitItems(tpl.items.map((it) => ({ ...it, quantity: 1 })));
  };

  // Marcar/desmarcar repuesto en el kit
  const handleToggleItem = (id) => {
    setKitItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it))
    );
  };

  // Eliminar repuesto del kit
  const handleRemoveItem = (id) => {
    setKitItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Agregar repuesto nuevo al kit
  const handleAddCustomPart = (e) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      name: newPartName.trim(),
      brand: 'A cotizar según stock en mostrador',
      price: newPartPrice ? parseFloat(newPartPrice) : 0,
      selected: true,
      quantity: 1,
      isCustom: true
    };

    setKitItems((prev) => [...prev, newItem]);
    setNewPartName('');
    setNewPartPrice('');
  };

  // Calcular precio total estimado del kit
  const totalEstimatedPrice = useMemo(() => {
    return kitItems
      .filter((it) => it.selected)
      .reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);
  }, [kitItems]);

  const activeItems = useMemo(() => {
    return kitItems.filter((it) => it.selected);
  }, [kitItems]);

  // Formato de moneda ARS
  const formatMoney = (val) => {
    if (!val || val === 0) return 'A cotizar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Generar y abrir mensaje de WhatsApp para la casa de repuestos especializada
  const handleSendWhatsAppToStore = (store) => {
    if (activeItems.length === 0) {
      alert('Por favor seleccioná al menos un repuesto para armar tu kit.');
      return;
    }

    const itemsFormatted = activeItems
      .map((it, idx) => `  ${idx + 1}. *${it.name}* (${it.brand}) ${it.price > 0 ? `~ ${formatMoney(it.price)}` : ''}`)
      .join('\n');

    const messageLines = [
      `👋 *Hola ${store.name}*, les consulto desde *DinAcitY Mendoza* para cotizar el siguiente *Kit de Repuestos a medida*:`,
      ``,
      `🚗 *Vehículo:* ${currentCar.brand} ${currentCar.model} ${currentCar.version || ''} (${currentCar.year || ''})`,
      `🇦🇷 *Patente:* ${currentCar.patente || 'A verificar'}`,
      `⚙️ *Motorización:* ${currentCar.engine?.name || 'Estándar de fábrica'}`,
      ``,
      `📦 *Repuestos que componen el Kit (${activeItems.length} piezas):*`,
      itemsFormatted,
      ``,
      totalEstimatedPrice > 0 ? `💰 *Presupuesto Estimado Guía:* ${formatMoney(totalEstimatedPrice)}` : '',
      `📍 *Consulta para su mostrador de:* ${store.address}`,
      ``,
      `¿Tienen stock y disponibilidad de estos repuestos juntos en su mostrador, y cuál es el precio final abonando de contado / transferencia o tarjeta?`,
      `¡Muchas gracias!`
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(messageLines)}`;
    window.open(url, '_blank');
  };

  // Marcas comunes para selección rápida
  const POPULAR_BRANDS = [
    { key: 'chevrolet', name: 'Chevrolet', icon: '🚗', badge: 'Yacopini GM • Chevent' },
    { key: 'volkswagen', name: 'Volkswagen', icon: '🚗', badge: 'Goldstein VW • Yacopini' },
    { key: 'ford', name: 'Ford', icon: '🚙', badge: 'Goldstein Ford • Lorenzo' },
    { key: 'fiat', name: 'Fiat', icon: '🚗', badge: 'Lorenzo Mopar • Italrepuestos' },
    { key: 'renault', name: 'Renault', icon: '🚗', badge: 'Mediterráneo • Clio Mendoza' },
    { key: 'peugeot', name: 'Peugeot', icon: '🦁', badge: 'AGSM Peugeot • León' },
    { key: 'citroen', name: 'Citroën', icon: '🚗', badge: 'Surfrance Citroën' },
    { key: 'toyota', name: 'Toyota', icon: '🛻', badge: 'Yacopini Toyota • Dist. Cuyo' },
    { key: 'nissan', name: 'Nissan', icon: '🛻', badge: 'Yacopini Nissan' },
    { key: 'moto', name: 'Motos', icon: '🏍️', badge: 'Módica Motos Mendoza' },
    { key: 'iveco', name: 'Línea Pesada', icon: '🚛', badge: 'Ficamen Iveco • Scania' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Principal del Armador de Kits */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-red-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white text-red-700 shadow-sm flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Armador Inteligente de Kits</span>
              </span>
              <span className="text-xs text-red-100 font-semibold hidden sm:inline">
                Cotización coordinada por WhatsApp en mostrador
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              📦 Armá tu Kit de Repuestos para tu Auto
            </h1>
            <p className="text-sm sm:text-base text-red-100/90 max-w-2xl mt-1 leading-relaxed">
              Seleccioná los repuestos que necesitás cambiar juntos. Te conectamos directamente con el WhatsApp de la <strong>casa de repuestos especializada en la marca de tu vehículo</strong> en Mendoza.
            </p>
          </div>

          {/* Tarjeta del Auto Seleccionado */}
          <div className="bg-black/30 backdrop-blur-md border border-white/25 rounded-2xl p-3.5 sm:p-4 shrink-0 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl border border-white/20 shrink-0">
              🚗
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-red-200 block">
                Vehículo Activo
              </span>
              <h3 className="font-black text-sm sm:text-base text-white leading-snug">
                {currentCar.brand} {currentCar.model}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-red-100">
                <span className="font-mono font-bold bg-white/20 px-1.5 py-0.2 rounded text-[11px]">
                  {currentCar.patente || 'AD 192 OP'}
                </span>
                <span>• {currentCar.year || '2019'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Selector de Autos del Usuario o Cambio de Marca */}
      <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm sm:text-base font-black text-white">
              Elegí cuál de tus autos vas a equipar:
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsChangingBrand(!isChangingBrand)}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{isChangingBrand ? 'Ocultar marcas' : '¿Querés elegir otra marca?'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isChangingBrand ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Botones de Autos Guardados en la Cochera */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {userVehicles.map((car, idx) => {
            const isSelected = (car.patente && car.patente === currentCar.patente) || car.model === currentCar.model;
            return (
              <button
                key={car.patente || idx}
                type="button"
                onClick={() => {
                  setCurrentCar(car);
                  setIsChangingBrand(false);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600/30 to-red-700/20 border-red-500 shadow-md ring-1 ring-red-400'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-700/70 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400'
                  }`}>
                    🚗
                  </div>
                  <div>
                    <span className="block font-black text-xs sm:text-sm text-white">
                      {car.brand} {car.model}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {car.patente} • {car.year}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panel Desplegable de Marcas Rápidas */}
        {isChangingBrand && (
          <div className="mt-4 pt-4 border-t border-slate-700/70 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-slate-300 block mb-2">
              Seleccioná la marca de tu vehículo para adaptar los mostradores especializados:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {POPULAR_BRANDS.map((b) => {
                const isSelected = currentBrandKey === b.key;
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => {
                      setCurrentCar((prev) => ({
                        ...prev,
                        brand: b.name,
                        model: b.key === 'chevrolet' ? 'Onix / Corsa' : b.key === 'volkswagen' ? 'Gol Trend' : b.key === 'toyota' ? 'Hilux' : b.name
                      }));
                      setIsChangingBrand(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-400 shadow-md font-black'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 text-xs font-bold'
                    }`}
                  >
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-xs">{b.name}</span>
                    <span className="text-[9px] text-slate-400 font-normal line-clamp-1">{b.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Selector de Kits Base Temáticos */}
      <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-red-500" />
            <h2 className="text-sm sm:text-base font-black text-white">
              Elegí un Kit Base o armalo a medida:
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Podés marcar, desmarcar y sumar repuestos libres
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {PRESET_TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tpl)}
                className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap text-xs font-bold transition flex items-center gap-2 border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-400 shadow-md ring-1 ring-red-400'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <span>{tpl.id === 'kit-service' ? '💧' : tpl.id === 'kit-distribucion' ? '⚙️' : tpl.id === 'kit-frenos' ? '🛑' : tpl.id === 'kit-suspension' ? '🛞' : tpl.id === 'kit-refrigeracion' ? '❄️' : tpl.id === 'kit-embrague' ? '🔄' : '⚡'}</span>
                <span>{tpl.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Constructor Interactivo de Repuestos del Kit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Lista de Repuestos del Kit */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/70 mb-4">
              <div>
                <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                  <span>Lista de Repuestos en tu Kit</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                    {activeItems.length} seleccionados
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Marcá o desmarcá los que necesites incluir en el presupuesto:
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Presupuesto Estimado
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  {formatMoney(totalEstimatedPrice)}
                </span>
              </div>
            </div>

            {/* Repuestos del Kit */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {kitItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    item.selected
                      ? 'bg-slate-900/90 border-blue-500/50 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                      item.selected ? 'bg-red-600 border-red-500 text-white' : 'border-slate-600 bg-slate-800'
                    }`}>
                      {item.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div>
                      <h4 className={`font-bold text-xs sm:text-sm leading-snug ${item.selected ? 'text-white' : 'text-slate-400 line-through'}`}>
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400">
                          Marca recomendada: <strong className="text-slate-300">{item.brand}</strong>
                        </span>
                        {item.isCustom && (
                          <span className="px-1.5 py-0.2 bg-purple-900/60 text-purple-300 border border-purple-500/40 rounded text-[9px] font-bold">
                            Personalizado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-black text-sm text-slate-200">
                      {formatMoney(item.price)}
                    </span>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
                      title="Quitar repuesto de la lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario para Agregar Repuesto Personalizado */}
            <form onSubmit={handleAddCustomPart} className="mt-4 pt-4 border-t border-slate-700/70">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                ➕ ¿Necesitás agregar otro repuesto al kit? Escribilo acá:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  placeholder="Ej: Manguera de agua, Termostato, Óptica delantera..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sumar al Kit</span>
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* Columna Derecha: Casas de Repuestos Especializadas por Marca */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
            
            <div className="pb-3 border-b border-slate-700/70 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Mostradores Especializados en Mendoza
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Pedí tu Kit a las Casas Oficiales de {currentCar.brand.toUpperCase()}:
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Filtramos únicamente las casas especializadas en tu marca para que no pierdas tiempo con quien no tiene el repuesto adecuado.
              </p>
            </div>

            {/* Listado de Casas Especializadas con WhatsApp directo */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {specializedStores.map((store) => (
                <div
                  key={store.id}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 shadow-sm hover:border-emerald-500/60 transition group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-500/40 mb-1">
                        {store.brandBadge}
                      </span>
                      <h4 className="font-black text-white text-sm group-hover:text-emerald-300 transition leading-snug">
                        {store.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 bg-yellow-950/60 border border-yellow-500/30 px-1.5 py-0.5 rounded text-[11px] font-bold text-yellow-300 shrink-0">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{store.rating}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-0.5 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{store.schedule}</span>
                    </div>
                  </div>

                  {/* Especialidades destacadas de la casa */}
                  <div className="mb-3 flex flex-wrap gap-1">
                    {store.specialties.slice(0, 3).map((sp, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {sp}
                      </span>
                    ))}
                  </div>

                  {/* Botón WhatsApp Pre-cargado con el Kit Completo */}
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppToStore(store)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>Pedir este Kit por WhatsApp ({activeItems.length} repuestos)</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
