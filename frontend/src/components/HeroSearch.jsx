import React, { useState, useEffect } from 'react';
import { Car, Bike, Truck, Search, Sparkles, MapPin } from 'lucide-react';

export function HeroSearch({ taxonomy, onSearch, loading }) {
  const [vehicleType, setVehicleType] = useState('auto');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [query, setQuery] = useState('Radiador');

  useEffect(() => {
    setSelectedModel('');
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
    { label: 'Amortiguadores', query: 'Amortiguadores' }
  ];

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 pt-6 pb-10 px-4 sm:px-6 border-b border-slate-800">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-orange-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs sm:text-sm font-bold mb-3 shadow-sm">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Exclusivo Mendoza • Casas de Repuestos, Facebook Marketplace y Mercado Libre</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Repuestos en Mendoza, al <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">precio más barato</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Compará en vivo en las casas de repuestos del Carril Rodríguez Peña, Godoy Cruz, Guaymallén, Capital y vendedores locales. Títulos homologados y exactos.
          </p>
        </div>

        {/* Main Search Container */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
          
          {/* Vehicle Category Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-700/60 pb-4 mb-5 overflow-x-auto">
            <button
              type="button"
              onClick={() => { setVehicleType('auto'); setSelectedBrand(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
                vehicleType === 'auto'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>🚗 Autos y Utilitarios</span>
            </button>

            <button
              type="button"
              onClick={() => { setVehicleType('moto'); setSelectedBrand(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
                vehicleType === 'moto'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>🏍️ Motos y Scooters</span>
            </button>

            <button
              type="button"
              onClick={() => { setVehicleType('camion'); setSelectedBrand(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition whitespace-nowrap ${
                vehicleType === 'camion'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>🚛 Camiones y Pesados</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Cascade Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Marca */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Marca
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-500 transition"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Modelo
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full bg-slate-900/90 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">{selectedBrand ? 'Todos los modelos' : 'Selecciona una marca'}</option>
                  {modelsList.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Año de fabricación
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-500 transition"
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

            {/* Main Part Query & Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej: Radiador de agua, Termostato, Electroventilador, Pastillas de freno..."
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/25 transition transform active:scale-98 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Comparando en Mendoza...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>BUSCAR EN MENDOZA</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Chips */}
            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-1">
                Repuestos frecuentes en Mendoza:
              </span>
              {quickParts.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleQuickChip(item.query)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-700/60 hover:bg-orange-500/20 hover:text-orange-300 text-slate-300 border border-slate-700 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
