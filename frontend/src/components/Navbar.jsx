import React, { useState, useEffect } from 'react';
import { Car, Bell, Download, MapPin, Search, ShieldCheck } from 'lucide-react';

export function Navbar({ onOpenAlerts, onSearch, currentQuery }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [navSearch, setNavSearch] = useState(currentQuery || '');

  useEffect(() => {
    setNavSearch(currentQuery || '');
  }, [currentQuery]);

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
    e.preventDefault();
    if (onSearch) {
      onSearch({ query: navSearch });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-red-600 via-red-600 to-red-700 shadow-md">
      {/* Top Main Bar (Mercado Libre Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo DinAcitY (Rojo y Azul) */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-700 border-2 border-white flex items-center justify-center shadow-md text-white font-black text-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-900 bg-white px-2 py-0.5 rounded-lg shadow-sm">
                  Din
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow">
                  AcitY
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider bg-blue-900 text-white border border-blue-400 rounded-full shadow-sm ml-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  Mendoza
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Search Bar (Mercado Libre format) */}
          <form
            onSubmit={handleNavSubmit}
            className="flex-1 max-w-2xl relative flex items-center"
          >
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Buscar repuestos, marcas o autos en Mendoza (ej: radiador, gol, hilux, pastillas)..."
              className="w-full bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm pl-4 pr-12 py-2.5 sm:py-2.5 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition flex items-center justify-center"
              title="Buscar en Mendoza"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Price Alert Button */}
            <button
              onClick={onOpenAlerts}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-md bg-red-700 hover:bg-red-800 text-white border border-red-500/40 transition shadow-sm"
              title="Crear alerta de precio en Mendoza"
            >
              <Bell className="w-4 h-4 text-yellow-300" />
              <span className="hidden sm:inline">Alertas</span>
            </button>

            {/* Install PWA Button */}
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-black rounded-md bg-white hover:bg-gray-100 text-red-600 border border-white shadow-sm transition transform active:scale-95"
              title="Instalar en celular o computadora"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span className="hidden xs:inline">Instalar App</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Header Row (Mercado Libre Style with Location & Vehicle pills) */}
      <div className="bg-red-700/80 border-t border-red-500/30 text-xs text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-blue-200" />
            <span className="font-semibold text-white">
              Ubicación: <span className="text-yellow-200">Mendoza (Carril Rodríguez Peña, Godoy Cruz, Guaymallén)</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] font-bold">
            <span className="bg-white/15 px-2 py-0.5 rounded text-white hover:bg-white/25 cursor-pointer">
              🚗 Autos y Utilitarios
            </span>
            <span className="bg-white/15 px-2 py-0.5 rounded text-white hover:bg-white/25 cursor-pointer">
              🏍️ Motos
            </span>
            <span className="bg-white/15 px-2 py-0.5 rounded text-white hover:bg-white/25 cursor-pointer">
              🚛 Camiones
            </span>
            <span className="text-yellow-300 hidden md:inline">
              ✓ Precios del más barato al más caro
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
