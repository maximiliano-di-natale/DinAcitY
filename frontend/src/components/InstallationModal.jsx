import React, { useState, useEffect } from 'react';
import { X, Wrench, MapPin, Star, ShieldCheck, Clock, MessageCircle, CheckCircle2, DollarSign } from 'lucide-react';

export function InstallationModal({ isOpen, onClose, item }) {
  const [selectedZone, setSelectedZone] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [estimateData, setEstimateData] = useState(null);

  useEffect(() => {
    if (isOpen && item) {
      fetchEstimate(item.partName || item.title, selectedZone);
    }
  }, [isOpen, item, selectedZone]);

  const fetchEstimate = async (query, zone) => {
    setLoading(true);
    try {
      const zoneParam = zone && zone !== 'todos' ? `&zone=${encodeURIComponent(zone)}` : '';
      const res = await fetch(`/api/workshops/estimate?query=${encodeURIComponent(query)}${zoneParam}`);
      const data = await res.json();
      setEstimateData(data);
    } catch (err) {
      console.error('Error obteniendo cotización de mano de obra:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  const formattedMoney = (val) => {
    if (!val) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const zonesList = [
    { id: 'todos', name: 'Todo Gran Mendoza' },
    { id: 'Carril Rodríguez Peña', name: 'Carril Rodríguez Peña' },
    { id: 'Godoy Cruz', name: 'Godoy Cruz' },
    { id: 'Guaymallén', name: 'Guaymallén' },
    { id: 'Maipú', name: 'Maipú' },
    { id: 'Ciudad de Mendoza', name: 'Ciudad de Mendoza (Capital)' }
  ];

  const handleWhatsAppBooking = (workshop) => {
    const message = encodeURIComponent(
      `Hola ${workshop.name}, vi en DinAcitY Mendoza el repuesto:\n"${item.title}"\npara mi ${item.vehicleCompatibility || 'auto'}.\n\nQuiero coordinar un turno para la colocación e instalación en su taller de ${workshop.address}. ¿Tienen disponibilidad de turnos esta semana y cuál es el presupuesto estimado? Muchas gracias.`
    );
    window.open(`https://wa.me/${workshop.whatsapp}?text=${message}`, '_blank');
  };

  const labor = estimateData?.laborEstimate;
  const workshops = estimateData?.recommendedWorkshops || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-red-700 shadow-xs">
                  Red de Talleres Asociados
                </span>
                <span className="text-[11px] font-bold text-red-100">
                  📍 Mendoza, Argentina
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                Turno de Instalación Mecánica
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Item Summary Card */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                Repuesto a Instalar
              </span>
              <h4 className="font-bold text-sm text-gray-900 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-blue-700 font-semibold mt-0.5">
                🚗 {item.vehicleCompatibility}
              </p>
            </div>
            {item.totalPrice > 0 && (
              <div className="text-right shrink-0 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Precio Repuesto</span>
                <span className="text-base font-black text-gray-900">{formattedMoney(item.totalPrice)}</span>
              </div>
            )}
          </div>

          {/* Labor Estimate Box */}
          {labor && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-200/60">
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                    Mano de Obra Estimada en Mendoza
                  </span>
                  <h3 className="text-base font-extrabold text-emerald-950">
                    {labor.name}
                  </h3>
                </div>
                <div className="sm:text-right">
                  <span className="text-lg sm:text-xl font-black text-emerald-700">
                    {formattedMoney(labor.minPrice)} - {formattedMoney(labor.maxPrice)}
                  </span>
                  <span className="block text-[10px] text-emerald-800 font-semibold">
                    Promedio en Mendoza: {formattedMoney(labor.averagePrice)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-emerald-900">
                <div className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tiempo estimado: {labor.estimatedHours}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Garantía de mano de obra en taller</span>
                </div>
              </div>

              {labor.includes && labor.includes.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-emerald-200/50">
                  <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                    El trabajo incluye:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-emerald-800">
                    {labor.includes.map((inc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Zone Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Elegí tu zona más cercana en Mendoza</span>
              </label>
              <span className="text-xs text-gray-500 font-medium">
                {workshops.length} talleres disponibles
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {zonesList.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZone(z.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition text-center truncate ${
                    selectedZone === z.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  {z.name}
                </button>
              ))}
            </div>
          </div>

          {/* Workshops List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
              Talleres Recomendados en Mendoza
            </h4>

            {workshops.map((w) => (
              <div
                key={w.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                      {w.zone}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{w.rating}</span>
                      <span className="text-gray-400">({w.reviewsCount} opiniones)</span>
                    </div>
                  </div>
                  <h5 className="font-extrabold text-gray-900 text-sm">
                    {w.name}
                  </h5>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{w.address}</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">
                    ✓ {w.turnosDisponibles}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleWhatsAppBooking(w)}
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 transform active:scale-95 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Agendar Turno por WhatsApp</span>
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>🛡️ Garantía de colocación en talleres asociados de DinAcitY</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
