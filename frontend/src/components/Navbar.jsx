import React, { useState, useEffect } from 'react';
import { Car, Bell, Download, MapPin } from 'lucide-react';

export function Navbar({ onOpenAlerts }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl tracking-tighter">
            <Car className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Din<span className="text-orange-500">AcitY</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full shadow-sm">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span>Mendoza</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden xs:block">
              Comparador de repuestos en Casas de Repuestos, Marketplace y Mercado Libre Mendoza
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Quick Vehicle Type Pills */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-xs font-medium text-slate-300 border border-slate-700/60">
            <span className="px-2.5 py-1 rounded bg-slate-700/60 text-white font-semibold">🚗 Autos</span>
            <span className="px-2.5 py-1">🏍️ Motos</span>
            <span className="px-2.5 py-1">🚛 Camiones</span>
          </div>

          {/* Price Alert Button */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Crear alerta de precio en Mendoza"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Alertas</span>
          </button>

          {/* Install PWA Button */}
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 transition transform active:scale-95"
            title="Instalar en celular o computadora"
          >
            <Download className="w-4 h-4" />
            <span>Instalar App</span>
          </button>

        </div>
      </div>
    </header>
  );
}
