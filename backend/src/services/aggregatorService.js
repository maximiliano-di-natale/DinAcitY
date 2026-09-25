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
    this.cacheTTL = 1000 * 60 * 10;
  }

  getCacheKey(params) {
    return JSON.stringify(params);
  }

  async searchParts(params) {
    const {
      query = '',
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
      vehicleBrand,
      mendozaZone,
      sourceType,
      sortBy = 'price_asc'
    } = params;

    const parsed = titleNormalizer.parseSearchIntent(query, { brand, model, vehicleType, year });
    const effectiveQuery = parsed.canonicalPart.canonicalName;
    const effectiveBrand = parsed.vehicleBrand;
    const effectiveModel = parsed.model;
    const effectiveType = parsed.vehicleType;
    const effectiveYear = parsed.year;

    const cacheKey = this.getCacheKey({
      effectiveQuery,
      effectiveBrand,
      effectiveModel,
      effectiveType,
      effectiveYear,
      isVehicleOnlySearch: parsed.isVehicleOnlySearch
    });

    let allItems = [];

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      allItems = [...cached.items];
    } else {
      const [mlResult, mendozaStoresResult, fbResult] = await Promise.allSettled([
        this.mlAdapter.search({
          query: effectiveQuery,
          vehicleType: effectiveType,
          brand: effectiveBrand,
          model: effectiveModel,
          year: effectiveYear,
          category
        }),
        this.mendozaStoresAdapter.search({
          query: effectiveQuery,
          vehicleType: effectiveType,
          brand: effectiveBrand,
          model: effectiveModel,
          year: effectiveYear,
          category
        }),
        this.fbMarketplaceAdapter.search({
          query: effectiveQuery,
          vehicleType: effectiveType,
          brand: effectiveBrand,
          model: effectiveModel,
          year: effectiveYear,
          category
        })
      ]);

      const mlItems = mlResult.status === 'fulfilled' ? mlResult.value : [];
      const mendozaItems = mendozaStoresResult.status === 'fulfilled' ? mendozaStoresResult.value : [];
      const fbItems = fbResult.status === 'fulfilled' ? fbResult.value : [];

      allItems = [...mlItems, ...mendozaItems, ...fbItems];

      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        items: allItems
      });
    }

    // Filtrado dinámico
    let filtered = allItems.filter((item) => {
      if (minPrice && item.hasPublicPrice && item.totalPrice < Number(minPrice)) return false;
      if (maxPrice && item.hasPublicPrice && item.totalPrice > Number(maxPrice)) return false;
      if (condition && condition !== 'todos' && item.condition !== condition) return false;
      if (freeShippingOnly === 'true' || freeShippingOnly === true) {
        if (!item.freeShipping) return false;
      }
      if (store && store !== 'todos' && item.storeKey !== store) return false;
      if (partBrand && partBrand !== 'todos' && item.partBrand.toLowerCase() !== partBrand.toLowerCase()) return false;
      if (vehicleBrand && vehicleBrand !== 'todos') {
        const vb = vehicleBrand.toLowerCase();
        const matchesBrand = item.vehicleBrand?.toLowerCase().includes(vb);
        const matchesCompat = item.vehicleCompatibility?.toLowerCase().includes(vb);
        const matchesTitle = item.title?.toLowerCase().includes(vb);
        if (!matchesBrand && !matchesCompat && !matchesTitle) return false;
      }
      if (sourceType && sourceType !== 'todos' && item.sourceType !== sourceType) return false;
      if (mendozaZone && mendozaZone !== 'todos') {
        const zoneStr = item.mendozaLocation?.zone || '';
        if (!zoneStr.toLowerCase().includes(mendozaZone.toLowerCase())) return false;
      }
      return true;
    });

    // Separar items con precio público verificado de los que son "Precio a consultar por WhatsApp"
    const itemsWithPrice = filtered.filter((i) => i.hasPublicPrice && i.totalPrice > 0);
    const itemsToConsult = filtered.filter((i) => !i.hasPublicPrice);

    // Ordenamiento matemático de los que tienen precio: DEL MÁS BARATO AL MÁS CARO
    if (sortBy === 'price_asc') {
      itemsWithPrice.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortBy === 'price_desc') {
      itemsWithPrice.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === 'rating') {
      itemsWithPrice.sort((a, b) => Number(b.sellerRating) - Number(a.sellerRating));
    }

    const prices = itemsWithPrice.map((item) => item.totalPrice);
    const minCalculatedPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxCalculatedPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

    const enrichedWithPrice = itemsWithPrice.map((item, index) => {
      const isCheapest = item.totalPrice === minCalculatedPrice && itemsWithPrice.length > 1;
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

    const enrichedToConsult = itemsToConsult.map((item, index) => {
      return {
        ...item,
        rank: enrichedWithPrice.length + index + 1,
        isCheapest: false,
        savingsVsAvgPercentage: 0,
        savingsVsMaxAmount: 0,
        priceComparisonSummary: {
          differenceWithCheapest: 0,
          isBestOption: false
        }
      };
    });

    const combinedResults = [...enrichedWithPrice, ...enrichedToConsult];

    const availableStores = Array.from(
      new Map(allItems.map((i) => [i.storeKey, { key: i.storeKey, name: i.storeName }])).values()
    );
    const availableBrands = [...new Set(allItems.map((i) => i.partBrand).filter(Boolean))].sort();
    const availableVehicleBrands = [...new Set(allItems.map((i) => i.vehicleBrand).filter(Boolean))].sort();
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
        searchedQuery: query || effectiveQuery,
        resolvedVehicle: {
          brand: effectiveBrand,
          model: effectiveModel,
          type: effectiveType,
          year: effectiveYear
        },
        canonicalPart: parsed.canonicalPart.canonicalName
      },
      stats: {
        totalResults: combinedResults.length,
        itemsWithVerifiedPrice: enrichedWithPrice.length,
        itemsToConsultWhatsApp: enrichedToConsult.length,
        minPrice: minCalculatedPrice,
        maxPrice: maxCalculatedPrice,
        avgPrice: avgPrice,
        maxSavingsPossible: maxCalculatedPrice - minCalculatedPrice,
        mendozaSources: {
          casasRepuestosMendoza: combinedResults.filter(i => i.sourceType === 'casa_repuestos_mendoza').length,
          mercadoLibreMendoza: combinedResults.filter(i => i.sourceType === 'mercadolibre_mendoza').length,
          facebookMarketplaceMendoza: combinedResults.filter(i => i.sourceType === 'facebook_marketplace_mendoza').length
        }
      },
      filtersMeta: {
        stores: availableStores,
        brands: availableBrands,
        vehicleBrands: availableVehicleBrands,
        mendozaZones: availableMendozaZones,
        sourceTypes: [
          { id: 'todos', name: 'Todas las fuentes en Mendoza' },
          { id: 'casa_repuestos_mendoza', name: 'Casas de Repuestos (WhatsApp Mendoza)' },
          { id: 'facebook_marketplace_mendoza', name: 'Facebook Marketplace Mendoza (Precio Publicado)' },
          { id: 'mercadolibre_mendoza', name: 'Mercado Libre Mendoza (Precio Publicado)' }
        ],
        conditions: ['nuevo', 'reacondicionado']
      },
      results: combinedResults
    };
  }
}
