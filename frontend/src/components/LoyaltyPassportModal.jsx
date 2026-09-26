import React, { useState, useEffect } from 'react';
import { X, Award, Sparkles, Compass, Gift, Check, Copy, ChevronRight, ShieldCheck, Zap, Wrench, Clock } from 'lucide-react';

export function LoyaltyPassportModal({ isOpen, onClose, token, user, onOpenAuth }) {
  const [profile, setProfile] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLoyalty();
    }
  }, [isOpen, token]);

  const fetchLoyalty = async () => {
    setLoading(true);
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/loyalty/profile', { headers });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Error obteniendo perfil de pasaporte:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (!isOpen) return null;

  const tier = profile?.loyaltyTier || 'Bronce';
  const km = profile?.loyaltyKm || 150;
  const userName = profile?.userName || (user ? `${user.nombre} ${user.apellido}` : 'Conductor DinAcitY');

  const getTierStyles = (t) => {
    if (t === 'Oro') {
      return {
        bg: 'from-amber-500 via-amber-600 to-yellow-600',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        text: 'text-amber-500',
        title: 'Nivel Oro VIP'
      };
    }
    if (t === 'Plata') {
      return {
        bg: 'from-slate-400 via-slate-500 to-zinc-600',
        badge: 'bg-slate-100 text-slate-900 border-slate-300',
        text: 'text-slate-500',
        title: 'Nivel Plata'
      };
    }
    return {
      bg: 'from-amber-700 via-amber-800 to-stone-800',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      text: 'text-amber-700',
      title: 'Nivel Bronce'
    };
  };

  const tierStyle = getTierStyles(tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-red-700 shadow-xs">
                  Club Kilómetros
                </span>
                <span className="text-[11px] font-bold text-red-100">
                  Programa de Fidelidad DinAcitY
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                Pasaporte DinAcitY Mendoza
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Tarjeta Digital de Pasaporte */}
          <div className={`rounded-2xl p-5 sm:p-6 text-white bg-gradient-to-r ${tierStyle.bg} shadow-lg relative overflow-hidden`}>
            {/* Watermark Logo */}
            <div className="absolute -right-6 -bottom-6 opacity-15 select-none pointer-events-none font-black text-8xl tracking-tighter">
              KM
            </div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block">
                  Pasaporte DinAcitY
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {userName}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${tierStyle.badge}`}>
                ★ {tierStyle.title}
              </span>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2 border-t border-white/20">
              <div>
                <span className="text-[10px] font-bold text-white/80 uppercase block">Saldo Disponible</span>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
                  <span>{km.toLocaleString('es-AR')}</span>
                  <span className="text-sm font-bold text-white/80">KM</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-white/70 block font-mono">
                  ID: DINA-MZA-{profile?.userId || 'GUEST-772'}
                </span>
                <span className="text-[11px] text-white/90 font-semibold flex items-center gap-1 sm:justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  Mendoza, Argentina
                </span>
              </div>
            </div>
          </div>

          {/* Not Logged In Notice */}
          {!user && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-amber-900">
                <strong>¿Querés guardar tus Kilómetros y canjear cupones?</strong> Creá tu cuenta segura en DinAcitY para no perder tus puntos acumulados.
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth && onOpenAuth();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition shrink-0 whitespace-nowrap"
              >
                Crear Cuenta / Ingresar
              </button>
            </div>
          )}

          {/* Progress to Next Tier */}
          {profile && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">
                  Progreso al próximo nivel: <strong className="text-gray-900">{profile.nextTier}</strong>
                </span>
                <span className="font-bold text-red-600">
                  {profile.kmToNextTier > 0 ? `Faltan ${profile.kmToNextTier} KM` : '¡Nivel Máximo alcanzado!'}
                </span>
              </div>

              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${profile.progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Bronce (0 KM)</span>
                <span>Plata (500 KM)</span>
                <span>Oro (1.500 KM)</span>
              </div>
            </div>
          )}

          {/* Beneficios de tu Nivel */}
          {profile?.benefits && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Beneficios de tu Nivel {tier}:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profile.benefits.map((b, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-red-50/50 border border-red-200/70 text-xs text-red-950 flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cupones Canjeables en Mendoza */}
          {profile?.availableVouchers && profile.availableVouchers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Cupones y Vouchers en Comercios de Mendoza:</span>
              </h4>

              <div className="space-y-2">
                {profile.availableVouchers.map((vouch) => (
                  <div
                    key={vouch.id}
                    className="p-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-emerald-950">
                          {vouch.title}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-black bg-emerald-200 text-emerald-900">
                          {vouch.discount || 'Beneficio'}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-800 block mt-0.5">
                        Válido en: <strong>{vouch.store}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-1 bg-white rounded border border-emerald-300 text-emerald-800">
                        {vouch.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(vouch.code)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1"
                      >
                        {copiedCode === vouch.code ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cómo Sumar Kilómetros */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>¿Cómo sumar más Kilómetros en DinAcitY?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-gray-200 flex flex-col justify-between">
                <div>
                  <span className="font-black text-red-600 block text-sm">+50 KM</span>
                  <span className="font-bold text-gray-800">Por Búsqueda</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Comparando precios de repuestos para tu auto.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-gray-200 flex flex-col justify-between">
                <div>
                  <span className="font-black text-emerald-600 block text-sm">+100 KM</span>
                  <span className="font-bold text-gray-800">Por Cotización</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Al consultar por WhatsApp o cotizar un kit completo.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-gray-200 flex flex-col justify-between">
                <div>
                  <span className="font-black text-blue-600 block text-sm">+250 KM</span>
                  <span className="font-bold text-gray-800">Por Turno en Taller</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Al agendar colocación en un taller mecánico asociado.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>✈️ Pasaporte DinAcitY: tus repuestos acumulan kilómetros y beneficios en Mendoza</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
