import React from 'react';
import { Filter, RotateCcw, Truck, MapPin, Store, X, Car } from 'lucide-react';

export function FilterSidebar({
  filters,
  onChangeFilter,
  onResetFilters,
  filtersMeta,
  isOpenMobile,
  onCloseMobile
}) {
  const content = (
    <div className="space-y-5 text-gray-800">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm sm:text-base">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Filtros en Mendoza</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
          title="Restablecer todos los filtros"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar</span>
        </button>
      </div>

      {/* Ordenar Por */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Ordenar por
        </label>
        <select
          value={filters.sortBy || 'price_asc'}
          onChange={(e) => onChangeFilter('sortBy', e.target.value)}
          className="w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-md px-2.5 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        >
          <option value="price_asc">🔥 Menor precio (Más barato primero)</option>
          <option value="price_desc">Mayor precio</option>
          <option value="rating">⭐ Mejor calificación del vendedor</option>
        </select>
      </div>

      {/* Original vs Alternativo (Estilo Vuelos: Directo vs Escalas) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Calidad del Repuesto</span>
          <span className="text-[10px] text-blue-600 font-semibold lowercase">oem vs alternativo</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: 'todos', label: 'Todos los repuestos' },
            { id: 'original', label: '💎 Original / OEM (Fábrica)' },
            { id: 'alternativo', label: '⚡ Alternativo Homologado' }
          ].map((qual) => (
            <button
              key={qual.id}
              type="button"
              onClick={() => onChangeFilter('partQuality', qual.id)}
              className={`py-1.5 px-3 rounded-md text-xs font-bold text-left transition flex items-center justify-between ${
                (filters.partQuality || 'todos') === qual.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{qual.label}</span>
              {(filters.partQuality || 'todos') === qual.id && (
                <span className="text-[10px] bg-white text-red-600 px-1 rounded-full font-black">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fuente en Mendoza */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Origen / Tipo de Fuente
        </label>
        <select
          value={filters.sourceType || 'todos'}
          onChange={(e) => onChangeFilter('sourceType', e.target.value)}
          className="w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-md px-2.5 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        >
          <option value="todos">Todas las fuentes en Mendoza</option>
          <option value="casa_repuestos_mendoza">Casas de Repuestos (WhatsApp Mendoza)</option>
          <option value="facebook_marketplace_mendoza">Facebook Marketplace Mendoza</option>
          <option value="mercadolibre_mendoza">Mercado Libre Mendoza</option>
        </select>
      </div>

      {/* Marca de Vehículo (Auto, Camioneta, Camión) */}
      {filtersMeta?.vehicleBrands && filtersMeta.vehicleBrands.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-blue-600" />
            <span>Vehículo / Marca de Auto</span>
          </label>
          <select
            value={filters.vehicleBrand || 'todos'}
            onChange={(e) => onChangeFilter('vehicleBrand', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-md px-2.5 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition font-medium"
          >
            <option value="todos">Todos los vehículos ({filtersMeta.vehicleBrands.length} marcas)</option>
            {filtersMeta.vehicleBrands.map((vb) => (
              <option key={vb} value={vb}>
                {vb}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Zona o Departamento de Mendoza */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          <span>Zona / Departamento Mendoza</span>
        </label>
        <select
          value={filters.mendozaZone || 'todos'}
          onChange={(e) => onChangeFilter('mendozaZone', e.target.value)}
          className="w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-md px-2.5 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        >
          <option value="todos">Todo Gran Mendoza y Departamentos</option>
          {filtersMeta?.mendozaZones?.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Casa de Repuestos / Vendedor */}
      {filtersMeta?.stores && filtersMeta.stores.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Casa de Repuestos / Vendedor</span>
          </label>
          <select
            value={filters.store || 'todos'}
            onChange={(e) => onChangeFilter('store', e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-md px-2.5 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          >
            <option value="todos">Todos los comercios en Mendoza</option>
            {filtersMeta.stores.map((st) => (
              <option key={st.key} value={st.key}>
                {st.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Retiro Gratis / Envío Gratis */}
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.freeShippingOnly)}
            onChange={(e) => onChangeFilter('freeShippingOnly', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Retiro gratis en local / Envío gratis</span>
          </div>
        </label>
      </div>

      {/* Condición de la pieza */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Estado del Repuesto
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'nuevo', label: 'Nuevo' },
            { id: 'reacondicionado', label: 'Reacond.' }
          ].map((cond) => (
            <button
              key={cond.id}
              type="button"
              onClick={() => onChangeFilter('condition', cond.id)}
              className={`py-1.5 px-2 rounded-md text-xs font-bold transition ${
                (filters.condition || 'todos') === cond.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marca del Repuesto */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Marca de Fabricante
        </label>
        <select
          value={filters.partBrand || 'todos'}
          onChange={(e) => onChangeFilter('partBrand', e.target.value)}
          className="w-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-md px-2.5 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        >
          <option value="todos">Todas las marcas</option>
          {filtersMeta?.brands?.map((br) => (
            <option key={br} value={br}>
              {br}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de Precio */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Rango de Precio ($ ARS)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice || ''}
            onChange={(e) => onChangeFilter('minPrice', e.target.value)}
            className="w-1/2 bg-white border border-gray-300 text-gray-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-red-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice || ''}
            onChange={(e) => onChangeFilter('maxPrice', e.target.value)}
            className="w-1/2 bg-white border border-gray-300 text-gray-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white border border-gray-200 rounded-lg p-4 sm:p-5 h-fit sticky top-28 shadow-sm">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-xl flex flex-col justify-between border-l border-gray-200">
            <div>
              <div className="flex justify-end mb-2">
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-md bg-gray-100 text-gray-600 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
            <button
              onClick={onCloseMobile}
              className="mt-6 w-full py-2.5 bg-red-600 text-white font-bold rounded-md shadow-sm"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </>
  );
}
