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
import { ARGENTINA_NATIONAL_STORES } from '../services/storesDataService.js';
import {
  calcDistanceKm,
  formatDistance,
  getSavedUserLocation
} from '../services/geolocationService.js';

// Enriquecer todas las tiendas con URLs de Google Maps y coordenadas
const ENRICHED_NATIONAL_STORES = ARGENTINA_NATIONAL_STORES.map((s) => ({
  ...s,
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    s.name + ' ' + s.address
  )}`
}));

export function MendozaStoresMapWidget({
  vehicle,
  userLocation: propUserLocation,
  onNavigateCotizador,
  onOpenLocationModal
}) {
  const [selectedRegion, setSelectedRegion] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const userLocation = useMemo(() => {
    return propUserLocation || getSavedUserLocation();
  }, [propUserLocation]);

  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';
  const currentPatente = vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP';
  const currentEngine = vehicle?.engine?.name || vehicle?.data?.engine?.name || '1.6 8V MSI Naftero (101 CV)';

  // Regiones principales y Polos de Argentina
  const regions = [
    { id: 'todos', label: 'Toda la Argentina', icon: '🇦🇷', badge: 'Red Nacional' },
    { id: 'caba', label: 'CABA & Polo Warnes', icon: '🏛️', badge: 'El polo más grande del país' },
    { id: 'buenos-aires', label: 'Buenos Aires & GBA', icon: '🏭', badge: 'Norte, Oeste, Sur y Costa' },
    { id: 'cordoba', label: 'Córdoba Capital', icon: '📍', badge: 'Polo Av. Las Heras' },
    { id: 'santa-fe', label: 'Santa Fe & Rosario', icon: '⚓', badge: 'Polo Echesortu y Centro' },
    { id: 'mendoza', label: 'Mendoza (Rodríguez Peña)', icon: '🍇', badge: 'Polo Carril Rodríguez Peña' },
    { id: 'tucuman', label: 'Tucumán & NOA', icon: '🌄', badge: 'Polo Av. Avellaneda' },
    { id: 'neuquen', label: 'Neuquén & Patagonia', icon: '🏔️', badge: 'Flotas y Pick-Ups 4x4' }
  ];

  // Cálculo de distancias y ordenamiento
  const storesWithDistance = useMemo(() => {
    return ENRICHED_NATIONAL_STORES.map((store) => {
      let distanceKm = null;
      if (userLocation?.lat && userLocation?.lng && store.lat && store.lng) {
        distanceKm = calcDistanceKm(
          userLocation.lat,
          userLocation.lng,
          store.lat,
          store.lng
        );
      }
      return {
        ...store,
        distanceKm
      };
    }).sort((a, b) => {
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [userLocation]);

  // Filtrado de tiendas
  const filteredStores = useMemo(() => {
    return storesWithDistance.filter((store) => {
      if (selectedRegion !== 'todos' && store.provinceId !== selectedRegion) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = store.name.toLowerCase().includes(q);
        const matchesAddress = store.address.toLowerCase().includes(q);
        const matchesCity = (store.city || '').toLowerCase().includes(q);
        const matchesCategory = store.category.toLowerCase().includes(q);
        const matchesSpecialties = store.specialties.some((sp) => sp.toLowerCase().includes(q));
        const matchesBrands = (store.trustedBrands || []).some((b) => b.toLowerCase().includes(q));

        if (!matchesName && !matchesAddress && !matchesCity && !matchesCategory && !matchesSpecialties && !matchesBrands) {
          return false;
        }
      }

      return true;
    });
  }, [storesWithDistance, selectedRegion, searchQuery]);

  const selectedStore = useMemo(() => {
    if (!selectedStoreId) return filteredStores[0] || null;
    return filteredStores.find((s) => s.id === selectedStoreId) || filteredStores[0] || null;
  }, [selectedStoreId, filteredStores]);

  const handleOpenWhatsApp = (store) => {
    const buyerLoc = userLocation
      ? `${userLocation.cityName || ''}, ${userLocation.provinceName || ''}`
      : 'Argentina';

    const msg = [
      `👋 Hola ${store.name}, te consulto desde el Mapa y Directorio de DinAcitY Argentina:`,
      `🚗 *Vehículo:* ${currentVehicleTitle}`,
      `🇦🇷 *Patente:* ${currentPatente}`,
      `⚙️ *Motor:* ${currentEngine}`,
      `📍 *Ubicación del comprador:* ${buyerLoc}`,
      ``,
      `Quisiera consultarles si tienen stock en su mostrador (${store.address}) o envíos a mi zona.`,
      `¡Muchas gracias!`
    ].join('\n');

    const cleanPhone = (store.whatsapp || store.phone || '').replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Encabezado Principal */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-blue-500/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                Red Nacional de Mostradores
              </span>
              <span className="text-xs font-bold text-white bg-black/30 px-2.5 py-0.5 rounded-full border border-white/20">
                🇦🇷 Cobertura Toda la Argentina
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                ✓ Distancia calculada a tu ubicación
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Directorio y Mapa Interactivo de Mostradores y Concesionarias Oficiales
            </h2>

            <p className="text-sm text-blue-100 leading-relaxed">
              Explorá las casas de repuestos de los principales polos automotores del país (Polo Warnes CABA, Rodríguez Peña Mendoza, Las Heras Córdoba, Echesortu Rosario, etc.) con sus teléfonos de mostrador, WhatsApp directo y cómo llegar.
            </p>
          </div>

          {/* Chip de Ubicación del Usuario */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shrink-0 max-w-md w-full sm:w-auto shadow-inner text-xs">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                Tu Ubicación
              </span>
              {onOpenLocationModal && (
                <button
                  type="button"
                  onClick={onOpenLocationModal}
                  className="text-white hover:text-yellow-300 font-bold underline cursor-pointer"
                >
                  Cambiar
                </button>
              )}
            </div>

            <p className="font-black text-sm text-white">
              {userLocation?.displayName || `${userLocation?.cityName || 'CABA'}, ${userLocation?.provinceName || 'Argentina'}`}
            </p>
            <p className="text-[11px] text-blue-200 mt-0.5">
              {userLocation?.isGps ? '✓ Ubicación detectada por GPS' : 'Localidad seleccionada'}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Selector de Regiones */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5">
        
        {/* Input de Búsqueda */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de negocio, calle, ciudad, marca (ej: Warnes, Toyota, Corven, Pastillas, Rosario, Córdoba)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Chips de Regiones / Polos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {regions.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border cursor-pointer flex items-center gap-1.5 ${
                selectedRegion === reg.id
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 border-slate-700'
              }`}
            >
              <span>{reg.icon}</span>
              <span>{reg.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Grid de 2 Columnas: Lista de Tiendas y Tarjeta Detallada con Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda: Listado de Tiendas (5 columnas) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Mostrando {filteredStores.length} mostradores</span>
            <span className="text-emerald-400 font-semibold">Ordenados por cercanía</span>
          </div>

          {filteredStores.map((store) => {
            const isSelected = selectedStore?.id === store.id;
            return (
              <div
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/70 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/40'
                    : 'bg-slate-800/85 hover:bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-800/60">
                        {store.badge}
                      </span>
                      {store.distanceKm != null && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {formatDistance(store.distanceKm)}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-black text-white">{store.name}</h4>
                    <p className="text-xs text-slate-400">{store.category}</p>
                  </div>

                  <span className="text-xs font-black text-amber-400 shrink-0">
                    ★ {store.rating}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-xs text-slate-300 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] truncate">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">{store.schedule}</span>
                  </div>
                </div>

                {/* Especialidades chips */}
                <div className="mt-2 flex items-center gap-1 flex-wrap">
                  {store.specialties.slice(0, 3).map((sp) => (
                    <span
                      key={sp}
                      className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 text-slate-300 border border-slate-700"
                    >
                      {sp}
                    </span>
                  ))}
                  {store.specialties.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-bold">
                      +{store.specialties.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Columna Derecha: Tarjeta Expandida con Mapa y Botones de Acción (7 columnas) */}
        <div className="lg:col-span-7">
          {selectedStore ? (
            <div className="bg-slate-850 bg-slate-800/95 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 sticky top-24">
              
              {/* Encabezado de la tienda seleccionada */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                      {selectedStore.badge}
                    </span>
                    {selectedStore.distanceKm != null && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <Navigation className="w-2.5 h-2.5" />
                        Distancia: {formatDistance(selectedStore.distanceKm)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white">{selectedStore.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">{selectedStore.category}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-amber-400">
                    ★ {selectedStore.rating} / 5.0
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {selectedStore.reviews} reseñas verificadas
                  </span>
                </div>
              </div>

              {/* Datos de contacto y ubicación */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">{selectedStore.address}</span>
                    <span className="text-slate-400 text-[11px]">{selectedStore.city}, {selectedStore.provinceName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{selectedStore.schedule}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-mono">{selectedStore.phone}</span>
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Especialidades de Mostrador:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedStore.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-700"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Marcas Homologadas */}
              {selectedStore.trustedBrands && (
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Marcas Oficiales y Homologadas:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedStore.trustedBrands.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950/60 text-blue-300 border border-blue-900/60"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(selectedStore)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs sm:text-sm shadow-[0_0_18px_rgba(16,185,129,0.35)] transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Consultar por WhatsApp</span>
                </button>

                <a
                  href={selectedStore.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Cómo llegar en Google Maps ↗</span>
                </a>
              </div>

              {onNavigateCotizador && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={onNavigateCotizador}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                  >
                    ← Ir al Cotizador Express para pedir presupuesto formal
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-12 text-center text-slate-400">
              Seleccioná un mostrador de la lista para ver todos sus detalles
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// Exportación alternativa para coherencia de nombres
export { MendozaStoresMapWidget as NationalStoresMapWidget };
