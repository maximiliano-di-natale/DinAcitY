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
  ChevronDown,
  Layers,
  Fuel,
  MapPin,
  Bookmark,
  Shield
} from 'lucide-react';
import { clientFallbackService } from '../services/clientFallbackService.js';

// Vehículos de ejemplo inscriptos por defecto si la cochera está vacía
const DEFAULT_USER_VEHICLES = [
  {
    patente: 'AD 192 OP',
    brand: 'Volkswagen',
    model: 'Gol Trend',
    version: 'Trendline 1.6 MSI 5P',
    year: 2019,
    vehicleType: 'auto',
    engine: {
      name: '1.6 8V MSI Naftero (101 CV)',
      code: 'EA111 (CFZ)',
      displacement: '1598 cc',
      power: '101 CV',
      fuel: 'Nafta Súper'
    },
    chassis: {
      vin: '8AWZZZ5UZKT048192',
      bodyType: 'Hatchback 5P',
      drive: 'Delantera 4x2'
    },
    dnrpa: {
      seccional: 'Guaymallén N° 2',
      codigoRegistro: '13012',
      provincia: 'Mendoza'
    },
    initialKm: 62500,
    owner: 'Titular Registrado'
  },
  {
    patente: 'AF 482 QZ',
    brand: 'Toyota',
    model: 'Hilux',
    version: 'SRV 2.8 TDI 4x4 Doble Cabina',
    year: 2022,
    vehicleType: 'pickup',
    engine: {
      name: '2.8 16V D-4D Turbodiésel (204 CV)',
      code: '1GD-FTV',
      displacement: '2755 cc',
      power: '204 CV',
      fuel: 'Diésel Grado 3 (Euro)'
    },
    chassis: {
      vin: '8AJBA3CD4N0148292',
      bodyType: 'Pick-Up Doble Cabina',
      drive: 'Integral 4x4 con reductora'
    },
    dnrpa: {
      seccional: 'Godoy Cruz N° 1',
      codigoRegistro: '13005',
      provincia: 'Mendoza'
    },
    initialKm: 38000,
    owner: 'Titular Registrado'
  }
];

export function ServiceNotebookWidget({
  vehicle,
  onSelectVehicle,
  onOpenPatenteModal,
  onNavigateCotizador,
  onNavigatePasaporte
}) {
  // 1. Estado de Autos Inscriptos a Nombre del Usuario en la Plataforma
  const [userVehicles, setUserVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('dinacity_user_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_USER_VEHICLES;
    } catch {
      return DEFAULT_USER_VEHICLES;
    }
  });

  // Guardar lista de autos inscriptos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dinacity_user_vehicles', JSON.stringify(userVehicles));
    } catch (e) {
      console.error('Error guardando vehiculos del usuario:', e);
    }
  }, [userVehicles]);

  // Si viene un vehiculo por prop que no está en la lista de autos inscriptos, agregarlo
  useEffect(() => {
    if (vehicle && (vehicle.patente || vehicle.data?.patente)) {
      const p = (vehicle.patente || vehicle.data?.patente).toUpperCase().trim();
      setUserVehicles(prev => {
        const exists = prev.some(v => v.patente.toUpperCase().trim() === p);
        if (!exists) {
          const newVeh = {
            patente: p,
            brand: vehicle.brand || vehicle.data?.brand || 'Vehículo',
            model: vehicle.model || vehicle.data?.model || 'Registrado',
            version: vehicle.version || vehicle.data?.version || '',
            year: vehicle.year || vehicle.data?.year || 2020,
            vehicleType: vehicle.vehicleType || vehicle.data?.vehicleType || 'auto',
            engine: vehicle.engine || vehicle.data?.engine || {
              name: 'Motor Convencional',
              displacement: '1600 cc',
              fuel: 'Nafta'
            },
            chassis: vehicle.chassis || vehicle.data?.chassis || {
              vin: 'Pendiente',
              drive: 'Delantera'
            },
            dnrpa: vehicle.dnrpa || vehicle.data?.dnrpa || {
              seccional: 'Mendoza',
              provincia: 'Mendoza'
            },
            initialKm: 50000,
            owner: 'Titular Registrado'
          };
          return [...prev, newVeh];
        }
        return prev;
      });
    }
  }, [vehicle]);

  // 2. Patente del auto seleccionado actualmente para ver su información
  const [activePatente, setActivePatente] = useState(() => {
    if (vehicle && (vehicle.patente || vehicle.data?.patente)) {
      return (vehicle.patente || vehicle.data?.patente).toUpperCase().trim();
    }
    return userVehicles[0]?.patente || 'AD 192 OP';
  });

  // Auto activo actual
  const currentVehicle = useMemo(() => {
    const found = userVehicles.find(v => v.patente.toUpperCase().trim() === activePatente.toUpperCase().trim());
    return found || userVehicles[0] || vehicle;
  }, [userVehicles, activePatente, vehicle]);

  const currentPatente = (currentVehicle?.patente || 'AD 192 OP').toUpperCase().trim();
  const currentVehicleTitle = currentVehicle
    ? `${currentVehicle.brand || ''} ${currentVehicle.model || ''} ${currentVehicle.version || ''} (${currentVehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';
  const currentEngine = currentVehicle?.engine?.name || '1.6 8V MSI Naftero (101 CV)';
  const vehicleBrand = (currentVehicle?.brand || 'Volkswagen').toLowerCase();
  const vehicleModel = (currentVehicle?.model || 'Gol Trend').toLowerCase();

  const specs = clientFallbackService.getMaintenanceSpecs(currentVehicle);

  // Storage Keys específicas de ESTE auto seleccionado
  const storageKeyServices = `dinacity_libreta_services_${currentPatente}`;
  const storageKeyKm = `dinacity_libreta_km_${currentPatente}`;

  // Odómetro del auto seleccionado
  const [currentKm, setCurrentKm] = useState(() => {
    try {
      const savedKm = localStorage.getItem(storageKeyKm);
      if (savedKm) return parseInt(savedKm, 10);
      return currentVehicle?.initialKm || 62500;
    } catch {
      return currentVehicle?.initialKm || 62500;
    }
  });
  const [kmInput, setKmInput] = useState(currentKm.toString());

  // Actualizar odómetro cuando cambia el vehículo activo
  useEffect(() => {
    try {
      const savedKm = localStorage.getItem(storageKeyKm);
      const val = savedKm ? parseInt(savedKm, 10) : (currentVehicle?.initialKm || 60000);
      setCurrentKm(val);
      setKmInput(val.toString());
    } catch {
      const fallback = currentVehicle?.initialKm || 60000;
      setCurrentKm(fallback);
      setKmInput(fallback.toString());
    }
  }, [currentPatente, storageKeyKm, currentVehicle]);

  // Guardar KM del auto activo
  useEffect(() => {
    try {
      localStorage.setItem(storageKeyKm, currentKm.toString());
    } catch (e) {
      console.error('Error guardando km:', e);
    }
  }, [currentKm, storageKeyKm]);

  // Tabs internas de la Libreta: 'historial' (Qué se le hizo) | 'pendientes' (Qué le falta hacer)
  const [activeTab, setActiveTab] = useState('historial');

  // Mostrar / ocultar ficha técnica detallada del auto
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  // Modal para inscribir nuevo vehículo
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [newVehiclePlateInput, setNewVehiclePlateInput] = useState('');
  const [newVehicleKmInput, setNewVehicleKmInput] = useState('50000');
  const [newVehicleLookupData, setNewVehicleLookupData] = useState(null);
  const [isLookingUpPlate, setIsLookingUpPlate] = useState(false);

  // Filtros en Historial
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Modal para agregar o editar service
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Form State para el service
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

  // Notificación toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Semilla de services iniciales según el auto
  const getInitialServicesForVehicle = (patenteStr) => {
    const p = (patenteStr || '').toUpperCase().trim();
    if (p.includes('AF 482 QZ') || p.includes('HILUX')) {
      return [
        {
          id: 'srv_hilux_1',
          km: 10000,
          date: '2023-03-10',
          title: 'Service Oficial de 10.000 KM Toyota',
          category: 'fluidos',
          items: ['Aceite Sintético 5W-30 D-4D (9.8L)', 'Filtro de Aceite Genuino Toyota', 'Engrase de Crucetas de Cardán'],
          workshop: 'Yacopini Toyota Oficial Mendoza',
          cost: 110000,
          notes: 'Primer service oficial en garantía. Niveles de tracción 4x4 certificados.',
          completed: true
        },
        {
          id: 'srv_hilux_2',
          km: 20000,
          date: '2024-01-18',
          title: 'Service de 20.000 KM & Filtro de Gasoil',
          category: 'fluidos',
          items: ['Aceite Sintético 5W-30', 'Filtro de Aceite', 'Filtro de Combustible con Trampa de Agua', 'Filtro de Habitáculo', 'Alineación y Balanceo'],
          workshop: 'Taller Especializado 4x4',
          cost: 165000,
          notes: 'Filtro de combustible reemplazado por seguridad para inyectores Common Rail. Rotación de cubiertas 265/65 R17.',
          completed: true
        }
      ];
    }

    // Default Gol Trend
    return [
      {
        id: 'srv_gol_1',
        km: 10000,
        date: '2020-04-10',
        title: 'Service Oficial de 10.000 KM',
        category: 'fluidos',
        items: ['Aceite Sintético 5W-40', 'Filtro de Aceite Genuino', 'Filtro de Aire Motor'],
        workshop: 'Concesionario Oficial VW',
        cost: 42000,
        notes: 'Primer service programado. Control de niveles y reseteo de aviso de tablero.',
        completed: true
      },
      {
        id: 'srv_gol_2',
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
        id: 'srv_gol_3',
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
        id: 'srv_gol_4',
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
  };

  // Services del auto actualmente seleccionado
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKeyServices);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return getInitialServicesForVehicle(currentPatente);
    } catch {
      return getInitialServicesForVehicle(currentPatente);
    }
  });

  // Cuando cambia el auto activo, recargar los services de ese auto
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKeyServices);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setServices(parsed);
          return;
        }
      }
      setServices(getInitialServicesForVehicle(currentPatente));
    } catch {
      setServices(getInitialServicesForVehicle(currentPatente));
    }
  }, [currentPatente, storageKeyServices]);

  // Guardar services del auto activo
  useEffect(() => {
    try {
      localStorage.setItem(storageKeyServices, JSON.stringify(services));
    } catch (e) {
      console.error('Error guardando services:', e);
    }
  }, [services, storageKeyServices]);

  // Cambiar el auto seleccionado
  const handleSelectCar = (veh) => {
    if (!veh || !veh.patente) return;
    setActivePatente(veh.patente);
    if (onSelectVehicle) {
      onSelectVehicle(veh);
    }
    showToast(`🚗 Cambiaste a: ${veh.brand} ${veh.model} (${veh.patente})`);
  };

  // Eliminar un vehículo de la plataforma
  const handleDeleteCar = (e, patenteToDelete) => {
    e.stopPropagation();
    if (userVehicles.length <= 1) {
      alert('Tenés que mantener al menos un vehículo inscripto en tu garaje.');
      return;
    }
    if (window.confirm(`¿Querés eliminar el vehículo ${patenteToDelete} de tus autos inscriptos?`)) {
      const remaining = userVehicles.filter(v => v.patente !== patenteToDelete);
      setUserVehicles(remaining);
      if (activePatente === patenteToDelete) {
        setActivePatente(remaining[0].patente);
        if (onSelectVehicle) onSelectVehicle(remaining[0]);
      }
      showToast('🗑️ Vehículo desvinculado de tu cuenta');
    }
  };

  // Búsqueda para inscribir auto nuevo por patente
  const handleLookupNewVehicle = () => {
    const cleanPlate = newVehiclePlateInput.trim().toUpperCase();
    if (!cleanPlate || cleanPlate.length < 5) {
      alert('Ingresá una patente válida de al menos 5 caracteres (ej. AF 482 QZ o AB 123 CD)');
      return;
    }
    setIsLookingUpPlate(true);
    try {
      const res = clientFallbackService.lookupPatente(cleanPlate);
      if (res && res.data) {
        setNewVehicleLookupData(res.data);
      } else {
        alert('No se pudo identificar la patente. Verificá los caracteres.');
      }
    } catch (err) {
      console.error('Error identificando patente:', err);
    } finally {
      setIsLookingUpPlate(false);
    }
  };

  // Confirmar inscripción del nuevo auto
  const handleConfirmInscribeCar = (e) => {
    e.preventDefault();
    if (!newVehicleLookupData) {
      alert('Primero consultá la patente para decodificar los datos del vehículo.');
      return;
    }

    const plateFormatted = (newVehicleLookupData.patente || newVehiclePlateInput).toUpperCase().trim();
    const kmVal = parseInt(newVehicleKmInput, 10) || 45000;

    // Verificar que no esté ya inscripto
    const alreadyExists = userVehicles.some(v => v.patente.toUpperCase().trim() === plateFormatted);
    if (alreadyExists) {
      alert('Este vehículo ya se encuentra inscripto en tu garaje.');
      return;
    }

    const newVeh = {
      patente: plateFormatted,
      brand: newVehicleLookupData.brand || 'Vehículo',
      model: newVehicleLookupData.model || 'Inscripto',
      version: newVehicleLookupData.version || '',
      year: newVehicleLookupData.year || 2021,
      vehicleType: newVehicleLookupData.vehicleType || 'auto',
      engine: newVehicleLookupData.engine || {
        name: 'Motor Homologado',
        displacement: '1600 cc',
        fuel: 'Nafta'
      },
      chassis: newVehicleLookupData.chassis || {
        vin: '8AJ' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        drive: '4x2'
      },
      dnrpa: newVehicleLookupData.dnrpa || {
        seccional: 'Mendoza N° 1',
        provincia: 'Mendoza'
      },
      initialKm: kmVal,
      owner: 'Maximiliano Di Natale'
    };

    // Guardar odómetro inicial
    localStorage.setItem(`dinacity_libreta_km_${plateFormatted}`, kmVal.toString());

    // Guardar services iniciales
    const initSrv = getInitialServicesForVehicle(plateFormatted);
    localStorage.setItem(`dinacity_libreta_services_${plateFormatted}`, JSON.stringify(initSrv));

    const updatedList = [...userVehicles, newVeh];
    setUserVehicles(updatedList);
    setActivePatente(plateFormatted);
    if (onSelectVehicle) onSelectVehicle(newVeh);

    setIsAddVehicleModalOpen(false);
    setNewVehiclePlateInput('');
    setNewVehicleLookupData(null);

    showToast(`🎉 ¡Vehículo ${plateFormatted} inscripto con éxito en tu garaje!`);
  };

  // Odómetro handlers
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

  // Sugerencias rápidas para el formulario de services
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

  // Modal crear/editar service
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

    const extraParts = formData.customParts
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);
    const combinedParts = Array.from(new Set([...formData.selectedQuickParts, ...extraParts]));
    const costNum = formData.cost ? parseInt(formData.cost.replace(/[^0-9]/g, ''), 10) : 0;

    if (editingServiceId) {
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
      showToast('✅ Service actualizado con éxito en la libreta de este auto');
    } else {
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
      showToast('🎉 ¡Service registrado y guardado para este vehículo!');
    }

    setIsModalOpen(false);
  };

  const handleDeleteService = (id) => {
    if (window.confirm('¿Estás seguro de que querés borrar este registro de la libreta?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      showToast('🗑️ Registro eliminado de la libreta');
    }
  };

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

  const applyQuickSuggestion = (item) => {
    setFormData(prev => ({
      ...prev,
      title: item.title,
      category: item.category,
      selectedQuickParts: Array.from(new Set([...prev.selectedQuickParts, ...item.parts]))
    }));
  };

  // Hitos de mantenimiento estándar de la industria
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
    }
  ];

  // Cálculo de pendientes y cumplidos para ESTE auto
  const { completedMilestones, pendingServices, upcomingServices, futureServices } = useMemo(() => {
    const pending = [];
    const upcoming = [];
    const future = [];
    const completed = [];

    standardMilestones.forEach(milestone => {
      const matchingRecorded = services.find(s => {
        const diff = Math.abs(s.km - milestone.km);
        if (diff <= 5000) return true;
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
        if (currentKm >= milestone.km) {
          const overdueBy = currentKm - milestone.km;
          pending.push({
            ...milestone,
            status: 'vencido',
            overdueBy
          });
        } else if (milestone.km - currentKm <= 10000) {
          const dueIn = milestone.km - currentKm;
          upcoming.push({
            ...milestone,
            status: 'proximo',
            dueIn
          });
        } else {
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
      futureServices: future
    };
  }, [services, currentKm]);

  // Lista de historial filtrado
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

  const totalCostInvested = useMemo(() => {
    return services.reduce((acc, s) => acc + (s.cost || 0), 0);
  }, [services]);

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

      {/* ========================================================================= */}
      {/* SECCIÓN 1: MIS AUTOS INSCRIPTOS EN LA PLATAFORMA (PRIMERAS OPCIONES)      */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/95 border-2 border-[#1e3a6a] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
        
        {/* Cabecera de la sección de autos */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1">
                <Bookmark className="w-3 h-3 fill-slate-950" />
                Mi Garaje DinAcitY
              </span>
              <span className="text-xs font-bold text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                {userVehicles.length} {userVehicles.length === 1 ? 'Vehículo inscripto' : 'Vehículos inscriptos'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-400" />
              <span>Mis Autos Inscriptos a mi Nombre</span>
            </h2>
            <p className="text-xs text-slate-300">
              Seleccioná cualquiera de tus autos para entrar y ver su libreta oficial, qué le hiciste y qué le falta hacer:
            </p>
          </div>

          {/* Botón para Inscribir Nuevo Auto */}
          <button
            type="button"
            onClick={() => {
              setNewVehiclePlateInput('');
              setNewVehicleLookupData(null);
              setIsAddVehicleModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg transition flex items-center gap-2 transform active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Inscribir Nuevo Auto a mi Nombre</span>
          </button>
        </div>

        {/* Tarjetas de Selección de los Autos Inscriptos (Primeras Opciones) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {userVehicles.map((carItem) => {
            const isSelected = carItem.patente.toUpperCase().trim() === activePatente.toUpperCase().trim();
            const carKm = (() => {
              try {
                const k = localStorage.getItem(`dinacity_libreta_km_${carItem.patente}`);
                return k ? parseInt(k, 10) : (carItem.initialKm || 50000);
              } catch {
                return carItem.initialKm || 50000;
              }
            })();

            const carServicesCount = (() => {
              try {
                const s = localStorage.getItem(`dinacity_libreta_services_${carItem.patente}`);
                if (s) {
                  const arr = JSON.parse(s);
                  if (Array.isArray(arr)) return arr.length;
                }
              } catch {}
              return isSelected ? services.length : 2;
            })();

            return (
              <div
                key={carItem.patente}
                onClick={() => handleSelectCar(carItem)}
                className={`rounded-2xl p-4 transition cursor-pointer relative border-2 flex flex-col justify-between gap-3 group ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-950/90 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/30 scale-[1.01]'
                    : 'bg-slate-950/80 border-slate-700/80 hover:border-blue-400/60 hover:bg-slate-900/90 shadow-md'
                }`}
              >
                {/* Header de la tarjeta del auto */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {/* Chapa patente argentina */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-900/90 border border-blue-400 text-white font-mono font-black text-xs shadow-xs">
                      <span>🇦🇷</span>
                      <span className="tracking-wider">{carItem.patente}</span>
                    </div>

                    <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors leading-tight">
                      {carItem.brand} {carItem.model}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      {carItem.version || `${carItem.year} • ${carItem.vehicleType}`}
                    </p>
                  </div>

                  {/* Estado / Badge de Selección */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Auto Activo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        Inscripto
                      </span>
                    )}

                    {/* Botón Borrar de mi cuenta */}
                    {userVehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCar(e, carItem.patente)}
                        className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800"
                        title="Eliminar este auto de mi garaje"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Métricas del auto: Odómetro y Services */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
                  <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Odómetro</span>
                      <span className="font-mono font-black text-white text-xs leading-none">
                        {carKm.toLocaleString('es-AR')} km
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Libreta</span>
                      <span className="font-bold text-emerald-400 text-xs leading-none">
                        {carServicesCount} services
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón de Entrada */}
                <div className="pt-1">
                  <button
                    type="button"
                    className={`w-full py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>{isSelected ? '✓ Viendo Información de este Auto' : '➔ Entrar a este Auto'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 2: INFORMACIÓN COMPLETA & FICHA TÉCNICA DEL AUTO SELECCIONADO      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-blue-500/30">
        
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Detalles del auto activo */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Libreta Oficial del Auto
              </span>
              <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-mono">
                🇦🇷 {currentPatente}
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ✓ Guardado en tu Garaje
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {currentVehicleTitle}
            </h1>

            <p className="text-sm text-blue-100 leading-relaxed">
              Estás gestionando la libreta y ficha técnica de tu <strong>{currentVehicle?.brand} {currentVehicle?.model}</strong>. Todo lo que anotes acá queda guardado exclusivamente para este auto.
            </p>

            {/* Acciones principales */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenCreateModal()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Anotar Service a este Auto</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFullSpecs(!showFullSpecs)}
                className="px-3.5 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white font-bold text-xs transition border border-blue-400/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-blue-300" />
                <span>{showFullSpecs ? 'Ocultar Ficha Técnica' : 'Ver Ficha Técnica Completa'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullSpecs ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
                title="Imprimir libreta oficial o guardar en PDF"
              >
                <Printer className="w-3.5 h-3.5 text-yellow-300" />
                <span>Imprimir Libreta</span>
              </button>
            </div>
          </div>

          {/* Tarjeta de Odómetro del Auto Seleccionado */}
          <div className="bg-slate-950/90 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 sm:p-5 shrink-0 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-400" />
                Vehículo en Vista
              </span>
              <span className="text-[11px] font-mono text-blue-300 font-bold">
                🇦🇷 {currentPatente}
              </span>
            </div>

            <div>
              <p className="font-black text-base text-white leading-snug">
                {currentVehicleTitle}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                <span className="text-slate-400 truncate max-w-[220px]" title={currentEngine}>
                  Motor: <strong className="text-white">{currentEngine}</strong>
                </span>
              </div>
            </div>

            {/* Odómetro Editable del auto */}
            <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                  Odómetro de este auto:
                </span>
                <span className="text-amber-400 font-bold text-[10px]">Actualizar KM</span>
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

        {/* Desplegable de Ficha Técnica Completa */}
        {showFullSpecs && (
          <div className="mt-5 pt-5 border-t border-slate-700/80 animate-in fade-in duration-200">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ficha Técnica Oficial DNRPA & Especificaciones ({currentVehicleTitle})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-blue-400 uppercase font-black block">Motor & Combustible</span>
                <p className="font-bold text-white text-sm">{currentEngine}</p>
                <p className="text-slate-400 text-[11px]">Combustible: <strong className="text-slate-200">{currentVehicle?.engine?.fuel || 'Nafta Súper'}</strong></p>
                <p className="text-slate-400 text-[11px]">Cilindrada: <strong className="text-slate-200">{currentVehicle?.engine?.displacement || '1598 cc'}</strong></p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-black block">Chasis & Transmisión</span>
                <p className="font-mono text-emerald-300 text-[11px] truncate" title={currentVehicle?.chassis?.vin || '8AWZZZ5UZKT048192'}>
                  VIN: {currentVehicle?.chassis?.vin || '8AWZZZ5UZKT048192'}
                </p>
                <p className="text-slate-400 text-[11px]">Tracción: <strong className="text-slate-200">{currentVehicle?.chassis?.drive || '4x2'}</strong></p>
                <p className="text-slate-400 text-[11px]">Caja: <strong className="text-slate-200">{specs.transmission?.type?.split('(')[0] || 'Manual'}</strong></p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-black block">Lubricación Homologada</span>
                <p className="font-bold text-white text-sm">{specs.oil?.spec || '5W-40 Sintético'}</p>
                <p className="text-slate-400 text-[11px]">Capacidad de cárter: <strong className="text-slate-200">{specs.oil?.capacity || '4.2 L'}</strong></p>
                <p className="text-slate-400 text-[11px]">Intervalo: <strong className="text-slate-200">{specs.oil?.interval || '10.000 km'}</strong></p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 uppercase font-black block">Distribución & Radicación</span>
                <p className="font-bold text-white text-xs">{specs.timing?.type || 'Correa Dentada'}</p>
                <p className="text-slate-400 text-[11px]">Intervalo: <strong className="text-slate-200">{specs.timing?.interval || '60.000 km'}</strong></p>
                <p className="text-slate-400 text-[11px]">Radicación: <strong className="text-slate-200">{currentVehicle?.dnrpa?.seccional || 'Mendoza'}</strong></p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 3: TARJETAS DE ESTADÍSTICAS DEL AUTO SELECCIONADO                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Services de este Auto
            </span>
            <p className="text-xl sm:text-2xl font-black text-white">
              {services.length} <span className="text-xs text-slate-400 font-normal">anotados</span>
            </p>
            <span className="text-[10px] text-blue-300 block font-mono">{currentPatente}</span>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/30">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Odómetro de este Auto
            </span>
            <p className="text-xl sm:text-2xl font-black text-yellow-300 font-mono">
              {currentKm.toLocaleString('es-AR')} <span className="text-xs text-slate-400 font-normal">KM</span>
            </p>
            <span className="text-[10px] text-slate-400 block">Kilómetros actuales</span>
          </div>
        </div>

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
              Estado Mecánico
            </span>
            <p className="text-lg sm:text-xl font-black text-white">
              {pendingServices.length > 0
                ? `${pendingServices.length} pendiente(s)`
                : 'Al corriente'}
            </p>
            <span className="text-[10px] block opacity-80">
              {pendingServices.length > 0
                ? 'Requiere atención'
                : 'Mantenimientos al día'}
            </span>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Inversión en este Auto
            </span>
            <p className="text-lg sm:text-xl font-black text-emerald-400">
              ${totalCostInvested.toLocaleString('es-AR')}
            </p>
            <span className="text-[10px] text-slate-400 block">Total invertido en services</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 4: PESTAÑAS: ¿QUÉ SE LE HIZO? vs ¿QUÉ LE FALTA HACER?             */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 flex items-center gap-2 shadow-xl">
        
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
          <span>📋 ¿Qué se le hizo? Historial de este Auto ({services.length})</span>
        </button>

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

      {/* ========================================================================= */}
      {/* CONTENIDO PESTAÑA 1: HISTORIAL REALIZADO DE ESTE AUTO                     */}
      {/* ========================================================================= */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            <div className="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={`Buscar en la libreta de ${currentVehicle?.model} (ej. aceite, bujías, frenos)...`}
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

          </div>

          {filteredHistory.length === 0 ? (
            <div className="bg-slate-800/60 border border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-black text-white">No hay services registrados en este vehículo</h3>
                <p className="text-xs text-slate-400">
                  {services.length === 0
                    ? `La libreta de tu ${currentVehicleTitle} está en blanco. Hacé clic abajo para anotar tu primer service realizado.`
                    : 'No hay coincidencias con los filtros aplicados.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCreateModal()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Anotar Primer Service en este Auto</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredHistory.map((service) => (
                <div
                  key={service.id}
                  className="bg-slate-800/95 border border-slate-700 hover:border-slate-600 rounded-2xl p-4 sm:p-5 shadow-xl transition space-y-3"
                >
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

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {service.title}
                    </h3>

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

                    {onNavigateCotizador && (
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigateCotizador({
                            partName: `Repuestos para ${service.title} (${currentVehicleTitle})`,
                            vehicle: currentVehicle
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

      {/* ========================================================================= */}
      {/* CONTENIDO PESTAÑA 2: ¿QUÉ LE FALTA HACER? A ESTE AUTO ESPECÍFICO           */}
      {/* ========================================================================= */}
      {activeTab === 'pendientes' && (
        <div className="space-y-6">
          
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Diagnóstico Oficial para {currentVehicle?.brand} {currentVehicle?.model}
              </span>
              <h3 className="text-lg font-black text-white">
                Mantenimientos Programados según Odómetro ({currentKm.toLocaleString('es-AR')} KM)
              </h3>
              <p className="text-xs text-slate-300">
                Cruzamos los kilómetros de tu {currentVehicleTitle} con su ficha técnica oficial de fábrica para decirte exactamente qué tenés vencido y qué te toca hacer:
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCreateModal()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition shrink-0 cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Anotar Service</span>
            </button>
          </div>

          {/* Vencidos / Urgentes */}
          {pendingServices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                <h3 className="text-base sm:text-lg font-black text-red-400 uppercase tracking-tight">
                  🚨 Mantenimientos Vencidos en este Auto ({pendingServices.length})
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Tu odómetro superó el kilometraje recomendado para estos trabajos. Hacé clic en "Ya lo hice" para guardarlos o pedí cotización de los repuestos.
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
                            Crítico
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenCreateModal({
                            km: item.km,
                            title: item.title,
                            category: item.category,
                            parts: item.parts,
                            notes: `Registrado para ${currentVehicleTitle} desde alertas de libreta (${item.km.toLocaleString('es-AR')} km).`
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
                              vehicle: currentVehicle
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

          {/* Próximos en menos de 10.000 KM */}
          {upcomingServices.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-tight">
                  🔔 Próximos Services Inmediatos (En menos de 10.000 KM)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Servicios a realizar en breve para tu {currentVehicle?.brand} {currentVehicle?.model}:
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
                          <span>Anotar ya</span>
                        </button>

                        {onNavigateCotizador && (
                          <button
                            type="button"
                            onClick={() => onNavigateCotizador({
                              partName: `Kit de repuestos para ${item.title} (${currentVehicleTitle})`,
                              vehicle: currentVehicle
                            })}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Presupuestar repuestos</span>
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
                      <span className="text-[11px] font-bold text-slate-400">Repuestos requeridos:</span>
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

          {/* Programados a futuro */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm sm:text-base font-black text-slate-400 uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Mantenimientos Futuros Programados (+10.000 KM)</span>
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

      {/* ========================================================================= */}
      {/* MODAL: INSCRIBIR NUEVO AUTO A MI NOMBRE                                   */}
      {/* ========================================================================= */}
      {isAddVehicleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 text-white relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  Inscribir Auto a mi Nombre en DinAcitY
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVehicleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Ingresá la patente del vehículo que querés sumar a tu garaje. El sistema decodifica automáticamente el motor, modelo, chasis y radicación con la base DNRPA.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Patente Argentina (*):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newVehiclePlateInput}
                    onChange={(e) => setNewVehiclePlateInput(e.target.value.toUpperCase())}
                    placeholder="Ej. AF 782 QW o AC 821 GH"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-yellow-300 font-mono font-bold focus:border-amber-400 focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleLookupNewVehicle}
                    disabled={isLookingUpPlate}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {isLookingUpPlate ? 'Consultando...' : 'Buscar DNRPA'}
                  </button>
                </div>
              </div>

              {/* Sugerencias Rápidas */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Patentes de prueba para inscribir:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { p: 'AF 782 QW', m: 'Peugeot 208 1.6' },
                    { p: 'AC 821 GH', m: 'Fiat Cronos 1.3' },
                    { p: 'AE 341 KL', m: 'Chevrolet Onix 1.0T' },
                    { p: 'HRT 892', m: 'Ford Ranger 3.0' }
                  ].map((s) => (
                    <button
                      key={s.p}
                      type="button"
                      onClick={() => {
                        setNewVehiclePlateInput(s.p);
                        const res = clientFallbackService.lookupPatente(s.p);
                        if (res && res.data) setNewVehicleLookupData(res.data);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                    >
                      {s.p} ({s.m})
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview del Vehículo Encontrado */}
              {newVehicleLookupData && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/50 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-black text-emerald-300 uppercase">Vehículo Identificado en DNRPA</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">
                      {newVehicleLookupData.brand} {newVehicleLookupData.model} {newVehicleLookupData.version} ({newVehicleLookupData.year})
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Motor: <strong className="text-white">{newVehicleLookupData.engine?.name || '1.6 Nafta'}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Radicación: {newVehicleLookupData.dnrpa?.seccional || 'Mendoza'} • Chasis: {newVehicleLookupData.chassis?.vin || 'OK'}
                    </p>
                  </div>

                  <div className="pt-1">
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Kilómetros Actuales al Inscribir:
                    </label>
                    <input
                      type="number"
                      value={newVehicleKmInput}
                      onChange={(e) => setNewVehicleKmInput(e.target.value)}
                      placeholder="Ej. 45000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-yellow-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={!newVehicleLookupData}
                  onClick={handleConfirmInscribeCar}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition disabled:opacity-40 cursor-pointer"
                >
                  Confirmar e Inscribir Auto
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ANOTAR O EDITAR SERVICE                                            */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 text-white relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {editingServiceId ? 'Editar Service' : `Anotar Service para ${currentVehicle?.brand} ${currentVehicle?.model}`}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Título o Descripción del Service (*):
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Otros repuestos o detalles específicos (separados por coma):
                </label>
                <input
                  type="text"
                  value={formData.customParts}
                  onChange={(e) => setFormData(prev => ({ ...prev, customParts: e.target.value }))}
                  placeholder="Ej. Líquido limpiaparabrisas, retén de distribución"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Taller Mecánico / Lubricentro / Particular:
                  </label>
                  <input
                    type="text"
                    value={formData.workshop}
                    onChange={(e) => setFormData(prev => ({ ...prev, workshop: e.target.value }))}
                    placeholder="Ej. Taller Mecánico San Martín"
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Notas u Observaciones del dueño:
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ej. Se usó aceite sintético Castrol Edge. Pastillas delanteras con 70% de vida útil."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-blue-400 focus:outline-none"
                />
              </div>

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
                  <span>{editingServiceId ? 'Guardar Cambios' : 'Anotar en la Libreta'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
