import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HeroSearch } from './components/HeroSearch.jsx';
import { PartCard } from './components/PartCard.jsx';
import { FilterSidebar } from './components/FilterSidebar.jsx';
import { PriceComparisonModal } from './components/PriceComparisonModal.jsx';
import { PriceAlertModal } from './components/PriceAlertModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { ComboBuilderModal } from './components/ComboBuilderModal.jsx';
import { QuoteRequestWidget } from './components/QuoteRequestWidget.jsx';
import { MaintenanceBookWidget } from './components/MaintenanceBookWidget.jsx';
import { clientFallbackService } from './services/clientFallbackService.js';
import { Flame, SlidersHorizontal, Sparkles, AlertCircle, MapPin, Store, Car, MessageCircle, BookOpen, Search } from 'lucide-react';

export function App() {
  const [taxonomy, setTaxonomy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    results: [],
    stats: {},
    filtersMeta: {},
    query: {}
  });

  // Vista activa principal: 'cotizador' (Opción 1) | 'mantenimiento' (Opción 2) | 'catalogo'
  const [activeView, setActiveView] = useState('cotizador');

  // Vehículo sincronizado entre Patente DNRPA, Cotizador Express y Libreta de Mantenimiento
  const [selectedVehicle, setSelectedVehicle] = useState({
    patente: 'AD 192 OP',
    brand: 'Volkswagen',
    model: 'Gol Trend',
    version: 'Trendline 1.6 MSI 5P',
    year: 2019,
    vehicleType: 'auto',
    engine: {
      name: '1.6 8V MSI Naftero (101 CV)',
      code: 'EA111 (CFZ)',
      displacement: '1598 cc',
      power: '101 CV',
      fuel: 'Nafta Súper'
    },
    chassis: {
      vin: '8AWZZZ5UZKT048192',
      bodyType: 'Hatchback 5P',
      drive: 'Delantera 4x2'
    },
    dnrpa: {
      seccional: 'Guaymallén N° 2',
      codigoRegistro: '13012',
      provincia: 'Mendoza'
    }
  });

  // Estado de Modal de Paquetes Dinámicos
  const [isComboOpen, setIsComboOpen] = useState(false);

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
    vehicleBrand: 'todos',
    partQuality: 'todos',
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
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => setTaxonomy(data))
      .catch((err) => {
        console.warn('Utilizando catálogo directo cliente Mendoza:', err);
        setTaxonomy(clientFallbackService.getTaxonomy());
      });

    executeSearch(currentSearchParams, filters);
  }, []);

  // Verificar sesión persistida si existe token
  useEffect(() => {
    if (token) {
      if (token.startsWith('client_tok_')) {
        const stored = localStorage.getItem('dinacity_user');
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
          } catch (e) {}
        }
        return;
      }

      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Not ok');
          const ct = res.headers.get('content-type') || '';
          if (!ct.includes('application/json')) throw new Error('Not json');
          return res.json();
        })
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
        vehicleBrand: currentFilters?.vehicleBrand || 'todos',
        partQuality: currentFilters?.partQuality || 'todos',
        mendozaZone: currentFilters?.mendozaZone || 'todos',
        sourceType: currentFilters?.sourceType || 'todos',
        minPrice: currentFilters?.minPrice || '',
        maxPrice: currentFilters?.maxPrice || ''
      });

      const response = await fetch(`/api/parts/search?${queryParams.toString()}`);
      if (!response.ok) throw new Error('API offline');
      const data = await response.json();
      setSearchData(data);
    } catch (error) {
      console.warn('Conectando directamente con motor Mendoza local:', error);
      const fallbackData = clientFallbackService.searchParts({
        ...searchParams,
        ...currentFilters
      });
      setSearchData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFromHero = (newSearchParams) => {
    setCurrentSearchParams(newSearchParams);
    if (newSearchParams?.brand || newSearchParams?.patente || newSearchParams?.data) {
      setSelectedVehicle((prev) => ({
        patente: newSearchParams?.patente || newSearchParams?.data?.patente || prev.patente,
        brand: newSearchParams?.brand || newSearchParams?.data?.brand || prev.brand,
        model: newSearchParams?.model || newSearchParams?.data?.model || prev.model,
        version: newSearchParams?.data?.version || prev.version || '',
        year: newSearchParams?.year || newSearchParams?.data?.year || prev.year,
        vehicleType: newSearchParams?.vehicleType || prev.vehicleType,
        engine: newSearchParams?.data?.engine || (newSearchParams?.engineSpec ? { name: newSearchParams.engineSpec } : prev.engine),
        chassis: newSearchParams?.data?.chassis || prev.chassis,
        dnrpa: newSearchParams?.data?.dnrpa || prev.dnrpa
      }));
    }
    const cleanFilters = {
      sortBy: filters.sortBy || 'price_asc',
      condition: 'todos',
      freeShippingOnly: false,
      store: 'todos',
      partBrand: 'todos',
      vehicleBrand: 'todos',
      partQuality: 'todos',
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
      vehicleBrand: 'todos',
      partQuality: 'todos',
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#0d1629] to-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Resplandor ambiental sutil automotor (reemplaza marca de agua) */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Contenido Principal */}
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
          onOpenCombos={() => setIsComboOpen(true)}
          currentView={activeView}
          onChangeView={(v) => setActiveView(v)}
        />

        {/* Barra Superior de Navegación de Vistas: Opción 1, Opción 2 y Catálogo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 w-full">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-xl flex items-center justify-between gap-1.5 overflow-x-auto">
            
            {/* Tab 1: Cotizador Express WhatsApp (Opción 1) */}
            <button
              type="button"
              onClick={() => setActiveView('cotizador')}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 border ${
                activeView === 'cotizador'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-md shadow-red-600/20'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60 border-transparent'
              }`}
            >
              <span className="text-base">💬</span>
              <span>Opción 1: Cotizador WhatsApp Mendoza</span>
            </button>

            {/* Tab 2: Libreta de Mantenimiento & Ficha Técnica (Opción 2) */}
            <button
              type="button"
              onClick={() => setActiveView('mantenimiento')}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 border ${
                activeView === 'mantenimiento'
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-blue-500 shadow-md shadow-blue-700/20'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60 border-transparent'
              }`}
            >
              <span className="text-base">📖</span>
              <span>Opción 2: Libreta & Ficha Técnica</span>
            </button>

            {/* Tab 3: Búsqueda & Catálogo de Precios */}
            <button
              type="button"
              onClick={() => setActiveView('catalogo')}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 border ${
                activeView === 'catalogo'
                  ? 'bg-slate-700 text-white border-slate-500 shadow-md'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/60 border-transparent'
              }`}
            >
              <span className="text-base">🔍</span>
              <span>Catálogo & DNRPA Patente</span>
            </button>

          </div>
        </div>

        {/* Vista Opción 1: Cotizador Express de Repuestos por WhatsApp */}
        {activeView === 'cotizador' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <QuoteRequestWidget
              vehicle={selectedVehicle}
              onOpenPatenteModal={() => setActiveView('catalogo')}
              onSelectPart={(part) => {
                handleSearchFromHero({
                  ...currentSearchParams,
                  query: part
                });
                setActiveView('catalogo');
              }}
            />
          </main>
        )}

        {/* Vista Opción 2: Libreta de Mantenimiento Inteligente & Ficha Técnica */}
        {activeView === 'mantenimiento' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <MaintenanceBookWidget
              vehicle={selectedVehicle}
              onOpenPatenteModal={() => setActiveView('catalogo')}
              onQuoteService={(serviceData) => {
                if (serviceData?.vehicle) {
                  setSelectedVehicle(serviceData.vehicle);
                }
                setActiveView('cotizador');
              }}
            />
          </main>
        )}

        {/* Vista Catálogo & Metabuscador con Identificación Patente DNRPA */}
        {activeView === 'catalogo' && (
          <>
            {/* Hero Search Box con tarjeta blanca y selectores */}
            <HeroSearch
              taxonomy={taxonomy}
              onSearch={handleSearchFromHero}
              loading={loading}
              currentSearchParams={currentSearchParams}
              currentQuality={filters.partQuality || 'todos'}
              onQualityChange={(q) => handleFilterChange('partQuality', q)}
              onOpenCombos={() => setIsComboOpen(true)}
              onNavigateCotizador={(veh) => {
                if (veh) setSelectedVehicle(veh);
                setActiveView('cotizador');
              }}
              onNavigateMantenimiento={(veh) => {
                if (veh) setSelectedVehicle(veh);
                setActiveView('mantenimiento');
              }}
            />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            
            {/* Results Overview Bar (Mercado Libre Style) */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 sm:p-4 mb-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-100">
              
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Repuestos en Mendoza para <span className="text-red-400">"{currentSearchParams.query || currentSearchParams.model || 'Repuestos'}"</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600">
                    {searchData.stats?.totalResults || 0} resultados
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
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
              <div className="flex flex-wrap items-center gap-2">
                {searchData.stats?.minPrice > 0 && (
                  <div className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-700/60 text-red-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                    <Flame className="w-4 h-4 text-red-400 fill-red-400" />
                    <div>
                      <span className="block text-[10px] text-red-400 uppercase font-black">Más Barato en MZA</span>
                      <span className="text-sm font-black text-white">{formattedMoney(searchData.stats.minPrice)}</span>
                    </div>
                  </div>
                )}

                {searchData.stats?.maxSavingsPossible > 0 && (
                  <div className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-200 text-xs font-semibold hidden sm:flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="block text-[10px] text-blue-400 uppercase font-black">Ahorro Máximo</span>
                      <span className="text-sm font-black text-white">Hasta {formattedMoney(searchData.stats.maxSavingsPossible)}</span>
                    </div>
                  </div>
                )}

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs border border-slate-600 flex items-center gap-1.5 shadow-sm"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-red-400" />
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
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center space-y-3 shadow-sm">
                    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-white font-bold text-sm sm:text-base">
                      Rastreando en casas de repuestos de Mendoza, Marketplace y Mercado Libre...
                    </p>
                    <p className="text-xs text-slate-400">
                      Normalizando títulos y clasificando del más barato al más caro
                    </p>
                  </div>
                ) : searchData.results?.length === 0 ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center space-y-3 shadow-sm">
                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      No se encontraron ofertas en Mendoza con estos filtros
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Prueba modificando la zona de Mendoza, el rango de precios o eliminando filtros para ver más opciones disponibles.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Ficha de Radicación en Mendoza y Patente Conectada */}
                    {searchData.vehicleRegistry && (
                      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-xl p-4 shadow-sm border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="bg-white/10 p-2.5 rounded-lg border border-white/20 shrink-0">
                            <Car className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm sm:text-base text-white tracking-tight">
                                {searchData.vehicleRegistry.brand?.toUpperCase()} {searchData.vehicleRegistry.model} ({searchData.vehicleRegistry.year})
                              </span>
                              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-blue-500 text-white border border-blue-300">
                                🇦🇷 Patente: {searchData.vehicleRegistry.patente}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                                ✓ Radicado en Mendoza
                              </span>
                            </div>
                            <p className="text-xs text-blue-200 mt-1">
                              {searchData.vehicleRegistry.radicacion} • Motor: <strong className="text-white">{searchData.vehicleRegistry.engine}</strong>
                            </p>
                            {searchData.officialDealer && (
                              <p className="text-xs text-yellow-300 font-semibold mt-0.5 flex flex-wrap items-center gap-1">
                                <span>Concesionario Oficial Designado:</span>
                                <strong className="text-white underline">{searchData.officialDealer.dealerName}</strong>
                                <span>({searchData.officialDealer.address})</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {searchData.officialDealer?.officialWebsite && (
                          <a
                            href={searchData.officialDealer.officialWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-3.5 py-2 rounded-lg bg-white text-blue-950 hover:bg-blue-50 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition border border-white/40"
                          >
                            <span>Sitio Oficial {searchData.officialDealer.brandName} ↗</span>
                          </a>
                        )}
                      </div>
                    )}

                    {searchData.results?.map((item) => (
                      <PartCard
                        key={item.id}
                        item={item}
                        onCompare={(it) => setComparingItem(it)}
                        onSearchRelated={(term) => {
                          handleSearchFromHero({
                            ...currentSearchParams,
                            query: term
                          });
                        }}
                      />
                    ))}
                  </>
                )}

              </div>

            </div>

          </main>
          </>
        )}

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

      {/* Modal de Paquetes Dinámicos y Kits de Repuestos */}
      <ComboBuilderModal
        isOpen={isComboOpen}
        onClose={() => setIsComboOpen(false)}
        vehicleParams={currentSearchParams}
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
              Cotizador Express de repuestos y Libreta de Mantenimiento Inteligente para autos, motos y camiones en Mendoza. Conexión directa por WhatsApp con casas de repuestos del Carril Rodríguez Peña y Gran Mendoza.
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
