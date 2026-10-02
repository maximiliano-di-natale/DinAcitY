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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const refrigeracionRef = useRef(null);
  const calefaccionRef = useRef(null);
  const userMenuRef = useRef(null);

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
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
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
                  <MapPin className="w-2.5 h-2.5 text-red-400" />
                  Mendoza
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
              placeholder="Buscar repuestos, marcas o autos en Mendoza (ej: radiador, gol, hilux, pastillas)..."
              className="w-full bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm pl-3.5 pr-10 py-2 sm:py-2 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r transition flex items-center justify-center"
              title="Buscar en Mendoza"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* Right Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Price Alert Button */}
            <button
              onClick={onOpenAlerts}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded bg-red-700 hover:bg-red-800 text-white border border-red-500/40 transition shadow-sm"
              title="Crear alerta de precio en Mendoza"
            >
              <Bell className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden md:inline">Alertas</span>
            </button>

            {/* Install PWA Button */}
            <button
              onClick={handleInstallClick}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-black rounded bg-white hover:bg-gray-100 text-red-600 border border-white shadow-sm transition"
              title="Instalar en celular o computadora"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Instalar</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Header Línea 1 (Arriba): Ubicación, Accesos Operativos y Usuario Registrado */}
      <div className="bg-red-700 border-t border-red-500/30 border-b border-red-800/40 text-xs text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none md:overflow-visible">
          
          {/* Left: Location Pin ("Enviar a Maximiliano / Calle San Isidro 2341") */}
          <div
            onClick={() => {
              if (!user && onOpenAuth) {
                onOpenAuth('register');
              }
            }}
            className="flex items-center gap-2 shrink-0 cursor-pointer group hover:opacity-95"
            title={user ? 'Dirección de envío en Mendoza' : 'Registrate para ingresar tu dirección'}
          >
            <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition">
              <MapPin className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="text-[11px] leading-tight text-left">
              {user ? (
                <>
                  <span className="text-red-200 block text-[10px]">
                    Enviar a <span className="text-white font-bold">{user.nombre}</span>
                  </span>
                  <span className="font-semibold text-white block max-w-[150px] sm:max-w-[200px] truncate" title={user.direccion}>
                    {user.direccion}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-red-200 block text-[10px]">Enviar a Mendoza</span>
                  <span className="font-semibold text-white group-hover:underline block">
                    Ingresá tu dirección 📍
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Center: Accesos directos y herramientas */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs shrink-0">
            {/* Opción 1: Cotizador Express Mendoza WhatsApp */}
            <button
              onClick={() => onChangeView && onChangeView('cotizador')}
              className={`px-2 sm:px-2.5 py-1 rounded whitespace-nowrap transition cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-xs border ${
                currentView === 'cotizador'
                  ? 'bg-white text-blue-950 border-white shadow-sm'
                  : 'bg-blue-950/80 hover:bg-blue-900 text-white border-blue-400/40'
              }`}
              title="Pedir cotización de repuestos por WhatsApp en Mendoza"
            >
              <span>💬 Cotizador Express</span>
            </button>

            {/* Opción 2: Libreta de Mantenimiento Inteligente */}
            <button
              onClick={() => onChangeView && onChangeView('mantenimiento')}
              className={`px-2 sm:px-2.5 py-1 rounded whitespace-nowrap transition cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-xs border ${
                currentView === 'mantenimiento'
                  ? 'bg-white text-blue-950 border-white shadow-sm'
                  : 'bg-blue-950/80 hover:bg-blue-900 text-white border-blue-400/40'
              }`}
              title="Ver especificaciones de aceite, fluidos y services por kilometraje"
            >
              <span>📖 Pasaporte Service</span>
            </button>

            {/* Consulta DNRPA Patente */}
            <button
              onClick={() => onChangeView && onChangeView('patente')}
              className={`px-2 sm:px-2.5 py-1 rounded whitespace-nowrap transition cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-xs border ${
                currentView === 'patente'
                  ? 'bg-white text-blue-950 border-white shadow-sm'
                  : 'bg-blue-950/80 hover:bg-blue-900 text-white border-blue-400/40'
              }`}
              title="Buscar vehículo por patente DNRPA"
            >
              <span>🇦🇷 Patente DNRPA</span>
            </button>

            {/* Kits / Paquetes Dinámicos */}
            <button
              onClick={onOpenCombos}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white whitespace-nowrap transition cursor-pointer font-black text-[11px] sm:text-xs flex items-center gap-1 border border-white/30 shadow-xs"
              title="Armar paquetes de repuestos para tu vehículo"
            >
              <Package className="w-3.5 h-3.5 text-yellow-300" />
              <span>Kits</span>
            </button>
          </div>

          {/* Right: Usuario Registrado con Icono, Mis Compras y Notificaciones */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
            {user ? (
              /* Authenticated User Menu con Icono de Usuario Destacado */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-black/25 hover:bg-black/35 border border-white/25 hover:border-white/40 transition group shadow-xs cursor-pointer"
                  title={`Sesión iniciada: ${user.nombre} ${user.apellido || ''}`}
                >
                  {/* Iconito del Usuario Registrado */}
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border border-white/40 shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>

                  <div className="text-left leading-none">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] text-red-200 uppercase tracking-wider font-semibold">Usuario</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" title="Conectado"></span>
                    </div>
                    <span className="font-bold text-xs text-white max-w-[120px] truncate block leading-tight">
                      {user.nombre}
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <User className="w-4 h-4" />
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
                      <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Mi cuenta en DinAcitY</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mis compras y cotizaciones</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium">
                        <Heart className="w-3.5 h-3.5 text-red-600" />
                        <span>Repuestos favoritos</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
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
              /* Guest Actions con Iconito de Usuario */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-[11px] sm:text-xs transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Ingresá</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('register')}
                  className="px-2.5 py-1 rounded-md bg-white text-red-700 hover:bg-gray-100 font-black text-[11px] sm:text-xs shadow-xs transition cursor-pointer"
                >
                  Creá tu cuenta
                </button>
              </div>
            )}

            {/* Mis Compras Link */}
            <span className="hidden sm:inline-block text-white/90 hover:text-white cursor-pointer font-semibold text-[11px]">
              Mis compras
            </span>

            {/* Notification Bell Badge */}
            <button
              type="button"
              onClick={onOpenAlerts}
              className="relative p-1 text-white hover:text-yellow-200 transition cursor-pointer"
              title="Notificaciones de precios en Mendoza"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-blue-900 border border-white text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                6
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Header Línea 2 (Abajo): Categorías de Repuestos completas (con Baterías visible y destacado en tono de rojo más oscuro) */}
      <div className="bg-red-900 border-b border-red-950/70 text-xs text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none md:overflow-visible">
          
          {/* Label de Categorías */}
          <div className="flex items-center gap-1 text-red-200 font-bold text-[11px] uppercase tracking-wider shrink-0 mr-1.5 hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Categorías:</span>
          </div>

          {/* Frenos */}
          <button
            onClick={() => handleCategoryClick('Pastillas de freno')}
            className="px-2 py-1 rounded hover:bg-white/15 text-white whitespace-nowrap transition cursor-pointer font-semibold text-[11px] sm:text-xs shrink-0"
          >
            Frenos
          </button>

          {/* Refrigeración con Menú Desplegable Múltiple */}
          <div className="relative shrink-0" ref={refrigeracionRef}>
            <button
              type="button"
              onClick={() => {
                setIsRefrigeracionOpen(!isRefrigeracionOpen);
                setIsCalefaccionOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold text-[11px] sm:text-xs transition cursor-pointer ${
                isRefrigeracionOpen
                  ? 'bg-white text-red-900 shadow-sm'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <span>Refrigeración</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRefrigeracionOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú Desplegable Múltiple de Refrigeración */}
            {isRefrigeracionOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-bold">
                  <span className="text-blue-900 font-black">Sistema de Refrigeración</span>
                  <span className="text-red-600 text-[10px] font-black uppercase">Mendoza</span>
                </div>

                <div className="py-1">
                  {refrigeracionOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleCategoryClick(opt.query)}
                        className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-start gap-2.5 transition group cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-red-600 group-hover:text-white transition mt-0.5">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-900 group-hover:text-red-600">
                            {opt.name}
                          </span>
                          <span className="block text-[10px] text-gray-500 line-clamp-1">
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-1.5 px-3">
                  <button
                    onClick={() => handleCategoryClick('Refrigeracion')}
                    className="w-full text-center py-1 text-[11px] font-black text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                  >
                    Ver todo en Refrigeración →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Calefacción con Menú Desplegable Múltiple */}
          <div className="relative shrink-0" ref={calefaccionRef}>
            <button
              type="button"
              onClick={() => {
                setIsCalefaccionOpen(!isCalefaccionOpen);
                setIsRefrigeracionOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold text-[11px] sm:text-xs transition cursor-pointer ${
                isCalefaccionOpen
                  ? 'bg-white text-red-900 shadow-sm'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <span>Calefacción</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCalefaccionOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú Desplegable Múltiple de Calefacción */}
            {isCalefaccionOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-bold">
                  <span className="text-red-700 font-black">Sistema de Calefacción</span>
                  <span className="text-red-600 text-[10px] font-black uppercase">Mendoza</span>
                </div>

                <div className="py-1">
                  {calefaccionOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleCategoryClick(opt.query)}
                        className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-start gap-2.5 transition group cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition mt-0.5">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-900 group-hover:text-red-600">
                            {opt.name}
                          </span>
                          <span className="block text-[10px] text-gray-500 line-clamp-1">
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-1.5 px-3">
                  <button
                    onClick={() => handleCategoryClick('Calefaccion')}
                    className="w-full text-center py-1 text-[11px] font-black text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                  >
                    Ver todo en Calefacción →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mangueras */}
          <button
            onClick={() => handleCategoryClick('Mangueras')}
            className="px-2 py-1 rounded hover:bg-white/15 text-white whitespace-nowrap transition cursor-pointer font-semibold text-[11px] sm:text-xs shrink-0"
          >
            Mangueras
          </button>

          {/* Motor */}
          <button
            onClick={() => handleCategoryClick('Kit distribucion')}
            className="px-2 py-1 rounded hover:bg-white/15 text-white whitespace-nowrap transition cursor-pointer font-semibold text-[11px] sm:text-xs shrink-0"
          >
            Motor
          </button>

          {/* Embragues */}
          <button
            onClick={() => handleCategoryClick('Kit embrague')}
            className="px-2 py-1 rounded hover:bg-white/15 text-white whitespace-nowrap transition cursor-pointer font-semibold text-[11px] sm:text-xs shrink-0"
          >
            Embragues
          </button>

          {/* Suspensión */}
          <button
            onClick={() => handleCategoryClick('Amortiguadores')}
            className="px-2 py-1 rounded hover:bg-white/15 text-white whitespace-nowrap transition cursor-pointer font-semibold text-[11px] sm:text-xs shrink-0"
          >
            Suspensión
          </button>

          {/* Baterías - DESTACADO Y 100% VISIBLE */}
          <button
            onClick={() => handleCategoryClick('Bateria 12V')}
            className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white whitespace-nowrap transition cursor-pointer font-bold text-[11px] sm:text-xs shrink-0 flex items-center gap-1 border border-white/20"
            title="Baterías de auto y camioneta 12V"
          >
            <Battery className="w-3.5 h-3.5 text-yellow-300" />
            <span>Baterías</span>
          </button>

          {/* Filtros */}
          <button
            onClick={() => handleCategoryClick('Filtro aceite')}
            className="px-2 py-1 rounded hover:bg-white/15 text-white whitespace-nowrap transition cursor-pointer font-semibold text-[11px] sm:text-xs shrink-0"
          >
            Filtros
          </button>

          {/* Ofertas Mendoza */}
          <button
            onClick={() => handleCategoryClick('Repuestos')}
            className="px-2.5 py-1 rounded bg-yellow-400 text-gray-900 whitespace-nowrap transition cursor-pointer font-black text-[11px] shadow-xs hover:bg-yellow-300 shrink-0 ml-auto sm:ml-0"
          >
            🔥 Ofertas Mendoza
          </button>

        </div>
      </div>
    </header>
  );
}
