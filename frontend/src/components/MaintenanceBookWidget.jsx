import React, { useState } from 'react';
import {
  BookOpen,
  Gauge,
  Droplets,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wrench,
  Fuel,
  Disc,
  Battery,
  Wind,
  Car,
  MessageCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { clientFallbackService } from '../services/clientFallbackService.js';

export function MaintenanceBookWidget({ vehicle, onOpenPatenteModal, onQuoteService }) {
  const [currentKm, setCurrentKm] = useState(60000);
  const [customKmInput, setCustomKmInput] = useState('60000');

  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';

  const currentPatente = vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP';
  const currentEngine = vehicle?.engine?.name || vehicle?.data?.engine?.name || '1.6 8V MSI Naftero (101 CV)';

  const specs = clientFallbackService.getMaintenanceSpecs(vehicle);

  const mileageMilestones = [
    10000, 20000, 30000, 40000, 50000, 60000, 80000, 100000, 120000
  ];

  const handleSelectKm = (km) => {
    setCurrentKm(km);
    setCustomKmInput(km.toString());
  };

  const handleCustomKmChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomKmInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setCurrentKm(parsed);
    }
  };

  // Diagnóstico inteligente de service según kilometraje
  const getServiceDiagnosis = (km) => {
    const isTimingDue = km >= 60000 && km % 60000 <= 15000;
    const isSparkPlugsDue = km % 40000 <= 10000;
    const isBrakeFluidDue = km % 40000 <= 10000;
    const isMajor = km >= 60000 && (km % 60000 <= 10000 || km % 100000 <= 10000);

    const items = [
      {
        id: 'oil-filter',
        name: `Aceite de Motor ${specs.oil.spec} (${specs.oil.capacity})`,
        spec: `Norma: ${specs.oil.norm}`,
        type: 'rutinario',
        due: true,
        action: 'Reemplazo obligatorio en cada service (cada 10.000 km)'
      },
      {
        id: 'oil-filter-element',
        name: 'Filtro de Aceite Original Genuino',
        spec: 'Blindado / Cartucho con junta nueva',
        type: 'rutinario',
        due: true,
        action: 'Reemplazo simultáneo con el aceite'
      },
      {
        id: 'air-filter',
        name: 'Filtro de Aire Motor',
        spec: 'Elemento de celulosa alta retención de polvo cuyano',
        type: 'rutinario',
        due: true,
        action: 'Reemplazo recomendado en Mendoza por polvo en suspensión'
      },
      {
        id: 'cabin-filter',
        name: 'Filtro de Polen / Habitáculo',
        spec: 'Carbón activo antibacteriano',
        type: km % 20000 <= 5000 ? 'recomendado' : 'rutinario',
        due: km % 20000 <= 5000,
        action: 'Mejora el caudal de aire acondicionado y calefacción'
      },
      {
        id: 'fuel-filter',
        name: 'Filtro de Combustible (Nafta / Diésel)',
        spec: 'Blindado en línea',
        type: km % 20000 <= 5000 ? 'recomendado' : 'rutinario',
        due: km % 20000 <= 5000,
        action: 'Protege inyectores y bomba de alta presión'
      },
      {
        id: 'timing-kit',
        name: 'Kit de Distribución + Tensor + Bomba de Agua',
        spec: specs.timing.type,
        type: 'critico',
        due: isTimingDue,
        action: isTimingDue ? '⚠️ CRÍTICO: Reemplazo impostergable para evitar rotura de válvulas' : 'Inspección visual de tensión y ruidos'
      },
      {
        id: 'spark-plugs',
        name: 'Bujías de Encendido (Juego x4)',
        spec: 'Calibración de electrodo 0.8mm',
        type: isSparkPlugsDue ? 'recomendado' : 'rutinario',
        due: isSparkPlugsDue,
        action: isSparkPlugsDue ? 'Reemplazo programado por desgaste de chispa' : 'Control de consumo y luz de electrodos'
      },
      {
        id: 'brake-fluid',
        name: `Líquido de Frenos ${specs.brakeFluid.type}`,
        spec: 'Punto de ebullición seco > 260°C',
        type: isBrakeFluidDue ? 'recomendado' : 'rutinario',
        due: isBrakeFluidDue,
        action: isBrakeFluidDue ? 'Vaciado y purgado completo del circuito' : 'Medición de humedad con tester digital'
      },
      {
        id: 'brakes-pads',
        name: 'Inspección de Pastillas y Discos de Freno',
        spec: 'Control de espesor mínimo útil',
        type: 'rutinario',
        due: true,
        action: 'Verificación de desgaste parejo en ruedas delanteras'
      },
      {
        id: 'coolant-fluid',
        name: `Líquido Refrigerante Orgánico (${specs.coolant.type})`,
        spec: `Capacidad: ${specs.coolant.capacity}`,
        type: isTimingDue ? 'recomendado' : 'rutinario',
        due: isTimingDue,
        action: isTimingDue ? 'Renovación completa al cambiar la bomba de agua' : 'Control de densidad y nivel en vaso de expansión'
      }
    ];

    let title = 'Service de Mantenimiento Básico (Preventivo)';
    let badgeColor = 'bg-blue-600 text-white';
    let urgency = 'Preventivo Programado';
    let estimatedCost = '$85.000 - $115.000';

    if (isMajor) {
      title = `Service Mayor y Crítico de los ${km.toLocaleString('es-AR')} km`;
      badgeColor = 'bg-red-600 text-white animate-pulse';
      urgency = 'Crítico de Seguridad Motor';
      estimatedCost = '$220.000 - $340.000 (Incluye Distribución)';
    } else if (km % 20000 <= 5000) {
      title = `Service Intermedio de los ${km.toLocaleString('es-AR')} km`;
      badgeColor = 'bg-amber-600 text-white';
      urgency = 'Intermedio Completo';
      estimatedCost = '$135.000 - $175.000';
    }

    return {
      title,
      badgeColor,
      urgency,
      estimatedCost,
      isMajor,
      items
    };
  };

  const diagnosis = getServiceDiagnosis(currentKm);

  const handleQuoteServiceWhatsApp = () => {
    if (onQuoteService) {
      onQuoteService({
        partName: `Kit completo para ${diagnosis.title} (${currentKm.toLocaleString('es-AR')} km) - Aceite ${specs.oil.spec} + Filtros`,
        vehicle
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Superior Pasaporte Digital de Mantenimiento */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-blue-700/40">
        
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500 text-white shadow-sm">
                Opción 2 • Pasaporte Digital
              </span>
              <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                📖 Libreta de Mantenimiento Automotriz Inteligente
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ✓ Especificaciones Oficiales de Fábrica
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Libreta de Mantenimiento & Ficha Técnica por Kilometraje
            </h2>

            <p className="text-sm text-blue-100 leading-relaxed">
              Calculamos exactamente qué le toca a tu auto según los kilómetros recorridos. Conocé las <strong>normas de aceite homologadas</strong>, <strong>capacidades de fluidos</strong> y evitá roturas de motor o cobros innecesarios en talleres.
            </p>
          </div>

          {/* Ficha del Vehículo */}
          <div className="bg-slate-950/60 backdrop-blur-md border border-blue-400/30 rounded-xl p-4 shrink-0 max-w-md w-full sm:w-auto shadow-inner">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-black uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Vehículo Vinculado
              </span>
              {onOpenPatenteModal && (
                <button
                  type="button"
                  onClick={onOpenPatenteModal}
                  className="text-[11px] text-blue-300 hover:text-white font-bold underline"
                >
                  Cambiar patente
                </button>
              )}
            </div>

            <p className="font-black text-base sm:text-lg text-white">
              {currentVehicleTitle}
            </p>

            <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-blue-200">
              <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-black">
                🇦🇷 {currentPatente}
              </span>
              <span>
                Motor: <strong className="text-white">{currentEngine}</strong>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Selector de Kilometraje */}
      <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-1 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-yellow-400" />
              <span>Kilometraje Actual de tu Vehículo</span>
            </span>
            <p className="text-xs text-slate-400">
              Elegí o ingresá los kilómetros de tu odómetro para ver el service exacto que le corresponde:
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700 w-fit">
            <input
              type="text"
              value={customKmInput}
              onChange={handleCustomKmChange}
              placeholder="60000"
              className="w-28 text-center font-mono font-black text-lg bg-transparent text-yellow-300 focus:outline-none"
            />
            <span className="text-xs font-black text-slate-400 pr-2">KM</span>
          </div>
        </div>

        {/* Botones de KM Rápidos */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {mileageMilestones.map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => handleSelectKm(km)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                currentKm === km
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
              }`}
            >
              {(km / 1000)}k km
            </button>
          ))}
        </div>

      </div>

      {/* Diagnóstico Inteligente de Service */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${diagnosis.badgeColor}`}>
                {diagnosis.urgency}
              </span>
              <span className="text-xs text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700 font-mono">
                Odómetro: {currentKm.toLocaleString('es-AR')} KM
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {diagnosis.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Costo promedio estimado de repuestos en Mendoza: <strong className="text-emerald-400 font-bold">{diagnosis.estimatedCost}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuoteServiceWhatsApp}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 transform active:scale-98 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Cotizar este Service por WhatsApp</span>
          </button>
        </div>

        {/* Checklist de Tareas y Repuestos del Service */}
        <div className="space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
            Detalle de Componentes y Trabajos para este Kilometraje:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnosis.items.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  item.due
                    ? item.type === 'critico'
                      ? 'bg-red-950/30 border-red-500/50'
                      : item.type === 'recomendado'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-900/80 border-slate-700'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.due ? (
                    item.type === 'critico' ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : item.type === 'recomendado' ? (
                      <Wrench className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      {item.name}
                    </span>
                    {item.type === 'critico' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                        Crítico
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {item.spec}
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Ficha Técnica Oficial de Fábrica (Fluidos y Capacidades) */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="w-5 h-5 text-blue-400" />
          <h3 className="text-base sm:text-lg font-black text-white">
            Ficha Técnica Oficial de Fluidos y Lubricantes ({currentVehicleTitle})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          
          {/* Aceite de Motor */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              Aceite de Motor Homologado
            </span>
            <p className="text-sm font-black text-white">
              {specs.oil.spec}
            </p>
            <p className="text-slate-400 text-[11px]">
              Norma de fábrica: <strong className="text-slate-200">{specs.oil.norm}</strong>
            </p>
            <p className="text-slate-400 text-[11px]">
              Capacidad de cárter: <strong className="text-white">{specs.oil.capacity}</strong>
            </p>
            <span className="inline-block mt-1 text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-semibold border border-blue-800">
              Intervalo: {specs.oil.interval}
            </span>
          </div>

          {/* Refrigerante de Motor */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Refrigerante / Anticongelante
            </span>
            <p className="text-sm font-black text-white">
              {specs.coolant.type}
            </p>
            <p className="text-slate-400 text-[11px]">
              Capacidad total del circuito: <strong className="text-white">{specs.coolant.capacity}</strong>
            </p>
            <p className="text-slate-400 text-[11px]">
              Dilución: 50% concentrado orgánico / 50% desmineralizada
            </p>
            <span className="inline-block mt-1 text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-semibold border border-red-800">
              Intervalo: {specs.coolant.interval}
            </span>
          </div>

          {/* Distribución */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              Sistema de Distribución
            </span>
            <p className="text-sm font-black text-white">
              {specs.timing.type}
            </p>
            <p className="text-slate-400 text-[11px]">
              Recomendación: Cambiar siempre junto a tensor y bomba de agua
            </p>
            <span className="inline-block mt-1 text-[10px] bg-yellow-950 text-yellow-300 px-2 py-0.5 rounded font-semibold border border-yellow-800">
              {specs.timing.interval}
            </span>
          </div>

          {/* Líquido de Frenos */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Disc className="w-3.5 h-3.5" />
              Líquido de Frenos
            </span>
            <p className="text-sm font-black text-white">
              {specs.brakeFluid.type}
            </p>
            <p className="text-slate-400 text-[11px]">
              Intervalo: {specs.brakeFluid.interval}
            </p>
          </div>

          {/* Neumáticos y Presión */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" />
              Neumáticos & Presión (PSI)
            </span>
            <p className="text-sm font-black text-white font-mono">
              {specs.tires.size}
            </p>
            <p className="text-slate-400 text-[11px]">
              Ciudad: <strong className="text-white">{specs.tires.pressureCity}</strong> • Carga: <strong className="text-white">{specs.tires.pressureLoaded}</strong>
            </p>
          </div>

          {/* Batería */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5" />
              Batería Homologada
            </span>
            <p className="text-sm font-black text-white font-mono">
              {specs.battery.spec}
            </p>
            <p className="text-slate-400 text-[11px]">
              Arranque en frío CCA verificado
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
