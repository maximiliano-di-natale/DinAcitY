# DinAcitY 🚗🏍️🚛
### El "TurismoCity" de los Repuestos Automotores

**DinAcitY** es una plataforma y aplicación multiplataforma (PWA móvil para Android/iOS y Web de escritorio) que permite buscar, comparar y encontrar los repuestos más baratos para **autos, motos y camiones** en tiempo real.

---

## 🚀 Características Principales

- **Multiplataforma Universal**: Funciona en cualquier dispositivo (celulares, computadoras, tablets) con opción de instalación como app nativa (PWA).
- **Comparador Inteligente Estilo TurismoCity**: Rastrea en múltiples tiendas y marketplaces (Mercado Libre, distribuidores y tiendas online de autopartes) ordenando automáticamente del **más barato al más caro**.
- **Cobertura Integral de Vehículos**:
  - 🚗 **Autos y Utilitarios**: Volkswagen, Ford, Chevrolet, Toyota, Fiat, Renault, Peugeot, etc.
  - 🏍️ **Motos**: Honda, Yamaha, Motomel, Bajaj, Kawasaki, etc.
  - 🚛 **Camiones y Pesados**: Scania, Mercedes-Benz, Iveco, Volvo, Ford Cargo, etc.
- **Categorías de Repuestos**: Radiadores, termostatos, electroventiladores, pastillas y discos de freno, embragues, filtros, amortiguadores, correas, iluminación y más.
- **Insignias Dinámicas**:
  - `🔥 MÁS BARATO`: Identifica de forma inmediata la opción con menor precio total.
  - `⭐ MEJOR CALIFICACIÓN`: Vendedores con reputación destacada y entrega rápida.
- **Filtros Avanzados**:
  - Filtro por tipo de vehículo, marca, modelo y año.
  - Rango de precio ajustable.
  - Solo ofertas con Envío Gratis.
  - Condición: Nuevos o Reacondicionados.
  - Selección de tiendas específicas.
- **Redirección Directa**: Botones *"Ver Oferta en [Tienda]"* que llevan al usuario directamente a la publicación para realizar la compra.
- **Alertas de Precio**: Sistema para rastrear repuestos y simular avisos cuando bajan de precio.

---

## 🛠️ Arquitectura Técnica

```
DinAcitY/
├── backend/                  # Servidor Express, API REST y motor de agregación
│   ├── src/
│   │   ├── adapters/         # Conectores de tiendas (MercadoLibre, AutopartesWeb, MockStores)
│   │   ├── services/         # Normalización, cálculo de ahorro y ranking por precio
│   │   ├── data/             # Taxonomía vehicular (Autos, Motos, Camiones) y catálogo
│   │   └── server.js         # API Server en puerto 5000
│   └── package.json
├── frontend/                 # Aplicación Web & PWA Móvil (React + Vite + Tailwind CSS)
│   ├── public/               # Manifiesto PWA e íconos para celulares
│   ├── src/
│   │   ├── components/       # HeroSearch, PartCard, FilterSidebar, PriceComparisonModal
│   │   ├── App.jsx           # Interfaz principal responsive
│   │   └── index.css
│   └── package.json
└── package.json              # Orquestador con scripts concurrentes
```

---

## 💻 Instalación y Uso Local

### 1. Clonar el repositorio:
```bash
git clone https://github.com/maximiliano-di-natale/DinAcitY.git
cd DinAcitY
```

### 2. Instalar dependencias:
```bash
npm run install:all
```

### 3. Iniciar Backend y Frontend simultáneamente:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
