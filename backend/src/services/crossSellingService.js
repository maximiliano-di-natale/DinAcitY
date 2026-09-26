// Servicio de Venta Cruzada (Cross-Selling) de Repuestos Complementarios
// Recomienda piezas que habitualmente se reemplazan juntas para el vehículo seleccionado

export class CrossSellingService {
  constructor() {
    this.complementaryRules = [
      {
        triggers: ['pastilla', 'freno'],
        category: 'frenos',
        recommendations: [
          {
            name: 'Par de Discos de Freno Delanteros',
            queryKey: 'Discos de freno',
            reason: 'Al cambiar pastillas, discos con rebaba o desgaste arruinan las pastillas nuevas.',
            estimatedPriceAuto: 54000,
            estimatedPricePickup: 88000,
            defaultBrand: 'Fremax / Corven'
          },
          {
            name: 'Líquido de Frenos DOT 4 (1 Litro)',
            queryKey: 'Liquido de freno DOT4',
            reason: 'El líquido pierde propiedades hidrófugas cada 2 años o al abrir calipers.',
            estimatedPriceAuto: 9500,
            estimatedPricePickup: 11000,
            defaultBrand: 'Wagner / Bosch'
          },
          {
            name: 'Limpia Frenos en Aerosol Desengrasante',
            queryKey: 'Limpia frenos aerosol',
            reason: 'Elimina residuos aceitosos y polvillo para evitar chirridos.',
            estimatedPriceAuto: 7200,
            estimatedPricePickup: 7200,
            defaultBrand: 'Locx / Wurth'
          }
        ]
      },
      {
        triggers: ['radiador', 'calefaccion', 'refrigeracion', 'termostato', 'agua'],
        category: 'refrigeracion',
        recommendations: [
          {
            name: 'Termostato con Cuerpo y Caja',
            queryKey: 'Termostato con caja',
            reason: 'Esencial reemplazarlo para evitar que el nuevo radiador trabaje fuera de rango térmico.',
            estimatedPriceAuto: 32000,
            estimatedPricePickup: 52000,
            defaultBrand: 'Mahle / Wahler'
          },
          {
            name: 'Juego de Mangueras de Entrada y Salida',
            queryKey: 'Mangueras de agua',
            reason: 'Las mangueras resecas se rajan por la nueva presión del circuito.',
            estimatedPriceAuto: 24000,
            estimatedPricePickup: 38000,
            defaultBrand: 'Cauplas / Gates'
          },
          {
            name: 'Refrigerante Anticongelante Orgánico 2L',
            queryKey: 'Refrigerante organico concentrado',
            reason: 'Evita la corrosión galvánica del aluminio nuevo del radiador.',
            estimatedPriceAuto: 15000,
            estimatedPricePickup: 22000,
            defaultBrand: 'Tir / Glacelf'
          }
        ]
      },
      {
        triggers: ['distribucion', 'correa', 'bomba'],
        category: 'motor',
        recommendations: [
          {
            name: 'Bomba de Agua con Junta',
            queryKey: 'Bomba de agua',
            reason: 'El 80% de las bombas fallan por la nueva tensión de la correa si no se cambian juntas.',
            estimatedPriceAuto: 39000,
            estimatedPricePickup: 64000,
            defaultBrand: 'Dolz / SKF'
          },
          {
            name: 'Correa de Accesorios Poli-V',
            queryKey: 'Correa Poli-V',
            reason: 'Se desmonta obligatoriamente al hacer la distribución; no conviene volver a poner la usada.',
            estimatedPriceAuto: 16000,
            estimatedPricePickup: 24000,
            defaultBrand: 'Continental / Gates'
          },
          {
            name: 'Retén de Árbol de Levas / Cigüeñal',
            queryKey: 'Retenes distribucion',
            reason: 'Evita pérdidas de aceite que degradan la correa dentada nueva.',
            estimatedPriceAuto: 9800,
            estimatedPricePickup: 14500,
            defaultBrand: 'Sabó / Corteco'
          }
        ]
      },
      {
        triggers: ['amortiguador', 'suspension'],
        category: 'suspension',
        recommendations: [
          {
            name: 'Juego de Cazoletas con Crapodinas',
            queryKey: 'Cazoletas amortiguador',
            reason: 'Si la crapodina está trabada, la dirección queda pesada y el amortiguador sufre cargas laterales.',
            estimatedPriceAuto: 28000,
            estimatedPricePickup: 42000,
            defaultBrand: 'VTH / Axios'
          },
          {
            name: 'Kit de Fuelles y Topes de Rebote',
            queryKey: 'Fuelles y topes amortiguador',
            reason: 'Protege el vástago cromado de piedras y arena del asfalto o ripio mendocino.',
            estimatedPriceAuto: 14000,
            estimatedPricePickup: 21000,
            defaultBrand: 'RN / VTH'
          }
        ]
      }
    ];
  }

  getRecommendations({ query = '', brand = '', model = '', vehicleType = 'auto' }) {
    const q = query.toLowerCase();
    const isPickup = model.toLowerCase().includes('hilux') || model.toLowerCase().includes('ranger') || model.toLowerCase().includes('amarok');

    // Buscar regla que coincida con la consulta
    let matchedRule = this.complementaryRules.find((rule) => {
      return rule.triggers.some((t) => q.includes(t));
    });

    // Si no coincide directamente, retornar frenos o refrigeración por defecto
    if (!matchedRule) {
      matchedRule = this.complementaryRules[0];
    }

    const recs = matchedRule.recommendations.map((item, idx) => {
      const price = isPickup ? item.estimatedPricePickup : item.estimatedPriceAuto;
      const title = `${item.name} Para ${brand || 'Vehículo'} ${model}`.trim();
      const cleanMlQuery = encodeURIComponent(`${item.queryKey} ${brand} ${model} mendoza`.trim());
      const mlUrl = `https://listado.mercadolibre.com.ar/${cleanMlQuery}_OrderId_PRICE*ASC`;

      return {
        id: `cross-rec-${idx + 1}`,
        name: item.name,
        queryKey: item.queryKey,
        title: title,
        reason: item.reason,
        brand: item.defaultBrand,
        estimatedPrice: price,
        currency: 'ARS',
        productUrl: mlUrl
      };
    });

    return {
      category: matchedRule.category,
      vehicleContext: `${brand} ${model}`.trim(),
      items: recs
    };
  }
}
