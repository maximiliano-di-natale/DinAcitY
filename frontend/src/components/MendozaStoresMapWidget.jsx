import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Store,
  Phone,
  MessageCircle,
  Clock,
  Star,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  Car,
  Navigation,
  Compass,
  CheckCircle2,
  Wrench,
  Fuel,
  Info,
  ChevronRight,
  Layers
} from 'lucide-react';
import { MENDOZA_QUOTE_STORES } from '../services/clientFallbackService.js';

// Lista ampliada con coordenadas relativas (x, y en %) sobre el mapa del Gran Mendoza
const ENRICHED_MENDOZA_STORES = [
  ...MENDOZA_QUOTE_STORES.map((s) => {
    // Asignar coordenadas geográficas y relativas sobre el mapa del Gran Mendoza
    let coords = { x: 45, y: 55, lat: -32.925, lng: -68.840 };
    let areaTag = 'godoy-cruz';

    if (s.address.toLowerCase().includes('rodríguez peña') || s.zone.toLowerCase().includes('rodríguez peña')) {
      coords = { x: 55, y: 65, lat: -32.940, lng: -68.805 };
      areaTag = 'rodriguez-pena';
    } else if (s.address.toLowerCase().includes('san martín sur') || s.zone.toLowerCase().includes('godoy cruz')) {
      coords = { x: 40, y: 58, lat: -32.920, lng: -68.845 };
      areaTag = 'godoy-cruz';
    } else if (s.address.toLowerCase().includes('guaymallén') || s.zone.toLowerCase().includes('guaymallén')) {
      coords = { x: 60, y: 38, lat: -32.898, lng: -68.815 };
      areaTag = 'guaymallen';
    }

    return {
      ...s,
      mapCoords: coords,
      areaTag,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + ' ' + s.address)}`
    };
  }),
  // Nuevos puntos estratégicos adicionales de Mendoza
  {
    id: 'mendoza-frenos-rodriguez-pena',
    name: 'Mendoza Frenos & Embragues Pesados',
    category: 'Especialista en Frenos y Embragues',
    badge: '📍 Polo Carril Rodríguez Peña',
    rating: 4.8,
    reviews: 390,
    address: 'Carril Rodríguez Peña 2820, Godoy Cruz, Mendoza',
    zone: 'Carril Rodríguez Peña (Godoy Cruz)',
    phone: '5492614978800',
    whatsapp: '5492614978800',
    schedule: 'Lun a Vie 8:30 - 18:30 | Sáb 8:30 - 13:00',
    specialties: ['Discos y Pastillas de Freno', 'Rectificación de Campanas', 'Embragues Reforzados', 'Válvulas de Aire'],
    trustedBrands: ['LUK', 'Valeo', 'Fremax', 'Raybestos', 'Cobreq'],
    verified: true,
    mapCoords: { x: 52, y: 64, lat: -32.938, lng: -68.810 },
    areaTag: 'rodriguez-pena',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mendoza+Frenos+Carril+Rodriguez+Pena+Mendoza'
  },
  {
    id: 'baterias-cuyo-capital',
    name: 'Centro de Baterías Cuyo (Auxilio y Mostrador)',
    category: 'Especialista en Acumuladores y Baterías',
    badge: '⚡ Auxilio & Instalación Inmediata',
    rating: 4.9,
    reviews: 580,
    address: 'Av. Brasil 340, Ciudad de Mendoza',
    zone: 'Ciudad / Capital',
    phone: '5492614234400',
    whatsapp: '5492614234400',
    schedule: 'Lun a Sáb 8:00 - 20:00 (Corrido)',
    specialties: ['Baterías 12V 45Ah a 110Ah', 'Instalación a Domicilio', 'Diagnóstico de Alternador y Burro'],
    trustedBrands: ['Moura', 'Willard', 'Bosch', 'Varta', 'Prestolite'],
    verified: true,
    mapCoords: { x: 42, y: 32, lat: -32.895, lng: -68.838 },
    areaTag: 'ciudad',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Baterias+Cuyo+Av+Brasil+Mendoza'
  },
  {
    id: 'repuestos-alem-ciudad',
    name: 'Autopartes Alem & San Juan',
    category: 'Casa de Repuestos Multimarca Ciudad',
    badge: '🏛️ Tradición Centro Mendoza',
    rating: 4.7,
    reviews: 410,
    address: 'Calle San Juan 780, Ciudad de Mendoza',
    zone: 'Ciudad / Capital',
    phone: '5492614298811',
    whatsapp: '5492614298811',
    schedule: 'Lun a Vie 8:30 - 13:00 y 16:30 - 20:00 | Sáb 9:00 - 13:00',
    specialties: ['Cerrajería y Levantavidrios', 'Ópticas y Faros', 'Paragolpes y Chapa', 'Accesorios de Interior'],
    trustedBrands: ['Vic', 'Fitam', 'Arteb', 'Depo', 'Poli-Bujes'],
    verified: true,
    mapCoords: { x: 44, y: 28, lat: -32.889, lng: -68.835 },
    areaTag: 'ciudad',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Autopartes+Alem+San+Juan+Mendoza'
  }
];

export function MendozaStoresMapWidget({ vehicle, onNavigateCotizador }) {
  const [selectedZone, setSelectedZone] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';
  const currentPatente = vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP';
  const currentEngine = vehicle?.engine?.name || vehicle?.data?.engine?.name || '1.6 8V MSI Naftero (101 CV)';

  // Zonas de filtrado en Mendoza
  const zones = [
    { id: 'todos', label: 'Todos los Mostradores', icon: '📍', count: ENRICHED_MENDOZA_STORES.length },
    { id: 'rodriguez-pena', label: 'Polo Carril Rodríguez Peña', icon: '🏭', badge: 'El polo más grande de Cuyo' },
    { id: 'godoy-cruz', label: 'Godoy Cruz (San Martín Sur)', icon: '🏢', badge: 'Concesionarios y Mostradores' },
    { id: 'guaymallen', label: 'Guaymallén (Acceso Este)', icon: '🛣️', badge: 'Gran Mendoza Este' },
    { id: 'ciudad', label: 'Ciudad / Capital', icon: '🏛️', badge: 'Zona Céntrica' },
    { id: 'oficiales', label: 'Concesionarios Oficiales', icon: '💎', badge: 'Garantía de Fábrica' },
    { id: 'pesados', label: 'Pick-Ups & Pesados (4x4)', icon: '🚛', badge: 'Hilux, Ranger, Amarok' }
  ];

  // Filtrado reactivo de tiendas
  const filteredStores = useMemo(() => {
    return ENRICHED_MENDOZA_STORES.filter((store) => {
      // Filtro por zona
      if (selectedZone === 'rodriguez-pena' && store.areaTag !== 'rodriguez-pena') return false;
      if (selectedZone === 'godoy-cruz' && store.areaTag !== 'godoy-cruz') return false;
      if (selectedZone === 'guaymallen' && store.areaTag !== 'guaymallen') return false;
      if (selectedZone === 'ciudad' && store.areaTag !== 'ciudad') return false;
      if (selectedZone === 'oficiales' && !store.category.toLowerCase().includes('concesionario')) return false;
      if (selectedZone === 'pesados' && !store.category.toLowerCase().includes('pesad') && !store.specialties.some(s => s.toLowerCase().includes('pesad'))) return false;

      // Filtro por texto de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = store.name.toLowerCase().includes(q);
        const matchesAddress = store.address.toLowerCase().includes(q);
        const matchesCategory = store.category.toLowerCase().includes(q);
        const matchesSpecialties = store.specialties.some((sp) => sp.toLowerCase().includes(q));
        const matchesBrands = store.trustedBrands.some((br) => br.toLowerCase().includes(q));
        return matchesName || matchesAddress || matchesCategory || matchesSpecialties || matchesBrands;
      }

      return true;
    });
  }, [selectedZone, searchQuery]);

  // Tienda activa para el pin destacado
  const activeStore = useMemo(() => {
    if (!selectedStoreId) return null;
    return ENRICHED_MENDOZA_STORES.find((s) => s.id === selectedStoreId) || null;
  }, [selectedStoreId]);

  // Mensaje de WhatsApp prearmado con el auto activo
  const handleOpenWhatsApp = (store) => {
    const lines = [
      `👋 Hola ${store.name}, te consulto desde DinAcitY Mendoza:`,
      `🚗 *Vehículo:* ${currentVehicleTitle}`,
      `🇦🇷 *Patente:* ${currentPatente}`,
      `⚙️ *Motor:* ${currentEngine}`,
      ``,
      `¿Tienen disponibilidad en su mostrador de ${store.address}?`,
      `¿Cuál es el precio actual contado / transferencia o con tarjeta?`,
      `¡Muchas gracias!`
    ].join('\n');

    const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Circuito de Mostradores Mendoza */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-blue-500/30">
        
        {/* Glow de fondo */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 fill-white" />
                Mapa de Mostradores Oficiales
              </span>
              <span className="text-xs font-bold text-blue-200 bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                📍 Polo Carril Rodríguez Peña & Gran Mendoza
              </span>
              <span className="text-xs font-bold text-emerald-200 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                ✓ Contacto directo y ruta Google Maps
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Circuito de Casas de Repuestos y Concesionarios de Mendoza
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Encontrá el mostrador más cercano a tu ubicación en el <strong>Polo del Carril Rodríguez Peña, Godoy Cruz, Guaymallén y Capital</strong>. Consultá disponibilidad por WhatsApp o abrí la ruta directa en Google Maps para retirar en el día.
            </p>
          </div>

          {/* Ficha del Vehículo Vinculado para la Consulta */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 shrink-0 max-w-md w-full sm:w-auto shadow-xl">
            <span className="text-[11px] font-black uppercase text-yellow-300 tracking-wider flex items-center gap-1.5 mb-1.5">
              <Car className="w-3.5 h-3.5" />
              Vehículo para Consultas
            </span>

            <p className="font-black text-base text-white">
              {currentVehicleTitle}
            </p>

            <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-mono bg-blue-900/90 text-white px-2.5 py-0.5 rounded font-black border border-blue-400/50">
                🇦🇷 {currentPatente}
              </span>
              <span className="text-slate-300 text-[11px]">
                {currentEngine}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Barra de Filtros y Buscador */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-3">
        
        {/* Buscador de texto */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de negocio, calle, repuesto o marca (ej: Rodríguez Peña, Yacopini, Frenos, Embrague, Toyota, Valeo)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Chips de Zonas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {zones.map((zone) => {
            const isActive = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZone(zone.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 border cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 scale-[1.02]'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>{zone.icon}</span>
                <span>{zone.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN INTERACTIVA: MAPA VECTORIZADO DE MENDOZA + LISTA DE MOSTRADORES  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMNA IZQUIERDA: MAPA VECTORIAL DEL GRAN MENDOZA (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-900/95 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-3 sticky top-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Mapa Satelital del Gran Mendoza
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
              {filteredStores.length} puntos activos
            </span>
          </div>

          {/* Canvas SVG / Contenedor del Mapa Interactivo */}
          <div className="relative w-full h-[360px] sm:h-[400px] bg-[#091122] rounded-xl overflow-hidden border border-slate-800 shadow-inner select-none">
            
            {/* Rutas y Accesos Principales de Mendoza en SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              {/* Acceso Sur / Ruta 40 (Norte a Sur) */}
              <line x1="42%" y1="5%" x2="42%" y2="95%" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 4" />
              
              {/* Acceso Este / Ruta 7 (Oeste a Este) */}
              <line x1="20%" y1="36%" x2="95%" y2="40%" stroke="#10b981" strokeWidth="4" strokeDasharray="6 4" />
              
              {/* Carril Rodríguez Peña (El Polo de Repuestos) */}
              <line x1="25%" y1="64%" x2="85%" y2="66%" stroke="#ef4444" strokeWidth="6" />

              {/* Av. San Martín (Eje Godoy Cruz - Ciudad) */}
              <line x1="38%" y1="15%" x2="38%" y2="85%" stroke="#f59e0b" strokeWidth="3" />
            </svg>

            {/* Etiquetas Geográficas de Mendoza */}
            <div className="absolute top-4 left-6 text-[10px] font-black uppercase text-slate-400 tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
              🏛️ Ciudad de Mendoza
            </div>

            <div className="absolute top-1/3 right-6 text-[10px] font-black uppercase text-emerald-400/90 tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
              🛣️ Acceso Este (Guaymallén)
            </div>

            <div className="absolute top-[52%] left-6 text-[10px] font-black uppercase text-amber-400/90 tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
              🏢 Godoy Cruz (San Martín Sur)
            </div>

            {/* Etiqueta Destacada del Polo Rodríguez Peña */}
            <div className="absolute top-[68%] left-[28%] text-[10px] font-black uppercase text-white tracking-wider bg-red-600/90 border border-red-400 px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
              <span>🏭</span> Polo Carril Rodríguez Peña
            </div>

            <div className="absolute bottom-3 right-6 text-[10px] font-black uppercase text-blue-400/90 tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
              📍 Maipú / Coquimbito
            </div>

            {/* PINES INTERACTIVOS DE CADA MOSTRADOR */}
            {filteredStores.map((st) => {
              const isSelected = selectedStoreId === st.id;
              const isOfficial = st.category.toLowerCase().includes('concesionario');
              const isHeavy = st.areaTag === 'rodriguez-pena';

              return (
                <div
                  key={st.id}
                  style={{
                    left: `${st.mapCoords.x}%`,
                    top: `${st.mapCoords.y}%`
                  }}
                  onClick={() => setSelectedStoreId(isSelected ? null : st.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                  title={`${st.name} (${st.address})`}
                >
                  {/* Pin visual */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs shadow-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-yellow-400 text-slate-950 border-white ring-4 ring-yellow-400/50 scale-110'
                      : isOfficial
                      ? 'bg-indigo-600 text-white border-indigo-300 shadow-indigo-600/50'
                      : isHeavy
                      ? 'bg-red-600 text-white border-red-300 shadow-red-600/50'
                      : 'bg-blue-600 text-white border-blue-300 shadow-blue-600/50'
                  }`}>
                    {isOfficial ? '💎' : isHeavy ? '🏭' : '📍'}
                  </div>

                  {/* Tooltip flotante al pasar el mouse o al estar seleccionado */}
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-2.5 rounded-xl shadow-2xl border border-slate-700 text-center pointer-events-none transition-all ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                  }`}>
                    <p className="font-extrabold text-[11px] leading-tight text-white">{st.name}</p>
                    <p className="text-[9px] text-slate-300 truncate mt-0.5">{st.address}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-yellow-300">
                      ★ {st.rating} ({st.reviews} opiniones)
                    </span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Leyenda de referencias del mapa */}
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 text-[10px] text-slate-300 grid grid-cols-3 gap-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>Polo Rodríguez Peña</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
              <span>Concesionarias</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              <span>Multimarca MZA</span>
            </div>
          </div>

          {/* Botón para abrir Google Maps en vivo */}
          <a
            href="https://www.google.com/maps/search/casas+de+repuestos+automotor+Mendoza+Carril+Rodriguez+Pena"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Explorar todo el Gran Mendoza en Google Maps ↗</span>
          </a>

        </div>

        {/* COLUMNA DERECHA: TARJETAS DE MOSTRADOR CON DATOS COMPLETOS (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Mostrando <strong className="text-white">{filteredStores.length}</strong> locales en Mendoza
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              ✓ Precios de mostrador directo
            </span>
          </div>

          {/* Listado de Mostradores */}
          <div className="space-y-3.5">
            {filteredStores.map((store) => {
              const isSelected = selectedStoreId === store.id;

              return (
                <div
                  key={store.id}
                  id={`store-card-${store.id}`}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`bg-slate-800/90 rounded-2xl p-4 sm:p-5 border transition-all duration-200 space-y-3 relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'border-yellow-400/80 shadow-2xl shadow-yellow-400/10 ring-2 ring-yellow-400/40 bg-slate-800'
                      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/95 shadow-lg'
                  }`}
                >
                  
                  {/* Badge de Cabecera */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-900/80 text-blue-200 border border-blue-500/30">
                          {store.badge}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {store.category}
                        </span>
                      </div>
                      
                      <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                        {store.name}
                      </h4>

                      <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{store.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/30 text-xs font-black">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{store.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {store.reviews} opiniones
                      </span>
                    </div>
                  </div>

                  {/* Horario de Atención y Estado en Vivo */}
                  <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300 text-[11px] font-medium">{store.schedule}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Abierto en mostrador
                    </span>
                  </div>

                  {/* Especialidades del Negocio */}
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Especialidades de Mostrador:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {store.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-700/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Marcas Homologadas */}
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Marcas Distribuidas:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-blue-300 font-semibold">
                      {store.trustedBrands.map((brand, i) => (
                        <span key={i} className="bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded text-[10px]">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botones de Acción Directa */}
                  <div className="pt-2 border-t border-slate-700/80 flex flex-col sm:flex-row items-center gap-2.5">
                    
                    {/* Botón WhatsApp */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenWhatsApp(store);
                      }}
                      className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Consultar Stock por WhatsApp</span>
                    </button>

                    {/* Botón Google Maps */}
                    <a
                      href={store.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Cómo llegar (Google Maps) ↗</span>
                    </a>

                    {/* Botón Teléfono */}
                    <a
                      href={`tel:${store.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition cursor-pointer flex items-center justify-center"
                      title={`Llamar a ${store.name}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
