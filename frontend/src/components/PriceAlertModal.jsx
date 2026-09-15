import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Trash2, ShieldCheck, Mail } from 'lucide-react';

export function PriceAlertModal({ isOpen, onClose, currentSearch }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [partName, setPartName] = useState(currentSearch?.query || 'Radiador');
  const [alerts, setAlerts] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dinacity_alerts');
    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const handleSaveAlert = (e) => {
    e.preventDefault();
    if (!email || !partName) return;

    const newAlert = {
      id: Date.now(),
      partName,
      vehicle: `${currentSearch?.brand || ''} ${currentSearch?.model || ''}`.trim() || 'Cualquier vehículo',
      targetPrice: targetPrice ? Number(targetPrice) : null,
      email,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    localStorage.setItem('dinacity_alerts', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setEmail('');
    setTargetPrice('');
  };

  const handleDeleteAlert = (id) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('dinacity_alerts', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden z-10">
        <div className="flex items-start justify-between pb-3 border-b border-slate-750">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Alertas de Bajada de Precio</h2>
              <p className="text-xs text-slate-400">Te avisamos al instante cuando baje de precio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario de nueva alerta */}
        <form onSubmit={handleSaveAlert} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Repuesto a vigilar
            </label>
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Precio deseado ($ ARS)
              </label>
              <input
                type="number"
                placeholder="Ej: 50000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tu Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            <span>Crear Alerta de Precio</span>
          </button>

          {savedSuccess && (
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>¡Alerta creada con éxito! Te notificaremos de inmediato.</span>
            </div>
          )}
        </form>

        {/* Alertas activas */}
        <div className="mt-5 pt-4 border-t border-slate-750">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Tus Alertas Activas ({alerts.length})
          </span>
          {alerts.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No tienes alertas guardadas aún.</p>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{al.partName}</span>
                    <span className="text-[11px] text-slate-400">
                      {al.vehicle} • {al.targetPrice ? `Hasta $${al.targetPrice.toLocaleString()}` : 'Cualquier baja'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(al.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition"
                    title="Eliminar alerta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
