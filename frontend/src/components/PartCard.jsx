import React from 'react';
import { ExternalLink, Star, Shield, Truck, Flame, TrendingDown, MapPin, Store, MessageCircle, HelpCircle } from 'lucide-react';

export function PartCard({ item, onCompare }) {
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

  const getSourceBadge = (sourceType) => {
    if (sourceType === 'casa_repuestos_mendoza') {
      return {
        label: 'Casa de Repuestos Mendoza (Mostrador / WhatsApp)',
        bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      };
    }
    if (sourceType === 'facebook_marketplace_mendoza') {
      return {
        label: 'Facebook Marketplace Mendoza',
        bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
      };
    }
    return {
      label: 'Mercado Libre Mendoza',
      bg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
    };
  };

  const sourceBadge = getSourceBadge(item.sourceType);

  const getActionButton = () => {
    if (item.actionType === 'whatsapp') {
      return {
        text: 'Consultar por WhatsApp',
        icon: <MessageCircle className="w-4 h-4" />,
        className: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
      };
    }
    if (item.actionType === 'facebook') {
      return {
        text: 'Ver en Marketplace',
        icon: <ExternalLink className="w-3.5 h-3.5" />,
        className: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
      };
    }
    return {
      text: 'Ver en Mercado Libre',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      className: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
    };
  };

  const actionBtn = getActionButton();

  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 border flex flex-col md:flex-row overflow-hidden ${
        isCheapest
          ? 'bg-gradient-to-r from-slate-850 via-slate-800 to-slate-850 border-emerald-500/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40'
          : 'bg-slate-850 hover:bg-slate-800/90 border-slate-750 hover:border-slate-600 shadow-md'
      }`}
    >
      {/* Top Banner for Lowest Price in Mendoza */}
      {isCheapest && (
        <div className="absolute top-0 right-0 left-0 md:left-auto bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-black uppercase tracking-wider py-1 px-4 flex items-center justify-center gap-1.5 shadow-md z-10 rounded-bl-xl">
          <Flame className="w-3.5 h-3.5 fill-white text-emerald-600 animate-bounce" />
          <span>¡EL MÁS BARATO EN MENDOZA! • Precio Verificado</span>
        </div>
      )}

      {/* Image and Rank */}
      <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-slate-900 flex items-center justify-center p-3">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 text-[11px] font-bold border border-slate-700 backdrop-blur-sm">
          #{item.rank} {hasPrice ? 'más barato' : 'opción local'}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${sourceBadge.bg}`}>
              {sourceBadge.label}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-200 border border-slate-600">
              {item.partBrand}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-slate-800 text-slate-400 border border-slate-700">
              {item.condition}
            </span>
          </div>

          {/* Title (Rigurosamente consistente y normalizado) */}
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Local Mendoza Location & Pickup */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{item.mendozaLocation?.zone || 'Gran Mendoza'}</span>
            </div>
            {item.mendozaLocation?.localPickup && (
              <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {item.mendozaLocation.localPickup}
              </span>
            )}
          </div>

          {/* Store & Seller Info */}
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.sellerName}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white">{item.sellerRating}</span>
              <span className="text-slate-500">({item.reviewsCount} opiniones)</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Garantía {item.warrantyDays} días</span>
            </div>
          </div>
        </div>

        {/* Shipping / Local Delivery info */}
        <div className="mt-3 pt-3 border-t border-slate-750 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Truck className="w-4 h-4 text-slate-400" />
            {hasPrice ? (
              item.freeShipping ? (
                <span className="font-bold text-emerald-400">Entrega/Retiro GRATIS en Mendoza</span>
              ) : (
                <span className="text-slate-300">Envío en el día en Gran Mendoza: {formattedPrice(item.shippingCost)}</span>
              )
            ) : (
              <span className="text-amber-400 font-medium">Cotización inmediata directa por WhatsApp</span>
            )}
          </div>
          {hasPrice && item.savingsVsAvgPercentage > 0 && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Ahorrás {item.savingsVsAvgPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Price and CTA Sidebar */}
      <div className="p-4 sm:p-5 md:w-56 shrink-0 bg-slate-900/60 md:border-l border-slate-750 flex flex-col justify-center items-stretch text-right md:text-center border-t md:border-t-0">
        
        {hasPrice ? (
          <>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Precio Final Verificado
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white my-1">
              {formattedPrice(item.totalPrice)}
            </div>
            {!item.freeShipping && (
              <span className="text-[11px] text-slate-400 block mb-2">
                (Precio pieza: {formattedPrice(item.price)})
              </span>
            )}
          </>
        ) : (
          <div className="my-2 text-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
              Precio en Mostrador
            </span>
            <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/25 font-black text-sm">
              Precio a consultar
            </span>
            <span className="text-[10px] text-slate-400 block mt-1.5 leading-tight">
              Sin precios inventados. Consulta por WhatsApp en Mendoza.
            </span>
          </div>
        )}

        <div className="space-y-2 mt-2">
          <a
            href={item.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 transform active:scale-95 ${actionBtn.className}`}
          >
            <span>{actionBtn.text}</span>
            {actionBtn.icon}
          </a>

          {hasPrice && (
            <button
              type="button"
              onClick={() => onCompare(item)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition border border-slate-700 flex items-center justify-center gap-1"
            >
              <span>Comparar precios</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
