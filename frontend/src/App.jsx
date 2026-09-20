import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HeroSearch } from './components/HeroSearch.jsx';
import { PartCard } from './components/PartCard.jsx';
import { FilterSidebar } from './components/FilterSidebar.jsx';
import { PriceComparisonModal } from './components/PriceComparisonModal.jsx';
import { PriceAlertModal } from './components/PriceAlertModal.jsx';
import { Flame, SlidersHorizontal, Sparkles, AlertCircle, MapPin, Store } from 'lucide-react';

export function App() {
  const [taxonomy, setTaxonomy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    results: [],
    stats: {},
    filtersMeta: {},
    query: {}
  });

  const [currentSearchParams, setCurrentSearchParams] = useState({
    query: 'Radiador de agua',
    vehicleType: 'auto',
    brand: 'volkswagen',
    model: 'Gol Trend',
    year: '2018'
  });

  const [filters, setFilters] = useState({
    sortBy: 'price_asc',
    condition: 'todos',
    freeShippingOnly: false,
    store: 'todos',
    partBrand: 'todos',
    mendozaZone: 'todos',
    sourceType: 'todos',
    minPrice: '',
    maxPrice: ''
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [comparingItem, setComparingItem] = useState(null);

  useEffect(() => {
    fetch('/api/vehicles/taxonomy')
      .then((res) => res.json())
      .then((data) => setTaxonomy(data))
      .catch((err) => console.error('Error cargando taxonomía:', err));

    executeSearch(currentSearchParams, filters);
  }, []);

  const executeSearch = async (searchParams, currentFilters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        query: searchParams.query || 'Radiador',
        vehicleType: searchParams.vehicleType || 'auto',
        brand: searchParams.brand || '',
        model: searchParams.model || '',
        year: searchParams.year || '',
        sortBy: currentFilters?.sortBy || 'price_asc',
        condition: currentFilters?.condition || 'todos',
        freeShippingOnly: currentFilters?.freeShippingOnly ? 'true' : 'false',
        store: currentFilters?.store || 'todos',
        partBrand: currentFilters?.partBrand || 'todos',
        mendozaZone: currentFilters?.mendozaZone || 'todos',
        sourceType: currentFilters?.sourceType || 'todos',
        minPrice: currentFilters?.minPrice || '',
        maxPrice: currentFilters?.maxPrice || ''
      });

      const response = await fetch(`/api/parts/search?${queryParams.toString()}`);
      const data = await response.json();
      setSearchData(data);
    } catch (error) {
      console.error('Error buscando repuestos en Mendoza:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFromHero = (newSearchParams) => {
    setCurrentSearchParams(newSearchParams);
    executeSearch(newSearchParams, filters);
  };

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    executeSearch(currentSearchParams, updatedFilters);
  };

  const handleResetFilters = () => {
    const reset = {
      sortBy: 'price_asc',
      condition: 'todos',
      freeShippingOnly: false,
      store: 'todos',
      partBrand: 'todos',
      mendozaZone: 'todos',
      sourceType: 'todos',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(reset);
    executeSearch(currentSearchParams, reset);
  };

  const formattedMoney = (val) => {
    if (!val) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const mendozaSources = searchData.stats?.mendozaSources || {};

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <Navbar onOpenAlerts={() => setIsAlertsOpen(true)} />

      {/* Hero Search Box con foco en Mendoza */}
      <HeroSearch
        taxonomy={taxonomy}
        onSearch={handleSearchFromHero}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Results Overview Bar */}
        <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 sm:p-5 mb-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                Ofertas en Mendoza para <span className="text-orange-400">"{currentSearchParams.query}"</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                {searchData.stats?.totalResults || 0} encontrados
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                ✓ Ordenados del más barato al más caro
              </span>
              <span>•</span>
              <span className="text-slate-300">
                🏢 {mendozaSources.casasRepuestosMendoza || 0} en Casas de Repuestos
              </span>
              <span>•</span>
              <span className="text-slate-300">
                💬 {mendozaSources.facebookMarketplaceMendoza || 0} en Marketplace MZA
              </span>
              <span>•</span>
              <span className="text-slate-300">
                📦 {mendozaSources.mercadoLibreMendoza || 0} en Mercado Libre MZA
              </span>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {searchData.stats?.minPrice > 0 && (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <div>
                  <span className="block text-[10px] text-emerald-400 uppercase font-black">Más Barato en MZA</span>
                  <span className="text-sm font-black text-white">{formattedMoney(searchData.stats.minPrice)}</span>
                </div>
              </div>
            )}

            {searchData.stats?.maxSavingsPossible > 0 && (
              <div className="px-3.5 py-2 rounded-xl bg-orange-950/30 border border-orange-500/30 text-orange-300 text-xs font-semibold hidden sm:flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <div>
                  <span className="block text-[10px] text-orange-400 uppercase font-black">Ahorro Máximo</span>
                  <span className="text-sm font-black text-white">Hasta {formattedMoney(searchData.stats.maxSavingsPossible)}</span>
                </div>
              </div>
            )}

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-orange-400" />
              <span>Filtros MZA</span>
            </button>
          </div>

        </div>

        {/* Layout with Sidebar and Cards */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onChangeFilter={handleFilterChange}
            onResetFilters={handleResetFilters}
            filtersMeta={searchData.filtersMeta}
            isOpenMobile={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Cards List */}
          <div className="flex-1 w-full space-y-4">
            
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-300 font-bold text-base">
                  Rastreando en casas de repuestos de Mendoza, Marketplace y Mercado Libre...
                </p>
                <p className="text-xs text-slate-500">
                  Normalizando títulos y clasificando del más barato al más caro
                </p>
              </div>
            ) : searchData.results?.length === 0 ? (
              <div className="bg-slate-850 border border-slate-750 rounded-2xl p-10 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-orange-400 mx-auto" />
                <h3 className="text-lg font-black text-white">
                  No se encontraron ofertas en Mendoza con estos filtros
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Prueba modificando la zona de Mendoza, el rango de precios o eliminando filtros para ver más opciones disponibles.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              searchData.results?.map((item) => (
                <PartCard
                  key={item.id}
                  item={item}
                  onCompare={(it) => setComparingItem(it)}
                />
              ))
            )}

          </div>

        </div>

      </main>

      {/* Comparison Modal */}
      <PriceComparisonModal
        item={comparingItem}
        allResults={searchData.results}
        onClose={() => setComparingItem(null)}
      />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        currentSearch={currentSearchParams}
      />

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-800/80 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl font-black text-white">
                Din<span className="text-orange-500">AcitY</span>
              </span>
              <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-bold">
                Edición Mendoza, Argentina
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Comparador de precios de repuestos para autos, motos y camiones en Mendoza. Casas de repuestos, Facebook Marketplace y Mercado Libre.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
            <span>📍 Carril Rodríguez Peña</span>
            <span>📍 Godoy Cruz</span>
            <span>📍 Guaymallén</span>
            <span>📍 Maipú</span>
            <span>📍 Capital</span>
            <span>📍 San Martín</span>
            <span>📍 San Rafael</span>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 DinAcitY Mendoza. Desarrollado para Maximiliano Di Natale.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
