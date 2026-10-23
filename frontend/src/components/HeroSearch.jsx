import React from 'react';
import { Package, ShieldCheck, MapPin } from 'lucide-react';
import { PatenteSearchWidget } from './PatenteSearchWidget.jsx';

export function HeroSearch({
  onSelectVehicle,
  onOpenCombos,
  onNavigateCotizador,
  onNavigateMantenimiento,
  onNavigateLibreta,
  onNavigateGuantera,
  onNavigateKits,
  onNavigateMapa
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Encabezado Mi Cochera Digital */}
      <div className="mb-3.5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              🚗 Mi Cochera Digital
            </span>
            <span className="text-[11px] font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/30">
              📍 Mendoza, Argentina
            </span>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 hidden sm:inline">
              ✓ Autos • Motos • Camiones • Eje Central
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Gestión de Vehículos y Mantenimiento Inteligente
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Cargá tu auto a mano con su kilometraje actual para calcular services exactos, repuestos compatibles en mostradores de Mendoza y alertas de RTO y seguro.
          </p>
        </div>
      </div>

      {/* Tarjeta DNRPA Limpia */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-xl p-4 sm:p-5 relative overflow-hidden">
        <PatenteSearchWidget
          onSelectVehicle={onSelectVehicle}
          onNavigateCotizador={onNavigateCotizador}
          onNavigateMantenimiento={onNavigateMantenimiento}
          onNavigateLibreta={onNavigateLibreta}
          onNavigateGuantera={onNavigateGuantera}
          onNavigateKits={onNavigateKits}
          onNavigateMapa={onNavigateMapa}
        />
      </div>
    </div>
  );
}
