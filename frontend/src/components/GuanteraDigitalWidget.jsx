import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  Car,
  Flame,
  Fuel,
  MapPin,
  ExternalLink,
  Edit3,
  Save,
  RotateCcw,
  Info,
  Sparkles,
  Check,
  ChevronRight,
  PhoneCall,
  Bell,
  Sliders,
  HelpCircle
} from 'lucide-react';

// Meses para cronograma oficial de RTO Mendoza según terminación de patente
const RTO_MENDOZA_MONTHS = {
  1: { monthName: 'Enero', monthIndex: 0 },
  2: { monthName: 'Febrero', monthIndex: 1 },
  3: { monthName: 'Marzo', monthIndex: 2 },
  4: { monthName: 'Abril', monthIndex: 3 },
  5: { monthName: 'Mayo', monthIndex: 4 },
  6: { monthName: 'Junio', monthIndex: 5 },
  7: { monthName: 'Julio', monthIndex: 6 },
  8: { monthName: 'Agosto', monthIndex: 7 },
  9: { monthName: 'Septiembre', monthIndex: 8 },
  0: { monthName: 'Octubre', monthIndex: 9 }
};

// Compañías de seguro más comunes en Mendoza
const COMMON_INSURERS = [
  'Triunfo Seguros Mendoza',
  'La Segunda',
  'San Cristóbal',
  'Mercantil Andina',
  'Federación Patronal',
  'Rivadavia Seguros',
  'Sancor Seguros',
  'Allianz',
  'Zurich',
  'Mapfre',
  'Otra compañía'
];

export function GuanteraDigitalWidget({
  vehicle,
  onOpenPatenteModal,
  onNavigateCotizador,
  onNavigateMantenimiento
}) {
  const currentPatente = vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP';
  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';
  const vehicleYear = parseInt(vehicle?.year || vehicle?.data?.year || 2019, 10);

  // Extraer el último dígito numérico de la patente (ej. "AD 192 OP" -> 2; "AA 123 BB" -> 3; "AAA 123" -> 3)
  const lastPlateDigit = useMemo(() => {
    const digitsOnly = currentPatente.replace(/\D/g, '');
    if (!digitsOnly) return 1;
    return parseInt(digitsOnly[digitsOnly.length - 1], 10);
  }, [currentPatente]);

  const storageKey = `dinacity_guantera_${currentPatente.replace(/\s+/g, '').toUpperCase()}`;

  // Estado de los documentos de la Guantera
  const [docs, setDocs] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Fechas iniciales inteligentes basadas en el año y terminación
    const currentYear = new Date().getFullYear();
    const rtoInfo = RTO_MENDOZA_MONTHS[lastPlateDigit] || { monthName: 'Octubre', monthIndex: 9 };
    
    // Si el auto tiene menos de 3 años, está exento por 0km
    const isExempt0km = (currentYear - vehicleYear) < 3;

    // Fecha RTO estimada: mes correspondiente del año actual o próximo
    const rtoDate = new Date(currentYear, rtoInfo.monthIndex, 28);
    if (rtoDate < new Date()) {
      rtoDate.setFullYear(currentYear + 1);
    }

    // Seguro: fin de este mes
    const seguroDate = new Date();
    seguroDate.setDate(seguroDate.getDate() + 20);

    // Carnet: 2 años adelante
    const carnetDate = new Date();
    carnetDate.setFullYear(currentYear + 2);

    // Matafuegos: 8 meses adelante
    const matafuegoDate = new Date();
    matafuegoDate.setMonth(matafuegoDate.getMonth() + 8);

    // GNC oblea: 6 meses adelante
    const gncDate = new Date();
    gncDate.setMonth(gncDate.getMonth() + 6);

    const gncHidraulicaDate = new Date();
    gncHidraulicaDate.setFullYear(currentYear + 3);

    return {
      hasGnc: false,
      isExempt0km,
      rto: {
        lastInspectionDate: '',
        expirationDate: rtoDate.toISOString().split('T')[0],
        workshopName: 'Taller RTO Habilitado Mendoza',
        notes: ''
      },
      seguro: {
        insurer: 'Triunfo Seguros Mendoza',
        policyNumber: '7412-88549',
        expirationDate: seguroDate.toISOString().split('T')[0],
        assistancePhone: '0810-333-3455',
        notes: 'Cobertura Terceros Completo con Grúa'
      },
      carnet: {
        holderName: 'Titular Registrado',
        expirationDate: carnetDate.toISOString().split('T')[0],
        municipio: 'Guaymallén / Godoy Cruz',
        category: 'B1 (Autos y utilitarios hasta 3500kg)'
      },
      matafuego: {
        expirationDate: matafuegoDate.toISOString().split('T')[0],
        capacity: '1 kg Polvo ABC con manómetro',
        chargedAt: 'Mendoza Matafuegos Habilitado'
      },
      gnc: {
        obleaExpirationDate: gncDate.toISOString().split('T')[0],
        cylinderHydraulicExpirationDate: gncHidraulicaDate.toISOString().split('T')[0],
        tallerGnc: 'Taller Montaje GNC Gran Mendoza'
      }
    };
  });

  const [editingSection, setEditingSection] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  // Guardar en localStorage cada vez que cambien los datos
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(docs));
    } catch (e) {}
  }, [docs, storageKey]);

  // Función para calcular días restantes y status
  const calculateDaysRemaining = (dateString) => {
    if (!dateString) return { days: null, status: 'unknown', label: 'Sin fecha cargada' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: diffDays, status: 'expired', label: `Vencido hace ${Math.abs(diffDays)} días` };
    }
    if (diffDays === 0) {
      return { days: 0, status: 'urgent', label: '¡Vence HOY!' };
    }
    if (diffDays <= 15) {
      return { days: diffDays, status: 'urgent', label: `Vence en ${diffDays} días (Urgente)` };
    }
    if (diffDays <= 45) {
      return { days: diffDays, status: 'warning', label: `Vence en ${diffDays} días` };
    }
    return { days: diffDays, status: 'ok', label: `Al día (${diffDays} días restantes)` };
  };

  // Status de cada sección
  const rtoStatus = calculateDaysRemaining(docs.rto.expirationDate);
  const seguroStatus = calculateDaysRemaining(docs.seguro.expirationDate);
  const carnetStatus = calculateDaysRemaining(docs.carnet.expirationDate);
  const matafuegoStatus = calculateDaysRemaining(docs.matafuego.expirationDate);
  const gncObleaStatus = docs.hasGnc ? calculateDaysRemaining(docs.gnc.obleaExpirationDate) : { status: 'ok' };
  const gncHidraulicaStatus = docs.hasGnc ? calculateDaysRemaining(docs.gnc.cylinderHydraulicExpirationDate) : { status: 'ok' };

  // Resumen general de "Salud de la Guantera" (Score de Legalidad Vial)
  const healthScore = useMemo(() => {
    const list = [rtoStatus, seguroStatus, carnetStatus, matafuegoStatus];
    if (docs.hasGnc) {
      list.push(gncObleaStatus);
      list.push(gncHidraulicaStatus);
    }
    const hasExpired = list.some((item) => item.status === 'expired');
    const hasUrgent = list.some((item) => item.status === 'urgent');
    const hasWarning = list.some((item) => item.status === 'warning');

    if (hasExpired) return { score: 'critico', title: '¡Documentación Vencida!', desc: 'Riesgo de retención de vehículo en controles de la Policía Vial de Mendoza.', color: 'red' };
    if (hasUrgent) return { score: 'atencion', title: 'Atención: Vence Próximamente', desc: 'Tenés trámites obligatorios que vencen en menos de 15 días.', color: 'amber' };
    if (hasWarning) return { score: 'moderado', title: 'Todo en Regla (con alertas)', desc: 'Tenés renovaciones programadas para el próximo mes.', color: 'yellow' };
    return { score: 'perfecto', title: 'Guantera 100% al Día', desc: 'Toda la documentación legal de tu vehículo está vigente en Mendoza.', color: 'emerald' };
  }, [rtoStatus, seguroStatus, carnetStatus, matafuegoStatus, gncObleaStatus, gncHidraulicaStatus, docs.hasGnc]);

  const handleUpdate = (section, key, value) => {
    setDocs((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveAndNotify = () => {
    setEditingSection(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const rtoCronograma = RTO_MENDOZA_MONTHS[lastPlateDigit] || { monthName: 'Octubre' };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal de la Guantera Digital Mendoza */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-indigo-500/30">
        
        {/* Glow de fondo */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500 text-white shadow-sm flex items-center gap-1.5">
                <span>📂</span> Guantera Digital DinAcitY
              </span>
              <span className="text-xs font-bold text-blue-200 bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                📍 Ley de Tránsito 9024 • Mendoza
              </span>
              <span className="text-xs font-bold text-emerald-200 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                ✓ Guardado automático en tu teléfono
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Alertas de Vencimientos y Documentación de tu Auto
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Controlá en segundos el estado de la <strong>RTO Mendoza, Seguro, Carnet, Matafuegos y Oblea de GNC</strong>. Evitá multas y secuestros en los controles policiales de la provincia.
            </p>
          </div>

          {/* Ficha del Vehículo Vinculado */}
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 shrink-0 max-w-md w-full sm:w-auto shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-black uppercase text-sky-400 tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Vehículo Monitoreado
              </span>
              {onOpenPatenteModal && (
                <button
                  type="button"
                  onClick={onOpenPatenteModal}
                  className="text-[11px] text-sky-300 hover:text-white font-bold underline cursor-pointer"
                >
                  Cambiar patente
                </button>
              )}
            </div>

            <p className="font-black text-base sm:text-lg text-white">
              {currentVehicleTitle}
            </p>

            <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-mono bg-blue-900/90 text-white px-2.5 py-0.5 rounded font-black border border-blue-400/50 shadow-xs">
                🇦🇷 {currentPatente}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 text-[11px] font-semibold border border-indigo-500/30">
                Terminación: <strong className="text-white">{lastPlateDigit}</strong> (Le toca: {rtoCronograma.monthName})
              </span>
            </div>
          </div>
        </div>

        {/* Barra Resumen del Semáforo de Legalidad */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              healthScore.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              healthScore.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {healthScore.color === 'emerald' ? '🛡️' : healthScore.color === 'red' ? '🚨' : '⚠️'}
            </div>
            <div>
              <span className={`text-xs font-black uppercase tracking-wider block ${
                healthScore.color === 'emerald' ? 'text-emerald-400' :
                healthScore.color === 'red' ? 'text-red-400' :
                'text-amber-400'
              }`}>
                {healthScore.title}
              </span>
              <p className="text-xs text-slate-300 leading-snug">
                {healthScore.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-around bg-slate-950/40 rounded-xl p-3 border border-slate-800">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-bold">RTO</span>
              <span className={`text-xs font-black ${rtoStatus.status === 'ok' ? 'text-emerald-400' : rtoStatus.status === 'expired' ? 'text-red-400' : 'text-amber-400'}`}>
                {rtoStatus.status === 'ok' ? '✓ Al día' : rtoStatus.status === 'expired' ? '✕ Vencida' : '⚠ Próxima'}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Seguro</span>
              <span className={`text-xs font-black ${seguroStatus.status === 'ok' ? 'text-emerald-400' : seguroStatus.status === 'expired' ? 'text-red-400' : 'text-amber-400'}`}>
                {seguroStatus.status === 'ok' ? '✓ Al día' : seguroStatus.status === 'expired' ? '✕ Vencido' : '⚠ Próximo'}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Carnet</span>
              <span className={`text-xs font-black ${carnetStatus.status === 'ok' ? 'text-emerald-400' : carnetStatus.status === 'expired' ? 'text-red-400' : 'text-amber-400'}`}>
                {carnetStatus.status === 'ok' ? '✓ Vigente' : '✕ Vencido'}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Matafuego</span>
              <span className={`text-xs font-black ${matafuegoStatus.status === 'ok' ? 'text-emerald-400' : matafuegoStatus.status === 'expired' ? 'text-red-400' : 'text-amber-400'}`}>
                {matafuegoStatus.status === 'ok' ? '✓ Cargado' : '✕ Vencido'}
              </span>
            </div>
          </div>

          {/* Toggle GNC */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setDocs((p) => ({ ...p, hasGnc: !p.hasGnc }))}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                docs.hasGnc
                  ? 'bg-blue-600/30 text-blue-200 border-blue-400 shadow-md'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Fuel className="w-4 h-4 text-cyan-400" />
              <span>¿Tu auto tiene equipo de GNC?</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${docs.hasGnc ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                {docs.hasGnc ? 'SÍ' : 'NO'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Toast de guardado */}
      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce w-fit mx-auto">
          <Check className="w-4 h-4" />
          <span>¡Datos de la Guantera Digital guardados con éxito en tu dispositivo!</span>
        </div>
      )}

      {/* Grid con las Tarjetas de Vencimientos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* 1. TARJETA RTO MENDOZA */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black border border-blue-500/30">
                🔍
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">RTO Obligatoria Mendoza</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-500/30">
                    Ley 9024
                  </span>
                </div>
                <p className="text-xs text-slate-400">Revisión Técnica Obligatoria Provincial</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingSection(editingSection === 'rto' ? null : 'rto')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-700/60 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingSection === 'rto' ? 'Cerrar' : 'Editar'}</span>
            </button>
          </div>

          {/* Información del Cronograma Mendoza */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mes asignado según patente:</span>
              <span className="font-black text-amber-300">
                {rtoCronograma.monthName} (Terminación {lastPlateDigit})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Antigüedad del modelo ({vehicleYear}):</span>
              <span className="text-slate-200 font-semibold">
                {new Date().getFullYear() - vehicleYear < 3 ? 'Exento por 0km (< 3 años)' : 'Obligatorio anual'}
              </span>
            </div>
          </div>

          {/* Estado de vencimiento */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            rtoStatus.status === 'ok' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
            rtoStatus.status === 'expired' ? 'bg-red-950/50 border-red-500/50 text-red-300' :
            'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold block uppercase tracking-wider">Vencimiento del Certificado</span>
              <span className="text-base font-black block">
                {docs.rto.expirationDate ? new Date(docs.rto.expirationDate + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No especificado'}
              </span>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-900/80 border border-current">
              {rtoStatus.label}
            </span>
          </div>

          {/* Formulario de Edición */}
          {editingSection === 'rto' ? (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-blue-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Fecha de Vencimiento de tu Oblea RTO:
                </label>
                <input
                  type="date"
                  value={docs.rto.expirationDate}
                  onChange={(e) => handleUpdate('rto', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Taller RTO donde la realizaste:
                </label>
                <input
                  type="text"
                  value={docs.rto.workshopName}
                  onChange={(e) => handleUpdate('rto', 'workshopName', e.target.value)}
                  placeholder="Ej: RTO San Martín / RTO Godoy Cruz / El Challao"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveAndNotify}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
              >
                Guardar fecha de RTO
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://rto.mendoza.gov.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Sacar Turno RTO Mendoza ↗</span>
              </a>
              {onNavigateMantenimiento && (
                <button
                  type="button"
                  onClick={onNavigateMantenimiento}
                  className="py-2.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold text-xs transition cursor-pointer"
                  title="Revisar qué le toca al auto antes de ir a la RTO"
                >
                  Chequear auto
                </button>
              )}
            </div>
          )}

          <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong>Documentación para la RTO:</strong> DNI vigente, Cédula Verde o Azul, constancia de seguro al día y matafuegos con carga vigente.
            </span>
          </div>
        </div>

        {/* 2. TARJETA SEGURO AUTOMOTOR */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black border border-indigo-500/30">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Seguro Automotor</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-500/30">
                    Obligatorio para Circular
                  </span>
                </div>
                <p className="text-xs text-slate-400">{docs.seguro.insurer}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingSection(editingSection === 'seguro' ? null : 'seguro')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-700/60 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingSection === 'seguro' ? 'Cerrar' : 'Editar'}</span>
            </button>
          </div>

          {/* Datos de póliza */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Póliza N°:</span>
              <span className="font-mono text-white font-bold">{docs.seguro.policyNumber || 'No especificada'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cobertura:</span>
              <span className="text-slate-200 font-semibold">{docs.seguro.notes || 'Responsabilidad Civil'}</span>
            </div>
          </div>

          {/* Estado de vencimiento */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            seguroStatus.status === 'ok' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
            seguroStatus.status === 'expired' ? 'bg-red-950/50 border-red-500/50 text-red-300' :
            'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold block uppercase tracking-wider">Vencimiento del Pago / Cuota</span>
              <span className="text-base font-black block">
                {docs.seguro.expirationDate ? new Date(docs.seguro.expirationDate + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No especificado'}
              </span>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-900/80 border border-current">
              {seguroStatus.label}
            </span>
          </div>

          {/* Formulario de Edición */}
          {editingSection === 'seguro' ? (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-indigo-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Compañía Aseguradora:
                </label>
                <select
                  value={docs.seguro.insurer}
                  onChange={(e) => handleUpdate('seguro', 'insurer', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {COMMON_INSURERS.map((comp) => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Próximo Vencimiento:
                  </label>
                  <input
                    type="date"
                    value={docs.seguro.expirationDate}
                    onChange={(e) => handleUpdate('seguro', 'expirationDate', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Número de Póliza:
                  </label>
                  <input
                    type="text"
                    value={docs.seguro.policyNumber}
                    onChange={(e) => handleUpdate('seguro', 'policyNumber', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Teléfono de Auxilio / Grúa:
                </label>
                <input
                  type="text"
                  value={docs.seguro.assistancePhone}
                  onChange={(e) => handleUpdate('seguro', 'assistancePhone', e.target.value)}
                  placeholder="Ej: 0800-..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveAndNotify}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
              >
                Guardar datos del Seguro
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              {docs.seguro.assistancePhone && (
                <a
                  href={`tel:${docs.seguro.assistancePhone}`}
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Llamar a Grúa / Auxilio ({docs.seguro.assistancePhone})</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* 3. TARJETA MATAFUEGOS REGLAMENTARIO */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-black border border-red-500/30">
                🧯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Matafuegos del Auto</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/60 text-red-300 border border-red-500/30">
                    Carga Anual Obligatoria
                  </span>
                </div>
                <p className="text-xs text-slate-400">1 kg Polvo ABC con manómetro en verde</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingSection(editingSection === 'matafuego' ? null : 'matafuego')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-700/60 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingSection === 'matafuego' ? 'Cerrar' : 'Editar'}</span>
            </button>
          </div>

          {/* Estado de vencimiento */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            matafuegoStatus.status === 'ok' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
            matafuegoStatus.status === 'expired' ? 'bg-red-950/50 border-red-500/50 text-red-300' :
            'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold block uppercase tracking-wider">Vencimiento de la Carga</span>
              <span className="text-base font-black block">
                {docs.matafuego.expirationDate ? new Date(docs.matafuego.expirationDate + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No especificado'}
              </span>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-900/80 border border-current">
              {matafuegoStatus.label}
            </span>
          </div>

          {/* Formulario de Edición */}
          {editingSection === 'matafuego' ? (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-red-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Fecha de Vencimiento de la Tarjeta DPS:
                </label>
                <input
                  type="date"
                  value={docs.matafuego.expirationDate}
                  onChange={(e) => handleUpdate('matafuego', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveAndNotify}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
              >
                Guardar fecha de matafuegos
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Reglamentación Mendoza:</strong> Debe estar fijado al alcance del conductor (debajo del asiento del acompañante), nunca suelto en el baúl, y con el indicador de aguja en la franja verde.
              </span>
            </div>
          )}
        </div>

        {/* 4. TARJETA LICENCIA DE CONDUCIR */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black border border-cyan-500/30">
                🪪
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Licencia de Conducir</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">
                    Nacional / Municipal
                  </span>
                </div>
                <p className="text-xs text-slate-400">{docs.carnet.holderName} • {docs.carnet.municipio}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingSection(editingSection === 'carnet' ? null : 'carnet')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-700/60 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingSection === 'carnet' ? 'Cerrar' : 'Editar'}</span>
            </button>
          </div>

          {/* Estado de vencimiento */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            carnetStatus.status === 'ok' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
            carnetStatus.status === 'expired' ? 'bg-red-950/50 border-red-500/50 text-red-300' :
            'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold block uppercase tracking-wider">Vencimiento del Carnet</span>
              <span className="text-base font-black block">
                {docs.carnet.expirationDate ? new Date(docs.carnet.expirationDate + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No especificado'}
              </span>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-900/80 border border-current">
              {carnetStatus.label}
            </span>
          </div>

          {/* Formulario de Edición */}
          {editingSection === 'carnet' ? (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-cyan-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Nombre del Titular de la Licencia:
                </label>
                <input
                  type="text"
                  value={docs.carnet.holderName}
                  onChange={(e) => handleUpdate('carnet', 'holderName', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Fecha de Vencimiento:
                  </label>
                  <input
                    type="date"
                    value={docs.carnet.expirationDate}
                    onChange={(e) => handleUpdate('carnet', 'expirationDate', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Municipio emisor:
                  </label>
                  <input
                    type="text"
                    value={docs.carnet.municipio}
                    onChange={(e) => handleUpdate('carnet', 'municipio', e.target.value)}
                    placeholder="Godoy Cruz / Capital / Maipú"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAndNotify}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
              >
                Guardar datos del Carnet
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                En Mendoza podés renovar el carnet hasta 30 días antes del vencimiento. Los turnos se solicitan en el centro emisor de tu departamento.
              </span>
            </div>
          )}
        </div>

      </div>

      {/* 5. TARJETA GNC (CONDICIONAL SI TIENE GNC) */}
      {docs.hasGnc && (
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black border border-cyan-500/40 text-2xl">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">Equipo de GNC (Gas Natural Comprimido)</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900 text-cyan-200 border border-cyan-400/30">
                    Enargas Oficial
                  </span>
                </div>
                <p className="text-xs text-cyan-200/80">Control de Oblea Anual y Prueba Hidráulica de Cilindro en Mendoza</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingSection(editingSection === 'gnc' ? null : 'gnc')}
              className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-cyan-950 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingSection === 'gnc' ? 'Cerrar' : 'Editar fechas'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Oblea Anual */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              gncObleaStatus.status === 'ok' ? 'bg-slate-900/80 border-cyan-500/30' :
              gncObleaStatus.status === 'expired' ? 'bg-red-950/60 border-red-500/50' :
              'bg-amber-950/60 border-amber-500/50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Oblea Enargas (Anual)</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  gncObleaStatus.status === 'ok' ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-200'
                }`}>
                  {gncObleaStatus.label}
                </span>
              </div>
              <p className="text-lg font-black text-white">
                {docs.gnc.obleaExpirationDate ? new Date(docs.gnc.obleaExpirationDate + 'T00:00:00').toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : 'No especificada'}
              </p>
              <p className="text-[11px] text-slate-400">Sin esta oblea al día no te habilitan la carga en estaciones de servicio de Mendoza.</p>
            </div>

            {/* Prueba Hidráulica (Cada 5 años) */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              gncHidraulicaStatus.status === 'ok' ? 'bg-slate-900/80 border-cyan-500/30' :
              gncHidraulicaStatus.status === 'expired' ? 'bg-red-950/60 border-red-500/50' :
              'bg-amber-950/60 border-amber-500/50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Prueba Hidráulica (5 Años)</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  gncHidraulicaStatus.status === 'ok' ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-200'
                }`}>
                  {gncHidraulicaStatus.label}
                </span>
              </div>
              <p className="text-lg font-black text-white">
                {docs.gnc.cylinderHydraulicExpirationDate ? new Date(docs.gnc.cylinderHydraulicExpirationDate + 'T00:00:00').toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : 'No especificada'}
              </p>
              <p className="text-[11px] text-slate-400">Revisión profunda del cilindro y válvula para seguridad bajo alta presión.</p>
            </div>
          </div>

          {/* Formulario de edición GNC */}
          {editingSection === 'gnc' && (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-cyan-500/40 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Vencimiento Oblea Anual GNC:
                  </label>
                  <input
                    type="date"
                    value={docs.gnc.obleaExpirationDate}
                    onChange={(e) => handleUpdate('gnc', 'obleaExpirationDate', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Vencimiento Prueba Hidráulica (Cilindro):
                  </label>
                  <input
                    type="date"
                    value={docs.gnc.cylinderHydraulicExpirationDate}
                    onChange={(e) => handleUpdate('gnc', 'cylinderHydraulicExpirationDate', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveAndNotify}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
              >
                Guardar fechas de GNC
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botones de acción cruzada */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-300 flex items-center gap-2">
          <span>💡</span> ¿Tenés que hacerle algún arreglo al auto antes de renovar la RTO?
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onNavigateCotizador && (
            <button
              type="button"
              onClick={() => onNavigateCotizador()}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>💬</span> Cotizar repuestos en Mendoza
            </button>
          )}
          {onNavigateMantenimiento && (
            <button
              type="button"
              onClick={onNavigateMantenimiento}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>📖</span> Ver Pasaporte de Service
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
