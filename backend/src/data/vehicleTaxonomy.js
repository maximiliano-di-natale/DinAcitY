// Catálogo exhaustivo de vehículos y repuestos para DinAcitY
// Incluye todo el parque automotor de Argentina y la región de Mendoza

export const VEHICLE_TAXONOMY = {
  auto: {
    name: 'Autos y Utilitarios',
    icon: 'Car',
    brands: [
      {
        id: 'toyota',
        name: 'Toyota',
        models: ['Hilux', 'Corolla', 'Etios', 'Yaris', 'SW4', 'Corolla Cross', 'Rav4', 'Hiace', 'Land Cruiser']
      },
      {
        id: 'volkswagen',
        name: 'Volkswagen',
        models: ['Gol', 'Gol Trend', 'Amarok', 'Bora', 'Vento', 'Suran', 'Fox', 'Polo', 'Taos', 'T-Cross', 'Saveiro', 'Virtus', 'Nivus', 'Up!', 'Passat']
      },
      {
        id: 'ford',
        name: 'Ford',
        models: ['Ranger', 'Fiesta', 'Focus', 'Ecosport', 'Ka', 'F-100', 'Territory', 'Kuga', 'Maverick', 'Transit', 'Mondeo']
      },
      {
        id: 'chevrolet',
        name: 'Chevrolet',
        models: ['Corsa', 'Classic', 'Onix', 'Cruze', 'Tracker', 'S10', 'Prisma', 'Spin', 'Agile', 'Aveo', 'Montana', 'Meriva', 'Equinox']
      },
      {
        id: 'fiat',
        name: 'Fiat',
        models: ['Cronos', 'Palio', 'Uno', 'Toro', 'Siena', 'Punto', 'Fiorino', 'Strada', 'Mobi', 'Pulse', 'Fastback', 'Argo', 'Ducato', 'Doblò']
      },
      {
        id: 'renault',
        name: 'Renault',
        models: ['Clio', 'Kangoo', 'Sandero', 'Duster', 'Logan', 'Master', 'Oroch', 'Stepway', 'Fluence', 'Kwid', 'Captur', 'Alaskan', 'Megane']
      },
      {
        id: 'peugeot',
        name: 'Peugeot',
        models: ['206', '207', '208', '308', '408', 'Partner', '2008', '3008', 'Expert', 'Boxer', '508']
      },
      {
        id: 'citroen',
        name: 'Citroën',
        models: ['Berlingo', 'C3', 'C4', 'C4 Cactus', 'C4 Lounge', 'Aircross', 'Jumpy', 'Jumper', 'C-Elysée']
      },
      {
        id: 'nissan',
        name: 'Nissan',
        models: ['Frontier', 'Versa', 'Kicks', 'Sentra', 'March', 'Tiida', 'Note', 'X-Trail']
      },
      {
        id: 'jeep',
        name: 'Jeep',
        models: ['Renegade', 'Compass', 'Commander', 'Grand Cherokee', 'Wrangler']
      },
      {
        id: 'honda-autos',
        name: 'Honda (Autos)',
        models: ['Civic', 'Fit', 'City', 'HR-V', 'CR-V', 'WR-V', 'Accord']
      },
      {
        id: 'hyundai',
        name: 'Hyundai',
        models: ['Creta', 'Tucson', 'Santa Fe', 'HB20', 'i10', 'H1']
      },
      {
        id: 'kia',
        name: 'Kia',
        models: ['Seltos', 'Sportage', 'Cerato', 'Rio', 'Carnival', 'Picanto']
      },
      {
        id: 'ram',
        name: 'RAM',
        models: ['1500', 'Rampage', '2500']
      },
      {
        id: 'mercedes-benz-autos',
        name: 'Mercedes-Benz (Autos y Vans)',
        models: ['Sprinter', 'Clase A', 'Clase C', 'Clase E', 'Vito', 'GLA', 'GLC']
      },
      {
        id: 'audi',
        name: 'Audi',
        models: ['A1', 'A3', 'A4', 'A5', 'Q3', 'Q5', 'Q7']
      },
      {
        id: 'bmw',
        name: 'BMW',
        models: ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5']
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
        models: ['Wave 110S', 'CG 150 Titan', 'XR 150L', 'XR 250 Tornado', 'CB 250 Twister', 'CB 190R', 'GLH 150', 'XR 190L', 'CB300F Twister', 'Falcon 400', 'Biz 125']
      },
      {
        id: 'yamaha',
        name: 'Yamaha',
        models: ['YBR 125', 'FZ FI 2.0', 'FZ25', 'XTZ 125', 'XTZ 250 Lander', 'MT-03', 'Crypton 110', 'Ray ZR 125', 'R3']
      },
      {
        id: 'motomel',
        name: 'Motomel',
        models: ['Blitz 110', 'Skua 150', 'Skua 250', 'Sirius 190', 'S2 150', 'Strato 150', 'Custom 150']
      },
      {
        id: 'bajaj',
        name: 'Bajaj',
        models: ['Rouser NS 200', 'Rouser NS 160', 'Rouser NS 125', 'Dominar 400', 'Dominar 250', 'Boxer 150']
      },
      {
        id: 'corven',
        name: 'Corven',
        models: ['Energy 110', 'Triax 150', 'Triax 250', 'Hunter 150', 'Mirage 110', 'Touring 250']
      },
      {
        id: 'zanella',
        name: 'Zanella',
        models: ['ZB 110', 'RX 150', 'ZR 150', 'ZR 250', 'Styler 150', 'Ceccato 60', 'Patagonian Eagle']
      },
      {
        id: 'gilera',
        name: 'Gilera',
        models: ['Smash 110', 'Sahel 150', 'VC 150', 'SMX 200', 'SMX 250']
      },
      {
        id: 'mondial',
        name: 'Mondial',
        models: ['LD 110', 'MD 125', 'RD 150', 'HD 250']
      },
      {
        id: 'kawasaki',
        name: 'Kawasaki',
        models: ['Ninja 400', 'Z400', 'Versys 300', 'KLR 650', 'KLX 300']
      },
      {
        id: 'suzuki',
        name: 'Suzuki',
        models: ['GN 125', 'AX 100', 'Gixxer 150', 'V-Strom 650']
      },
      {
        id: 'benelli',
        name: 'Benelli',
        models: ['TNT 15', 'TNT 25', '302S', 'TRK 502', 'Leoncino 500']
      },
      {
        id: 'royal-enfield',
        name: 'Royal Enfield',
        models: ['Himalayan 411', 'Hunter 350', 'Meteor 350', 'Classic 350', 'Interceptor 650']
      },
      {
        id: 'ktm',
        name: 'KTM',
        models: ['Duke 200', 'Duke 250', 'Duke 390', 'Adventure 390', 'RC 200']
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
        models: ['113 H/T', 'Serie 4 R124', 'G360', 'R410', 'R450', 'P340', 'G410', 'R500', 'P310']
      },
      {
        id: 'mercedes-benz-camiones',
        name: 'Mercedes-Benz (Camiones)',
        models: ['1114', '1620', '1634', '1938', 'Actros 2045', 'Actros 2548', 'Axor 2035', 'Atego 1726', 'Atego 1729', 'Accelo 815', 'Accelo 1016']
      },
      {
        id: 'iveco',
        name: 'Iveco',
        models: ['Daily 55C16', 'Daily 70C17', 'Stralis 460', 'Tector 170E25', 'Tector 170E28', 'Hi-Way 480', 'Eurocargo', 'Cursor']
      },
      {
        id: 'volvo',
        name: 'Volvo',
        models: ['FH 460', 'FH 540', 'VM 330', 'VM 270', 'FM 370', 'FMX']
      },
      {
        id: 'volkswagen-camiones',
        name: 'Volkswagen (Camiones)',
        models: ['Constellation 19.320', 'Constellation 17.280', 'Delivery 9.170', 'Delivery 11.180', 'Meteor 28.460']
      },
      {
        id: 'ford-camiones',
        name: 'Ford Camiones',
        models: ['Cargo 1722', 'Cargo 915', 'Cargo 1932', 'Cargo 2042', 'Cargo 1729', 'F-4000']
      },
      {
        id: 'agrale',
        name: 'Agrale',
        models: ['A8700', 'MA 15.0', 'MT 12.0']
      }
    ]
  }
};

export const PART_CATEGORIES = [
  {
    id: 'refrigeracion',
    name: 'Refrigeración',
    description: 'Radiadores de agua, termostatos, electroventiladores y bombas de agua',
    icon: 'ThermometerSnowflake',
    popularItems: ['Radiador de Agua de Motor', 'Termostato con Caja y Pipeta', 'Electroventilador Completo', 'Bomba de Agua']
  },
  {
    id: 'frenos',
    name: 'Frenos',
    description: 'Pastillas de freno, discos ventilados, cintas y bombas',
    icon: 'Disc',
    popularItems: ['Juego de Pastillas de Freno Delanteras', 'Juego de Discos de Freno Ventilados', 'Bomba de Freno']
  },
  {
    id: 'motor',
    name: 'Motor y Distribución',
    description: 'Kits de distribución, correas, filtros, bujías y juntas',
    icon: 'Gauge',
    popularItems: ['Kit de Distribución (Correa + Tensor)', 'Filtro de Aceite de Motor', 'Filtro de Aire', 'Bujías de Encendido']
  },
  {
    id: 'suspension',
    name: 'Suspensión y Dirección',
    description: 'Amortiguadores delanteros/traseros, cazoletas, extremos y rótulas',
    icon: 'Activity',
    popularItems: ['Juego de Amortiguadores Delanteros', 'Amortiguadores Traseros', 'Extremos de Dirección', 'Rótulas']
  },
  {
    id: 'embrague',
    name: 'Embrague y Transmisión',
    description: 'Kits de embrague completos (placa, disco y crapodina)',
    icon: 'Cog',
    popularItems: ['Kit de Embrague (Placa, Disco y Crapodina)', 'Cable de Embrague', 'Bombín de Embrague']
  },
  {
    id: 'electricidad',
    name: 'Electricidad e Iluminación',
    description: 'Alternadores, motores de arranque, ópticas y faros',
    icon: 'Zap',
    popularItems: ['Alternador', 'Motor de Arranque', 'Óptica Delantera Principal', 'Faro Trasero']
  }
];

export const YEARS_LIST = Array.from({ length: 32 }, (_, i) => 2026 - i);
