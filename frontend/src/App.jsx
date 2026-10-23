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
import { ServiceNotebookWidget } from './components/ServiceNotebookWidget.jsx';
import { GuanteraDigitalWidget } from './components/GuanteraDigitalWidget.jsx';
import { MendozaStoresMapWidget } from './components/MendozaStoresMapWidget.jsx';
import { KitBuilderWidget } from './components/KitBuilderWidget.jsx';
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

  // Vista activa principal: 'patente' (DNRPA Eje Central) | 'cotizador' | 'mantenimiento' | 'libreta' | 'guantera' | 'mapa' | 'kits'
  const [activeView, setActiveView] = useState('patente');

  // Vehículo sincronizado entre Patente DNRPA, Cotizador Express, Libreta y Guantera
  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    return clientFallbackService.getActiveCocheraVehicle() || {
      patente: 'AF 482 QZ',
      brand: 'Toyota',
      model: 'Hilux',
      version: 'SRV 4x4 Doble Cabina Automática',
      year: 2022,
      vehicleType: 'auto',
      engine: {
        name: '2.8 D-4D 16V Turbo Diésel (204 CV)',
        code: '1GD-FTV',
        displacement: '2755 cc',
        power: '204 CV',
        fuel: 'Diésel Grado 3 (Euro)'
      },
      chassis: {
        vin: '8AJBA3CD7N0128941',
        bodyType: 'Pick-Up Cabina Doble',
        drive: '4x4 Tracción Integral con Reductora'
      },
      dnrpa: {
        seccional: 'Mendoza N° 4 (Godoy Cruz)',
        codigoRegistro: '13004',
        provincia: 'Mendoza'
      }
    };
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

    // Si la búsqueda ingresada es una patente argentina o un VIN, resolver en DNRPA
    const qClean = (newSearchParams?.query || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (
      /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(qClean) ||
      /^[A-Z]{3}[0-9]{3}$/.test(qClean) ||
      /^[A-Z]{1}[0-9]{3}[A-Z]{3}$/.test(qClean) ||
      /^[0-9]{3}[A-Z]{3,4}$/.test(qClean) ||
      qClean.length === 17
    ) {
      const decoded = clientFallbackService.lookupPatente(qClean);
      if (decoded && decoded.data) {
        setSelectedVehicle(decoded.data);
        clientFallbackService.saveToCochera(decoded.data);
        setActiveView('patente');
        return;
      }
    }

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

        {/* Barra Superior de Navegación de Vistas: Modo Tablero Digital Deportivo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 w-full">
          <div className="bg-gradient-to-r from-[#0a1835]/95 via-[#0e224b]/95 to-[#0a1835]/95 border border-blue-500/30 rounded-2xl p-2 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.2)] backdrop-blur-xl flex items-center justify-between gap-2.5 overflow-x-auto scrollbar-none">
            
            {/* Tab 1: Mi Cochera Digital & Carga de Vehículo (EJE CENTRAL) */}
            <button
              type="button"
              onClick={() => setActiveView('patente')}
              className={`group flex-1 min-w-[190px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border cursor-pointer relative overflow-hidden ${
                activeView === 'patente'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-2 ring-blue-400/40 scale-[1.02]'
                  : 'bg-[#0d1e3f]/80 hover:bg-[#142d5e]/95 text-blue-100/90 hover:text-white border-blue-500/25 hover:border-blue-400/60 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform">🚗</span>
                <span className="tracking-tight">Mi Cochera</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border transition flex items-center gap-1 shadow-xs ${
                activeView === 'patente'
                  ? 'bg-sky-400 text-slate-950 border-sky-300 font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                  : 'bg-sky-500/20 text-sky-200 border-sky-400/40 group-hover:bg-sky-500/30'
              }`}>
                ✨ Cargar Auto
              </span>
            </button>

            {/* Tab 2: Cotizador Express WhatsApp (Opción 1) */}
            <button
              type="button"
              onClick={() => setActiveView('cotizador')}
              className={`group flex-1 min-w-[190px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border cursor-pointer relative overflow-hidden ${
                activeView === 'cotizador'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-2 ring-blue-400/40 scale-[1.02]'
                  : 'bg-[#0d1e3f]/80 hover:bg-[#142d5e]/95 text-blue-100/90 hover:text-white border-blue-500/25 hover:border-blue-400/60 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform">💬</span>
                <span className="tracking-tight">Cotizador WhatsApp</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border transition flex items-center gap-1 shadow-xs ${
                activeView === 'cotizador'
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-extrabold shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 group-hover:bg-emerald-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                1-Click
              </span>
            </button>

            {/* Tab 3: Pasaporte Service & Ficha Técnica (Opción 2) */}
            <button
              type="button"
              onClick={() => setActiveView('mantenimiento')}
              className={`group flex-1 min-w-[190px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border cursor-pointer relative overflow-hidden ${
                activeView === 'mantenimiento'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-2 ring-blue-400/40 scale-[1.02]'
                  : 'bg-[#0d1e3f]/80 hover:bg-[#142d5e]/95 text-blue-100/90 hover:text-white border-blue-500/25 hover:border-blue-400/60 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform">📖</span>
                <span className="tracking-tight">Pasaporte Service</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border transition flex items-center gap-1 shadow-xs ${
                activeView === 'mantenimiento'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-extrabold shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 group-hover:bg-cyan-500/30'
              }`}>
                ⚡ Fluidos
              </span>
            </button>

            {/* Tab 4: Libreta Digital de Mantenimiento & Services */}
            <button
              type="button"
              onClick={() => setActiveView('libreta')}
              className={`group flex-1 min-w-[190px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border cursor-pointer relative overflow-hidden ${
                activeView === 'libreta'
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.55),inset_0_1px_1px_rgba(255,255,255,0.5)] ring-2 ring-amber-400/50 scale-[1.02]'
                  : 'bg-[#0d1e3f]/80 hover:bg-[#142d5e]/95 text-blue-100/90 hover:text-white border-blue-500/25 hover:border-blue-400/60 shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform">📒</span>
                <span className="tracking-tight">Libreta de Services</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border transition flex items-center gap-1 shadow-xs ${
                activeView === 'libreta'
                  ? 'bg-slate-950 text-amber-300 border-amber-400 font-extrabold shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/40 group-hover:bg-amber-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Historial
              </span>
            </button>

            {/* Tab 5: Guantera Digital (Alertas de Vencimientos Mendoza) */}
            <button
              type="button"
              onClick={() => setActiveView('guantera')}
              className={`group flex-1 min-w-[190px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border cursor-pointer relative overflow-hidden ${
                activeView === 'guantera'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white border-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-2 ring-purple-400/40 scale-[1.02]'
                  : 'bg-[#0d1e3f]/80 hover:bg-[#142d5e]/95 text-blue-100/90 hover:text-white border-blue-500/25 hover:border-blue-400/60 shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform">📂</span>
                <span className="tracking-tight">Guantera Digital</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border transition flex items-center gap-1 shadow-xs ${
                activeView === 'guantera'
                  ? 'bg-purple-300 text-slate-950 border-purple-200 font-extrabold shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'bg-purple-500/20 text-purple-300 border-purple-400/40 group-hover:bg-purple-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                RTO • Seguro
              </span>
            </button>

            {/* Tab 6: Mapa de Mostradores MZA (Polo Rodríguez Peña & Zonas) */}
            <button
              type="button"
              onClick={() => setActiveView('mapa')}
              className={`group flex-1 min-w-[190px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border cursor-pointer relative overflow-hidden ${
                activeView === 'mapa'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-2 ring-emerald-400/40 scale-[1.02]'
                  : 'bg-[#0d1e3f]/80 hover:bg-[#142d5e]/95 text-blue-100/90 hover:text-white border-blue-500/25 hover:border-blue-400/60 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform">📍</span>
                <span className="tracking-tight">Mapa de Mostradores</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border transition flex items-center gap-1 shadow-xs ${
                activeView === 'mapa'
                  ? 'bg-emerald-300 text-slate-950 border-emerald-200 font-extrabold shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 group-hover:bg-emerald-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Rodríguez Peña
              </span>
            </button>

            {/* Tab 7: Armar Kit de Repuestos por Marca */}
            <button
              type="button"
              onClick={() => setActiveView('kits')}
              className={`group flex-1 min-w-[190px] py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border cursor-pointer relative overflow-hidden ${
                activeView === 'kits'
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-2 ring-red-400/40 scale-[1.02]'
                  : 'bg-[#0d1e3f]/80 hover:bg-[#142d5e]/95 text-blue-100/90 hover:text-white border-blue-500/25 hover:border-blue-400/60 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform">📦</span>
                <span className="tracking-tight">Armar Kit de Repuestos</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border transition flex items-center gap-1 shadow-xs ${
                activeView === 'kits'
                  ? 'bg-white text-red-700 border-red-200 font-extrabold shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'bg-red-500/20 text-red-300 border-red-400/40 group-hover:bg-red-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                Por Marca
              </span>
            </button>

          </div>
        </div>

        {/* Banner Persistente de Vehículo Activo DNRPA (Visible en todas las vistas) */}
        {selectedVehicle && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-2 w-full">
            <div className="bg-gradient-to-r from-slate-900/95 via-blue-950/90 to-slate-900/95 border border-blue-500/40 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs backdrop-blur-md">
              <div className="flex items-center gap-3">
                {/* Visual Plate Pill */}
                <div className="bg-white text-gray-900 px-3 py-1.5 rounded-lg border-2 border-gray-700 shadow-sm flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-black uppercase text-[#003399] tracking-wider leading-none">🇦🇷 ARGENTINA</span>
                  <span className="text-sm sm:text-base font-black font-mono tracking-widest text-gray-900 leading-tight">
                    {selectedVehicle.patente || selectedVehicle.displayPlate || 'AF 482 QZ'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                      ✓ Vehículo Activo en Cochera
                    </span>
                    <span className="text-[11px] text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60 font-mono font-bold">
                      Odómetro: {(selectedVehicle.currentKm || 60000).toLocaleString('es-AR')} km
                    </span>
                    <span className="text-[11px] text-blue-300">
                      📍 {selectedVehicle?.dnrpa?.seccional || 'Mendoza (Registro Automotor)'}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                    {selectedVehicle.brand} {selectedVehicle.model} <span className="text-red-400">{selectedVehicle.version || ''}</span> ({selectedVehicle.year || ''})
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Motor: <strong className="text-white">{selectedVehicle?.engine?.name || selectedVehicle?.engine || 'Motor Homologado'}</strong> {selectedVehicle?.engine?.power ? `• ${selectedVehicle.engine.power}` : ''}
                  </p>
                </div>
              </div>

              {/* Quick Actions vinculadas a las demás secciones */}
              <div className="flex items-center gap-2 flex-wrap self-end md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveView('patente')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  title="Cargar o cambiar vehículo en Mi Cochera Digital"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Mi Cochera / Cambiar Auto</span>
                </button>

                {activeView !== 'cotizador' && (
                  <button
                    type="button"
                    onClick={() => setActiveView('cotizador')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>💬 Cotizar</span>
                  </button>
                )}

                {activeView !== 'mantenimiento' && (
                  <button
                    type="button"
                    onClick={() => setActiveView('mantenimiento')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>📖 Fluidos</span>
                  </button>
                )}

                {activeView !== 'guantera' && (
                  <button
                    type="button"
                    onClick={() => setActiveView('guantera')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>📂 RTO</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vista Opción 1: Cotizador Express de Repuestos por WhatsApp */}
        {activeView === 'cotizador' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <QuoteRequestWidget
              vehicle={selectedVehicle}
              onOpenPatenteModal={() => setActiveView('patente')}
              onSelectPart={(part) => {
                setActiveView('cotizador');
              }}
              onNavigateMapa={() => setActiveView('mapa')}
              onNavigateKits={() => setActiveView('kits')}
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
              onNavigateLibreta={() => setActiveView('libreta')}
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
              onNavigateLibreta={(veh) => {
                if (veh) setSelectedVehicle(veh);
                setActiveView('libreta');
              }}
              onNavigateGuantera={(veh) => {
                if (veh) setSelectedVehicle(veh);
                setActiveView('guantera');
              }}
              onNavigateKits={(veh) => {
                if (veh) setSelectedVehicle(veh);
                setActiveView('kits');
              }}
              onNavigateMapa={(veh) => {
                if (veh) setSelectedVehicle(veh);
                setActiveView('mapa');
              }}
            />
          </main>
        )}

        {/* Vista Opción 4: Libreta Digital de Mantenimiento & Services */}
        {activeView === 'libreta' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <ServiceNotebookWidget
              vehicle={selectedVehicle}
              onSelectVehicle={(veh) => setSelectedVehicle(veh)}
              onOpenPatenteModal={() => setActiveView('patente')}
              onNavigateCotizador={(serviceData) => {
                if (serviceData?.vehicle) {
                  setSelectedVehicle(serviceData.vehicle);
                }
                setActiveView('cotizador');
              }}
              onNavigatePasaporte={() => setActiveView('mantenimiento')}
            />
          </main>
        )}

        {/* Vista Opción 5: Guantera Digital & Alertas de Vencimientos Mendoza */}
        {activeView === 'guantera' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <GuanteraDigitalWidget
              vehicle={selectedVehicle}
              onOpenPatenteModal={() => setActiveView('patente')}
              onNavigateCotizador={() => setActiveView('cotizador')}
              onNavigateMantenimiento={() => setActiveView('mantenimiento')}
            />
          </main>
        )}

        {/* Vista Opción 6: Circuito y Mapa de Mostradores Mendoza */}
        {activeView === 'mapa' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <MendozaStoresMapWidget
              vehicle={selectedVehicle}
              onNavigateCotizador={() => setActiveView('cotizador')}
            />
          </main>
        )}

        {/* Vista Opción 7: Armador Inteligente de Kits de Repuestos Especializados */}
        {activeView === 'kits' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
            <KitBuilderWidget
              vehicle={selectedVehicle}
              onOpenPatenteModal={() => setActiveView('patente')}
              onNavigateCotizador={() => setActiveView('cotizador')}
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
