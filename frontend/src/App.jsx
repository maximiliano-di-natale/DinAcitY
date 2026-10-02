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

  // Vista activa principal: 'cotizador' (Opción 1) | 'mantenimiento' (Opción 2) | 'patente' (DNRPA)
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
    <div className="min-h-screen bg-gradient-to-b from-[#09152b] via-[#0d2146] via-45% to-[#050c18] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Resplandor ambiental automotor premium en tonos azules profundos (más interesante y oscuro) */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-36 left-1/4 w-[750px] h-[750px] bg-blue-600/15 rounded-full blur-[160px]" />
        <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] bg-indigo-600/20 rounded-full blur-[150px]" />
        <div className="absolute top-2/3 -left-32 w-[600px] h-[600px] bg-blue-700/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-32 right-1/4 w-[700px] h-[700px] bg-sky-800/10 rounded-full blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.22),rgba(255,255,255,0))] pointer-events-none" />
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
          <div className="bg-[#0b1b38]/90 border border-[#1d3d78]/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 overflow-x-auto">
            
            {/* Tab 1: Cotizador Express WhatsApp (Opción 1) */}
            <button
              type="button"
              onClick={() => setActiveView('cotizador')}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 border cursor-pointer ${
                activeView === 'cotizador'
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white border-blue-400 shadow-lg shadow-blue-600/35 ring-2 ring-blue-400/40'
                  : 'bg-[#10244c]/70 hover:bg-[#18366e]/90 text-blue-100 hover:text-white border-blue-500/30 hover:border-blue-400/60 shadow-sm'
              }`}
            >
              <span className="text-base">💬</span>
              <span>Opción 1: Cotizador WhatsApp Mendoza</span>
            </button>

            {/* Tab 2: Libreta de Mantenimiento & Ficha Técnica (Opción 2) */}
            <button
              type="button"
              onClick={() => setActiveView('mantenimiento')}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 border cursor-pointer ${
                activeView === 'mantenimiento'
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white border-blue-400 shadow-lg shadow-blue-600/35 ring-2 ring-blue-400/40'
                  : 'bg-[#10244c]/70 hover:bg-[#18366e]/90 text-blue-100 hover:text-white border-blue-500/30 hover:border-blue-400/60 shadow-sm'
              }`}
            >
              <span className="text-base">📖</span>
              <span>Opción 2: Libreta & Ficha Técnica</span>
            </button>

            {/* Tab 3: Identificador por Patente DNRPA */}
            <button
              type="button"
              onClick={() => setActiveView('patente')}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 border cursor-pointer ${
                activeView === 'patente'
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white border-blue-400 shadow-lg shadow-blue-600/35 ring-2 ring-blue-400/40'
                  : 'bg-[#10244c]/70 hover:bg-[#18366e]/90 text-blue-100 hover:text-white border-blue-500/30 hover:border-blue-400/60 shadow-sm'
              }`}
            >
              <span className="text-base">🇦🇷</span>
              <span>Identificar por Patente (DNRPA)</span>
            </button>

          </div>
        </div>

        {/* Vista Opción 1: Cotizador Express de Repuestos por WhatsApp */}
        {activeView === 'cotizador' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <QuoteRequestWidget
              vehicle={selectedVehicle}
              onOpenPatenteModal={() => setActiveView('patente')}
              onSelectPart={(part) => {
                setActiveView('cotizador');
              }}
            />
          </main>
        )}

        {/* Vista Opción 2: Libreta de Mantenimiento Inteligente & Ficha Técnica */}
        {activeView === 'mantenimiento' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <MaintenanceBookWidget
              vehicle={selectedVehicle}
              onOpenPatenteModal={() => setActiveView('patente')}
              onQuoteService={(serviceData) => {
                if (serviceData?.vehicle) {
                  setSelectedVehicle(serviceData.vehicle);
                }
                setActiveView('cotizador');
              }}
            />
          </main>
        )}

        {/* Vista Identificación de Patente DNRPA */}
        {activeView === 'patente' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <HeroSearch
              onSelectVehicle={(veh) => {
                if (veh) {
                  const data = veh.data || veh;
                  setSelectedVehicle(data);
                }
              }}
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
          </main>
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
