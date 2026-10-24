import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  Bell,
  Download,
  MapPin,
  Search,
  ShieldCheck,
  ChevronDown,
  User,
  LogOut,
  ShoppingBag,
  Heart,
  Droplets,
  Wind,
  Fan,
  Thermometer,
  Waves,
  Flame,
  Activity,
  Disc,
  Gauge,
  Cog,
  BatteryCharging,
  Battery,
  Sparkles,
  Shield,
  Package
} from 'lucide-react';

export function Navbar({
  user,
  userLocation,
  onOpenLocationModal,
  onOpenAuth,
  onLogout,
  onOpenAlerts,
  onSearch,
  currentQuery,
  onOpenCombos,
  currentView = 'cotizador',
  onChangeView
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [navSearch, setNavSearch] = useState(currentQuery || '');
  
  // Dropdown states
  const [isRefrigeracionOpen, setIsRefrigeracionOpen] = useState(false);
  const [isCalefaccionOpen, setIsCalefaccionOpen] = useState(false);
  const [isTopUserMenuOpen, setIsTopUserMenuOpen] = useState(false);

  const refrigeracionRef = useRef(null);
  const calefaccionRef = useRef(null);
  const topUserMenuRef = useRef(null);

  useEffect(() => {
    setNavSearch(currentQuery || '');
  }, [currentQuery]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refrigeracionRef.current && !refrigeracionRef.current.contains(event.target)) {
        setIsRefrigeracionOpen(false);
      }
      if (calefaccionRef.current && !calefaccionRef.current.contains(event.target)) {
        setIsCalefaccionOpen(false);
      }
      if (topUserMenuRef.current && !topUserMenuRef.current.contains(event.target)) {
        setIsTopUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar DinAcitY en tu celular o PC: abre las opciones del navegador y selecciona "Agregar a la pantalla principal" o "Instalar aplicación".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleNavSubmit = (e) => {
    e?.preventDefault();
    if (onSearch) {
      onSearch({ query: navSearch });
    }
  };

  const handleCategoryClick = (categoryQuery) => {
    setIsRefrigeracionOpen(false);
    setIsCalefaccionOpen(false);
    setNavSearch(categoryQuery);
    if (onSearch) {
      onSearch({ query: categoryQuery });
    }
  };

  // User initials for avatar (e.g. Maximiliano Di Natale -> MD)
  const getUserInitials = () => {
    if (!user) return '';
    const first = user.nombre ? user.nombre.charAt(0).toUpperCase() : '';
    const last = user.apellido ? user.apellido.charAt(0).toUpperCase() : '';
    return first + (last || '');
  };

  // Sub-opciones de Refrigeración
  const refrigeracionOptions = [
    {
      id: 'ref-agua',
      name: 'Radiadores de agua',
      query: 'Radiador de agua',
      desc: 'Radiadores de refrigeración de motor de autos, camionetas y camiones',
      icon: Droplets
    },
    {
      id: 'ref-aire',
      name: 'Radiadores de aire',
      query: 'Radiador de aire intercooler',
      desc: 'Intercoolers y radiadores de aire del turbo',
      icon: Wind
    },
    {
      id: 'ref-vent',
      name: 'Ventiladores',
      query: 'Electroventilador',
      desc: 'Electroventiladores completos, motores y deflectores',
      icon: Fan
    },
    {
      id: 'ref-term',
      name: 'Termostatos',
      query: 'Termostato con caja',
      desc: 'Termostatos con pipeta, cuerpo y caja plástica/aluminio',
      icon: Thermometer
    },
    {
      id: 'ref-bomba',
      name: 'Bomba de agua',
      query: 'Bomba de agua',
      desc: 'Bombas de agua de refrigeración automotor',
      icon: Waves
    }
  ];

  // Sub-opciones de Calefacción
  const calefaccionOptions = [
    {
      id: 'cal-rad',
      name: 'Radiadores de calefacción',
      query: 'Radiador de calefaccion',
      desc: 'Paneles y radiadores del calefactor de habitáculo',
      icon: Flame
    },
    {
      id: 'cal-mang',
      name: 'Mangueras de calefacción',
      query: 'Manguera de calefaccion',
      desc: 'Mangueras de entrada, salida y paso de agua de calefactor',
      icon: Activity
    }
  ];

  // Accesos directos adicionales
  const otherLinks = [
    { label: 'Frenos', query: 'Pastillas de freno' },
    { label: 'Mangueras', query: 'Mangueras' },
    { label: 'Motor', query: 'Kit distribucion' },
    { label: 'Embragues', query: 'Kit embrague' },
    { label: 'Suspensión', query: 'Amortiguadores' },
    { label: 'Baterías', query: 'Bateria 12V' },
    { label: 'Filtros', query: 'Filtro aceite' },
    { label: 'Ofertas Mendoza', query: 'Repuestos' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-red-600 via-red-600 to-red-700 shadow-md">
      {/* Top Main Bar (Mercado Libre Line 1) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          
          {/* Logo DinAcitY (Rojo y Azul) */}
          <div
            onClick={() => handleCategoryClick('')}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            title="Ir al inicio de DinAcitY"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-700 border-2 border-white flex items-center justify-center shadow-md text-white font-black text-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-900 bg-white px-1.5 py-0.5 rounded shadow-sm">
                  Din
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow">
                  AcitY
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-blue-900 text-white border border-blue-400 rounded-full shadow-sm ml-1">
                  <span>🇦🇷</span>
                  Argentina
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Search Bar (Mercado Libre Style) */}
          <form
            onSubmit={handleNavSubmit}
            className="flex-1 max-w-2xl relative flex items-center"
          >
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Buscar repuestos, marcas o autos en toda Argentina (ej: radiador, gol, hilux, pastillas)..."
              className="w-full bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm pl-3.5 pr-10 py-2 sm:py-2 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r transition flex items-center justify-center cursor-pointer"
              title="Buscar en toda Argentina"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* Right Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Price Alert Button */}
            <button
              onClick={onOpenAlerts}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded bg-red-700 hover:bg-red-800 text-white border border-red-500/40 transition shadow-sm cursor-pointer"
              title="Crear alerta de precio en Mendoza"
            >
              <Bell className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden md:inline">Alertas</span>
            </button>

            {/* Install PWA Button */}
            <button
              onClick={handleInstallClick}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-black rounded bg-white hover:bg-gray-100 text-red-600 border border-white shadow-sm transition cursor-pointer"
              title="Instalar en celular o computadora"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Instalar</span>
            </button>

            {/* === A LA DERECHA DE ESAS DOS OPCIONES: SIMBOLITO DE PERFIL DE USUARIO O BOTON INGRESAR === */}
            {user ? (
              /* Simbolito del perfil del usuario que ha ingresado a la página / APK */
              <div className="relative" ref={topUserMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsTopUserMenuOpen(!isTopUserMenuOpen)}
                  className="flex items-center gap-2 py-1 px-2 sm:px-2.5 rounded-lg bg-black/25 hover:bg-black/35 border border-white/30 hover:border-white/50 text-white transition shadow-sm cursor-pointer group"
                  title={`Sesión iniciada: ${user.nombre} ${user.apellido || ''}`}
                >
                  {/* Simbolito del perfil del usuario registrado */}
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border border-white/50 shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-left leading-none hidden sm:block">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] text-red-200 uppercase tracking-wider font-semibold">Perfil</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" title="Conectado"></span>
                    </div>
                    <span className="font-bold text-xs text-white max-w-[100px] truncate block leading-tight">
                      {user.nombre}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform ${isTopUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown del menú de usuario */}
                {isTopUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 leading-tight">
                            {user.nombre} {user.apellido || ''}
                          </p>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Conectado
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      {user.direccion && (
                        <p className="text-[10px] text-blue-700 mt-1 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="truncate">{user.direccion}</span>
                        </p>
                      )}
                    </div>

                    <div className="py-1 text-xs">
                      <div
                        onClick={() => {
                          setIsTopUserMenuOpen(false);
                          if (onOpenAuth) onOpenAuth('profile');
                        }}
                        className="px-4 py-2 hover:bg-red-50 text-gray-800 hover:text-red-700 flex items-center gap-2 cursor-pointer font-bold transition"
                      >
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Mi cuenta y perfil en DinAcitY</span>
                      </div>
                      <div
                        onClick={() => {
                          setIsTopUserMenuOpen(false);
                          if (onChangeView) onChangeView('cotizador');
                        }}
                        className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cotizaciones por WhatsApp</span>
                      </div>
                      <div
                        onClick={() => {
                          setIsTopUserMenuOpen(false);
                          if (onChangeView) onChangeView('cochera');
                        }}
                        className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Car className="w-3.5 h-3.5 text-red-600" />
                        <span>Mis vehículos en Mi Cochera</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setIsTopUserMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Botón de Ingresar y Registrarse si el usuario NO ha ingresado a la página o APK */
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-red-600 border border-white font-black text-xs shadow-md transition cursor-pointer"
                  title="Ingresar a tu cuenta en DinAcitY"
                >
                  <User className="w-3.5 h-3.5 text-red-600" />
                  <span>Ingresar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('register')}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-800/80 hover:bg-red-800 text-white border border-red-400/40 font-bold text-xs shadow-sm transition cursor-pointer"
                  title="Crear cuenta nueva y segura"
                >
                  <span>Registrarse</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Sub-Header Línea 1 (Arriba): Ubicación, Accesos Operativos y Usuario Registrado */}
      <div className="bg-red-700 border-t border-red-500/30 border-b border-red-800/40 text-xs text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none md:overflow-visible">
          
          {/* Left: Ubicación activa del usuario en Argentina (GPS o Manual) */}
          <div
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 shrink-0 cursor-pointer hover:bg-black/40 bg-black/20 px-2.5 py-1 rounded-lg transition border border-white/20"
            title="Clic para cambiar ubicación o activar GPS"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-yellow-300" />
            </div>
            <div className="text-[11px] leading-tight text-left">
              <span className="text-red-200 block text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                {userLocation?.isGps ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    GPS Activo
                  </>
                ) : (
                  'Tu Ubicación'
                )}
              </span>
              <span className="font-bold text-white block max-w-[150px] sm:max-w-[210px] truncate">
                {userLocation?.displayName || `${userLocation?.cityName || 'CABA'}, ${userLocation?.provinceName || 'Argentina'}`}
              </span>
            </div>
          </div>

          {/* Center: Accesos directos y herramientas */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs shrink-0">
            {/* Opción 1: Cotizador Express Mendoza WhatsApp */}
            <button
              onClick={() => onChangeView && onChangeView('cotizador')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1.5 border ${
                currentView === 'cotizador'
                  ? 'bg-white text-blue-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.04]'
                  : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40 shadow-xs hover:scale-[1.02]'
              }`}
              title="Pedir cotización de repuestos por WhatsApp en Mendoza"
            >
              <span>💬</span>
              <span>Cotizador Express</span>
              {currentView === 'cotizador' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>}
            </button>

            {/* Opción 2: Libreta de Mantenimiento Inteligente */}
            <button
              onClick={() => onChangeView && onChangeView('mantenimiento')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1.5 border ${
                currentView === 'mantenimiento'
                  ? 'bg-white text-blue-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.04]'
                  : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40 shadow-xs hover:scale-[1.02]'
              }`}
              title="Ver especificaciones de aceite, fluidos y services por kilometraje"
            >
              <span>📖</span>
              <span>Pasaporte Service</span>
              {currentView === 'mantenimiento' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse inline-block"></span>}
            </button>

            {/* Consulta DNRPA Patente */}
            <button
              onClick={() => onChangeView && onChangeView('patente')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1.5 border ${
                currentView === 'patente'
                  ? 'bg-white text-blue-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.04]'
                  : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40 shadow-xs hover:scale-[1.02]'
              }`}
              title="Buscar vehículo por patente DNRPA"
            >
              <span>🇦🇷</span>
              <span>Patente DNRPA</span>
              {currentView === 'patente' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse inline-block"></span>}
            </button>

            {/* Opción 4: Libreta de Mantenimiento & Services (Reemplaza a Kits) */}
            <button
              onClick={() => onChangeView && onChangeView('libreta')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1.5 border ${
                currentView === 'libreta'
                  ? 'bg-white text-blue-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.04]'
                  : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40 shadow-xs hover:scale-[1.02]'
              }`}
              title="Libreta de Service: Anotar y consultar qué le hiciste y qué le falta a tu auto"
            >
              <span>📒</span>
              <span>Libreta</span>
              {currentView === 'libreta' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block"></span>}
            </button>

            {/* Opción 5: Guantera Digital (Alertas de Vencimientos Mendoza) */}
            <button
              onClick={() => onChangeView && onChangeView('guantera')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1.5 border ${
                currentView === 'guantera'
                  ? 'bg-white text-blue-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.04]'
                  : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40 shadow-xs hover:scale-[1.02]'
              }`}
              title="Guantera Digital: Vencimiento de RTO Mendoza, Seguro, Carnet y Oblea GNC"
            >
              <span>📂</span>
              <span>Guantera</span>
              {currentView === 'guantera' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse inline-block"></span>}
            </button>

            {/* Opción 6: Mapa de Mostradores Mendoza */}
            <button
              onClick={() => onChangeView && onChangeView('mapa')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1.5 border ${
                currentView === 'mapa'
                  ? 'bg-white text-blue-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.04]'
                  : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40 shadow-xs hover:scale-[1.02]'
              }`}
              title="Mapa de Mostradores: Polos Warnes CABA, Rodríguez Peña Mendoza, Córdoba, Rosario y todo el país"
            >
              <span>📍</span>
              <span>Mapa Nacional</span>
              {currentView === 'mapa' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>}
            </button>

            {/* Opción 7: Armar Kit de Repuestos Especializados por Marca */}
            <button
              onClick={() => onChangeView && onChangeView('kits')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1.5 border ${
                currentView === 'kits'
                  ? 'bg-white text-blue-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.04]'
                  : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40 shadow-xs hover:scale-[1.02]'
              }`}
              title="Armar Kit de repuestos a medida y cotizar por WhatsApp con la casa especializada en tu marca"
            >
              <span>📦</span>
              <span>Armar Kit</span>
              {currentView === 'kits' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block"></span>}
            </button>
          </div>



        </div>
      </div>
    </header>
  );
}
