import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Gauge,
  Calendar,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Droplets,
  Car,
  MessageCircle,
  FileText,
  Sparkles,
  ChevronRight,
  Filter,
  Search,
  Printer,
  ShieldCheck,
  DollarSign,
  Check,
  RotateCcw,
  Info,
  ExternalLink,
  X,
  Disc,
  Flame,
  Battery,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { clientFallbackService } from '../services/clientFallbackService.js';

export function ServiceNotebookWidget({
  vehicle,
  onOpenPatenteModal,
  onNavigateCotizador,
  onNavigatePasaporte
}) {
  const currentPatente = (vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP').toUpperCase().trim();
  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';
  const currentEngine = vehicle?.engine?.name || vehicle?.data?.engine?.name || '1.6 8V MSI Naftero (101 CV)';
  const vehicleBrand = (vehicle?.brand || 'Volkswagen').toLowerCase();
  const vehicleModel = (vehicle?.model || 'Gol Trend').toLowerCase();

  const specs = clientFallbackService.getMaintenanceSpecs(vehicle);

  // Storage Keys per vehicle license plate
  const storageKeyServices = `dinacity_libreta_services_${currentPatente}`;
  const storageKeyKm = `dinacity_libreta_km_${currentPatente}`;

  // Odómetro actual editable
  const [currentKm, setCurrentKm] = useState(() => {
    try {
      const savedKm = localStorage.getItem(storageKeyKm);
      return savedKm ? parseInt(savedKm, 10) : 62500;
    } catch {
      return 62500;
    }
  });
  const [kmInput, setKmInput] = useState(currentKm.toString());

  // Tabs internas: 'historial' (Qué se le hizo) | 'pendientes' (Qué le falta hacer)
  const [activeTab, setActiveTab] = useState('historial');

  // Filtros en Historial
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Modal para agregar o editar service
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    km: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    category: 'fluidos',
    selectedQuickParts: [],
    customParts: '',
    workshop: '',
    cost: '',
    notes: ''
  });

  // Notificación tipo toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Semilla de datos iniciales si no hay nada guardado
  const getInitialServices = () => [
    {
      id: 'srv_1',
      km: 10000,
      date: '2020-04-10',
      title: 'Service Oficial de 10.000 KM',
      category: 'fluidos',
      items: ['Aceite Sintético 5W-40', 'Filtro de Aceite Genuino', 'Filtro de Aire Motor'],
      workshop: 'Concesionario Oficial',
      cost: 42000,
      notes: 'Primer service programado. Control de niveles y reseteo de aviso de tablero.',
      completed: true
    },
    {
      id: 'srv_2',
      km: 25000,
      date: '2021-08-15',
      title: 'Service de los 25.000 KM y Filtros',
      category: 'fluidos',
      items: ['Aceite de Motor', 'Filtro de Aceite', 'Filtro de Habitáculo / Aire', 'Filtro de Nafta'],
      workshop: 'Lubricentro San Martín (Mendoza)',
      cost: 54000,
      notes: 'Filtro de habitáculo cambiado por presencia de polvo de zonda.',
      completed: true
    },
    {
      id: 'srv_3',
      km: 40000,
      date: '2023-01-20',
      title: 'Service Intermedio & Frenos Delanteros',
      category: 'frenos',
      items: ['Aceite Sintético 5W-40', 'Filtro de Aceite', 'Pastillas de Freno Delanteras Bosch', 'Líquido de Frenos DOT 4'],
      workshop: 'Taller Mecánico Di Natale',
      cost: 88000,
      notes: 'Se cambiaron pastillas delanteras por desgaste. Purgado completo del circuito hidráulico.',
      completed: true
    },
    {
      id: 'srv_4',
      km: 50000,
      date: '2024-06-05',
      title: 'Service Preventivo de 50.000 KM & Bujías',
      category: 'fluidos',
      items: ['Aceite Sintético 5W-40', 'Filtro de Aceite', 'Filtro de Aire', 'Bujías de Encendido NGK (Juego x4)'],
      workshop: 'Taller Especializado',
      cost: 95000,
      notes: 'Bujías nuevas colocadas. Revisión visual de correas y tren delantero.',
      completed: true
    }
  ];

  // Estado principal de services registrados en la libreta
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKeyServices);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return getInitialServices();
    } catch {
      return getInitialServices();
    }
  });

  // Guardar en localStorage cuando cambian services o el odómetro
  useEffect(() => {
    try {
      localStorage.setItem(storageKeyServices, JSON.stringify(services));
    } catch (e) {
      console.error('Error saving maintenance services to localStorage', e);
    }
  }, [services, storageKeyServices]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKeyKm, currentKm.toString());
    } catch (e) {
      console.error('Error saving km to localStorage', e);
    }
  }, [currentKm, storageKeyKm]);

  // Actualizar odómetro cuando el usuario tipea o usa botones
  const handleUpdateKm = (newKm) => {
    const safeKm = Math.max(0, Math.min(600000, newKm));
    setCurrentKm(safeKm);
    setKmInput(safeKm.toString());
  };

  const handleKmInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setKmInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setCurrentKm(Math.min(600000, parsed));
    }
  };

  // Sugerencias de títulos rápidos para el formulario
  const quickTitleSuggestions = [
    { title: 'Cambio de Aceite y Filtros', category: 'fluidos', parts: ['Aceite de Motor', 'Filtro de Aceite', 'Filtro de Aire'] },
    { title: 'Kit de Distribución + Bomba de Agua', category: 'distribucion', parts: ['Correa de Distribución', 'Tensor de Distribución', 'Bomba de Agua', 'Líquido Refrigerante'] },
    { title: 'Service de Frenos Delanteros', category: 'frenos', parts: ['Pastillas de Freno', 'Discos de Freno', 'Líquido de Frenos DOT 4'] },
    { title: 'Service de Frenos Traseros', category: 'frenos', parts: ['Cintas y Campanas de Freno', 'Bombines de Freno'] },
    { title: 'Cambio de Bujías y Cables', category: 'motor', parts: ['Bujías de Encendido', 'Cables de Bujía'] },
    { title: 'Kit de Embrague Completo', category: 'embrague', parts: ['Placa y Disco de Embrague', 'Crapodina / Rulemán de Empuje', 'Fluido de Caja'] },
    { title: 'Tren Delantero & Amortiguadores', category: 'suspension', parts: ['Amortiguadores Delanteros', 'Cazoletas', 'Extremos de Dirección', 'Bujes de Parrilla'] },
    { title: 'Cambio de Batería 12V', category: 'motor', parts: ['Batería 12V Homologada'] },
    { title: 'Service de 4 Filtros Completo', category: 'fluidos', parts: ['Filtro de Aceite', 'Filtro de Aire', 'Filtro de Nafta', 'Filtro de Habitáculo'] }
  ];

  // Partes rápidas para checkboxes
  const commonParts = [
    'Aceite Sintético de Motor',
    'Filtro de Aceite',
    'Filtro de Aire',
    'Filtro de Combustible (Nafta/Gasoil)',
    'Filtro de Habitáculo / Polen',
    'Bujías de Encendido',
    'Kit Correa de Distribución',
    'Tensor de Distribución',
    'Bomba de Agua',
    'Líquido Refrigerante Orgánico',
    'Pastillas de Freno Delanteras',
    'Discos de Freno Delanteros',
    'Líquido de Frenos DOT 4',
    'Kit de Embrague',
    'Fluido de Transmisión / Caja',
    'Amortiguadores',
    'Bujes de Parrilla / Rótulas',
    'Batería 12V',
    'Alineación y Balanceo'
  ];

  // Abrir modal para crear nuevo service
  const handleOpenCreateModal = (prefill = null) => {
    setEditingServiceId(null);
    if (prefill) {
      setFormData({
        km: prefill.km ? prefill.km.toString() : currentKm.toString(),
        date: new Date().toISOString().split('T')[0],
        title: prefill.title || 'Service de Mantenimiento',
        category: prefill.category || 'fluidos',
        selectedQuickParts: prefill.parts || [],
        customParts: '',
        workshop: '',
        cost: '',
        notes: prefill.notes || ''
      });
    } else {
      setFormData({
        km: currentKm.toString(),
        date: new Date().toISOString().split('T')[0],
        title: '',
        category: 'fluidos',
        selectedQuickParts: ['Aceite Sintético de Motor', 'Filtro de Aceite', 'Filtro de Aire'],
        customParts: '',
        workshop: '',
        cost: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEditModal = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      km: service.km.toString(),
      date: service.date || new Date().toISOString().split('T')[0],
      title: service.title,
      category: service.category || 'fluidos',
      selectedQuickParts: service.items || [],
      customParts: '',
      workshop: service.workshop || '',
      cost: service.cost ? service.cost.toString() : '',
      notes: service.notes || ''
    });
    setIsModalOpen(true);
  };

  // Guardar service (Creación o Edición)
  const handleSaveService = (e) => {
    e.preventDefault();
    const kmNum = parseInt(formData.km, 10);
    if (isNaN(kmNum) || kmNum <= 0) {
      alert('Por favor ingresá un kilometraje válido');
      return;
    }
    if (!formData.title.trim()) {
      alert('Por favor ingresá el título o tipo de service');
      return;
    }

    // Combinar partes seleccionadas y personalizadas
    const extraParts = formData.customParts
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);
    const combinedParts = Array.from(new Set([...formData.selectedQuickParts, ...extraParts]));

    const costNum = formData.cost ? parseInt(formData.cost.replace(/[^0-9]/g, ''), 10) : 0;

    if (editingServiceId) {
      // Edición
      setServices(prev =>
        prev.map(s =>
          s.id === editingServiceId
            ? {
                ...s,
                km: kmNum,
                date: formData.date,
                title: formData.title.trim(),
                category: formData.category,
                items: combinedParts,
                workshop: formData.workshop.trim(),
                cost: isNaN(costNum) ? 0 : costNum,
                notes: formData.notes.trim()
              }
            : s
        )
      );
      showToast('✅ Service actualizado con éxito en tu Libreta');
    } else {
      // Nuevo
      const newEntry = {
        id: `srv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        km: kmNum,
        date: formData.date,
        title: formData.title.trim(),
        category: formData.category,
        items: combinedParts,
        workshop: formData.workshop.trim(),
        cost: isNaN(costNum) ? 0 : costNum,
        notes: formData.notes.trim(),
        completed: true,
        createdAt: new Date().toISOString()
      };
      setServices(prev => [newEntry, ...prev]);
      showToast('🎉 ¡Service registrado y guardado en tu Libreta!');
    }

    setIsModalOpen(false);
  };

  // Eliminar service
  const handleDeleteService = (id) => {
    if (window.confirm('¿Estás seguro de que querés borrar este registro de la libreta?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      showToast('🗑️ Registro eliminado de la libreta');
    }
  };

  // Resetear o Limpiar
  const handleResetToExample = () => {
    if (window.confirm('¿Restablecer la libreta con el historial de ejemplo oficial para este vehículo?')) {
      setServices(getInitialServices());
      showToast('🔄 Libreta restablecida con datos oficiales de referencia');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Querés borrar todo el historial y dejar tu libreta en blanco?')) {
      setServices([]);
      showToast('🧹 Libreta reiniciada en blanco');
    }
  };

  // Alternar partes en checkbox
  const toggleQuickPart = (part) => {
    setFormData(prev => {
      const exists = prev.selectedQuickParts.includes(part);
      if (exists) {
        return {
          ...prev,
          selectedQuickParts: prev.selectedQuickParts.filter(p => p !== part)
        };
      } else {
        return {
          ...prev,
          selectedQuickParts: [...prev.selectedQuickParts, part]
        };
      }
    });
  };

  // Aplicar sugerencia rápida en formulario
  const applyQuickSuggestion = (item) => {
    setFormData(prev => ({
      ...prev,
      title: item.title,
      category: item.category,
      selectedQuickParts: Array.from(new Set([...prev.selectedQuickParts, ...item.parts]))
    }));
  };

  // Cálculo de Mantenimientos Recomendados Oficiales & Detección de Pendientes
  // Lista de hitos estándar de la industria argentina
  const standardMilestones = [
    {
      km: 10000,
      title: 'Service de 10.000 KM (Aceite y Filtros)',
      category: 'fluidos',
      isCritical: false,
      parts: ['Aceite Sintético Homologado', 'Filtro de Aceite Genuino', 'Filtro de Aire'],
      desc: 'Cambio de aceite de motor y filtro para proteger aros, metales y garantizar lubricación óptima.'
    },
    {
      km: 20000,
      title: 'Service de 20.000 KM (4 Filtros y Chequeo)',
      category: 'fluidos',
      isCritical: false,
      parts: ['Aceite de Motor', 'Filtro de Aceite', 'Filtro de Aire', 'Filtro de Habitáculo', 'Filtro de Combustible'],
      desc: 'Renovación de filtros de aire, habitáculo y combustible. Inspección visual de frenos.'
    },
    {
      km: 30000,
      title: 'Service de 30.000 KM (Fluidos y Tren Delantero)',
      category: 'fluidos',
      isCritical: false,
      parts: ['Aceite de Motor', 'Filtro de Aceite', 'Filtro de Aire', 'Alineación y Balanceo'],
      desc: 'Rotación de neumáticos, chequeo de tren delantero y recambio de fluidos de motor.'
    },
    {
      km: 40000,
      title: 'Service de 40.000 KM (Bujías y Frenos)',
      category: 'frenos',
      isCritical: true,
      parts: ['Aceite y Filtros', 'Bujías de Encendido Homologadas', 'Líquido de Frenos DOT 4', 'Pastillas de Freno Delanteras'],
      desc: 'Sustitución de bujías por erosión de electrodos y purgado de líquido de frenos por higroscopía.'
    },
    {
      km: 50000,
      title: 'Service de 50.000 KM (Chequeo General Preventivo)',
      category: 'fluidos',
      isCritical: false,
      parts: ['Aceite de Motor', 'Filtro de Aceite', 'Filtro de Aire', 'Filtro de Habitáculo'],
      desc: 'Chequeo integral pre-distribución: estado de batería, mangueras y tensión de correas auxiliares.'
    },
    {
      km: 60000,
      title: 'Service de 60.000 KM • Kit de Distribución + Bomba de Agua (CRÍTICO)',
      category: 'distribucion',
      isCritical: true,
      parts: ['Kit Correa de Distribución y Tensor', 'Bomba de Agua', 'Líquido Refrigerante Orgánico', 'Aceite y Filtros'],
      desc: '⚠️ Mantenimiento crítico impostergable: Si la correa se corta se doblan válvulas y se destruye la tapa de cilindros.'
    },
    {
      km: 70000,
      title: 'Service de 70.000 KM (Mantenimiento Rutinario Post-Distribución)',
      category: 'fluidos',
      isCritical: false,
      parts: ['Aceite Sintético', 'Filtro de Aceite', 'Filtro de Aire', 'Inspección de Tren Delantero'],
      desc: 'Service programado de aceite y filtro. Revisión de fuelles de semieje y pastillas.'
    },
    {
      km: 80000,
      title: 'Service de 80.000 KM • Suspensión, Bujías y Frenos Traseros',
      category: 'suspension',
      isCritical: true,
      parts: ['Bujías de Encendido', 'Líquido de Frenos', 'Amortiguadores (Control/Cambio)', 'Campanas y Cintas Traseras'],
      desc: 'Revisión y sustitución de elementos de fricción y amortiguación por fatiga hidráulica.'
    },
    {
      km: 90000,
      title: 'Service de 90.000 KM (Fluidos y Mangueras)',
      category: 'fluidos',
      isCritical: false,
      parts: ['Aceite de Motor', 'Filtro de Aceite', 'Filtro de Aire', 'Filtro de Nafta', 'Filtro de Polen'],
      desc: 'Chequeo de mangueras de refrigeración, abrazaderas y correas de accesorios poly-V.'
    },
    {
      km: 100000,
      title: 'Service de los 100.000 KM • Hito Clave de 100 Mil Kilómetros',
      category: 'motor',
      isCritical: true,
      parts: ['Aceite Sintético Homologado', '4 Filtros Nuevos', 'Limpieza de Inyectores', 'Batería 12V', 'Termostato'],
      desc: 'Service mayor del primer centenar de miles de km: Descarbonización, termostato preventivo y escaneo computarizado.'
    },
    {
      km: 120000,
      title: 'Service de 120.000 KM • 2da Distribución + Kit de Embrague + Caja',
      category: 'distribucion',
      isCritical: true,
      parts: ['2do Kit de Distribución + Bomba', 'Kit Completo de Embrague', 'Fluido de Caja de Cambios', 'Refrigerante'],
      desc: '⚠️ Mantenimiento mayor bisagra: 2do cambio de distribución y sustitución de placa, disco y crapodina de embrague.'
    },
    {
      km: 140000,
      title: 'Service de 140.000 KM (Tren Delantero Integral & Retenes)',
      category: 'suspension',
      isCritical: true,
      parts: ['Bujes de Parrilla', 'Rótulas', 'Extremos de Dirección', 'Junta Tapa de Válvulas', 'Aceite y Filtros'],
      desc: 'Restauración del tren delantero para eliminar ruidos y reemplazo de retenes de goma resecados por calor.'
    },
    {
      km: 160000,
      title: 'Service de 160.000 KM (Bomba de Combustible & Alternador)',
      category: 'motor',
      isCritical: false,
      parts: ['Bomba de Nafta (Aforador)', 'Carbones de Alternador', 'Líquido de Frenos', 'Bujías'],
      desc: 'Service preventivo de electroauto y sistema de combustible para evitar paradas en ruta.'
    },
    {
      km: 180000,
      title: 'Service de 180.000 KM • 3ra Distribución & Suspensión Completa',
      category: 'distribucion',
      isCritical: true,
      parts: ['3er Kit Distribución + Bomba', '4 Amortiguadores Nuevos + Cazoletas', 'Aceite y Filtros'],
      desc: 'Ciclo trianual de distribución y renovación integral de amortiguación para recuperar andar de fábrica.'
    },
    {
      km: 200000,
      title: 'Service de los 200.000 KM • Promedio Parque Automotor Argentino',
      category: 'motor',
      isCritical: true,
      parts: ['Prueba de Compresión', 'Descarbonización Admisión / EGR', 'Aceite Alta Protección', '4 Filtros'],
      desc: 'Hito histórico del auto argentino. Chequeo de estanqueidad de cilindros y mantenimiento de longevidad.'
    }
  ];

  // Identificar qué services ya se hicieron y cuáles faltan
  const { completedMilestones, pendingServices, upcomingServices, futureServices, isEverythingUpToDate } = useMemo(() => {
    // Buscar si un hito coincide o está cubierto por un service registrado (margen de +/- 6.000 km o por nombre)
    const pending = [];
    const upcoming = [];
    const future = [];
    const completed = [];

    standardMilestones.forEach(milestone => {
      // Buscar si el usuario registró un service para este hito
      const matchingRecorded = services.find(s => {
        const diff = Math.abs(s.km - milestone.km);
        if (diff <= 5000) return true;
        // O si el título coincide en distribución/embrague/etc
        if (milestone.category === 'distribucion' && s.title.toLowerCase().includes('distribuci')) {
          if (diff <= 15000) return true;
        }
        return false;
      });

      if (matchingRecorded) {
        completed.push({
          ...milestone,
          recorded: matchingRecorded
        });
      } else {
        // No está registrado en la libreta. Analizar según odómetro actual:
        if (currentKm >= milestone.km) {
          // VENCIDO / PENDIENTE URGENTE
          const overdueBy = currentKm - milestone.km;
          pending.push({
            ...milestone,
            status: 'vencido',
            overdueBy
          });
        } else if (milestone.km - currentKm <= 10000) {
          // PRÓXIMO EN MENOS DE 10.000 KM
          const dueIn = milestone.km - currentKm;
          upcoming.push({
            ...milestone,
            status: 'proximo',
            dueIn
          });
        } else {
          // A FUTURO
          const dueIn = milestone.km - currentKm;
          future.push({
            ...milestone,
            status: 'futuro',
            dueIn
          });
        }
      }
    });

    return {
      completedMilestones: completed,
      pendingServices: pending,
      upcomingServices: upcoming,
      futureServices: future,
      isEverythingUpToDate: pending.length === 0
    };
  }, [services, currentKm]);

  // Lista de services ordenados en el Historial (por KM descendente)
  const filteredHistory = useMemo(() => {
    return services
      .filter(s => {
        if (categoryFilter !== 'todos' && s.category !== categoryFilter) return false;
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matchTitle = s.title.toLowerCase().includes(q);
          const matchWorkshop = (s.workshop || '').toLowerCase().includes(q);
          const matchNotes = (s.notes || '').toLowerCase().includes(q);
          const matchItems = (s.items || []).some(item => item.toLowerCase().includes(q));
          const matchKm = s.km.toString().includes(q);
          return matchTitle || matchWorkshop || matchNotes || matchItems || matchKm;
        }
        return true;
      })
      .sort((a, b) => b.km - a.km);
  }, [services, categoryFilter, searchFilter]);

  // Estadísticas de la libreta
  const totalCostInvested = useMemo(() => {
    return services.reduce((acc, s) => acc + (s.cost || 0), 0);
  }, [services]);

  const latestRecordedService = useMemo(() => {
    if (services.length === 0) return null;
    return [...services].sort((a, b) => b.km - a.km)[0];
  }, [services]);

  // Función para imprimir la libreta
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Cabecera Principal de la Libreta de Mantenimiento */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-blue-500/30">
        
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Libreta Digital de Mantenimiento
              </span>
              <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                💾 Guardado Local Automático
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ✓ Historial & Recordatorios por KM
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Libreta de Services de tu Vehículo
            </h1>

            <p className="text-sm text-blue-100 leading-relaxed">
              Anotá y guardá cada service que le vas haciendo a tu auto a medida que suma kilómetros. Cada vez que entres a la aplicación, vas a saber con exactitud <strong>qué le hiciste</strong> y <strong>qué le falta hacer</strong> para mantenerlo seguro y al día.
            </p>

            {/* Botones de acción rápida en cabecera */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenCreateModal()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Anotar Nuevo Service en mi Libreta</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
                title="Imprimir libreta oficial o guardar en PDF"
              >
                <Printer className="w-3.5 h-3.5 text-yellow-300" />
                <span>Imprimir / Exportar Libreta</span>
              </button>

              {onNavigatePasaporte && (
                <button
                  type="button"
                  onClick={onNavigatePasaporte}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white font-bold text-xs transition border border-blue-400/30 flex items-center gap-1.5 cursor-pointer"
                  title="Ver especificaciones de fábrica y fluidos de 10k a 500k km"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
                  <span>Ver Ficha Técnica Oficial</span>
                </button>
              )}
            </div>
          </div>

          {/* Tarjeta de Vehículo Vinculado & Odómetro Actual */}
          <div className="bg-slate-950/90 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 sm:p-5 shrink-0 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-400" />
                Vehículo en Libreta
              </span>
              {onOpenPatenteModal && (
                <button
                  type="button"
                  onClick={onOpenPatenteModal}
                  className="text-[11px] text-blue-300 hover:text-white font-bold underline cursor-pointer"
                >
                  Cambiar vehículo
                </button>
              )}
            </div>

            <div>
              <p className="font-black text-base sm:text-lg text-white leading-snug">
                {currentVehicleTitle}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-black shadow-xs">
                  🇦🇷 {currentPatente}
                </span>
                <span className="text-slate-400 truncate max-w-[200px]" title={currentEngine}>
                  {currentEngine}
                </span>
              </div>
            </div>

            {/* Odómetro Editable en la Tarjeta */}
            <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                  Odómetro actual del auto:
                </span>
                <span className="text-amber-400 font-bold text-[10px]">Escribí tus KM</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateKm(currentKm - 5000)}
                  disabled={currentKm <= 0}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-40"
                  title="Restar 5.000 km"
                >
                  -5k
                </button>

                <div className="flex-1 flex items-center justify-center bg-slate-950 px-3 py-1.5 rounded-lg border border-yellow-400/50 shadow-inner">
                  <input
                    type="text"
                    value={kmInput}
                    onChange={handleKmInputChange}
                    className="w-full text-center font-mono font-black text-lg bg-transparent text-yellow-300 focus:outline-none"
                    placeholder="62500"
                  />
                  <span className="text-xs font-black text-slate-400 ml-1">KM</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateKm(currentKm + 5000)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  title="Sumar 5.000 km"
                >
                  +5k
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Tarjetas de Resumen Ejecutivo y Estado General */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Services Realizados */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Services Anotados
            </span>
            <p className="text-xl sm:text-2xl font-black text-white">
              {services.length} <span className="text-xs text-slate-400 font-normal">registrados</span>
            </p>
            <span className="text-[10px] text-blue-300 block">Historial en libreta</span>
          </div>
        </div>

        {/* Card 2: Odómetro Actual */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/30">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Kilometraje Actual
            </span>
            <p className="text-xl sm:text-2xl font-black text-yellow-300 font-mono">
              {currentKm.toLocaleString('es-AR')} <span className="text-xs text-slate-400 font-normal">KM</span>
            </p>
            <span className="text-[10px] text-slate-400 block">Odómetro verificado</span>
          </div>
        </div>

        {/* Card 3: Estado de Mantenimiento */}
        <div className={`border rounded-2xl p-4 shadow-lg flex items-center gap-3.5 ${
          pendingServices.length > 0
            ? 'bg-red-950/40 border-red-500/50 text-red-200'
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
            pendingServices.length > 0
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            {pendingServices.length > 0 ? (
              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-90">
              Estado de Alertas
            </span>
            <p className="text-lg sm:text-xl font-black text-white">
              {pendingServices.length > 0
                ? `${pendingServices.length} pendiente(s)`
                : 'Todo al día'}
            </p>
            <span className="text-[10px] block opacity-80">
              {pendingServices.length > 0
                ? 'Requiere atención urgente'
                : 'Mantenimientos al corriente'}
            </span>
          </div>
        </div>

        {/* Card 4: Inversión Total Registrada */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Inversión en Services
            </span>
            <p className="text-lg sm:text-xl font-black text-emerald-400">
              ${totalCostInvested.toLocaleString('es-AR')}
            </p>
            <span className="text-[10px] text-slate-400 block">Total acumulado en repuestos</span>
          </div>
        </div>

      </div>

      {/* Pestañas Principales: ¿QUÉ LE FALTA HACER? vs ¿QUÉ YA HIZO? */}
      <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 flex items-center gap-2 shadow-xl">
        
        {/* Pestaña 1: Historial Realizado */}
        <button
          type="button"
          onClick={() => setActiveTab('historial')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'historial'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border border-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📋 ¿Qué se le hizo? Historial Realizado ({services.length})</span>
        </button>

        {/* Pestaña 2: Qué le Falta Hacer */}
        <button
          type="button"
          onClick={() => setActiveTab('pendientes')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer relative ${
            activeTab === 'pendientes'
              ? 'bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white shadow-lg border border-yellow-300'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>⏰ ¿Qué le falta hacer? Próximos Services</span>
          {pendingServices.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-md animate-pulse">
              {pendingServices.length} URGENTE
            </span>
          )}
        </button>

      </div>

      {/* CONTENIDO DE LA PESTAÑA 1: HISTORIAL REALIZADO */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros y Búsqueda en Historial */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            <div className="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar por repuesto, taller, o notas (ej. aceite, bujías, frenos)..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 font-bold text-[11px] mr-1">Filtrar:</span>
              
              {['todos', 'fluidos', 'distribucion', 'frenos', 'embrague', 'suspension'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition capitalize cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'todos' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
              <button
                type="button"
                onClick={handleResetToExample}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                title="Cargar historial de referencia"
              >
                Resetear ejemplo
              </button>
              {services.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                  title="Borrar todos los services de la libreta"
                >
                  Limpiar todo
                </button>
              )}
            </div>

          </div>

          {/* Lista de Registros Guardados en la Libreta */}
          {filteredHistory.length === 0 ? (
            <div className="bg-slate-800/60 border border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-black text-white">No hay services registrados con este filtro</h3>
                <p className="text-xs text-slate-400">
                  {services.length === 0
                    ? 'Tu libreta está en blanco. Hacé clic en el botón de abajo para anotar tu primer service realizado.'
                    : 'Probá borrando el texto de búsqueda o cambiando el filtro de categoría.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCreateModal()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Anotar Primer Service en la Libreta</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredHistory.map((service, idx) => (
                <div
                  key={service.id}
                  className="bg-slate-800/95 border border-slate-700 hover:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-xl transition space-y-3 relative group"
                >
                  {/* Encabezado del Registro */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-700/80 pb-3">
                    
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-sm shadow-sm flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-yellow-300" />
                        {service.km.toLocaleString('es-AR')} KM
                      </span>

                      {service.date && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {service.date}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                        ✓ Realizado
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 text-slate-400 border border-slate-800">
                        {service.category}
                      </span>
                    </div>

                    {/* Acciones de Edición y Eliminación */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {service.cost > 0 && (
                        <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                          ${service.cost.toLocaleString('es-AR')}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(service)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Editar registro"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 transition cursor-pointer"
                        title="Eliminar de la libreta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Cuerpo del Registro */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {service.title}
                    </h3>

                    {/* Tags de Repuestos y Trabajos */}
                    {service.items && service.items.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {service.items.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs bg-slate-900 text-blue-200 px-2.5 py-1 rounded-lg border border-slate-700 font-medium flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Taller & Notas del Dueño */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 text-slate-300">
                      {service.workshop && (
                        <p className="flex items-center gap-1 text-slate-400">
                          <span className="font-bold text-slate-300">Taller / Lugar:</span> {service.workshop}
                        </p>
                      )}

                      {service.notes && (
                        <div className="sm:col-span-2 bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/80 text-slate-300 text-xs italic">
                          <span className="font-bold not-italic text-amber-300 mr-1.5">📝 Anotaciones:</span>
                          {service.notes}
                        </div>
                      )}
                    </div>

                    {/* Botón para cotizar repuestos de este service por WhatsApp */}
                    {onNavigateCotizador && (
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigateCotizador({
                            partName: `Repuestos para ${service.title} (${currentVehicleTitle})`,
                            vehicle
                          })}
                          className="text-[11px] font-bold text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          <span>Pedir cotización de estos repuestos por WhatsApp</span>
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* CONTENIDO DE LA PESTAÑA 2: ¿QUÉ LE FALTA HACER? (PRÓXIMOS SERVICES) */}
      {activeTab === 'pendientes' && (
        <div className="space-y-6">
          
          {/* Banner de Explicación */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Diagnóstico Cruzado Odómetro vs Libreta
              </span>
              <h3 className="text-lg font-black text-white">
                Mantenimientos Programados para tu {currentVehicleTitle}
              </h3>
              <p className="text-xs text-slate-300">
                Basado en tus <strong className="text-yellow-300 font-mono">{currentKm.toLocaleString('es-AR')} KM</strong> actuales y lo que ya guardaste en tu libreta, acá ves qué tenés vencido y qué te toca hacer pronto.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCreateModal()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition shrink-0 cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Anotar Service Personalizado</span>
            </button>
          </div>

          {/* SECCIÓN 1: VENCIDOS / URGENTES (ATENCIÓN INMEDIATA) */}
          {pendingServices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                <h3 className="text-base sm:text-lg font-black text-red-400 uppercase tracking-tight">
                  🚨 Mantenimientos Vencidos o No Registrados ({pendingServices.length})
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Tu odómetro superó el kilometraje de estos servicios y no figuran anotados en tu libreta. Si ya los hiciste, hacé clic en "Ya lo hice" para guardarlos; si no, hacelos cuanto antes para prevenir averías.
              </p>

              <div className="grid grid-cols-1 gap-3.5">
                {pendingServices.map((item) => (
                  <div
                    key={item.km}
                    className="bg-red-950/30 border-2 border-red-500/60 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 transition hover:border-red-400"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-xl bg-red-600 text-white font-mono font-black text-xs shadow-sm">
                          Hito de los {item.km.toLocaleString('es-AR')} KM
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-red-950 text-red-300 border border-red-600/60">
                          ⚠️ Vencido hace {item.overdueBy.toLocaleString('es-AR')} KM
                        </span>
                        {item.isCritical && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
                            Riesgo Crítico
                          </span>
                        )}
                      </div>

                      {/* Botones de acción rápida */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenCreateModal({
                            km: item.km,
                            title: item.title,
                            category: item.category,
                            parts: item.parts,
                            notes: `Registrado desde alertas de la libreta para los ${item.km.toLocaleString('es-AR')} km.`
                          })}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>✓ Ya lo hice (Anotar)</span>
                        </button>

                        {onNavigateCotizador && (
                          <button
                            type="button"
                            onClick={() => onNavigateCotizador({
                              partName: `Repuestos urgentes para ${item.title} (${currentVehicleTitle})`,
                              vehicle
                            })}
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                            <span>Cotizar repuestos</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-red-200 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    {/* Chips de Repuestos Necesarios */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-slate-400">Repuestos requeridos:</span>
                      {item.parts.map((part, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-900/90 text-amber-200 px-2 py-0.5 rounded-lg border border-amber-500/30 font-medium"
                        >
                          • {part}
                        </span>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: PRÓXIMOS A REALIZAR EN MENOS DE 10.000 KM */}
          {upcomingServices.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-tight">
                  🔔 Próximos Services Inmediatos (En menos de 10.000 KM)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Los servicios que vas a tener que hacer próximamente para que vayas planificando y comprando los repuestos.
              </p>

              <div className="grid grid-cols-1 gap-3.5">
                {upcomingServices.map((item) => (
                  <div
                    key={item.km}
                    className="bg-amber-950/20 border border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-mono font-black text-xs shadow-sm">
                          Hito de los {item.km.toLocaleString('es-AR')} KM
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-600/50">
                          ⏳ Te faltan {item.dueIn.toLocaleString('es-AR')} KM
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenCreateModal({
                            km: item.km,
                            title: item.title,
                            category: item.category,
                            parts: item.parts
                          })}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-600 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Adelantar / Anotar ya</span>
                        </button>

                        {onNavigateCotizador && (
                          <button
                            type="button"
                            onClick={() => onNavigateCotizador({
                              partName: `Kit de repuestos para ${item.title} (${currentVehicleTitle})`,
                              vehicle
                            })}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Presupuestar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-slate-400">Repuestos a comprar:</span>
                      {item.parts.map((part, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-900 text-blue-200 px-2 py-0.5 rounded-lg border border-slate-700 font-medium"
                        >
                          • {part}
                        </span>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 3: PROGRAMADOS A FUTURO */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm sm:text-base font-black text-slate-400 uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Mantenimientos Programados a Futuro (+10.000 KM en adelante)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {futureServices.slice(0, 6).map((item) => (
                <div
                  key={item.km}
                  className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 space-y-2 opacity-85 hover:opacity-100 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-300">
                      {item.km.toLocaleString('es-AR')} KM
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      En {item.dueIn.toLocaleString('es-AR')} km
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white">
                    {item.title}
                  </p>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL PARA ANOTAR O EDITAR SERVICE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 text-white relative">
            
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {editingServiceId ? 'Editar Service de la Libreta' : 'Anotar Nuevo Service Realizado'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              
              {/* Sugerencias Rápidas de 1 Clic */}
              {!editingServiceId && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Sugerencias Rápidas (Hacé clic para autocompletar):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {quickTitleSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyQuickSuggestion(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition cursor-pointer"
                      >
                        + {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fila 1: Kilometraje y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                    Kilómetros al realizar el service (*):
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.km}
                    onChange={(e) => setFormData(prev => ({ ...prev, km: e.target.value }))}
                    placeholder="Ej. 60000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-yellow-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    Fecha en que se realizó:
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Fila 2: Título y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Título o Descripción del Mantenimiento (*):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej. Cambio de Aceite Sintético y 4 Filtros"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Categoría:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none capitalize"
                  >
                    <option value="fluidos">Fluidos & Aceite</option>
                    <option value="distribucion">Distribución</option>
                    <option value="frenos">Frenos</option>
                    <option value="embrague">Embrague</option>
                    <option value="suspension">Suspensión</option>
                    <option value="motor">Motor</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              {/* Fila 3: Checkboxes de Repuestos Colocados */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Repuestos y trabajos realizados (Marcá los que colocaste):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {commonParts.map((part, i) => {
                    const isChecked = formData.selectedQuickParts.includes(part);
                    return (
                      <label
                        key={i}
                        className={`text-[11px] p-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition select-none ${
                          isChecked ? 'bg-blue-900/60 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleQuickPart(part)}
                          className="accent-blue-500 rounded"
                        />
                        <span className="truncate">{part}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Fila 4: Otros Repuestos / Personalizados */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Otros repuestos o detalles específicos (separados por coma):
                </label>
                <input
                  type="text"
                  value={formData.customParts}
                  onChange={(e) => setFormData(prev => ({ ...prev, customParts: e.target.value }))}
                  placeholder="Ej. Líquido limpiaparabrisas, 2 focos H4, retén de distribución"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Fila 5: Taller y Costo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Taller Mecánico / Lubricentro / Particular:
                  </label>
                  <input
                    type="text"
                    value={formData.workshop}
                    onChange={(e) => setFormData(prev => ({ ...prev, workshop: e.target.value }))}
                    placeholder="Ej. Lubricentro San Martín / Particular"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Costo total abonado ($ Pesos, opcional):
                  </label>
                  <input
                    type="text"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="Ej. 95000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Fila 6: Notas / Observaciones mecánicas */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Notas u Observaciones del dueño:
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ej. Se usó aceite Castrol Edge 5W-40. El mecánico indicó revisar pastillas traseras en el próximo cambio."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Botones de Pie */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingServiceId ? 'Guardar Cambios' : 'Anotar en mi Libreta'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
