import React, { useState, useMemo } from 'react';
import {
  MessageCircle,
  Store,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  Check,
  Search,
  Wrench,
  Sparkles,
  Car,
  ShieldCheck,
  ChevronRight,
  Filter,
  Navigation,
  Compass,
  ArrowUpDown,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { ARGENTINA_NATIONAL_STORES } from '../services/storesDataService.js';
import {
  calcDistanceKm,
  formatDistance,
  getSavedUserLocation
} from '../services/geolocationService.js';

export function QuoteRequestWidget({
  vehicle,
  userLocation: propUserLocation,
  onOpenLocationModal,
  onOpenPatenteModal,
  onSelectPart,
  onNavigateMapa,
  onNavigateKits
}) {
  const [partName, setPartName] = useState('Kit de Distribución con Bomba de Agua');
  const [scopeFilter, setScopeFilter] = useState('cercanos'); // 'cercanos' | 'provincia' | 'nacional'
  const [categoryFilter, setCategoryFilter] = useState('todos'); // 'todos' | 'multimarca' | 'oficiales' | 'frenos' | 'baterias' | 'pesados'
  const [copiedStoreId, setCopiedStoreId] = useState(null);
  const [customNotes, setCustomNotes] = useState('');
  const [searchStoreQuery, setSearchStoreQuery] = useState('');

  // Ubicación del usuario activa (obtenida por prop o de localStorage)
  const userLocation = useMemo(() => {
    return propUserLocation || getSavedUserLocation();
  }, [propUserLocation]);

  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';

  const currentPatente = vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP';
  const currentEngine = vehicle?.engine?.name || vehicle?.data?.engine?.name || '1.6 8V MSI Naftero (101 CV)';

  const quickParts = [
    { label: 'Kit Distribución + Bomba', value: 'Kit de Distribución y Bomba de Agua' },
    { label: 'Kit de Embrague', value: 'Kit de Embrague (Placa, Disco y Crapodina)' },
    { label: 'Pastillas de Freno', value: 'Juego de Pastillas de Freno Delanteras' },
    { label: 'Amortiguadores', value: 'Par de Amortiguadores Delanteros' },
    { label: 'Radiador de Agua', value: 'Radiador de Agua de Motor' },
    { label: 'Kit Filtros + Aceite', value: 'Kit 4 Filtros (Aceite, Aire, Combustible, Polen) + 4L Aceite Sintético' },
    { label: 'Batería 12V', value: 'Batería 12V 65Ah / 75Ah Reforzada' },
    { label: 'Bujías y Cables', value: 'Juego de 4 Bujías de Encendido y Cables' },
    { label: 'Termostato con Caja', value: 'Termostato de Refrigeración con Caja' }
  ];

  // Tiendas con distancia calculada y ordenadas por proximidad
  const storesWithDistance = useMemo(() => {
    return ARGENTINA_NATIONAL_STORES.map((store) => {
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

  // Filtrado reactivo por alcance geográfico y categoría
  const filteredStores = useMemo(() => {
    return storesWithDistance.filter((st) => {
      // Filtro de alcance
      if (scopeFilter === 'cercanos') {
        // Si hay tiendas a menos de 45 km, mostrarlas; si el usuario está en zona sin tiendas inmediatas, mostrar las 6 más cercanas
        if (st.distanceKm != null && st.distanceKm > 45) {
          // Si ninguna tienda entra en 45km, mantener al menos las más próximas
          const nearestDistance = storesWithDistance[0]?.distanceKm || 0;
          if (nearestDistance > 45) {
            // Mostrar las primeras 8
            const topIndex = storesWithDistance.findIndex((s) => s.id === st.id);
            if (topIndex >= 8) return false;
          } else {
            return false;
          }
        }
      } else if (scopeFilter === 'provincia') {
        if (userLocation?.provinceId && st.provinceId !== userLocation.provinceId) {
          // Si no coincide la provincia
          return false;
        }
      }

      // Filtro de categoría
      if (categoryFilter === 'oficiales' && !st.category.toLowerCase().includes('concesionario')) {
        return false;
      }
      if (categoryFilter === 'multimarca' && st.category.toLowerCase().includes('concesionario')) {
        return false;
      }
      if (categoryFilter === 'frenos' && !st.specialties.some(sp => sp.toLowerCase().includes('freno') || sp.toLowerCase().includes('embrague') || sp.toLowerCase().includes('suspensión'))) {
        return false;
      }
      if (categoryFilter === 'baterias' && !st.specialties.some(sp => sp.toLowerCase().includes('batería') || sp.toLowerCase().includes('electricidad') || sp.toLowerCase().includes('encendido') || sp.toLowerCase().includes('inyección'))) {
        return false;
      }
      if (categoryFilter === 'pesados' && !st.category.toLowerCase().includes('pesad') && !st.specialties.some(sp => sp.toLowerCase().includes('hilux') || sp.toLowerCase().includes('pesad') || sp.toLowerCase().includes('4x4'))) {
        return false;
      }

      // Filtro por texto de búsqueda libre
      if (searchStoreQuery.trim()) {
        const q = searchStoreQuery.toLowerCase().trim();
        const matchesName = st.name.toLowerCase().includes(q);
        const matchesAddress = st.address.toLowerCase().includes(q);
        const matchesCity = (st.city || '').toLowerCase().includes(q);
        const matchesProv = (st.provinceName || '').toLowerCase().includes(q);
        const matchesSpec = st.specialties.some(s => s.toLowerCase().includes(q));
        const matchesBrand = (st.trustedBrands || []).some(b => b.toLowerCase().includes(q));
        if (!matchesName && !matchesAddress && !matchesCity && !matchesProv && !matchesSpec && !matchesBrand) {
          return false;
        }
      }

      return true;
    });
  }, [storesWithDistance, scopeFilter, categoryFilter, userLocation, searchStoreQuery]);

  // Generador de Mensaje Profesional para WhatsApp con Ubicación Real del Comprador
  const generateWhatsAppMessage = (store) => {
    const buyerLocationStr = userLocation
      ? `${userLocation.cityName || ''}, ${userLocation.provinceName || userLocation.provinceId || ''}${userLocation.cp ? ` (CP ${userLocation.cp})` : ''}`.trim()
      : 'Argentina';

    const distStr = store.distanceKm != null ? ` (aprox. ${formatDistance(store.distanceKm)})` : '';

    const lines = [
      `👋 Hola ${store.name}, te consulto desde el Cotizador de DinAcitY Argentina:`,
      `🔧 *Repuesto buscado:* ${partName}`,
      `🚗 *Vehículo:* ${currentVehicleTitle}`,
      vehicle?.currentKm ? `⏱️ *Kilometraje actual:* ${(vehicle.currentKm).toLocaleString('es-AR')} km` : null,
      currentPatente && !currentPatente.startsWith('AUTO') ? `🇦🇷 *Patente:* ${currentPatente}` : null,
      `⚙️ *Motor:* ${currentEngine}`,
      `📍 *Ubicación del comprador:* ${buyerLocationStr}${distStr}`,
      customNotes ? `📝 *Detalle:* ${customNotes}` : null,
      ``,
      `¿Tienen disponibilidad en mostrador o para envío a mi zona, y cuál es el precio actual contado / transferencia o tarjeta?`,
      `¡Muchas gracias!`
    ].filter(Boolean).join('\n');

    return lines;
  };

  const handleCopyMessage = (store) => {
    const msg = generateWhatsAppMessage(store);
    navigator.clipboard.writeText(msg);
    setCopiedStoreId(store.id);
    setTimeout(() => setCopiedStoreId(null), 3000);
  };

  const handleOpenWhatsApp = (store) => {
    const msg = generateWhatsAppMessage(store);
    const cleanPhone = (store.whatsapp || store.phone || '').replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Superior Cotizador Estilo PedidosYa / TurismoCity a Nivel Nacional */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-red-500/30">
        
        {/* Subtle Background Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white text-red-700 shadow-sm">
                Opción 1 • Cotizador Express
              </span>
              <span className="text-xs font-bold text-white bg-black/25 px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                <span>🇦🇷 Cobertura Toda la Argentina</span>
              </span>
              <span className="text-xs font-bold text-emerald-200 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                ✓ Precios reales de mostrador sin intermediarios
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Pedí cotización a las casas de repuestos y concesionarias más cercanas en 1 Click
            </h2>

            <p className="text-sm text-red-100 leading-relaxed">
              Detectamos o elegís tu localidad para conectarte directamente por WhatsApp con los mostradores de tu zona. Armamos automáticamente el mensaje profesional con tu <strong>patente, motor, chasis y ubicación</strong>.
            </p>
          </div>

          {/* Ficha del Vehículo Vinculado */}
          <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-xl p-4 shrink-0 max-w-md w-full sm:w-auto shadow-inner">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-black uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Vehículo a Cotizar
              </span>
              {onOpenPatenteModal && (
                <button
                  type="button"
                  onClick={onOpenPatenteModal}
                  className="text-[11px] text-white hover:text-yellow-200 font-bold underline cursor-pointer"
                >
                  Cambiar auto
                </button>
              )}
            </div>

            <p className="font-black text-base sm:text-lg text-white">
              {currentVehicleTitle}
            </p>

            <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-red-100">
              <span className="font-mono bg-blue-900/80 text-white px-2 py-0.5 rounded font-black border border-blue-400/40">
                🇦🇷 {currentPatente}
              </span>
              <span className="text-white/90">
                Motor: {currentEngine}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Barra de Ubicación Activa del Comprador (Geocercanía en Vivo) */}
      <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
            <MapPin className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                📍 Tu Ubicación Actual
              </span>
              {userLocation?.isGps && (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  GPS Detectado
                </span>
              )}
              <span className="text-xs text-slate-400">
                Calculando distancias a mostradores en tiempo real
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
              {userLocation?.displayName || `${userLocation?.cityName || 'Villa Crespo'}, ${userLocation?.provinceName || 'CABA'}`}
              {userLocation?.cp ? ` (CP ${userLocation.cp})` : ''}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {onOpenLocationModal && (
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer transform active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Cambiar Ubicación / Activar GPS</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner de Acceso Rápido para Armar Kit de Repuestos */}
      {onNavigateKits && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-2xl shrink-0">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] uppercase font-black tracking-wider bg-red-600 text-white px-2 py-0.5 rounded shadow-xs">
                  Nuevo • Kits por Marca
                </span>
                <span className="text-xs font-bold text-slate-300">
                  ¿Necesitás comprar varios repuestos juntos?
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white">
                Armá tu Kit a medida y cotizá con casas especializadas en tu marca
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateKits}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer transform active:scale-95"
          >
            <span>📦 Armar Kit para tu Auto</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input de Repuesto y Selector de Chips Rápidos */}
      <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-red-400" />
            <span>¿Qué repuesto o kit necesitás cotizar?</span>
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder="Escribí el repuesto (ej: Kit de Embrague, Pastillas, Radiador, Batería, Bomba de agua)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm sm:text-base font-semibold focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>
        </div>

        {/* Chips de Repuestos Rápidos */}
        <div>
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            O elegí de los repuestos con mayor demanda en el país:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {quickParts.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setPartName(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                  partName === item.value
                    ? 'bg-red-600 text-white border-red-500 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle o aclaración opcional */}
        <div className="pt-2">
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Aclaración adicional opcional (ej: marca preferida Valeo / ACDelco / Bosch, si retirás en mostrador o envío a domicilio...)"
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 rounded-lg focus:outline-none focus:border-slate-500"
          />
        </div>

      </div>

      {/* Directorio de Casas de Repuestos y Concesionarias Ordenadas por Proximidad */}
      <div className="space-y-4">
        
        {/* Barra de Filtros y Alcance */}
        <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-black text-white">
                Mostradores Disponibles ({filteredStores.length} encontrados)
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                Ordenados por menor distancia
              </span>
            </div>

            {onNavigateMapa && (
              <button
                type="button"
                onClick={onNavigateMapa}
                className="px-3 py-1 rounded-lg text-xs font-black bg-blue-600 hover:bg-blue-500 text-white transition border border-blue-400 shadow-sm flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                title="Ver red de casas de repuestos en el mapa interactivo"
              >
                <span>📍 Ver en Mapa Nacional</span>
              </button>
            )}
          </div>

          {/* Filtros de Alcance Geográfico */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-700/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Alcance:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setScopeFilter('cercanos')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition border cursor-pointer flex items-center gap-1 ${
                  scopeFilter === 'cercanos'
                    ? 'bg-red-600 text-white border-red-500 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>📍 Más cercanos a mi ubicación</span>
              </button>

              <button
                type="button"
                onClick={() => setScopeFilter('provincia')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  scopeFilter === 'provincia'
                    ? 'bg-red-600 text-white border-red-500 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                Toda mi provincia ({userLocation?.provinceName ? userLocation.provinceName.split('(')[0].trim() : 'Local'})
              </button>

              <button
                type="button"
                onClick={() => setScopeFilter('nacional')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  scopeFilter === 'nacional'
                    ? 'bg-red-600 text-white border-red-500 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                Toda la Argentina ({ARGENTINA_NATIONAL_STORES.length})
              </button>
            </div>
          </div>

          {/* Filtros de Rubro / Categoría */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rubro:
            </span>
            {[
              { id: 'todos', label: 'Todos los Rubros' },
              { id: 'multimarca', label: 'Casas Multimarca' },
              { id: 'oficiales', label: '💎 Concesionarios Oficiales' },
              { id: 'frenos', label: '🛑 Frenos / Embragues' },
              { id: 'baterias', label: '⚡ Baterías / Inyección' },
              { id: 'pesados', label: '🚛 Pick-Ups & 4x4' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700/60 border-slate-700/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Grid de Tiendas */}
        {filteredStores.length === 0 ? (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-8 text-center space-y-3">
            <div className="text-3xl">🔍</div>
            <h4 className="text-base font-bold text-white">
              No encontramos negocios con los filtros aplicados en esta zona
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Probá seleccionando "Toda la Argentina" para cotizar con casas que realizan envíos a todo el país o ampliá la categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setScopeFilter('nacional');
                setCategoryFilter('todos');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Ver todos los mostradores de Argentina
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-slate-500 transition shadow-lg relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-700/50 block w-fit">
                          {store.badge}
                        </span>
                        {store.distanceKm != null && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <Navigation className="w-2.5 h-2.5" />
                            {formatDistance(store.distanceKm)}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-black text-white group-hover:text-red-400 transition">
                        {store.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {store.category}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1 justify-end">
                        ★ {store.rating}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({store.reviews} opiniones)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 mt-3 pt-3 border-t border-slate-700/80">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{store.address} ({store.provinceName})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-400">{store.schedule}</span>
                    </div>
                  </div>

                  {/* Especialidades */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {store.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Marcas de Confianza */}
                  {store.trustedBrands && (
                    <div className="mt-2 flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Marcas:</span>
                      {store.trustedBrands.map((brand) => (
                        <span key={brand} className="text-[10px] text-blue-300 font-semibold bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-900/60">
                          {brand}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botones de Acción WhatsApp */}
                <div className="pt-3 border-t border-slate-700/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(store)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs sm:text-sm shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] border border-emerald-400/50 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Cotizar por WhatsApp</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping"></span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyMessage(store)}
                    title="Copiar texto de cotización profesional"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                  >
                    {copiedStoreId === store.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
