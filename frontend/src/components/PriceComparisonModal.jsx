import React from 'react';
import { X, ExternalLink, Star } from 'lucide-react';

export function PriceComparisonModal({ item, allResults, onClose }) {
  if (!item) return null;

  const formattedPrice = (val) => {
    if (!val || val <= 0) return 'A consultar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const alternatives = allResults || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Dialog (Mercado Libre Clean White) */}
      <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-lg shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col z-10 text-gray-800">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Comparativa Multi-Tienda DinAcitY Mendoza
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
              Todas las opciones para: {item.title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ordenadas del precio total más bajo al más alto
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:text-black hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison List */}
        <div className="overflow-y-auto py-4 space-y-2.5 flex-1 pr-1">
          {alternatives.map((alt, idx) => {
            const isTop = idx === 0 && alt.hasPublicPrice;

            return (
              <div
                key={alt.id}
                className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  isTop
                    ? 'bg-red-50/50 border-red-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    isTop ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {alt.storeName}
                      </span>
                      {isTop && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white">
                          🔥 Más Barato
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>Marca: {alt.partBrand}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        {alt.sellerRating}
                      </span>
                      <span>•</span>
                      <span>{alt.mendozaLocation?.zone}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Link */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-gray-400 block">Total estimado:</span>
                    <span className="text-base font-extrabold text-gray-900">
                      {formattedPrice(alt.totalPrice)}
                    </span>
                  </div>

                  <a
                    href={alt.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-1.5 px-3 rounded-md font-bold text-xs flex items-center gap-1 transition ${
                      alt.actionType === 'whatsapp'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : isTop
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>{alt.actionType === 'whatsapp' ? 'WhatsApp' : 'Ver Oferta'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>* Precios actualizados en tiempo real en Mendoza.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-semibold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
