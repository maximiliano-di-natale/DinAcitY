import React, { useState } from 'react';
import { Search, ShieldCheck, Car, CheckCircle2, AlertCircle, Wrench, Sparkles, MapPin, Gauge, Fuel } from 'lucide-react';

export function PatenteSearchWidget({ onSelectVehicle, onDirectSearch }) {
  const [patenteInput, setPatenteInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);

  const quickSamples = [
    { plate: 'AF 482 QZ', label: 'Hilux SRV 2.8 TDI (2022)' },
    { plate: 'AD 192 OP', label: 'Gol Trend 1.6 MSI (2019)' },
    { plate: 'AE 341 KL', label: 'Onix 1.0 Turbo (2021)' },
    { plate: 'AC 821 GH', label: 'Cronos 1.3 GSE (2018)' },
    { plate: 'ABX 543', label: 'Corsa Classic 1.4 (2007)' }
  ];

  const handleFormatInput = (e) => {
    const val = e.target.value.toUpperCase();
    setPatenteInput(val);
    setError(null);
  };

  const handleSearchPatente = async (plateToQuery) => {
    const target = plateToQuery || patenteInput;
    if (!target || target.trim().length < 6) {
      setError('Por favor, ingresá una patente argentina válida (ej: AF 482 QZ o ABX 543) o un número de chasis VIN.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/vehicles/lookup-patente?patente=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo identificar el vehículo en el registro');
      }
      setVehicleData(data);
    } catch (err) {
      setError(err.message);
      setVehicleData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVehicle = (targetPart = '') => {
    if (!vehicleData) return;
    const v = vehicleData.data;
    if (onSelectVehicle) {
      onSelectVehicle({
        query: targetPart || v.model,
        vehicleType: v.vehicleType || 'auto',
        brand: v.brandId || v.brand.toLowerCase(),
        model: v.model,
        year: v.year.toString(),
        engineSpec: v.engine?.name || '',
        fullVehicleTitle: `${v.brand} ${v.model} ${v.version} (${v.year})`
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-4 sm:p-6 shadow-xl border border-blue-800/40 relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-900/60 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              DNRPA • Registro Nacional Automotor
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Búsqueda por Fechas Flexibles de Repuestos
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Búsqueda por Patente o Chasis (VIN)</span>
          </h2>
          <p className="text-xs text-blue-200/80 mt-0.5">
            Ingresá la chapa patente argentina de tu vehículo. Identificamos al instante el <strong>motor exacto</strong>, <strong>chasis</strong> y <strong>radicación en Mendoza</strong> para encontrar los repuestos 100% compatibles.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-800/50 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Datos Oficiales de Motor y Chasis</span>
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
                placeholder="AF 482 QZ o ABX 543"
                maxLength={17}
                className="w-full text-center text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-widest text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 font-mono py-1"
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
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-lg hover:shadow-red-600/30 transition flex items-center justify-center gap-2 transform active:scale-98"
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
          <span className="text-[11px] text-blue-300/80 font-bold mr-1">Probar con patentes reales:</span>
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
        <div className="mt-6 bg-slate-800/90 border border-blue-500/40 rounded-xl p-4 sm:p-5 shadow-2xl relative z-10 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-blue-600 text-white shadow-xs">
                  {vehicleData.displayPlate}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vehículo Identificado con Éxito
                </span>
                <span className="text-xs text-blue-300 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded-full">
                  📍 {vehicleData.data.dnrpa.seccional}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {vehicleData.data.brand} {vehicleData.data.model} <span className="text-red-400">{vehicleData.data.version}</span> ({vehicleData.data.year})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleApplyVehicle()}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 transform active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Ver todos los repuestos para este auto</span>
            </button>
          </div>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
            
            {/* Motor */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80">
              <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-blue-400" />
                Motor y Potencia
              </span>
              <p className="font-bold text-white text-sm leading-snug">{vehicleData.data.engine.name}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Cilindrada: {vehicleData.data.engine.displacement} • {vehicleData.data.engine.power}
              </p>
              <p className="text-slate-400 text-[11px]">
                Código Motor: <span className="font-mono text-blue-300 font-bold">{vehicleData.data.engine.code}</span>
              </p>
            </div>

            {/* Combustible y Chasis */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80">
              <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Fuel className="w-3 h-3 text-emerald-400" />
                Combustible & Chasis
              </span>
              <p className="font-bold text-white text-sm leading-snug">{vehicleData.data.engine.fuel}</p>
              <p className="text-slate-400 text-[11px] mt-0.5 font-mono">
                VIN: <span className="text-emerald-300">{vehicleData.data.vin}</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Tracción: {vehicleData.data.chassis.drive}
              </p>
            </div>

            {/* Radicación DNRPA */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80">
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                Radicación Registro DNRPA
              </span>
              <p className="font-bold text-white text-sm leading-snug">{vehicleData.data.dnrpa.seccional}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Código Registro: {vehicleData.data.dnrpa.codigoRegistro}
              </p>
              <p className="text-slate-400 text-[11px]">
                Inscripción: {vehicleData.data.dnrpa.fechaInscripcionInicial}
              </p>
            </div>

            {/* Repuestos Calibrados Directos */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80">
              <span className="text-[10px] text-red-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Wrench className="w-3 h-3 text-red-400" />
                Compatibilidad Garantizada
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
                  onClick={() => handleApplyVehicle('Radiador de agua')}
                  className="w-full text-left text-blue-300 hover:text-white font-semibold text-[11px] truncate transition flex items-center gap-1"
                >
                  ➔ <span>Radiador de Agua para este motor</span>
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

        </div>
      )}

    </div>
  );
}
