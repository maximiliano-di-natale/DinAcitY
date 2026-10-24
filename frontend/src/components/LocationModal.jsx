import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  X,
  Compass,
  Building,
  Navigation,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  ARGENTINA_PROVINCES,
  requestGpsLocation,
  saveUserLocation
} from '../services/geolocationService.js';

export function LocationModal({ isOpen, onClose, currentLocation, onLocationChanged }) {
  const [selectedProvinceId, setSelectedProvinceId] = useState(
    currentLocation?.provinceId || 'caba'
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const currentProvObj =
    ARGENTINA_PROVINCES.find((p) => p.id === selectedProvinceId) ||
    ARGENTINA_PROVINCES[0];

  const handleSelectCity = (city, province) => {
    const newLocation = {
      provinceId: province.id,
      provinceName: province.name,
      cityName: city.name,
      cp: city.cp || '',
      lat: city.lat,
      lng: city.lng,
      isGps: false,
      accuracy: null,
      displayName: `${city.name}, ${province.shortName || province.name}`
    };
    saveUserLocation(newLocation);
    if (onLocationChanged) onLocationChanged(newLocation);
    onClose();
  };

  const handleTriggerGps = async () => {
    setIsDetectingGps(true);
    setGpsError(null);
    try {
      const detected = await requestGpsLocation();
      if (onLocationChanged) onLocationChanged(detected);
      setTimeout(() => {
        setIsDetectingGps(false);
        onClose();
      }, 500);
    } catch (err) {
      setIsDetectingGps(false);
      setGpsError(err.message || 'No se pudo obtener la ubicación GPS.');
    }
  };

  // Accesos rápidos a los centros comerciales de repuestos más concurridos
  const quickPoles = [
    {
      label: 'CABA • Polo Warnes',
      provId: 'caba',
      cityName: 'Villa Crespo (Polo Warnes)',
      icon: '🏛️'
    },
    {
      label: 'GBA Oeste • Morón / Ramos',
      provId: 'buenos-aires',
      cityName: 'Ramos Mejía / Morón (GBA Oeste)',
      icon: '🛣️'
    },
    {
      label: 'GBA Norte • San Martín',
      provId: 'buenos-aires',
      cityName: 'San Martín (GBA Norte)',
      icon: '🏭'
    },
    {
      label: 'GBA Sur • Avellaneda / Lanús',
      provId: 'buenos-aires',
      cityName: 'Avellaneda / Lanús (GBA Sur)',
      icon: '🏢'
    },
    {
      label: 'Córdoba • Av. Las Heras',
      provId: 'cordoba',
      cityName: 'Córdoba Capital (Polo Av. Las Heras / Centro)',
      icon: '📍'
    },
    {
      label: 'Rosario • Polo Echesortu',
      provId: 'santa-fe',
      cityName: 'Rosario (Polo Echesortu / Av. San Martín)',
      icon: '⚓'
    },
    {
      label: 'Mendoza • Rodríguez Peña',
      provId: 'mendoza',
      cityName: 'Godoy Cruz (Polo Rodríguez Peña / San Martín Sur)',
      icon: '🍇'
    },
    {
      label: 'Tucumán • Av. Avellaneda',
      provId: 'tucuman',
      cityName: 'San Miguel de Tucumán (Av. Avellaneda / Centro)',
      icon: '🌄'
    },
    {
      label: 'Mar del Plata • Champagnat',
      provId: 'buenos-aires',
      cityName: 'Mar del Plata',
      icon: '🌊'
    },
    {
      label: 'Neuquén • Alto Valle',
      provId: 'neuquen',
      cityName: 'Neuquén Capital (Ruta 22 / Centro)',
      icon: '🏔️'
    }
  ];

  const handleSelectQuickPole = (pole) => {
    const prov = ARGENTINA_PROVINCES.find((p) => p.id === pole.provId);
    if (!prov) return;
    const city =
      prov.cities.find((c) => c.name === pole.cityName) || prov.cities[0];
    handleSelectCity(city, prov);
  };

  const searchQuery = searchFilter.toLowerCase().trim();

  const filteredCities = (currentProvObj?.cities || []).filter((c) =>
    c.name.toLowerCase().includes(searchQuery)
  );

  const otherProvinceMatches =
    searchQuery.length >= 2
      ? ARGENTINA_PROVINCES.filter((p) => p.id !== selectedProvinceId)
          .flatMap((p) =>
            p.cities
              .filter((c) => c.name.toLowerCase().includes(searchQuery))
              .map((c) => ({ ...c, province: p }))
          )
          .slice(0, 12)
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Encabezado */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300">
              <MapPin className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  🇦🇷 Red Nacional Argentina
                </span>
                <span className="text-xs text-slate-400">
                  Cálculo de cercanía en tiempo real
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                ¿Dónde te encontrás para cotizar?
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Botón de Detección GPS */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-800 to-slate-900 border border-emerald-500/40 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
                <Crosshair className={`w-5 h-5 ${isDetectingGps ? 'animate-spin text-emerald-400' : ''}`} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Detección Automática por GPS</span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
                    Recomendado
                  </span>
                </h4>
                <p className="text-xs text-slate-300">
                  Usa tu ubicación exacta para calcular la distancia en km a los mostradores y concesionarias más cercanas.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isDetectingGps}
              onClick={handleTriggerGps}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>{isDetectingGps ? 'Detectando...' : 'Detectar con mi GPS'}</span>
            </button>
          </div>

          {gpsError && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Ubicación Actual Activa */}
          {currentLocation && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Ubicación activa:</span>
                <span className="font-black text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {currentLocation.displayName || `${currentLocation.cityName}, ${currentLocation.provinceName}`}
                </span>
                {currentLocation.isGps && (
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    GPS Activo
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Polos Automotores Populares */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-2">
              Polos de Repuestos Más Concurridos de Argentina:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickPoles.map((pole) => (
                <button
                  key={pole.label}
                  type="button"
                  onClick={() => handleSelectQuickPole(pole)}
                  className="px-2.5 py-2 rounded-lg bg-slate-800/90 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-400/50 text-left transition text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {pole.icon}
                  </span>
                  <span className="truncate">{pole.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector Manual por Provincia y Ciudad */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                O elegí cualquier provincia de Argentina:
              </label>
              <span className="text-[11px] text-slate-400">
                24 Jurisdicciones
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">
                  Provincia:
                </label>
                <select
                  value={selectedProvinceId}
                  onChange={(e) => {
                    setSelectedProvinceId(e.target.value);
                    setSearchFilter('');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                >
                  {ARGENTINA_PROVINCES.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name} ({prov.inspectionType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">
                  Filtrar localidad o barrio:
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Buscar localidad..."
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Si ingresó texto en el buscador, opción de escribir localidad personalizada */}
            {searchQuery && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/70 via-slate-800 to-indigo-950/70 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="text-left w-full sm:w-auto">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Usar localidad ingresada:</span>
                  </div>
                  <p className="text-[11px] text-blue-200">
                    Podés seleccionar <strong className="text-white font-black">"{searchFilter.trim()}"</strong> ({currentProvObj.name}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectCity(
                      {
                        name: searchFilter.trim(),
                        lat: currentProvObj.lat,
                        lng: currentProvObj.lng,
                        cp: ''
                      },
                      currentProvObj
                    )
                  }
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirmar "{searchFilter.trim()}"</span>
                </button>
              </div>
            )}

            {/* Listado de Ciudades de la Provincia Seleccionada */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300">
                  Localidades en {currentProvObj.name} ({filteredCities.length}):
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentProvObj.cities.length} localidades registradas
                </span>
              </div>

              {filteredCities.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-center text-xs text-slate-400">
                  No encontramos "{searchFilter}" en {currentProvObj.name}.
                  <p className="text-[11px] text-blue-300 mt-1">
                    Hacé clic en el botón superior para confirmar <strong className="text-white">"{searchFilter.trim()}"</strong> directamente.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredCities.map((city) => {
                    const isCurrent =
                      currentLocation?.provinceId === currentProvObj.id &&
                      currentLocation?.cityName === city.name;
                    return (
                      <button
                        key={city.name}
                        type="button"
                        onClick={() => handleSelectCity(city, currentProvObj)}
                        className={`p-2.5 rounded-xl text-left text-xs transition border flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600/30 text-white border-blue-400 shadow-sm'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border-slate-700/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-red-400' : 'text-slate-500'}`} />
                          <span className="font-semibold truncate">{city.name}</span>
                        </div>
                        {city.cp && (
                          <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">
                            CP {city.cp}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coincidencias en otras provincias */}
            {otherProvinceMatches.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="block text-[11px] font-bold text-slate-400 mb-2">
                  Coincidencias en otras provincias de Argentina:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {otherProvinceMatches.map((item, idx) => (
                    <button
                      key={`${item.province.id}-${item.name}-${idx}`}
                      type="button"
                      onClick={() => handleSelectCity(item, item.province)}
                      className="p-2 rounded-xl text-left text-xs bg-slate-800/50 hover:bg-blue-900/30 hover:border-blue-500/40 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="font-medium truncate">{item.name}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-bold ml-2 shrink-0">
                        {item.province.shortName || item.province.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Los presupuestos por WhatsApp se enviarán con tu zona indicada</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
}
