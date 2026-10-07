import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { MENDOZA_QUOTE_STORES } from '../services/clientFallbackService.js';

export function QuoteRequestWidget({ vehicle, onOpenPatenteModal, onSelectPart }) {
  const [partName, setPartName] = useState('Kit de Distribución con Bomba de Agua');
  const [selectedZone, setSelectedZone] = useState('todos');
  const [copiedStoreId, setCopiedStoreId] = useState(null);
  const [customNotes, setCustomNotes] = useState('');

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

  const zones = [
    { id: 'todos', label: 'Todas las Zonas' },
    { id: 'Carril Rodríguez Peña', label: '📍 Polo Carril Rodríguez Peña' },
    { id: 'Godoy Cruz', label: 'Godoy Cruz' },
    { id: 'Guaymallén', label: 'Guaymallén' },
    { id: 'Maipú', label: 'Maipú' }
  ];

  const filteredStores = MENDOZA_QUOTE_STORES.filter((st) => {
    if (selectedZone === 'todos') return true;
    return st.zone.toLowerCase().includes(selectedZone.toLowerCase()) || st.address.toLowerCase().includes(selectedZone.toLowerCase());
  });

  const generateWhatsAppMessage = (store) => {
    const lines = [
      `👋 Hola ${store.name}, te consulto desde el Cotizador de DinAcitY Mendoza:`,
      `🔧 *Repuesto buscado:* ${partName}`,
      `🚗 *Vehículo:* ${currentVehicleTitle}`,
      `🇦🇷 *Patente:* ${currentPatente}`,
      `⚙️ *Motor:* ${currentEngine}`,
      customNotes ? `📝 *Detalle:* ${customNotes}` : null,
      ``,
      `¿Tienen disponibilidad en mostrador (${store.address}) y cuál es el precio actual contado / transferencia o con tarjeta?`,
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
    const url = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Superior Cotizador Estilo PedidosYa / TurismoCity */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-red-500/30">
        
        {/* Subtle Background Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white text-red-700 shadow-sm">
                Opción 1 • Cotizador Express
              </span>
              <span className="text-xs font-bold text-white bg-black/25 px-2.5 py-0.5 rounded-full border border-white/20">
                📍 Mostrador Directo Mendoza por WhatsApp
              </span>
              <span className="text-xs font-bold text-emerald-200 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                ✓ Sin intermediarios ni precios inflados
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Pedí cotización a las casas de repuestos de Mendoza en 1 Click
            </h2>

            <p className="text-sm text-red-100 leading-relaxed">
              Elegí o escribí el repuesto que buscás. Armamos automáticamente el mensaje profesional con tu <strong>patente, motor y chasis</strong> para que el mostrador de repuestos te dé el precio real de mostrador al instante.
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
                  className="text-[11px] text-white hover:text-yellow-200 font-bold underline"
                >
                  Cambiar vehículo
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

      {/* Input de Repuesto y Selector de Chips */}
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
            O elegí de los repuestos más pedidos en Mendoza:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {quickParts.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setPartName(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
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
            placeholder="Aclaración adicional opcional (ej: marca preferida Valeo / ACDelco, si incluye mano de obra, zona Godoy Cruz...)"
            className="w-full px-3.5 py-2 bg-slate-900/60 border border-slate-700/80 text-xs text-slate-300 placeholder-slate-500 rounded-lg focus:outline-none focus:border-slate-500"
          />
        </div>

      </div>

      {/* Directorio de Casas de Repuestos y Mostradores de Mendoza */}
      <div className="space-y-4">
        
        {/* Filtro de Zonas en Mendoza */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-black text-white">
              Mostradores Verificados en Mendoza ({filteredStores.length} disponibles)
            </h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {zones.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelectedZone(z.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                  selectedZone === z.id
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Tiendas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-slate-500 transition shadow-lg relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-700/50 block w-fit mb-1">
                      {store.badge}
                    </span>
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
                    <span>{store.address}</span>
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
                  title="Copiar texto de cotización"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
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

      </div>

    </div>
  );
}
