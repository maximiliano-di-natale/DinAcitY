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
  Fuel,
  Copy,
  Info,
  Calendar,
  CreditCard,
  Flame,
  Award
} from 'lucide-react';
import { MENDOZA_QUOTE_STORES } from '../services/clientFallbackService.js';

// Catálogo de Concesionarios y Casas de Repuestos de Mendoza con especialización por marca
export const BRAND_SPECIALIZED_STORES = [
  // --- CHEVROLET ---
  {
    id: 'chevrolet-yacopini',
    name: 'Chevrolet Yacopini Motors (Concesionario Oficial GM)',
    shortName: 'Yacopini GM',
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
    shortName: 'Chevent Repuestos',
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
    shortName: 'Warnes Mendoza',
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
    shortName: 'Repuestos San Martín',
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
    shortName: 'Goldstein VW',
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
    shortName: 'Yacopini VW',
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
    shortName: 'Goldstein Ford',
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
    specialties: ['Línea Genuina Motorcraft', 'Ranger, Ka, Focus, Fiesta, EcoSport, Territory', 'Kits de Distribución y Filtros Oficiales'],
    verified: true
  },
  {
    id: 'lorenzo-ford',
    name: 'Lorenzo Motors Ford Repuestos Mendoza',
    shortName: 'Lorenzo Ford',
    brandKey: 'ford',
    brandName: 'Ford',
    brandBadge: '⚡ Especialista Ford & Motorcraft Mendoza',
    address: 'Carril Rodríguez Peña 2200, Godoy Cruz, Mendoza',
    zone: 'Polo Carril Rodríguez Peña',
    whatsapp: '5492614674741',
    phone: '0261 467-4741',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.7,
    reviews: 310,
    specialties: ['Pastillas Motorcraft', 'Amortiguadores Fric-Rot/Monroe', 'Kits de Correa y Bombas'],
    verified: true
  },

  // --- FIAT ---
  {
    id: 'lorenzo-fiat',
    name: 'Lorenzo Automotores Fiat (Concesionario Oficial Mopar)',
    shortName: 'Lorenzo Fiat Mopar',
    brandKey: 'fiat',
    brandName: 'Fiat',
    brandBadge: '💎 Concesionario Oficial Fiat Mendoza • Mopar Original',
    address: 'Av. San Martín 1309, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614245500',
    phone: '0261 424-5500',
    schedule: 'Lun a Vie 8:30 - 18:30 | Sáb 9:00 - 13:00',
    rating: 4.8,
    reviews: 510,
    specialties: ['Genuino Mopar Fiat', 'Cronos, Argo, Toro, Strada, Mobi, Palio, Siena, Uno', 'Aceites Selenia y Filtros Originales'],
    verified: true
  },
  {
    id: 'italrepuestos-fiat',
    name: 'Italrepuestos Fiat & Multimarca Mendoza',
    shortName: 'Italrepuestos Fiat',
    brandKey: 'fiat',
    brandName: 'Fiat',
    brandBadge: '⚡ Especialista en Línea Italiana Fiat & Mopar',
    address: 'Calle Necochea 420, Ciudad de Mendoza',
    zone: 'Ciudad (Centro)',
    whatsapp: '5492614245500',
    phone: '0261 424-5500',
    schedule: 'Lun a Vie 8:30 - 13:00 y 16:30 - 20:00',
    rating: 4.7,
    reviews: 380,
    specialties: ['Kits de Distribución Fire y Firefly', 'Embragues Valeo/Luk', 'Frenos y Tren Delantero Fiat'],
    verified: true
  },

  // --- RENAULT ---
  {
    id: 'mediterraneo-renault',
    name: 'Mediterráneo Renault Mendoza (Concesionario Oficial)',
    shortName: 'Mediterráneo Renault',
    brandKey: 'renault',
    brandName: 'Renault',
    brandBadge: '💎 Concesionario Oficial Renault Mendoza • Motrio',
    address: 'Av. San Martín 1950, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614248800',
    phone: '0261 424-8800',
    schedule: 'Lun a Vie 8:30 - 18:30',
    rating: 4.8,
    reviews: 470,
    specialties: ['Repuestos Genuinos Renault & Motrio', 'Sandero, Logan, Kangoo, Stepway, Duster, Clio, Alaskan', 'Kits Distribución K4M / K7M / H4M'],
    verified: true
  },
  {
    id: 'clio-repuestos',
    name: 'Clio Repuestos Mendoza (Especialista Renault)',
    shortName: 'Clio Repuestos',
    brandKey: 'renault',
    brandName: 'Renault',
    brandBadge: '⚡ Especialista Exclusivo Línea Renault',
    address: 'Av. San Martín 2140, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614245500',
    phone: '0261 424-5500',
    schedule: 'Lun a Vie 8:30 - 18:30 | Sáb 8:30 - 13:00',
    rating: 4.7,
    reviews: 340,
    specialties: ['Aceite Elf y Filtros Purflux', 'Bombas de Agua Dolz', 'Frenos y Amortiguadores Renault'],
    verified: true
  },

  // --- PEUGEOT & CITROËN ---
  {
    id: 'agsm-peugeot',
    name: 'Automotores General San Martín (Peugeot Oficial)',
    shortName: 'AGSM Peugeot',
    brandKey: 'peugeot',
    brandName: 'Peugeot',
    brandBadge: '💎 Concesionario Oficial Peugeot Mendoza • AGSM',
    address: 'Av. San Martín 450, Godoy Cruz, Mendoza',
    zone: 'Godoy Cruz',
    whatsapp: '5492614248800',
    phone: '0261 424-8800',
    schedule: 'Lun a Vie 8:30 - 18:00',
    rating: 4.8,
    reviews: 390,
    specialties: ['Genuino Peugeot & Eurorepar', 'Peugeot 208, 206, 207, 308, 408, Partner, 2008', 'Kits de Distribución TU3 / TU5 / EC5'],
    verified: true
  },
  {
    id: 'surfrance-citroen',
    name: 'Surfrance Citroën Mendoza (Concesionario Oficial)',
    shortName: 'Surfrance Citroën',
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
    shortName: 'León Repuestos PSA',
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
    shortName: 'Yacopini Toyota',
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
    shortName: 'Distribuidora Cuyo 4x4',
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
    shortName: 'Japón Autopartes',
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
    shortName: 'Yacopini Nissan',
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
    shortName: 'Módica Motos',
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
    shortName: 'Ficamen Iveco',
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
    shortName: 'Scania Cuyo',
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

// Opciones de Intención y Formato de Mensaje para WhatsApp (SIN PRECIOS)
export const CONSULTATION_TYPES = [
  {
    id: 'standard',
    title: 'Disponibilidad y Cotización',
    subtitle: 'Consulta de stock en mostrador y presupuesto total',
    badge: 'Recomendado',
    icon: 'Store',
    intentText: '¿Tienen disponibilidad de estos repuestos juntos en su mostrador y cuál sería el importe total para retirar?'
  },
  {
    id: 'urgent',
    title: 'Retiro Inmediato (Hoy)',
    subtitle: 'Prioridad de stock en mano para retirar en el día',
    badge: 'Urgente',
    icon: 'Flame',
    intentText: 'Necesito retirar estos repuestos en el día de hoy. ¿Tienen todas estas piezas en stock para entrega inmediata en mostrador?'
  },
  {
    id: 'financing',
    title: 'Formas de Pago & Cuotas',
    subtitle: 'Precio contado/transferencia vs tarjetas de crédito',
    badge: 'Financiación',
    icon: 'CreditCard',
    intentText: 'Quisiera consultar si cuentan con stock de este kit y cuáles son los medios de pago disponibles (descuento contado/transferencia o planes de cuotas con tarjeta de crédito / Cuota Simple).'
  },
  {
    id: 'original_vs_aftermarket',
    title: 'Línea Original vs Alternativa',
    subtitle: 'Opciones Genuinas OEM vs marcas homologadas',
    badge: 'Marcas',
    icon: 'Award',
    intentText: 'Quisiera consultar si disponen de estas piezas en repuesto Genuino Oficial de fábrica o qué alternativas de primera línea homologada me recomiendan.'
  }
];

// Generador Inteligente de Kits y Repuestos específicos según el auto y motor del DNRPA
export function getVehicleSpecificKits(car) {
  const brand = (car?.brand || '').toLowerCase().trim();
  const model = (car?.model || '').toLowerCase().trim();
  const engineName = car?.engine?.name || car?.version || '';
  const carName = `${car?.brand || 'Vehículo'} ${car?.model || ''}`.trim();

  // 1. VOLKSWAGEN (Gol Trend, Fox, Suran, Amarok, Polo, Bora, etc.)
  if (brand.includes('volkswagen') || brand.includes('vw')) {
    const isAmarok = model.includes('amarok');
    const isGolTrend = model.includes('gol') || model.includes('fox') || model.includes('suran') || model.includes('voyage');

    return [
      {
        id: 'kit-service',
        title: 'Kit Service Aceite & Filtros',
        category: 'Mantenimiento Preventivo 10.000 / 15.000 km',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'vw-ks-1',
            name: isAmarok
              ? 'Aceite Sintético 5W-30 Low SAPS (Norma VW 504.00/507.00 - 8 Litros)'
              : 'Aceite Sintético 5W-40 (Norma VW 502.00 / 505.00 - 4 Litros)',
            brand: 'Castrol Magnatec / Total Quartz / Elaion F50 Plus',
            spec: isAmarok ? 'Norma VW 507.00 DPF Diésel' : 'Norma Oficial VW 502.00 Nafta',
            selected: true
          },
          {
            id: 'vw-ks-2',
            name: isGolTrend
              ? 'Filtro de Aceite Blindado VW EA111 / MSI (Mann W712/53)'
              : 'Filtro de Aceite de Motor Genuino VW / Mann Filter',
            brand: 'Mann Filter / Mahle Original',
            spec: 'Válvula antirretorno y bypass calibrado VW',
            selected: true
          },
          {
            id: 'vw-ks-3',
            name: isGolTrend
              ? 'Filtro de Aire de Motor Panel (Mann C2998/5X)'
              : 'Filtro de Aire de Motor de Alto Flujo',
            brand: 'Mann Filter / Wega',
            spec: 'Retención de micropartículas de alta eficiencia',
            selected: true
          },
          {
            id: 'vw-ks-4',
            name: 'Filtro de Habitáculo Antipolen para Climatización',
            brand: 'Mann Filter CU2545 / Bosch',
            spec: 'Carbón activo para purificación de cabina',
            selected: true
          },
          {
            id: 'vw-ks-5',
            name: isAmarok
              ? 'Filtro de Combustible Diésel con Sensor de Agua'
              : 'Filtro de Combustible Nafta con Retorno (4 Bar)',
            brand: 'Mann Filter WK58/3 / Mahle',
            spec: 'Carcasa de aluminio presurizada',
            selected: true
          }
        ]
      },
      {
        id: 'kit-distribucion',
        title: 'Kit Distribución + Bomba de Agua',
        category: 'Distribución y Refrigeración Crítica',
        icon: 'Cog',
        badge: 'Crítico Mayor',
        items: [
          {
            id: 'vw-kd-1',
            name: isGolTrend
              ? 'Correa Dentada de Distribución 135 Dientes (Gates / VW)'
              : 'Correa Dentada de Distribución Reforzada HNBR',
            brand: 'Gates PowerGrip / Continental Contitech',
            spec: 'Compuesto HNBR resistente a altas temperaturas',
            selected: true
          },
          {
            id: 'vw-kd-2',
            name: 'Tensor Móvil Automático de Distribución',
            brand: 'INA Schaeffler / SKF',
            spec: 'Amortiguación hidromecánica de tensión constante',
            selected: true
          },
          {
            id: 'vw-kd-3',
            name: 'Bomba de Agua con Turbina Metálica y O-Ring',
            brand: 'Dolz V-125 / SKF Aquamax',
            spec: 'Empaque cerámico de larga vida',
            selected: true
          },
          {
            id: 'vw-kd-4',
            name: 'Correa Poli-V de Accesorios Alternador / Dirección',
            brand: 'Continental 6PK1200 / Gates',
            spec: 'Perfil EPDM anti-chillidos',
            selected: true
          },
          {
            id: 'vw-kd-5',
            name: 'Líquido Refrigerante Anticongelante Orgánico G12/G13 Rosa (2L Concentrado)',
            brand: 'Kriox / Tir / Glacelf Supra',
            spec: 'Protección de cavitación para blocks de aluminio VW',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit de Frenos Delanteros & Líquido',
        category: 'Seguridad y Sistema de Frenado',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'vw-kf-1',
            name: 'Juego de Pastillas de Freno Delanteras (Sistema Teves/VW)',
            brand: 'Bosch / Cobreq / Fras-le',
            spec: 'Compuesto semimetálico bajo en polvillo con chapa antirruido',
            selected: true
          },
          {
            id: 'vw-kf-2',
            name: isAmarok
              ? 'Juego de Discos de Freno Ventilados Delanteros 308mm'
              : 'Juego de Discos de Freno Ventilados Delanteros (239mm / 256mm)',
            brand: 'Fremax Carbon+ / Corven Hi-Tech',
            spec: 'Pistas rectificadas con protección anticorrosiva',
            selected: true
          },
          {
            id: 'vw-kf-3',
            name: 'Líquido de Frenos Sintético DOT 4 LV (Baja Viscosidad - 1L)',
            brand: 'Bosch DOT 4 HP / Wagner Lockheed',
            spec: 'Punto de ebullición seco > 260°C apto sistemas ABS/ESP',
            selected: true
          }
        ]
      },
      {
        id: 'kit-embrague',
        title: 'Kit de Embrague Completo',
        category: 'Transmisión y Cadena Cinemática',
        icon: 'Layers',
        badge: 'Tracción',
        items: [
          {
            id: 'vw-ke-1',
            name: 'Placa de Presión de Embrague con Diafragma Templado',
            brand: 'Luk RepSet / Valeo Original',
            spec: 'Balanceo dinámico de fábrica sin vibraciones',
            selected: true
          },
          {
            id: 'vw-ke-2',
            name: 'Disco de Embrague con Resortes de Amortiguación Progresiva',
            brand: 'Luk / Sachs',
            spec: 'Guarniciones libres de asbesto de alto coeficiente de fricción',
            selected: true
          },
          {
            id: 'vw-ke-3',
            name: 'Crapodina / Rulemán de Empuje de Embrague',
            brand: 'INA / SKF',
            spec: 'Rodamiento sellado de alta velocidad de giro',
            selected: true
          },
          {
            id: 'vw-ke-4',
            name: 'Aceite Sintético de Caja Manual 75W (Norma VW G 052 512 A2)',
            brand: 'Castrol Syntrans / Total Traxium',
            spec: 'Protección de sincronizados de bronce VW 02T',
            selected: true
          }
        ]
      },
      {
        id: 'kit-encendido',
        title: 'Kit Encendido & Electricidad',
        category: 'Arranque, Inyección y Chispa',
        icon: 'Zap',
        badge: 'Encendido',
        items: [
          {
            id: 'vw-kz-1',
            name: isGolTrend
              ? 'Juego de 4 Bujías NGK V-Power (ZFR6T-11D Específica EA111)'
              : 'Juego de 4 Bujías de Encendido de Alto Rendimiento',
            brand: 'NGK V-Power / Bosch Nickel',
            spec: 'Luz de electrodo calibrada de fábrica a 1.1mm',
            selected: true
          },
          {
            id: 'vw-kz-2',
            name: 'Juego de Cables de Bujías Siliconados de 7mm / 8mm',
            brand: 'NGK SC-V04 / Genoud',
            spec: 'Aislación de silicona pura clase F resistente a 220°C',
            selected: true
          },
          {
            id: 'vw-kz-3',
            name: 'Bobina de Encendido Módulo 4 Salidas (Sistema Estático)',
            brand: 'Bosch / Magneti Marelli',
            spec: 'Bobinado primario y secundario blindado en epoxi',
            selected: true
          },
          {
            id: 'vw-kz-4',
            name: 'Batería 12V 65Ah Reforzada Libre de Mantenimiento',
            brand: 'Moura M60GD / Willard Plata',
            spec: 'Polo positivo invertido derecho con visor hidrómetro',
            selected: true
          }
        ]
      },
      {
        id: 'kit-suspension',
        title: 'Kit Tren Delantero y Amortiguación',
        category: 'Suspensión, Alineación y Confort',
        icon: 'Activity',
        badge: 'Confort',
        items: [
          {
            id: 'vw-kt-1',
            name: 'Par de Amortiguadores Delanteros a Gas Presurizado',
            brand: 'Fric-Rot Max / Monroe Gas-Magnum',
            spec: 'Válvula de respuesta rápida a baches y pozos',
            selected: true
          },
          {
            id: 'vw-kt-2',
            name: 'Juego de Cazoletas Delanteras con Crapodinas de Giro',
            brand: 'VTH / Axios Monroe',
            spec: 'Goma virgen vulcanizada de alta densidad',
            selected: true
          },
          {
            id: 'vw-kt-3',
            name: 'Kit de Fuelles Guardapolvo y Topes de Rebote en Poliuretano',
            brand: 'VTH / RN Autopartes',
            spec: 'Protección del vástago cromado del amortiguador',
            selected: true
          },
          {
            id: 'vw-kt-4',
            name: 'Par de Extremos de Dirección y Rótulas de Suspensión',
            brand: 'Corven / Nakata',
            spec: 'Perno esférico templado con engrase sellado de por vida',
            selected: true
          }
        ]
      },
      {
        id: 'kit-refrigeracion',
        title: 'Kit Sistema Térmico y Refrigeración',
        category: 'Control de Temperatura del Motor',
        icon: 'Thermometer',
        badge: 'Temperatura',
        items: [
          {
            id: 'vw-kr-1',
            name: 'Termostato con Cuerpo Completo de Plástico y Sensor de Temperatura',
            brand: 'Mahle / Wahler / Dolz',
            spec: 'Apertura calibrada exacta a 87°C con juntas o-ring',
            selected: true
          },
          {
            id: 'vw-kr-2',
            name: 'Vaso Recuperador de Refrigerante con Tapa Presostática Azul (1.4 Bar)',
            brand: 'Florio / Cauplas',
            spec: 'Polímero translúcido resistente a sobrepresión',
            selected: true
          },
          {
            id: 'vw-kr-3',
            name: 'Juego de Mangueras de Radiador Superior e Inferior Reforzadas con Malla',
            brand: 'Cauplas / Gates EPDM',
            spec: 'Resistente a fluidos calientes hasta 135°C',
            selected: true
          }
        ]
      }
    ];
  }

  // 2. CHEVROLET (Onix, Prisma, Spin, Corsa, Classic, Tracker, S10, Cruze)
  if (brand.includes('chevrolet') || brand.includes('chevy')) {
    const isS10 = model.includes('s10') || model.includes('trailblazer');
    const isOnixCorsa = model.includes('onix') || model.includes('corsa') || model.includes('classic') || model.includes('prisma') || model.includes('spin') || model.includes('agile');

    return [
      {
        id: 'kit-service',
        title: 'Kit Service Aceite & Filtros GM',
        category: 'Mantenimiento Preventivo 10.000 km Dexos',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'gm-ks-1',
            name: isS10
              ? 'Aceite Sintético 5W-30 Dexos2 Diésel (GM ACDelco - 6 Litros)'
              : 'Aceite Sintético 5W-30 Dexos1 Gen2/Gen3 (ACDelco / Elaion - 4 Litros)',
            brand: 'ACDelco Oficial GM / Total Quartz 9000',
            spec: 'Norma Oficial General Motors Dexos homologada',
            selected: true
          },
          {
            id: 'gm-ks-2',
            name: 'Filtro de Aceite de Motor Blindado GM ACDelco',
            brand: 'ACDelco Original / Mann W712/22',
            spec: 'Válvula de alivio calibrada a especificación SPE/4 y Ecotec',
            selected: true
          },
          {
            id: 'gm-ks-3',
            name: 'Filtro de Aire de Motor Rectangular de Celulosa Pura',
            brand: 'Fram CA11200 / ACDelco',
            spec: 'Protección contra polvo y arenilla de ruta',
            selected: true
          },
          {
            id: 'gm-ks-4',
            name: 'Filtro de Polen / Habitáculo con Filtro de Climatizador',
            brand: 'ACDelco / Mahle LA362',
            spec: 'Elimina malos olores y polen del sistema de ventilación',
            selected: true
          },
          {
            id: 'gm-ks-5',
            name: isS10
              ? 'Kit Doble Filtro de Gasoil Diésel con Trampa de Agua'
              : 'Filtro de Combustible Nafta con Acople Rápido Click-In',
            brand: 'ACDelco / Fram G10230F',
            spec: 'Presión nominal 3.5 a 4.2 Bar',
            selected: true
          }
        ]
      },
      {
        id: 'kit-distribucion',
        title: 'Kit Distribución + Bomba de Agua GM',
        category: 'Distribución y Sincronismo GM 8V / 16V',
        icon: 'Cog',
        badge: 'Crítico Mayor',
        items: [
          {
            id: 'gm-kd-1',
            name: isOnixCorsa
              ? 'Correa Dentada de Distribución 111 Dientes (Línea Corsa/Onix 1.4/1.8)'
              : 'Correa Dentada de Distribución Específica Chevrolet',
            brand: 'Gates T304 / ACDelco Original GM',
            spec: 'Dientes trapezoidales/redondeados con recubrimiento de teflón',
            selected: true
          },
          {
            id: 'gm-kd-2',
            name: 'Tensor Automático con Resorte y Puntero de Calibración',
            brand: 'INA / Litens Brasil / SKF',
            spec: 'Mantiene la tensión constante ante dilatación del block',
            selected: true
          },
          {
            id: 'gm-kd-3',
            name: 'Bomba de Agua con Junta Tórica O-Ring',
            brand: 'Dolz C-115 / ACDelco GM',
            spec: 'Turbina balanceada anti-corrosión',
            selected: true
          },
          {
            id: 'gm-kd-4',
            name: 'Correa Poly-V de Accesorios 5PK / 6PK EPDM',
            brand: 'Continental Contitech / Gates Micro-V',
            spec: 'Goma EPDM silenciosa sin resecamiento',
            selected: true
          },
          {
            id: 'gm-kd-5',
            name: 'Líquido Refrigerante Dex-Cool Naranja Larga Vida (2L Concentrado)',
            brand: 'ACDelco Dex-Cool / Havoline OAT',
            spec: 'Inhibidores de carboxilato orgánico con 5 años de vida útil',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit Frenos Delanteros ACDelco',
        category: 'Sistema de Seguridad y Frenos',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'gm-kf-1',
            name: 'Pastillas de Freno Delanteras con Chapa Antirruido',
            brand: 'ACDelco GM / Fras-le / Bosch',
            spec: 'Formulación de frenado suave y progresivo sin rayar discos',
            selected: true
          },
          {
            id: 'gm-kf-2',
            name: 'Juego de Discos de Freno Ventilados (240mm / 256mm)',
            brand: 'Fremax / Corven / ACDelco',
            spec: 'Pistas rectificadas con alta disipación térmica',
            selected: true
          },
          {
            id: 'gm-kf-3',
            name: 'Líquido de Frenos DOT 4 Sintético (1L)',
            brand: 'ACDelco / Wagner Lockheed',
            spec: 'Punto de ebullición húmedo superior a 165°C',
            selected: true
          }
        ]
      },
      {
        id: 'kit-embrague',
        title: 'Kit Embrague Completo con Crapodina Hidráulica',
        category: 'Transmisión y Desacople',
        icon: 'Layers',
        badge: 'Tracción',
        items: [
          {
            id: 'gm-ke-1',
            name: 'Placa de Embrague Reforzada y Balanceada',
            brand: 'Luk RepSet / Valeo Original',
            spec: 'Diafragma de acero tratado térmicamente',
            selected: true
          },
          {
            id: 'gm-ke-2',
            name: 'Disco de Embrague con Buje Estriado y Resortes Dobles',
            brand: 'Luk / Valeo',
            spec: 'Material de fricción ecológico de alta durabilidad',
            selected: true
          },
          {
            id: 'gm-ke-3',
            name: 'Actuador Concéntrico Hidráulico / Crapodina Central',
            brand: 'FTE / SKF / Valeo',
            spec: 'Cilindro esclavo integrado con retén de doble labio',
            selected: true
          },
          {
            id: 'gm-ke-4',
            name: 'Aceite de Transmisión Manual SAE 75W-85 GM Sintético (2L)',
            brand: 'ACDelco Manual Gear / Total',
            spec: 'Específico para cajas GM F17 / F15',
            selected: true
          }
        ]
      },
      {
        id: 'kit-encendido',
        title: 'Kit Encendido & Chispa GM',
        category: 'Sistema de Encendido e Inyección',
        icon: 'Zap',
        badge: 'Encendido',
        items: [
          {
            id: 'gm-kz-1',
            name: 'Juego de 4 Bujías de Encendido GM ACDelco / NGK',
            brand: 'ACDelco Original / NGK BPR6EY',
            spec: 'Electrodo ranurado en V para encendido rápido',
            selected: true
          },
          {
            id: 'gm-kz-2',
            name: 'Juego de Cables de Bujía de Silicona con Supresor RFI',
            brand: 'ACDelco / Genoud Siliconados',
            spec: 'Sin interferencias en la ECU del motor',
            selected: true
          },
          {
            id: 'gm-kz-3',
            name: 'Bobina de Encendido Módulo de 4 Pines GM',
            brand: 'Delphi / Magneti Marelli',
            spec: 'Chispa de alta energía constante en todo el rango de RPM',
            selected: true
          },
          {
            id: 'gm-kz-4',
            name: 'Batería 12V 55Ah / 65Ah Reforzada Libre Mantenimiento',
            brand: 'Moura M50ED / Willard Oro',
            spec: 'Excelente corriente de arranque en frío CCA',
            selected: true
          }
        ]
      },
      {
        id: 'kit-suspension',
        title: 'Kit Suspensión & Tren Delantero',
        category: 'Tren Delantero y Confort de Marcha',
        icon: 'Activity',
        badge: 'Confort',
        items: [
          {
            id: 'gm-kt-1',
            name: 'Par de Amortiguadores Delanteros Reforzados a Gas',
            brand: 'Fric-Rot Max / Corven Plus',
            spec: 'Estabilidad direccional en rutas y autopistas',
            selected: true
          },
          {
            id: 'gm-kt-2',
            name: 'Juego de Cazoletas Delanteras con Rodamiento',
            brand: 'Axios Monroe / VTH',
            spec: 'Absorción de impactos de baches urbanos',
            selected: true
          },
          {
            id: 'gm-kt-3',
            name: 'Par de Extremos de Dirección y Bieletas Estabilizadoras',
            brand: 'Nakata / Corven',
            spec: 'Articulación esférica de precisión',
            selected: true
          }
        ]
      },
      {
        id: 'kit-refrigeracion',
        title: 'Kit Térmico y Refrigeración GM',
        category: 'Control de Temperatura de Motor',
        icon: 'Thermometer',
        badge: 'Temperatura',
        items: [
          {
            id: 'gm-kr-1',
            name: 'Termostato con Cuerpo Completo y Bulbo de Temperatura',
            brand: 'Wahler / Dolz / ACDelco',
            spec: 'Apertura nominal a 92°C con junta metálica',
            selected: true
          },
          {
            id: 'gm-kr-2',
            name: 'Depósito de Expansión con Tapa Presostática Amarilla (1.2 Bar)',
            brand: 'Florio / Cauplas',
            spec: 'Polímero anti-presión con sellado estanco',
            selected: true
          },
          {
            id: 'gm-kr-3',
            name: 'Mangueras de Radiador y Calefacción EPDM Reforzadas',
            brand: 'Cauplas / Gates',
            spec: 'Aptas para fluido orgánico Dex-Cool',
            selected: true
          }
        ]
      }
    ];
  }

  // 3. TOYOTA (Hilux, Corolla, Etios, Yaris, SW4, Corolla Cross)
  if (brand.includes('toyota')) {
    const isHilux = model.includes('hilux') || model.includes('sw4');

    return [
      {
        id: 'kit-service',
        title: isHilux ? 'Kit Service Toyota Hilux D-4D Diésel' : 'Kit Service Toyota Nafta VVT-i',
        category: 'Mantenimiento Preventivo 10.000 km Toyota',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'ty-ks-1',
            name: isHilux
              ? 'Aceite Sintético 5W-30 C2 Low SAPS Toyota Genuine Motor Oil (8 Litros)'
              : 'Aceite Sintético 0W-20 / 5W-30 Toyota Genuine Motor Oil (4 Litros)',
            brand: 'Toyota Genuine Parts / Mobil 1 ESP',
            spec: isHilux ? 'Norma ACEA C2 para motores con filtro DPF' : 'Baja viscosidad para máxima eficiencia de combustible',
            selected: true
          },
          {
            id: 'ty-ks-2',
            name: isHilux
              ? 'Filtro de Aceite Blindado Reforzado Toyota (90915-YZZD2)'
              : 'Filtro de Aceite Cartucho Elemento Toyota (04152-YZZA6)',
            brand: 'Toyota Genuine Parts / Denso Japón',
            spec: 'Filtrado microfibra de alta retención',
            selected: true
          },
          {
            id: 'ty-ks-3',
            name: 'Filtro de Aire de Motor de Alto Caudal y Resistencia',
            brand: 'Toyota Genuine / Mann Filter',
            spec: 'Sello perimetral de silicona estanco al polvo cuyano',
            selected: true
          },
          {
            id: 'ty-ks-4',
            name: isHilux
              ? 'Filtro de Combustible Diésel Elemento Cartucho con Sensor de Agua'
              : 'Filtro de Combustible Nafta de Larga Vida',
            brand: 'Toyota Genuine Parts (23390-0L070) / Denso',
            spec: 'Separador de agua y sedimentos diésel',
            selected: true
          },
          {
            id: 'ty-ks-5',
            name: 'Filtro de Cabina / Polen para Aire Acondicionado',
            brand: 'Toyota Genuine / Denso',
            spec: 'Carbón activo para filtración de partículas finas',
            selected: true
          }
        ]
      },
      {
        id: 'kit-distribucion',
        title: 'Kit Correas de Accesorios y Refrigeración',
        category: 'Transmisión de Accesorios y Bomba',
        icon: 'Cog',
        badge: 'Confiabilidad',
        items: [
          {
            id: 'ty-kd-1',
            name: 'Correa Poly-V de Accesorios 7PK Reforzada (Alternador / Bomba)',
            brand: 'Bando Japón / Gates Micro-V',
            spec: 'Compuesto EPDM para tracción de alta potencia',
            selected: true
          },
          {
            id: 'ty-kd-2',
            name: 'Tensor Automático con Polea y Rodamiento Sellado',
            brand: 'INA / Koyo Japón / SKF',
            spec: 'Amortiguación de vibraciones torsionales',
            selected: true
          },
          {
            id: 'ty-kd-3',
            name: 'Bomba de Agua con Cuerpo de Aluminio y Empaque O-Ring',
            brand: 'Aisin Japón / Dolz T-220',
            spec: 'Fabricación japonesa equipo original Toyota',
            selected: true
          },
          {
            id: 'ty-kd-4',
            name: 'Líquido Refrigerante Toyota Super Long Life Coolant (SLLC Rosa 50/50)',
            brand: 'Toyota Genuine Coolant (Pre-mezclado)',
            spec: 'Fórmula de fosfatos orgánicos para 160.000 km',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit Frenos Delanteros Toyota Advics',
        category: 'Frenado de Alta Exigencia y Seguridad',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'ty-kf-1',
            name: 'Juego de Pastillas Delanteras Cerámicas / Semimetálicas',
            brand: 'Advics Japón / Toyota Genuine Parts',
            spec: 'Coeficiente de fricción GG para frenado en caliente',
            selected: true
          },
          {
            id: 'ty-kf-2',
            name: isHilux
              ? 'Par de Discos de Freno Ventilados Pesados 297mm / 319mm'
              : 'Par de Discos de Freno Ventilados Delanteros',
            brand: 'Fremax Carbon+ / Corven Hi-Tech',
            spec: 'Aleación de alto contenido de carbono anti-alabeo',
            selected: true
          },
          {
            id: 'ty-kf-3',
            name: 'Líquido de Frenos Sintético DOT 4 LV (1L)',
            brand: 'Toyota Genuine Brake Fluid / Bosch',
            spec: 'Resistente a humedad y uso severo en bajadas de montaña',
            selected: true
          }
        ]
      },
      {
        id: 'kit-embrague',
        title: 'Kit Embrague Pesado Aisin Toyota',
        category: 'Transmisión y Desacople Reforzado',
        icon: 'Layers',
        badge: 'Tracción',
        items: [
          {
            id: 'ty-ke-1',
            name: isHilux
              ? 'Placa de Embrague Reforzada de 260mm / 275mm para Torque Pesado'
              : 'Placa de Embrague con Diafragma Progresivo',
            brand: 'Aisin Japón / Luk RepSet',
            spec: 'Equipo original Toyota Motor Corporation',
            selected: true
          },
          {
            id: 'ty-ke-2',
            name: 'Disco de Embrague con Resortes Torsionales Reforzados',
            brand: 'Aisin Japón / Luk',
            spec: 'Compuesto cerámico-orgánico de máxima durabilidad',
            selected: true
          },
          {
            id: 'ty-ke-3',
            name: 'Rulemán / Crapodina de Empuje Reforzada',
            brand: 'NSK Japón / Koyo Japón',
            spec: 'Rodamiento sellado especial para tracción 4x4',
            selected: true
          },
          {
            id: 'ty-ke-4',
            name: 'Aceite de Transmisión Manual y Diferencial 75W-90 GL-5 (3L)',
            brand: 'Mobil Delvac / Castrol Syntrax',
            spec: 'Protección para engranajes hipoidales bajo carga pesada',
            selected: true
          }
        ]
      },
      {
        id: 'kit-suspension',
        title: isHilux ? 'Kit Suspensión 4x4 y Amortiguación Pesada' : 'Kit Suspensión y Tren Delantero',
        category: 'Amortiguación y Conducción Segura',
        icon: 'Activity',
        badge: 'Resistencia',
        items: [
          {
            id: 'ty-kt-1',
            name: isHilux
              ? 'Par de Amortiguadores Delanteros Pesados a Gas Bitubo'
              : 'Par de Amortiguadores Delanteros a Gas',
            brand: 'Kayaba (KYB) Japón / Fric-Rot Max',
            spec: 'Diseñados para ripio, montaña y carga',
            selected: true
          },
          {
            id: 'ty-kt-2',
            name: isHilux
              ? 'Par de Amortiguadores Traseros Reforzados'
              : 'Juego de Cazoletas con Rodamiento de Giro',
            brand: 'Kayaba (KYB) Skorched4 / Monroe',
            spec: 'Control superior del tren trasero con carga',
            selected: true
          },
          {
            id: 'ty-kt-3',
            name: 'Par de Extremos de Dirección y Rótulas Forjadas',
            brand: '555 Japón (Three Five) / Nakata',
            spec: 'Acero forjado de máxima tenacidad',
            selected: true
          }
        ]
      },
      {
        id: 'kit-encendido',
        title: 'Kit Encendido & Electricidad',
        category: 'Encendido y Arranque Instantáneo',
        icon: 'Zap',
        badge: 'Arranque',
        items: [
          {
            id: 'ty-kz-1',
            name: isHilux
              ? 'Juego de 4 Bujías de Precalentamiento Diésel (Glow Plugs)'
              : 'Juego de 4 Bujías Denso Iridium Tough / Long Life',
            brand: 'Denso Japón / NGK Laser Iridium',
            spec: isHilux ? 'Calentamiento ultrarrápido en bajas temperaturas' : 'Vida útil de 100.000 km con chispa de precisión',
            selected: true
          },
          {
            id: 'ty-kz-2',
            name: isHilux
              ? 'Batería 12V 90Ah / 100Ah Reforzada para Camioneta Diésel'
              : 'Batería 12V 65Ah Reforzada Libre Mantenimiento',
            brand: 'Moura M75LD / Willard Plata',
            spec: 'Arranque en frío CCA > 750A garantizado',
            selected: true
          }
        ]
      }
    ];
  }

  // 4. FIAT (Cronos, Argo, Toro, Strada, Mobi, Palio, Siena, Uno)
  if (brand.includes('fiat')) {
    const isCronosArgo = model.includes('cronos') || model.includes('argo') || model.includes('strada') || model.includes('mobi');

    return [
      {
        id: 'kit-service',
        title: 'Kit Service Aceite Selenia & Filtros Mopar',
        category: 'Mantenimiento Preventivo 10.000 km Fiat',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'ft-ks-1',
            name: isCronosArgo
              ? 'Aceite Sintético Selenia Forward 0W-20 / K Pure 5W-40 (4 Litros)'
              : 'Aceite Sintético Selenia K Pure Energy 5W-40 (Norma Fiat 9.55535 - 4L)',
            brand: 'Selenia Mopar / Total Quartz / Elaion',
            spec: 'Homologación oficial FCA / Stellantis',
            selected: true
          },
          {
            id: 'ft-ks-2',
            name: 'Filtro de Aceite de Motor Blindado Mopar Original',
            brand: 'Mopar Original / Mann Filter W610',
            spec: 'Diseño compacto con válvula bypass anti-retención',
            selected: true
          },
          {
            id: 'ft-ks-3',
            name: 'Filtro de Aire de Motor de Panel',
            brand: 'Mopar / Wega FAP',
            spec: 'Flujo aerodinámico optimizado',
            selected: true
          },
          {
            id: 'ft-ks-4',
            name: 'Filtro de Polen / Habitáculo de Climatización',
            brand: 'Mopar / Mahle LA',
            spec: 'Purificación antialérgica de habitáculo',
            selected: true
          },
          {
            id: 'ft-ks-5',
            name: 'Filtro de Combustible con Conexión Rápida Mopar',
            brand: 'Mopar / Fram G5540',
            spec: 'Resistente a alcohol y naftas locales',
            selected: true
          }
        ]
      },
      {
        id: 'kit-distribucion',
        title: 'Kit Distribución & Correas Fiat',
        category: 'Distribución y Sincronismo Fire / Firefly',
        icon: 'Cog',
        badge: 'Crítico Mayor',
        items: [
          {
            id: 'ft-kd-1',
            name: isCronosArgo
              ? 'Correa de Accesorios Poli-V Elástica + Tensor Automático'
              : 'Correa Dentada de Distribución 129 Dientes (Motor Fire 1.4)',
            brand: 'Gates / Dayco / SKF',
            spec: 'Resistente a esfuerzos continuos',
            selected: true
          },
          {
            id: 'ft-kd-2',
            name: 'Tensor Móvil de Distribución con Rodamiento Sellado',
            brand: 'INA / SKF / Litens',
            spec: 'Ajuste milimétrico de tensión',
            selected: true
          },
          {
            id: 'ft-kd-3',
            name: 'Bomba de Agua con Turbina Metálica y Junta',
            brand: 'Dolz S-225 / SKF Aquamax',
            spec: 'Flujo constante de refrigerante hacia la tapa de cilindros',
            selected: true
          },
          {
            id: 'ft-kd-4',
            name: 'Líquido Refrigerante Paraflu UP Orgánico Rojo (2L Concentrado)',
            brand: 'Paraflu UP Mopar / Petronas',
            spec: 'Fórmula exclusiva aprobada por Fiat Stellantis',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit Frenos Delanteros Mopar / Bosch',
        category: 'Sistema de Frenos y Seguridad',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'ft-kf-1',
            name: 'Juego de Pastillas Delanteras con Alarma Acústica de Desgaste',
            brand: 'Mopar Original / Fras-le / Bosch',
            spec: 'Excelente mordiente en frío y bajo ruido',
            selected: true
          },
          {
            id: 'ft-kf-2',
            name: 'Juego de Discos Delanteros Ventilados (257mm)',
            brand: 'Fremax / Corven',
            spec: 'Geometría ventilada para rápida refrigeración',
            selected: true
          },
          {
            id: 'ft-kf-3',
            name: 'Líquido de Frenos Sintético Tutela TOP 4 / DOT 4 (1L)',
            brand: 'Tutela Petronas / Wagner',
            spec: 'Preserva gomas y sellos de calipers',
            selected: true
          }
        ]
      },
      {
        id: 'kit-embrague',
        title: 'Kit de Embrague Mopar / Valeo',
        category: 'Transmisión y Embrague',
        icon: 'Layers',
        badge: 'Tracción',
        items: [
          {
            id: 'ft-ke-1',
            name: 'Placa de Presión de Embrague Fiat',
            brand: 'Valeo Original / Luk',
            spec: 'Embrague suave y sin trepidaciones',
            selected: true
          },
          {
            id: 'ft-ke-2',
            name: 'Disco de Embrague con Amortiguador Torsional',
            brand: 'Valeo / Luk',
            spec: 'Larga vida útil en tránsito urbano',
            selected: true
          },
          {
            id: 'ft-ke-3',
            name: 'Crapodina de Empuje / Rulemán Mecánico',
            brand: 'SKF / INA',
            spec: 'Desplazamiento suave sobre la directa',
            selected: true
          }
        ]
      },
      {
        id: 'kit-encendido',
        title: 'Kit Encendido & Electricidad',
        category: 'Chispa y Arranque Rápido',
        icon: 'Zap',
        badge: 'Encendido',
        items: [
          {
            id: 'ft-kz-1',
            name: 'Juego de 4 Bujías NGK Níquel / Laser Iridium Específicas',
            brand: 'NGK Original / Bosch',
            spec: 'Calibración exacta de luz de electrodos',
            selected: true
          },
          {
            id: 'ft-kz-2',
            name: 'Batería 12V 60Ah Reforzada Libre Mantenimiento',
            brand: 'Moura M60GD / Willard Plata',
            spec: 'Garantía de fábrica con visor de estado',
            selected: true
          }
        ]
      }
    ];
  }

  // 5. RENAULT (Sandero, Logan, Kangoo, Stepway, Duster, Clio, Alaskan)
  if (brand.includes('renault')) {
    return [
      {
        id: 'kit-service',
        title: 'Kit Service Elf & Filtros Purflux Renault',
        category: 'Mantenimiento Preventivo 10.000 km Renault',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'rn-ks-1',
            name: 'Aceite Elf Evolution 700 STI 10W-40 / 900 SXR 5W-40 (5 Litros)',
            brand: 'Elf Original Renault / Total Quartz',
            spec: 'Norma Oficial Renault RN0700 / RN0710',
            selected: true
          },
          {
            id: 'rn-ks-2',
            name: 'Filtro de Aceite Blindado Original Renault Purflux (7700274177)',
            brand: 'Renault Genuino / Purflux LS932 / Mann',
            spec: 'Plegado en zig-zag patentado para mayor superficie filtrante',
            selected: true
          },
          {
            id: 'rn-ks-3',
            name: 'Filtro de Aire de Motor Trapecial / Rectangular',
            brand: 'Renault Motrio / Mann Filter',
            spec: 'Flujo limpio para inyección multipunto',
            selected: true
          },
          {
            id: 'rn-ks-4',
            name: 'Filtro de Habitáculo Antipolen de Climatizador',
            brand: 'Purflux / Valeo',
            spec: 'Filtrado de ácaros y polvo en cabina',
            selected: true
          },
          {
            id: 'rn-ks-5',
            name: 'Filtro de Combustible Nafta con Conexiones Rápidas',
            brand: 'Renault Motrio / Fram G10225',
            spec: 'Cuerpo de poliamida presurizada',
            selected: true
          }
        ]
      },
      {
        id: 'kit-distribucion',
        title: 'Kit Distribución + Bomba de Agua Renault K4M / H4M',
        category: 'Distribución y Refrigeración Crítica 16V',
        icon: 'Cog',
        badge: 'Crítico Mayor',
        items: [
          {
            id: 'rn-kd-1',
            name: 'Correa Dentada de Distribución 132 Dientes (Línea K4M 1.6 16V)',
            brand: 'Gates PowerGrip / Renault Genuino',
            spec: 'Resistencia a altos regímenes de revoluciones',
            selected: true
          },
          {
            id: 'rn-kd-2',
            name: 'Juego de 2 Rodillos: Tensor Automático + Rodillo Guía Fijo',
            brand: 'INA / SKF / Renault',
            spec: 'Pistas dobles de bolas selladas',
            selected: true
          },
          {
            id: 'rn-kd-3',
            name: 'Bomba de Agua con Junta Metálica y Turbina Reforzada',
            brand: 'Dolz R-225 / SKF Aquamax',
            spec: 'Sellado de silicona resistente a cavitación',
            selected: true
          },
          {
            id: 'rn-kd-4',
            name: 'Juego de 2 Tapones de Árbol de Levas de Culata',
            brand: 'Renault Genuino / Corteco',
            spec: 'Indispensables para el calado correcto de la distribución',
            selected: true
          },
          {
            id: 'rn-kd-5',
            name: 'Líquido Refrigerante Glaceol RX Type D Amarillo Orgánico (2L Concentrado)',
            brand: 'Renault Glaceol RX / Total Glacelf',
            spec: 'Fórmula homologada para blocks y tapas de aluminio Renault',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit Frenos Delanteros Renault Motrio / TRW',
        category: 'Seguridad y Frenado',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'rn-kf-1',
            name: 'Juego de Pastillas de Freno Delanteras (Sistema Lucas/TRW)',
            brand: 'TRW / Ferodo / Motrio',
            spec: 'Frenado seguro sin chillidos',
            selected: true
          },
          {
            id: 'rn-kf-2',
            name: 'Juego de Discos de Freno Ventilados (259mm / 280mm)',
            brand: 'Fremax / Corven',
            spec: 'Excelente balance térmico anti-vibración',
            selected: true
          },
          {
            id: 'rn-kf-3',
            name: 'Líquido de Frenos Sintético DOT 4 (1L)',
            brand: 'Elf Frelub / Wagner Lockheed',
            spec: 'Apto sistemas ABS Bosch',
            selected: true
          }
        ]
      },
      {
        id: 'kit-encendido',
        title: 'Kit Encendido & Bobinas Renault',
        category: 'Inyección y Bobinas Lápiz',
        icon: 'Zap',
        badge: 'Encendido',
        items: [
          {
            id: 'rn-kz-1',
            name: 'Juego de 4 Bujías de Encendido de 2 Electrodos',
            brand: 'Eyquem / NGK BKR6E / Renault',
            spec: 'Chispa continua en motores 16 válvulas',
            selected: true
          },
          {
            id: 'rn-kz-2',
            name: 'Juego de Bobinas de Encendido Individuales Tipo Lápiz',
            brand: 'Valeo / Eldor / Beru',
            spec: 'Aislación interna de resina epoxy contra fuga de chispa',
            selected: true
          },
          {
            id: 'rn-kz-3',
            name: 'Batería 12V 65Ah Reforzada Libre Mantenimiento',
            brand: 'Moura M65ED / Willard Plata',
            spec: 'Alto poder de arranque para arranques frecuentes',
            selected: true
          }
        ]
      }
    ];
  }

  // 6. FORD (Ka, Fiesta, Focus, Ranger, EcoSport)
  if (brand.includes('ford')) {
    const isRanger = model.includes('ranger');

    return [
      {
        id: 'kit-service',
        title: 'Kit Service Motorcraft & Filtros Ford',
        category: 'Mantenimiento Preventivo 10.000 / 15.000 km Ford',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'fd-ks-1',
            name: isRanger
              ? 'Aceite Sintético Motorcraft 5W-30 Ford WSS-M2C913-D (10 Litros para Puma 2.2/3.2)'
              : 'Aceite Sintético Motorcraft 5W-20 / 5W-30 (Norma Ford WSS-M2C948-B - 4L)',
            brand: 'Motorcraft Oficial Ford / Castrol Magnatec Professional',
            spec: 'Homologación de viscosidad y aditivación oficial Ford',
            selected: true
          },
          {
            id: 'fd-ks-2',
            name: 'Filtro de Aceite Motorcraft Blindado de Alta Presión',
            brand: 'Motorcraft Original / Mann Filter',
            spec: 'Válvula de alivio para arranque en frío inmediato',
            selected: true
          },
          {
            id: 'fd-ks-3',
            name: 'Filtro de Aire Motorcraft de Panel',
            brand: 'Motorcraft Original / Fram',
            spec: 'Papel de microfibra de retención total',
            selected: true
          },
          {
            id: 'fd-ks-4',
            name: 'Filtro de Cabina / Polen con Carbón Activado',
            brand: 'Motorcraft / Bosch',
            spec: 'Protege el evaporador del aire acondicionado',
            selected: true
          },
          {
            id: 'fd-ks-5',
            name: isRanger
              ? 'Filtro de Combustible Diésel Blindado con Sensor'
              : 'Filtro de Combustible Nafta con Conexión Rápida',
            brand: 'Motorcraft Original / Mann WK829',
            spec: 'Eliminación del 99% de impurezas',
            selected: true
          }
        ]
      },
      {
        id: 'kit-distribucion',
        title: 'Kit Distribución + Bomba de Agua Motorcraft',
        category: 'Distribución y Sincronismo Sigma / Dragon / Duratec',
        icon: 'Cog',
        badge: 'Crítico Mayor',
        items: [
          {
            id: 'fd-kd-1',
            name: 'Correa Dentada de Distribución Reforzada (Motor Sigma 1.6)',
            brand: 'Gates PowerGrip / Motorcraft Original',
            spec: 'Compuesto HNBR resistente a altas temperaturas de culata',
            selected: true
          },
          {
            id: 'fd-kd-2',
            name: 'Tensor Mecánico / Hidráulico de Distribución',
            brand: 'INA / SKF / Litens',
            spec: 'Alineación precisa sin desgaste prematuro',
            selected: true
          },
          {
            id: 'fd-kd-3',
            name: 'Bomba de Agua con Cuerpo de Aluminio y Junta',
            brand: 'Dolz F-140 / SKF Aquamax',
            spec: 'Rotor de fundición balanceado',
            selected: true
          },
          {
            id: 'fd-kd-4',
            name: 'Líquido Refrigerante Motorcraft Orange / Yellow Orgánico OAT (2L)',
            brand: 'Motorcraft Original Ford / Valvoline Zerex',
            spec: 'Protege las galerías internas del motor contra corrosión',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit Frenos Delanteros Motorcraft',
        category: 'Sistema de Seguridad y Frenos',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'fd-kf-1',
            name: 'Pastillas de Freno Delanteras Motorcraft Originales',
            brand: 'Motorcraft / Ferodo / Fras-le',
            spec: 'Compuesto cerámico bajo en ruidos y polvillo',
            selected: true
          },
          {
            id: 'fd-kf-2',
            name: 'Juego de Discos de Freno Ventilados Delanteros',
            brand: 'Fremax / Corven Hi-Tech',
            spec: 'Resistencia a fatiga por temperatura en frenadas prolongadas',
            selected: true
          },
          {
            id: 'fd-kf-3',
            name: 'Líquido de Frenos Sintético DOT 4 LV Motorcraft (1L)',
            brand: 'Motorcraft DOT 4 / Bosch',
            spec: 'Específico para válvulas del módulo ABS/ESP Ford',
            selected: true
          }
        ]
      },
      {
        id: 'kit-embrague',
        title: 'Kit Embrague con Actuador Hidráulico Concéntrico',
        category: 'Transmisión y Desacople',
        icon: 'Layers',
        badge: 'Tracción',
        items: [
          {
            id: 'fd-ke-1',
            name: 'Placa de Presión de Embrague Luk RepSet',
            brand: 'Luk / Motorcraft',
            spec: 'Empuje parejo y suave en pedal',
            selected: true
          },
          {
            id: 'fd-ke-2',
            name: 'Disco de Embrague con Amortiguación de Torsión',
            brand: 'Luk / Valeo',
            spec: 'Excelente absorción de vibraciones del motor',
            selected: true
          },
          {
            id: 'fd-ke-3',
            name: 'Actuador Concéntrico Hidráulico / Crapodina Central',
            brand: 'FTE / Luk / SKF',
            spec: 'Cuerpo de aleación con retén de alta presión',
            selected: true
          }
        ]
      }
    ];
  }

  // 7. PEUGEOT & CITROËN (208, 207, 308, 408, Partner, Berlingo, C3, C4, Cactus)
  if (brand.includes('peugeot') || brand.includes('citroen')) {
    return [
      {
        id: 'kit-service',
        title: 'Kit Service Total Quartz & Filtros PSA',
        category: 'Mantenimiento Preventivo 10.000 km PSA',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'psa-ks-1',
            name: 'Aceite Total Quartz 9000 Future 5W-30 / INEO ECS (Norma PSA B71 2290 - 4L)',
            brand: 'TotalEnergies Oficial PSA / Eurorepar',
            spec: 'Formulación Low SAPS oficial Peugeot / Citroën',
            selected: true
          },
          {
            id: 'psa-ks-2',
            name: 'Filtro de Aceite Purflux L358A Elemento Ecológico',
            brand: 'Purflux Original PSA / Eurorepar / Mann',
            spec: 'Plegado patentado en chevron para máxima capacidad de retención',
            selected: true
          },
          {
            id: 'psa-ks-3',
            name: 'Filtro de Aire de Motor de Alto Caudal',
            brand: 'Purflux / Mann Filter',
            spec: 'Protección para motores 1.6 16V EC5 / VTi / HDi',
            selected: true
          },
          {
            id: 'psa-ks-4',
            name: 'Filtro de Habitáculo / Polen con Carbón Activo',
            brand: 'Eurorepar / Mahle',
            spec: 'Filtra gases y alérgenos exteriores',
            selected: true
          },
          {
            id: 'psa-ks-5',
            name: 'Filtro de Combustible Nafta 6.6 Bar con Acople Rápido',
            brand: 'Purflux / Bosch',
            spec: 'Carcasa resistente a alta presión de inyección',
            selected: true
          }
        ]
      },
      {
        id: 'kit-distribucion',
        title: 'Kit Distribución + Bomba de Agua PSA 1.6 16V EC5',
        category: 'Distribución y Sincronismo PSA',
        icon: 'Cog',
        badge: 'Crítico Mayor',
        items: [
          {
            id: 'psa-kd-1',
            name: 'Correa Dentada de Distribución 134 Dientes (Gates K015587XS)',
            brand: 'Gates PowerGrip / Eurorepar PSA',
            spec: 'Refuerzo de fibra de vidrio anti-estiramiento',
            selected: true
          },
          {
            id: 'psa-kd-2',
            name: 'Juego de 2 Rodillos: Tensor Automático + Rodillo Guía',
            brand: 'INA / SKF / Eurorepar',
            spec: 'Rodamientos sellados de alta durabilidad',
            selected: true
          },
          {
            id: 'psa-kd-3',
            name: 'Bomba de Agua con Junta y Turbina Metálica Reforzada',
            brand: 'Dolz C-125 / SKF Aquamax',
            spec: 'Refrigeración continua de culata y block',
            selected: true
          },
          {
            id: 'psa-kd-4',
            name: 'Correa Poly-V de Accesorios 6PK EPDM',
            brand: 'Continental Contitech / Gates',
            spec: 'Silenciosa y resistente a aceite y polvo',
            selected: true
          },
          {
            id: 'psa-kd-5',
            name: 'Líquido Refrigerante PSA Long Life Azul/Verde (2L Concentrado)',
            brand: 'Total Glacelf Auto Supra / Tir',
            spec: 'Protección anticorrosiva de aleaciones de aluminio',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit Frenos Delanteros Eurorepar / Bosch',
        category: 'Seguridad y Frenado',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'psa-kf-1',
            name: 'Juego de Pastillas Delanteras con Chapa Antirruido',
            brand: 'Eurorepar Original PSA / Ferodo / Bosch',
            spec: 'Mordida progresiva y alta respuesta ante pánico',
            selected: true
          },
          {
            id: 'psa-kf-2',
            name: 'Juego de Discos de Freno Ventilados (266mm / 283mm)',
            brand: 'Fremax Carbon+ / Corven',
            spec: 'Tratamiento térmico para evitar cristalización',
            selected: true
          },
          {
            id: 'psa-kf-3',
            name: 'Líquido de Frenos Sintético DOT 4 (1L)',
            brand: 'Total HBF 4 / Wagner',
            spec: 'Punto de ebullición elevado para bajadas de montaña',
            selected: true
          }
        ]
      },
      {
        id: 'kit-embrague',
        title: 'Kit Embrague Completo PSA 200mm',
        category: 'Transmisión y Desacople',
        icon: 'Layers',
        badge: 'Tracción',
        items: [
          {
            id: 'psa-ke-1',
            name: 'Placa de Embrague con Diafragma Progresivo PSA',
            brand: 'Luk RepSet / Valeo Original',
            spec: 'Tacto suave en pedal de embrague',
            selected: true
          },
          {
            id: 'psa-ke-2',
            name: 'Disco de Embrague con Amortiguación Doble',
            brand: 'Luk / Valeo',
            spec: 'Tracción progresiva sin tirones al arrancar',
            selected: true
          },
          {
            id: 'psa-ke-3',
            name: 'Crapodina de Empuje con Pista de Acero Reforzado',
            brand: 'SKF / INA',
            spec: 'Rodamiento sellado de por vida',
            selected: true
          }
        ]
      }
    ];
  }

  // 8. MOTOS (Honda, Yamaha, Bajaj, Motomel, Zanella, etc.)
  if (brand.includes('moto') || brand.includes('honda') || brand.includes('yamaha') || brand.includes('bajaj')) {
    return [
      {
        id: 'kit-service',
        title: 'Kit Service Motul 4T & Filtros de Moto',
        category: 'Mantenimiento Preventivo 3.000 / 5.000 km',
        icon: 'Droplets',
        badge: 'Frecuente',
        items: [
          {
            id: 'mt-ks-1',
            name: 'Aceite Semisintético Motul 5100 4T 10W-40 / 15W-50 Ester (1L / 2L)',
            brand: 'Motul Original / Castrol Actevo',
            spec: 'Norma JASO MA2 para embragues húmedos de moto',
            selected: true
          },
          {
            id: 'mt-ks-2',
            name: 'Filtro de Aceite de Motor para Moto',
            brand: 'Hiflofiltro / Wega Moto / Original',
            spec: 'Filtrado de alta precisión en altas RPM',
            selected: true
          },
          {
            id: 'mt-ks-3',
            name: 'Filtro de Aire de Espuma / Papel Especial Moto',
            brand: 'Hiflofiltro / Wega',
            spec: 'Retención de tierra y polvo de caminos',
            selected: true
          },
          {
            id: 'mt-ks-4',
            name: 'Bujía de Encendido Especial Moto NGK Cobre / Iridium',
            brand: 'NGK Japón',
            spec: 'Encendido inmediato en frío y caliente',
            selected: true
          }
        ]
      },
      {
        id: 'kit-transmision',
        title: 'Kit de Transmisión Completo (Cadena, Corona y Piñón)',
        category: 'Tracción y Transmisión de Moto',
        icon: 'Cog',
        badge: 'Tracción',
        items: [
          {
            id: 'mt-kt-1',
            name: 'Cadena de Transmisión Reforzada con O-Ring / X-Ring (Paso 428 / 520)',
            brand: 'D.I.D Japón / Riffel / Choho',
            spec: 'Eslabones reforzados de alta tracción y retenes sellados',
            selected: true
          },
          {
            id: 'mt-kt-2',
            name: 'Corona de Transmisión Trasera de Acero Templado 1045',
            brand: 'Riffel / D.I.D / JT Sprockets',
            spec: 'Dientes endurecidos por inducción',
            selected: true
          },
          {
            id: 'mt-kt-3',
            name: 'Piñón de Salida de Motor en Acero Cromo-Níquel',
            brand: 'Riffel / JT Sprockets',
            spec: 'Fresado milimétrico para no desgastar el eje secundario',
            selected: true
          },
          {
            id: 'mt-kt-4',
            name: 'Lubricante de Cadena en Aerosol Sintético Adherente',
            brand: 'Motul Chain Lube Road / Castrol Chain Spray',
            spec: 'No salpica la llanta y repele agua y barro',
            selected: true
          }
        ]
      },
      {
        id: 'kit-frenos',
        title: 'Kit Frenos y Pastillas de Moto',
        category: 'Seguridad y Frenado',
        icon: 'Disc',
        badge: 'Seguridad',
        items: [
          {
            id: 'mt-kf-1',
            name: 'Juego de Pastillas de Freno Delanteras Semimetálicas',
            brand: 'Brenta Italia / Fras-le / Bosch',
            spec: 'Excelente frenado sin desgastar el disco',
            selected: true
          },
          {
            id: 'mt-kf-2',
            name: 'Juego de Cintas / Zapatas de Freno Traseras o Pastillas',
            brand: 'Fras-le / Riffel',
            spec: 'Resortes de retracción incluidos',
            selected: true
          },
          {
            id: 'mt-kf-3',
            name: 'Líquido de Frenos Sintético DOT 4 Moto (500ml)',
            brand: 'Motul Brake Fluid / Wagner',
            spec: 'Alta resistencia al fading en uso exigente',
            selected: true
          }
        ]
      }
    ];
  }

  // 9. KIT INTELIGENTE GENÉRICO / MULTIMARCA (Adaptado dinámicamente con los datos de patente del DNRPA)
  return [
    {
      id: 'kit-service',
      title: `Kit Service Completo (${carName})`,
      category: 'Mantenimiento Preventivo 10.000 / 15.000 km',
      icon: 'Droplets',
      badge: 'Frecuente',
      items: [
        {
          id: 'gen-ks-1',
          name: `Aceite de Motor Sintético Homologado (${engineName ? `Motor ${engineName}` : '4 Litros'})`,
          brand: 'Total / Castrol / Elaion / Shell',
          spec: 'Viscosidad especificada por fabricante para este modelo',
          selected: true
        },
        {
          id: 'gen-ks-2',
          name: `Filtro de Aceite de Motor Blindado para ${carName}`,
          brand: 'Mann Filter / Bosch / Mahle',
          spec: 'Válvula antirretorno calibrada de fábrica',
          selected: true
        },
        {
          id: 'gen-ks-3',
          name: `Filtro de Aire de Motor de Alto Caudal para ${carName}`,
          brand: 'Mann Filter / Wega / Fram',
          spec: 'Retención de impurezas para inyección electrónica',
          selected: true
        },
        {
          id: 'gen-ks-4',
          name: 'Filtro de Habitáculo / Cabina Antipolen con Carbón Activo',
          brand: 'Bosch / Mahle / Wega',
          spec: 'Purificación del aire de la climatización',
          selected: true
        },
        {
          id: 'gen-ks-5',
          name: 'Filtro de Combustible (Nafta / Diésel según motorización)',
          brand: 'Fram / Bosch / Mann',
          spec: 'Cuerpo de aleación presurizada con conectores rápidos',
          selected: true
        }
      ]
    },
    {
      id: 'kit-distribucion',
      title: `Kit Distribución + Bomba de Agua (${carName})`,
      category: 'Distribución y Sincronismo Crítico',
      icon: 'Cog',
      badge: 'Crítico Mayor',
      items: [
        {
          id: 'gen-kd-1',
          name: `Correa Dentada de Distribución Reforzada (${engineName || carName})`,
          brand: 'Gates PowerGrip / Continental Contitech',
          spec: 'Compuesto HNBR con refuerzo de fibra de vidrio',
          selected: true
        },
        {
          id: 'gen-kd-2',
          name: 'Tensor y Rodillo Guía de Distribución de Rodamiento Sellado',
          brand: 'INA / SKF / Litens',
          spec: 'Tensión constante y balanceada',
          selected: true
        },
        {
          id: 'gen-kd-3',
          name: `Bomba de Agua con Turbina Metálica y O-Ring para ${carName}`,
          brand: 'Dolz / SKF Aquamax',
          spec: 'Empaque de carburo de silicio de larga vida',
          selected: true
        },
        {
          id: 'gen-kd-4',
          name: 'Correa Poli-V de Accesorios de Alternador y Aire Acondicionado',
          brand: 'Continental / Gates Micro-V',
          spec: 'Perfil EPDM sin chillidos',
          selected: true
        },
        {
          id: 'gen-kd-5',
          name: 'Líquido Refrigerante Anticongelante Orgánico Larga Vida (2L Concentrado)',
          brand: 'Glacelf Supra / Tir / Valvoline',
          spec: 'Protección contra cavitación y óxido en aluminio',
          selected: true
        }
      ]
    },
    {
      id: 'kit-frenos',
      title: `Kit Frenos Delanteros & Seguridad (${carName})`,
      category: 'Sistema de Frenos y Seguridad Activa',
      icon: 'Disc',
      badge: 'Seguridad',
      items: [
        {
          id: 'gen-kf-1',
          name: `Juego de Pastillas de Freno Delanteras para ${carName}`,
          brand: 'Bosch / Cobreq / Fras-le',
          spec: 'Compuesto de frenado progresivo con baja emisión de polvillo',
          selected: true
        },
        {
          id: 'gen-kf-2',
          name: `Par de Discos de Freno Ventilados Delanteros para ${carName}`,
          brand: 'Fremax / Corven Hi-Tech',
          spec: 'Pistas rectificadas y balanceadas anti-vibración',
          selected: true
        },
        {
          id: 'gen-kf-3',
          name: 'Líquido de Frenos Sintético DOT 4 (1L)',
          brand: 'Bosch DOT 4 HP / Wagner Lockheed',
          spec: 'Punto de ebullición seco > 260°C apto para sistemas ABS',
          selected: true
        }
      ]
    },
    {
      id: 'kit-embrague',
      title: `Kit de Embrague Completo (${carName})`,
      category: 'Transmisión y Desacople',
      icon: 'Layers',
      badge: 'Tracción',
      items: [
        {
          id: 'gen-ke-1',
          name: `Placa de Embrague Reforzada y Balanceada para ${carName}`,
          brand: 'Luk RepSet / Valeo Original',
          spec: 'Diafragma de acero templado sin deformación térmica',
          selected: true
        },
        {
          id: 'gen-ke-2',
          name: 'Disco de Embrague con Amortiguador Torsional de Resortes Dobles',
          brand: 'Luk / Valeo / Sachs',
          spec: 'Material de fricción sin asbesto de alto rendimiento',
          selected: true
        },
        {
          id: 'gen-ke-3',
          name: 'Crapodina de Empuje / Rulemán o Actuador Hidráulico',
          brand: 'SKF / INA / FTE',
          spec: 'Rodamiento sellado de alta velocidad de giro',
          selected: true
        },
        {
          id: 'gen-ke-4',
          name: 'Aceite de Caja de Cambios Manual Sintético SAE 75W / 75W-80 (2L)',
          brand: 'Total Traxium / Castrol',
          spec: 'Suavidad de pasaje de marchas y protección de sincronizados',
          selected: true
        }
      ]
    },
    {
      id: 'kit-suspension',
      title: `Kit Tren Delantero y Amortiguación (${carName})`,
      category: 'Suspensión, Dirección y Confort',
      icon: 'Activity',
      badge: 'Confort',
      items: [
        {
          id: 'gen-kt-1',
          name: `Par de Amortiguadores Delanteros Reforzados a Gas para ${carName}`,
          brand: 'Fric-Rot Max / Monroe / Corven',
          spec: 'Presurizados con gas nitrógeno contra formación de espuma',
          selected: true
        },
        {
          id: 'gen-kt-2',
          name: 'Juego de Cazoletas Delanteras con Rodamientos de Giro',
          brand: 'VTH / Axios Monroe',
          spec: 'Goma de alta densidad anti-impacto',
          selected: true
        },
        {
          id: 'gen-kt-3',
          name: 'Par de Extremos de Dirección y Rótulas de Suspensión',
          brand: 'Corven / Nakata',
          spec: 'Perno esférico templado con lubricación permanente',
          selected: true
        }
      ]
    },
    {
      id: 'kit-encendido',
      title: `Kit Encendido & Electricidad (${carName})`,
      category: 'Chispa y Sistema Eléctrico',
      icon: 'Zap',
      badge: 'Encendido',
      items: [
        {
          id: 'gen-kz-1',
          name: `Juego de Bujías de Encendido Homologadas para ${engineName || carName}`,
          brand: 'NGK / Bosch / Denso',
          spec: 'Rango térmico y luz de electrodos calibrados',
          selected: true
        },
        {
          id: 'gen-kz-2',
          name: 'Juego de Cables de Bujía Siliconados de Alta Aislación',
          brand: 'NGK / Genoud',
          spec: 'Conducción sin pérdidas resistivas',
          selected: true
        },
        {
          id: 'gen-kz-3',
          name: 'Batería 12V Reforzada Libre de Mantenimiento con Garantía',
          brand: 'Moura / Willard Plata',
          spec: 'Respaldo de potencia de arranque en frío',
          selected: true
        }
      ]
    }
  ];
}

export function KitBuilderWidget({ vehicle, onOpenPatenteModal, onNavigateCotizador }) {
  // Lista de vehículos guardados en la cochera del usuario
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

  // Si cambia la prop externa vehicle
  useEffect(() => {
    if (vehicle && vehicle.brand) {
      setCurrentCar(vehicle);
    }
  }, [vehicle]);

  // Obtener plantillas adaptadas al vehículo actual
  const dynamicKitTemplates = useMemo(() => {
    return getVehicleSpecificKits(currentCar);
  }, [currentCar]);

  // Selector de kit plantilla o categoría activa
  const [selectedTemplateId, setSelectedTemplateId] = useState('kit-service');

  // Lista activa de repuestos que componen el kit (SIN PRECIOS)
  const [kitItems, setKitItems] = useState(() => {
    const initialTpl = getVehicleSpecificKits(currentCar)[0];
    return initialTpl ? initialTpl.items.map((it) => ({ ...it, quantity: 1 })) : [];
  });

  // Cuando cambia el auto o la plantilla seleccionada, actualizar los repuestos
  useEffect(() => {
    const tpl = dynamicKitTemplates.find((t) => t.id === selectedTemplateId) || dynamicKitTemplates[0];
    if (tpl) {
      setKitItems(tpl.items.map((it) => ({ ...it, quantity: 1 })));
    }
  }, [currentCar, selectedTemplateId, dynamicKitTemplates]);

  // Tipo de mensaje / consulta seleccionada (Estándar, Urgente, Financiación, Originales)
  const [consultationType, setConsultationType] = useState('standard');

  // Estado para feedback de "Copiado al portapapeles"
  const [copied, setCopied] = useState(false);

  // Campo para agregar repuestos personalizados al kit (SIN PRECIO)
  const [newPartName, setNewPartName] = useState('');

  // Selector de marca manual si el usuario quiere cambiar a cualquier otra marca
  const [isChangingBrand, setIsChangingBrand] = useState(false);

  // Normalizar marca actual del auto para filtrar mostradores especializados
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
      return store.brandKey === currentBrandKey || store.brandKey === 'multimarca';
    }).sort((a, b) => {
      if (a.brandKey === currentBrandKey && b.brandKey !== currentBrandKey) return -1;
      if (b.brandKey === currentBrandKey && a.brandKey !== currentBrandKey) return 1;
      return 0;
    });
  }, [currentBrandKey]);

  // Repuestos activos seleccionados
  const activeItems = useMemo(() => {
    return kitItems.filter((it) => it.selected);
  }, [kitItems]);

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

  // Agregar repuesto nuevo al kit (SIN PRECIO)
  const handleAddCustomPart = (e) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      name: newPartName.trim(),
      brand: 'A cotizar según mostrador de Mendoza',
      spec: 'Pieza personalizada solicitada por el usuario',
      selected: true,
      quantity: 1,
      isCustom: true
    };

    setKitItems((prev) => [...prev, newItem]);
    setNewPartName('');
  };

  // Objeto de la consulta activa
  const activeConsultation = useMemo(() => {
    return CONSULTATION_TYPES.find((c) => c.id === consultationType) || CONSULTATION_TYPES[0];
  }, [consultationType]);

  // Formateador del Mensaje de WhatsApp (ESTRICTAMENTE SIN PRECIO)
  const buildWhatsAppMessage = (storeName, storeAddress) => {
    const itemsList = activeItems
      .map((it, idx) => `  ${idx + 1}. *${it.name}* (Ref: ${it.brand}${it.spec ? ` • ${it.spec}` : ''})`)
      .join('\n');

    return [
      `👋 *Hola ${storeName || 'Casa de Repuestos'}*, les consulto desde *DinAcitY Mendoza* para cotizar el siguiente *Kit de Repuestos a medida*:`,
      ``,
      `🚗 *Vehículo:* ${currentCar.brand} ${currentCar.model} ${currentCar.version || ''} (${currentCar.year || ''})`,
      `🇦🇷 *Patente DNRPA:* ${currentCar.patente || 'A verificar'}`,
      `⚙️ *Motorización:* ${currentCar.engine?.name || 'Estándar homologado'}`,
      ``,
      `📦 *Repuestos que componen el Kit (${activeItems.length} piezas):*`,
      itemsList,
      ``,
      `💬 *Tipo de Consulta:* ${activeConsultation.title}`,
      `👉 ${activeConsultation.intentText}`,
      storeAddress ? `📍 *Mostrador:* ${storeAddress}` : '',
      ``,
      `¿Tienen disponibilidad de estas piezas para este modelo y cuál sería el presupuesto abonando en su mostrador?`,
      `¡Muchas gracias!`
    ].filter(Boolean).join('\n');
  };

  // Abrir WhatsApp de una casa de repuestos
  const handleSendWhatsAppToStore = (store) => {
    if (activeItems.length === 0) {
      alert('Por favor seleccioná al menos un repuesto para armar tu kit.');
      return;
    }

    const messageText = buildWhatsAppMessage(store.name, store.address);
    const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  // Copiar mensaje limpio al portapapeles
  const handleCopyMessage = () => {
    if (activeItems.length === 0) {
      alert('Por favor seleccioná al menos un repuesto para armar tu kit.');
      return;
    }
    const messageText = buildWhatsAppMessage('Casa de Repuestos Especializada', '');
    navigator.clipboard.writeText(messageText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
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
      
      {/* 1. Header Principal del Armador de Kits (SIN PRECIOS) */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-red-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white text-red-700 shadow-sm flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Armador Inteligente de Kits</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-red-200 border border-red-400/40">
                🛡️ Sin Precios Ficticios • Mostrador Directo
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              📦 Armá tu Kit de Repuestos para tu Auto
            </h1>
            <p className="text-sm sm:text-base text-red-100/90 max-w-2xl mt-1.5 leading-relaxed">
              Elegí qué repuestos querés cambiar en conjunto según la <strong>ficha técnica del DNRPA</strong> de tu vehículo. Te conectamos por WhatsApp directamente con la <strong>casa de repuestos especializada en tu marca</strong> en Mendoza para cotizar disponibilidad y opciones de pago.
            </p>
          </div>

          {/* Tarjeta del Auto Seleccionado DNRPA */}
          <div className="bg-black/35 backdrop-blur-md border border-white/25 rounded-2xl p-4 shrink-0 flex flex-col justify-between gap-2.5 min-w-[270px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl border border-white/20 shrink-0">
                🚗
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-red-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>DNRPA Vinculado</span>
                </span>
                <h3 className="font-black text-sm sm:text-base text-white leading-snug">
                  {currentCar.brand} {currentCar.model}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-red-100 font-mono">
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-bold">
                    {currentCar.patente || 'AD 192 OP'}
                  </span>
                  <span>• {currentCar.year || '2019'}</span>
                </div>
              </div>
            </div>

            {currentCar.engine?.name && (
              <div className="pt-2 border-t border-white/15 text-[11px] text-red-100/90 flex items-center gap-1.5">
                <Cog className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span className="truncate">{currentCar.engine.name}</span>
              </div>
            )}

            {onOpenPatenteModal && (
              <button
                type="button"
                onClick={onOpenPatenteModal}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <Search className="w-3 h-3 text-yellow-300" />
                <span>Buscar otra Patente DNRPA</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Selector de Autos Guardados en la Cochera o Cambio de Marca */}
      <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm sm:text-base font-black text-white">
              Elegí cuál de tus vehículos vas a equipar:
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsChangingBrand(!isChangingBrand)}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{isChangingBrand ? 'Ocultar marcas' : '¿Querés consultar otra marca?'}</span>
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
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-xs shrink-0">
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
              Seleccioná la marca de tu vehículo para adaptar los mostradores especializados de Mendoza:
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

      {/* 3. Selector de Categorías de Kits Específicos para este Auto */}
      <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-red-500" />
            <h2 className="text-sm sm:text-base font-black text-white">
              Kits Sugeridos para {currentCar.brand} {currentCar.model}:
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Piezas homologadas según el motor y modelo registrado en DNRPA
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {dynamicKitTemplates.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap text-xs font-bold transition flex items-center gap-2 border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-400 shadow-md ring-1 ring-red-400'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <span>{tpl.id === 'kit-service' ? '💧' : tpl.id === 'kit-distribucion' ? '⚙️' : tpl.id === 'kit-frenos' ? '🛑' : tpl.id === 'kit-suspension' ? '🛞' : tpl.id === 'kit-refrigeracion' ? '❄️' : tpl.id === 'kit-embrague' ? '🔄' : '⚡'}</span>
                <span>{tpl.title}</span>
                {tpl.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tpl.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Constructor Interactivo de Repuestos del Kit + Opciones de Mensaje (SIN PRECIOS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Lista de Repuestos del Kit (SIN PRECIOS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-700/70 mb-4 gap-2">
              <div>
                <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                  <span>Repuestos Incluidos en tu Kit</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                    {activeItems.length} seleccionados
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Marcá o desmarcá las piezas que querés incluir en tu pedido:
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-300 font-semibold">
                  Sin precios fijos ficticios
                </span>
              </div>
            </div>

            {/* Repuestos del Kit (Sin ningún signo $) */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
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
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-400">
                          Ref / Marca: <strong className="text-slate-200">{item.brand}</strong>
                        </span>
                        {item.spec && (
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700/80">
                            {item.spec}
                          </span>
                        )}
                        {item.isCustom && (
                          <span className="px-1.5 py-0.2 bg-purple-900/60 text-purple-300 border border-purple-500/40 rounded text-[9px] font-bold">
                            Personalizado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
                      title="Quitar repuesto de la lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario para Agregar Repuesto Personalizado (SIN PRECIO) */}
            <form onSubmit={handleAddCustomPart} className="mt-4 pt-4 border-t border-slate-700/70">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                ➕ ¿Querés sumar otro repuesto al kit? Escribí el nombre de la pieza:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  placeholder="Ej: Termostato con cuerpo, Manguera de agua, Óptica delantera, Bieleta..."
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

            {/* Aviso informativo de transparencia de precios en Mendoza */}
            <div className="mt-4 p-3 bg-blue-950/40 border border-blue-700/30 rounded-xl text-xs text-blue-200/90 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                <strong>¿Por qué no mostramos precios fijos?</strong> En Mendoza los precios de mostrador cambian según stock diario, pago de contado/transferencia o planes de cuotas. DinAcitY agrupa tus repuestos exactos para que la casa oficial te brinde su mejor cotización real al instante.
              </p>
            </div>

          </div>
        </div>

        {/* Columna Derecha: Opciones de Mensaje y Mostradores Oficiales */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 4.1 Selector de Intención de Mensaje */}
          <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="pb-3 border-b border-slate-700/70 mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block mb-0.5">
                Paso 2: Opciones de Consulta
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                ¿Qué tipo de consulta querés enviar a la casa?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {CONSULTATION_TYPES.map((ct) => {
                const isSelected = consultationType === ct.id;
                return (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => setConsultationType(ct.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-red-600/30 border-red-500 shadow-sm ring-1 ring-red-400'
                        : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/70 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-white">
                        {ct.title}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-red-400 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-2">
                      {ct.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Preview del Mensaje Generado y Botón Copiar */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 space-y-1 relative">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-sans font-bold text-slate-400">
                <span>Vista Previa del Mensaje para WhatsApp:</span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-[11px] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap pt-1 text-slate-300">
                {buildWhatsAppMessage('[Nombre de la Casa]', '[Dirección Mendoza]')}
              </div>
            </div>

          </div>

          {/* 4.2 Casas de Repuestos Especializadas por Marca */}
          <div className="bg-[#0b172e] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-lg">
            
            <div className="pb-3 border-b border-slate-700/70 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Mostradores de {currentCar.brand.toUpperCase()} en Mendoza
                </span>
              </div>
              <h3 className="text-base font-black text-white leading-tight">
                Pedí tu Kit a las Casas Oficiales y Especializadas:
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enviá tu kit prearmado directo por WhatsApp con 1 clic:
              </p>
            </div>

            {/* Listado de Casas Especializadas con WhatsApp directo */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
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

                  {/* Botón WhatsApp Pre-cargado con el Kit Completo y la consulta seleccionada */}
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppToStore(store)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>Consultar por WhatsApp ({activeItems.length} repuestos)</span>
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
