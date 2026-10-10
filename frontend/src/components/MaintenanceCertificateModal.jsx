import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Share2,
  X,
  ShieldCheck,
  CheckCircle2,
  Car,
  Calendar,
  Gauge,
  Wrench,
  FileText,
  MapPin,
  Sparkles,
  PhoneCall,
  MessageCircle
} from 'lucide-react';

export function MaintenanceCertificateModal({
  isOpen,
  onClose,
  vehicle,
  currentKm = 62500,
  services = []
}) {
  if (!isOpen) return null;

  const currentPatente = vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP';
  const cleanPatente = currentPatente.replace(/\s+/g, '').toUpperCase();
  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';
  const vehicleYear = vehicle?.year || vehicle?.data?.year || 2019;
  const currentEngine = vehicle?.engine?.name || vehicle?.data?.engine?.name || '1.6 8V MSI Naftero (101 CV)';
  const currentVin = vehicle?.chassis?.vin || vehicle?.data?.chassis?.vin || '8AWZZZ5UZKT048192';
  const currentSeccional = vehicle?.dnrpa?.seccional || vehicle?.data?.dnrpa?.seccional || 'Guaymallén N° 2';

  const todayStr = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const certificateCode = `CERT-MZA-${cleanPatente}-${new Date().getFullYear()}`;

  // Formateador de moneda
  const formatMoney = (val) => {
    if (!val || isNaN(val)) return '-';
    return `$${parseInt(val, 10).toLocaleString('es-AR')}`;
  };

  // Calcular totales
  const totalServices = services.length;
  const totalInvested = services.reduce((acc, s) => acc + (parseInt(s.cost, 10) || 0), 0);

  // Ordenar services por kilometraje descendente
  const sortedServices = [...services].sort((a, b) => (b.km || 0) - (a.km || 0));

  // Próximo cambio estimado
  const nextOilKm = Math.ceil((currentKm + 1000) / 10000) * 10000;
  const nextDistributionKm = Math.ceil((currentKm + 1000) / 60000) * 60000;

  // Imprimir / Guardar en PDF
  const handlePrint = () => {
    window.print();
  };

  // Compartir por WhatsApp
  const handleShareWhatsApp = () => {
    const text = [
      `🚗 *PASAPORTE DE MANTENIMIENTO DINACITY MENDOZA*`,
      `📄 *Certificado N°:* ${certificateCode}`,
      `🇦🇷 *Vehículo:* ${currentVehicleTitle}`,
      `🔑 *Patente:* ${currentPatente}`,
      `⚙️ *Motor:* ${currentEngine}`,
      `🛣️ *Kilometraje actual:* ${currentKm.toLocaleString('es-AR')} km`,
      `📋 *Services documentados:* ${totalServices} intervenciones registradas`,
      `💰 *Inversión total en mantenimiento:* ${formatMoney(totalInvested)}`,
      ``,
      `✅ Historial con services oficiales al día listo para transferir o consultar en DinAcitY Mendoza.`
    ].join('\n');

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      
      {/* Contenedor Modal */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:w-full print:m-0 print:p-0">
        
        {/* Barra superior de herramientas (se oculta al imprimir) */}
        <div className="bg-slate-800/95 border-b border-slate-700 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Pasaporte & Certificado Oficial en PDF
              </h3>
              <p className="text-[11px] text-slate-300">
                Documento de historial verificado para transferir o presentar al comprador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              title="Descargar en PDF o imprimir en hoja A4"
            >
              <Printer className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Guardar como PDF / Imprimir</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              title="Compartir resumen por WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Compartir WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition cursor-pointer"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ÁREA IMPRIMIBLE DEL CERTIFICADO (A4 PROFESIONAL)                          */}
        {/* ========================================================================= */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          
          <div
            id="printable-certificate"
            className="w-full max-w-[800px] bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-2xl border-4 border-[#1e3a6a] space-y-6 print:border-2 print:shadow-none print:p-4 print:max-w-none print:w-full print:rounded-none"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
          >

            {/* Cabecera Oficial del Documento */}
            <div className="border-b-2 border-[#1e3a6a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[#1e3a6a] text-white flex items-center justify-center font-black text-lg shadow-md">
                    D
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1e3a6a] tracking-tight leading-none">
                      DinAcitY <span className="text-red-600">MENDOZA</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Pasaporte Automotor & Registro Digital de Mantenimiento
                    </p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  Certificado emitido para acreditación de historial ante compradores y talleres
                </p>
              </div>

              {/* Recuadro de Certificación N° */}
              <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-2.5 sm:text-right shrink-0">
                <span className="text-[10px] font-black uppercase text-slate-500 block">
                  Certificado Oficial N°
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-[#1e3a6a] block">
                  {certificateCode}
                </span>
                <div className="mt-1 flex items-center sm:justify-end gap-1.5 text-[10px] text-slate-600">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Emisión: <strong>{todayStr}</strong></span>
                </div>
              </div>
            </div>

            {/* Ficha Técnica del Vehículo (Datos DNRPA) */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-[#1e3a6a] uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-700" />
                  Datos del Rodado (Ficha Técnica Homologada)
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-black bg-blue-900 text-white font-mono border border-blue-950">
                  🇦🇷 {currentPatente}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Vehículo / Modelo</span>
                  <span className="font-extrabold text-slate-900 block">{currentVehicleTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Año de Fabricación</span>
                  <span className="font-extrabold text-slate-900 block">{vehicleYear}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Kilometraje Certificado</span>
                  <span className="font-black text-blue-900 text-sm block">
                    {currentKm.toLocaleString('es-AR')} km
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Motorización</span>
                  <span className="font-semibold text-slate-800 block truncate" title={currentEngine}>{currentEngine}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Número de Chasis / VIN</span>
                  <span className="font-mono text-slate-800 font-bold block">{currentVin}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Radicación DNRPA</span>
                  <span className="font-semibold text-slate-800 block">{currentSeccional} (Mendoza)</span>
                </div>
              </div>
            </div>

            {/* Resumen de Mantenimiento */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Services Registrados</span>
                <span className="text-lg font-black text-blue-950 block">{totalServices}</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Inversión Documentada</span>
                <span className="text-lg font-black text-emerald-950 block">{formatMoney(totalInvested)}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Estado del Rodado</span>
                <span className="text-sm font-black text-amber-950 block mt-1">✓ En Mantenimiento</span>
              </div>
            </div>

            {/* Tabla de Services Realizados */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-[#1e3a6a] tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-blue-700" />
                  Registro Cronológico de Mantenimientos Realizados
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Mostrando intervenciones registradas
                </span>
              </div>

              {sortedServices.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
                  No hay mantenimientos cargados en la libreta todavía.
                </div>
              ) : (
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-black uppercase text-slate-600">
                        <th className="py-2 px-3">Fecha</th>
                        <th className="py-2 px-3">Kilometraje</th>
                        <th className="py-2 px-3">Intervención / Service</th>
                        <th className="py-2 px-3">Taller / Establecimiento</th>
                        <th className="py-2 px-3 text-right">Inversión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {sortedServices.map((srv, idx) => (
                        <tr key={srv.id || idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-700 whitespace-nowrap">
                            {srv.date ? new Date(srv.date + 'T00:00:00').toLocaleDateString('es-AR') : '-'}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                            {srv.km ? `${parseInt(srv.km, 10).toLocaleString('es-AR')} km` : '-'}
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-extrabold text-slate-900 block">{srv.title}</span>
                            {srv.customParts && (
                              <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                                Piezas: {srv.customParts}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                            {srv.workshop || 'Lubricentro Mendoza'}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {srv.cost ? formatMoney(srv.cost) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Próximos Services Preventivos Recomendados */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                Plan Preventivo Recomendado para este Modelo
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Próximo Cambio de Aceite y Filtros:</span>
                    <span className="text-[10px] text-slate-500">Aceite Sintético + 4 Filtros</span>
                  </div>
                  <span className="font-mono font-black text-blue-900 text-xs">
                    {nextOilKm.toLocaleString('es-AR')} km
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Reemplazo Correa de Distribución:</span>
                    <span className="text-[10px] text-slate-500">Kit distribución + bomba de agua</span>
                  </div>
                  <span className="font-mono font-black text-amber-900 text-xs">
                    {nextDistributionKm.toLocaleString('es-AR')} km
                  </span>
                </div>
              </div>
            </div>

            {/* Firmas y Sellos Legales */}
            <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-1">
                <div className="h-14 border-b-2 border-dashed border-slate-300 flex items-end justify-center pb-1">
                  <span className="text-[10px] text-slate-400 italic">Firma del Titular / Propietario</span>
                </div>
                <span className="font-bold text-slate-700 block">Titular del Automotor</span>
                <span className="text-[10px] text-slate-500 block">Acreditación de Veracidad</span>
              </div>

              <div className="space-y-1">
                <div className="h-14 border-b-2 border-dashed border-slate-300 flex items-end justify-center pb-1">
                  <span className="text-[10px] text-slate-400 italic">Sello / Firma Responsable Técnico</span>
                </div>
                <span className="font-bold text-slate-700 block">Taller / Peritaje Mecánico</span>
                <span className="text-[10px] text-slate-500 block">Constancia de Inspección</span>
              </div>
            </div>

            {/* Pie Legal DinAcitY */}
            <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 text-center space-y-0.5">
              <p>
                Certificado generado electrónicamente a través de la plataforma <strong>DinAcitY Mendoza</strong>.
              </p>
              <p className="text-slate-400">
                Los datos técnicos corresponden al vehículo {currentPatente} radicado en la Provincia de Mendoza. Prohibida su alteración o adulteración.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
