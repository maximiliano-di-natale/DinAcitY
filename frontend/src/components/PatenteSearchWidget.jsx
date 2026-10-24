import React, { useState, useEffect, useMemo } from 'react';
import {
  Car,
  Bike,
  Truck,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Sparkles,
  MapPin,
  Gauge,
  Fuel,
  Bookmark,
  MessageCircle,
  BookOpen,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Search,
  Check,
  Edit3,
  Calendar,
  Clock,
  Sliders,
  Layers,
  Globe
} from 'lucide-react';
import { CLIENT_TAXONOMY, clientFallbackService } from '../services/clientFallbackService.js';

export function PatenteSearchWidget({
  onSelectVehicle,
  onNavigateCotizador,
  onNavigateMantenimiento,
  onNavigateLibreta,
  onNavigateGuantera,
  onNavigateKits,
  onNavigateMapa
}) {
  // Pestañas internas: 'manual' (Carga / Edición Guiada) | 'cochera' (Mis Vehículos)
  const [activeTab, setActiveTab] = useState('manual');

  // Vehículo actualmente seleccionado / activo
  const [activeVehicle, setActiveVehicle] = useState(() => {
    return clientFallbackService.getActiveCocheraVehicle();
  });

  // Modo del formulario: 'edit' (modificar datos de un auto existente) | 'new' (inscribir auto nuevo)
  const [formMode, setFormMode] = useState('edit');
  const [editingVehicleId, setEditingVehicleId] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    return act?.id || null;
  });

  // Estado del formulario inicializado con el vehículo activo para no crear duplicados
  const [manualType, setManualType] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    return act?.vehicleType || 'auto';
  });
  const [manualBrand, setManualBrand] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    return act?.brand || 'Toyota';
  });
  const [manualModel, setManualModel] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    return act?.model || 'Hilux';
  });
  const [manualYear, setManualYear] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    return (act?.year || 2022).toString();
  });
  const [manualEngine, setManualEngine] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    return act?.engine?.name || (typeof act?.engine === 'string' ? act.engine : '2.8 D-4D 16V Turbo Diésel (204 CV)');
  });
  const [manualKm, setManualKm] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    return (act?.currentKm || 60000).toString();
  });
  const [manualPatente, setManualPatente] = useState(() => {
    const act = clientFallbackService.getActiveCocheraVehicle();
    const isCustom = act?.hasCustomPlate !== false && act?.patente && !act.patente.startsWith('AUTO');
    return isCustom ? (act.displayPlate || act.patente) : '';
  });

  // Filtro de origen de marcas (Alemanas, Americanas, Europeas, Asiáticas, Chinas, Todas)
  const [brandOriginFilter, setBrandOriginFilter] = useState('all');

  // Filtro de etapas de kilometraje (0-100k, 100k-200k, 200k-300k, 300k-400k, 400k-500k, all)
  const [selectedKmStage, setSelectedKmStage] = useState('all');

  // Lista de vehículos en la Cochera Digital
  const [cocheraList, setCocheraList] = useState(() => {
    return clientFallbackService.getCocheraVehicles();
  });

  const [toastMessage, setToastMessage] = useState('');

  // Definición de Pestañas de Origen de Marcas por Tipo de Vehículo
  const originFiltersByType = {
    auto: [
      { id: 'all', label: 'Todas (37)', icon: '🌍' },
      { id: 'aleman', label: 'Alemanas 🇩🇪', match: (o) => (o || '').includes('Alemán') },
      { id: 'americano', label: 'Americanas 🇺🇸', match: (o) => (o || '').includes('Americano') },
      { id: 'europeo', label: 'Europeas 🇪🇺', match: (o) => (o || '').includes('Europeo') },
      { id: 'asiatico', label: 'Asiáticas 🇯🇵🇰🇷', match: (o) => (o || '').includes('Japonés') || (o || '').includes('Coreano') },
      { id: 'chino', label: 'Chinas 🇨🇳', match: (o) => (o || '').includes('Chino') }
    ],
    moto: [
      { id: 'all', label: 'Todas (22)', icon: '🌍' },
      { id: 'japones', label: 'Japonesas 🇯🇵', match: (o) => (o || '').includes('Japonés') },
      { id: 'nacional', label: 'Nacionales / Mercosur 🇦🇷', match: (o) => (o || '').includes('Nacional') },
      { id: 'india', label: 'Indias 🇮🇳', match: (o) => (o || '').includes('India') },
      { id: 'europeo', label: 'Europeas 🇪🇺', match: (o) => (o || '').includes('Europeo') || (o || '').includes('Alemán') || (o || '').includes('Italiana') || (o || '').includes('Británica') || (o || '').includes('Austríaco') || (o || '').includes('Sueca') },
      { id: 'chino', label: 'Chinas / Premium 🇨🇳', match: (o) => (o || '').includes('Chino') || (o || '').includes('Taiwanesa') || (o || '').includes('Italo-China') }
    ],
    camion: [
      { id: 'all', label: 'Todas (15)', icon: '🌍' },
      { id: 'europeo', label: 'Europeas / Mercosur 🇪🇺🇦🇷', match: (o) => (o || '').includes('Europeo') || (o || '').includes('Mercosur') || (o || '').includes('Sueco') },
      { id: 'aleman', label: 'Alemanas 🇩🇪', match: (o) => (o || '').includes('Alemán') },
      { id: 'americano', label: 'Americanas 🇺🇸', match: (o) => (o || '').includes('Americano') },
      { id: 'asiatico', label: 'Asiáticas 🇯🇵🇰🇷', match: (o) => (o || '').includes('Japonés') || (o || '').includes('Coreano') },
      { id: 'chino', label: 'Chinas 🇨🇳', match: (o) => (o || '').includes('Chino') }
    ]
  };

  // Hitos de kilometraje ampliados de 10.000 a 500.000 km (Idéntico a Pasaporte Service)
  const mileageMilestones = [
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
    120000, 140000, 150000, 160000, 180000, 200000, 220000, 240000, 250000, 260000, 280000, 300000,
    320000, 340000, 350000, 360000, 380000, 400000, 420000, 440000, 450000, 460000, 480000, 500000
  ];

  // Etapas del Parque Automotor Argentino
  const kmStages = [
    { id: 'all', label: 'Todos los Hitos', sub: '10k a 500k km', min: 0, max: 500000 },
    { id: '0-100k', label: '0 a 100.000 km', sub: 'Rodaje & Garantía', min: 0, max: 100000 },
    { id: '100-200k', label: '100k a 200.000 km', sub: 'Embrague & Caja', min: 100001, max: 200000 },
    { id: '200-300k', label: '200k a 300.000 km', sub: 'Promedio Argentina', min: 200001, max: 300000 },
    { id: '300-400k', label: '300k a 400.000 km', sub: 'Motor Mayor', min: 300001, max: 400000 },
    { id: '400-500k', label: '400k a 500.000 km', sub: 'Medio Millón de Km', min: 400001, max: 500000 }
  ];

  // Presets de muestra rápida enriquecidos con marcas globales
  const categorySamples = {
    auto: [
      { brand: 'Toyota', model: 'Hilux', year: 2022, engine: '2.8 D-4D Turbo (204 CV)', km: 45000, plate: 'AF 482 QZ' },
      { brand: 'Volkswagen', model: 'Gol Trend', year: 2019, engine: '1.6 MSI (101 CV)', km: 68000, plate: 'AD 192 OP' },
      { brand: 'Fiat', model: 'Cronos', year: 2021, engine: '1.3 GSE Firefly (99 CV)', km: 38000, plate: 'AE 341 KL' },
      { brand: 'Chevrolet', model: 'Cruze', year: 2020, engine: '1.4 Ecotec Turbo (153 CV)', km: 55000, plate: 'AD 789 LK' },
      { brand: 'Peugeot', model: '208', year: 2022, engine: '1.6 VTi (115 CV)', km: 32000, plate: 'AF 123 CD' },
      { brand: 'Chery', model: 'Tiggo 4', year: 2021, engine: '1.5 Turbo (147 CV)', km: 42000, plate: 'AE 890 ZX' },
      { brand: 'Haval', model: 'H6', year: 2023, engine: '2.0 GDIT Turbo (201 CV)', km: 18000, plate: 'AG 554 TY' }
    ],
    moto: [
      { brand: 'Honda', model: 'XR 250 Tornado', year: 2021, engine: '249 cc DOHC 4V', km: 15000, plate: 'A 042 BVC' },
      { brand: 'Yamaha', model: 'FZ FI 150', year: 2022, engine: '149 cc BlueCore', km: 12000, plate: 'A 123 BCD' },
      { brand: 'Motomel', model: 'Blitz 110', year: 2015, engine: '108 cc CUB', km: 28000, plate: '482 ABC' },
      { brand: 'Benelli', model: 'TRK 502 / 502X', year: 2022, engine: '500 cc Bicilíndrico (47 CV)', km: 22000, plate: 'A 198 GTR' },
      { brand: 'Bajaj', model: 'Rouser NS 200', year: 2020, engine: '199.5 cc Triple Chispa', km: 35000, plate: 'A 099 FGH' }
    ],
    camion: [
      { brand: 'Iveco', model: 'Tector 170E22 / 170E28', year: 2022, engine: '5.9 Turbo 280CV', km: 160000, plate: 'AF 912 OP' },
      { brand: 'Mercedes-Benz (Pesados)', model: '1620', year: 2008, engine: 'OM 366 LA Turbo', km: 380000, plate: 'RST 123' },
      { brand: 'Scania', model: 'R 450', year: 2021, engine: '13.0 Turbodiésel 450CV', km: 240000, plate: 'AE 450 TR' },
      { brand: 'Foton (Camiones)', model: 'Aumark S 6t', year: 2023, engine: 'Cummins ISF 3.8 Turbo', km: 65000, plate: 'AG 201 FT' }
    ]
  };

  // Obtener todas las marcas según el tipo actual
  const allBrandsForCurrentType = useMemo(() => {
    return (CLIENT_TAXONOMY[manualType] || CLIENT_TAXONOMY.auto).brands || [];
  }, [manualType]);

  // Filtrar marcas según la pestaña de origen seleccionada
  const filteredBrands = useMemo(() => {
    const tabs = originFiltersByType[manualType] || originFiltersByType.auto;
    const currentTab = tabs.find((t) => t.id === brandOriginFilter);
    if (!currentTab || currentTab.id === 'all') {
      return allBrandsForCurrentType;
    }
    return allBrandsForCurrentType.filter((b) => currentTab.match(b.origin));
  }, [allBrandsForCurrentType, brandOriginFilter, manualType]);

  // Cargar modelos según la marca manual elegida
  const currentBrandModels = () => {
    const found = allBrandsForCurrentType.find(
      (b) => b.name.toLowerCase() === manualBrand.toLowerCase() || b.id === manualBrand.toLowerCase()
    );
    return found ? found.models : [];
  };

  // Al cambiar de marca, actualizar el modelo al primero disponible
  const handleBrandChange = (brandName) => {
    setManualBrand(brandName);
    const found = allBrandsForCurrentType.find(
      (b) => b.name.toLowerCase() === brandName.toLowerCase() || b.id === brandName.toLowerCase()
    );
    if (found && found.models.length > 0) {
      setManualModel(found.models[0]);
    }
  };

  // Al cambiar tipo de vehículo
  const handleTypeChange = (type) => {
    setManualType(type);
    setBrandOriginFilter('all');
    const brands = (CLIENT_TAXONOMY[type] || CLIENT_TAXONOMY.auto).brands;
    const firstBrand = brands[0] ? brands[0].name : 'Volkswagen';
    setManualBrand(firstBrand);
    if (brands[0] && brands[0].models.length > 0) {
      setManualModel(brands[0].models[0]);
    }
  };

  // Helper para sumar o restar 10.000 km
  const handleStepKm = (delta) => {
    const current = parseInt(manualKm, 10) || 60000;
    const next = Math.max(10000, Math.min(500000, current + delta));
    setManualKm(next.toString());
  };

  // Filtrar hitos de kilometraje según etapa
  const visibleMilestones = useMemo(() => {
    const stage = kmStages.find((s) => s.id === selectedKmStage);
    if (!stage || stage.id === 'all') return mileageMilestones;
    return mileageMilestones.filter((km) => km >= stage.min && km <= stage.max);
  }, [selectedKmStage]);

  // Cargar datos de un vehículo en el formulario para editarlo
  const populateFormWithVehicle = (vehicle) => {
    if (!vehicle) return;
    setFormMode('edit');
    setEditingVehicleId(vehicle.id || null);
    setManualType(vehicle.vehicleType || 'auto');
    setManualBrand(vehicle.brand || 'Toyota');
    setManualModel(vehicle.model || 'Hilux');
    setManualYear((vehicle.year || 2022).toString());
    setManualEngine(
      vehicle.engine?.name || (typeof vehicle.engine === 'string' ? vehicle.engine : 'Motor Homologado')
    );
    setManualKm((vehicle.currentKm || 60000).toString());
    const isCustom = vehicle.hasCustomPlate !== false && vehicle.patente && !vehicle.patente.startsWith('AUTO');
    setManualPatente(isCustom ? (vehicle.displayPlate || vehicle.patente) : '');
  };

  // Iniciar edición de un auto
  const handleStartEditVehicle = (vehicle) => {
    const target = vehicle || activeVehicle;
    if (!target) return;
    populateFormWithVehicle(target);
    setActiveTab('manual');
  };

  // Iniciar registro de un NUEVO auto DISTINTO
  const handleStartNewVehicle = () => {
    setFormMode('new');
    setEditingVehicleId(null);
    setManualType('auto');
    setManualBrand('Volkswagen');
    setManualModel('Gol Trend');
    setManualYear('2021');
    setManualEngine('1.6 MSI (101 CV)');
    setManualKm('55000');
    setManualPatente('');
    setActiveTab('manual');
    setToastMessage('Modo: Inscribiendo un nuevo vehículo distinto para tu Cochera');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Guardar y activar vehículo cargado a mano (modifica el existente si se edita, o crea uno nuevo si se pide explícitamente)
  const handleSaveManualVehicle = (e) => {
    e?.preventDefault();
    if (!manualBrand.trim() || !manualModel.trim()) {
      return;
    }

    const isEditMode = formMode === 'edit' && !!editingVehicleId;

    const vehicle = clientFallbackService.buildVehicleFromManualInput({
      id: isEditMode ? editingVehicleId : null,
      vehicleType: manualType,
      brand: manualBrand,
      model: manualModel,
      year: manualYear,
      engine: manualEngine,
      currentKm: manualKm,
      patente: manualPatente
    });

    let updated;
    if (isEditMode) {
      // Modificar el auto que ya está en la cochera SIN generar uno nuevo
      updated = clientFallbackService.updateVehicleInCochera(vehicle);
      setToastMessage(`✅ ¡Datos de ${vehicle.brand} ${vehicle.model} modificados con éxito! (Sin duplicar en cochera)`);
    } else {
      // Solamente cuando se genera uno nuevo, se guarda en la cochera uno distinto
      updated = clientFallbackService.saveToCochera(vehicle, { isNew: true });
      setToastMessage(`🎉 ¡Nuevo vehículo ${vehicle.brand} ${vehicle.model} guardado en tu Cochera!`);
      // A partir de ahora, queda registrado para edición directa
      setFormMode('edit');
      setEditingVehicleId(vehicle.id);
    }

    setCocheraList(updated);
    setActiveVehicle(vehicle);

    // Notificar a toda la aplicación
    if (onSelectVehicle) {
      onSelectVehicle({
        query: vehicle.model,
        vehicleType: vehicle.vehicleType,
        brand: vehicle.brand.toLowerCase(),
        model: vehicle.model,
        year: vehicle.year.toString(),
        engineSpec: vehicle.engine?.name || '',
        currentKm: vehicle.currentKm,
        fullVehicleTitle: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
        patente: vehicle.displayPlate || vehicle.patente,
        data: vehicle
      });
    }

    setTimeout(() => setToastMessage(''), 3500);
  };

  // Seleccionar vehículo desde la cochera
  const handleSelectFromCochera = (item) => {
    clientFallbackService.setActiveCocheraVehicle(item);
    setActiveVehicle(item);
    populateFormWithVehicle(item); // Deja el formulario listo para editar este auto
    if (onSelectVehicle) {
      onSelectVehicle({
        query: item.model,
        vehicleType: item.vehicleType || 'auto',
        brand: (item.brand || 'auto').toLowerCase(),
        model: item.model,
        year: (item.year || 2020).toString(),
        engineSpec: item.engine?.name || '',
        currentKm: item.currentKm || 60000,
        fullVehicleTitle: `${item.brand} ${item.model} (${item.year || ''})`,
        patente: item.displayPlate || item.patente,
        data: item
      });
    }
    setToastMessage(`Vehículo activo: ${item.brand} ${item.model}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Eliminar vehículo de la cochera
  const handleRemoveFromCochera = (e, item) => {
    e.stopPropagation();
    const updated = clientFallbackService.removeFromCochera(item.id || item.patente);
    setCocheraList(updated);
    if (activeVehicle?.id === item.id || activeVehicle?.patente === item.patente) {
      const next = updated[0] || null;
      setActiveVehicle(next);
      if (next) {
        populateFormWithVehicle(next);
      }
      if (next && onSelectVehicle) {
        onSelectVehicle({
          query: next.model,
          vehicleType: next.vehicleType || 'auto',
          brand: (next.brand || 'auto').toLowerCase(),
          model: next.model,
          year: (next.year || 2020).toString(),
          engineSpec: next.engine?.name || '',
          currentKm: next.currentKm || 60000,
          fullVehicleTitle: `${next.brand} ${next.model} (${next.year || ''})`,
          patente: next.displayPlate || next.patente,
          data: next
        });
      }
    }
  };

  // Cargar muestra de 1 clic
  const handleLoadSample = (sample, type) => {
    setManualType(type);
    setManualBrand(sample.brand);
    setManualModel(sample.model);
    setManualYear(sample.year.toString());
    setManualEngine(sample.engine);
    setManualKm(sample.km.toString());
    setManualPatente(sample.plate);

    const isEditMode = formMode === 'edit' && !!editingVehicleId;

    const vehicle = clientFallbackService.buildVehicleFromManualInput({
      id: isEditMode ? editingVehicleId : null,
      vehicleType: type,
      brand: sample.brand,
      model: sample.model,
      year: sample.year,
      engine: sample.engine,
      currentKm: sample.km,
      patente: sample.plate
    });

    let updated;
    if (isEditMode) {
      updated = clientFallbackService.updateVehicleInCochera(vehicle);
      setToastMessage(`✅ ¡${sample.brand} ${sample.model} cargado en tu auto actual! (Sin duplicar)`);
    } else {
      updated = clientFallbackService.saveToCochera(vehicle, { isNew: true });
      setToastMessage(`🎉 ¡${sample.brand} ${sample.model} guardado como nuevo en tu Cochera!`);
      setFormMode('edit');
      setEditingVehicleId(vehicle.id);
    }

    setCocheraList(updated);
    setActiveVehicle(vehicle);

    if (onSelectVehicle) {
      onSelectVehicle({
        query: vehicle.model,
        vehicleType: vehicle.vehicleType,
        brand: vehicle.brand.toLowerCase(),
        model: vehicle.model,
        year: vehicle.year.toString(),
        engineSpec: vehicle.engine?.name || '',
        currentKm: vehicle.currentKm,
        fullVehicleTitle: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
        patente: vehicle.displayPlate || vehicle.patente,
        data: vehicle
      });
    }

    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-blue-800/40 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/4 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-900/60 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs flex items-center gap-1">
              <span>🚗</span> Mi Cochera Digital DinAcitY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Catálogo Mundial: Chinos, Alemanes, Americanos, Europeos, Asiáticos
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/60 text-blue-200 border border-blue-500/30">
              📍 Mendoza, Argentina
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Cargá tu Vehículo y Gestioná su Mantenimiento Exacto
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-3xl leading-relaxed">
            Ingresá tu auto, moto o camión a mano para que DinAcitY calcule al instante el <strong>kilometraje de cambio de cada repuesto (10.000 a 500.000 km)</strong>, <strong>fluidos homologados</strong>, cotizaciones por WhatsApp en mostradores de Mendoza y <strong>alertas de RTO y seguro</strong>.
          </p>
        </div>

        {/* Tab Switcher Superior */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-blue-900/70">
            <button
              type="button"
              onClick={() => {
                setActiveTab('manual');
                if (!editingVehicleId && activeVehicle) {
                  populateFormWithVehicle(activeVehicle);
                }
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {formMode === 'edit' ? (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✏️ Datos de mi Auto</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>➕ Cargar Nuevo Auto</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cochera')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cochera'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🚘 Mis Autos ({cocheraList.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleStartNewVehicle}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
            title="Cargar un nuevo vehículo distinto a mi Cochera"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>➕ Agregar Nuevo Auto</span>
          </button>
        </div>
      </div>

      {/* Toast de confirmación */}
      {toastMessage && (
        <div className="mt-4 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-bounce z-20">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 1: FORMULARIO DE CARGA GUIADA A MANO */}
      {activeTab === 'manual' && (
        <div className="mt-5 relative z-10 space-y-6">
          
          {/* Banner Informativo de Modo: Modificar Auto Existente vs Cargar Auto Nuevo Distinto */}
          {formMode === 'edit' && editingVehicleId ? (
            <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300 shrink-0">
                  <Edit3 className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-white">
                      Modificando datos de: {manualBrand} {manualModel} ({manualYear})
                    </span>
                    <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded font-black">
                      Auto en Cochera
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200">
                    Al guardar, se modifican los datos de este auto sin generar duplicados en tu cochera.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartNewVehicle}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Cargar un auto NUEVO distinto</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
                  <Plus className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-white">
                      Registrando un Nuevo Vehículo Distinto
                    </span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded font-black">
                      Nuevo en Cochera
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    Se guardará como un auto adicional en tu cochera ({cocheraList.length} existentes).
                  </p>
                </div>
              </div>

              {activeVehicle && (
                <button
                  type="button"
                  onClick={() => handleStartEditVehicle(activeVehicle)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs shadow transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Volver a {activeVehicle.brand} {activeVehicle.model}</span>
                </button>
              )}
            </div>
          )}

          {/* Tarjeta del Formulario Principal */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
            
            {/* 1. Selector de Tipo de Vehículo */}
            <div>
              <label className="block text-xs font-black uppercase text-blue-300 tracking-wider mb-2">
                Paso 1: ¿Qué tipo de vehículo tenés?
              </label>
              <div className="grid grid-cols-3 gap-2.5 max-w-md">
                <button
                  type="button"
                  onClick={() => handleTypeChange('auto')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    manualType === 'auto'
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Auto / SUV</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('moto')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    manualType === 'moto'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Moto</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('camion')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    manualType === 'camion'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Camión</span>
                </button>
              </div>
            </div>

            {/* 2. Selector Completo de Marcas del Mercado Mundial en Argentina */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="block text-xs font-black uppercase text-blue-300 tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>Paso 2: Marca (Catálogo Mundial en Argentina: Chinas, Alemanas, Americanas, Europeas, Asiáticas)</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {filteredBrands.length} de {allBrandsForCurrentType.length} marcas disponibles
                </span>
              </div>

              {/* Pestañas de origen de marcas */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(originFiltersByType[manualType] || originFiltersByType.auto).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBrandOriginFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      brandOriginFilter === tab.id
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-102'
                        : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Grilla interactiva de marcas filtradas */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/90">
                {filteredBrands.map((b) => {
                  const isSelected = manualBrand.toLowerCase() === b.name.toLowerCase() || manualBrand.toLowerCase() === b.id.toLowerCase();
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleBrandChange(b.name)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-300 shadow-md scale-105 ring-2 ring-blue-400/40'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-[10px] opacity-70 font-normal">({b.origin})</span>
                    </button>
                  );
                })}
              </div>

              {/* Selector alternativo en Dropdown para selección rápida directa de la A a la Z */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-semibold shrink-0">O elegí de la lista completa A-Z:</span>
                <select
                  value={manualBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
                >
                  {allBrandsForCurrentType.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} — {b.origin} ({b.models.length} modelos)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Grid de Datos Específicos: Modelo, Año, Motor y Patente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800">
              
              {/* Modelo */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5">
                  Modelo ({manualBrand}):
                </label>
                {currentBrandModels().length > 0 ? (
                  <select
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                  >
                    {currentBrandModels().map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="Otro">Otro Modelo (escribir)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    placeholder="Ej: Gol Trend, Hilux, Cronos, Tiggo"
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                  />
                )}
                {manualModel === 'Otro' && (
                  <input
                    type="text"
                    onChange={(e) => setManualModel(e.target.value)}
                    placeholder="Escribí el nombre del modelo"
                    className="mt-2 w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none"
                  />
                )}
              </div>

              {/* Año */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5">
                  Año de Fabricación:
                </label>
                <select
                  value={manualYear}
                  onChange={(e) => setManualYear(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                >
                  {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Motorización / Combustible */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5">
                  Motor / Combustible:
                </label>
                <input
                  type="text"
                  value={manualEngine}
                  onChange={(e) => setManualEngine(e.target.value)}
                  placeholder="Ej: 1.6 MSI, 2.0 TDI, 1.5 Turbo, 250cc"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none"
                />
              </div>

              {/* Patente Opcional */}
              <div>
                <label className="block text-xs font-black text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Chapa Patente (Opcional):</span>
                  <span className="text-[10px] text-blue-400 font-normal">Para RTO Mendoza</span>
                </label>
                <input
                  type="text"
                  value={manualPatente}
                  onChange={(e) => setManualPatente(e.target.value.toUpperCase())}
                  placeholder="Ej: AF 482 QZ / KRX 105"
                  maxLength={10}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white font-mono font-black uppercase tracking-wider focus:outline-none"
                />
              </div>

            </div>

            {/* 4. Kilometraje Actual del Odómetro (CON PARIDAD TOTAL A PASAPORTE SERVICE: 10k a 500k KM) */}
            <div className="p-4 sm:p-5 bg-slate-950/80 border-2 border-sky-500/50 rounded-2xl space-y-4 shadow-xl">
              
              {/* Cabecera del odómetro e input digital con botones +/- 10.000 km */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <label className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-sky-400" />
                    <span>Kilometraje Actual de tu Odómetro (Crucial para Services)</span>
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculamos exactamente qué repuesto cambiar hoy y cuál en el próximo service (10.000 a 500.000 km).
                  </p>
                </div>

                {/* Caja digital con botones +/- 10.000 km */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleStepKm(-10000)}
                    disabled={(parseInt(manualKm, 10) || 0) <= 10000}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                    title="Restar 10.000 km"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border-2 border-sky-400/50 shadow-inner">
                    <input
                      type="number"
                      value={manualKm}
                      onChange={(e) => setManualKm(e.target.value)}
                      step="1000"
                      min="0"
                      max="600000"
                      className="w-28 text-center font-mono font-black text-xl bg-transparent text-sky-300 focus:outline-none"
                    />
                    <span className="text-xs font-black text-slate-400">KM</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStepKm(10000)}
                    disabled={(parseInt(manualKm, 10) || 0) >= 500000}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                    title="Sumar 10.000 km"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slider interactivo hasta 500.000 km */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>10.000 km (Nuevo)</span>
                  <span className="text-sky-300 font-mono font-black text-xs">
                    Odómetro en vivo: {(parseInt(manualKm, 10) || 0).toLocaleString('es-AR')} km
                  </span>
                  <span>500.000 km (Medio Millón)</span>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={parseInt(manualKm, 10) || 60000}
                  onChange={(e) => setManualKm(e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10k</span>
                  <span>100k</span>
                  <span>200k (Promedio Arg)</span>
                  <span>300k</span>
                  <span>400k</span>
                  <span>500k km</span>
                </div>
              </div>

              {/* Filtros de etapas del odómetro */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    Filtrar Hitos por Rango de Kilómetros:
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Mostrando {visibleMilestones.length} hitos programados
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {kmStages.map((stage) => (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setSelectedKmStage(stage.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                        selectedKmStage === stage.id
                          ? 'bg-sky-600 text-white border-sky-400 shadow-md scale-102'
                          : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      <span>{stage.label}</span>
                      <span className="text-[10px] block opacity-75 leading-none mt-0.5">{stage.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botones de hitos de kilometraje rápido (10.000 a 500.000 KM) */}
              <div className="flex items-center gap-1.5 flex-wrap max-h-40 overflow-y-auto pr-1">
                {visibleMilestones.map((km) => {
                  const isMilestoneActive = parseInt(manualKm, 10) === km;
                  const isMilestoneCritical = km >= 60000 && (km % 60000 === 0 || km % 120000 === 0);

                  return (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setManualKm(km.toString())}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                        isMilestoneActive
                          ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-md scale-105 ring-2 ring-sky-300/40'
                          : isMilestoneCritical
                          ? 'bg-slate-900 text-amber-300 hover:text-white hover:bg-amber-950/60 border-amber-800/60'
                          : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      <span>{(km / 1000)}k km</span>
                      {isMilestoneCritical && <span className="ml-1 text-[9px] text-yellow-300">★</span>}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Botón Principal de Envío */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {formMode === 'edit'
                  ? '✓ Se modificarán los datos de este vehículo en tu Cochera (sin generar duplicados).'
                  : '✓ Se guardará como un nuevo vehículo independiente en tu Cochera.'}
              </span>

              <button
                type="button"
                onClick={handleSaveManualVehicle}
                className={`w-full sm:w-auto px-8 py-3.5 text-white rounded-xl font-black text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98 ${
                  formMode === 'edit'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/30'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/30'
                }`}
              >
                {formMode === 'edit' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>Guardar Cambios en este Auto (Modificar)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-white" />
                    <span>Guardar Nuevo Auto en mi Cochera</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Modelos Pre-cargados de Ejemplo (Para probar con 1 solo clic) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2">
              💡 ¿Querés probar rápido? Hacé clic en un modelo de ejemplo:
            </span>
            <div className="flex flex-wrap gap-2">
              {(categorySamples[manualType] || categorySamples.auto).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(s, manualType)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>{s.brand} {s.model} ({s.year})</span>
                  <span className="text-[10px] text-blue-300 font-mono">[{s.km.toLocaleString('es-AR')} km]</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: MIS VEHÍCULOS GUARDADOS (COCHERA DIGITAL) */}
      {activeTab === 'cochera' && (
        <div className="mt-5 relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Tenés <strong>{cocheraList.length}</strong> vehículos guardados en tu cochera. Hacé clic en cualquiera para activarlo.
            </span>
            <button
              type="button"
              onClick={handleStartNewVehicle}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Cargar nuevo auto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cocheraList.map((item) => {
              const isActive = activeVehicle?.id === item.id || activeVehicle?.patente === item.patente;

              return (
                <div
                  key={item.id || item.patente}
                  onClick={() => handleSelectFromCochera(item)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-900/60 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-2 ring-blue-400/50'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-700/80 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-black bg-black text-white border border-gray-600 shadow-xs">
                        {item.displayPlate || item.patente}
                      </span>
                      <div className="flex items-center gap-1">
                        {isActive && (
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            ✓ Activo
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditVehicle(item);
                          }}
                          className="text-slate-400 hover:text-blue-300 p-1 transition cursor-pointer"
                          title="Modificar datos de este auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveFromCochera(e, item)}
                          className="text-slate-500 hover:text-red-400 p-1 transition cursor-pointer"
                          title="Eliminar de mi cochera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-black text-base text-white">
                      {item.brand} {item.model} <span className="text-xs text-slate-400 font-normal">({item.year})</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {item.engine?.name || item.version || 'Motor Homologado'}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono font-bold border border-sky-800">
                        Odómetro: {(item.currentKm || 60000).toLocaleString('es-AR')} km
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">📍 Mendoza</span>
                    <span className={`font-black ${isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-400'}`}>
                      {isActive ? 'Activo en uso ➔' : 'Activar vehículo ➔'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FICHA TÉCNICA Y ACCIONES DEL VEHÍCULO ACTIVO */}
      {activeVehicle && (
        <div className="mt-6 bg-slate-900/95 border-2 border-blue-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative z-10 animate-fadeIn space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-black bg-blue-600 text-white shadow-xs">
                  {activeVehicle.displayPlate || activeVehicle.patente}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vehículo Activo en DinAcitY
                </span>
                <span className="text-xs text-sky-300 bg-sky-950/80 border border-sky-800 px-2.5 py-0.5 rounded-full font-mono">
                  Odómetro: {(activeVehicle.currentKm || 60000).toLocaleString('es-AR')} km
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {activeVehicle.brand} {activeVehicle.model} <span className="text-red-400">{activeVehicle.version || ''}</span> ({activeVehicle.year || ''})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStartEditVehicle(activeVehicle)}
                className="px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-300" />
                <span>Modificar Datos de este Auto</span>
              </button>

              <button
                type="button"
                onClick={handleStartNewVehicle}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Cargar Otro Auto</span>
              </button>
            </div>
          </div>

          {/* Grilla Técnica Inteligente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" />
                Motor y Combustible
              </span>
              <p className="font-bold text-white text-sm">{activeVehicle.engine?.name || 'Motor Homologado'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Combustible: <span className="text-emerald-300 font-semibold">{activeVehicle.engine?.fuel || 'Nafta'}</span>
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Kilometraje Registrado
              </span>
              <p className="font-mono font-black text-white text-base">{(activeVehicle.currentKm || 60000).toLocaleString('es-AR')} km</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Próximo service mayor: <strong className="text-amber-300 font-mono">{(Math.ceil((activeVehicle.currentKm || 60000) / 10000) * 10000).toLocaleString('es-AR')} km</strong>
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-purple-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                Aceite Recomendado
              </span>
              <p className="font-bold text-white text-sm">
                {activeVehicle.recommendedParts?.aceiteRecomendado || (activeVehicle.engine?.fuel?.includes('Diésel') ? '5W-30 Sintético Diésel DPF' : '10W-40 / 5W-30 Sintético')}
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">Norma oficial para Mendoza</p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Radicación & RTO
              </span>
              <p className="font-bold text-white text-sm">{activeVehicle.dnrpa?.seccional || 'Mendoza (Registro Automotor)'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Revisión Técnica Obligatoria Ley 9024</p>
            </div>

          </div>

          {/* Accesos Directos a Toda la Plataforma */}
          <div className="pt-2">
            <span className="text-[11px] font-black uppercase text-blue-300 tracking-wider block mb-2">
              🔗 Conectar este vehículo con las secciones de DinAcitY:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              
              {onNavigateCotizador && (
                <button
                  type="button"
                  onClick={() => onNavigateCotizador(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Cotizar Repuestos</span>
                </button>
              )}

              {onNavigateMantenimiento && (
                <button
                  type="button"
                  onClick={() => onNavigateMantenimiento(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Pasaporte Service</span>
                </button>
              )}

              {onNavigateLibreta && (
                <button
                  type="button"
                  onClick={() => onNavigateLibreta(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <Bookmark className="w-4 h-4 fill-slate-950" />
                  <span>Libreta Services</span>
                </button>
              )}

              {onNavigateGuantera && (
                <button
                  type="button"
                  onClick={() => onNavigateGuantera(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span className="text-sm">📂</span>
                  <span>Guantera (RTO)</span>
                </button>
              )}

              {onNavigateKits && (
                <button
                  type="button"
                  onClick={() => onNavigateKits(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span className="text-sm">📦</span>
                  <span>Kits por Marca</span>
                </button>
              )}

              {onNavigateMapa && (
                <button
                  type="button"
                  onClick={() => onNavigateMapa(activeVehicle)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-md transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Mostradores MZA</span>
                </button>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
