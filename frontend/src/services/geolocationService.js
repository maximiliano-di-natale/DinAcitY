// Servicio de Geolocalización para toda la República Argentina
// Incluye cálculo de distancia Haversine, detección GPS, reverse geocoding y catálogo de provincias/ciudades

export const ARGENTINA_PROVINCES = [
  {
    id: 'caba',
    name: 'Ciudad Autónoma de Buenos Aires (CABA)',
    shortName: 'CABA',
    inspectionType: 'VTV',
    inspectionFullName: 'Verificación Técnica Vehicular (CABA)',
    inspectionUrl: 'https://www.buenosaires.gob.ar/tramites/vtv',
    lat: -34.6037,
    lng: -58.3816,
    cities: [
      { name: 'Villa Crespo (Polo Warnes)', lat: -34.5989, lng: -58.4418, cp: '1414' },
      { name: 'Palermo', lat: -34.5883, lng: -58.4305, cp: '1425' },
      { name: 'Belgrano', lat: -34.5627, lng: -58.4564, cp: '1428' },
      { name: 'Caballito', lat: -34.6186, lng: -58.4438, cp: '1405' },
      { name: 'Flores', lat: -34.6289, lng: -58.4633, cp: '1406' },
      { name: 'Microcentro / Retiro', lat: -34.5997, lng: -58.3756, cp: '1001' },
      { name: 'Barracas / La Boca', lat: -34.6416, lng: -58.3725, cp: '1270' },
      { name: 'Devoto / Villa Urquiza', lat: -34.5816, lng: -58.5002, cp: '1419' }
    ]
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires (PBA / GBA)',
    shortName: 'Buenos Aires',
    inspectionType: 'VTV',
    inspectionFullName: 'Verificación Técnica Vehicular (PBA)',
    inspectionUrl: 'https://vtvpba.minfra.gba.gob.ar/',
    lat: -34.9214,
    lng: -57.9545,
    cities: [
      { name: 'San Martín (GBA Norte)', lat: -34.5768, lng: -58.5369, cp: '1650' },
      { name: 'Vicente López / Olivos', lat: -34.5247, lng: -58.4906, cp: '1636' },
      { name: 'San Isidro', lat: -34.4728, lng: -58.5284, cp: '1642' },
      { name: 'Pilar', lat: -34.4589, lng: -58.9142, cp: '1629' },
      { name: 'Ramos Mejía / Morón (GBA Oeste)', lat: -34.6542, lng: -58.5661, cp: '1704' },
      { name: 'San Justo (La Matanza)', lat: -34.6833, lng: -58.5583, cp: '1754' },
      { name: 'Avellaneda / Lanús (GBA Sur)', lat: -34.6619, lng: -58.3653, cp: '1870' },
      { name: 'Quilmes', lat: -34.7242, lng: -58.2608, cp: '1878' },
      { name: 'Lomas de Zamora', lat: -34.7597, lng: -58.4019, cp: '1832' },
      { name: 'La Plata', lat: -34.9214, lng: -57.9545, cp: '1900' },
      { name: 'Mar del Plata', lat: -38.0055, lng: -57.5560, cp: '7600' },
      { name: 'Bahía Blanca', lat: -38.7183, lng: -62.2663, cp: '8000' },
      { name: 'Tandil', lat: -37.3217, lng: -59.1332, cp: '7000' }
    ]
  },
  {
    id: 'cordoba',
    name: 'Córdoba',
    shortName: 'Córdoba',
    inspectionType: 'ITV',
    inspectionFullName: 'Inspección Técnica Vehicular (Córdoba)',
    inspectionUrl: 'https://itvcordoba.com.ar/',
    lat: -31.4201,
    lng: -64.1888,
    cities: [
      { name: 'Córdoba Capital (Polo Av. Las Heras / Centro)', lat: -31.4135, lng: -64.1811, cp: '5000' },
      { name: 'Córdoba (Av. Colón / San Vicente)', lat: -31.4050, lng: -64.2150, cp: '5003' },
      { name: 'Villa Carlos Paz', lat: -31.4241, lng: -64.4978, cp: '5152' },
      { name: 'Río Cuarto', lat: -33.1307, lng: -64.3499, cp: '5800' },
      { name: 'Villa María', lat: -32.4075, lng: -63.2403, cp: '5900' },
      { name: 'San Francisco', lat: -31.4279, lng: -62.0827, cp: '2400' }
    ]
  },
  {
    id: 'santa-fe',
    name: 'Santa Fe',
    shortName: 'Santa Fe',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Santa Fe)',
    inspectionUrl: 'https://www.santafe.gob.ar/index.php/tramites/modulotramite/index/208579',
    lat: -31.6333,
    lng: -60.7000,
    cities: [
      { name: 'Rosario (Polo Echesortu / Av. San Martín)', lat: -32.9587, lng: -60.6505, cp: '2000' },
      { name: 'Rosario (Circunvalación / Pellegrini)', lat: -32.9690, lng: -60.6720, cp: '2000' },
      { name: 'Santa Fe Capital', lat: -31.6333, lng: -60.7000, cp: '3000' },
      { name: 'Rafaela', lat: -31.2503, lng: -61.4867, cp: '2300' },
      { name: 'Venado Tuerto', lat: -33.7456, lng: -61.9688, cp: '2600' }
    ]
  },
  {
    id: 'mendoza',
    name: 'Mendoza',
    shortName: 'Mendoza',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Mendoza)',
    inspectionUrl: 'https://rto.mendoza.gov.ar/',
    lat: -32.8895,
    lng: -68.8458,
    cities: [
      { name: 'Godoy Cruz (Polo Rodríguez Peña / San Martín Sur)', lat: -32.9250, lng: -68.8400, cp: '5501' },
      { name: 'Ciudad de Mendoza (Capital)', lat: -32.8908, lng: -68.8272, cp: '5500' },
      { name: 'Guaymallén (Acceso Este / San José)', lat: -32.8980, lng: -68.8150, cp: '5519' },
      { name: 'Maipú (Rodríguez Peña Este)', lat: -32.9800, lng: -68.7800, cp: '5515' },
      { name: 'Las Heras', lat: -32.8480, lng: -68.8230, cp: '5539' },
      { name: 'San Rafael', lat: -34.6177, lng: -68.3301, cp: '5600' }
    ]
  },
  {
    id: 'tucuman',
    name: 'Tucumán',
    shortName: 'Tucumán',
    inspectionType: 'VTV',
    inspectionFullName: 'Verificación Técnica Vehicular (Tucumán)',
    inspectionUrl: 'https://vtvtucuman.com.ar/',
    lat: -26.8083,
    lng: -65.2176,
    cities: [
      { name: 'San Miguel de Tucumán (Av. Avellaneda / Centro)', lat: -26.8241, lng: -65.2226, cp: '4000' },
      { name: 'Yerba Buena', lat: -26.8170, lng: -65.3160, cp: '4107' },
      { name: 'Concepción', lat: -27.3450, lng: -65.5930, cp: '4146' }
    ]
  },
  {
    id: 'salta',
    name: 'Salta',
    shortName: 'Salta',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Salta)',
    inspectionUrl: 'https://municipalidadsalta.gob.ar/tramites/revision-tecnica-obligatoria/',
    lat: -24.7859,
    lng: -65.4117,
    cities: [
      { name: 'Salta Capital (Av. Chile / Centro)', lat: -24.7859, lng: -65.4117, cp: '4400' },
      { name: 'San Ramón de la Nueva Orán', lat: -23.1322, lng: -64.3260, cp: '4530' }
    ]
  },
  {
    id: 'entre-rios',
    name: 'Entre Ríos',
    shortName: 'Entre Ríos',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Entre Ríos)',
    inspectionUrl: 'https://www.entrerios.gov.ar',
    lat: -31.7333,
    lng: -60.5333,
    cities: [
      { name: 'Paraná', lat: -31.7333, lng: -60.5333, cp: '3100' },
      { name: 'Concordia', lat: -31.3929, lng: -58.0209, cp: '3200' },
      { name: 'Gualeguaychú', lat: -33.0094, lng: -58.5172, cp: '2820' }
    ]
  },
  {
    id: 'neuquen',
    name: 'Neuquén',
    shortName: 'Neuquén',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Neuquén)',
    inspectionUrl: 'https://www.neuquencapital.gov.ar',
    lat: -38.9516,
    lng: -68.0591,
    cities: [
      { name: 'Neuquén Capital (Ruta 22 / Centro)', lat: -38.9516, lng: -68.0591, cp: '8300' },
      { name: 'Cipolletti (Alto Valle)', lat: -38.9392, lng: -67.9944, cp: '8324' },
      { name: 'San Martín de los Andes', lat: -40.1574, lng: -71.3533, cp: '8370' }
    ]
  },
  {
    id: 'san-juan',
    name: 'San Juan',
    shortName: 'San Juan',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (San Juan)',
    inspectionUrl: 'https://transporte.sanjuan.gob.ar/rto',
    lat: -31.5375,
    lng: -68.5364,
    cities: [
      { name: 'San Juan Capital (Av. Rawson / Centro)', lat: -31.5375, lng: -68.5364, cp: '5400' },
      { name: 'Rawson', lat: -31.5670, lng: -68.5200, cp: '5425' },
      { name: 'Rivadavia', lat: -31.5300, lng: -68.5800, cp: '5407' }
    ]
  },
  {
    id: 'chaco',
    name: 'Chaco',
    shortName: 'Chaco',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Chaco)',
    inspectionUrl: 'https://resistencia.gob.ar',
    lat: -27.4514,
    lng: -58.9867,
    cities: [
      { name: 'Resistencia (Av. 25 de Mayo)', lat: -27.4514, lng: -58.9867, cp: '3500' },
      { name: 'Presidencia Roque Sáenz Peña', lat: -26.7852, lng: -60.4388, cp: '3700' }
    ]
  },
  {
    id: 'corrientes',
    name: 'Corrientes',
    shortName: 'Corrientes',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Corrientes)',
    inspectionUrl: 'https://ciudaddecorrientes.gov.ar',
    lat: -27.4692,
    lng: -58.8306,
    cities: [
      { name: 'Corrientes Capital (Av. 3 de Abril)', lat: -27.4692, lng: -58.8306, cp: '3400' },
      { name: 'Goya', lat: -29.1442, lng: -59.2638, cp: '3450' }
    ]
  },
  {
    id: 'misiones',
    name: 'Misiones',
    shortName: 'Misiones',
    inspectionType: 'VTV',
    inspectionFullName: 'Verificación Técnica Vehicular (Misiones)',
    inspectionUrl: 'https://posadas.gov.ar',
    lat: -27.3671,
    lng: -55.8961,
    cities: [
      { name: 'Posadas', lat: -27.3671, lng: -55.8961, cp: '3300' },
      { name: 'Oberá', lat: -27.4847, lng: -55.1228, cp: '3360' },
      { name: 'Puerto Iguazú', lat: -25.5991, lng: -54.5735, cp: '3370' }
    ]
  },
  {
    id: 'san-luis',
    name: 'San Luis',
    shortName: 'San Luis',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (San Luis)',
    inspectionUrl: 'https://sanluis.gov.ar',
    lat: -33.3017,
    lng: -66.3378,
    cities: [
      { name: 'San Luis Capital (Av. España / Centro)', lat: -33.3017, lng: -66.3378, cp: '5700' },
      { name: 'Villa Mercedes', lat: -33.6757, lng: -65.4578, cp: '5730' }
    ]
  },
  {
    id: 'rio-negro',
    name: 'Río Negro',
    shortName: 'Río Negro',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Río Negro)',
    inspectionUrl: 'https://rionegro.gov.ar',
    lat: -40.8135,
    lng: -62.9967,
    cities: [
      { name: 'San Carlos de Bariloche', lat: -41.1335, lng: -71.3103, cp: '8400' },
      { name: 'General Roca', lat: -39.0267, lng: -67.5756, cp: '8332' },
      { name: 'Viedma', lat: -40.8135, lng: -62.9967, cp: '8500' }
    ]
  },
  {
    id: 'chubut',
    name: 'Chubut',
    shortName: 'Chubut',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Chubut)',
    inspectionUrl: 'https://chubut.gov.ar',
    lat: -43.3002,
    lng: -65.1023,
    cities: [
      { name: 'Comodoro Rivadavia', lat: -45.8641, lng: -67.4966, cp: '9000' },
      { name: 'Trelew', lat: -43.2490, lng: -65.3051, cp: '9100' },
      { name: 'Puerto Madryn', lat: -42.7692, lng: -65.0385, cp: '9120' }
    ]
  },
  {
    id: 'jujuy',
    name: 'Jujuy',
    shortName: 'Jujuy',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Jujuy)',
    inspectionUrl: 'https://sansalvadordejujuy.gob.ar',
    lat: -24.1858,
    lng: -65.2995,
    cities: [
      { name: 'San Salvador de Jujuy', lat: -24.1858, lng: -65.2995, cp: '4600' },
      { name: 'Palpalá', lat: -24.2567, lng: -65.2117, cp: '4612' }
    ]
  },
  {
    id: 'santiago-del-estero',
    name: 'Santiago del Estero',
    shortName: 'Santiago del Estero',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Santiago del Estero)',
    inspectionUrl: 'https://santiagociudad.gov.ar',
    lat: -27.7951,
    lng: -64.2615,
    cities: [
      { name: 'Santiago del Estero Capital', lat: -27.7951, lng: -64.2615, cp: '4200' },
      { name: 'La Banda', lat: -27.7333, lng: -64.2500, cp: '4300' }
    ]
  },
  {
    id: 'catamarca',
    name: 'Catamarca',
    shortName: 'Catamarca',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Catamarca)',
    inspectionUrl: 'https://catamarcaciudad.gob.ar',
    lat: -28.4696,
    lng: -65.7852,
    cities: [
      { name: 'San Fernando del Valle de Catamarca', lat: -28.4696, lng: -65.7852, cp: '4700' }
    ]
  },
  {
    id: 'la-rioja',
    name: 'La Rioja',
    shortName: 'La Rioja',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (La Rioja)',
    inspectionUrl: 'https://municipiolarioja.gob.ar',
    lat: -29.4135,
    lng: -66.8565,
    cities: [
      { name: 'La Rioja Capital', lat: -29.4135, lng: -66.8565, cp: '5300' }
    ]
  },
  {
    id: 'la-pampa',
    name: 'La Pampa',
    shortName: 'La Pampa',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (La Pampa)',
    inspectionUrl: 'https://santarosa.gob.ar',
    lat: -36.6167,
    lng: -64.2833,
    cities: [
      { name: 'Santa Rosa', lat: -36.6167, lng: -64.2833, cp: '6300' },
      { name: 'General Pico', lat: -35.6566, lng: -63.7568, cp: '6360' }
    ]
  },
  {
    id: 'santa-cruz',
    name: 'Santa Cruz',
    shortName: 'Santa Cruz',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Santa Cruz)',
    inspectionUrl: 'https://riogallegos.gov.ar',
    lat: -51.6226,
    lng: -69.2181,
    cities: [
      { name: 'Río Gallegos', lat: -51.6226, lng: -69.2181, cp: '9400' },
      { name: 'Caleta Olivia', lat: -46.4389, lng: -67.5281, cp: '9011' }
    ]
  },
  {
    id: 'tierra-del-fuego',
    name: 'Tierra del Fuego',
    shortName: 'Tierra del Fuego',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Tierra del Fuego)',
    inspectionUrl: 'https://ushuaia.gob.ar',
    lat: -54.8019,
    lng: -68.3030,
    cities: [
      { name: 'Ushuaia', lat: -54.8019, lng: -68.3030, cp: '9410' },
      { name: 'Río Grande', lat: -53.7877, lng: -67.7094, cp: '9420' }
    ]
  },
  {
    id: 'formosa',
    name: 'Formosa',
    shortName: 'Formosa',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Formosa)',
    inspectionUrl: 'https://formosatuciudad.gob.ar',
    lat: -26.1775,
    lng: -58.1781,
    cities: [
      { name: 'Formosa Capital', lat: -26.1775, lng: -58.1781, cp: '3600' }
    ]
  }
];

// Ubicación predeterminada inicial (Polo Warnes, CABA / Argentina)
export const DEFAULT_USER_LOCATION = {
  provinceId: 'caba',
  provinceName: 'Ciudad Autónoma de Buenos Aires (CABA)',
  cityName: 'Villa Crespo (Polo Warnes)',
  cp: '1414',
  lat: -34.5989,
  lng: -58.4418, // Villa Crespo Warnes
  isGps: false,
  accuracy: null,
  displayName: 'Villa Crespo (Polo Warnes), CABA'
};

const STORAGE_KEY = 'dinacity_user_location';

/**
 * Fórmula de Haversine para calcular distancia en kilómetros entre dos coordenadas
 */
export function calcDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal
}

/**
 * Formatear distancia para mostrar al usuario
 */
export function formatDistance(distanceKm) {
  if (distanceKm == null) return null;
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `a ${meters} m de vos`;
  }
  return `a ${distanceKm.toLocaleString('es-AR')} km de vos`;
}

/**
 * Obtener la ubicación guardada en localStorage o la predeterminada
 */
export function getSavedUserLocation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.cityName && parsed.lat && parsed.lng) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error leyendo dinacity_user_location:', e);
  }
  return DEFAULT_USER_LOCATION;
}

/**
 * Guardar la ubicación en localStorage
 */
export function saveUserLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch (e) {
    console.warn('Error guardando dinacity_user_location:', e);
  }
}

/**
 * Encuentra la ciudad más cercana en nuestro catálogo según coordenadas
 */
export function findClosestCity(lat, lng) {
  let closest = null;
  let minDistance = Infinity;
  let provinceMatch = null;

  for (const prov of ARGENTINA_PROVINCES) {
    for (const city of prov.cities) {
      const d = calcDistanceKm(lat, lng, city.lat, city.lng);
      if (d < minDistance) {
        minDistance = d;
        closest = city;
        provinceMatch = prov;
      }
    }
  }

  return { city: closest, province: provinceMatch, distance: minDistance };
}

/**
 * Solicitar ubicación GPS nativa del navegador con geocodificación inversa
 */
export async function requestGpsLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La geolocalización no está soportada en este navegador.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        let cityName = '';
        let provinceName = '';
        let provinceId = 'buenos-aires';
        let cp = '';

        // Intentar geocodificación inversa con Nominatim de OpenStreetMap (con timeout de 4s)
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              signal: controller.signal,
              headers: {
                'Accept-Language': 'es'
              }
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            
            cityName =
              addr.city ||
              addr.town ||
              addr.suburb ||
              addr.neighbourhood ||
              addr.municipality ||
              addr.county ||
              '';

            provinceName = addr.state || '';
            cp = addr.postcode || '';

            // Mapear provincia devuelta a una de nuestro catálogo
            const normState = (provinceName || '').toLowerCase();
            const match = ARGENTINA_PROVINCES.find((p) =>
              normState.includes(p.shortName.toLowerCase()) ||
              p.name.toLowerCase().includes(normState)
            );
            if (match) {
              provinceId = match.id;
              provinceName = match.name;
            }
          }
        } catch (err) {
          console.warn('Geocodificación inversa online timeout/fallo, usando fallback de catálogo:', err);
        }

        // Si no se obtuvo nombre por red, buscar la ciudad más cercana de nuestro catálogo nacional
        if (!cityName) {
          const match = findClosestCity(latitude, longitude);
          if (match && match.city && match.province) {
            cityName = match.city.name;
            provinceName = match.province.name;
            provinceId = match.province.id;
            cp = match.city.cp || '';
          } else {
            cityName = 'Tu ubicación actual';
            provinceName = 'Argentina';
          }
        }

        const locationObj = {
          provinceId,
          provinceName,
          cityName,
          cp,
          lat: latitude,
          lng: longitude,
          isGps: true,
          accuracy: Math.round(accuracy),
          displayName: `${cityName}, ${provinceName}`
        };

        saveUserLocation(locationObj);
        resolve(locationObj);
      },
      (error) => {
        let msg = 'No pudimos acceder a tu ubicación GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permiso de ubicación denegado. Podés seleccionar tu ciudad manualmente.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Información de ubicación no disponible en tu dispositivo.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'El tiempo de espera de geolocalización expiró.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Obtener detalles del tipo de inspección técnica vehicular (VTV / ITV / RTO) según provincia
 */
export function getInspectionInfo(provinceId) {
  const p = ARGENTINA_PROVINCES.find((prov) => prov.id === provinceId);
  if (!p) {
    return {
      type: 'VTV / RTO',
      fullName: 'Verificación Técnica Vehicular Obligatoria',
      url: 'https://www.argentina.gob.ar/seguridadvial/rto'
    };
  }
  return {
    type: p.inspectionType,
    fullName: p.inspectionFullName,
    url: p.inspectionUrl
  };
}
