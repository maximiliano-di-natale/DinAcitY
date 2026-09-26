import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Trash2 } from 'lucide-react';

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

  const handleSaveAlert = async (e) => {
    e.preventDefault();
    if (!email || !partName) return;

    try {
      const token = localStorage.getItem('dinacity_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          partQuery: partName,
          vehicleBrand: currentSearch?.brand || '',
          vehicleModel: currentSearch?.model || '',
          vehicleYear: currentSearch?.year || '',
          targetPrice: targetPrice ? Number(targetPrice) : null
        })
      });
      const data = await res.json();

      const newAlert = {
        id: data.alert?.id || Date.now(),
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
    } catch (err) {
      console.error('Error guardando alerta en base de datos:', err);
    }
  };

  const handleDeleteAlert = (id) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('dinacity_alerts', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-2xl p-6 overflow-hidden z-10 text-gray-800">
        <div className="flex items-start justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Alertas de Bajada de Precio</h2>
              <p className="text-xs text-gray-500">Te avisamos al instante cuando baje en Mendoza</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario de nueva alerta */}
        <form onSubmit={handleSaveAlert} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Repuesto a vigilar
            </label>
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-800 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Precio deseado ($ ARS)
              </label>
              <input
                type="number"
                placeholder="Ej: 80000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tu Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-md shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            <span>Crear Alerta de Precio</span>
          </button>

          {savedSuccess && (
            <div className="p-2 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>¡Alerta creada con éxito! Te notificaremos de inmediato.</span>
            </div>
          )}
        </form>

        {/* Alertas activas */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Tus Alertas Activas ({alerts.length})
          </span>
          {alerts.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No tienes alertas guardadas aún.</p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-2 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-800 block">{al.partName}</span>
                    <span className="text-[11px] text-gray-500">
                      {al.vehicle} • {al.targetPrice ? `Hasta $${al.targetPrice.toLocaleString()}` : 'Cualquier baja'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(al.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition"
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
