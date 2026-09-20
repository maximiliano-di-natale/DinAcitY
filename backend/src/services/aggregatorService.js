import { MercadoLibreAdapter } from '../adapters/mercadoLibreAdapter.js';
import { MendozaStoresAdapter } from '../adapters/mendozaStoresAdapter.js';
import { FacebookMarketplaceMendozaAdapter } from '../adapters/facebookMarketplaceMendozaAdapter.js';
import { titleNormalizer } from './titleNormalizerService.js';

export class AggregatorService {
  constructor() {
    this.mlAdapter = new MercadoLibreAdapter();
    this.mendozaStoresAdapter = new MendozaStoresAdapter();
    this.fbMarketplaceAdapter = new FacebookMarketplaceMendozaAdapter();

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
      mendozaZone,
      sourceType,
      sortBy = 'price_asc'
    } = params;

    const cacheKey = this.getCacheKey({ query, vehicleType, brand, model, year, category });
    let allItems = [];

    // Verificación en caché
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      allItems = [...cached.items];
    } else {
      // Búsqueda en paralelo en las 3 fuentes de Mendoza:
      // 1. Mercado Libre Mendoza
      // 2. Casas de Repuestos físicas de Mendoza (Carril Rodríguez Peña, Godoy Cruz, Guaymallén, etc.)
      // 3. Facebook Marketplace Mendoza
      const [mlResult, mendozaStoresResult, fbResult] = await Promise.allSettled([
        this.mlAdapter.search({ query, vehicleType, brand, model, year, category }),
        this.mendozaStoresAdapter.search({ query, vehicleType, brand, model, year, category }),
        this.fbMarketplaceAdapter.search({ query, vehicleType, brand, model, year, category })
      ]);

      const mlItems = mlResult.status === 'fulfilled' ? mlResult.value : [];
      const mendozaItems = mendozaStoresResult.status === 'fulfilled' ? mendozaStoresResult.value : [];
      const fbItems = fbResult.status === 'fulfilled' ? fbResult.value : [];

      allItems = [...mlItems, ...mendozaItems, ...fbItems];

      // Guardar en caché
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        items: allItems
      });
    }

    // Filtrado dinámico
    let filtered = allItems.filter((item) => {
      if (minPrice && item.totalPrice < Number(minPrice)) return false;
      if (maxPrice && item.totalPrice > Number(maxPrice)) return false;
      if (condition && condition !== 'todos' && item.condition !== condition) return false;
      if (freeShippingOnly === 'true' || freeShippingOnly === true) {
        if (!item.freeShipping) return false;
      }
      if (store && store !== 'todos' && item.storeKey !== store) return false;
      if (partBrand && partBrand !== 'todos' && item.partBrand.toLowerCase() !== partBrand.toLowerCase()) return false;
      if (sourceType && sourceType !== 'todos' && item.sourceType !== sourceType) return false;
      if (mendozaZone && mendozaZone !== 'todos') {
        const zoneStr = item.mendozaLocation?.zone || '';
        if (!zoneStr.toLowerCase().includes(mendozaZone.toLowerCase())) return false;
      }
      return true;
    });

    // Ordenamiento matemático
    if (sortBy === 'price_asc') {
      // ESTRICTO: DEL MÁS BARATO AL MÁS CARO
      filtered.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => Number(b.sellerRating) - Number(a.sellerRating));
    }

    // Estadísticas de precios
    const prices = filtered.map((item) => item.totalPrice);
    const minCalculatedPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxCalculatedPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

    // Enriquecimiento de datos con insignias
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

    // Extraer facetas únicas
    const availableStores = [...new Set(allItems.map((i) => ({ key: i.storeKey, name: i.storeName })))];
    const availableBrands = [...new Set(allItems.map((i) => i.partBrand))];
    const availableMendozaZones = [
      'Carril Rodríguez Peña',
      'Godoy Cruz',
      'Guaymallén',
      'Maipú',
      'Ciudad de Mendoza',
      'San Martín',
      'San Rafael'
    ];

    return {
      region: 'Mendoza, Argentina',
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
        maxSavingsPossible: maxCalculatedPrice - minCalculatedPrice,
        mendozaSources: {
          casasRepuestosMendoza: enrichedResults.filter(i => i.sourceType === 'casa_repuestos_mendoza').length,
          mercadoLibreMendoza: enrichedResults.filter(i => i.sourceType === 'mercadolibre_mendoza').length,
          facebookMarketplaceMendoza: enrichedResults.filter(i => i.sourceType === 'facebook_marketplace_mendoza').length
        }
      },
      filtersMeta: {
        stores: availableStores,
        brands: availableBrands,
        mendozaZones: availableMendozaZones,
        sourceTypes: [
          { id: 'todos', name: 'Todas las fuentes en Mendoza' },
          { id: 'casa_repuestos_mendoza', name: 'Casas de Repuestos en Mendoza' },
          { id: 'facebook_marketplace_mendoza', name: 'Facebook Marketplace Mendoza' },
          { id: 'mercadolibre_mendoza', name: 'Mercado Libre Mendoza' }
        ],
        conditions: ['nuevo', 'reacondicionado']
      },
      results: enrichedResults
    };
  }
}
