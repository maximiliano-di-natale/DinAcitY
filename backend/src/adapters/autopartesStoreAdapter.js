/**
 * Adapter para la red de tiendas de autopartes asociadas a DinAcitY
 * (Warnes Repuestos, Autopartes Express, DistriMoto, CamionRepuestos Sur, etc.)
 */
export class AutopartesStoreAdapter {
  constructor() {
    this.stores = [
      {
        id: 'warnes-online',
        name: 'Warnes Repuestos Online',
        storeKey: 'warnes',
        website: 'https://www.warnesonline.com.ar',
        specialty: ['auto', 'camion'],
        discountFactor: 0.88, // 12% más barato en promedio por ser mayorista directo
        baseShipping: 3200,
        freeShippingThreshold: 50000,
        sellerRating: '4.9',
        reviewsCount: 340,
        badge: 'Mayorista Directo Warnes'
      },
      {
        id: 'autopartes-express',
        name: 'Autopartes Express Nacional',
        storeKey: 'express',
        website: 'https://www.autopartesexpress.com.ar',
        specialty: ['auto', 'moto'],
        discountFactor: 0.94,
        baseShipping: 2900,
        freeShippingThreshold: 45000,
        sellerRating: '4.7',
        reviewsCount: 195,
        badge: 'Entrega Rápida 24hs'
      },
      {
        id: 'distri-moto',
        name: 'DistriMoto Especialistas',
        storeKey: 'distrimoto',
        website: 'https://www.distrimoto.com.ar',
        specialty: ['moto'],
        discountFactor: 0.85,
        baseShipping: 2200,
        freeShippingThreshold: 35000,
        sellerRating: '4.9',
        reviewsCount: 420,
        badge: 'Líder en Motos'
      },
      {
        id: 'camiones-pesados-sur',
        name: 'CamiónRepuestos Pesados Sur',
        storeKey: 'camionesur',
        website: 'https://www.camionrepuestossur.com.ar',
        specialty: ['camion'],
        discountFactor: 0.90,
        baseShipping: 6500,
        freeShippingThreshold: 120000,
        sellerRating: '4.8',
        reviewsCount: 180,
        badge: 'Especialista en Flotas y Pesados'
      },
      {
        id: 'distribuidora-federal',
        name: 'Distribuidora Federal de Autopartes',
        storeKey: 'federal',
        website: 'https://www.autopartesfederal.com.ar',
        specialty: ['auto', 'moto', 'camion'],
        discountFactor: 0.98,
        baseShipping: 0,
        freeShippingThreshold: 0, // Envío gratis garantizado
        sellerRating: '4.5',
        reviewsCount: 92,
        badge: 'Envío Gratis a Todo el País'
      }
    ];
  }

  async search({ query, vehicleType = 'auto', brand, model, year, category, limit = 20 }) {
    const q = (query || 'Radiador').trim();
    const vehBrand = brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : '';
    const vehModel = model || '';
    const vehYear = year || '';

    // Filtrar tiendas aplicables según tipo de vehículo
    const applicableStores = this.stores.filter((store) => {
      if (!vehicleType) return true;
      return store.specialty.includes(vehicleType);
    });

    const basePriceMap = {
      // Refrigeración
      radiador: vehicleType === 'camion' ? 260000 : vehicleType === 'moto' ? 38000 : 72000,
      termostato: vehicleType === 'camion' ? 48000 : vehicleType === 'moto' ? 14000 : 22000,
      electroventilador: vehicleType === 'camion' ? 180000 : vehicleType === 'moto' ? 32000 : 58000,
      bomba: vehicleType === 'camion' ? 130000 : vehicleType === 'moto' ? 26000 : 39000,
      manguera: 14500,
      // Frenos
      pastilla: vehicleType === 'camion' ? 75000 : vehicleType === 'moto' ? 12000 : 25000,
      freno: vehicleType === 'camion' ? 95000 : vehicleType === 'moto' ? 18000 : 31000,
      disco: vehicleType === 'camion' ? 110000 : vehicleType === 'moto' ? 24000 : 42000,
      // Motor y distribución
      distribucion: vehicleType === 'camion' ? 210000 : vehicleType === 'moto' ? 35000 : 92000,
      embrague: vehicleType === 'camion' ? 380000 : vehicleType === 'moto' ? 45000 : 135000,
      filtro: vehicleType === 'camion' ? 34000 : vehicleType === 'moto' ? 7500 : 11500,
      amortiguador: vehicleType === 'camion' ? 140000 : vehicleType === 'moto' ? 36000 : 48000,
      bateria: vehicleType === 'camion' ? 220000 : vehicleType === 'moto' ? 38000 : 79000,
      optica: vehicleType === 'camion' ? 120000 : vehicleType === 'moto' ? 28000 : 54000
    };

    const matchedKey = Object.keys(basePriceMap).find((k) => q.toLowerCase().includes(k)) || 'radiador';
    const baseEstimatedPrice = basePriceMap[matchedKey];

    const results = [];

    const brandVariants = [
      { name: 'Valeo', mult: 1.05 },
      { name: 'Bosch', mult: 1.12 },
      { name: 'Mahle', mult: 1.08 },
      { name: 'SKF', mult: 1.02 },
      { name: 'Magneti Marelli', mult: 0.96 },
      { name: 'TRW Original', mult: 0.93 },
      { name: 'Nakamoto OEM', mult: 0.86 }
    ];

    let itemIdx = 1;
    for (const store of applicableStores) {
      // 2 variaciones de producto por tienda (ej. original y alternativo o marcas distintas)
      for (let i = 0; i < 2; i++) {
        const variant = brandVariants[(itemIdx + i) % brandVariants.length];
        const storeDiscount = store.discountFactor + ((Math.random() * 0.08) - 0.04);
        const calculatedPrice = Math.round((baseEstimatedPrice * variant.mult * storeDiscount) / 100) * 100;
        const isFreeShipping = store.freeShippingThreshold === 0 || calculatedPrice >= store.freeShippingThreshold;
        const shippingCost = isFreeShipping ? 0 : store.baseShipping;
        const totalPrice = calculatedPrice + shippingCost;

        const condition = (itemIdx % 5 === 0) ? 'reacondicionado' : 'nuevo';

        results.push({
          id: `${store.storeKey}-${itemIdx}`,
          sourceId: `PART-${store.storeKey.toUpperCase()}-${1000 + itemIdx}`,
          storeName: store.name,
          storeKey: store.storeKey,
          title: `${q} ${variant.name} ${condition === 'reacondicionado' ? '[Reacondicionado Certificado]' : 'Nuevo'} - ${vehBrand} ${vehModel} ${vehYear}`.trim(),
          partBrand: variant.name,
          price: calculatedPrice,
          currency: 'ARS',
          shippingCost: shippingCost,
          totalPrice: totalPrice,
          freeShipping: isFreeShipping,
          condition: condition,
          sellerName: store.name,
          sellerRating: store.sellerRating,
          reviewsCount: store.reviewsCount + Math.floor(Math.random() * 25),
          badge: store.badge,
          imageUrl: this.getImageForQuery(q),
          productUrl: `${store.website}/producto?item=${encodeURIComponent(`${q} ${vehBrand} ${vehModel} ${variant.name}`)}`,
          vehicleCompatibility: `${vehBrand} ${vehModel} ${vehYear}`.trim() || 'Apto línea completa',
          warrantyDays: condition === 'reacondicionado' ? 90 : 180
        });

        itemIdx++;
      }
    }

    return results;
  }

  getImageForQuery(query) {
    const q = query.toLowerCase();
    if (q.includes('radiador')) return 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80';
    if (q.includes('termostato')) return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';
    if (q.includes('electro') || q.includes('ventilador')) return 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=600&auto=format&fit=crop&q=80';
    if (q.includes('freno') || q.includes('pastilla') || q.includes('disco')) return 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=600&auto=format&fit=crop&q=80';
    if (q.includes('embrague')) return 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80';
    if (q.includes('amortiguador')) return 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80';
  }
}
