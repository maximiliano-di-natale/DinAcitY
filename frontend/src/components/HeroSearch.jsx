import React from 'react';
import { Package, ShieldCheck, MapPin } from 'lucide-react';
import { PatenteSearchWidget } from './PatenteSearchWidget.jsx';

export function HeroSearch({
  onSelectVehicle,
  onOpenCombos,
  onNavigateCotizador,
  onNavigateMantenimiento
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Encabezado Propuesta de Valor DNRPA */}
      <div className="mb-3.5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              🇦🇷 DNRPA Oficial Argentina
            </span>
            <span className="text-[11px] font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/30">
              📍 Mendoza, Argentina
            </span>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 hidden sm:inline">
              ✓ Cotizador Express & Libreta de Mantenimiento
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Identificación de Vehículo por Patente DNRPA
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Ingresá tu patente para cargar la ficha técnica exacta del vehículo (motor, chasis, cilindrada) y cotizar repuestos por WhatsApp o planificar su mantenimiento.
          </p>
        </div>

        {/* Botón Armar Kit */}
        {onOpenCombos && (
          <button
            type="button"
            onClick={onOpenCombos}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 shrink-0 self-start md:self-end"
            title="Armar combos y kits completos para tu auto"
          >
            <Package className="w-4 h-4 text-white" />
            <span>📦 Armar Kit para tu Auto</span>
          </button>
        )}
      </div>

      {/* Tarjeta DNRPA Limpia */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-xl p-4 sm:p-5 relative overflow-hidden">
        <PatenteSearchWidget
          onSelectVehicle={onSelectVehicle}
          onNavigateCotizador={onNavigateCotizador}
          onNavigateMantenimiento={onNavigateMantenimiento}
        />
      </div>
    </div>
  );
}
