import { MercadoLibreAdapter } from '../adapters/mercadoLibreAdapter.js';
import { AutopartesStoreAdapter } from '../adapters/autopartesStoreAdapter.js';

export class AggregatorService {
  constructor() {
    this.mlAdapter = new MercadoLibreAdapter();
    this.storeAdapter = new AutopartesStoreAdapter();
    // Cache en memoria para acelerar búsquedas recurrentes (<50ms)
    this.cache = new Map();
    this.cacheTTL = 1000 * 60 * 10; // 10 minutos
  }

  getCacheKey(params) {
    return JSON.stringify(params);
  }

  async searchParts(params) {
    const {
      query = 'radiador',
      vehicleType = 'auto',
      brand = '',
      model = '',
      year = '',
      category = '',
      minPrice,
      maxPrice,
      condition,
      freeShippingOnly,
      store,
      partBrand,
      sortBy = 'price_asc'
    } = params;

    const cacheKey = this.getCacheKey({ query, vehicleType, brand, model, year, category });
    let allItems = [];

    // Verificar si está en caché
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      allItems = [...cached.items];
    } else {
      // Disparar búsqueda concurrente a todos los adaptadores
      const [mlResult, storesResult] = await Promise.allSettled([
        this.mlAdapter.search({ query, vehicleType, brand, model, year, category }),
        this.storeAdapter.search({ query, vehicleType, brand, model, year, category })
      ]);

      const mlItems = mlResult.status === 'fulfilled' ? mlResult.value : [];
      const storeItems = storesResult.status === 'fulfilled' ? storesResult.value : [];

      allItems = [...mlItems, ...storeItems];

      // Guardar en caché
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        items: allItems
      });
    }

    // Aplicar filtros dinámicos
    let filtered = allItems.filter((item) => {
      if (minPrice && item.totalPrice < Number(minPrice)) return false;
      if (maxPrice && item.totalPrice > Number(maxPrice)) return false;
      if (condition && condition !== 'todos' && item.condition !== condition) return false;
      if (freeShippingOnly === 'true' || freeShippingOnly === true) {
        if (!item.freeShipping) return false;
      }
      if (store && store !== 'todos' && item.storeKey !== store) return false;
      if (partBrand && partBrand !== 'todos' && item.partBrand.toLowerCase() !== partBrand.toLowerCase()) return false;
      return true;
    });

    // Ordenamiento matemático
    if (sortBy === 'price_asc') {
      // DEL MÁS BARATO AL MÁS CARO (Regla principal de TurismoCity)
      filtered.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => Number(b.sellerRating) - Number(a.sellerRating));
    }

    // Estadísticas y cálculo de ahorro (Turismocity badge "Más Barato")
    const prices = filtered.map((item) => item.totalPrice);
    const minCalculatedPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxCalculatedPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

    // Enriquecer cada resultado con insignias y comparativa
    const enrichedResults = filtered.map((item, index) => {
      const isCheapest = item.totalPrice === minCalculatedPrice && filtered.length > 1;
      const savingsVsAvg = avgPrice > item.totalPrice ? Math.round(((avgPrice - item.totalPrice) / avgPrice) * 100) : 0;
      const savingsVsMax = maxCalculatedPrice - item.totalPrice;

      return {
        ...item,
        rank: index + 1,
        isCheapest: isCheapest,
        savingsVsAvgPercentage: savingsVsAvg,
        savingsVsMaxAmount: savingsVsMax,
        priceComparisonSummary: {
          differenceWithCheapest: item.totalPrice - minCalculatedPrice,
          isBestOption: isCheapest || (Number(item.sellerRating) >= 4.8 && item.totalPrice <= avgPrice)
        }
      };
    });

    // Extraer facetas únicas para filtros frontend
    const availableStores = [...new Set(allItems.map((i) => ({ key: i.storeKey, name: i.storeName })))];
    const availableBrands = [...new Set(allItems.map((i) => i.partBrand))];

    return {
      query: {
        searchedQuery: query,
        vehicleType,
        brand,
        model,
        year,
        category
      },
      stats: {
        totalResults: enrichedResults.length,
        minPrice: minCalculatedPrice,
        maxPrice: maxCalculatedPrice,
        avgPrice: avgPrice,
        maxSavingsPossible: maxCalculatedPrice - minCalculatedPrice
      },
      filtersMeta: {
        stores: availableStores,
        brands: availableBrands,
        conditions: ['nuevo', 'reacondicionado']
      },
      results: enrichedResults
    };
  }
}
