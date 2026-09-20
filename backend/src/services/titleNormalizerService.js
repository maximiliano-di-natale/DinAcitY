/**
 * TitleNormalizerService
 * Motor de normalización estricta y analizador inteligente de búsquedas (Smart Query Parser).
 * Detecta si el usuario ingresó un repuesto, una marca o un modelo de auto/moto/camión.
 */

export class TitleNormalizerService {
  constructor() {
    this.canonicalParts = [
      {
        tokens: ['radiador', 'enfriador', 'refrigeracion', 'panel radiador'],
        canonicalName: 'Radiador de Agua de Motor',
        category: 'refrigeracion',
        defaultBrands: ['Valeo', 'Mahle', 'Nakamoto', 'Magneti Marelli', 'Behr']
      },
      {
        tokens: ['termostato', 'pipeta', 'caja termostato', 'cuerpo termostato'],
        canonicalName: 'Termostato con Caja y Pipeta',
        category: 'refrigeracion',
        defaultBrands: ['Mahle', 'Wahler', 'Gates', 'Thompson', 'Bosch']
      },
      {
        tokens: ['electro', 'ventilador', 'electroventilador', 'paleta'],
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
        tokens: ['pastilla', 'pastillas', 'pastillas freno', 'pastilla freno'],
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
        tokens: ['distribucion', 'correa distribucion', 'kit distribucion', 'cadena'],
        canonicalName: 'Kit de Distribución (Correa + Tensor)',
        category: 'motor',
        defaultBrands: ['Gates', 'SKF', 'Dayco', 'Continental', 'Bosch']
      },
      {
        tokens: ['embrague', 'placa disco', 'kit embrague', 'clutch'],
        canonicalName: 'Kit de Embrague (Placa, Disco y Crapodina)',
        category: 'embrague',
        defaultBrands: ['Valeo', 'LuK', 'Sachs', 'Taranto']
      },
      {
        tokens: ['amortiguador', 'amortiguadores', 'suspension'],
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
        tokens: ['optica', 'faro delantero', 'foco'],
        canonicalName: 'Óptica Delantera Principal',
        category: 'electricidad',
        defaultBrands: ['Arteb', 'Valeo', 'Depo', 'Vic']
      }
    ];

    // Diccionario de vehículos para resolver búsquedas libres
    this.knownVehicles = [
      // Autos
      { match: ['hilux'], brand: 'Toyota', model: 'Hilux', type: 'auto', engine: '2.8 D-4D Turbo Diésel' },
      { match: ['corolla'], brand: 'Toyota', model: 'Corolla', type: 'auto', engine: '1.8 Dual VVT-i 16V' },
      { match: ['etios'], brand: 'Toyota', model: 'Etios', type: 'auto', engine: '1.5 16V Dual VVT-i' },
      { match: ['yaris'], brand: 'Toyota', model: 'Yaris', type: 'auto', engine: '1.5 16V VVT-i' },
      { match: ['sw4'], brand: 'Toyota', model: 'SW4', type: 'auto', engine: '2.8 D-4D Turbo Diésel' },
      { match: ['gol trend', 'trend'], brand: 'Volkswagen', model: 'Gol Trend', type: 'auto', engine: '1.6 8V MSI' },
      { match: ['gol'], brand: 'Volkswagen', model: 'Gol', type: 'auto', engine: '1.6 8V' },
      { match: ['amarok'], brand: 'Volkswagen', model: 'Amarok', type: 'auto', engine: '2.0 TDI 16V Biturbo' },
      { match: ['bora'], brand: 'Volkswagen', model: 'Bora', type: 'auto', engine: '2.0 8V / 1.8T' },
      { match: ['vento'], brand: 'Volkswagen', model: 'Vento', type: 'auto', engine: '2.0 TSI / 2.5 5Cil' },
      { match: ['suran'], brand: 'Volkswagen', model: 'Suran', type: 'auto', engine: '1.6 8V' },
      { match: ['fox'], brand: 'Volkswagen', model: 'Fox', type: 'auto', engine: '1.6 8V' },
      { match: ['polo'], brand: 'Volkswagen', model: 'Polo', type: 'auto', engine: '1.6 16V MSI' },
      { match: ['taos'], brand: 'Volkswagen', model: 'Taos', type: 'auto', engine: '1.4 250 TSI' },
      { match: ['t-cross', 'tcross'], brand: 'Volkswagen', model: 'T-Cross', type: 'auto', engine: '1.0 200 TSI' },
      { match: ['ranger'], brand: 'Ford', model: 'Ranger', type: 'auto', engine: '3.2 TDCi Puma 5Cil' },
      { match: ['fiesta'], brand: 'Ford', model: 'Fiesta', type: 'auto', engine: '1.6 16V Sigma' },
      { match: ['focus'], brand: 'Ford', model: 'Focus', type: 'auto', engine: '2.0 Duratec GDI 16V' },
      { match: ['ecosport'], brand: 'Ford', model: 'Ecosport', type: 'auto', engine: '1.6 Rocam / 2.0 16V' },
      { match: ['ka'], brand: 'Ford', model: 'Ka', type: 'auto', engine: '1.5 12V Dragon' },
      { match: ['corsa'], brand: 'Chevrolet', model: 'Corsa', type: 'auto', engine: '1.6 8V MPFI' },
      { match: ['classic'], brand: 'Chevrolet', model: 'Classic', type: 'auto', engine: '1.4 8V Econoflex' },
      { match: ['onix'], brand: 'Chevrolet', model: 'Onix', type: 'auto', engine: '1.4 SPE/4 / 1.0T' },
      { match: ['cruze'], brand: 'Chevrolet', model: 'Cruze', type: 'auto', engine: '1.4T Ecotec Turbo 16V' },
      { match: ['tracker'], brand: 'Chevrolet', model: 'Tracker', type: 'auto', engine: '1.2T Turbo 3Cil' },
      { match: ['s10'], brand: 'Chevrolet', model: 'S10', type: 'auto', engine: '2.8 CTDI Duramax Turbo' },
      { match: ['cronos'], brand: 'Fiat', model: 'Cronos', type: 'auto', engine: '1.3 8V Firefly' },
      { match: ['palio'], brand: 'Fiat', model: 'Palio', type: 'auto', engine: '1.4 8V Fire' },
      { match: ['uno'], brand: 'Fiat', model: 'Uno', type: 'auto', engine: '1.4 8V Fire Evo' },
      { match: ['toro'], brand: 'Fiat', model: 'Toro', type: 'auto', engine: '2.0 Multijet 16V Turbo' },
      { match: ['fiorino'], brand: 'Fiat', model: 'Fiorino', type: 'auto', engine: '1.4 8V Fire' },
      { match: ['strada'], brand: 'Fiat', model: 'Strada', type: 'auto', engine: '1.3 Firefly / 1.4 Fire' },
      { match: ['clio'], brand: 'Renault', model: 'Clio', type: 'auto', engine: '1.2 16V D4F' },
      { match: ['kangoo'], brand: 'Renault', model: 'Kangoo', type: 'auto', engine: '1.6 16V SCe / 1.5 dCi' },
      { match: ['sandero'], brand: 'Renault', model: 'Sandero', type: 'auto', engine: '1.6 16V K4M / SCe' },
      { match: ['duster'], brand: 'Renault', model: 'Duster', type: 'auto', engine: '1.6 SCe / 1.3 TCe Turbo' },
      { match: ['logan'], brand: 'Renault', model: 'Logan', type: 'auto', engine: '1.6 16V SCe' },
      { match: ['master'], brand: 'Renault', model: 'Master', type: 'auto', engine: '2.3 dCi 16V Turbo' },
      { match: ['208'], brand: 'Peugeot', model: '208', type: 'auto', engine: '1.6 16V VTi' },
      { match: ['206'], brand: 'Peugeot', model: '206', type: 'auto', engine: '1.4 8V TU3JP' },
      { match: ['207'], brand: 'Peugeot', model: '207', type: 'auto', engine: '1.4 8V / 1.6 16V' },
      { match: ['308'], brand: 'Peugeot', model: '308', type: 'auto', engine: '1.6 THP Turbo / 2.0 16V' },
      { match: ['partner'], brand: 'Peugeot', model: 'Partner', type: 'auto', engine: '1.6 HDI Turbo / 1.6 16V' },
      { match: ['berlingo'], brand: 'Citroën', model: 'Berlingo', type: 'auto', engine: '1.6 HDI Turbo Diésel' },
      { match: ['c3'], brand: 'Citroën', model: 'C3', type: 'auto', engine: '1.6 16V VTi / 1.2 PureTech' },
      { match: ['c4'], brand: 'Citroën', model: 'C4', type: 'auto', engine: '1.6 THP / 2.0 16V' },
      { match: ['frontier'], brand: 'Nissan', model: 'Frontier', type: 'auto', engine: '2.3 Bi-Turbo Diésel' },
      { match: ['kicks'], brand: 'Nissan', model: 'Kicks', type: 'auto', engine: '1.6 16V HR16DE' },
      { match: ['renegade'], brand: 'Jeep', model: 'Renegade', type: 'auto', engine: '1.8 16V E.torQ / 1.3T' },
      { match: ['compass'], brand: 'Jeep', model: 'Compass', type: 'auto', engine: '1.3T Turbo T270' },
      { match: ['sprinter'], brand: 'Mercedes-Benz', model: 'Sprinter', type: 'auto', engine: '2.2 CDI OM651 Turbo' },

      // Motos
      { match: ['wave', 'wave 110'], brand: 'Honda', model: 'Wave 110S', type: 'moto', engine: '110cc OHC 4T' },
      { match: ['titan', 'cg 150'], brand: 'Honda', model: 'CG 150 Titan', type: 'moto', engine: '150cc OHC 4T' },
      { match: ['tornado', 'xr 250'], brand: 'Honda', model: 'XR 250 Tornado', type: 'moto', engine: '250cc DOHC 4T 6V' },
      { match: ['twister', 'cb 250'], brand: 'Honda', model: 'CB 250 Twister', type: 'moto', engine: '250cc OHC Inyección' },
      { match: ['xr 150'], brand: 'Honda', model: 'XR 150L', type: 'moto', engine: '150cc OHC 4T' },
      { match: ['glh 150', 'gaucha'], brand: 'Honda', model: 'GLH 150', type: 'moto', engine: '150cc Inyección' },
      { match: ['ybr 125', 'ybr'], brand: 'Yamaha', model: 'YBR 125', type: 'moto', engine: '125cc SOHC 4T' },
      { match: ['fz fi', 'fz 2.0', 'fz'], brand: 'Yamaha', model: 'FZ FI 2.0', type: 'moto', engine: '149cc Blue-Core' },
      { match: ['lander', 'xtz 250'], brand: 'Yamaha', model: 'XTZ 250 Lander', type: 'moto', engine: '250cc Inyección 4T' },
      { match: ['crypton'], brand: 'Yamaha', model: 'Crypton 110', type: 'moto', engine: '110cc 4T' },
      { match: ['blitz', 'blitz 110'], brand: 'Motomel', model: 'Blitz 110', type: 'moto', engine: '110cc Monocilíndrico 4T' },
      { match: ['skua 150', 'skua'], brand: 'Motomel', model: 'Skua 150', type: 'moto', engine: '150cc 4T Varillero' },
      { match: ['rouser 200', 'ns 200', 'rouser'], brand: 'Bajaj', model: 'Rouser NS 200', type: 'moto', engine: '199.5cc Triple Bujía 4V' },
      { match: ['dominar 400', 'dominar'], brand: 'Bajaj', model: 'Dominar 400', type: 'moto', engine: '373cc DOHC 4V' },
      { match: ['energy 110', 'energy'], brand: 'Corven', model: 'Energy 110', type: 'moto', engine: '110cc OHC 4T' },
      { match: ['triax 150', 'triax'], brand: 'Corven', model: 'Triax 150', type: 'moto', engine: '150cc 4T' },
      { match: ['smash 110', 'smash'], brand: 'Gilera', model: 'Smash 110', type: 'moto', engine: '110cc Monocilíndrico 4T' },
      { match: ['zb 110', 'zb'], brand: 'Zanella', model: 'ZB 110', type: 'moto', engine: '110cc 4T' },
      { match: ['ninja 400'], brand: 'Kawasaki', model: 'Ninja 400', type: 'moto', engine: '399cc Bicilíndrico DOHC' },
      { match: ['himalayan'], brand: 'Royal Enfield', model: 'Himalayan 411', type: 'moto', engine: '411cc LS410' },

      // Camiones
      { match: ['scania 113', '113 h/t', '113'], brand: 'Scania', model: '113 H/T', type: 'camion', engine: 'DS11 360 CV Turbo Intercooler' },
      { match: ['scania 124', 'r124'], brand: 'Scania', model: 'Serie 4 R124', type: 'camion', engine: 'DC12 420 CV 6Cil' },
      { match: ['scania g360', 'g360'], brand: 'Scania', model: 'G360', type: 'camion', engine: 'DC13 360 CV Euro 5' },
      { match: ['scania r450', 'r450'], brand: 'Scania', model: 'R450', type: 'camion', engine: 'DC13 450 CV Euro 5' },
      { match: ['mercedes 1114', '1114'], brand: 'Mercedes-Benz', model: '1114', type: 'camion', engine: 'OM 352 6Cil Diésel' },
      { match: ['mercedes 1620', '1620'], brand: 'Mercedes-Benz', model: '1620', type: 'camion', engine: 'OM 366 LA Turbo Intercooler' },
      { match: ['actros'], brand: 'Mercedes-Benz', model: 'Actros 2045', type: 'camion', engine: 'OM 471 6Cil en Línea' },
      { match: ['atego'], brand: 'Mercedes-Benz', model: 'Atego 1726', type: 'camion', engine: 'OM 926 LA 6Cil' },
      { match: ['accelo'], brand: 'Mercedes-Benz', model: 'Accelo 815', type: 'camion', engine: 'OM 924 LA 4Cil' },
      { match: ['daily', 'iveco daily'], brand: 'Iveco', model: 'Daily 55C16', type: 'camion', engine: 'F1C 3.0 HPI 160 CV' },
      { match: ['tector'], brand: 'Iveco', model: 'Tector 170E25', type: 'camion', engine: 'NEF 6 250 CV' },
      { match: ['stralis'], brand: 'Iveco', model: 'Stralis 460', type: 'camion', engine: 'Cursor 13 460 CV Euro 5' },
      { match: ['volvo fh', 'fh 460'], brand: 'Volvo', model: 'FH 460', type: 'camion', engine: 'D13C 460 CV Euro 5 Turbo' },
      { match: ['volvo vm', 'vm 330'], brand: 'Volvo', model: 'VM 330', type: 'camion', engine: 'MWM 7A 330 CV' },
      { match: ['constellation'], brand: 'Volkswagen', model: 'Constellation 19.320', type: 'camion', engine: 'Cummins ISC 320 CV' },
      { match: ['cargo 1722', 'ford cargo'], brand: 'Ford Camiones', model: 'Cargo 1722', type: 'camion', engine: 'Cummins 6CTAA 8.3 Turbo' }
    ];
  }

  /**
   * Analizador inteligente: extrae repuesto canónico, marca y modelo del texto libre
   */
  parseSearchIntent(query, explicitVehicle = {}) {
    const raw = (query || '').toLowerCase().trim();
    let detectedPart = null;
    let detectedVehicle = null;

    // 1. Detectar si el texto contiene una pieza específica
    for (const part of this.canonicalParts) {
      if (part.tokens.some((token) => raw.includes(token))) {
        detectedPart = part;
        break;
      }
    }

    // 2. Detectar si el texto contiene un vehículo conocido
    for (const veh of this.knownVehicles) {
      if (veh.match.some((m) => raw.includes(m))) {
        detectedVehicle = veh;
        break;
      }
    }

    // Unificar con los datos explícitos de los dropdowns si existen
    const finalBrand = explicitVehicle.brand || detectedVehicle?.brand || '';
    const finalModel = explicitVehicle.model || detectedVehicle?.model || '';
    const finalType = explicitVehicle.vehicleType || detectedVehicle?.type || 'auto';
    const finalYear = explicitVehicle.year || '';

    // Si el usuario no especificó una pieza pero sí un vehículo (ej: buscó "Hilux" o "Gol"),
    // asignamos la pieza principal (Radiador) y marcamos que es una búsqueda multirre-puesto
    const isVehicleOnlySearch = !detectedPart && (detectedVehicle || explicitVehicle.brand || explicitVehicle.model);
    
    const finalPart = detectedPart || this.canonicalParts[0]; // Por defecto Radiador

    return {
      isVehicleOnlySearch,
      canonicalPart: finalPart,
      vehicleBrand: finalBrand,
      model: finalModel,
      vehicleType: finalType,
      year: finalYear,
      engineSpec: detectedVehicle?.engine || ''
    };
  }

  detectCanonicalPart(query) {
    const q = (query || '').toLowerCase().trim();
    for (const part of this.canonicalParts) {
      if (part.tokens.some((token) => q.includes(token))) {
        return part;
      }
    }
    return {
      canonicalName: q ? q.charAt(0).toUpperCase() + q.slice(1) : 'Repuesto Automotor',
      category: 'general',
      defaultBrands: ['OEM Homologado', 'Valeo', 'Bosch', 'Mahle']
    };
  }

  formatStandardTitle({ partName, partBrand, vehicleBrand, model, year, condition, engineSpec }) {
    const brandClean = vehicleBrand ? vehicleBrand.charAt(0).toUpperCase() + vehicleBrand.slice(1) : '';
    const modelClean = model || '';
    const yearClean = year ? `(${year})` : '';
    const engineStr = engineSpec ? `[Motor ${engineSpec}]` : '';
    const condStr = condition === 'reacondicionado' ? '[Reacondicionado Certificado]' : '';

    return `${partName} ${partBrand} ${condStr} Para ${brandClean} ${modelClean} ${engineStr} ${yearClean}`
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const titleNormalizer = new TitleNormalizerService();
