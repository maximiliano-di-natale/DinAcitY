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
  Sparkles,
  ShoppingBag,
  Heart,
  ThermometerSnowflake,
  Disc,
  Gauge,
  Cog,
  Activity,
  BatteryCharging,
  Droplets,
  Zap,
  Shield
} from 'lucide-react';

export function Navbar({
  user,
  onOpenAuth,
  onLogout,
  onOpenAlerts,
  onSearch,
  currentQuery
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [navSearch, setNavSearch] = useState(currentQuery || '');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categoryMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setNavSearch(currentQuery || '');
  }, [currentQuery]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
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
    setIsCategoryMenuOpen(false);
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

  const categoriesList = [
    {
      id: 'frenos',
      name: 'Frenos',
      query: 'Pastillas de freno',
      desc: 'Pastillas, discos ventilados, cintas y bombas',
      icon: Disc
    },
    {
      id: 'refrigeracion',
      name: 'Refrigeración',
      query: 'Radiador de agua',
      desc: 'Radiadores, termostatos, electroventiladores, bombas de agua',
      icon: ThermometerSnowflake
    },
    {
      id: 'motor',
      name: 'Motor y Distribución',
      query: 'Kit distribucion',
      desc: 'Kits de distribución, correas tensoras, bujías y juntas',
      icon: Gauge
    },
    {
      id: 'embragues',
      name: 'Embragues y Transmisión',
      query: 'Kit embrague',
      desc: 'Kits completos (placa, disco y crapodina) y bombines',
      icon: Cog
    },
    {
      id: 'suspension',
      name: 'Suspensión y Dirección',
      query: 'Amortiguadores',
      desc: 'Amortiguadores delanteros/traseros, extremos y rótulas',
      icon: Activity
    },
    {
      id: 'baterias',
      name: 'Baterías y Encendido',
      query: 'Bateria',
      desc: 'Baterías 12V (Moura, Willard), bobinas de encendido',
      icon: BatteryCharging
    },
    {
      id: 'filtros',
      name: 'Filtros y Lubricantes',
      query: 'Filtro de aceite',
      desc: 'Filtros de aceite, aire, nafta, habitáculo y aceites',
      icon: Droplets
    },
    {
      id: 'electricidad',
      name: 'Electricidad e Iluminación',
      query: 'Optica delantera',
      desc: 'Ópticas, alternadores, motores de arranque y faros',
      icon: Zap
    },
    {
      id: 'carroceria',
      name: 'Carrocería y Accesorios',
      query: 'Paragolpe delantero',
      desc: 'Paragolpes, espejos retrovisores, parrillas y guardabarros',
      icon: Shield
    }
  ];

  const quickLinks = [
    { label: 'Frenos', query: 'Pastillas de freno' },
    { label: 'Refrigeración', query: 'Radiador' },
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

      {/* Sub-Header Row (Mercado Libre Line 2 - Identical to user photo) */}
      <div className="bg-red-700 border-t border-red-500/30 text-xs text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3 overflow-x-auto">
          
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
                  <span className="font-semibold text-white block max-w-[170px] sm:max-w-[220px] truncate" title={user.direccion}>
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

          {/* Center: "Categorías ⌵" Dropdown + Horizontal Quick Links */}
          <div className="flex items-center gap-1 sm:gap-2.5 text-xs shrink-0">
            
            {/* Categorías Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-800/80 hover:bg-red-800 text-white font-bold transition border border-red-500/30 shadow-xs"
              >
                <span>Categorías</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categorías Floating Menu */}
              {isCategoryMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-bold">
                    <span>Repuestos Automotores en Mendoza</span>
                    <span className="text-red-600 text-[10px] font-black uppercase">Mercado Libre / Casas MZA</span>
                  </div>

                  <div className="py-1 max-h-96 overflow-y-auto">
                    {categoriesList.map((cat) => {
                      const IconComponent = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.query)}
                          className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-start gap-2.5 transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-red-600 group-hover:text-white text-gray-700 transition mt-0.5">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-gray-900 group-hover:text-red-600">
                              {cat.name}
                            </span>
                            <span className="block text-[10px] text-gray-500 line-clamp-1">
                              {cat.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Horizontal Quick Links (Frenos, Refrigeración, Motor, etc.) */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-white/90">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleCategoryClick(link.query)}
                  className="px-2 py-1 rounded hover:bg-white/15 text-white whitespace-nowrap transition cursor-pointer font-semibold"
                >
                  {link.label}
                </button>
              ))}
            </div>

          </div>

          {/* Right: Auth Profile / Creá tu cuenta / Ingresá */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
            {user ? (
              /* Authenticated User Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-white/10 transition"
                >
                  {/* Initials Avatar Circle (e.g. MD) */}
                  <div className="w-6 h-6 rounded-full bg-blue-800 text-white font-black text-[10px] flex items-center justify-center border border-white/40 shadow-xs">
                    {getUserInitials()}
                  </div>
                  <span className="font-bold text-white max-w-[100px] sm:max-w-[130px] truncate">
                    {user.nombre}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs font-black text-gray-900">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-blue-700 mt-1 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">{user.direccion}</span>
                      </p>
                    </div>

                    <div className="py-1 text-xs">
                      <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Mi cuenta en DinAcitY</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mis compras y cotizaciones</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer">
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
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions (Creá tu cuenta / Ingresá) */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('register')}
                  className="px-2 sm:px-2.5 py-1 rounded font-bold text-white hover:bg-white/15 transition text-[11px] sm:text-xs"
                >
                  Creá tu cuenta
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="px-2 sm:px-2.5 py-1 rounded font-bold text-white hover:bg-white/15 transition text-[11px] sm:text-xs"
                >
                  Ingresá
                </button>
              </div>
            )}

            {/* Mis Compras Link */}
            <span className="hidden sm:inline-block text-white/90 hover:text-white cursor-pointer font-semibold text-[11px]">
              Mis compras
            </span>

            {/* Notification Bell Badge (Mercado Libre style with 6) */}
            <button
              type="button"
              onClick={onOpenAlerts}
              className="relative p-1 text-white hover:text-yellow-200 transition"
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
    </header>
  );
}
