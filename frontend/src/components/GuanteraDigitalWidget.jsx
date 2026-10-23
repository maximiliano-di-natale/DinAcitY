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
  HelpCircle,
  Download,
  Wrench,
  CheckSquare
} from 'lucide-react';
import { clientFallbackService } from '../services/clientFallbackService.js';

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

// Compañías de seguro más comunes en Mendoza con teléfonos de auxilio
const COMMON_INSURERS = [
  { name: 'Triunfo Seguros Mendoza', phone: '0810-333-3455' },
  { name: 'La Segunda', phone: '0800-444-5224' },
  { name: 'San Cristóbal', phone: '0810-222-8888' },
  { name: 'Mercantil Andina', phone: '0800-777-6372' },
  { name: 'Federación Patronal', phone: '0800-222-0022' },
  { name: 'Rivadavia Seguros', phone: '0800-666-6789' },
  { name: 'Sancor Seguros', phone: '0800-555-2850' },
  { name: 'Allianz', phone: '0810-222-2542' },
  { name: 'Zurich', phone: '0800-333-9874' },
  { name: 'Mapfre', phone: '0800-999-7424' },
  { name: 'Otra compañía', phone: '' }
];

export function GuanteraDigitalWidget({
  vehicle,
  onOpenPatenteModal,
  onNavigateCotizador,
  onNavigateMantenimiento
}) {
  const currentPatente = vehicle?.displayPlate || vehicle?.patente || 'AF 482 QZ';
  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';
  const vehicleYear = parseInt(vehicle?.year || vehicle?.data?.year || 2020, 10);
  const currentKm = vehicle?.currentKm || 60000;

  // Extraer el último dígito numérico de la patente (ej. "AD 192 OP" -> 2; "AA 123 BB" -> 3; "KRX 105" -> 5)
  const lastPlateDigit = useMemo(() => {
    const digitsOnly = currentPatente.replace(/\D/g, '');
    if (!digitsOnly) return 5;
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
        workshopName: 'Taller RTO Godoy Cruz / Rodríguez Peña',
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
        municipio: 'Godoy Cruz / Gran Mendoza',
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
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [saveToast, setSaveToast] = useState('');
  const [showPreRtoChecklist, setShowPreRtoChecklist] = useState(false);

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
    const target = new Date(dateString + 'T00:00:00');
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

    if (hasExpired) return { score: 'critico', title: '¡Documentación Vencida!', desc: 'Riesgo de multa o retención de vehículo en controles viales de Mendoza.', color: 'red' };
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

  const handleInsurerChange = (insurerName) => {
    const found = COMMON_INSURERS.find((i) => i.name === insurerName);
    setDocs((prev) => ({
      ...prev,
      seguro: {
        ...prev.seguro,
        insurer: insurerName,
        assistancePhone: found?.phone || prev.seguro.assistancePhone
      }
    }));
  };

  const handleSaveAndNotify = (msg = '¡Datos de la Guantera guardados con éxito!') => {
    setEditingSection(null);
    setIsWizardOpen(false);
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Sincronizar fecha con Google Calendar
  const handleSyncGoogleCalendar = (title, date, description) => {
    const url = clientFallbackService.generateGoogleCalendarUrl({
      title: `${title} - ${currentVehicleTitle}`,
      description: `${description}\nVehículo: ${currentVehicleTitle}\nPatente: ${currentPatente}`,
      date
    });
    if (url && url !== '#') {
      window.open(url, '_blank');
      setSaveToast('¡Evento abierto en Google Calendar! Guardalo para recibir tu alarma.');
      setTimeout(() => setSaveToast(''), 3500);
    }
  };

  // Descargar archivo .ics para celular o PC
  const handleDownloadIcs = (title, date, description) => {
    clientFallbackService.downloadIcsFile({
      title: `${title} - ${currentVehicleTitle}`,
      description: `${description}\nVehículo: ${currentVehicleTitle}\nPatente: ${currentPatente}`,
      date
    });
    setSaveToast('¡Alarma .ics descargada! Abrila en tu celular para programar el aviso.');
    setTimeout(() => setSaveToast(''), 3500);
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
                ✓ Sincronizable con tu Celular
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Control de Vencimientos y Documentación de tu Auto
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Monitoreá el estado de la <strong>RTO Mendoza, Seguro, Carnet, Matafuegos y GNC</strong>. Guardá tus fechas y <strong>sincronizá alarmas en tu calendario</strong> para que el teléfono te avise antes de que venza.
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
                  Cambiar vehículo
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

            {/* Botón para Configurar Todo el Asistente */}
            <div className="mt-3 pt-2.5 border-t border-slate-700/80">
              <button
                type="button"
                onClick={() => setIsWizardOpen(!isWizardOpen)}
                className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isWizardOpen ? 'Cerrar Asistente' : '⚙️ Configurar Mis Vencimientos en 1 Minuto'}</span>
              </button>
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
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-bounce w-fit mx-auto">
          <Check className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ASISTENTE CONFIGURADOR GUIADO (MODAL / DESPLEGABLE) */}
      {isWizardOpen && (
        <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white">
                Configurador Rápido
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                Completá tus 4 fechas clave para activar recordatorios
              </h3>
              <p className="text-xs text-slate-300">
                Guardá tus fechas una sola vez y DinAcitY te alertará cuando se acerque cada vencimiento en Mendoza.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWizardOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1"
            >
              ✕ Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* 1. RTO */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-500/40 space-y-2">
              <span className="font-black text-blue-400 uppercase tracking-wider block">
                1. RTO Mendoza (Ley 9024)
              </span>
              <p className="text-slate-400 text-[11px]">
                Mes sugerido: <strong>{rtoCronograma.monthName}</strong>
              </p>
              <div>
                <label className="block text-slate-300 mb-1 text-[11px]">Fecha vencimiento oblea:</label>
                <input
                  type="date"
                  value={docs.rto.expirationDate}
                  onChange={(e) => handleUpdate('rto', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* 2. Seguro */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/40 space-y-2">
              <span className="font-black text-indigo-400 uppercase tracking-wider block">
                2. Seguro Automotor
              </span>
              <div>
                <label className="block text-slate-300 mb-1 text-[11px]">Aseguradora:</label>
                <select
                  value={docs.seguro.insurer}
                  onChange={(e) => handleInsurerChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                >
                  {COMMON_INSURERS.map((ins) => (
                    <option key={ins.name} value={ins.name}>{ins.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 text-[11px]">Vencimiento cuota / póliza:</label>
                <input
                  type="date"
                  value={docs.seguro.expirationDate}
                  onChange={(e) => handleUpdate('seguro', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* 3. Carnet */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/40 space-y-2">
              <span className="font-black text-cyan-400 uppercase tracking-wider block">
                3. Licencia de Conducir
              </span>
              <div>
                <label className="block text-slate-300 mb-1 text-[11px]">Municipio emisor:</label>
                <input
                  type="text"
                  value={docs.carnet.municipio}
                  onChange={(e) => handleUpdate('carnet', 'municipio', e.target.value)}
                  placeholder="Godoy Cruz / Capital / Guaymallén"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 text-[11px]">Vencimiento carnet:</label>
                <input
                  type="date"
                  value={docs.carnet.expirationDate}
                  onChange={(e) => handleUpdate('carnet', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* 4. Matafuego */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-red-500/40 space-y-2">
              <span className="font-black text-red-400 uppercase tracking-wider block">
                4. Matafuegos Reglamentario
              </span>
              <p className="text-slate-400 text-[11px]">
                Carga anual obligatoria (1 kg Polvo ABC)
              </p>
              <div>
                <label className="block text-slate-300 mb-1 text-[11px]">Vencimiento carga anual:</label>
                <input
                  type="date"
                  value={docs.matafuego.expirationDate}
                  onChange={(e) => handleUpdate('matafuego', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs"
                />
              </div>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveAndNotify('¡Todas tus fechas fueron actualizadas!')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Todo y Aplicar Alertas</span>
            </button>
          </div>
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
              <span>{editingSection === 'rto' ? 'Cerrar' : 'Editar fecha'}</span>
            </button>
          </div>

          {/* Información del Cronograma Mendoza */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mes asignado según terminación ({lastPlateDigit}):</span>
              <span className="font-black text-amber-300">
                {rtoCronograma.monthName}
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

          {/* Formulario de Edición RTO */}
          {editingSection === 'rto' && (
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
              <button
                type="button"
                onClick={() => handleSaveAndNotify('¡Fecha de RTO guardada!')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer"
              >
                Guardar fecha de RTO
              </button>
            </div>
          )}

          {/* Botones de Acción: Recordar en Celular y Sacar Turno */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => handleSyncGoogleCalendar(
                'Renovar RTO Mendoza',
                docs.rto.expirationDate,
                `Vencimiento de Revisión Técnica Obligatoria Ley 9024 para ${currentVehicleTitle}. Evitá multas policiales.`
              )}
              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="Crear recordatorio en Google Calendar"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>📅 Recordar en Google Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadIcs(
                'Vence RTO Mendoza',
                docs.rto.expirationDate,
                `Recordatorio RTO para ${currentVehicleTitle}. Revisar frenos y luces.`
              )}
              className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
              title="Descargar alarma .ics para iPhone o Android"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Alarma Celular (.ics)</span>
            </button>
          </div>

          {/* Botón de Negocio: Chequeo Pre-RTO */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-blue-500/30 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">🛠️ Chequeo Pre-RTO Mendoza</span>
              <span className="text-slate-400 text-[11px]">Revisá frenos, luces y tren delantero antes de la inspección.</span>
            </div>
            {onNavigateCotizador && (
              <button
                type="button"
                onClick={() => onNavigateCotizador()}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition cursor-pointer shrink-0"
              >
                Cotizar repuestos
              </button>
            )}
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
              <span>{editingSection === 'seguro' ? 'Cerrar' : 'Editar fecha'}</span>
            </button>
          </div>

          {/* Datos de póliza */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Póliza N°:</span>
              <span className="font-mono text-white font-bold">{docs.seguro.policyNumber || '7412-88549'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Compañía:</span>
              <span className="text-slate-200 font-semibold">{docs.seguro.insurer}</span>
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

          {/* Formulario de Edición Seguro */}
          {editingSection === 'seguro' && (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-indigo-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Aseguradora:</label>
                <select
                  value={docs.seguro.insurer}
                  onChange={(e) => handleInsurerChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {COMMON_INSURERS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Próximo Vencimiento:</label>
                <input
                  type="date"
                  value={docs.seguro.expirationDate}
                  onChange={(e) => handleUpdate('seguro', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSaveAndNotify('¡Datos del seguro guardados!')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs transition cursor-pointer"
              >
                Guardar datos del Seguro
              </button>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => handleSyncGoogleCalendar(
                `Pagar Cuota Seguro ${docs.seguro.insurer}`,
                docs.seguro.expirationDate,
                `Vencimiento de cuota de seguro de ${currentVehicleTitle}. Póliza: ${docs.seguro.policyNumber}`
              )}
              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>📅 Recordar Pago en Calendario</span>
            </button>

            {docs.seguro.assistancePhone && (
              <a
                href={`tel:${docs.seguro.assistancePhone}`}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Llamar Grúa</span>
              </a>
            )}
          </div>
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
              <span>{editingSection === 'matafuego' ? 'Cerrar' : 'Editar fecha'}</span>
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

          {/* Formulario de Edición Matafuegos */}
          {editingSection === 'matafuego' && (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-red-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Fecha de Vencimiento de la Tarjeta DPS:
                </label>
                <input
                  type="date"
                  value={docs.matafuego.expirationDate}
                  onChange={(e) => handleUpdate('matafuego', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSaveAndNotify('¡Fecha de matafuegos guardada!')}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs transition cursor-pointer"
              >
                Guardar fecha de matafuegos
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSyncGoogleCalendar(
                'Recargar Matafuegos del Auto',
                docs.matafuego.expirationDate,
                `Vencimiento de recarga de matafuegos para ${currentVehicleTitle}. Exigido en controles viales y RTO Mendoza.`
              )}
              className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>📅 Recordar Recarga en Calendario</span>
            </button>
          </div>
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
              <span>{editingSection === 'carnet' ? 'Cerrar' : 'Editar fecha'}</span>
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

          {/* Formulario de Edición Carnet */}
          {editingSection === 'carnet' && (
            <div className="bg-slate-900/90 rounded-xl p-4 border border-cyan-500/40 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Municipio emisor:</label>
                <input
                  type="text"
                  value={docs.carnet.municipio}
                  onChange={(e) => handleUpdate('carnet', 'municipio', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Fecha de Vencimiento:</label>
                <input
                  type="date"
                  value={docs.carnet.expirationDate}
                  onChange={(e) => handleUpdate('carnet', 'expirationDate', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSaveAndNotify('¡Datos del carnet guardados!')}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs transition cursor-pointer"
              >
                Guardar datos del Carnet
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSyncGoogleCalendar(
                'Renovar Carnet de Conducir',
                docs.carnet.expirationDate,
                `Vencimiento de Licencia de Conducir (${docs.carnet.municipio}). Turnos con 30 días de anticipación.`
              )}
              className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>📅 Recordar Renovación en Calendario</span>
            </button>
          </div>
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
            <div className={`p-4 rounded-xl border space-y-2 ${
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
              <button
                type="button"
                onClick={() => handleSyncGoogleCalendar(
                  'Renovar Oblea GNC Enargas',
                  docs.gnc.obleaExpirationDate,
                  `Renovación de oblea anual de GNC para ${currentVehicleTitle}.`
                )}
                className="w-full py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3 h-3" />
                <span>📅 Recordar Oblea en Calendario</span>
              </button>
            </div>

            {/* Prueba Hidráulica (Cada 5 años) */}
            <div className={`p-4 rounded-xl border space-y-2 ${
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
              <button
                type="button"
                onClick={() => handleSyncGoogleCalendar(
                  'Prueba Hidráulica Tubo GNC (5 Años)',
                  docs.gnc.cylinderHydraulicExpirationDate,
                  `Control de prueba hidráulica y válvula para cilindro GNC en ${currentVehicleTitle}.`
                )}
                className="w-full py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3 h-3" />
                <span>📅 Recordar Prueba Hidráulica</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Acciones Cruzadas con otras Vistas */}
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
