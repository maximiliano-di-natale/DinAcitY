// Base de datos de Talleres Mecánicos Asociados y Homologados en Mendoza
// Provee cross-selling de instalación y turno inmediato para colocación de repuestos

export const MENDOZA_WORKSHOPS = [
  {
    id: 'taller-carril-frenos',
    name: 'Taller Integral & Frenos Carril Rodríguez Peña',
    zone: 'Carril Rodríguez Peña',
    department: 'Godoy Cruz',
    address: 'Carril Rodríguez Peña 2150, Godoy Cruz, Mendoza',
    whatsapp: '5492614529011',
    rating: 4.9,
    reviewsCount: 210,
    specialties: ['frenos', 'suspension', 'refrigeracion', 'mangueras', 'calefaccion'],
    badge: 'Taller Destacado • Garantía de Colocación 6 meses',
    turnosDisponibles: 'Turnos en el día o 24hs hábiles'
  },
  {
    id: 'taller-godoycruz-mendoza',
    name: 'Mecánica Especializada Godoy Cruz Centro',
    zone: 'Godoy Cruz',
    department: 'Godoy Cruz',
    address: 'San Martín Sur 1420, Godoy Cruz, Mendoza',
    whatsapp: '5492615891234',
    rating: 4.8,
    reviewsCount: 178,
    specialties: ['refrigeracion', 'calefaccion', 'motor', 'distribucion', 'frenos'],
    badge: 'Especialista en Refrigeración y Calefacción Automotor',
    turnosDisponibles: 'Atención de Lunes a Sábados'
  },
  {
    id: 'taller-guaymallen-oeste',
    name: 'Centro Automotor Guaymallén & Paso',
    zone: 'Guaymallén',
    department: 'Guaymallén',
    address: 'Bandera de Los Andes 3890, Guaymallén, Mendoza',
    whatsapp: '5492616782390',
    rating: 4.8,
    reviewsCount: 145,
    specialties: ['frenos', 'embrague', 'suspension', 'distribucion', 'baterias'],
    badge: 'Diagnóstico Computarizado y Banco de Frenos',
    turnosDisponibles: 'Turnos mañana y tarde'
  },
  {
    id: 'taller-capital-mendoza',
    name: 'Taller Mecánico San Juan & Capital',
    zone: 'Ciudad de Mendoza',
    department: 'Ciudad de Mendoza',
    address: 'Calle San Juan 780, Capital, Mendoza',
    whatsapp: '5492614238910',
    rating: 4.7,
    reviewsCount: 130,
    specialties: ['frenos', 'refrigeracion', 'filtros', 'baterias', 'suspension'],
    badge: 'Ubicación Céntrica • Service Rápido',
    turnosDisponibles: 'Atención sin turno previo para frenos'
  },
  {
    id: 'taller-maipu-mendoza',
    name: 'Mecánica Integral Maipú',
    zone: 'Maipú',
    department: 'Maipú',
    address: 'Av. Maza 1250, Maipú, Mendoza',
    whatsapp: '5492613904512',
    rating: 4.8,
    reviewsCount: 98,
    specialties: ['embrague', 'distribucion', 'refrigeracion', 'frenos'],
    badge: 'Especialista en Pick-Ups y Utilitarios Hilux / Ranger / Amarok',
    turnosDisponibles: 'Turnos programados'
  }
];

// Tarifas de mano de obra estimadas promedio del mercado mendocino (ARS)
export const ESTIMATED_LABOR_RATES = {
  frenos: {
    category: 'frenos',
    name: 'Cambio de Pastillas de Freno Delanteras',
    minPrice: 22000,
    maxPrice: 32000,
    averagePrice: 26000,
    estimatedHours: '1 a 1.5 horas',
    includes: ['Desmonte de ruedas', 'Limpieza y lubricación de mordazas / calipers', 'Purga y control de líquido de frenos']
  },
  refrigeracion: {
    category: 'refrigeracion',
    name: 'Colocación de Radiador de Agua / Termostato',
    minPrice: 35000,
    maxPrice: 48000,
    averagePrice: 42000,
    estimatedHours: '2 a 3 horas',
    includes: ['Vaciado y limpieza del circuito refrigerante', 'Montaje estanco con abrazaderas', 'Purga de aire y prueba de temperatura']
  },
  calefaccion: {
    category: 'calefaccion',
    name: 'Reemplazo de Radiador / Manguera de Calefacción',
    minPrice: 40000,
    maxPrice: 65000,
    averagePrice: 50000,
    estimatedHours: '3 a 4 horas',
    includes: ['Desarme de panel bajo habitáculo', 'Conexión de toberas y mangueras', 'Prueba de calefacción y estanqueidad']
  },
  embrague: {
    category: 'embrague',
    name: 'Instalación de Kit de Embrague Completo',
    minPrice: 85000,
    maxPrice: 125000,
    averagePrice: 98000,
    estimatedHours: '4 a 6 horas',
    includes: ['Desmonte de caja de cambios', 'Centrado de placa y disco', 'Cambio de crapodina / rulemán de empuje y regulación']
  },
  distribucion: {
    category: 'distribucion',
    name: 'Cambio de Correa / Cadena de Distribución y Bomba de Agua',
    minPrice: 60000,
    maxPrice: 95000,
    averagePrice: 75000,
    estimatedHours: '3 a 5 horas',
    includes: ['Puesta a punto con herramientas específicas', 'Montaje de tensores y rodillos', 'Prueba dinámica de motor']
  },
  suspension: {
    category: 'suspension',
    name: 'Cambio de Amortiguadores (Par)',
    minPrice: 32000,
    maxPrice: 48000,
    averagePrice: 38000,
    estimatedHours: '2 horas',
    includes: ['Compresión de espirales con prensa de seguridad', 'Revisión de cazoletas y fuelles', 'Control de alineación']
  },
  general: {
    category: 'general',
    name: 'Mano de Obra General de Mecánica Ligera',
    minPrice: 20000,
    maxPrice: 35000,
    averagePrice: 28000,
    estimatedHours: '1 a 2 horas',
    includes: ['Instalación profesional', 'Revisión visual de 15 puntos de seguridad']
  }
};

export function getEstimatedLabor(categoryOrQuery) {
  const cat = (categoryOrQuery || '').toLowerCase();
  if (cat.includes('freno') || cat.includes('pastilla') || cat.includes('disco')) return ESTIMATED_LABOR_RATES.frenos;
  if (cat.includes('calefaccion') || cat.includes('calefactor')) return ESTIMATED_LABOR_RATES.calefaccion;
  if (cat.includes('radiador') || cat.includes('agua') || cat.includes('termostato') || cat.includes('electro') || cat.includes('refrigeracion')) return ESTIMATED_LABOR_RATES.refrigeracion;
  if (cat.includes('embrague')) return ESTIMATED_LABOR_RATES.embrague;
  if (cat.includes('distribucion') || cat.includes('correa') || cat.includes('bomba')) return ESTIMATED_LABOR_RATES.distribucion;
  if (cat.includes('amortiguador') || cat.includes('suspension')) return ESTIMATED_LABOR_RATES.suspension;
  return ESTIMATED_LABOR_RATES.general;
}
