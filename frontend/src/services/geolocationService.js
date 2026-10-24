// Servicio de Geolocalización para toda la República Argentina
// Incluye cálculo de distancia Haversine, detección GPS, reverse geocoding y catálogo completo de todas las localidades de las 24 jurisdicciones.

export const ARGENTINA_PROVINCES = [
  // ==========================================
  // 1. CIUDAD AUTÓNOMA DE BUENOS AIRES (CABA)
  // ==========================================
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
      { name: 'Palermo (Soho / Hollywood / Chico)', lat: -34.5883, lng: -58.4305, cp: '1425' },
      { name: 'Belgrano / Colegiales', lat: -34.5627, lng: -58.4564, cp: '1428' },
      { name: 'Caballito', lat: -34.6186, lng: -58.4438, cp: '1405' },
      { name: 'Recoleta / Barrio Norte', lat: -34.5885, lng: -58.3974, cp: '1425' },
      { name: 'Almagro', lat: -34.6095, lng: -58.4215, cp: '1177' },
      { name: 'Flores / Parque Chacabuco', lat: -34.6289, lng: -58.4633, cp: '1406' },
      { name: 'Floresta / Vélez Sarsfield', lat: -34.6305, lng: -58.4835, cp: '1407' },
      { name: 'Villa Urquiza / Coghlan', lat: -34.5714, lng: -58.4908, cp: '1431' },
      { name: 'Villa Devoto / Villa del Parque', lat: -34.6015, lng: -58.5085, cp: '1419' },
      { name: 'Nuñez / Saavedra', lat: -34.5458, lng: -58.4715, cp: '1429' },
      { name: 'Chacarita / La Paternal', lat: -34.5910, lng: -58.4610, cp: '1427' },
      { name: 'Balvanera / Once / Abasto', lat: -34.6080, lng: -58.4060, cp: '1088' },
      { name: 'Microcentro / Retiro / Puerto Madero', lat: -34.5997, lng: -58.3756, cp: '1001' },
      { name: 'San Telmo / Montserrat / Constitución', lat: -34.6210, lng: -58.3730, cp: '1063' },
      { name: 'Barracas / La Boca', lat: -34.6416, lng: -58.3725, cp: '1270' },
      { name: 'Mataderos / Liniers', lat: -34.6515, lng: -58.5145, cp: '1440' },
      { name: 'Parque Patricios / Boedo', lat: -34.6360, lng: -58.4110, cp: '1246' },
      { name: 'Villa Lugano / Villa Soldati', lat: -34.6750, lng: -58.4780, cp: '1439' },
      { name: 'Villa Pueyrredón / Agronomía', lat: -34.5816, lng: -58.5002, cp: '1419' },
      { name: 'Monte Castro / Villa Real / Versalles', lat: -34.6220, lng: -58.5180, cp: '1408' }
    ]
  },

  // ==========================================
  // 2. BUENOS AIRES (PBA / GBA / INTERIOR)
  // ==========================================
  {
    id: 'buenos-aires',
    name: 'Buenos Aires (PBA / GBA / Costa / Interior)',
    shortName: 'Buenos Aires',
    inspectionType: 'VTV',
    inspectionFullName: 'Verificación Técnica Vehicular (PBA)',
    inspectionUrl: 'https://vtvpba.minfra.gba.gob.ar/',
    lat: -34.9214,
    lng: -57.9545,
    cities: [
      // Gran Buenos Aires Norte
      { name: 'San Martín (Villa Ballester / San Andrés)', lat: -34.5768, lng: -58.5369, cp: '1650' },
      { name: 'Vicente López (Olivos / Florida / Munro)', lat: -34.5247, lng: -58.4906, cp: '1636' },
      { name: 'San Isidro (Martínez / Acassuso / Boulogne)', lat: -34.4728, lng: -58.5284, cp: '1642' },
      { name: 'San Fernando (Victoria / Virreyes)', lat: -34.4447, lng: -58.5583, cp: '1646' },
      { name: 'Tigre (Pacheco / Don Torcuato / Benavídez)', lat: -34.4260, lng: -58.5796, cp: '1648' },
      { name: 'Pilar (Del Viso / Manuel Alberti / Derqui)', lat: -34.4589, lng: -58.9142, cp: '1629' },
      { name: 'Escobar (Belén de Escobar / Garín / Maschwitz)', lat: -34.3486, lng: -58.7933, cp: '1625' },
      { name: 'Malvinas Argentinas (Los Polvorines / Grand Bourg)', lat: -34.5167, lng: -58.7000, cp: '1613' },
      { name: 'San Miguel (Bella Vista / Muñiz)', lat: -34.5428, lng: -58.7125, cp: '1663' },
      { name: 'José C. Paz', lat: -34.5150, lng: -58.7675, cp: '1665' },
      { name: 'Campana', lat: -34.1687, lng: -58.9591, cp: '2804' },
      { name: 'Zárate', lat: -34.0956, lng: -59.0275, cp: '2800' },

      // Gran Buenos Aires Oeste
      { name: 'Ramos Mejía / Morón (GBA Oeste)', lat: -34.6542, lng: -58.5661, cp: '1704' },
      { name: 'Castelar / Haedo / El Palomar', lat: -34.6490, lng: -58.6080, cp: '1712' },
      { name: 'San Justo (La Matanza)', lat: -34.6833, lng: -58.5583, cp: '1754' },
      { name: 'La Matanza (Laferrere / González Catán / Isidro Casanova)', lat: -34.7500, lng: -58.5833, cp: '1757' },
      { name: 'Ituzaingó', lat: -34.6583, lng: -58.6667, cp: '1714' },
      { name: 'Hurlingham (Villa Tesei)', lat: -34.5883, lng: -58.6383, cp: '1686' },
      { name: 'Tres de Febrero (Caseros / Ciudad Jardín / Santos Lugares)', lat: -34.6000, lng: -58.5667, cp: '1678' },
      { name: 'Merlo (San Antonio de Padua)', lat: -34.6653, lng: -58.7289, cp: '1722' },
      { name: 'Moreno (Paso del Rey / Francisco Álvarez)', lat: -34.6500, lng: -58.7833, cp: '1744' },
      { name: 'General Rodríguez', lat: -34.6083, lng: -58.9500, cp: '1748' },
      { name: 'Luján', lat: -34.5667, lng: -59.1000, cp: '6700' },
      { name: 'Marcos Paz', lat: -34.7833, lng: -58.8333, cp: '1727' },

      // Gran Buenos Aires Sur
      { name: 'Avellaneda (Wilde / Sarandí / Piñeyro)', lat: -34.6619, lng: -58.3653, cp: '1870' },
      { name: 'Lanús (Remedios de Escalada / Valentín Alsina)', lat: -34.7000, lng: -58.4000, cp: '1824' },
      { name: 'Lomas de Zamora (Banfield / Temperley / Turdera)', lat: -34.7597, lng: -58.4019, cp: '1832' },
      { name: 'Quilmes (Bernal / Don Bosco / Ezpeleta)', lat: -34.7242, lng: -58.2608, cp: '1878' },
      { name: 'Berazategui (Ranelagh / Hudson)', lat: -34.7633, lng: -58.2100, cp: '1884' },
      { name: 'Florencio Varela', lat: -34.8000, lng: -58.2833, cp: '1888' },
      { name: 'Almirante Brown (Adrogué / Burzaco / Longchamps)', lat: -34.7975, lng: -58.3917, cp: '1846' },
      { name: 'Esteban Echeverría (Monte Grande / Canning)', lat: -34.8167, lng: -58.4667, cp: '1842' },
      { name: 'Ezeiza (Tristán Suárez)', lat: -34.8500, lng: -58.5167, cp: '1804' },
      { name: 'Presidente Perón (Guernica)', lat: -34.9167, lng: -58.3833, cp: '1862' },
      { name: 'San Vicente (Alejandro Korn)', lat: -35.0167, lng: -58.4167, cp: '1865' },

      // Gran La Plata
      { name: 'La Plata (Centro / City Bell / Gonnet / Villa Elisa)', lat: -34.9214, lng: -57.9545, cp: '1900' },
      { name: 'Berisso', lat: -34.8725, lng: -57.8825, cp: '1923' },
      { name: 'Ensenada', lat: -34.8592, lng: -57.9092, cp: '1925' },

      // Costa Atlántica
      { name: 'Mar del Plata (Polo Av. Champagnat / Luro / Puerto)', lat: -38.0055, lng: -57.5560, cp: '7600' },
      { name: 'Necochea / Quequén', lat: -38.5544, lng: -58.7397, cp: '7630' },
      { name: 'Pinamar (Cariló / Ostende / Valeria del Mar)', lat: -37.1083, lng: -56.8617, cp: '7167' },
      { name: 'Villa Gesell (Mar de las Pampas)', lat: -37.2639, lng: -56.9731, cp: '7165' },
      { name: 'Partido de La Costa (San Clemente / Santa Teresita / San Bernardo)', lat: -36.6000, lng: -56.6833, cp: '7105' },
      { name: 'Miramar', lat: -38.2722, lng: -57.8394, cp: '7607' },
      { name: 'Santa Clara del Mar (Mar Chiquita)', lat: -37.8081, lng: -57.5028, cp: '7609' },
      { name: 'Monte Hermoso', lat: -38.9833, lng: -61.3000, cp: '8153' },

      // Interior de la Provincia
      { name: 'Bahía Blanca (Polo Av. Colón / Don Bosco)', lat: -38.7183, lng: -62.2663, cp: '8000' },
      { name: 'Tandil', lat: -37.3217, lng: -59.1332, cp: '7000' },
      { name: 'Olavarría', lat: -36.8928, lng: -60.3225, cp: '7400' },
      { name: 'Pergamino', lat: -33.8931, lng: -60.5736, cp: '2700' },
      { name: 'Junín', lat: -34.5839, lng: -60.9431, cp: '6000' },
      { name: 'San Nicolás de los Arroyos', lat: -33.3333, lng: -60.2167, cp: '2900' },
      { name: 'Chivilcoy', lat: -34.8967, lng: -60.0167, cp: '6620' },
      { name: 'Azul', lat: -36.7833, lng: -59.8500, cp: '7300' },
      { name: 'Mercedes', lat: -34.6500, lng: -59.4333, cp: '6600' },
      { name: 'Balcarce', lat: -37.8472, lng: -58.2553, cp: '7620' },
      { name: 'Tres Arroyos', lat: -38.3764, lng: -60.2792, cp: '7500' },
      { name: 'Bragado', lat: -35.1167, lng: -60.4833, cp: '6640' },
      { name: 'Chascomús', lat: -35.5667, lng: -58.0167, cp: '7130' },
      { name: 'Coronel Suárez', lat: -37.4547, lng: -61.9333, cp: '7540' },
      { name: 'Dolores', lat: -36.3131, lng: -57.6792, cp: '7100' },
      { name: 'San Pedro', lat: -33.6792, lng: -59.6667, cp: '2930' },
      { name: 'Baradero', lat: -33.8117, lng: -59.5081, cp: '2942' },
      { name: 'Salto', lat: -34.2928, lng: -60.2547, cp: '2741' },
      { name: 'Pehuajó', lat: -35.8119, lng: -61.8986, cp: '6450' },
      { name: 'Nueve de Julio (9 de Julio)', lat: -35.4444, lng: -60.8833, cp: '6500' },
      { name: 'Trenque Lauquen', lat: -35.9750, lng: -62.7347, cp: '6400' },
      { name: 'Chacabuco', lat: -34.6417, lng: -60.4739, cp: '6740' },
      { name: 'Lincoln', lat: -34.8667, lng: -61.5333, cp: '6070' },
      { name: 'Lobos', lat: -35.1833, lng: -59.0833, cp: '7240' },
      { name: 'Cañuelas', lat: -35.0500, lng: -58.7667, cp: '1814' },
      { name: 'Coronel Pringles', lat: -37.9833, lng: -61.3500, cp: '7530' },
      { name: 'Saladillo', lat: -35.6333, lng: -59.7833, cp: '7260' },
      { name: '25 de Mayo (PBA)', lat: -35.4333, lng: -60.1667, cp: '6660' },
      { name: 'Las Flores', lat: -36.0167, lng: -59.1000, cp: '7200' },
      { name: 'San Antonio de Areco', lat: -34.2483, lng: -59.4722, cp: '2760' },
      { name: 'Carmen de Patagones', lat: -40.7986, lng: -62.9856, cp: '8504' }
    ]
  },

  // ==========================================
  // 3. CÓRDOBA
  // ==========================================
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
      { name: 'Córdoba (Av. Colón / Alberdi / Villa Paez)', lat: -31.4050, lng: -64.2150, cp: '5003' },
      { name: 'Córdoba (B° San Vicente)', lat: -31.4280, lng: -64.1550, cp: '5006' },
      { name: 'Córdoba (Nueva Córdoba / Güemes)', lat: -31.4270, lng: -64.1870, cp: '5000' },
      { name: 'Córdoba (Alta Córdoba / Cofico)', lat: -31.3970, lng: -64.1850, cp: '5001' },
      { name: 'Córdoba (Cerro de las Rosas / Argüello / Villa Belgrano)', lat: -31.3720, lng: -64.2380, cp: '5009' },
      { name: 'Córdoba (Villa El Libertador / Ruta 9)', lat: -31.4720, lng: -64.2100, cp: '5014' },
      // Gran Córdoba y Sierras Chicas
      { name: 'Villa Allende', lat: -31.2947, lng: -64.2956, cp: '5105' },
      { name: 'Unquillo', lat: -31.2333, lng: -64.3167, cp: '5109' },
      { name: 'Mendiolaza', lat: -31.2667, lng: -64.3000, cp: '5107' },
      { name: 'Río Ceballos', lat: -31.1667, lng: -64.3167, cp: '5111' },
      { name: 'La Calera', lat: -31.3444, lng: -64.3361, cp: '5151' },
      { name: 'Salsipuedes', lat: -31.1333, lng: -64.3000, cp: '5113' },
      // Valle de Punilla
      { name: 'Villa Carlos Paz', lat: -31.4241, lng: -64.4978, cp: '5152' },
      { name: 'Cosquín', lat: -31.2458, lng: -64.4647, cp: '5166' },
      { name: 'La Falda', lat: -31.0833, lng: -64.4833, cp: '5172' },
      { name: 'Capilla del Monte', lat: -30.8608, lng: -64.5244, cp: '5184' },
      { name: 'Valle Hermoso', lat: -31.1167, lng: -64.4833, cp: '5168' },
      { name: 'Villa Giardino', lat: -31.0500, lng: -64.4833, cp: '5176' },
      // San Justo
      { name: 'San Francisco', lat: -31.4279, lng: -62.0827, cp: '2400' },
      { name: 'Arroyito', lat: -31.4206, lng: -63.0500, cp: '2434' },
      { name: 'Las Varillas', lat: -31.8722, lng: -62.7189, cp: '5940' },
      { name: 'Morteros', lat: -30.7167, lng: -61.9833, cp: '2421' },
      // Ciudades del Interior
      { name: 'Río Cuarto (Polo Ruta 005 / Centro)', lat: -33.1307, lng: -64.3499, cp: '5800' },
      { name: 'Villa María y Villa Nueva', lat: -32.4075, lng: -63.2403, cp: '5900' },
      { name: 'Río Tercero', lat: -32.1731, lng: -64.1142, cp: '5850' },
      { name: 'Alta Gracia', lat: -31.6528, lng: -64.4283, cp: '5186' },
      { name: 'Bell Ville', lat: -32.6253, lng: -62.6886, cp: '2550' },
      { name: 'Marcos Juárez', lat: -32.7000, lng: -62.1000, cp: '2580' },
      { name: 'Villa Dolores', lat: -31.9442, lng: -65.1892, cp: '5870' },
      { name: 'Jesús María y Colonia Caroya', lat: -30.9819, lng: -64.0942, cp: '5220' },
      { name: 'Cruz del Eje', lat: -30.7258, lng: -64.8058, cp: '5280' },
      { name: 'Deán Funes', lat: -30.4208, lng: -64.3486, cp: '5200' },
      { name: 'Laboulaye', lat: -34.1264, lng: -63.3911, cp: '6120' },
      { name: 'Huinca Renancó', lat: -34.8417, lng: -64.3722, cp: '6270' },
      { name: 'Santa Rosa de Calamuchita', lat: -32.0667, lng: -64.5333, cp: '5196' },
      { name: 'Villa General Belgrano', lat: -31.9772, lng: -64.5564, cp: '5194' },
      { name: 'La Carlota', lat: -33.4194, lng: -63.2972, cp: '2650' },
      { name: 'Oliva', lat: -32.0417, lng: -63.5694, cp: '5980' },
      { name: 'Oncativo', lat: -31.9139, lng: -63.6819, cp: '5986' },
      { name: 'Hernando', lat: -32.4267, lng: -63.7317, cp: '5929' },
      { name: 'Canals', lat: -33.5658, lng: -62.8889, cp: '2650' },
      { name: 'Monte Maíz', lat: -33.2000, lng: -62.6000, cp: '2659' },
      { name: 'Corral de Bustos', lat: -33.2833, lng: -62.1833, cp: '2645' },
      { name: 'Vicuña Mackenna', lat: -33.9167, lng: -64.3833, cp: '6140' }
    ]
  },

  // ==========================================
  // 4. SANTA FE
  // ==========================================
  {
    id: 'santa-fe',
    name: 'Santa Fe (Rosario / Santa Fe Capital / Interior)',
    shortName: 'Santa Fe',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Santa Fe)',
    inspectionUrl: 'https://www.santafe.gob.ar/index.php/tramites/modulotramite/index/208579',
    lat: -31.6333,
    lng: -60.7000,
    cities: [
      // Rosario y Gran Rosario
      { name: 'Rosario (Polo Echesortu / Av. San Martín)', lat: -32.9587, lng: -60.6505, cp: '2000' },
      { name: 'Rosario (Centro / Pellegrini / Oroño)', lat: -32.9468, lng: -60.6393, cp: '2000' },
      { name: 'Rosario (Fisherton / Aldea)', lat: -32.9240, lng: -60.7420, cp: '2000' },
      { name: 'Rosario (Arroyito / Alberdi)', lat: -32.9120, lng: -60.6780, cp: '2000' },
      { name: 'Rosario (Tiro Suizo / Saladillo / Zona Sur)', lat: -32.9920, lng: -60.6410, cp: '2000' },
      { name: 'Villa Gobernador Gálvez', lat: -33.0333, lng: -60.6333, cp: '2124' },
      { name: 'San Lorenzo', lat: -32.7483, lng: -60.7328, cp: '2200' },
      { name: 'Granadero Baigorria', lat: -32.8547, lng: -60.7108, cp: '2152' },
      { name: 'Capitán Bermúdez', lat: -32.8167, lng: -60.7167, cp: '2154' },
      { name: 'Funes', lat: -32.9167, lng: -60.8167, cp: '2132' },
      { name: 'Roldán', lat: -32.9000, lng: -60.9000, cp: '2134' },
      { name: 'Pérez', lat: -32.9833, lng: -60.7500, cp: '2121' },
      { name: 'Arroyo Seco', lat: -33.1500, lng: -60.5000, cp: '2128' },
      { name: 'Puerto General San Martín', lat: -32.7167, lng: -60.7333, cp: '2202' },

      // Santa Fe Capital y Gran Santa Fe
      { name: 'Santa Fe Capital (Centro / Candioti / Puerto)', lat: -31.6333, lng: -60.7000, cp: '3000' },
      { name: 'Santa Fe Capital (Guadalupe / Costanera)', lat: -31.5950, lng: -60.6800, cp: '3000' },
      { name: 'Santo Tomé', lat: -31.6628, lng: -60.7656, cp: '3016' },

      // Ciudades del Interior
      { name: 'Rafaela', lat: -31.2503, lng: -61.4867, cp: '2300' },
      { name: 'Sunchales', lat: -30.9442, lng: -61.5606, cp: '2322' },
      { name: 'Esperanza', lat: -31.4486, lng: -60.9317, cp: '3080' },
      { name: 'Reconquista y Avellaneda (SF)', lat: -29.1444, lng: -59.6467, cp: '3560' },
      { name: 'Venado Tuerto', lat: -33.7456, lng: -61.9688, cp: '2600' },
      { name: 'Casilda', lat: -33.0442, lng: -61.1681, cp: '2170' },
      { name: 'Cañada de Gómez', lat: -32.8167, lng: -61.4000, cp: '2500' },
      { name: 'Firmat', lat: -33.4561, lng: -61.4858, cp: '2630' },
      { name: 'Villa Constitución', lat: -33.2278, lng: -60.3297, cp: '2919' },
      { name: 'San Justo (Santa Fe)', lat: -30.7892, lng: -60.5917, cp: '3040' },
      { name: 'Coronda', lat: -31.9728, lng: -60.9208, cp: '2240' },
      { name: 'Gálvez', lat: -32.0306, lng: -61.2217, cp: '2252' },
      { name: 'Rufino', lat: -34.2683, lng: -62.7125, cp: '6100' },
      { name: 'San Jorge', lat: -31.8967, lng: -61.8594, cp: '2451' },
      { name: 'San Cristóbal', lat: -30.3167, lng: -61.2333, cp: '3070' },
      { name: 'Ceres', lat: -29.8833, lng: -61.9500, cp: '2340' },
      { name: 'Vera', lat: -29.4589, lng: -60.2153, cp: '3550' },
      { name: 'Tostado', lat: -29.2333, lng: -61.7667, cp: '3060' },
      { name: 'Laguna Paiva', lat: -31.3000, lng: -60.6500, cp: '3020' },
      { name: 'Las Parejas', lat: -32.6833, lng: -61.5167, cp: '2505' },
      { name: 'Carcarañá', lat: -32.8592, lng: -61.1558, cp: '2138' },
      { name: 'El Trébol', lat: -32.2000, lng: -61.7000, cp: '2535' },
      { name: 'Las Rosas', lat: -32.4772, lng: -61.5794, cp: '2520' },
      { name: 'Armstrong', lat: -32.7833, lng: -61.6000, cp: '2508' }
    ]
  },

  // ==========================================
  // 5. MENDOZA
  // ==========================================
  {
    id: 'mendoza',
    name: 'Mendoza (Gran Mendoza / Este / Valle de Uco / Sur)',
    shortName: 'Mendoza',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Mendoza)',
    inspectionUrl: 'https://rto.mendoza.gov.ar/',
    lat: -32.8895,
    lng: -68.8458,
    cities: [
      // Gran Mendoza
      { name: 'Godoy Cruz (Polo Rodríguez Peña / San Martín Sur)', lat: -32.9250, lng: -68.8400, cp: '5501' },
      { name: 'Ciudad de Mendoza (Capital / Centro / Quinta Sección)', lat: -32.8908, lng: -68.8272, cp: '5500' },
      { name: 'Guaymallén (San José / Villa Nueva / Dorrego)', lat: -32.8980, lng: -68.8150, cp: '5519' },
      { name: 'Guaymallén (Rodeo de la Cruz / Los Corralitos)', lat: -32.9150, lng: -68.7500, cp: '5525' },
      { name: 'Maipú (Gutiérrez / Coquimbito / Luzuriaga)', lat: -32.9800, lng: -68.7800, cp: '5515' },
      { name: 'Las Heras (El Challao / Panquehua)', lat: -32.8480, lng: -68.8230, cp: '5539' },
      { name: 'Luján de Cuyo (Chacras de Coria / Carrodilla / Vistalba)', lat: -32.9890, lng: -68.8780, cp: '5505' },
      { name: 'Luján de Cuyo (Perdriel / Ugarteche)', lat: -33.0780, lng: -68.8850, cp: '5509' },
      { name: 'Lavalle (Villa Tulumaya)', lat: -32.7208, lng: -68.5947, cp: '5533' },

      // Zona Este
      { name: 'San Martín (Palmira / Centro)', lat: -33.0811, lng: -68.4681, cp: '5570' },
      { name: 'Rivadavia', lat: -33.1906, lng: -68.4619, cp: '5577' },
      { name: 'Junín', lat: -33.1417, lng: -68.4833, cp: '5573' },
      { name: 'Santa Rosa', lat: -33.2500, lng: -68.0500, cp: '5596' },
      { name: 'La Paz', lat: -33.4667, lng: -67.5500, cp: '5590' },

      // Valle de Uco
      { name: 'Tunuyán', lat: -33.5786, lng: -69.0147, cp: '5560' },
      { name: 'Tupungato', lat: -33.3725, lng: -69.1481, cp: '5561' },
      { name: 'San Carlos (La Consulta / Eugenio Bustos)', lat: -33.7708, lng: -69.0414, cp: '5569' },

      // Zona Sur
      { name: 'San Rafael (Ciudad / Rama Caída / Salto de las Rosas)', lat: -34.6177, lng: -68.3301, cp: '5600' },
      { name: 'General Alvear (Bowen)', lat: -34.9750, lng: -67.6833, cp: '5620' },
      { name: 'Malargüe', lat: -35.4756, lng: -69.5847, cp: '5613' }
    ]
  },

  // ==========================================
  // 6. TUCUMÁN
  // ==========================================
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
      { name: 'San Miguel de Tucumán (Polo Av. Avellaneda / Centro)', lat: -26.8241, lng: -65.2226, cp: '4000' },
      { name: 'Yerba Buena (Av. Aconquija)', lat: -26.8170, lng: -65.3160, cp: '4107' },
      { name: 'Banda del Río Salí', lat: -26.8483, lng: -65.1611, cp: '4109' },
      { name: 'Tafí Viejo', lat: -26.7328, lng: -65.2608, cp: '4103' },
      { name: 'Alderetes', lat: -26.8167, lng: -65.1333, cp: '4178' },
      { name: 'Las Talitas', lat: -26.7833, lng: -65.2167, cp: '4101' },
      { name: 'Concepción', lat: -27.3450, lng: -65.5930, cp: '4146' },
      { name: 'Famaillá', lat: -27.0547, lng: -65.4022, cp: '4132' },
      { name: 'Aguilares', lat: -27.4333, lng: -65.6167, cp: '4152' },
      { name: 'Monteros', lat: -27.1672, lng: -65.4983, cp: '4142' },
      { name: 'Lules', lat: -26.9272, lng: -65.3400, cp: '4128' },
      { name: 'Bella Vista', lat: -27.0347, lng: -65.3039, cp: '4168' },
      { name: 'Simoca', lat: -27.2611, lng: -65.3556, cp: '4172' },
      { name: 'Tafí del Valle', lat: -26.8522, lng: -65.7103, cp: '4137' },
      { name: 'Trancas', lat: -26.2300, lng: -65.2800, cp: '4124' },
      { name: 'Juan Bautista Alberdi', lat: -27.5833, lng: -65.6167, cp: '4158' },
      { name: 'Graneros', lat: -27.6500, lng: -65.4333, cp: '4174' },
      { name: 'Burruyacú', lat: -26.5000, lng: -64.7500, cp: '4117' },
      { name: 'La Cocha', lat: -27.7667, lng: -65.5833, cp: '4162' }
    ]
  },

  // ==========================================
  // 7. SALTA
  // ==========================================
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
      { name: 'Salta Capital (Polo Av. Chile / Centro)', lat: -24.7859, lng: -65.4117, cp: '4400' },
      { name: 'Salta Capital (Tres Cerritos / Zona Norte)', lat: -24.7600, lng: -65.4000, cp: '4400' },
      { name: 'San Ramón de la Nueva Orán', lat: -23.1322, lng: -64.3260, cp: '4530' },
      { name: 'Tartagal', lat: -22.5164, lng: -63.8014, cp: '4560' },
      { name: 'General Güemes', lat: -24.6667, lng: -65.0500, cp: '4432' },
      { name: 'Rosario de Lerma', lat: -24.9856, lng: -65.5800, cp: '4405' },
      { name: 'Cafayate', lat: -26.0731, lng: -65.9761, cp: '4140' },
      { name: 'San José de Metán', lat: -25.4969, lng: -64.9725, cp: '4440' },
      { name: 'Rosario de la Frontera', lat: -25.7972, lng: -64.9667, cp: '4190' },
      { name: 'Joaquín V. González', lat: -25.0878, lng: -64.1800, cp: '4448' },
      { name: 'Cerrillos', lat: -24.8986, lng: -65.4789, cp: '4403' },
      { name: 'Campo Quijano', lat: -24.9100, lng: -65.6378, cp: '4407' },
      { name: 'Embarcación', lat: -23.2167, lng: -64.1000, cp: '4550' },
      { name: 'Pichanal', lat: -23.3167, lng: -64.2167, cp: '4534' },
      { name: 'Colonia Santa Rosa', lat: -23.3833, lng: -64.4333, cp: '4531' },
      { name: 'Profesor Salvador Mazza (Pocitos)', lat: -22.0500, lng: -63.7000, cp: '4568' },
      { name: 'Cachi', lat: -25.1206, lng: -66.1628, cp: '4417' },
      { name: 'General Mosconi', lat: -22.6000, lng: -63.8167, cp: '4562' },
      { name: 'Las Lajitas', lat: -24.6833, lng: -64.2500, cp: '4449' },
      { name: 'Hipólito Yrigoyen', lat: -23.2500, lng: -64.2833, cp: '4533' }
    ]
  },

  // ==========================================
  // 8. ENTRE RÍOS
  // ==========================================
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
      { name: 'Paraná (Polo Av. Ramírez / Centro)', lat: -31.7333, lng: -60.5333, cp: '3100' },
      { name: 'Concordia', lat: -31.3929, lng: -58.0209, cp: '3200' },
      { name: 'Gualeguaychú', lat: -33.0094, lng: -58.5172, cp: '2820' },
      { name: 'Concepción del Uruguay', lat: -32.4833, lng: -58.2333, cp: '3260' },
      { name: 'Gualeguay', lat: -33.1417, lng: -59.3111, cp: '2840' },
      { name: 'Villaguay', lat: -31.8653, lng: -59.0269, cp: '3240' },
      { name: 'Chajarí', lat: -30.7500, lng: -57.9833, cp: '3228' },
      { name: 'Victoria', lat: -32.6181, lng: -60.1578, cp: '3153' },
      { name: 'La Paz', lat: -30.7425, lng: -59.6456, cp: '3190' },
      { name: 'Nogoyá', lat: -32.3942, lng: -59.7892, cp: '3150' },
      { name: 'Colón', lat: -32.2228, lng: -58.1436, cp: '3280' },
      { name: 'Diamante', lat: -32.0667, lng: -60.6333, cp: '3105' },
      { name: 'Federación', lat: -30.9833, lng: -57.9167, cp: '3206' },
      { name: 'San José', lat: -32.2000, lng: -58.2167, cp: '3283' },
      { name: 'Crespo', lat: -32.0306, lng: -60.3097, cp: '3116' },
      { name: 'Villa Elisa', lat: -32.1667, lng: -58.4000, cp: '3265' },
      { name: 'Basavilbaso', lat: -32.3739, lng: -58.8789, cp: '3170' },
      { name: 'Rosario del Tala', lat: -32.3000, lng: -59.1333, cp: '3174' },
      { name: 'Federal', lat: -30.9500, lng: -58.7833, cp: '3180' },
      { name: 'San Salvador', lat: -31.6250, lng: -58.5083, cp: '3218' },
      { name: 'San José de Feliciano', lat: -30.3833, lng: -58.7500, cp: '3187' },
      { name: 'Santa Elena', lat: -30.9500, lng: -59.7833, cp: '3192' },
      { name: 'Viale', lat: -31.8667, lng: -60.0083, cp: '3109' },
      { name: 'General Ramírez', lat: -32.1764, lng: -60.2014, cp: '3164' }
    ]
  },

  // ==========================================
  // 9. NEUQUÉN
  // ==========================================
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
      { name: 'Neuquén Capital (Polo Ruta 22 / Centro)', lat: -38.9516, lng: -68.0591, cp: '8300' },
      { name: 'Neuquén Capital (Parque Industrial / Alta Barda)', lat: -38.9200, lng: -68.0750, cp: '8300' },
      { name: 'Plottier', lat: -38.9500, lng: -68.2333, cp: '8316' },
      { name: 'Centenario', lat: -38.8333, lng: -68.1333, cp: '8309' },
      { name: 'Cutral Có y Plaza Huincul', lat: -38.9333, lng: -69.2333, cp: '8322' },
      { name: 'Zapala', lat: -38.9028, lng: -70.0650, cp: '8340' },
      { name: 'San Martín de los Andes', lat: -40.1574, lng: -71.3533, cp: '8370' },
      { name: 'Junín de los Andes', lat: -39.9500, lng: -71.0833, cp: '8371' },
      { name: 'Villa La Angostura', lat: -40.7628, lng: -71.6444, cp: '8407' },
      { name: 'Chos Malal', lat: -37.3789, lng: -70.2708, cp: '8353' },
      { name: 'Rincón de los Sauces', lat: -37.3939, lng: -68.9281, cp: '8319' },
      { name: 'Añelo (Polo Vaca Muerta)', lat: -38.3533, lng: -68.7889, cp: '8305' },
      { name: 'Senillosa', lat: -39.0000, lng: -68.4167, cp: '8317' },
      { name: 'Aluminé', lat: -39.2367, lng: -70.9200, cp: '8345' },
      { name: 'Loncopué', lat: -38.0700, lng: -70.6150, cp: '8349' },
      { name: 'Andacollo', lat: -37.1794, lng: -70.6722, cp: '8354' },
      { name: 'Villa El Chocón', lat: -39.2667, lng: -68.7833, cp: '8311' },
      { name: 'Las Lajas', lat: -38.5283, lng: -70.3667, cp: '8347' },
      { name: 'Buta Ranquil', lat: -37.0500, lng: -69.8667, cp: '8353' },
      { name: 'Picún Leufú', lat: -39.5167, lng: -69.3000, cp: '8313' }
    ]
  },

  // ==========================================
  // 10. RÍO NEGRO
  // ==========================================
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
      { name: 'San Carlos de Bariloche (Centro / Melipal / Llao Llao)', lat: -41.1335, lng: -71.3103, cp: '8400' },
      { name: 'General Roca', lat: -39.0267, lng: -67.5756, cp: '8332' },
      { name: 'Cipolletti (Alto Valle)', lat: -38.9392, lng: -67.9944, cp: '8324' },
      { name: 'Viedma (Capital)', lat: -40.8135, lng: -62.9967, cp: '8500' },
      { name: 'Villa Regina', lat: -39.1000, lng: -67.0667, cp: '8336' },
      { name: 'Allen', lat: -38.9833, lng: -67.8333, cp: '8328' },
      { name: 'Cinco Saltos', lat: -38.8333, lng: -68.0667, cp: '8303' },
      { name: 'Catriel', lat: -37.8833, lng: -67.7958, cp: '8307' },
      { name: 'San Antonio Oeste y Las Grutas', lat: -40.7333, lng: -64.9500, cp: '8520' },
      { name: 'El Bolsón', lat: -41.9667, lng: -71.5333, cp: '8430' },
      { name: 'Río Colorado', lat: -38.9944, lng: -64.0928, cp: '8138' },
      { name: 'Choele Choel', lat: -39.2833, lng: -65.6667, cp: '8360' },
      { name: 'Sierra Grande', lat: -41.6067, lng: -65.3556, cp: '8532' },
      { name: 'Ingeniero Jacobacci', lat: -41.3308, lng: -69.5447, cp: '8416' },
      { name: 'Lamarque', lat: -39.4206, lng: -65.7003, cp: '8363' },
      { name: 'General Fernández Oro', lat: -38.9500, lng: -67.9167, cp: '8324' },
      { name: 'Luis Beltrán', lat: -39.3167, lng: -65.7667, cp: '8361' },
      { name: 'Chimpay', lat: -39.1667, lng: -66.1500, cp: '8364' }
    ]
  },

  // ==========================================
  // 11. SAN JUAN
  // ==========================================
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
      { name: 'San Juan Capital (Polo Av. Rawson / Centro)', lat: -31.5375, lng: -68.5364, cp: '5400' },
      { name: 'Rawson (Villa Krause)', lat: -31.5670, lng: -68.5200, cp: '5425' },
      { name: 'Rivadavia', lat: -31.5300, lng: -68.5800, cp: '5407' },
      { name: 'Chimbas', lat: -31.4833, lng: -68.5333, cp: '5413' },
      { name: 'Santa Lucía', lat: -31.5333, lng: -68.4833, cp: '5411' },
      { name: 'Pocito (Villa Aberastain)', lat: -31.6667, lng: -68.5833, cp: '5427' },
      { name: 'Caucete', lat: -31.6500, lng: -68.2833, cp: '5442' },
      { name: 'Jáchal (San José de Jáchal)', lat: -30.2417, lng: -68.7472, cp: '5460' },
      { name: 'Albardón', lat: -31.4333, lng: -68.5167, cp: '5419' },
      { name: 'Sarmiento (Media Agua)', lat: -31.9833, lng: -68.4167, cp: '5437' },
      { name: '25 de Mayo (Santa Rosa)', lat: -31.8167, lng: -68.1667, cp: '5443' },
      { name: 'San Martín', lat: -31.5167, lng: -68.3000, cp: '5439' },
      { name: 'Angaco', lat: -31.3917, lng: -68.4306, cp: '5421' },
      { name: 'Valle Fértil (San Agustín)', lat: -30.6333, lng: -67.4667, cp: '5449' },
      { name: 'Calingasta (Barreal)', lat: -31.3308, lng: -69.4147, cp: '5401' },
      { name: 'Iglesia (Rodeo)', lat: -30.2081, lng: -69.1306, cp: '5465' },
      { name: 'Zonda', lat: -31.5500, lng: -68.7167, cp: '5403' },
      { name: 'Ullum', lat: -31.4333, lng: -68.7333, cp: '5401' }
    ]
  },

  // ==========================================
  // 12. CHACO
  // ==========================================
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
      { name: 'Resistencia (Polo Av. 25 de Mayo)', lat: -27.4514, lng: -58.9867, cp: '3500' },
      { name: 'Barranqueras y Puerto Vilelas', lat: -27.4833, lng: -58.9333, cp: '3503' },
      { name: 'Fontana', lat: -27.4167, lng: -59.0167, cp: '3514' },
      { name: 'Presidencia Roque Sáenz Peña', lat: -26.7852, lng: -60.4388, cp: '3700' },
      { name: 'Villa Ángela', lat: -27.5739, lng: -60.7153, cp: '3540' },
      { name: 'Charata', lat: -27.2144, lng: -61.1878, cp: '3730' },
      { name: 'Juan José Castelli', lat: -25.9469, lng: -60.6194, cp: '3705' },
      { name: 'General José de San Martín', lat: -26.5375, lng: -59.3417, cp: '3509' },
      { name: 'Machagai', lat: -26.9264, lng: -60.0489, cp: '3534' },
      { name: 'Las Breñas', lat: -27.0886, lng: -61.0817, cp: '3722' },
      { name: 'Quitilipi', lat: -26.8717, lng: -60.2158, cp: '3530' },
      { name: 'Tres Isletas', lat: -26.3408, lng: -60.4319, cp: '3703' },
      { name: 'San Bernardo', lat: -27.2883, lng: -60.7125, cp: '3543' },
      { name: 'Campo Largo', lat: -26.8000, lng: -60.7667, cp: '3716' },
      { name: 'Pampa del Infierno', lat: -26.5056, lng: -61.1736, cp: '3708' },
      { name: 'Corzuela', lat: -26.9531, lng: -60.9706, cp: '3714' },
      { name: 'General Pinedo', lat: -27.3167, lng: -61.2833, cp: '3732' },
      { name: 'Presidencia de la Plaza', lat: -27.0017, lng: -59.7678, cp: '3536' }
    ]
  },

  // ==========================================
  // 13. CORRIENTES
  // ==========================================
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
      { name: 'Corrientes Capital (Polo Av. 3 de Abril / Centro)', lat: -27.4692, lng: -58.8306, cp: '3400' },
      { name: 'Goya', lat: -29.1442, lng: -59.2638, cp: '3450' },
      { name: 'Paso de los Libres', lat: -29.7125, lng: -57.0883, cp: '3230' },
      { name: 'Curuzú Cuatiá', lat: -29.7917, lng: -58.0547, cp: '3460' },
      { name: 'Mercedes', lat: -29.1842, lng: -58.0753, cp: '3470' },
      { name: 'Bella Vista', lat: -28.5083, lng: -59.0417, cp: '3432' },
      { name: 'Santo Tomé', lat: -28.5500, lng: -56.0333, cp: '3340' },
      { name: 'Esquina', lat: -30.0167, lng: -59.5333, cp: '3196' },
      { name: 'Monte Caseros', lat: -30.2536, lng: -57.6364, cp: '3220' },
      { name: 'Ituzaingó', lat: -27.5833, lng: -56.6833, cp: '3302' },
      { name: 'Saladas', lat: -28.2547, lng: -58.7619, cp: '3420' },
      { name: 'San Luis del Palmar', lat: -27.5097, lng: -58.5544, cp: '3401' },
      { name: 'Gobernador Virasoro', lat: -28.0500, lng: -56.0333, cp: '3342' },
      { name: 'Santa Lucía', lat: -28.9875, lng: -59.1817, cp: '3444' },
      { name: 'Empedrado', lat: -27.9519, lng: -58.7997, cp: '3418' },
      { name: 'Paso de la Patria', lat: -27.3167, lng: -58.5667, cp: '3409' },
      { name: 'Itatí', lat: -27.2667, lng: -58.2500, cp: '3401' },
      { name: 'Santa Rosa', lat: -28.2667, lng: -58.1167, cp: '3421' }
    ]
  },

  // ==========================================
  // 14. MISIONES
  // ==========================================
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
      { name: 'Posadas (Centro / Costanera / Itaembé Miní)', lat: -27.3671, lng: -55.8961, cp: '3300' },
      { name: 'Garupá y Candelaria', lat: -27.4833, lng: -55.8333, cp: '3304' },
      { name: 'Oberá', lat: -27.4847, lng: -55.1228, cp: '3360' },
      { name: 'Eldorado', lat: -26.4067, lng: -54.6292, cp: '3380' },
      { name: 'Puerto Iguazú', lat: -25.5991, lng: -54.5735, cp: '3370' },
      { name: 'Apóstoles', lat: -27.9139, lng: -55.7556, cp: '3350' },
      { name: 'Leandro N. Alem', lat: -27.6033, lng: -55.3267, cp: '3315' },
      { name: 'Jardín América', lat: -27.0428, lng: -55.2286, cp: '3328' },
      { name: 'San Vicente', lat: -26.9744, lng: -54.4986, cp: '3364' },
      { name: 'Montecarlo', lat: -26.5683, lng: -54.7578, cp: '3384' },
      { name: 'Aristóbulo del Valle', lat: -27.0939, lng: -54.8967, cp: '3364' },
      { name: 'Puerto Rico', lat: -26.7972, lng: -55.0250, cp: '3334' },
      { name: 'Wanda', lat: -25.9692, lng: -54.5583, cp: '3376' },
      { name: 'Puerto Esperanza', lat: -26.0167, lng: -54.6167, cp: '3378' },
      { name: 'San Pedro', lat: -26.6239, lng: -54.1089, cp: '3352' },
      { name: 'Comandante Andresito', lat: -25.6667, lng: -53.9500, cp: '3366' },
      { name: 'El Soberbio', lat: -27.2975, lng: -54.1983, cp: '3364' },
      { name: 'Campo Grande', lat: -27.2081, lng: -54.9786, cp: '3362' },
      { name: 'Capioví', lat: -26.9272, lng: -55.0608, cp: '3332' },
      { name: 'Bernardo de Irigoyen', lat: -26.2558, lng: -53.6453, cp: '3366' }
    ]
  },

  // ==========================================
  // 15. SAN LUIS
  // ==========================================
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
      { name: 'San Luis Capital (Polo Av. España / Centro)', lat: -33.3017, lng: -66.3378, cp: '5700' },
      { name: 'Villa Mercedes (Polo Av. Mitre / Centro)', lat: -33.6757, lng: -65.4578, cp: '5730' },
      { name: 'La Punta', lat: -33.1833, lng: -66.3167, cp: '5703' },
      { name: 'Juana Koslay', lat: -33.2833, lng: -66.2500, cp: '5701' },
      { name: 'Merlo (Villa de Merlo)', lat: -32.3439, lng: -65.0125, cp: '5881' },
      { name: 'Justo Daract', lat: -33.8600, lng: -65.1817, cp: '5738' },
      { name: 'Santa Rosa del Conlara', lat: -32.3433, lng: -65.2056, cp: '5885' },
      { name: 'Tilisarao', lat: -32.7333, lng: -65.2833, cp: '5773' },
      { name: 'Quines', lat: -32.2333, lng: -65.8000, cp: '5711' },
      { name: 'Candelaria', lat: -32.0667, lng: -65.9000, cp: '5707' },
      { name: 'San Francisco del Monte de Oro', lat: -32.6000, lng: -66.1333, cp: '5705' },
      { name: 'Buena Esperanza', lat: -34.7500, lng: -65.2500, cp: '6275' },
      { name: 'Concarán', lat: -32.5592, lng: -65.2444, cp: '5770' },
      { name: 'Naschel', lat: -32.9167, lng: -65.3667, cp: '5775' },
      { name: 'La Toma', lat: -33.0522, lng: -65.6239, cp: '5750' },
      { name: 'Potrero de los Funes', lat: -33.2208, lng: -66.2300, cp: '5701' }
    ]
  },

  // ==========================================
  // 16. SANTIAGO DEL ESTERO
  // ==========================================
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
      { name: 'Santiago del Estero Capital (Centro)', lat: -27.7951, lng: -64.2615, cp: '4200' },
      { name: 'La Banda', lat: -27.7333, lng: -64.2500, cp: '4300' },
      { name: 'Termas de Río Hondo', lat: -27.4947, lng: -64.8597, cp: '4220' },
      { name: 'Frías', lat: -28.6367, lng: -65.1328, cp: '4230' },
      { name: 'Añatuya', lat: -28.4606, lng: -62.8344, cp: '3760' },
      { name: 'Fernández', lat: -27.9200, lng: -63.8936, cp: '4322' },
      { name: 'Loreto', lat: -28.2986, lng: -64.1814, cp: '4236' },
      { name: 'Quimilí', lat: -27.6433, lng: -62.4144, cp: '3740' },
      { name: 'Monte Quemado', lat: -25.8083, lng: -62.8317, cp: '3712' },
      { name: 'Clodomira', lat: -27.5500, lng: -64.0833, cp: '4326' },
      { name: 'Suncho Corral', lat: -27.9333, lng: -63.4333, cp: '4350' },
      { name: 'Tintina', lat: -27.0333, lng: -62.7167, cp: '3745' },
      { name: 'Beltrán', lat: -27.8333, lng: -64.0667, cp: '4328' },
      { name: 'Bandera', lat: -28.8875, lng: -62.2661, cp: '3063' },
      { name: 'San Pedro de Guasayán', lat: -27.9547, lng: -65.0931, cp: '4231' },
      { name: 'Los Juríes', lat: -28.3667, lng: -62.1167, cp: '3761' },
      { name: 'Villa Ojo de Agua', lat: -29.5000, lng: -64.1167, cp: '5250' }
    ]
  },

  // ==========================================
  // 17. JUJUY
  // ==========================================
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
      { name: 'San Salvador de Jujuy (Centro / Ciudad de Nieva / Alto Comedero)', lat: -24.1858, lng: -65.2995, cp: '4600' },
      { name: 'Palpalá', lat: -24.2567, lng: -65.2117, cp: '4612' },
      { name: 'San Pedro de Jujuy', lat: -24.2333, lng: -64.8667, cp: '4500' },
      { name: 'Libertador General San Martín (Ledesma)', lat: -23.8064, lng: -64.7875, cp: '4512' },
      { name: 'Perico', lat: -24.3833, lng: -65.1167, cp: '4610' },
      { name: 'La Quiaca', lat: -22.1028, lng: -65.5928, cp: '4650' },
      { name: 'Humahuaca', lat: -23.2056, lng: -65.3500, cp: '4630' },
      { name: 'Tilcara', lat: -23.5772, lng: -65.3931, cp: '4624' },
      { name: 'El Carmen', lat: -24.3872, lng: -65.2589, cp: '4603' },
      { name: 'Monterrico', lat: -24.4792, lng: -65.1614, cp: '4608' },
      { name: 'Yuto', lat: -23.6397, lng: -64.4719, cp: '4518' },
      { name: 'Fraile Pintado', lat: -23.9458, lng: -64.7958, cp: '4514' },
      { name: 'Abra Pampa', lat: -22.7231, lng: -65.6967, cp: '4640' },
      { name: 'Purmamarca', lat: -23.7472, lng: -65.4989, cp: '4618' },
      { name: 'Calilegua', lat: -23.7744, lng: -64.7708, cp: '4513' },
      { name: 'Palma Sola', lat: -23.9667, lng: -64.3000, cp: '4501' },
      { name: 'Maimará', lat: -23.6264, lng: -65.4097, cp: '4622' },
      { name: 'Susques', lat: -23.4000, lng: -66.3667, cp: '4641' }
    ]
  },

  // ==========================================
  // 18. CHUBUT
  // ==========================================
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
      { name: 'Puerto Madryn', lat: -42.7692, lng: -65.0385, cp: '9120' },
      { name: 'Rawson (Capital)', lat: -43.3002, lng: -65.1023, cp: '9103' },
      { name: 'Esquel', lat: -42.9114, lng: -71.3194, cp: '9200' },
      { name: 'Rada Tilly', lat: -45.9286, lng: -67.5583, cp: '9001' },
      { name: 'Sarmiento', lat: -45.5892, lng: -69.0700, cp: '9020' },
      { name: 'Gaiman', lat: -43.2897, lng: -65.4925, cp: '9105' },
      { name: 'Dolavon', lat: -43.3083, lng: -65.7114, cp: '9107' },
      { name: 'Trevelin', lat: -43.0858, lng: -71.4636, cp: '9203' },
      { name: 'Lago Puelo', lat: -42.0667, lng: -71.6000, cp: '9211' },
      { name: 'El Hoyo', lat: -42.0667, lng: -71.5167, cp: '9211' },
      { name: 'Gobernador Costa', lat: -44.0500, lng: -70.5833, cp: '9223' },
      { name: 'Río Mayo', lat: -45.6872, lng: -70.2583, cp: '9030' },
      { name: 'El Maitén', lat: -42.0500, lng: -71.1667, cp: '9210' },
      { name: 'Cholila', lat: -42.5167, lng: -71.4333, cp: '9211' },
      { name: 'Camarones', lat: -44.7961, lng: -65.7083, cp: '9033' }
    ]
  },

  // ==========================================
  // 19. CATAMARCA
  // ==========================================
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
      { name: 'San Fernando del Valle de Catamarca (Centro)', lat: -28.4696, lng: -65.7852, cp: '4700' },
      { name: 'Valle Viejo (San Isidro)', lat: -28.4833, lng: -65.7167, cp: '4707' },
      { name: 'Fray Mamerto Esquiú (San José)', lat: -28.3667, lng: -65.7167, cp: '4709' },
      { name: 'Andalgalá', lat: -27.5997, lng: -66.3175, cp: '4740' },
      { name: 'Belén', lat: -27.6497, lng: -67.0289, cp: '4750' },
      { name: 'Santa María', lat: -26.6972, lng: -66.0489, cp: '4139' },
      { name: 'Tinogasta', lat: -28.0631, lng: -67.5647, cp: '5340' },
      { name: 'Recreo', lat: -29.2817, lng: -65.0608, cp: '4260' },
      { name: 'Fiambalá', lat: -27.6872, lng: -67.6186, cp: '5345' },
      { name: 'Saujil', lat: -28.1697, lng: -66.2114, cp: '4743' },
      { name: 'Chumbicha', lat: -28.8744, lng: -66.2367, cp: '4728' },
      { name: 'Londres', lat: -27.7167, lng: -67.1333, cp: '4751' },
      { name: 'Pomán', lat: -28.3942, lng: -66.2189, cp: '4723' },
      { name: 'Los Altos', lat: -28.0483, lng: -65.4983, cp: '4721' },
      { name: 'Antofagasta de la Sierra', lat: -26.0600, lng: -67.4100, cp: '4701' }
    ]
  },

  // ==========================================
  // 20. LA RIOJA
  // ==========================================
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
      { name: 'La Rioja Capital (Centro)', lat: -29.4135, lng: -66.8565, cp: '5300' },
      { name: 'Chilecito', lat: -29.1625, lng: -67.4981, cp: '5360' },
      { name: 'Aimogasta (Arauco)', lat: -28.5606, lng: -66.8058, cp: '5310' },
      { name: 'Chamical', lat: -30.3606, lng: -66.3136, cp: '5380' },
      { name: 'Chepes (Rosario Vera Peñaloza)', lat: -31.3414, lng: -66.5947, cp: '5470' },
      { name: 'Villa Unión (Coronel Felipe Varela)', lat: -29.3131, lng: -68.2253, cp: '5350' },
      { name: 'Famatina', lat: -28.9242, lng: -67.5186, cp: '5365' },
      { name: 'Sanagasta', lat: -29.3083, lng: -67.0306, cp: '5301' },
      { name: 'Ulapes', lat: -31.5700, lng: -66.2400, cp: '5473' },
      { name: 'Olta', lat: -30.6306, lng: -66.2647, cp: '5383' },
      { name: 'Anillaco (Costa Riojana)', lat: -28.8117, lng: -66.9381, cp: '5301' },
      { name: 'Tama', lat: -30.5083, lng: -66.5389, cp: '5381' },
      { name: 'Vinchina', lat: -28.7619, lng: -68.2078, cp: '5357' },
      { name: 'Milagro', lat: -31.0000, lng: -65.9833, cp: '5471' },
      { name: 'Guandacol', lat: -29.5333, lng: -68.5667, cp: '5351' }
    ]
  },

  // ==========================================
  // 21. LA PAMPA
  // ==========================================
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
      { name: 'Santa Rosa (Capital)', lat: -36.6167, lng: -64.2833, cp: '6300' },
      { name: 'General Pico', lat: -35.6566, lng: -63.7568, cp: '6360' },
      { name: 'Toay', lat: -36.6733, lng: -64.3800, cp: '6303' },
      { name: 'Realicó', lat: -35.0347, lng: -64.2444, cp: '6200' },
      { name: 'Eduardo Castex', lat: -35.9142, lng: -64.2947, cp: '6380' },
      { name: '25 de Mayo (La Pampa)', lat: -37.7739, lng: -67.7175, cp: '8201' },
      { name: 'Intendente Alvear', lat: -35.2344, lng: -63.5858, cp: '6220' },
      { name: 'General Acha', lat: -37.3775, lng: -64.6044, cp: '8200' },
      { name: 'Victorica', lat: -36.2167, lng: -65.4333, cp: '6319' },
      { name: 'Macachín', lat: -37.1333, lng: -63.6667, cp: '6307' },
      { name: 'Guatraché', lat: -37.6667, lng: -63.5333, cp: '6311' },
      { name: 'Quemú Quemú', lat: -36.0500, lng: -63.5667, cp: '6333' },
      { name: 'Catriló', lat: -36.4000, lng: -63.4167, cp: '6330' },
      { name: 'Ingeniero Luiggi', lat: -35.3833, lng: -64.4667, cp: '6205' },
      { name: 'Winifreda', lat: -36.2269, lng: -64.2344, cp: '6313' },
      { name: 'Trenel', lat: -35.6989, lng: -64.1339, cp: '6369' },
      { name: 'Rancul', lat: -35.0667, lng: -64.6833, cp: '6214' },
      { name: 'Santa Isabel', lat: -36.2300, lng: -66.8800, cp: '6323' }
    ]
  },

  // ==========================================
  // 22. SANTA CRUZ
  // ==========================================
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
      { name: 'Río Gallegos (Polo San Martín / Ruta 3)', lat: -51.6226, lng: -69.2181, cp: '9400' },
      { name: 'Caleta Olivia', lat: -46.4389, lng: -67.5281, cp: '9011' },
      { name: 'El Calafate', lat: -50.3378, lng: -72.2647, cp: '9405' },
      { name: 'Pico Truncado', lat: -46.7947, lng: -67.9575, cp: '9015' },
      { name: 'Las Heras (Santa Cruz)', lat: -46.5417, lng: -68.9358, cp: '9017' },
      { name: 'Puerto Deseado', lat: -47.7503, lng: -65.8942, cp: '9050' },
      { name: 'Perito Moreno', lat: -46.5892, lng: -70.9292, cp: '9040' },
      { name: 'Puerto San Julián', lat: -49.3064, lng: -67.7275, cp: '9310' },
      { name: 'Río Turbio', lat: -51.5358, lng: -72.2858, cp: '9407' },
      { name: '28 de Noviembre', lat: -51.6500, lng: -72.3000, cp: '9407' },
      { name: 'Comandante Luis Piedrabuena', lat: -49.9833, lng: -68.9167, cp: '9303' },
      { name: 'Puerto Santa Cruz', lat: -50.0192, lng: -68.5222, cp: '9300' },
      { name: 'El Chaltén', lat: -49.3314, lng: -72.8864, cp: '9301' },
      { name: 'Los Antiguos', lat: -46.5458, lng: -71.6253, cp: '9041' },
      { name: 'Gobernador Gregores', lat: -48.7500, lng: -70.2500, cp: '9311' }
    ]
  },

  // ==========================================
  // 23. TIERRA DEL FUEGO
  // ==========================================
  {
    id: 'tierra-del-fuego',
    name: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
    shortName: 'Tierra del Fuego',
    inspectionType: 'RTO',
    inspectionFullName: 'Revisión Técnica Obligatoria (Tierra del Fuego)',
    inspectionUrl: 'https://ushuaia.gob.ar',
    lat: -54.8019,
    lng: -68.3030,
    cities: [
      { name: 'Ushuaia', lat: -54.8019, lng: -68.3030, cp: '9410' },
      { name: 'Río Grande', lat: -53.7877, lng: -67.7094, cp: '9420' },
      { name: 'Tolhuin', lat: -54.5106, lng: -67.1958, cp: '9412' }
    ]
  },

  // ==========================================
  // 24. FORMOSA
  // ==========================================
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
      { name: 'Formosa Capital', lat: -26.1775, lng: -58.1781, cp: '3600' },
      { name: 'Clorinda', lat: -25.2847, lng: -57.7183, cp: '3610' },
      { name: 'Pirané', lat: -25.7333, lng: -59.1083, cp: '3620' },
      { name: 'El Colorado', lat: -26.3083, lng: -59.3722, cp: '3603' },
      { name: 'Las Lomitas', lat: -24.7078, lng: -60.5939, cp: '3630' },
      { name: 'Ingeniero Juárez', lat: -23.9000, lng: -61.8500, cp: '3636' },
      { name: 'Ibarreta', lat: -25.2158, lng: -59.8594, cp: '3624' },
      { name: 'Laguna Blanca', lat: -25.1333, lng: -58.2500, cp: '3613' },
      { name: 'Comandante Fontana', lat: -25.3333, lng: -59.6833, cp: '3622' },
      { name: 'Palo Santo', lat: -25.5633, lng: -59.4239, cp: '3621' },
      { name: 'San Martín 2', lat: -24.4333, lng: -59.9333, cp: '3632' },
      { name: 'Estanislao del Campo', lat: -25.0486, lng: -60.0917, cp: '3626' },
      { name: 'Herradura', lat: -26.4950, lng: -58.3117, cp: '3601' },
      { name: 'Pozo del Tigre', lat: -24.8975, lng: -60.3242, cp: '3628' },
      { name: 'Riacho He Hé', lat: -25.3589, lng: -58.2917, cp: '3611' }
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
  lng: -58.4418,
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
  return Math.round(d * 10) / 10;
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
