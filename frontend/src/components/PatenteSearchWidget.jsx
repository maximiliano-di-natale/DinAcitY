import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
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
  ChevronRight
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
  const [selectedCategory, setSelectedCategory] = useState('auto'); // 'auto' | 'moto' | 'camion'
  const [patenteInput, setPatenteInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [savedDbVehicle, setSavedDbVehicle] = useState(false);

  // Estados para el asistente de confirmación y vinculación de vehículo
  const [confirmBrand, setConfirmBrand] = useState('Peugeot');
  const [confirmModel, setConfirmModel] = useState('207 Compact');
  const [confirmYear, setConfirmYear] = useState('2011');
  const [confirmEngine, setConfirmEngine] = useState('1.4 8V Nafta');

  // Lista de vehículos en la Cochera Digital del usuario
  const [cocheraList, setCocheraList] = useState(() => {
    return clientFallbackService.getCocheraVehicles();
  });

  const categorySamples = {
    auto: [
      { plate: 'AF 482 QZ', label: 'Toyota Hilux 2.8 TDI (2022)' },
      { plate: 'AD 192 OP', label: 'VW Gol Trend 1.6 MSI (2019)' },
      { plate: 'AE 341 KL', label: 'Chevrolet Onix 1.0T (2021)' },
      { plate: 'AC 821 GH', label: 'Fiat Cronos 1.3 GSE (2018)' },
      { plate: 'ABX 543', label: 'Chevrolet Corsa 1.4 (2007)' },
      { plate: 'HRT 892', label: 'Ford Ranger 3.0 (2008)' },
      { plate: 'AA 001 BB', label: 'VW Amarok 2.0 TDI (2016)' },
      { plate: 'AF 782 QW', label: 'Peugeot 208 1.6 (2022)' }
    ],
    moto: [
      { plate: 'A 042 BVC', label: 'Honda XR 250 Tornado (2021)' },
      { plate: 'A 123 BCD', label: 'Yamaha FZ FI 150 (2022)' },
      { plate: '482 ABC', label: 'Motomel Blitz 110 Tuning (2015)' },
      { plate: 'A 010 ROU', label: 'Bajaj Rouser NS 200 (2020)' }
    ],
    camion: [
      { plate: 'AF 912 OP', label: 'Iveco Tector 170E28 280CV (2022)' },
      { plate: 'AC 450 MN', label: 'Scania R 450 Highline (2018)' },
      { plate: 'RST 123', label: 'Mercedes-Benz 1620 Chasis (2008)' },
      { plate: 'AE 812 VW', label: 'VW Constellation 17.280 (2021)' }
    ]
  };

  // Cargar vehículo activo al inicio si existe
  useEffect(() => {
    const active = clientFallbackService.getActiveCocheraVehicle();
    if (active) {
      setPatenteInput(active.patente || active.displayPlate || 'AF 482 QZ');
      handleSearchPatente(active.patente || active.displayPlate, active.vehicleType);
    } else {
      setPatenteInput('AF 482 QZ');
      handleSearchPatente('AF 482 QZ', 'auto');
    }
  }, []);

  const handleFormatInput = (e) => {
    const val = (e?.target?.value || '').toUpperCase();
    setPatenteInput(val);
    setError(null);
  };

  const handleCategorySwitch = (cat) => {
    setSelectedCategory(cat);
    const firstSample = categorySamples[cat]?.[0]?.plate || '';
    if (firstSample) {
      setPatenteInput(firstSample);
      handleSearchPatente(firstSample, cat);
    }
  };

  const handleSearchPatente = async (plateToQuery, typeHint = null) => {
    let target = (plateToQuery !== undefined ? plateToQuery : patenteInput || '').trim();
    const effectiveCategory = typeHint || selectedCategory;

    if (!target) {
      target = effectiveCategory === 'moto' ? 'A 042 BVC' : (effectiveCategory === 'camion' ? 'AF 912 OP' : 'AF 482 QZ');
      setPatenteInput(target);
    }

    const cleanAlphanumeric = target.replace(/[^A-Za-z0-9]/g, '');
    if (cleanAlphanumeric.length < 5) {
      setError('Por favor, ingresá una patente argentina válida (ej: AF 482 QZ, ABX 543, A 042 BVC) o un VIN de 17 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Obtención garantizada offline / local
      const fallbackResult = clientFallbackService.lookupPatente(target, effectiveCategory);
      if (fallbackResult) {
        if (fallbackResult.requiresConfirmation) {
          setVehicleData(fallbackResult);
          if (fallbackResult.formatInfo?.estimatedYear) {
            setConfirmYear(fallbackResult.formatInfo.estimatedYear.toString());
          }
          if (fallbackResult.formatInfo?.vehicleType) {
            setSelectedCategory(fallbackResult.formatInfo.vehicleType);
          }
        } else if (fallbackResult.data) {
          setVehicleData(fallbackResult);
          if (fallbackResult.data.vehicleType) {
            setSelectedCategory(fallbackResult.data.vehicleType);
          }
          if (onSelectVehicle) {
            onSelectVehicle({
              query: fallbackResult.data?.model || '',
              vehicleType: fallbackResult.data?.vehicleType || effectiveCategory,
              brand: fallbackResult.data?.brandId || fallbackResult.data?.brand?.toLowerCase() || 'auto',
              model: fallbackResult.data?.model || '',
              year: fallbackResult.data?.year ? fallbackResult.data.year.toString() : '2022',
              engineSpec: fallbackResult.data?.engine?.name || '',
              fullVehicleTitle: `${fallbackResult.data?.brand || ''} ${fallbackResult.data?.model || ''} ${fallbackResult.data?.version || ''} (${fallbackResult.data?.year || ''})`.trim(),
              patente: fallbackResult.displayPlate || fallbackResult.data?.patente || target,
              data: fallbackResult.data
            });
          }
        }
      }

      // 2. Consulta al backend (si responde con datos de live API o SQLite)
      const res = await fetch(`/api/vehicles/lookup-patente?patente=${encodeURIComponent(target)}&vehicleType=${encodeURIComponent(effectiveCategory)}`);
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          if (data) {
            if (data.requiresConfirmation) {
              setVehicleData(data);
              if (data.formatInfo?.estimatedYear) setConfirmYear(data.formatInfo.estimatedYear.toString());
              if (data.formatInfo?.vehicleType) setSelectedCategory(data.formatInfo.vehicleType);
            } else if (data.data) {
              setVehicleData(data);
              if (data.data.vehicleType) setSelectedCategory(data.data.vehicleType);
              if (onSelectVehicle) {
                onSelectVehicle({
                  query: data.data?.model || '',
                  vehicleType: data.data?.vehicleType || effectiveCategory,
                  brand: data.data?.brandId || data.data?.brand?.toLowerCase() || 'auto',
                  model: data.data?.model || '',
                  year: data.data?.year ? data.data.year.toString() : '2022',
                  engineSpec: data.data?.engine?.name || '',
                  fullVehicleTitle: `${data.data?.brand || ''} ${data.data?.model || ''} ${data.data?.version || ''} (${data.data?.year || ''})`.trim(),
                  patente: data.displayPlate || data.data?.patente || target,
                  data: data.data
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Consulta offline / usando decodificador DNRPA local:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmVehicleLink = (chosenVehicle) => {
    const targetPlate = vehicleData?.displayPlate || vehicleData?.plate || patenteInput;
    const res = clientFallbackService.linkPlate(targetPlate, chosenVehicle);
    if (res && res.data) {
      setVehicleData(res);
      setCocheraList(clientFallbackService.getCocheraVehicles());
      setSavedDbVehicle(true);
      setTimeout(() => setSavedDbVehicle(false), 4000);
      if (onSelectVehicle) {
        onSelectVehicle({
          query: res.data?.model || '',
          vehicleType: res.data?.vehicleType || selectedCategory,
          brand: res.data?.brandId || res.data?.brand?.toLowerCase() || 'auto',
          model: res.data?.model || '',
          year: res.data?.year ? res.data.year.toString() : '2020',
          engineSpec: res.data?.engine?.name || '',
          fullVehicleTitle: `${res.data?.brand || ''} ${res.data?.model || ''} ${res.data?.version || ''} (${res.data?.year || ''})`.trim(),
          patente: res.displayPlate || targetPlate,
          data: res.data
        });
      }
    }
  };

  const getQuickPresets = (year, cat) => {
    const y = Number(year) || 2011;
    if (cat === 'moto') {
      return [
        { brand: 'Honda', model: 'Wave 110S', version: '110 cc', year: y, engine: { name: '109 cc 4T OHC' } },
        { brand: 'Honda', model: 'XR 250 Tornado', version: '250 cc', year: y, engine: { name: '249 cc DOHC 4V' } },
        { brand: 'Yamaha', model: 'YBR 125', version: 'ED 125', year: y, engine: { name: '124 cc 4T SOHC' } },
        { brand: 'Motomel', model: 'Blitz 110', version: 'B1 110', year: y, engine: { name: '107 cc 4T CUB' } }
      ];
    }
    if (cat === 'camion') {
      return [
        { brand: 'Iveco', model: 'Tector', version: '170E28 Attack', year: y, engine: { name: '5.9 Turbo Intercooler 280CV' } },
        { brand: 'Mercedes-Benz', model: '1620', version: 'L 1620 Chasis', year: y, engine: { name: 'OM 366 LA Turbo 211CV' } },
        { brand: 'Scania', model: 'R 450', version: 'Highline 4x2', year: y, engine: { name: '13.0 Litros 6 Cilindros 450CV' } },
        { brand: 'Volkswagen', model: 'Constellation', version: '17.280', year: y, engine: { name: '6.9 MAN 280CV' } }
      ];
    }
    // Autos
    return [
      { brand: 'Peugeot', model: '207 Compact', version: '1.4 XS 5P', year: y, engine: { name: '1.4 8V TU3JP (75 CV)' } },
      { brand: 'Volkswagen', model: 'Gol Trend', version: '1.6 MSI', year: y, engine: { name: '1.6 8V MSI EA111 (101 CV)' } },
      { brand: 'Chevrolet', model: 'Corsa Classic', version: '1.4 LT', year: y, engine: { name: '1.4 8V MPFI (92 CV)' } },
      { brand: 'Renault', model: 'Clio', version: 'Mio 1.2', year: y, engine: { name: '1.2 16V D4F (75 CV)' } },
      { brand: 'Fiat', model: 'Palio', version: 'Fire 1.4', year: y, engine: { name: '1.4 8V Fire (85 CV)' } },
      { brand: 'Ford', model: 'Fiesta', version: 'One 1.6', year: y, engine: { name: '1.6 8V Zetec Rocam (98 CV)' } },
      { brand: 'Toyota', model: 'Hilux', version: 'DX 2.5 TDI', year: y, engine: { name: '2.5 D-4D Turbo Diésel (120 CV)' } }
    ];
  };

  const handleApplyVehicle = (targetPart = '') => {
    if (!vehicleData || !vehicleData.data) return;
    const v = vehicleData.data;
    if (onSelectVehicle) {
      onSelectVehicle({
        query: targetPart || v.model || '',
        vehicleType: v.vehicleType || selectedCategory,
        brand: v.brandId || v.brand?.toLowerCase() || 'auto',
        model: v.model || '',
        year: v.year ? v.year.toString() : '2022',
        engineSpec: v.engine?.name || '',
        fullVehicleTitle: `${v.brand || ''} ${v.model || ''} ${v.version || ''} (${v.year || ''})`.trim(),
        patente: vehicleData.displayPlate || v.patente || patenteInput,
        data: v
      });
    }
  };

  // Guardar en la Cochera Digital (100% funcional localmente y opcionalmente en DB)
  const handleSaveToCochera = async () => {
    if (!vehicleData || !vehicleData.data) return;
    const v = vehicleData.data;

    // Guardar inmediatamente en localStorage
    const updated = clientFallbackService.saveToCochera(v);
    setCocheraList(updated);
    setSavedDbVehicle(true);
    setTimeout(() => setSavedDbVehicle(false), 4000);

    // Si el usuario tiene token de sesión, sincronizar en el servidor
    const token = localStorage.getItem('dinacity_token');
    if (token) {
      try {
        await fetch('/api/user/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            patente: v?.patente || vehicleData.displayPlate || patenteInput,
            marca: v?.brand || 'Vehículo',
            modelo: `${v?.model || ''} ${v?.version || ''}`.trim(),
            anio: v?.year || 2022,
            motor: v?.engine?.name || null,
            vin: v?.vin || null,
            radicacion: v?.dnrpa?.seccional || null
          })
        });
      } catch (e) {
        console.warn('Error sincronizando con backend:', e);
      }
    }
  };

  // Seleccionar vehículo guardado de la cochera
  const handleSelectFromCochera = (item) => {
    setPatenteInput(item.patente);
    if (item.vehicleType) setSelectedCategory(item.vehicleType);
    clientFallbackService.setActiveCocheraVehicle(item);
    handleSearchPatente(item.patente, item.vehicleType);
  };

  // Eliminar vehículo de la cochera
  const handleRemoveFromCochera = (e, item) => {
    e.stopPropagation();
    const updated = clientFallbackService.removeFromCochera(item.id || item.patente);
    setCocheraList(updated);
  };

  const isCurrentInCochera = () => {
    if (!vehicleData?.data) return false;
    const cleanCurrent = (vehicleData.displayPlate || vehicleData.data.patente || patenteInput).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return cocheraList.some(c => (c.patente || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase() === cleanCurrent);
  };

  // Detectar formato para renderizar la chapa visual acorde
  const cleanInput = patenteInput.replace(/[^A-Za-z0-9]/g, '');
  const isMercosurAuto = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(cleanInput);
  const isMercosurMoto = /^[A-Z]{1}[0-9]{3}[A-Z]{3}$/.test(cleanInput);
  const isClasica = /^[A-Z]{3}[0-9]{3}$/.test(cleanInput);
  const isClasicaMoto = /^[0-9]{3}[A-Z]{3,4}$/.test(cleanInput);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-blue-800/40 relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-900/60 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              🇦🇷 DNRPA • Registro Nacional de la Propiedad Automotor
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Autos • Motos • Camiones • Radicación Mendoza
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Búsqueda Universal por Patente y Cochera Digital</span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-3xl">
            El sistema central de <strong>DinAcitY</strong> conecta cualquier chapa patente con toda la aplicación: identificamos al instante el <strong>motor exacto</strong>, <strong>chasis VIN</strong> y <strong>radicación en Mendoza</strong> para cotizar repuestos por WhatsApp, cargar la libreta y activar alertas de RTO y seguro.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-800/50 self-start sm:self-auto shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Registro Homologado Mendoza</span>
        </div>
      </div>

      {/* Selector de Categorías (Autos / Motos / Camiones) */}
      <div className="mt-4 flex items-center justify-center gap-2 relative z-10 flex-wrap">
        <button
          type="button"
          onClick={() => handleCategorySwitch('auto')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 border cursor-pointer ${
            selectedCategory === 'auto'
              ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-102'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Car className="w-4 h-4 text-white" />
          <span>Autos y Utilitarios</span>
        </button>

        <button
          type="button"
          onClick={() => handleCategorySwitch('moto')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 border cursor-pointer ${
            selectedCategory === 'moto'
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-102'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Bike className="w-4 h-4 text-white" />
          <span>Motos y Scooters</span>
        </button>

        <button
          type="button"
          onClick={() => handleCategorySwitch('camion')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 border cursor-pointer ${
            selectedCategory === 'camion'
              ? 'bg-amber-600 text-white border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.5)] scale-102'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Truck className="w-4 h-4 text-white" />
          <span>Camiones y Línea Pesada</span>
        </button>
      </div>

      {/* Interactive License Plate Input Graphic */}
      <div className="mt-5 relative z-10 max-w-2xl mx-auto">
        
        {/* Chapa Patente Adaptativa */}
        <div className={`p-2.5 rounded-2xl shadow-2xl border-4 transition-all duration-300 max-w-md mx-auto ${
          isClasica || isClasicaMoto
            ? 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-zinc-700'
            : 'bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 border-gray-800'
        }`}>
          
          {/* Chapa Patente Interior */}
          <div className={`rounded-xl border-2 p-2 sm:p-3 relative shadow-inner ${
            isClasica || isClasicaMoto
              ? 'bg-black text-white border-zinc-700'
              : 'bg-white text-gray-900 border-gray-400'
          }`}>
            
            {/* Banda Azul Superior Mercosur Oficial (si no es clásica) */}
            {!isClasica && !isClasicaMoto && (
              <div className="bg-[#003399] -mx-2 -mt-2 sm:-mx-3 sm:-mt-3 px-3 py-1 rounded-t-lg flex items-center justify-between text-white text-[11px] font-black tracking-widest shadow-xs mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🇦🇷</span>
                  <span className="uppercase text-[10px] sm:text-xs">REPÚBLICA ARGENTINA</span>
                </div>
                <span className="text-[10px] text-yellow-300 font-extrabold uppercase">MERCOSUR</span>
              </div>
            )}

            {/* Header estilo Clásica */}
            {(isClasica || isClasicaMoto) && (
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1 border-b border-zinc-800 pb-0.5">
                <span>🇦🇷 ARGENTINA</span>
                <span>REGISTRO AUTOMOTOR</span>
              </div>
            )}

            {/* Input Box para la Patente */}
            <div className="flex items-center justify-center my-1">
              <input
                type="text"
                value={patenteInput}
                onChange={handleFormatInput}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchPatente()}
                placeholder={selectedCategory === 'moto' ? 'A 042 BVC' : (selectedCategory === 'camion' ? 'AF 912 OP' : 'AF 482 QZ')}
                maxLength={17}
                className={`w-full text-center text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-widest bg-transparent focus:outline-none font-mono py-1 ${
                  isClasica || isClasicaMoto ? 'text-white placeholder-zinc-600' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            <div className={`text-center text-[10px] font-semibold uppercase tracking-wider ${
              isClasica || isClasicaMoto ? 'text-zinc-500' : 'text-gray-400'
            }`}>
              {selectedCategory === 'moto'
                ? 'Patente de Moto (Mercosur A000AAA o Clásica 000AAA)'
                : (selectedCategory === 'camion'
                  ? 'Patente de Camión o Línea Pesada (Mercosur o Clásica)'
                  : 'Mercosur (AA000AA) • Clásica (AAA000) • Chasis VIN (17 dígitos)')
              }
            </div>
          </div>
        </div>

        {/* Submit & Add Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleSearchPatente()}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-red-600/30 transition flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Consultando Registro DNRPA Mendoza...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Buscar Patente en DNRPA</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Plates according to category */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap text-xs text-blue-200">
          <span className="text-[11px] text-blue-300/80 font-bold mr-1">Patentes registradas en Mendoza:</span>
          {(categorySamples[selectedCategory] || categorySamples.auto).map((sample) => (
            <button
              key={sample.plate}
              type="button"
              onClick={() => {
                setPatenteInput(sample.plate);
                handleSearchPatente(sample.plate);
              }}
              className="px-2.5 py-1 rounded-md bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50 text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>{sample.plate}</span>
              <span className="text-[10px] text-blue-300 font-sans hidden md:inline">({sample.label.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Asistente de Confirmación y Vinculación Oficial (Cuando la patente no tiene ficha previa) */}
      {vehicleData && vehicleData.requiresConfirmation && (
        <div className="mt-6 bg-slate-800/95 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl relative z-10 animate-fadeIn space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-black bg-amber-500 text-slate-950 shadow-xs">
                  {vehicleData.displayPlate || patenteInput}
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-700/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Patente en DNRPA • Requiere vincular modelo
                </span>
                <span className="text-xs text-slate-300 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full">
                  {vehicleData.formatInfo?.seriesName || 'Registro Automotor'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Ficha Oficial para {vehicleData.displayPlate || patenteInput}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Esta patente fue reconocida en la serie registral de <strong>{vehicleData.formatInfo?.estimatedYear || '2011'}</strong>. Para asegurar que cotices repuestos para <strong>tu auto exacto</strong> y no de otro vehículo, seleccioná o confirmá tu modelo para vincularlo a tu Cochera Digital:
              </p>
            </div>
          </div>

          {/* Sugerencias Rápidas para esta Serie / Año */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Sugerencias populares para el año {vehicleData.formatInfo?.estimatedYear || '2011'}:
            </span>
            <div className="flex flex-wrap gap-2">
              {getQuickPresets(vehicleData.formatInfo?.estimatedYear || 2011, selectedCategory).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleConfirmVehicleLink({
                      brand: preset.brand,
                      model: preset.model,
                      version: preset.version,
                      year: preset.year,
                      engine: preset.engine,
                      vehicleType: selectedCategory
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-400 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>{preset.brand} {preset.model}</span>
                  <span className="text-[10px] text-slate-400">({preset.version})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de Selección Personalizada */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              O seleccioná tu marca, modelo y motor:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Marca */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Marca</label>
                <select
                  value={confirmBrand}
                  onChange={(e) => {
                    const b = e.target.value;
                    setConfirmBrand(b);
                    const brands = (CLIENT_TAXONOMY[selectedCategory] || CLIENT_TAXONOMY.auto).brands;
                    const brandObj = brands.find(item => item.name === b || item.id === b.toLowerCase());
                    if (brandObj && brandObj.models.length > 0) {
                      setConfirmModel(brandObj.models[0]);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {(CLIENT_TAXONOMY[selectedCategory] || CLIENT_TAXONOMY.auto).brands.map((b) => (
                    <option key={b.id || b.name} value={b.name}>{b.name}</option>
                  ))}
                  <option value="Otra Marca">Otra Marca (escribir modelo)</option>
                </select>
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Modelo</label>
                <input
                  type="text"
                  value={confirmModel}
                  onChange={(e) => setConfirmModel(e.target.value)}
                  placeholder="Ej: 207 Compact / Gol / Corsa"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Año */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Año</label>
                <input
                  type="number"
                  value={confirmYear}
                  onChange={(e) => setConfirmYear(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Motor / Versión */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Motor / Versión</label>
                <input
                  type="text"
                  value={confirmEngine}
                  onChange={(e) => setConfirmEngine(e.target.value)}
                  placeholder="Ej: 1.4 Nafta / 1.6 MSI / 2.0 TDI"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Al confirmar, este vehículo quedará guardado de inmediato en tu Cochera para la patente <strong>{vehicleData.displayPlate || patenteInput}</strong>.
              </span>
              <button
                type="button"
                onClick={() => {
                  handleConfirmVehicleLink({
                    brand: confirmBrand,
                    model: confirmModel,
                    version: confirmEngine || confirmModel,
                    year: confirmYear,
                    engine: { name: confirmEngine || `Motor Oficial ${confirmBrand} ${confirmModel}` },
                    vehicleType: selectedCategory
                  });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Confirmar y Vincular Vehículo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Specification Card (When Found) */}
      {vehicleData && vehicleData.data && (
        <div className="mt-6 bg-slate-800/95 border border-blue-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative z-10 animate-fadeIn space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-black bg-blue-600 text-white shadow-xs">
                  {vehicleData.displayPlate || vehicleData.data?.patente || patenteInput}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vehículo Identificado con Éxito
                </span>
                <span className="text-xs text-blue-300 bg-blue-950/80 border border-blue-800 px-2.5 py-0.5 rounded-full">
                  📍 {vehicleData.data?.dnrpa?.seccional || 'Mendoza N° 4 (Godoy Cruz)'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {vehicleData.data?.brand} {vehicleData.data?.model} <span className="text-red-400">{vehicleData.data?.version || ''}</span> ({vehicleData.data?.year || ''})
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveToCochera}
                className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isCurrentInCochera()
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 hover:bg-emerald-900'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                }`}
                title="Guardar este vehículo en tu Cochera Digital"
              >
                <Bookmark className="w-3.5 h-3.5 text-yellow-300" />
                <span>{savedDbVehicle ? '✓ Guardado en tu Cochera' : (isCurrentInCochera() ? '✓ En tu Cochera Digital' : '➕ Guardar en mi Cochera')}</span>
              </button>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* Motor */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
                Motor y Potencia
              </span>
              <p className="font-bold text-white text-sm leading-snug">{vehicleData.data?.engine?.name || 'Motor Homologado DNRPA'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Cilindrada: {vehicleData.data?.engine?.displacement || '-'} • {vehicleData.data?.engine?.power || '-'}
              </p>
              <p className="text-slate-400 text-[11px]">
                Código Motor: <span className="font-mono text-blue-300 font-bold">{vehicleData.data?.engine?.code || '-'}</span>
              </p>
            </div>

            {/* Combustible y Chasis */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                Combustible & Chasis
              </span>
              <p className="font-bold text-white text-sm leading-snug">{vehicleData.data?.engine?.fuel || 'Nafta Súper'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5 font-mono">
                VIN: <span className="text-emerald-300">{vehicleData.data?.vin || vehicleData.data?.chassis?.vin || '-'}</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Tracción: {vehicleData.data?.chassis?.drive || 'Delantera 4x2'}
              </p>
            </div>

            {/* Radicación DNRPA */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Radicación Registro DNRPA
              </span>
              <p className="font-bold text-white text-sm leading-snug">{vehicleData.data?.dnrpa?.seccional || 'Mendoza N° 4 (Godoy Cruz)'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Código Registro: {vehicleData.data?.dnrpa?.codigoRegistro || '13004'}
              </p>
              <p className="text-slate-400 text-[11px]">
                Inscripción: {vehicleData.data?.dnrpa?.fechaInscripcionInicial || `Año ${vehicleData.data?.year || ''}`}
              </p>
            </div>

            {/* Repuestos Calibrados Directos */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-red-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-red-400" />
                Repuestos Calibrados
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleApplyVehicle('Pastillas de freno')}
                  className="w-full text-left text-blue-300 hover:text-white font-semibold text-[11px] truncate transition flex items-center gap-1 cursor-pointer"
                >
                  ➔ <span>Pastillas de Freno específicas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVehicle('Kit de distribucion')}
                  className="w-full text-left text-blue-300 hover:text-white font-semibold text-[11px] truncate transition flex items-center gap-1 cursor-pointer"
                >
                  ➔ <span>Kit de Distribución calibrado</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVehicle('Filtro de aceite')}
                  className="w-full text-left text-blue-300 hover:text-white font-semibold text-[11px] truncate transition flex items-center gap-1 cursor-pointer"
                >
                  ➔ <span>Filtro de Aceite original</span>
                </button>
              </div>
            </div>

          </div>

          {/* Acciones Rápidas: Conexión con TODOS los demás puntos de la aplicación */}
          <div className="pt-2">
            <span className="text-[11px] font-black uppercase text-blue-300 tracking-wider block mb-2">
              🔗 Conectar este vehículo con las secciones de DinAcitY:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              
              {onNavigateCotizador && (
                <button
                  type="button"
                  onClick={() => onNavigateCotizador(vehicleData.data)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Cotizar Repuestos</span>
                </button>
              )}

              {onNavigateMantenimiento && (
                <button
                  type="button"
                  onClick={() => onNavigateMantenimiento(vehicleData.data)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Pasaporte Service</span>
                </button>
              )}

              {onNavigateLibreta && (
                <button
                  type="button"
                  onClick={() => onNavigateLibreta(vehicleData.data)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <Bookmark className="w-4 h-4 fill-slate-950" />
                  <span>Libreta Services</span>
                </button>
              )}

              {onNavigateGuantera && (
                <button
                  type="button"
                  onClick={() => onNavigateGuantera(vehicleData.data)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span className="text-sm">📂</span>
                  <span>Guantera (RTO)</span>
                </button>
              )}

              {onNavigateKits && (
                <button
                  type="button"
                  onClick={() => onNavigateKits(vehicleData.data)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span className="text-sm">📦</span>
                  <span>Kits por Marca</span>
                </button>
              )}

              {onNavigateMapa && (
                <button
                  type="button"
                  onClick={() => onNavigateMapa(vehicleData.data)}
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

      {/* Mi Cochera Digital (Vehículos Registrados y Guardados) */}
      <div className="mt-6 pt-5 border-t border-blue-900/60 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🚘</span>
            <h3 className="text-sm sm:text-base font-black text-white">
              Mi Cochera Digital ({cocheraList.length} vehículos)
            </h3>
            <span className="text-[10px] text-blue-300 font-bold bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800">
              1-Click para activar
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {cocheraList.map((item) => {
            const cleanItemPlate = (item.patente || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            const cleanActivePlate = (vehicleData?.displayPlate || vehicleData?.data?.patente || patenteInput).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            const isActive = cleanItemPlate === cleanActivePlate;

            return (
              <div
                key={item.id || item.patente}
                onClick={() => handleSelectFromCochera(item)}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-900/60 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-1 ring-blue-400/50'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-700/80 hover:border-blue-600/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-black bg-black text-white border border-gray-600">
                      {item.patente}
                    </span>
                    <div className="flex items-center gap-1">
                      {isActive && (
                        <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Activo
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveFromCochera(e, item)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition"
                        title="Eliminar de mi cochera"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-bold text-white text-xs truncate">
                    {item.brand} {item.model}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.engine?.name || item.version || `Año ${item.year || ''}`}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{item.dnrpa?.seccional?.split('(')[0] || 'Mendoza'}</span>
                  <span className={`font-bold ${isActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-blue-400'}`}>
                    {isActive ? 'En uso ahora ➔' : 'Activar ➔'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
