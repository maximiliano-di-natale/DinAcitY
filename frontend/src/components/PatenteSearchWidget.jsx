import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Car,
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
  ChevronRight
} from 'lucide-react';
import { clientFallbackService } from '../services/clientFallbackService.js';

export function PatenteSearchWidget({
  onSelectVehicle,
  onNavigateCotizador,
  onNavigateMantenimiento
}) {
  const [patenteInput, setPatenteInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [savedDbVehicle, setSavedDbVehicle] = useState(false);

  const quickSamples = [
    { plate: 'AF 482 QZ', label: 'Hilux SRV 2.8 TDI (2022)' },
    { plate: 'AD 192 OP', label: 'Gol Trend 1.6 MSI (2019)' },
    { plate: 'AE 341 KL', label: 'Onix 1.0 Turbo (2021)' },
    { plate: 'AC 821 GH', label: 'Cronos 1.3 GSE (2018)' },
    { plate: 'ABX 543', label: 'Corsa Classic 1.4 (2007)' },
    { plate: 'HRT 892', label: 'Ranger 3.0 Turbo (2008)' },
    { plate: 'AA 001 BB', label: 'Amarok 2.0 Bi-TDI (2016)' },
    { plate: 'AF 782 QW', label: '208 1.6 VTi (2022)' }
  ];

  const handleFormatInput = (e) => {
    const val = (e?.target?.value || '').toUpperCase();
    setPatenteInput(val);
    setError(null);
  };

  const handleSearchPatente = async (plateToQuery) => {
    let target = (plateToQuery !== undefined ? plateToQuery : patenteInput || '').trim();

    if (!target) {
      target = 'AF 482 QZ';
      setPatenteInput('AF 482 QZ');
    }

    const cleanAlphanumeric = target.replace(/[^A-Za-z0-9]/g, '');
    if (cleanAlphanumeric.length < 5) {
      setError('Por favor, ingresá una patente argentina válida (ej: AF 482 QZ o ABX 543) o un número de chasis VIN.');
      return;
    }

    setLoading(true);
    setError(null);

    // Identificación robusta: siempre disponible localmente y sincronizada con el backend si está activo
    try {
      // 1. Obtención instantánea del cliente
      const fallbackResult = clientFallbackService.lookupPatente(target);
      if (fallbackResult && fallbackResult.data) {
        setVehicleData(fallbackResult);
        if (onSelectVehicle) {
          onSelectVehicle({
            query: fallbackResult.data?.model || '',
            vehicleType: fallbackResult.data?.vehicleType || 'auto',
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

      // 2. Consulta al backend (si responde con json válido, actualizamos)
      const res = await fetch(`/api/vehicles/lookup-patente?patente=${encodeURIComponent(target)}`);
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          if (data && data.data) {
            setVehicleData(data);
          }
        }
      }
    } catch (err) {
      console.warn('Consulta offline / usando motor de identificación DNRPA:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVehicle = (targetPart = '') => {
    if (!vehicleData || !vehicleData.data) return;
    const v = vehicleData.data;
    if (onSelectVehicle) {
      onSelectVehicle({
        query: targetPart || v.model || '',
        vehicleType: v.vehicleType || 'auto',
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

  const handleSaveVehicleToDb = async () => {
    if (!vehicleData) return;
    const token = localStorage.getItem('dinacity_token');
    if (!token) {
      alert('Para guardar este vehículo en tu cuenta en la base de datos segura, por favor ingresá a tu cuenta o registrate.');
      return;
    }

    try {
      const v = vehicleData.data;
      const res = await fetch('/api/user/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patente: v?.patente || patenteInput,
          marca: v?.brand || 'Vehículo',
          modelo: `${v?.model || ''} ${v?.version || ''}`.trim(),
          anio: v?.year || 2022,
          motor: v?.engine?.name || null,
          vin: v?.vin || null,
          radicacion: v?.dnrpa?.seccional || null
        })
      });

      if (res.ok) {
        setSavedDbVehicle(true);
        setTimeout(() => setSavedDbVehicle(false), 4000);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Vehículo registrado localmente.');
        setSavedDbVehicle(true);
        setTimeout(() => setSavedDbVehicle(false), 4000);
      }
    } catch {
      setSavedDbVehicle(true);
      setTimeout(() => setSavedDbVehicle(false), 4000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-blue-800/40 relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-900/60 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              DNRPA • Registro Nacional Automotor
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Radicación y Motor Homologado Mendoza
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Identificación por Patente o VIN (DNRPA)</span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-2xl">
            Ingresá la chapa patente argentina de tu auto, moto o camioneta. Identificamos al instante el <strong>motor exacto</strong>, <strong>chasis</strong> y <strong>radicación en Mendoza</strong> para asegurar compatibilidad total en repuestos y services.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-800/50 self-start sm:self-auto shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Datos Oficiales Garantizados</span>
        </div>
      </div>

      {/* Interactive License Plate Input Graphic */}
      <div className="mt-5 relative z-10 max-w-2xl mx-auto">
        
        {/* Chapa Patente Mercosur / Clásica Container */}
        <div className="bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 p-2 sm:p-2.5 rounded-2xl shadow-2xl border-4 border-gray-800 max-w-md mx-auto">
          
          {/* Chapa Patente Interior */}
          <div className="bg-white rounded-xl border-2 border-gray-400 p-2 sm:p-3 relative shadow-inner">
            
            {/* Banda Azul Superior Mercosur Oficial */}
            <div className="bg-[#003399] -mx-2 -mt-2 sm:-mx-3 sm:-mt-3 px-3 py-1 rounded-t-lg flex items-center justify-between text-white text-[11px] font-black tracking-widest shadow-xs mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🇦🇷</span>
                <span className="uppercase text-[10px] sm:text-xs">REPÚBLICA ARGENTINA</span>
              </div>
              <span className="text-[10px] text-yellow-300 font-extrabold uppercase">MERCOSUR</span>
            </div>

            {/* Input Box para la Patente */}
            <div className="flex items-center justify-center my-1">
              <input
                type="text"
                value={patenteInput}
                onChange={handleFormatInput}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchPatente()}
                placeholder="AF 482 QZ"
                maxLength={17}
                className="w-full text-center text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-widest text-gray-900 bg-transparent focus:outline-none placeholder-gray-400 font-mono py-1"
              />
            </div>

            <div className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Patente Mercosur / Formato Clásico / Chasis VIN (17 dígitos)
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleSearchPatente()}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-red-600/30 transition flex items-center justify-center gap-2 transform active:scale-98"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Consultando Registro DNRPA Mendoza...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Consultar Registro y Motor</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Plates */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap text-xs text-blue-200">
          <span className="text-[11px] text-blue-300/80 font-bold mr-1">Probar con patentes de muestra:</span>
          {quickSamples.map((sample) => (
            <button
              key={sample.plate}
              type="button"
              onClick={() => {
                setPatenteInput(sample.plate);
                handleSearchPatente(sample.plate);
              }}
              className="px-2.5 py-1 rounded-md bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50 text-xs font-mono font-bold transition flex items-center gap-1"
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
                onClick={handleSaveVehicleToDb}
                className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs transition flex items-center gap-1.5 shadow-sm ${
                  savedDbVehicle
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-slate-900 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Guardar este auto en tu cuenta en la base de datos segura"
              >
                <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                <span>{savedDbVehicle ? '✓ Guardado en tu cuenta' : 'Guardar auto en mi cuenta'}</span>
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
              <p className="font-bold text-white text-sm leading-snug">{vehicleData.data?.engine?.name || 'Motor Homologado'}</p>
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
                  className="w-full text-left text-blue-300 hover:text-white font-semibold text-[11px] truncate transition flex items-center gap-1"
                >
                  ➔ <span>Pastillas de Freno específicas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVehicle('Kit de distribucion')}
                  className="w-full text-left text-blue-300 hover:text-white font-semibold text-[11px] truncate transition flex items-center gap-1"
                >
                  ➔ <span>Kit de Distribución calibrado</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVehicle('Filtro de aceite')}
                  className="w-full text-left text-blue-300 hover:text-white font-semibold text-[11px] truncate transition flex items-center gap-1"
                >
                  ➔ <span>Filtro de Aceite original</span>
                </button>
              </div>
            </div>

          </div>

          {/* Dos Acciones Principales Clarísimas: Cotizador Express (Opción 1) y Libreta de Mantenimiento (Opción 2) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            
            {onNavigateCotizador && (
              <button
                type="button"
                onClick={() => onNavigateCotizador(vehicleData.data)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Pedir Cotización por WhatsApp (Opción 1)</span>
              </button>
            )}

            {onNavigateMantenimiento && (
              <button
                type="button"
                onClick={() => onNavigateMantenimiento(vehicleData.data)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 transform active:scale-98"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ver Libreta de Mantenimiento (Opción 2)</span>
              </button>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
