import React, { useState } from 'react';
import { ExternalLink, Star, Shield, Truck, Flame, TrendingDown, MapPin, Store, MessageCircle, Wrench, CreditCard, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function PartCard({ item, onCompare, onInstall, onOpenFinancing, onSearchRelated }) {
  const [showCrossSell, setShowCrossSell] = useState(false);

  const formattedPrice = (val) => {
    if (!val || val <= 0) return 'A consultar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isCheapest = item.isCheapest;
  const hasPrice = item.hasPublicPrice && item.totalPrice > 0;

  // Cálculo estimativo de cuotas de referencia (6 cuotas coeficiente 1.28)
  const approxCuota6 = hasPrice ? Math.round((item.totalPrice * 1.28) / 6) : 0;

  const getSourceBadge = (sourceType) => {
    if (sourceType === 'casa_repuestos_mendoza') {
      return {
        label: 'Casa de Repuestos Mendoza (Mostrador / WhatsApp)',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    if (sourceType === 'facebook_marketplace_mendoza') {
      return {
        label: 'Facebook Marketplace Mendoza',
        bg: 'bg-blue-50 text-blue-800 border-blue-300'
      };
    }
    return {
      label: 'Mercado Libre Mendoza',
      bg: 'bg-yellow-50 text-yellow-900 border-yellow-300'
    };
  };

  const sourceBadge = getSourceBadge(item.sourceType);

  const getActionButton = () => {
    if (item.actionType === 'whatsapp') {
      return {
        text: 'Consultar por WhatsApp',
        icon: <MessageCircle className="w-4 h-4" />,
        className: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
      };
    }
    if (item.actionType === 'facebook') {
      return {
        text: 'Ver en Marketplace',
        icon: <ExternalLink className="w-3.5 h-3.5" />,
        className: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
      };
    }
    return {
      text: 'Ver en Mercado Libre',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      className: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
    };
  };

  const actionBtn = getActionButton();

  // Sugerencias de venta cruzada según el título o categoría
  const getComplementarySuggestions = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('pastilla') || t.includes('freno')) {
      return [
        { name: 'Discos de Freno Delanteros', reason: 'Recomendado cambiar juntos para evitar vibraciones al frenar' },
        { name: 'Líquido de Freno DOT 4', reason: 'Se purga el circuito al abrir el cáliper' }
      ];
    }
    if (t.includes('radiador') || t.includes('calefaccion') || t.includes('refrigeracion') || t.includes('termostato')) {
      return [
        { name: 'Termostato con Caja', reason: 'Evita que el radiador trabaje fuera de temperatura' },
        { name: 'Mangueras de Agua', reason: 'Las viejas suelen rajarse con la nueva presión' }
      ];
    }
    if (t.includes('amortiguador') || t.includes('suspension')) {
      return [
        { name: 'Cazoletas con Crapodinas', reason: 'Si están duras desgastan prematuramente el vástago' },
        { name: 'Fuelles y Topes de Rebote', reason: 'Protegen el amortiguador del ripio mendocino' }
      ];
    }
    if (t.includes('distribucion') || t.includes('correa') || t.includes('bomba')) {
      return [
        { name: 'Bomba de Agua con Junta', reason: 'Falla habitual si se tensa la correa nueva con la bomba vieja' },
        { name: 'Correa Poli-V de Accesorios', reason: 'Se desmonta al mismo tiempo; conviene renovarla' }
      ];
    }
    return [
      { name: 'Filtro de Aceite y Aire', reason: 'Mantenimiento preventivo habitual' },
      { name: 'Bujías de Encendido', reason: 'Optimizan consumo y arranque en frío' }
    ];
  };

  const suggestions = getComplementarySuggestions(item.title);

  return (
    <div
      className={`relative bg-white rounded-lg transition-all duration-200 border flex flex-col md:flex-row overflow-hidden ml-card-shadow ${
        isCheapest
          ? 'border-red-500 ring-2 ring-red-500/20 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Top Banner for Lowest Price in Mendoza (Rojo) */}
      {isCheapest && (
        <div className="absolute top-0 right-0 left-0 md:left-auto bg-gradient-to-r from-red-600 to-red-700 text-white text-[11px] font-black uppercase tracking-wider py-1 px-4 flex items-center justify-center gap-1.5 shadow-sm z-10 rounded-bl-md">
          <Flame className="w-3.5 h-3.5 fill-white text-red-600 animate-bounce" />
          <span>¡MÁS BARATO EN MENDOZA! • Precio Verificado</span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-white flex items-center justify-center p-3 border-b md:border-b-0 md:border-r border-gray-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-contain rounded"
          loading="lazy"
        />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-gray-900/80 text-white text-[10px] font-bold">
          #{item.rank} {hasPrice ? 'más barato' : 'opción local'}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${sourceBadge.bg}`}>
              {sourceBadge.label}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              {item.partBrand}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-50 text-gray-500 border border-gray-200">
              {item.condition}
            </span>
            {item.partQuality === 'original' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
                💎 ORIGINAL OEM
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                ⚡ ALTERNATIVO
              </span>
            )}
            {item.vehicleCompatibility && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                🚗 {item.vehicleCompatibility}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-700 transition leading-snug cursor-pointer">
            {item.title}
          </h3>

          {/* Mendoza Location & Pickup */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{item.mendozaLocation?.zone || 'Gran Mendoza'}</span>
            </div>
            {item.mendozaLocation?.localPickup && (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {item.mendozaLocation.localPickup}
              </span>
            )}
          </div>

          {/* Store & Seller Info */}
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              <Store className="w-3.5 h-3.5 text-gray-500" />
              <span>{item.sellerName}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{item.sellerRating}</span>
              <span className="text-gray-400">({item.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              <span>Garantía {item.warrantyDays} días</span>
            </div>
          </div>

          {/* Cross-Selling Suggestions Dropdown/Accordion */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowCrossSell(!showCrossSell)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>¿Qué repuestos se cambian habitualmente juntos con este?</span>
              {showCrossSell ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showCrossSell && (
              <div className="mt-2 p-3 bg-blue-50/60 border border-blue-200/80 rounded-lg space-y-2">
                <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider block">
                  Recomendaciones para este trabajo:
                </span>
                <div className="space-y-1.5">
                  {suggestions.map((sug, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs bg-white p-2 rounded border border-blue-100">
                      <div>
                        <strong className="text-gray-900">{sug.name}</strong>
                        <p className="text-[11px] text-gray-500">{sug.reason}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSearchRelated && onSearchRelated(sug.name)}
                        className="text-[11px] text-blue-700 hover:underline font-bold shrink-0 self-start sm:self-auto"
                      >
                        Comparar opciones →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shipping / Local Delivery info */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <Truck className="w-4 h-4 text-emerald-600" />
            {hasPrice ? (
              item.freeShipping ? (
                <span className="font-bold text-emerald-600">Llega gratis a Mendoza</span>
              ) : (
                <span className="text-gray-600 font-medium">Envío en el día en Gran Mendoza: {formattedPrice(item.shippingCost)}</span>
              )
            ) : (
              <span className="text-amber-700 font-semibold">Cotización inmediata directa por WhatsApp</span>
            )}
          </div>
          {hasPrice && item.savingsVsAvgPercentage > 0 && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Ahorrás {item.savingsVsAvgPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Price and CTA Sidebar */}
      <div className="p-4 sm:p-5 md:w-60 shrink-0 bg-gray-50/70 md:border-l border-gray-200 flex flex-col justify-center items-stretch text-right md:text-center border-t md:border-t-0">
        
        {hasPrice ? (
          <>
            <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block">
              Precio Verificado
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 my-0.5">
              {formattedPrice(item.totalPrice)}
            </div>
            
            {/* Installments Highlight */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-md py-1 px-2 my-1 text-center">
              <span className="text-xs font-bold text-emerald-800 block">
                Hasta 6 cuotas de {formattedPrice(approxCuota6)}
              </span>
            </div>
          </>
        ) : (
          <div className="my-1 text-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block mb-1">
              Precio en Mostrador
            </span>
            <span className="inline-block px-3 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
              Precio a consultar
            </span>
            <span className="text-[10px] text-gray-500 block mt-1 leading-tight">
              Sin precios inventados. Consulta por WhatsApp en Mendoza.
            </span>
          </div>
        )}

        <div className="space-y-1.5 mt-2">
          {/* Main Action CTA */}
          <a
            href={item.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2 px-3 rounded-md font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 transform active:scale-95 ${actionBtn.className}`}
          >
            <span>{actionBtn.text}</span>
            {actionBtn.icon}
          </a>

          {/* Botón Financiación / Cuotas y 2 Tarjetas */}
          {hasPrice && (
            <button
              type="button"
              onClick={() => onOpenFinancing && onOpenFinancing(item)}
              className="w-full py-1.5 px-3 rounded-md bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs transition border border-gray-300 flex items-center justify-center gap-1.5"
              title="Calcular cuotas y simular pago con 2 tarjetas"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Cuotas / 2 Tarjetas</span>
            </button>
          )}

          {hasPrice && (
            <button
              type="button"
              onClick={() => onCompare(item)}
              className="w-full py-1.5 px-3 rounded-md bg-white hover:bg-gray-100 text-blue-700 font-semibold text-xs transition border border-gray-300 flex items-center justify-center gap-1"
            >
              <span>Comparar precios</span>
            </button>
          )}

          {/* Cross-selling Colocación en Taller Asociado Mendoza */}
          <button
            type="button"
            onClick={() => onInstall && onInstall(item)}
            className="w-full py-1.5 px-3 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-300 flex items-center justify-center gap-1.5"
            title="Agendar turno de colocación en taller asociado de Mendoza"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            <span>🔧 Colocación en Taller</span>
          </button>
        </div>
      </div>

    </div>
  );
}
