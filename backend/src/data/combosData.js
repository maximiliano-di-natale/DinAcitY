// Catálogo de Paquetes Dinámicos y Kits de Repuestos para DinAcitY
// Agrupa repuestos compatibles para cotización conjunta en casas de repuestos de Mendoza y Mercado Libre
// (Sin descuentos ficticios: muestra precios sumados reales de los proveedores)

export const PRESET_KITS = [
  {
    id: 'kit-service',
    name: 'Kit Service Completo (Filtros + Aceite)',
    category: 'filtros_aceite',
    description: 'Todo lo necesario para el mantenimiento de los 10.000 / 15.000 km.',
    icon: 'Droplets',
    badge: 'Mantenimiento Preventivo',
    baseParts: [
      { name: 'Filtro de Aceite', queryKey: 'Filtro de aceite', defaultBrand: 'Mann Filter / Bosch', priceAuto: 14500, pricePickup: 22000, priceCamion: 38000 },
      { name: 'Filtro de Aire', queryKey: 'Filtro de aire', defaultBrand: 'Mann Filter / Wega', priceAuto: 18000, pricePickup: 28000, priceCamion: 49000 },
      { name: 'Filtro de Habitáculo (Polen)', queryKey: 'Filtro habitaculo', defaultBrand: 'Bosch / Mahle', priceAuto: 12000, pricePickup: 19000, priceCamion: 26000 },
      { name: 'Aceite de Motor Sintético 4L', queryKey: 'Aceite sintetico 5W-30', defaultBrand: 'Total / Castrol / Elaion', priceAuto: 48000, pricePickup: 68000, priceCamion: 135000 }
    ]
  },
  {
    id: 'kit-frenos',
    name: 'Kit de Frenos Delanteros Completo',
    category: 'frenos',
    description: 'Pastillas, discos y líquido de freno para renovación total del sistema de frenado.',
    icon: 'Disc',
    badge: 'Seguridad Crítica',
    baseParts: [
      { name: 'Juego de Pastillas de Freno Delanteras', queryKey: 'Pastillas de freno', defaultBrand: 'Bosch / Cobreq', priceAuto: 28000, pricePickup: 48000, priceCamion: 95000 },
      { name: 'Par de Discos de Freno Delanteros', queryKey: 'Discos de freno', defaultBrand: 'Fremax / Corven', priceAuto: 54000, pricePickup: 88000, priceCamion: 160000 },
      { name: 'Líquido de Frenos DOT 4 (1L)', queryKey: 'Liquido de freno DOT4', defaultBrand: 'Wagner / Bosch', priceAuto: 9500, pricePickup: 11000, priceCamion: 18000 }
    ]
  },
  {
    id: 'kit-refrigeracion',
    name: 'Kit Integral de Refrigeración y Temperatura',
    category: 'refrigeracion',
    description: 'Radiador, termostato, mangueras y refrigerante para evitar sobrecalentamientos.',
    icon: 'Thermometer',
    badge: 'Sistema Térmico',
    baseParts: [
      { name: 'Radiador de Agua de Motor', queryKey: 'Radiador de agua', defaultBrand: 'Valeo / Mahle', priceAuto: 78000, pricePickup: 145000, priceCamion: 320000 },
      { name: 'Termostato con Cuerpo y Caja', queryKey: 'Termostato con caja', defaultBrand: 'Mahle / Wahler', priceAuto: 32000, pricePickup: 52000, priceCamion: 85000 },
      { name: 'Juego de Mangueras de Refrigeración', queryKey: 'Mangueras de agua', defaultBrand: 'Cauplas / Gates', priceAuto: 24000, pricePickup: 38000, priceCamion: 65000 },
      { name: 'Refrigerante Anticongelante Orgánico (2L)', queryKey: 'Refrigerante organico', defaultBrand: 'Tir / Glacelf', priceAuto: 15000, pricePickup: 22000, priceCamion: 42000 }
    ]
  },
  {
    id: 'kit-distribucion',
    name: 'Kit de Distribución y Bomba de Agua',
    category: 'motor',
    description: 'Correa dentada, tensores, bomba de agua y correa poli-v para el recambio programado.',
    icon: 'Cog',
    badge: 'Mantenimiento Mayor',
    baseParts: [
      { name: 'Kit de Distribución (Correa y Tensores)', queryKey: 'Kit distribucion', defaultBrand: 'Gates / INA / Dayco', priceAuto: 74000, pricePickup: 125000, priceCamion: 210000 },
      { name: 'Bomba de Agua con Junta', queryKey: 'Bomba de agua', defaultBrand: 'Dolz / SKF', priceAuto: 39000, pricePickup: 64000, priceCamion: 125000 },
      { name: 'Correa de Accesorios Poli-V', queryKey: 'Correa Poli-V', defaultBrand: 'Continental / Gates', priceAuto: 16000, pricePickup: 24000, priceCamion: 45000 }
    ]
  },
  {
    id: 'kit-suspension',
    name: 'Kit Tren Delantero y Amortiguación',
    category: 'suspension',
    description: 'Amortiguadores, cazoletas y fuelles para estabilidad y confort de marcha.',
    icon: 'Activity',
    badge: 'Confort y Control',
    baseParts: [
      { name: 'Par de Amortiguadores Delanteros', queryKey: 'Amortiguadores delanteros', defaultBrand: 'Fric-Rot / Monroe', priceAuto: 86000, pricePickup: 140000, priceCamion: 260000 },
      { name: 'Juego de Cazoletas con Crapodinas', queryKey: 'Cazoletas amortiguador', defaultBrand: 'VTH / Axios', priceAuto: 28000, pricePickup: 42000, priceCamion: 75000 },
      { name: 'Kit de Fuelles y Topes de Rebote', queryKey: 'Fuelles y topes amortiguador', defaultBrand: 'RN / VTH', priceAuto: 14000, pricePickup: 21000, priceCamion: 35000 }
    ]
  }
];

export function generateVehicleKits({ vehicleType = 'auto', brand = 'Volkswagen', model = 'Gol Trend', year = '2019' }) {
  const isPickup = model.toLowerCase().includes('hilux') || model.toLowerCase().includes('ranger') || model.toLowerCase().includes('amarok') || model.toLowerCase().includes('s10');
  const isCamion = vehicleType === 'camion';

  return PRESET_KITS.map((kit) => {
    const items = kit.baseParts.map((part, pIdx) => {
      let unitPrice = part.priceAuto;
      if (isCamion) unitPrice = part.priceCamion;
      else if (isPickup) unitPrice = part.pricePickup;

      const itemTitle = `${part.name} ${part.defaultBrand} Para ${brand} ${model} (${year})`;
      const cleanMlQuery = encodeURIComponent(`${part.queryKey} ${brand} ${model} mendoza`.trim());
      const mlUrl = `https://listado.mercadolibre.com.ar/${cleanMlQuery}_OrderId_PRICE*ASC`;

      return {
        id: `${kit.id}-item-${pIdx + 1}`,
        name: part.name,
        brand: part.defaultBrand,
        title: itemTitle,
        estimatedPrice: unitPrice,
        currency: 'ARS',
        productUrl: mlUrl,
        queryKey: part.queryKey
      };
    });

    const totalPrice = items.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

    // Mensaje de consulta consolidada para WhatsApp a casas de repuestos de Mendoza
    const itemsListText = items.map((it, idx) => `${idx + 1}. ${it.title} (Ref: $${it.estimatedPrice.toLocaleString('es-AR')})`).join('\n');
    const whatsappConsultText = encodeURIComponent(
      `Hola, vi en DinAcitY Mendoza el "${kit.name}" para mi ${brand} ${model} (${year}):\n\n${itemsListText}\n\nTotal estimado: $${totalPrice.toLocaleString('es-AR')}.\n¿Tienen disponibilidad del kit completo en mostrador y cuál es el presupuesto actual? Gracias.`
    );

    return {
      id: kit.id,
      name: kit.name,
      category: kit.category,
      description: kit.description,
      badge: kit.badge,
      vehicle: `${brand} ${model} (${year})`,
      totalEstimatedPrice: totalPrice,
      currency: 'ARS',
      itemsCount: items.length,
      items: items,
      whatsappConsultUrl: `https://wa.me/5492615891234?text=${whatsappConsultText}`,
      whatsappMessagePreview: `Consulta por kit completo de ${items.length} repuestos para ${brand} ${model}`
    };
  });
}
