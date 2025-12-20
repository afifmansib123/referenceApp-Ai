import axios from 'axios';

interface MarketPrice {
  commodity: string;
  price: number;
  unit: string;
  priceDate: Date;
  source: string;
  trend: number; // percentage change
}

interface MarketAdjustment {
  factor: number; // e.g., 1.05 for 5% increase
  reason: string;
  dataSource: string;
}

/**
 * Mock commodity prices for development
 * In production, integrate with real APIs like CRB, LME, or Quandl
 */
const MOCK_COMMODITY_PRICES: Record<string, { price: number; trend: number }> = {
  aluminum: { price: 3.5, trend: 5 }, // 5% up
  steel: { price: 1.2, trend: -2 }, // 2% down
  copper: { price: 8.5, trend: 3 }, // 3% up
  titanium: { price: 15.0, trend: 0 },
  plastic: { price: 0.8, trend: 1 },
};

export class MarketDataService {
  /**
   * Fetch current commodity market prices
   * Using mock data for Phase 1 (development)
   * Can be replaced with real APIs later
   */
  async getMarketPrices(): Promise<MarketPrice[]> {
    try {
      // For development: return mock prices
      const prices = Object.entries(MOCK_COMMODITY_PRICES).map(([commodity, data]) => ({
        commodity,
        price: data.price,
        unit: 'USD/kg',
        priceDate: new Date(),
        source: 'MOCK_DATA',
        trend: data.trend,
      }));

      return prices;
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return [];
    }
  }

  /**
   * Fetch specific commodity price
   */
  async getCommodityPrice(commodity: string): Promise<MarketPrice | null> {
    try {
      const normalized = commodity.toLowerCase();
      const mockData = MOCK_COMMODITY_PRICES[normalized];

      if (!mockData) {
        return null;
      }

      return {
        commodity: normalized,
        price: mockData.price,
        unit: 'USD/kg',
        priceDate: new Date(),
        source: 'MOCK_DATA',
        trend: mockData.trend,
      };
    } catch (error) {
      console.error('Error fetching commodity price:', error);
      return null;
    }
  }

  /**
   * Calculate market adjustment factor based on commodity trends
   * If material prices are up, adjust quotation up
   * If material prices are down, adjust quotation down
   */
  async calculateMarketAdjustment(material: string): Promise<MarketAdjustment> {
    try {
      const marketPrice = await this.getCommodityPrice(material);

      if (!marketPrice) {
        // No market data found, no adjustment
        return {
          factor: 1.0,
          reason: 'No market data available',
          dataSource: 'NONE',
        };
      }

      // Calculate adjustment factor from trend
      const trend = marketPrice.trend || 0;
      const adjustmentFactor = 1 + trend / 100; // Convert percentage to factor

      let reason = '';
      if (trend > 0) {
        reason = `${marketPrice.commodity} prices up ${trend}% from baseline`;
      } else if (trend < 0) {
        reason = `${marketPrice.commodity} prices down ${Math.abs(trend)}% from baseline`;
      } else {
        reason = `${marketPrice.commodity} prices stable`;
      }

      return {
        factor: adjustmentFactor,
        reason: reason,
        dataSource: marketPrice.source,
      };
    } catch (error) {
      console.error('Error calculating market adjustment:', error);
      return {
        factor: 1.0,
        reason: 'Error fetching market data',
        dataSource: 'ERROR',
      };
    }
  }

  /**
   * Update mock prices for testing
   * In production, this would fetch from external APIs
   */
  updateMockPrices(commodity: string, price: number, trend: number): void {
    const normalized = commodity.toLowerCase();
    MOCK_COMMODITY_PRICES[normalized] = { price, trend };
  }

  /**
   * Integrate with real API (future enhancement)
   * Example: Quandl, Alpha Vantage, or custom commodity API
   */
  async fetchFromRealAPI(commodity: string): Promise<MarketPrice | null> {
    // TODO: Implement real API integration
    // Example with Quandl or similar service:
    // const response = await axios.get(`https://api.quandl.com/api/v3/datasets/CHRIS/${commodity.toUpperCase()}`);
    // return parseResponse(response.data);
    return null;
  }

  /**
   * Get historical price trend for a commodity
   * Useful for forecasting
   */
  async getPriceTrend(commodity: string, days: number = 30): Promise<MarketPrice[]> {
    try {
      // For Phase 1, return mock historical data
      const prices: MarketPrice[] = [];
      const now = new Date();

      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        prices.push({
          commodity: commodity.toLowerCase(),
          price: MOCK_COMMODITY_PRICES[commodity.toLowerCase()]?.price || 5,
          unit: 'USD/kg',
          priceDate: date,
          source: 'MOCK_DATA',
          trend: MOCK_COMMODITY_PRICES[commodity.toLowerCase()]?.trend || 0,
        });
      }

      return prices;
    } catch (error) {
      console.error('Error fetching price trend:', error);
      return [];
    }
  }
}

export default new MarketDataService();
