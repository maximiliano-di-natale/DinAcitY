import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HeroSearch } from './components/HeroSearch.jsx';
import { PartCard } from './components/PartCard.jsx';
import { FilterSidebar } from './components/FilterSidebar.jsx';
import { PriceComparisonModal } from './components/PriceComparisonModal.jsx';
import { PriceAlertModal } from './components/PriceAlertModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
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

  // Estado de Autenticación de Usuario Seguro
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dinacity_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('dinacity_token') || null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register');

  const [currentSearchParams, setCurrentSearchParams] = useState({
    query: 'Toyota Hilux',
    vehicleType: 'auto',
    brand: 'toyota',
    model: 'Hilux',
    year: '2022'
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

  // Verificar sesión persistida si existe token
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setCurrentUser(data.user);
            localStorage.setItem('dinacity_user', JSON.stringify(data.user));
          } else {
            handleLogout();
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const handleAuthSuccess = (user, authToken) => {
    setCurrentUser(user);
    setToken(authToken);
    localStorage.setItem('dinacity_user', JSON.stringify(user));
    localStorage.setItem('dinacity_token', authToken);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('dinacity_user');
    localStorage.removeItem('dinacity_token');
  };

  const executeSearch = async (searchParams, currentFilters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        query: searchParams.query || '',
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
    const cleanFilters = {
      sortBy: filters.sortBy || 'price_asc',
      condition: 'todos',
      freeShippingOnly: false,
      store: 'todos',
      partBrand: 'todos',
      mendozaZone: 'todos',
      sourceType: 'todos',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(cleanFilters);
    executeSearch(newSearchParams, cleanFilters);
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
    <div className="min-h-screen bg-[#ebebeb] text-[#333333] flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Fondo de Marca de Agua DinAcitY estilo TurismoCity (No bloquea contenido ni botones) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col justify-between"
      >
        {/* Marca de agua superior en ángulo */}
        <div className="text-[13vw] font-black uppercase tracking-tighter text-gray-900/[0.03] leading-none -translate-x-12 -translate-y-6 whitespace-nowrap transform -rotate-2">
          DinAcitY • Mendoza • DinAcitY • Mendoza • DinAcitY
        </div>

        {/* Marca de agua central gigante TurismoCity Style */}
        <div className="text-[20vw] font-black uppercase tracking-tighter text-blue-950/[0.035] leading-none translate-x-10 whitespace-nowrap transform rotate-1">
          DinAcitY
        </div>

        {/* Marca de agua intermedia de repuestos */}
        <div className="text-[10vw] font-black uppercase tracking-wider text-red-900/[0.025] leading-none -translate-x-8 whitespace-nowrap">
          Comparador de Repuestos Automotores • Mendoza
        </div>

        {/* Marca de agua inferior */}
        <div className="text-[14vw] font-black uppercase tracking-tighter text-gray-900/[0.03] leading-none translate-x-4 translate-y-12 whitespace-nowrap transform -rotate-1">
          Autos • Motos • Camiones • Mercado Libre • Casas de Repuestos
        </div>
      </div>

      {/* Contenido Principal por encima de la marca de agua */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header en Rojo Institucional y Barra integrada estilo Mercado Libre */}
        <Navbar
          user={currentUser}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'register');
            setIsAuthOpen(true);
          }}
          onLogout={handleLogout}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onSearch={handleSearchFromHero}
          currentQuery={currentSearchParams.query}
        />

        {/* Hero Search Box con tarjeta blanca y selectores */}
        <HeroSearch
          taxonomy={taxonomy}
          onSearch={handleSearchFromHero}
          loading={loading}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
        
        {/* Results Overview Bar (Mercado Libre Style) */}
        <div className="bg-white border border-gray-200 rounded-lg p-3.5 sm:p-4 mb-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Repuestos en Mendoza para <span className="text-red-600">"{currentSearchParams.query || currentSearchParams.model || 'Repuestos'}"</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                {searchData.stats?.totalResults || 0} resultados
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs text-gray-500">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                ✓ Ordenados del más barato al más caro
              </span>
              <span>•</span>
              <span className="text-gray-700">
                🏢 {mendozaSources.casasRepuestosMendoza || 0} en Casas de Repuestos
              </span>
              <span>•</span>
              <span className="text-gray-700">
                💬 {mendozaSources.facebookMarketplaceMendoza || 0} en Marketplace MZA
              </span>
              <span>•</span>
              <span className="text-gray-700">
                📦 {mendozaSources.mercadoLibreMendoza || 0} en Mercado Libre MZA
              </span>
            </div>
          </div>

          {/* Stats Badges (Rojo y Azul) */}
          <div className="flex flex-wrap items-center gap-2">
            {searchData.stats?.minPrice > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                <Flame className="w-4 h-4 text-red-600 fill-red-600" />
                <div>
                  <span className="block text-[10px] text-red-600 uppercase font-black">Más Barato en MZA</span>
                  <span className="text-sm font-black text-gray-900">{formattedMoney(searchData.stats.minPrice)}</span>
                </div>
              </div>
            )}

            {searchData.stats?.maxSavingsPossible > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold hidden sm:flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="block text-[10px] text-blue-600 uppercase font-black">Ahorro Máximo</span>
                  <span className="text-sm font-black text-gray-900">Hasta {formattedMoney(searchData.stats.maxSavingsPossible)}</span>
                </div>
              </div>
            )}

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden px-3 py-2 rounded-md bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs border border-gray-300 flex items-center gap-1.5 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
              <span>Filtros</span>
            </button>
          </div>

        </div>

        {/* Layout with Sidebar and Cards */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          
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
          <div className="flex-1 w-full space-y-3">
            
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center space-y-3 shadow-sm">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-800 font-bold text-sm sm:text-base">
                  Rastreando en casas de repuestos de Mendoza, Marketplace y Mercado Libre...
                </p>
                <p className="text-xs text-gray-500">
                  Normalizando títulos y clasificando del más barato al más caro
                </p>
              </div>
            ) : searchData.results?.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center space-y-3 shadow-sm">
                <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  No se encontraron ofertas en Mendoza con estos filtros
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Prueba modificando la zona de Mendoza, el rango de precios o eliminando filtros para ver más opciones disponibles.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-md shadow-sm hover:bg-red-700"
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

      {/* Modal Seguro de Registro y Login de Usuarios */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer en Azul Marino institucional con detalles en Rojo */}
      <footer className="mt-12 bg-blue-950 text-white border-t-4 border-red-600 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl font-black text-white">
                <span className="bg-blue-800 text-white px-1.5 py-0.5 rounded">Din</span>
                <span className="text-red-500 ml-1">AcitY</span>
              </span>
              <span className="text-xs bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded font-bold">
                Edición Mendoza, Argentina
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1 max-w-sm">
              Comparador de precios de repuestos para autos, motos y camiones en Mendoza. Formato Mercado Libre, casas de repuestos del Carril Rodríguez Peña y WhatsApp directo.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-200 font-medium">
            <span>📍 Carril Rodríguez Peña</span>
            <span>📍 Godoy Cruz</span>
            <span>📍 Guaymallén</span>
            <span>📍 Maipú</span>
            <span>📍 Capital</span>
            <span>📍 San Martín</span>
            <span>📍 San Rafael</span>
          </div>

          <div className="text-xs text-blue-400">
            © 2026 DinAcitY Mendoza. Desarrollado para Maximiliano Di Natale.
          </div>
        </div>
      </footer>

      </div>
    </div>
  );
}

export default App;
