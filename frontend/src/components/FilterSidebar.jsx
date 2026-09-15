import React from 'react';
import { Filter, RotateCcw, Truck, Check, X } from 'lucide-react';

export function FilterSidebar({
  filters,
  onChangeFilter,
  onResetFilters,
  filtersMeta,
  isOpenMobile,
  onCloseMobile
}) {
  const content = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-750">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Filter className="w-4 h-4 text-orange-400" />
          <span>Filtros de Búsqueda</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-400 transition"
          title="Restablecer todos los filtros"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar</span>
        </button>
      </div>

      {/* Ordenar Por */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Ordenar por
        </label>
        <select
          value={filters.sortBy || 'price_asc'}
          onChange={(e) => onChangeFilter('sortBy', e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500 transition"
        >
          <option value="price_asc">🔥 Menor precio (Más barato primero)</option>
          <option value="price_desc">Mayor precio</option>
          <option value="rating">⭐ Mejor calificación del vendedor</option>
        </select>
      </div>

      {/* Envío Gratis */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-750">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.freeShippingOnly)}
            onChange={(e) => onChangeFilter('freeShippingOnly', e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-800"
          />
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Solo con Envío Gratis</span>
          </div>
        </label>
      </div>

      {/* Condición de la pieza */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Estado del Repuesto
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'nuevo', label: 'Nuevo' },
            { id: 'reacondicionado', label: 'Reacond.' }
          ].map((cond) => (
            <button
              key={cond.id}
              type="button"
              onClick={() => onChangeFilter('condition', cond.id)}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition ${
                (filters.condition || 'todos') === cond.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tiendas / Plataformas */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Tienda o Marketplace
        </label>
        <select
          value={filters.store || 'todos'}
          onChange={(e) => onChangeFilter('store', e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500 transition"
        >
          <option value="todos">Todas las tiendas agregadas</option>
          {filtersMeta?.stores?.map((st) => (
            <option key={st.key} value={st.key}>
              {st.name}
            </option>
          ))}
        </select>
      </div>

      {/* Marca del Repuesto */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Marca del Repuesto
        </label>
        <select
          value={filters.partBrand || 'todos'}
          onChange={(e) => onChangeFilter('partBrand', e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500 transition"
        >
          <option value="todos">Todas las marcas de piezas</option>
          {filtersMeta?.brands?.map((br) => (
            <option key={br} value={br}>
              {br}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de Precio */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Rango de Precio ($ ARS)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice || ''}
            onChange={(e) => onChangeFilter('minPrice', e.target.value)}
            className="w-1/2 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          />
          <span className="text-slate-500">-</span>
          <input
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice || ''}
            onChange={(e) => onChangeFilter('maxPrice', e.target.value)}
            className="w-1/2 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-slate-850 border border-slate-750 rounded-2xl p-5 h-fit sticky top-24 shadow-lg">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-slate-850 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-slate-700">
            <div>
              <div className="flex justify-end mb-2">
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
            <button
              onClick={onCloseMobile}
              className="mt-6 w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </>
  );
}
