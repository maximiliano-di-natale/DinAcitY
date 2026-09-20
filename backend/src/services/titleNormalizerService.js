/**
 * TitleNormalizerService
 * Motor de normalización estricta de nombres y títulos de repuestos automotores.
 * Basado en las convenciones estándar de Mercado Libre, catálogos OEM y casas de repuestos de Mendoza.
 * Garantiza consistencia absoluta y elimina inconsistencias en comparaciones.
 */

export class TitleNormalizerService {
  constructor() {
    // Piezas normalizadas y su descriptor canónico
    this.canonicalParts = [
      {
        tokens: ['radiador', 'enfriador agua'],
        canonicalName: 'Radiador de Agua de Motor',
        category: 'refrigeracion',
        defaultBrands: ['Valeo', 'Mahle', 'Nakamoto', 'Magneti Marelli', 'Behr']
      },
      {
        tokens: ['termostato', 'pipeta termostato', 'caja termostato', 'cuerpo termostato'],
        canonicalName: 'Termostato con Caja y Pipeta',
        category: 'refrigeracion',
        defaultBrands: ['Mahle', 'Wahler', 'Gates', 'Thompson', 'Bosch']
      },
      {
        tokens: ['electro', 'ventilador', 'electroventilador'],
        canonicalName: 'Electroventilador Completo con Deflector',
        category: 'refrigeracion',
        defaultBrands: ['Valeo', 'Gate', 'Bosch', 'Denso']
      },
      {
        tokens: ['bomba agua', 'bomba refrigerante'],
        canonicalName: 'Bomba de Agua de Refrigeración',
        category: 'refrigeracion',
        defaultBrands: ['Dolz', 'SKF', 'Gates', 'Bosch']
      },
      {
        tokens: ['pastilla', 'pastillas', 'pastillas freno'],
        canonicalName: 'Juego de Pastillas de Freno Delanteras',
        category: 'frenos',
        defaultBrands: ['Bosch', 'Fras-le', 'Cobreq', 'TRW', 'Ferodo']
      },
      {
        tokens: ['disco', 'discos', 'disco freno'],
        canonicalName: 'Juego de Discos de Freno Ventilados',
        category: 'frenos',
        defaultBrands: ['Fremax', 'TRW', 'Bosch', 'Brembo']
      },
      {
        tokens: ['distribucion', 'correa distribucion', 'kit distribucion'],
        canonicalName: 'Kit de Distribución (Correa + Tensor)',
        category: 'motor',
        defaultBrands: ['Gates', 'SKF', 'Dayco', 'Continental', 'Bosch']
      },
      {
        tokens: ['embrague', 'placa disco', 'kit embrague'],
        canonicalName: 'Kit de Embrague (Placa, Disco y Crapodina)',
        category: 'embrague',
        defaultBrands: ['Valeo', 'LuK', 'Sachs', 'Taranto']
      },
      {
        tokens: ['amortiguador', 'amortiguadores'],
        canonicalName: 'Juego de Amortiguadores Delanteros',
        category: 'suspension',
        defaultBrands: ['Fric-Rot', 'Monroe', 'Sachs', 'Cofap']
      },
      {
        tokens: ['filtro', 'filtro aceite'],
        canonicalName: 'Filtro de Aceite de Motor',
        category: 'motor',
        defaultBrands: ['Mann Filter', 'Bosch', 'Fram', 'Mahle', 'Wega']
      },
      {
        tokens: ['filtro aire'],
        canonicalName: 'Filtro de Aire de Motor',
        category: 'motor',
        defaultBrands: ['Mann Filter', 'Bosch', 'Fram', 'Mahle', 'Wega']
      },
      {
        tokens: ['optica', 'faro delantero'],
        canonicalName: 'Óptica Delantera Principal',
        category: 'electricidad',
        defaultBrands: ['Arteb', 'Valeo', 'Depo', 'Vic']
      }
    ];

    // Detalle de motorizaciones canónicas por modelo
    this.modelEngineMap = {
      // Autos
      'gol': '1.6 8V',
      'gol trend': '1.6 8V MSI',
      'amarok': '2.0 TDI 16V / V6 3.0',
      'bora': '2.0 8V / 1.8T 20V',
      'vento': '2.0 TSI / 2.5 5Cil',
      'suran': '1.6 8V',
      'fox': '1.6 8V',
      'ranger': '2.2 / 3.2 TDCi Puma',
      'fiesta': '1.6 16V Sigma / Rocam',
      'focus': '1.6 Sigma / 2.0 Duratec',
      'ecosport': '1.6 Rocam / 2.0 16V',
      'corsa': '1.4 / 1.6 8V MPFI',
      'onix': '1.4 8V SPE/4 / 1.0T Turbo',
      'cruze': '1.4T Ecotec Turbo',
      'hilux': '2.4 / 2.8 D-4D Turbo Diésel',
      'corolla': '1.8 / 2.0 Dual VVT-i 16V',
      'cronos': '1.3 8V Firefly / 1.8 16V E.torQ',
      'palio': '1.3 / 1.4 8V Fire',
      'clio': '1.2 16V D4F / 1.6 16V K4M',
      'kangoo': '1.6 16V K4M / 1.5 dCi',
      'sandero': '1.6 16V K4M / 1.6 SCe',
      '206': '1.4 8V TU3JP / 1.6 16V',
      '208': '1.6 16V VTi / 1.2 PureTech',

      // Motos
      'wave 110s': '110cc OHC 4T',
      'cg 150 titan': '150cc OHC 4T',
      'xr 150l': '150cc OHC 4T',
      'xr 250 tornado': '250cc DOHC 4T 6V',
      'cb 250 twister': '250cc OHC 4T Inyección',
      'ybr 125': '125cc SOHC 4T',
      'fz fi 2.0': '149cc SOHC Blue-Core',
      'rouser ns 200': '199.5cc Triple Bujía 4V',
      'smash 110': '110cc Monocilíndrico 4T',

      // Camiones
      '113 h/t': 'DS11 360 CV Turbo Intercooler',
      'serie 4 r124': 'DC12 420 CV 6 Cil',
      'g360': 'DC13 360 CV Euro 5',
      '1114': 'OM 352 6 Cilindros Diésel',
      '1620': 'OM 366 LA Turbo Intercooler',
      'actros 2045': 'OM 471 6 Cilindros en Línea',
      'daily 55c16': 'F1C 3.0 HPI 160 CV',
      'stralis 460': 'Cursor 13 460 CV Euro 5',
      'fh 460': 'D13C 460 CV Euro 5 Turbo',
      'cargo 1722': 'Cummins 6CTAA 8.3 Turbo'
    };
  }

  /**
   * Normaliza la consulta de entrada a su versión canónica estandarizada
   */
  detectCanonicalPart(query) {
    const q = (query || '').toLowerCase().trim();
    for (const part of this.canonicalParts) {
      if (part.tokens.some((token) => q.includes(token))) {
        return part;
      }
    }
    // Si no coincide con un token específico, capitalizar ordenadamente
    return {
      canonicalName: q ? q.charAt(0).toUpperCase() + q.slice(1) : 'Repuesto Automotor',
      category: 'general',
      defaultBrands: ['OEM Homologado', 'Valeo', 'Bosch', 'Mahle']
    };
  }

  /**
   * Genera el motor o especificación técnica asociada al modelo
   */
  getEngineSpec(model) {
    if (!model) return '';
    const m = model.toLowerCase().trim();
    return this.modelEngineMap[m] || '';
  }

  /**
   * Construye un título canónico uniforme sin inconsistencias
   * Formato: [Pieza Canónica] [Marca Pieza] [Calidad] Para [Marca Vehículo] [Modelo] [Motorización/Año]
   */
  formatStandardTitle({ partName, partBrand, vehicleBrand, model, year, condition }) {
    const brandClean = vehicleBrand ? vehicleBrand.charAt(0).toUpperCase() + vehicleBrand.slice(1) : '';
    const modelClean = model || '';
    const yearClean = year ? `(${year})` : '';
    const engine = this.getEngineSpec(model);
    const engineStr = engine ? `[Motor ${engine}]` : '';
    const condStr = condition === 'reacondicionado' ? '[Reacondicionado Certificado]' : '';

    return `${partName} ${partBrand} ${condStr} Para ${brandClean} ${modelClean} ${engineStr} ${yearClean}`
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Crea una clave de coincidencia única (partMatchKey)
   * Permite que dos repuestos de distintas tiendas compitan y se comparen
   * únicamente si pertenecen exactamente a la misma pieza y vehículo.
   */
  createMatchKey({ partCategory, vehicleType, vehicleBrand, model, partName }) {
    const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${clean(partCategory)}_${clean(vehicleType)}_${clean(vehicleBrand)}_${clean(model)}_${clean(partName)}`;
  }
}

export const titleNormalizer = new TitleNormalizerService();
