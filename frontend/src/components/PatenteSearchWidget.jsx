import React, { useState, useEffect } from 'react';
import {
  Car,
  Bike,
  Truck,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Sparkles,
  MapPin,
  Gauge,
  Fuel,
  Bookmark,
  MessageCircle,
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Search,
  Check,
  Edit3,
  Calendar,
  Clock,
  Sliders
} from 'lucide-react';
import { CLIENT_TAXONOMY, clientFallbackService } from '../services/clientFallbackService.js';

export function PatenteSearchWidget({
  onSelectVehicle,
  onNavigateCotizador,
  onNavigateMantenimiento,
  onNavigateLibreta,
  onNavigateGuantera,
  onNavigateKits,
  onNavigateMapa
}) {
  // Pestañas internas: 'manual' (Carga Guiada) | 'cochera' (Mis Vehículos)
  const [activeTab, setActiveTab] = useState('manual');

  // Estado del formulario de carga manual
  const [manualType, setManualType] = useState('auto'); // 'auto' | 'moto' | 'camion'
  const [manualBrand, setManualBrand] = useState('Volkswagen');
  const [manualModel, setManualModel] = useState('Gol Trend');
  const [manualYear, setManualYear] = useState('2019');
  const [manualEngine, setManualEngine] = useState('1.6 8V MSI (101 CV)');
  const [manualKm, setManualKm] = useState('65000');
  const [manualPatente, setManualPatente] = useState('');

  // Vehículo actualmente seleccionado / activo
  const [activeVehicle, setActiveVehicle] = useState(() => {
    return clientFallbackService.getActiveCocheraVehicle();
  });

  // Lista de vehículos en la Cochera Digital
  const [cocheraList, setCocheraList] = useState(() => {
    return clientFallbackService.getCocheraVehicles();
  });

  const [toastMessage, setToastMessage] = useState('');

  // Marcas rápidas populares según tipo
  const popularBrands = {
    auto: ['Volkswagen', 'Toyota', 'Chevrolet', 'Fiat', 'Ford', 'Peugeot', 'Renault', 'Citroën', 'Nissan', 'Jeep'],
    moto: ['Honda', 'Yamaha', 'Motomel', 'Corven', 'Zanella', 'Bajaj'],
    camion: ['Iveco', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Ford']
  };

  // Presets de kilometraje para carga rápida con 1 clic
  const kmPresets = [20000, 45000, 65000, 95000, 130000, 180000];

  // Presets de muestra para probar rápido
  const categorySamples = {
    auto: [
      { brand: 'Toyota', model: 'Hilux', year: 2022, engine: '2.8 D-4D Turbo (204 CV)', km: 45000, plate: 'AF 482 QZ' },
      { brand: 'Volkswagen', model: 'Gol Trend', year: 2019, engine: '1.6 MSI (101 CV)', km: 68000, plate: 'AD 192 OP' },
      { brand: 'Fiat', model: 'Cronos', year: 2021, engine: '1.3 GSE Firefly (99 CV)', km: 38000, plate: 'AE 341 KL' },
      { brand: 'Peugeot', model: '207 Compact', year: 2011, engine: '1.4 8V TU3JP (75 CV)', km: 95000, plate: 'KRX 105' },
      { brand: 'Chevrolet', model: 'Corsa Classic', year: 2008, engine: '1.4 8V MPFI (92 CV)', km: 140000, plate: 'ABX 543' }
    ],
    moto: [
      { brand: 'Honda', model: 'XR 250 Tornado', year: 2021, engine: '249 cc DOHC 4V', km: 15000, plate: 'A 042 BVC' },
      { brand: 'Yamaha', model: 'FZ FI 150', year: 2022, engine: '149 cc BlueCore', km: 12000, plate: 'A 123 BCD' },
      { brand: 'Motomel', model: 'Blitz 110', year: 2015, engine: '108 cc CUB', km: 28000, plate: '482 ABC' }
    ],
    camion: [
      { brand: 'Iveco', model: 'Tector', year: 2022, engine: '5.9 Turbo 280CV', km: 160000, plate: 'AF 912 OP' },
      { brand: 'Mercedes-Benz', model: '1620', year: 2008, engine: 'OM 366 LA Turbo', km: 380000, plate: 'RST 123' }
    ]
  };

  // Cargar modelos según la marca manual elegida
  const currentBrandModels = () => {
    const taxonomyBrands = (CLIENT_TAXONOMY[manualType] || CLIENT_TAXONOMY.auto).brands;
    const found = taxonomyBrands.find(
      (b) => b.name.toLowerCase() === manualBrand.toLowerCase() || b.id === manualBrand.toLowerCase()
    );
    return found ? found.models : [];
  };

  // Al cambiar de marca, actualizar el modelo al primero disponible
  const handleBrandChange = (brandName) => {
    setManualBrand(brandName);
    const taxonomyBrands = (CLIENT_TAXONOMY[manualType] || CLIENT_TAXONOMY.auto).brands;
    const found = taxonomyBrands.find(
      (b) => b.name.toLowerCase() === brandName.toLowerCase() || b.id === brandName.toLowerCase()
    );
    if (found && found.models.length > 0) {
      setManualModel(found.models[0]);
    }
  };

  // Al cambiar tipo de vehículo
  const handleTypeChange = (type) => {
    setManualType(type);
    const brands = popularBrands[type] || popularBrands.auto;
    const firstBrand = brands[0];
    setManualBrand(firstBrand);
    const taxonomyBrands = (CLIENT_TAXONOMY[type] || CLIENT_TAXONOMY.auto).brands;
    const found = taxonomyBrands.find(
      (b) => b.name.toLowerCase() === firstBrand.toLowerCase() || b.id === firstBrand.toLowerCase()
    );
    if (found && found.models.length > 0) {
      setManualModel(found.models[0]);
    }
  };

  // Guardar y activar vehículo cargado a mano
  const handleSaveManualVehicle = (e) => {
    e?.preventDefault();
    if (!manualBrand.trim() || !manualModel.trim()) {
      return;
    }

    const vehicle = clientFallbackService.buildVehicleFromManualInput({
      vehicleType: manualType,
      brand: manualBrand,
      model: manualModel,
      year: manualYear,
      engine: manualEngine,
      currentKm: manualKm,
      patente: manualPatente
    });

    // Guardar en Cochera
    const updated = clientFallbackService.saveToCochera(vehicle);
    setCocheraList(updated);
    setActiveVehicle(vehicle);

    // Notificar a toda la aplicación
    if (onSelectVehicle) {
      onSelectVehicle({
        query: vehicle.model,
        vehicleType: vehicle.vehicleType,
        brand: vehicle.brand.toLowerCase(),
        model: vehicle.model,
        year: vehicle.year.toString(),
        engineSpec: vehicle.engine?.name || '',
        currentKm: vehicle.currentKm,
        fullVehicleTitle: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
        patente: vehicle.displayPlate || vehicle.patente,
        data: vehicle
      });
    }

    setToastMessage(`¡${vehicle.brand} ${vehicle.model} guardado y activado en tu Cochera!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Seleccionar vehículo desde la cochera
  const handleSelectFromCochera = (item) => {
    clientFallbackService.setActiveCocheraVehicle(item);
    setActiveVehicle(item);
    if (onSelectVehicle) {
      onSelectVehicle({
        query: item.model,
        vehicleType: item.vehicleType || 'auto',
        brand: (item.brand || 'auto').toLowerCase(),
        model: item.model,
        year: (item.year || 2020).toString(),
        engineSpec: item.engine?.name || '',
        currentKm: item.currentKm || 60000,
        fullVehicleTitle: `${item.brand} ${item.model} (${item.year || ''})`,
        patente: item.displayPlate || item.patente,
        data: item
      });
    }
    setToastMessage(`Vehículo activo: ${item.brand} ${item.model}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Eliminar vehículo de la cochera
  const handleRemoveFromCochera = (e, item) => {
    e.stopPropagation();
    const updated = clientFallbackService.removeFromCochera(item.id || item.patente);
    setCocheraList(updated);
    if (activeVehicle?.id === item.id || activeVehicle?.patente === item.patente) {
      const next = updated[0] || null;
      setActiveVehicle(next);
      if (next && onSelectVehicle) {
        onSelectVehicle({
          query: next.model,
          vehicleType: next.vehicleType || 'auto',
          brand: (next.brand || 'auto').toLowerCase(),
          model: next.model,
          year: (next.year || 2020).toString(),
          engineSpec: next.engine?.name || '',
          currentKm: next.currentKm || 60000,
          fullVehicleTitle: `${next.brand} ${next.model} (${next.year || ''})`,
          patente: next.displayPlate || next.patente,
          data: next
        });
      }
    }
  };

  // Cargar muestra de 1 clic
  const handleLoadSample = (sample, type) => {
    setManualType(type);
    setManualBrand(sample.brand);
    setManualModel(sample.model);
    setManualYear(sample.year.toString());
    setManualEngine(sample.engine);
    setManualKm(sample.km.toString());
    setManualPatente(sample.plate);

    const vehicle = clientFallbackService.buildVehicleFromManualInput({
      vehicleType: type,
      brand: sample.brand,
      model: sample.model,
      year: sample.year,
      engine: sample.engine,
      currentKm: sample.km,
      patente: sample.plate
    });

    const updated = clientFallbackService.saveToCochera(vehicle);
    setCocheraList(updated);
    setActiveVehicle(vehicle);

    if (onSelectVehicle) {
      onSelectVehicle({
        query: vehicle.model,
        vehicleType: vehicle.vehicleType,
        brand: vehicle.brand.toLowerCase(),
        model: vehicle.model,
        year: vehicle.year.toString(),
        engineSpec: vehicle.engine?.name || '',
        currentKm: vehicle.currentKm,
        fullVehicleTitle: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
        patente: vehicle.displayPlate || vehicle.patente,
        data: vehicle
      });
    }

    setToastMessage(`¡${vehicle.brand} ${vehicle.model} cargado con éxito!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-blue-800/40 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/4 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-900/60 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs flex items-center gap-1">
              <span>🚗</span> Mi Cochera Digital DinAcitY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Carga Guiada Sin Dependencia de APIs
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/60 text-blue-200 border border-blue-500/30">
              📍 Mendoza, Argentina
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Cargá tu Vehículo y Gestioná su Mantenimiento Exacto
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-3xl leading-relaxed">
            Ingresá tu auto a mano para que DinAcitY calcule al instante el <strong>kilometraje de cambio de cada repuesto</strong>, <strong>fluidos homologados</strong>, cotizaciones por WhatsApp en mostradores de Mendoza y <strong>alertas de RTO y seguro</strong>.
          </p>
        </div>

        {/* Tab Switcher Superior */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-blue-900/70 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>➕ Cargar Vehículo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cochera')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cochera'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>🚘 Mis Autos ({cocheraList.length})</span>
          </button>
        </div>
      </div>

      {/* Toast de confirmación */}
      {toastMessage && (
        <div className="mt-4 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-bounce z-20">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 1: FORMULARIO DE CARGA GUIADA A MANO */}
      {activeTab === 'manual' && (
        <div className="mt-5 relative z-10 space-y-6">
          
          {/* Tarjeta del Formulario Principal */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
            
            {/* 1. Selector de Tipo de Vehículo */}
            <div>
              <label className="block text-xs font-black uppercase text-blue-300 tracking-wider mb-2">
                Paso 1: ¿Qué tipo de vehículo tenés?
              </label>
              <div className="grid grid-cols-3 gap-2.5 max-w-md">
                <button
                  type="button"
                  onClick={() => handleTypeChange('auto')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    manualType === 'auto'
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Auto / SUV</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('moto')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    manualType === 'moto'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Moto</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('camion')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    manualType === 'camion'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Camión</span>
                </button>
              </div>
            </div>

            {/* 2. Selector Rápido de Marcas */}
            <div>
              <label className="block text-xs font-black uppercase text-blue-300 tracking-wider mb-2">
                Paso 2: Marca
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {(popularBrands[manualType] || popularBrands.auto).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBrandChange(b)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      manualBrand.toLowerCase() === b.toLowerCase()
                        ? 'bg-blue-600 text-white border-blue-300 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Grid de Datos Específicos: Modelo, Año, Motor y Odómetro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800">
              
              {/* Modelo */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5">
                  Modelo:
                </label>
                {currentBrandModels().length > 0 ? (
                  <select
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                  >
                    {currentBrandModels().map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="Otro">Otro Modelo (escribir)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    placeholder="Ej: Gol Trend, Hilux, Cronos"
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                  />
                )}
                {manualModel === 'Otro' && (
                  <input
                    type="text"
                    onChange={(e) => setManualModel(e.target.value)}
                    placeholder="Escribí el nombre del modelo"
                    className="mt-2 w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none"
                  />
                )}
              </div>

              {/* Año */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5">
                  Año de Fabricación:
                </label>
                <select
                  value={manualYear}
                  onChange={(e) => setManualYear(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                >
                  {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Motorización / Combustible */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5">
                  Motor / Combustible:
                </label>
                <input
                  type="text"
                  value={manualEngine}
                  onChange={(e) => setManualEngine(e.target.value)}
                  placeholder="Ej: 1.6 MSI, 2.0 TDI, 1.4 Fire, 1.3 GSE"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                />
              </div>

              {/* Patente Opcional */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Chapa Patente (Opcional):</span>
                  <span className="text-[10px] text-blue-400 font-normal">Para RTO Mendoza</span>
                </label>
                <input
                  type="text"
                  value={manualPatente}
                  onChange={(e) => setManualPatente(e.target.value.toUpperCase())}
                  placeholder="Ej: AF 482 QZ / KRX 105"
                  maxLength={10}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-mono font-black uppercase tracking-wider focus:outline-none"
                />
              </div>

            </div>

            {/* 4. Kilometraje Actual (EL CORAZÓN TÉCNICO) */}
            <div className="p-4 bg-slate-950/70 border border-blue-500/40 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-sky-400" />
                    <span>Kilometraje Actual de tu Odómetro (Crucial para Services)</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Calculamos exactamente qué repuesto cambiar hoy y cuál en el próximo service.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={manualKm}
                    onChange={(e) => setManualKm(e.target.value)}
                    step="1000"
                    min="0"
                    max="600000"
                    className="w-36 bg-slate-900 border border-sky-400/60 rounded-xl px-3 py-2 text-right text-base font-mono font-black text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <span className="text-xs font-bold text-slate-300">KM</span>
                </div>
              </div>

              {/* Presets de kilometraje rápido */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 font-bold mr-1">Elegir rápido:</span>
                {kmPresets.map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => setManualKm(km.toString())}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition cursor-pointer ${
                      parseInt(manualKm, 10) === km
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {km.toLocaleString('es-AR')} km
                  </button>
                ))}
              </div>
            </div>

            {/* Botón Principal de Envío */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                ✓ Se guardará en tu Cochera y sincronizará con Pasaporte Service, Cotizador y Guantera.
              </span>

              <button
                type="button"
                onClick={handleSaveManualVehicle}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-sm shadow-xl hover:shadow-blue-500/30 transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Guardar y Activar Vehículo en Mi Cochera</span>
              </button>
            </div>

          </div>

          {/* Modelos Pre-cargados de Ejemplo (Para probar con 1 solo clic) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2">
              💡 ¿Querés probar rápido? Hacé clic en un modelo de ejemplo:
            </span>
            <div className="flex flex-wrap gap-2">
              {(categorySamples[manualType] || categorySamples.auto).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(s, manualType)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>{s.brand} {s.model} ({s.year})</span>
                  <span className="text-[10px] text-blue-300 font-mono">[{s.km.toLocaleString('es-AR')} km]</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: MIS VEHÍCULOS GUARDADOS (COCHERA DIGITAL) */}
      {activeTab === 'cochera' && (
        <div className="mt-5 relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Tenés <strong>{cocheraList.length}</strong> vehículos guardados en tu cochera. Hacé clic en cualquiera para activarlo.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar otro vehículo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cocheraList.map((item) => {
              const isActive = activeVehicle?.id === item.id || activeVehicle?.patente === item.patente;

              return (
                <div
                  key={item.id || item.patente}
                  onClick={() => handleSelectFromCochera(item)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-900/60 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-2 ring-blue-400/50'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-700/80 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-black bg-black text-white border border-gray-600 shadow-xs">
                        {item.displayPlate || item.patente}
                      </span>
                      <div className="flex items-center gap-1">
                        {isActive && (
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            ✓ Activo
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveFromCochera(e, item)}
                          className="text-slate-500 hover:text-red-400 p-1 transition cursor-pointer"
                          title="Eliminar de mi cochera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-black text-base text-white">
                      {item.brand} {item.model} <span className="text-xs text-slate-400 font-normal">({item.year})</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {item.engine?.name || item.version || 'Motor Homologado'}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono font-bold border border-sky-800">
                        Odómetro: {(item.currentKm || 60000).toLocaleString('es-AR')} km
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">📍 Mendoza</span>
                    <span className={`font-black ${isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-400'}`}>
                      {isActive ? 'Activo en uso ➔' : 'Activar vehículo ➔'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FICHA TÉCNICA Y ACCIONES DEL VEHÍCULO ACTIVO */}
      {activeVehicle && (
        <div className="mt-6 bg-slate-900/95 border-2 border-blue-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative z-10 animate-fadeIn space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-black bg-blue-600 text-white shadow-xs">
                  {activeVehicle.displayPlate || activeVehicle.patente}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vehículo Activo en DinAcitY
                </span>
                <span className="text-xs text-sky-300 bg-sky-950/80 border border-sky-800 px-2.5 py-0.5 rounded-full font-mono">
                  Odómetro: {(activeVehicle.currentKm || 60000).toLocaleString('es-AR')} km
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {activeVehicle.brand} {activeVehicle.model} <span className="text-red-400">{activeVehicle.version || ''}</span> ({activeVehicle.year || ''})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Editar Datos o Cambiar Auto</span>
              </button>
            </div>
          </div>

          {/* Grilla Técnica Inteligente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" />
                Motor y Combustible
              </span>
              <p className="font-bold text-white text-sm">{activeVehicle.engine?.name || 'Motor Homologado'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Combustible: <span className="text-emerald-300 font-semibold">{activeVehicle.engine?.fuel || 'Nafta'}</span>
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Kilometraje Registrado
              </span>
              <p className="font-mono font-black text-white text-base">{(activeVehicle.currentKm || 60000).toLocaleString('es-AR')} km</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Próximo service mayor: <strong className="text-amber-300 font-mono">{(Math.ceil((activeVehicle.currentKm || 60000) / 10000) * 10000).toLocaleString('es-AR')} km</strong>
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-purple-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                Aceite Recomendado
              </span>
              <p className="font-bold text-white text-sm">
                {activeVehicle.recommendedParts?.aceiteRecomendado || (activeVehicle.engine?.fuel?.includes('Diésel') ? '5W-30 Sintético Diésel DPF' : '10W-40 / 5W-30 Sintético')}
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">Norma oficial para Mendoza</p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Radicación & RTO
              </span>
              <p className="font-bold text-white text-sm">{activeVehicle.dnrpa?.seccional || 'Mendoza (Registro Automotor)'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Revisión Técnica Obligatoria Ley 9024</p>
            </div>

          </div>

          {/* Accesos Directos a Toda la Plataforma */}
          <div className="pt-2">
            <span className="text-[11px] font-black uppercase text-blue-300 tracking-wider block mb-2">
              🔗 Conectar este vehículo con las secciones de DinAcitY:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              
              {onNavigateCotizador && (
                <button
                  type="button"
                  onClick={() => onNavigateCotizador(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Cotizar Repuestos</span>
                </button>
              )}

              {onNavigateMantenimiento && (
                <button
                  type="button"
                  onClick={() => onNavigateMantenimiento(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Pasaporte Service</span>
                </button>
              )}

              {onNavigateLibreta && (
                <button
                  type="button"
                  onClick={() => onNavigateLibreta(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <Bookmark className="w-4 h-4 fill-slate-950" />
                  <span>Libreta Services</span>
                </button>
              )}

              {onNavigateGuantera && (
                <button
                  type="button"
                  onClick={() => onNavigateGuantera(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span className="text-sm">📂</span>
                  <span>Guantera (RTO)</span>
                </button>
              )}

              {onNavigateKits && (
                <button
                  type="button"
                  onClick={() => onNavigateKits(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span className="text-sm">📦</span>
                  <span>Kits por Marca</span>
                </button>
              )}

              {onNavigateMapa && (
                <button
                  type="button"
                  onClick={() => onNavigateMapa(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Mostradores MZA</span>
                </button>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
