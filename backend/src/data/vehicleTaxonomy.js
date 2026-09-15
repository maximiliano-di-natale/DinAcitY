// Catálogo taxonómico de vehículos y categorías de repuestos automotores para DinAcitY

export const VEHICLE_TAXONOMY = {
  auto: {
    name: 'Autos y Utilitarios',
    icon: 'Car',
    brands: [
      {
        id: 'volkswagen',
        name: 'Volkswagen',
        models: ['Gol', 'Gol Trend', 'Amarok', 'Bora', 'Vento', 'Suran', 'Fox', 'Polo']
      },
      {
        id: 'ford',
        name: 'Ford',
        models: ['Ranger', 'Fiesta', 'Focus', 'Ecosport', 'Ka', 'F-100']
      },
      {
        id: 'chevrolet',
        name: 'Chevrolet',
        models: ['Corsa', 'Onix', 'Cruze', 'Tracker', 'S10', 'Prisma', 'Spin']
      },
      {
        id: 'toyota',
        name: 'Toyota',
        models: ['Hilux', 'Corolla', 'Etios', 'Yaris', 'SW4', 'Rav4']
      },
      {
        id: 'fiat',
        name: 'Fiat',
        models: ['Cronos', 'Palio', 'Uno', 'Toro', 'Siena', 'Punto', 'Fiorino']
      },
      {
        id: 'renault',
        name: 'Renault',
        models: ['Clio', 'Kangoo', 'Sandero', 'Duster', 'Logan', 'Master', 'Oroch']
      },
      {
        id: 'peugeot',
        name: 'Peugeot',
        models: ['206', '207', '208', '308', 'Partner', '408', '2008']
      }
    ]
  },
  moto: {
    name: 'Motos y Scooters',
    icon: 'Bike',
    brands: [
      {
        id: 'honda',
        name: 'Honda',
        models: ['Wave 110S', 'CG 150 Titan', 'XR 150L', 'XR 250 Tornado', 'CB 250 Twister', 'CB 190R', 'GLH 150']
      },
      {
        id: 'yamaha',
        name: 'Yamaha',
        models: ['YBR 125', 'FZ FI 2.0', 'XTZ 125', 'XTZ 250 Lander', 'MT-03', 'Crypton 110']
      },
      {
        id: 'motomel',
        name: 'Motomel',
        models: ['Blitz 110', 'Skua 150', 'Skua 250', 'Sirius 190', 'S2 150']
      },
      {
        id: 'bajaj',
        name: 'Bajaj',
        models: ['Rouser NS 200', 'Rouser NS 160', 'Dominar 400', 'Boxer 150', 'Rouser 125']
      },
      {
        id: 'gilera',
        name: 'Gilera',
        models: ['Smash 110', 'Sahel 150', 'VC 150', 'SMX 200']
      }
    ]
  },
  camion: {
    name: 'Camiones y Pesados',
    icon: 'Truck',
    brands: [
      {
        id: 'scania',
        name: 'Scania',
        models: ['113 H/T', 'Serie 4 R124', 'G360', 'R410', 'R450', 'P340', 'G410']
      },
      {
        id: 'mercedes-benz',
        name: 'Mercedes-Benz',
        models: ['1114', '1620', 'Actros 2045', 'Axor 2035', 'Atego 1726', 'Accelo 815', 'Sprinter']
      },
      {
        id: 'iveco',
        name: 'Iveco',
        models: ['Daily 55C16', 'Stralis 460', 'Tector 170E25', 'Eurocargo', 'Hi-Way 480']
      },
      {
        id: 'volvo',
        name: 'Volvo',
        models: ['FH 460', 'FH 540', 'VM 330', 'FM 370', 'FMX']
      },
      {
        id: 'ford-camiones',
        name: 'Ford Camiones',
        models: ['Cargo 1722', 'Cargo 915', 'Cargo 1932', 'Cargo 2042']
      }
    ]
  }
};

export const PART_CATEGORIES = [
  {
    id: 'refrigeracion',
    name: 'Refrigeración',
    description: 'Radiadores, termostatos, electroventiladores y bombas de agua',
    icon: 'ThermometerSnowflake',
    popularItems: ['Radiador de Agua', 'Termostato', 'Electroventilador', 'Bomba de Agua', 'Depósito de Expansión', 'Manguera de Radiador']
  },
  {
    id: 'frenos',
    name: 'Frenos',
    description: 'Pastillas, discos, cintas, campanas y bombas de freno',
    icon: 'Disc',
    popularItems: ['Pastillas de Freno Delanteras', 'Discos de Freno Ventilados', 'Bomba de Freno', 'Kit Cintas y Campanas']
  },
  {
    id: 'motor',
    name: 'Motor y Distribución',
    description: 'Kits de distribución, correas, filtros, bujías y juntas',
    icon: 'Gauge',
    popularItems: ['Kit Distribución + Bomba', 'Filtro de Aceite', 'Filtro de Aire', 'Bujías de Encendido', 'Junta de Tapa de Cilindros']
  },
  {
    id: 'suspension',
    name: 'Suspensión y Dirección',
    description: 'Amortiguadores, cazoletas, extremos, rótulas y parrillas',
    icon: 'Activity',
    popularItems: ['Juego Amortiguadores Delanteros', 'Amortiguador Trasero', 'Extremo de Dirección', 'Rótula Inferior', 'Parrilla de Suspensión']
  },
  {
    id: 'embrague',
    name: 'Embrague y Transmisión',
    description: 'Kits de embrague, placas, discos y crapodinas',
    icon: 'Cog',
    popularItems: ['Kit de Embrague (Placa, Disco y Crapodina)', 'Cable de Embrague', 'Bombín de Embrague']
  },
  {
    id: 'electricidad',
    name: 'Electricidad e Iluminación',
    description: 'Alternadores, arranques, ópticas, faros y baterías',
    icon: 'Zap',
    popularItems: ['Alternador', 'Motor de Arranque', 'Óptica Delantera', 'Faro Trasero', 'Batería 12V']
  }
];

export const YEARS_LIST = Array.from({ length: 30 }, (_, i) => 2026 - i);
