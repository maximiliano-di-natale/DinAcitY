import React, { useState, useEffect } from 'react';
import { Car, Bike, Truck, Search, Sparkles, MapPin } from 'lucide-react';

export function HeroSearch({ taxonomy, onSearch, loading, currentSearchParams }) {
  const [vehicleType, setVehicleType] = useState(currentSearchParams?.vehicleType || 'auto');
  const [selectedBrand, setSelectedBrand] = useState(currentSearchParams?.brand || '');
  const [selectedModel, setSelectedModel] = useState(currentSearchParams?.model || '');
  const [selectedYear, setSelectedYear] = useState(currentSearchParams?.year || '');
  const [query, setQuery] = useState(currentSearchParams?.query || '');

  useEffect(() => {
    if (currentSearchParams) {
      if (currentSearchParams.query !== undefined) setQuery(currentSearchParams.query);
      if (currentSearchParams.vehicleType !== undefined) setVehicleType(currentSearchParams.vehicleType || 'auto');
      if (currentSearchParams.brand !== undefined) setSelectedBrand(currentSearchParams.brand || '');
      if (currentSearchParams.model !== undefined) setSelectedModel(currentSearchParams.model || '');
      if (currentSearchParams.year !== undefined) setSelectedYear(currentSearchParams.year || '');
    }
  }, [currentSearchParams]);

  useEffect(() => {
    // If selectedBrand changes and doesn't match current selectedModel's brand, reset model
    if (!selectedBrand) {
      setSelectedModel('');
    }
  }, [selectedBrand, vehicleType]);

  const currentTypeData = taxonomy?.types?.[vehicleType] || { brands: [] };
  const brandsList = currentTypeData.brands || [];
  const currentBrandObj = brandsList.find((b) => b.id === selectedBrand);
  const modelsList = currentBrandObj?.models || [];
  const yearsList = taxonomy?.years || [];

  const handleQuickChip = (partName) => {
    setQuery(partName);
    onSearch({
      query: partName,
      vehicleType,
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSearch({
      query,
      vehicleType,
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear
    });
  };

  const quickParts = [
    { label: 'Radiadores', query: 'Radiador de agua' },
    { label: 'Termostatos', query: 'Termostato con caja' },
    { label: 'Electroventiladores', query: 'Electroventilador' },
    { label: 'Pastillas de Freno', query: 'Pastillas de freno' },
    { label: 'Kits Distribución', query: 'Kit de distribucion' },
    { label: 'Embragues', query: 'Kit embrague' },
    { label: 'Amortiguadores', query: 'Amortiguadores' },
    { label: 'Filtros', query: 'Filtro de aceite' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Encabezado Propuesta de Valor estilo TurismoCity */}
      <div className="mb-3.5 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
              Metabuscador Oficial
            </span>
            <span className="text-[11px] font-bold text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-200">
              📍 Mendoza, Argentina
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline">
              ✓ Comparador como TurismoCity
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Compará repuestos de autos, motos y camiones como vuelos
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mt-0.5">
            Rastreamos simultáneamente en <strong>Mercado Libre Mendoza</strong>, <strong>Facebook Marketplace</strong> y las <strong>Casas de Repuestos físicas</strong> para que elijas siempre el precio más barato.
          </p>
        </div>

        {/* 3 Pasos TurismoCity */}
        <div className="hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-gray-200 rounded-xl px-3.5 py-2 text-xs shadow-xs shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
            <span>Elegí vehículo</span>
          </div>
          <span className="text-gray-300">➔</span>
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-black">2</span>
            <span>Comparamos sitios</span>
          </div>
          <span className="text-gray-300">➔</span>
          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
            <span>Pagas el más barato</span>
          </div>
        </div>
      </div>

      {/* Mercado Libre Clean White Box con Marca de Agua Interna TurismoCity */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 relative overflow-hidden">
        
        {/* Marca de agua tipográfica sutil interna (no tapa nada) */}
        <div
          aria-hidden="true"
          className="absolute right-4 -bottom-6 text-7xl sm:text-9xl font-black text-gray-900/[0.03] select-none pointer-events-none tracking-tighter uppercase hidden md:block"
        >
          DinAcitY
        </div>

        {/* Category Tabs (Rojo y Azul) */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4 overflow-x-auto relative z-10">
          <button
            type="button"
            onClick={() => { setVehicleType('auto'); setSelectedBrand(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs sm:text-sm transition whitespace-nowrap ${
              vehicleType === 'auto'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>🚗 Autos y Utilitarios</span>
          </button>

          <button
            type="button"
            onClick={() => { setVehicleType('moto'); setSelectedBrand(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs sm:text-sm transition whitespace-nowrap ${
              vehicleType === 'moto'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>🏍️ Motos y Scooters</span>
          </button>

          <button
            type="button"
            onClick={() => { setVehicleType('camion'); setSelectedBrand(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs sm:text-sm transition whitespace-nowrap ${
              vehicleType === 'camion'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>🚛 Camiones y Pesados</span>
          </button>

          <div className="ml-auto hidden md:flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Casas de Repuestos de Mendoza + Mercado Libre</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Cascade Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Marca */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Marca del Vehículo
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              >
                <option value="">Todas las marcas</option>
                {brandsList.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Modelo
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition disabled:opacity-40 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">{selectedBrand ? 'Todos los modelos' : 'Selecciona una marca primero'}</option>
                {modelsList.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Año de fabricación
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              >
                <option value="">Cualquier año</option>
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Repuesto text input & Submit */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre específico de la pieza (opcional, ej: radiador, pastillas, kit embrague, filtros)..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 text-gray-800 placeholder-gray-400 text-sm rounded-md focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-sm transition flex items-center justify-center gap-2 whitespace-nowrap active:scale-98"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Buscando en Mendoza...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Buscar Repuestos</span>
                </>
              )}
            </button>
          </div>

          {/* Popular Parts Chips (Estilo Mercado Libre tags) */}
          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-gray-500 font-bold mr-1">
              Populares en Mendoza:
            </span>
            {quickParts.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickChip(item.query)}
                className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 border border-gray-200 transition"
              >
                {item.label}
              </button>
            ))}
          </div>

        </form>

        {/* Ticker de Proveedores Comparados en Tiempo Real estilo TurismoCity */}
        <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-700">Comparamos en tiempo real:</span>
            <span className="bg-yellow-50 text-yellow-900 border border-yellow-200 px-2 py-0.5 rounded font-semibold">
              📦 Mercado Libre Mendoza
            </span>
            <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-semibold">
              💬 Facebook Marketplace MZA
            </span>
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              🏢 Casas Carril Rodríguez Peña
            </span>
            <span className="bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded font-semibold">
              📍 Godoy Cruz, Guaymallén y Maipú
            </span>
          </div>
          <span className="font-bold text-emerald-700 flex items-center gap-1">
            🛡️ Ahorro promedio garantizado de hasta 35%
          </span>
        </div>

      </div>
    </div>
  );
}
