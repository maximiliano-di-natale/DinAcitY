import React, { useState } from 'react';
import {
  BookOpen,
  Gauge,
  Droplets,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wrench,
  Fuel,
  Disc,
  Battery,
  Wind,
  Car,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Sliders,
  RotateCw,
  Layers,
  Zap,
  Activity,
  Plus,
  Minus,
  Check,
  Cog,
  Shield
} from 'lucide-react';
import { clientFallbackService } from '../services/clientFallbackService.js';

export function MaintenanceBookWidget({ vehicle, onOpenPatenteModal, onQuoteService, onNavigateLibreta }) {
  const [currentKm, setCurrentKm] = useState(60000);
  const [customKmInput, setCustomKmInput] = useState('60000');
  const [selectedStage, setSelectedStage] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const currentVehicleTitle = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''} (${vehicle.year || ''})`.trim()
    : 'Volkswagen Gol Trend 1.6 MSI (2019)';

  const currentPatente = vehicle?.patente || vehicle?.data?.patente || 'AD 192 OP';
  const currentEngine = vehicle?.engine?.name || vehicle?.data?.engine?.name || '1.6 8V MSI Naftero (101 CV)';
  const vehicleBrand = (vehicle?.brand || 'Volkswagen').toLowerCase();
  const vehicleModel = (vehicle?.model || 'Gol Trend').toLowerCase();
  const isDiesel = (vehicle?.engine?.fuel || '').toLowerCase().includes('diésel') ||
    vehicleBrand.includes('hilux') || vehicleModel.includes('hilux') ||
    vehicleModel.includes('amarok') || vehicleModel.includes('ranger');

  const specs = clientFallbackService.getMaintenanceSpecs(vehicle);

  // Hitos de kilometraje ampliados hasta 500.000 km (Medio Millón de Km)
  const mileageMilestones = [
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
    120000, 140000, 150000, 160000, 180000, 200000, 220000, 240000, 250000, 260000, 280000, 300000,
    320000, 340000, 350000, 360000, 380000, 400000, 420000, 440000, 450000, 460000, 480000, 500000
  ];

  // Etapas de vida útil del vehículo en Argentina
  const stages = [
    { id: 'all', label: 'Todos los Hitos', sub: '10k a 500k km', min: 0, max: 500000 },
    { id: '0-100k', label: '0 a 100.000 km', sub: 'Rodaje & Garantía', min: 0, max: 100000 },
    { id: '100-200k', label: '100k a 200.000 km', sub: 'Embrague & Caja', min: 100001, max: 200000 },
    { id: '200-300k', label: '200k a 300.000 km', sub: 'Promedio Argentina', min: 200001, max: 300000 },
    { id: '300-400k', label: '300k a 400.000 km', sub: 'Motor Mayor', min: 300001, max: 400000 },
    { id: '400-500k', label: '400k a 500.000 km', sub: 'Medio Millón de Km', min: 400001, max: 500000 }
  ];

  const handleSelectKm = (km) => {
    setCurrentKm(km);
    setCustomKmInput(km.toString());
  };

  const handleCustomKmChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomKmInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setCurrentKm(Math.min(parsed, 600000));
    }
  };

  const handleStepKm = (delta) => {
    const next = Math.max(10000, Math.min(500000, currentKm + delta));
    handleSelectKm(next);
  };

  // Diagnóstico inteligente cíclico y de alto kilometraje hasta 500.000 km
  const getServiceDiagnosis = (km) => {
    // Patrones cíclicos matemáticos:
    const isTimingDue = (km % 60000 <= 10000) || (km >= 50000 && km % 60000 >= 50000);
    const isSparkPlugsDue = km % 40000 <= 10000;
    const isBrakeFluidDue = km % 40000 <= 10000;
    const isFiltersMediumDue = km % 20000 <= 5000;
    
    // Mantenimiento de embrague & transmisión (cíclico a partir de 120k km)
    const isClutchDue = (km >= 120000 && km % 120000 <= 20000) || (km >= 250000 && km % 250000 <= 20000);
    const isGearboxFluidDue = km % 60000 <= 10000 || km % 80000 <= 10000;
    const isDriveshaftBootsDue = km % 80000 <= 10000;

    // Mantenimiento de suspensión pesada y tren delantero
    const isSuspensionDue = km % 80000 <= 10000;

    // Mantenimiento mayor de motor a partir de 150k km
    const isEngineGasketsDue = km >= 140000 && (km % 120000 <= 20000 || km % 140000 <= 20000);
    const isInjectorsCleaningDue = km % 80000 <= 10000 || km % 100000 <= 10000;
    const isEgrIntakeCleaningDue = km >= 100000 && km % 100000 <= 15000;
    const isEngineCompressionDue = km >= 180000 && (km % 100000 <= 15000 || km === 500000);
    const isFuelPumpDue = km >= 160000 && (km % 160000 <= 20000 || km % 180000 <= 20000);
    const isThermostatDue = km >= 100000 && km % 100000 <= 15000;
    const isAlternatorDue = km >= 180000 && km % 180000 <= 20000;
    const isChainInspectionDue = specs.timing.type.toLowerCase().includes('cadena') && km >= 150000 && km % 150000 <= 20000;

    // Lista de ítems generados dinámicamente según especificaciones del auto
    const items = [
      // 1. Motor & Fluidos Básicos (Cíclico cada 10.000 km)
      {
        id: 'oil-filter',
        category: 'fluidos',
        name: `Aceite de Motor Homologado ${specs.oil.spec} (${specs.oil.capacity})`,
        spec: `Norma: ${specs.oil.norm} • ${vehicleBrand.toUpperCase()}`,
        type: 'rutinario',
        due: true,
        action: 'Reemplazo obligatorio en cada service (cada 10.000 km) para proteger aros y metales'
      },
      {
        id: 'oil-filter-element',
        category: 'fluidos',
        name: 'Filtro de Aceite Genuino de Alta Retención',
        spec: 'Válvula antirretorno calibrada para arranque en frío',
        type: 'rutinario',
        due: true,
        action: 'Reemplazo en simultáneo con el aceite de motor'
      },
      {
        id: 'air-filter',
        category: 'fluidos',
        name: 'Filtro de Aire Motor Específico',
        spec: 'Celulosa plisada alta capacidad para polvo cuyano / Mendoza',
        type: 'rutinario',
        due: true,
        action: 'Protege el caudalímetro y evita desgaste prematuro de camisas'
      },
      {
        id: 'cabin-filter',
        category: 'fluidos',
        name: 'Filtro de Habitáculo / Aire Acondicionado',
        spec: 'Carbón activado antibacteriano',
        type: isFiltersMediumDue ? 'recomendado' : 'rutinario',
        due: isFiltersMediumDue,
        action: 'Renovación de caudal de ventilación y climatizador'
      },
      {
        id: 'fuel-filter',
        category: 'fluidos',
        name: isDiesel ? 'Filtro de Combustible Diésel con Trampa de Agua' : 'Filtro de Nafta Blindado en Línea',
        spec: isDiesel ? 'Separador de agua y sedimentos de alta presión' : 'Presión de flujo continuo 4 bar',
        type: isFiltersMediumDue ? 'recomendado' : 'rutinario',
        due: isFiltersMediumDue,
        action: isDiesel ? '⚠️ Esencial para proteger inyectores Common Rail de gasoil contaminado' : 'Evita caídas de presión en rampa de inyección'
      },

      // 2. Sistema de Distribución (Cíclico cada 60.000 km o cadena)
      {
        id: 'timing-kit',
        category: 'distribucion',
        name: specs.timing.type.toLowerCase().includes('cadena')
          ? 'Inspección de Tensión de Cadena, Patines y Tensor Hidráulico'
          : 'Kit Completo de Distribución: Correa Dentada + Tensor + Bomba de Agua',
        spec: specs.timing.type,
        type: 'critico',
        due: specs.timing.type.toLowerCase().includes('cadena') ? isChainInspectionDue : isTimingDue,
        action: specs.timing.type.toLowerCase().includes('cadena')
          ? (isChainInspectionDue ? '⚠️ CRÍTICO: Reemplazo preventivo de patines y tensor hidráulico para evitar holgura' : 'Control sonoro y lectura de desfasaje de árbol de levas')
          : (isTimingDue ? '⚠️ CRÍTICO: Reemplazo impostergable (cada 60.000 km) para evitar choque de válvulas y destrucción de tapa' : 'Inspección visual de tensión y ausencia de grietas')
      },
      {
        id: 'coolant-fluid',
        category: 'distribucion',
        name: `Líquido Refrigerante Orgánico (${specs.coolant.type})`,
        spec: `Capacidad: ${specs.coolant.capacity} • Dilución 50/50 desmineralizada`,
        type: isTimingDue || km % 60000 <= 10000 ? 'recomendado' : 'rutinario',
        due: isTimingDue || km % 60000 <= 10000,
        action: 'Vaciado y enjuague total de circuito de refrigeración para evitar corrosión de block y radiador'
      },
      {
        id: 'thermostat-flange',
        category: 'distribucion',
        name: 'Termostato, Bridas de Agua y Mangueras Principales',
        spec: 'Válvula termostática con cuerpo de baquelita / aluminio',
        type: isThermostatDue ? 'critico' : 'rutinario',
        due: isThermostatDue,
        action: isThermostatDue ? '⚠️ Reemplazo preventivo de termostato y mangueras por fatiga térmica para evitar recalentamiento y soplada de junta' : 'Control visual de estanqueidad y abrazaderas'
      },

      // 3. Embrague & Transmisión (A partir de 120.000 km y cíclico hasta 500k)
      {
        id: 'clutch-kit',
        category: 'embrague',
        name: `Kit de Embrague Completo (${vehicleBrand.toUpperCase()} ${vehicleModel.toUpperCase()})`,
        spec: 'Placa de presión + Disco con pistas de ferodo reforzadas + Crapodina hidráulica / Rulemán de empuje',
        type: isClutchDue ? 'critico' : 'recomendado',
        due: isClutchDue,
        action: isClutchDue
          ? `⚠️ MANTENIMIENTO MAYOR: A los ${km.toLocaleString('es-AR')} km el ferodo alcanza su vida útil. Reemplazo del conjunto y rectificado de volante para evitar patinamiento y pérdida de tracción`
          : 'Comprobación de punto de acople, suavidad de pedal y ausencia de trepidación'
      },
      {
        id: 'gearbox-oil',
        category: 'embrague',
        name: `Fluido de Transmisión / Caja de Cambios (${specs.transmission.type})`,
        spec: specs.transmission.type,
        type: isGearboxFluidDue ? 'critico' : 'rutinario',
        due: isGearboxFluidDue,
        action: isGearboxFluidDue
          ? 'Renovación completa de aceite de engranajes y sincronizados para evitar zumbidos y desgaste de piñones'
          : 'Inspección de nivel de tapón de llenado y ausencia de fugas por retenes de selectora'
      },
      {
        id: 'driveshaft-boots',
        category: 'embrague',
        name: 'Fuelles de Semieje, Homocinéticas y Grasa Molikote',
        spec: 'Guardapolvos termoplásticos lado caja y lado rueda',
        type: isDriveshaftBootsDue ? 'recomendado' : 'rutinario',
        due: isDriveshaftBootsDue,
        action: isDriveshaftBootsDue
          ? 'Limpieza profunda, reengrase de jaulas y reemplazo de fuelles para evitar rotura de triceta y homocinética'
          : 'Control de rajaduras o pérdidas de grasa en fuelles'
      },

      // 4. Mantenimiento Mayor de Motor por Alto Kilometraje (150k - 500k km)
      {
        id: 'engine-gaskets',
        category: 'motor',
        name: 'Junta de Tapa de Válvulas y Retenes de Motor (Árbol de Levas / Cigüeñal)',
        spec: 'Junta de vitón / goma elastomérica + retenes de doble labio',
        type: isEngineGasketsDue ? 'critico' : 'rutinario',
        due: isEngineGasketsDue,
        action: isEngineGasketsDue
          ? '⚠️ Retenes resecados por ciclos térmicos: Sustitución para evitar fugas hacia la distribución o el embrague'
          : 'Inspección de pérdidas de aceite en perímetro de tapa y retenes'
      },
      {
        id: 'injectors-cleaning',
        category: 'motor',
        name: 'Limpieza de Inyectores por Ultrasonido y Banco de Caudal',
        spec: 'Microfiltros y o-rings nuevos + prueba de estanqueidad y pulverización',
        type: isInjectorsCleaningDue ? 'recomendado' : 'rutinario',
        due: isInjectorsCleaningDue,
        action: isInjectorsCleaningDue
          ? 'Descarbonización de toberas para restablecer consumo óptimo de combustible y suavidad de ralentí'
          : 'Chequeo de corrección de mezcla y pulsos de inyección por escáner OBD2'
      },
      {
        id: 'intake-egr-cleaning',
        category: 'motor',
        name: 'Descarbonización de Múltiple de Admisión & Válvula EGR',
        spec: 'Desarme y limpieza química de carbonilla acumulada',
        type: isEgrIntakeCleaningDue ? 'recomendado' : 'rutinario',
        due: isEgrIntakeCleaningDue,
        action: isEgrIntakeCleaningDue
          ? '⚠️ Fundamental en autos de más de 120k km para evitar ahogos, pérdida de potencia y humo negro'
          : 'Control de valores de flujo de aire y posición de válvula EGR'
      },
      {
        id: 'engine-compression',
        category: 'motor',
        name: 'Prueba de Compresión y Estanqueidad de Cilindros',
        spec: 'Medición barométrica por cilindro en caliente (Bar / PSI)',
        type: isEngineCompressionDue ? 'critico' : 'rutinario',
        due: isEngineCompressionDue,
        action: isEngineCompressionDue
          ? `🔍 DIAGNÓSTICO PROFUNDO (${km.toLocaleString('es-AR')} km): Evalúa desgaste de aros de pistón, asientos de válvulas y holgura de guías para certificar longevidad del block`
          : 'Monitoreo de consumo de aceite entre cambios'
      },
      {
        id: 'fuel-pump-tank',
        category: 'motor',
        name: 'Bomba de Combustible Eléctrica en Tanque (Aforador)',
        spec: 'Presión de rampa de 3.5 a 4.2 bar continua',
        type: isFuelPumpDue ? 'recomendado' : 'rutinario',
        due: isFuelPumpDue,
        action: isFuelPumpDue
          ? 'Reemplazo preventivo del motor de bomba de combustible por desgaste de escobillas para evitar quedar varado en ruta'
          : 'Medición de caudal y presión con manómetro'
      },
      {
        id: 'alternator-starter',
        category: 'motor',
        name: 'Mantenimiento de Alternador y Motor de Arranque (Burro)',
        spec: 'Carbones nuevos, colector rectificado, regulador de voltaje y bendix',
        type: isAlternatorDue ? 'recomendado' : 'rutinario',
        due: isAlternatorDue,
        action: isAlternatorDue
          ? 'Service preventivo de electroauto para garantizar carga estable de batería y arranque instantáneo'
          : 'Medición de voltaje de carga bajo carga eléctrica máxima (13.8V - 14.4V)'
      },

      // 5. Suspensión, Dirección & Tren Delantero (Cada 80k-100k km)
      {
        id: 'suspension-shocks',
        category: 'suspension',
        name: 'Kit de 4 Amortiguadores Presurizados a Gas + Cazoletas con Crapodinas',
        spec: 'Topes de rebote de poliuretano y fuelles guardapolvos incluidos',
        type: isSuspensionDue ? 'critico' : 'rutinario',
        due: isSuspensionDue,
        action: isSuspensionDue
          ? '⚠️ SEGURIDAD DINÁMICA: Reemplazo por fatiga hidráulica. Recupera estabilidad en frenadas, curvas y agarre en asfalto mendocino'
          : 'Control de rebote y fugas de fluido en vástagos'
      },
      {
        id: 'steering-bushings',
        category: 'suspension',
        name: 'Extremos de Dirección, Rótulas de Suspensión y Bujes de Parrilla',
        spec: 'Bujes silentblock de goma maciza y rótulas forjadas',
        type: isSuspensionDue ? 'recomendado' : 'rutinario',
        due: isSuspensionDue,
        action: isSuspensionDue
          ? 'Reemplazo completo de tren delantero para eliminar ruidos de golpeteo y alineación precisa'
          : 'Control de holguras con palanca en fosa'
      },

      // 6. Frenos Integrales (Cíclico)
      {
        id: 'spark-plugs',
        category: 'motor',
        name: isDiesel ? 'Bujías de Precalentamiento Diésel (Juego x4)' : 'Bujías de Encendido Homologadas (Juego x4)',
        spec: isDiesel ? 'Resistencia cerámica arranque rápido' : 'Electrodo de cobre / platino calibrado 0.8mm',
        type: isSparkPlugsDue ? 'recomendado' : 'rutinario',
        due: isSparkPlugsDue,
        action: isSparkPlugsDue ? 'Sustitución programada por desgaste de chispa y erosión' : 'Control de color de quema y luz de electrodos'
      },
      {
        id: 'brake-fluid',
        category: 'frenos',
        name: `Líquido de Frenos ${specs.brakeFluid.type}`,
        spec: 'Punto de ebullición seco > 260°C • Higroscopía < 2%',
        type: isBrakeFluidDue ? 'recomendado' : 'rutinario',
        due: isBrakeFluidDue,
        action: isBrakeFluidDue ? 'Vaciado, enjuague y purgado total de las 4 ruedas' : 'Prueba de porcentaje de agua con tester óptico'
      },
      {
        id: 'brakes-pads-discs',
        category: 'frenos',
        name: 'Discos y Pastillas de Freno Delanteros + Campanas y Cintas Traseras',
        spec: 'Espesor mínimo de disco y rectificado de tambores con bombines nuevos',
        type: km % 60000 <= 10000 ? 'critico' : 'rutinario',
        due: true,
        action: km % 60000 <= 10000
          ? 'Renovación completa de elementos de fricción delanteros y traseros para frenado parejo'
          : 'Medición con micrómetro del espesor de pista de discos y forro de zapatas'
      }
    ];

    // Diagnóstico general y categorización del service según el kilometraje
    let title = 'Service de Mantenimiento Básico (Preventivo)';
    let badgeColor = 'bg-blue-600 text-white';
    let urgency = 'Preventivo Programado';
    let estimatedCost = '$85.000 - $125.000';
    let stageNote = 'Rodaje y mantenimiento preventivo oficial.';

    if (km >= 400000) {
      title = `Service Mayor de Longevidad • Medio Millón de Km (${km.toLocaleString('es-AR')} km)`;
      badgeColor = 'bg-purple-600 text-white animate-pulse shadow-md shadow-purple-500/30';
      urgency = 'Medio Millón • Restauración Integral';
      estimatedCost = '$380.000 - $590.000 (Incluye Componentes Mayores)';
      stageNote = '¡Hito extraordinario! Tu vehículo superó ampliamente el promedio nacional. Requiere inspección de compresión de motor, embrague, transmisión y suspensión para seguir rodando con máxima seguridad.';
    } else if (km >= 250000) {
      title = `Service Mayor y Restauración de Alto Rendimiento (${km.toLocaleString('es-AR')} km)`;
      badgeColor = 'bg-red-600 text-white shadow-md shadow-red-500/30';
      urgency = 'Alta Exigencia • Motor, Caja y Suspensión';
      estimatedCost = '$320.000 - $480.000';
      stageNote = 'Kilometraje superior al promedio argentino. Clave para evitar paradas inesperadas: revisión de embrague, fuelles, retenes de aceite e inyección.';
    } else if (km >= 120000 && (isClutchDue || isTimingDue)) {
      title = `Service Mayor y Crítico (${km.toLocaleString('es-AR')} km) • Distribución y Embrague`;
      badgeColor = 'bg-rose-600 text-white animate-pulse';
      urgency = 'Crítico de Seguridad Mecánica';
      estimatedCost = '$260.000 - $420.000 (Incluye Distribución / Embrague)';
      stageNote = 'Momento bisagra: se cumple el intervalo de cambio de componentes de fricción pesada (embrague / correa / bomba).';
    } else if (isTimingDue) {
      title = `Service de Distribución y Seguridad (${km.toLocaleString('es-AR')} km)`;
      badgeColor = 'bg-amber-600 text-white';
      urgency = 'Crítico de Distribución';
      estimatedCost = '$210.000 - $320.000 (Incluye Distribución y Bomba)';
      stageNote = 'Ciclo de recambio de correa dentada, tensores y refrigerante.';
    } else if (isFiltersMediumDue) {
      title = `Service Intermedio Completo de los ${km.toLocaleString('es-AR')} km`;
      badgeColor = 'bg-emerald-600 text-white';
      urgency = 'Intermedio Completo';
      estimatedCost = '$135.000 - $185.000';
      stageNote = 'Cambio de 4 filtros, revisión de bujías y chequeo integral de fluidos.';
    }

    // Filtrar ítems según categoría seleccionada en la vista
    const filteredItems = items.filter(item => {
      if (categoryFilter === 'all') return true;
      if (categoryFilter === 'criticos') return item.type === 'critico';
      if (categoryFilter === 'embrague') return item.category === 'embrague';
      if (categoryFilter === 'motor') return item.category === 'motor';
      if (categoryFilter === 'distribucion') return item.category === 'distribucion';
      if (categoryFilter === 'suspension') return item.category === 'suspension' || item.category === 'frenos';
      if (categoryFilter === 'fluidos') return item.category === 'fluidos';
      return true;
    });

    const criticalCount = items.filter(i => i.type === 'critico').length;
    const dueCount = items.filter(i => i.due).length;

    return {
      title,
      badgeColor,
      urgency,
      estimatedCost,
      stageNote,
      items: filteredItems,
      totalItems: items.length,
      criticalCount,
      dueCount
    };
  };

  const diagnosis = getServiceDiagnosis(currentKm);

  // Filtrar hitos según la etapa seleccionada
  const visibleMilestones = mileageMilestones.filter(km => {
    const stage = stages.find(s => s.id === selectedStage);
    if (!stage || stage.id === 'all') return true;
    return km >= stage.min && km <= stage.max;
  });

  const handleQuoteServiceWhatsApp = () => {
    if (onQuoteService) {
      onQuoteService({
        partName: `Kit completo para ${diagnosis.title} (${currentKm.toLocaleString('es-AR')} km) - ${currentVehicleTitle}`,
        vehicle
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Superior Pasaporte Digital de Mantenimiento */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-blue-600/30">
        
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-sm">
                Pasaporte Service • 10.000 a 500.000 KM
              </span>
              <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                📖 Libreta de Mantenimiento Oficial
              </span>
              <span className="text-xs font-bold text-yellow-300 bg-yellow-950/80 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                🇦🇷 Adaptada al Parque Automotor Argentino (+200.000 km)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Libreta de Mantenimiento & Ficha Técnica hasta Medio Millón de KM
            </h2>

            <p className="text-sm text-blue-100 leading-relaxed">
              En Argentina los autos recorren cientos de miles de kilómetros. Por eso, calculamos con precisión matemática el service exacto desde los <strong>10.000 km hasta los 500.000 km</strong>: distribución, <strong>kit de embrague, caja de cambios, suspensión, retenes y mantenimiento mayor de motor</strong>.
            </p>

            {onNavigateLibreta && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onNavigateLibreta}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                >
                  <span>📒 Abrir mi Libreta de Services Realizados</span>
                </button>
              </div>
            )}
          </div>

          {/* Ficha del Vehículo */}
          <div className="bg-slate-950/80 backdrop-blur-md border border-blue-400/40 rounded-xl p-4 shrink-0 max-w-md w-full sm:w-auto shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-black uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Vehículo Vinculado
              </span>
              {onOpenPatenteModal && (
                <button
                  type="button"
                  onClick={onOpenPatenteModal}
                  className="text-[11px] text-blue-300 hover:text-white font-bold underline cursor-pointer"
                >
                  Cambiar patente
                </button>
              )}
            </div>

            <p className="font-black text-base sm:text-lg text-white">
              {currentVehicleTitle}
            </p>

            <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-blue-200">
              <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-black shadow-xs">
                🇦🇷 {currentPatente}
              </span>
              <span>
                Motor: <strong className="text-white">{currentEngine}</strong>
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <span>Distribución: <strong className="text-yellow-300">{specs.timing.type.split('(')[0]}</strong></span>
              <span>Transmisión: <strong className="text-blue-300">{specs.transmission.type.split('(')[0]}</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Selector de Kilometraje con Soporte Completo hasta 500.000 KM */}
      <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        
        {/* Cabecera del Odómetro e Input Manual */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-1 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-yellow-400" />
              <span>Odómetro Digital: Kilometraje Actual de tu Vehículo</span>
            </span>
            <p className="text-xs text-slate-400">
              Seleccioná un hito rápido o escribí los kilómetros exactos de tu tablero (10.000 a 500.000 km):
            </p>
          </div>

          {/* Caja Digital del Odómetro con Botones +/- 10.000 km */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleStepKm(-10000)}
              disabled={currentKm <= 10000}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
              title="Restar 10.000 km"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border-2 border-yellow-400/40 shadow-inner">
              <input
                type="text"
                value={customKmInput}
                onChange={handleCustomKmChange}
                placeholder="60000"
                className="w-28 text-center font-mono font-black text-xl bg-transparent text-yellow-300 focus:outline-none"
              />
              <span className="text-xs font-black text-slate-400 pr-1">KM</span>
            </div>

            <button
              type="button"
              onClick={() => handleStepKm(10000)}
              disabled={currentKm >= 500000}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
              title="Sumar 10.000 km"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Control Deslizante (Slider) Interactivo hasta 500.000 KM */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>10.000 km (Nuevo)</span>
            <span className="text-yellow-400 font-mono font-black text-xs">
              Odómetro en vivo: {currentKm.toLocaleString('es-AR')} km
            </span>
            <span>500.000 km (Medio Millón)</span>
          </div>

          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={currentKm}
            onChange={(e) => handleSelectKm(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
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

        {/* Filtros de Rango / Etapa del Parque Automotor */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Filtrar por Rango de Kilómetros:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Mostrando {visibleMilestones.length} hitos programados
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStage(stage.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedStage === stage.id
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-102'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                }`}
              >
                <span>{stage.label}</span>
                <span className="text-[10px] block opacity-75 leading-none mt-0.5">{stage.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Botones de KM Rápidos (Generados hasta 500.000 KM) */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 max-h-48 overflow-y-auto pr-1">
          {visibleMilestones.map((km) => {
            const isMilestoneActive = currentKm === km;
            const isMilestoneCritical = km >= 120000 && (km % 120000 === 0 || km % 60000 === 0);

            return (
              <button
                key={km}
                type="button"
                onClick={() => handleSelectKm(km)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                  isMilestoneActive
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105'
                    : isMilestoneCritical
                    ? 'bg-slate-900 text-red-300 hover:text-white hover:bg-red-950/60 border-red-900/50'
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

      {/* Diagnóstico Inteligente de Service */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${diagnosis.badgeColor}`}>
                {diagnosis.urgency}
              </span>
              <span className="text-xs text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700 font-mono font-bold">
                Odómetro: {currentKm.toLocaleString('es-AR')} KM
              </span>
              {currentKm >= 200000 && (
                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                  ⚡ Alto Kilometraje • Parque Automotor Argentino
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {diagnosis.title}
            </h3>

            <p className="text-xs text-blue-200">
              {diagnosis.stageNote}
            </p>

            <p className="text-xs text-slate-400 pt-0.5">
              Costo estimado de repuestos en Mendoza: <strong className="text-emerald-400 font-bold text-sm">{diagnosis.estimatedCost}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuoteServiceWhatsApp}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 transform active:scale-98 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Cotizar este Service por WhatsApp</span>
          </button>
        </div>

        {/* Filtros de Categorías de Componentes del Service */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-slate-400 font-bold mr-1">Filtrar tareas:</span>
          
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todos ({diagnosis.totalItems})
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('criticos')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              categoryFilter === 'criticos'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 text-red-300 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Críticos ({diagnosis.criticalCount})
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('embrague')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              categoryFilter === 'embrague'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚙️ Embrague & Caja
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('distribucion')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              categoryFilter === 'distribucion'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚡ Distribución
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('motor')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              categoryFilter === 'motor'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🔧 Motor Mayor
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('suspension')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              categoryFilter === 'suspension'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🛞 Suspensión & Frenos
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('fluidos')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              categoryFilter === 'fluidos'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🛢️ Fluidos Básicos
          </button>
        </div>

        {/* Checklist de Tareas y Repuestos del Service */}
        <div className="space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
            Detalle de Componentes y Trabajos para los {currentKm.toLocaleString('es-AR')} km ({diagnosis.items.length} tareas):
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnosis.items.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  item.due
                    ? item.type === 'critico'
                      ? 'bg-red-950/40 border-red-500/60 shadow-xs'
                      : item.type === 'recomendado'
                      ? 'bg-amber-950/30 border-amber-500/50'
                      : 'bg-slate-900/90 border-slate-700'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.due ? (
                    item.type === 'critico' ? (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : item.type === 'recomendado' ? (
                      <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </div>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white leading-tight">
                      {item.name}
                    </span>
                    {item.type === 'critico' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-red-600 text-white shrink-0">
                        Crítico
                      </span>
                    )}
                    {item.category === 'embrague' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-900/80 text-amber-200 border border-amber-600/30 shrink-0">
                        Embrague / Caja
                      </span>
                    )}
                    {item.category === 'motor' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-900/80 text-indigo-200 border border-indigo-600/30 shrink-0">
                        Motor Mayor
                      </span>
                    )}
                    {item.category === 'suspension' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-900/80 text-cyan-200 border border-cyan-600/30 shrink-0">
                        Tren Delantero
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {item.spec}
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Ficha Técnica Oficial de Fábrica (Fluidos y Capacidades) */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="w-5 h-5 text-blue-400" />
          <h3 className="text-base sm:text-lg font-black text-white">
            Ficha Técnica Oficial de Fluidos y Lubricantes ({currentVehicleTitle})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          
          {/* Aceite de Motor */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              Aceite de Motor Homologado
            </span>
            <p className="text-sm font-black text-white">
              {specs.oil.spec}
            </p>
            <p className="text-slate-400 text-[11px]">
              Norma de fábrica: <strong className="text-slate-200">{specs.oil.norm}</strong>
            </p>
            <p className="text-slate-400 text-[11px]">
              Capacidad de cárter: <strong className="text-white">{specs.oil.capacity}</strong>
            </p>
            <span className="inline-block mt-1 text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-semibold border border-blue-800">
              Intervalo: {specs.oil.interval}
            </span>
          </div>

          {/* Refrigerante de Motor */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Refrigerante / Anticongelante
            </span>
            <p className="text-sm font-black text-white">
              {specs.coolant.type}
            </p>
            <p className="text-slate-400 text-[11px]">
              Capacidad total del circuito: <strong className="text-white">{specs.coolant.capacity}</strong>
            </p>
            <p className="text-slate-400 text-[11px]">
              Dilución: 50% concentrado orgánico / 50% desmineralizada
            </p>
            <span className="inline-block mt-1 text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-semibold border border-red-800">
              Intervalo: {specs.coolant.interval}
            </span>
          </div>

          {/* Distribución */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              Sistema de Distribución
            </span>
            <p className="text-sm font-black text-white">
              {specs.timing.type}
            </p>
            <p className="text-slate-400 text-[11px]">
              Recomendación: Cambiar siempre junto a tensor y bomba de agua
            </p>
            <span className="inline-block mt-1 text-[10px] bg-yellow-950 text-yellow-300 px-2 py-0.5 rounded font-semibold border border-yellow-800">
              {specs.timing.interval}
            </span>
          </div>

          {/* Transmisión y Caja */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Cog className="w-3.5 h-3.5" />
              Caja de Cambios y Transmisión
            </span>
            <p className="text-sm font-black text-white">
              {specs.transmission.type}
            </p>
            <p className="text-slate-400 text-[11px]">
              Intervalo de cambio: <strong className="text-white">{specs.transmission.interval}</strong>
            </p>
            <span className="inline-block mt-1 text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-semibold border border-indigo-800">
              Protección de engranajes y sincronizados
            </span>
          </div>

          {/* Líquido de Frenos */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Disc className="w-3.5 h-3.5" />
              Líquido de Frenos
            </span>
            <p className="text-sm font-black text-white">
              {specs.brakeFluid.type}
            </p>
            <p className="text-slate-400 text-[11px]">
              Intervalo: {specs.brakeFluid.interval}
            </p>
            <span className="inline-block mt-1 text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-800">
              Punto de ebullición certificado
            </span>
          </div>

          {/* Batería */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5" />
              Batería Homologada
            </span>
            <p className="text-sm font-black text-white font-mono">
              {specs.battery.spec}
            </p>
            <p className="text-slate-400 text-[11px]">
              Arranque en frío CCA verificado para Mendoza
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
