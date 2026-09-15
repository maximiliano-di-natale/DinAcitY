import React from 'react';
import { X, ExternalLink, Flame, Check, Truck, Star } from 'lucide-react';

export function PriceComparisonModal({ item, allResults, onClose }) {
  if (!item) return null;

  const formattedPrice = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Encontrar otras alternativas para este tipo de pieza
  const alternatives = allResults || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-750">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Comparativa Multi-Tienda DinAcitY
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              Todas las opciones de compra para: {item.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ordenadas del precio total más bajo al más alto
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison List */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          {alternatives.map((alt, idx) => {
            const isTop = idx === 0;

            return (
              <div
                key={alt.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  isTop
                    ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isTop ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {alt.storeName}
                      </span>
                      {isTop && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white">
                          🔥 Más Barato
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>Marca: {alt.partBrand}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        {alt.sellerRating}
                      </span>
                      <span>•</span>
                      {alt.freeShipping ? (
                        <span className="text-emerald-400 font-semibold">Envío Gratis</span>
                      ) : (
                        <span>Envío {formattedPrice(alt.shippingCost)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Link */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total con envío:</span>
                    <span className="text-lg font-black text-white">
                      {formattedPrice(alt.totalPrice)}
                    </span>
                  </div>

                  <a
                    href={alt.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                      isTop
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <span>Ir a tienda</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-750 flex items-center justify-between text-xs text-slate-400">
          <span>* Los precios y stock son actualizados automáticamente.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
