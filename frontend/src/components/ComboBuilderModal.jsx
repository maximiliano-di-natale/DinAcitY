import React, { useState, useEffect } from 'react';
import { X, Package, Check, MessageCircle, ExternalLink, ShieldCheck, Car, ChevronRight, Sparkles, Layers } from 'lucide-react';

export function ComboBuilderModal({ isOpen, onClose, vehicleParams }) {
  const [kits, setKits] = useState([]);
  const [selectedKitId, setSelectedKitId] = useState('kit-service');
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  const brand = vehicleParams?.brand || 'Volkswagen';
  const model = vehicleParams?.model || 'Gol Trend';
  const year = vehicleParams?.year || '2019';
  const vehicleType = vehicleParams?.vehicleType || 'auto';

  useEffect(() => {
    if (isOpen) {
      fetchKits();
    }
  }, [isOpen, brand, model, year, vehicleType]);

  const fetchKits = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/combos?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}&vehicleType=${encodeURIComponent(vehicleType)}`);
      const data = await res.json();
      setKits(data.kits || []);
      if (data.kits && data.kits.length > 0) {
        setSelectedKitId(data.kits[0].id);
        // Inicializar todos los items como seleccionados
        const initialSelected = {};
        data.kits.forEach(k => {
          initialSelected[k.id] = k.items.map(i => i.id);
        });
        setSelectedItems(initialSelected);
      }
    } catch (err) {
      console.error('Error cargando paquetes dinámicos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentKit = kits.find(k => k.id === selectedKitId) || kits[0];
  const activeItemIds = selectedItems[selectedKitId] || (currentKit?.items.map(i => i.id) || []);
  const activeItems = currentKit?.items.filter(i => activeItemIds.includes(i.id)) || [];

  const calculatedTotal = activeItems.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

  const toggleItem = (itemId) => {
    const current = selectedItems[selectedKitId] || [];
    let updated;
    if (current.includes(itemId)) {
      if (current.length === 1) return; // Mantener al menos uno
      updated = current.filter(id => id !== itemId);
    } else {
      updated = [...current, itemId];
    }
    setSelectedItems({
      ...selectedItems,
      [selectedKitId]: updated
    });
  };

  const formattedMoney = (val) => {
    if (!val) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleWhatsAppConsult = () => {
    if (!currentKit || activeItems.length === 0) return;
    const itemsList = activeItems.map((it, idx) => `${idx + 1}. ${it.title} ($${it.estimatedPrice.toLocaleString('es-AR')})`).join('\n');
    const msg = encodeURIComponent(
      `Hola, vi en DinAcitY Mendoza el "${currentKit.name}" para mi ${brand} ${model} (${year}):\n\n${itemsList}\n\nTotal estimado conjunto: $${calculatedTotal.toLocaleString('es-AR')}.\n¿Tienen disponibilidad de estos repuestos juntos en mostrador y cuál es el presupuesto actual? Muchas gracias.`
    );
    window.open(`https://wa.me/5492615891234?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-red-700 shadow-xs">
                  Paquetes Dinámicos & Kits
                </span>
                <span className="text-[11px] font-bold text-red-100 flex items-center gap-1">
                  🚗 {brand} {model} ({year})
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                Armá tu Kit de Repuestos y Cotizá Todo Junto
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

        {/* Informative Sub-header (Aclaración de transparencia) */}
        <div className="bg-blue-50/80 border-b border-blue-200/70 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>Metabuscador Transparente:</strong> DinAcitY no vende directamente; agrupamos los repuestos para que cotices el kit completo en un solo paso con casas de repuestos de Mendoza o Mercado Libre.
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 max-h-[72vh] overflow-y-auto">
          
          {/* Columna Izquierda: Selector de Kits Preconfigurados */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block mb-1">
              Kits Disponibles para tu Auto:
            </span>

            {kits.map((kit) => (
              <button
                key={kit.id}
                type="button"
                onClick={() => setSelectedKitId(kit.id)}
                className={`w-full p-3 rounded-xl text-left transition border flex flex-col justify-between ${
                  selectedKitId === kit.id
                    ? 'bg-red-50/80 border-red-500 shadow-sm ring-1 ring-red-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-gray-200 text-gray-700">
                      {kit.badge}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold">
                      {kit.items.length} piezas
                    </span>
                  </div>
                  <h4 className={`font-bold text-xs sm:text-sm leading-snug ${selectedKitId === kit.id ? 'text-red-700' : 'text-gray-900'}`}>
                    {kit.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {kit.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Estimado:</span>
                  <span className="font-black text-gray-900">{formattedMoney(kit.totalEstimatedPrice)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Columna Derecha: Detalle del Kit y Personalización */}
          <div className="md:col-span-8 space-y-4">
            {currentKit && (
              <>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-900">
                        {currentKit.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {currentKit.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Estimado del Kit</span>
                      <span className="text-xl sm:text-2xl font-black text-gray-900">{formattedMoney(calculatedTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs font-bold text-gray-700 block mb-2">
                      Personalizá tu kit (seleccioná o desmarcá repuestos):
                    </span>

                    <div className="space-y-2">
                      {currentKit.items.map((item) => {
                        const isChecked = activeItemIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 ${
                              isChecked
                                ? 'bg-white border-blue-400 shadow-xs'
                                : 'bg-gray-100/80 border-gray-300 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                                isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-400 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <div>
                                <h5 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight">
                                  {item.title}
                                </h5>
                                <span className="text-[11px] text-gray-500">
                                  Marca habitual: <strong>{item.brand}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-black text-sm text-gray-800">
                                {formattedMoney(item.estimatedPrice)}
                              </span>
                              <a
                                href={item.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="block text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 justify-end mt-0.5"
                              >
                                <span>Ver en ML</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Acciones del Kit */}
                <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider block">
                      Cotización Conjunta en Mendoza
                    </span>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Enviá la lista completa de {activeItems.length} repuestos para consultar disponibilidad en mostrador y precio final.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsAppConsult}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 transform active:scale-95 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>Cotizar Kit por WhatsApp</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>📦 DinAcitY agrupa los repuestos de tu vehículo para que ahorres tiempo al cotizar</span>
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
