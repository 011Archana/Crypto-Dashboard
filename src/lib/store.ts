import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface WeatherData {
  id: string;
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
  timestamp: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
  timestamp: number;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface Notification {
  id: string;
  type: 'price_alert' | 'weather_alert';
  message: string;
  timestamp: number;
  read: boolean;
}

interface DashboardState {
  weather: {
    data: WeatherData[];
    favorites: string[];
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
  };
  crypto: {
    data: CryptoData[];
    favorites: string[];
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
  };
  news: {
    data: NewsItem[];
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
  };
  notifications: {
    items: Notification[];
    unreadCount: number;
  };
}

// Initial state
const initialState: DashboardState = {
  weather: {
    data: [],
    favorites: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  crypto: {
    data: [],
    favorites: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  news: {
    data: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  notifications: {
    items: [],
    unreadCount: 0,
  },
};

// Load any saved data from localStorage
const loadPersistedData = () => {
  try {
    const persistedState = localStorage.getItem('dashboardState');
    
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      
      // Only restore favorites from persisted state
      return {
        ...initialState,
        weather: {
          ...initialState.weather,
          favorites: parsed.weather?.favorites || [],
        },
        crypto: {
          ...initialState.crypto,
          favorites: parsed.crypto?.favorites || [],
        },
      };
    }
  } catch (e) {
    console.error('Failed to load persisted data', e);
  }
  
  return initialState;
};

// Async thunks for API calls
export const fetchWeatherData = createAsyncThunk(
  'dashboard/fetchWeatherData',
  async (cities: string[], { rejectWithValue }) => {
    try {
      // Demo data - would be replaced with actual API call
      const data: WeatherData[] = [
        {
          id: 'new-york',
          city: 'New York',
          country: 'US',
          temperature: 22,
          humidity: 65,
          condition: 'Cloudy',
          icon: '04d',
          timestamp: Date.now(),
        },
        {
          id: 'london',
          city: 'London',
          country: 'UK',
          temperature: 18,
          humidity: 78,
          condition: 'Rainy',
          icon: '10d',
          timestamp: Date.now(),
        },
        {
          id: 'tokyo',
          city: 'Tokyo',
          country: 'JP',
          temperature: 28,
          humidity: 45,
          condition: 'Sunny',
          icon: '01d',
          timestamp: Date.now(),
        },
      ];
      
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch weather data');
    }
  }
);

export const fetchCryptoData = createAsyncThunk(
  'dashboard/fetchCryptoData',
  async (cryptos: string[], { rejectWithValue }) => {
    try {
      // Demo data - would be replaced with actual API call
      const data: CryptoData[] = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 52437.28,
          priceChange24h: 2.54,
          marketCap: 1026484732071,
          volume24h: 42378954321,
          image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
          timestamp: Date.now(),
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          price: 2874.12,
          priceChange24h: -1.27,
          marketCap: 345287654321,
          volume24h: 18765432198,
          image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
          timestamp: Date.now(),
        },
        {
          id: 'cardano',
          name: 'Cardano',
          symbol: 'ADA',
          price: 0.487,
          priceChange24h: 4.83,
          marketCap: 17123456789,
          volume24h: 1234567890,
          image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
          timestamp: Date.now(),
        },
      ];
      
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch crypto data');
    }
  }
);

export const fetchNewsData = createAsyncThunk(
  'dashboard/fetchNewsData',
  async (_, { rejectWithValue }) => {
    try {
      // Demo data - would be replaced with actual API call
      const data: NewsItem[] = [
        {
          id: '1',
          title: 'Bitcoin Surges Above $50,000 as Institutional Interest Grows',
          description: 'Bitcoin has broken the $50,000 barrier once again as institutional adoption continues to increase.',
          url: '#',
          source: 'CryptoNews',
          publishedAt: '2023-04-04T12:30:00Z',
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Progress Report: Final Testing Phase Begins',
          description: 'Ethereum developers announce the final testing phase before the full 2.0 release, promising improved scalability.',
          url: '#',
          source: 'BlockchainInsider',
          publishedAt: '2023-04-04T10:15:00Z',
        },
        {
          id: '3',
          title: 'Cardano Partners with African Nations for Blockchain Identity Solutions',
          description: 'Cardano foundation announces new partnerships with several African governments to implement blockchain-based identity systems.',
          url: '#',
          source: 'CryptoDaily',
          publishedAt: '2023-04-03T18:45:00Z',
        },
        {
          id: '4',
          title: 'Regulatory Clarity Coming for Crypto Industry, Says SEC Commissioner',
          description: 'An SEC commissioner suggests that clearer regulations for cryptocurrencies could be on the horizon.',
          url: '#',
          source: 'FinanceReport',
          publishedAt: '2023-04-03T14:20:00Z',
        },
        {
          id: '5',
          title: 'Major Bank Launches Cryptocurrency Custody Services for Institutional Clients',
          description: 'A leading global bank now offers cryptocurrency custody services for its institutional clients, citing increasing demand.',
          url: '#',
          source: 'BankingTech',
          publishedAt: '2023-04-02T09:30:00Z',
        },
      ];
      
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch news data');
    }
  }
);

// Create slices
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: loadPersistedData(),
  reducers: {
    toggleWeatherFavorite(state, action: PayloadAction<string>) {
      const cityId = action.payload;
      const index = state.weather.favorites.indexOf(cityId);
      
      if (index >= 0) {
        state.weather.favorites.splice(index, 1);
      } else {
        state.weather.favorites.push(cityId);
      }
      
      // Persist to localStorage
      localStorage.setItem('dashboardState', JSON.stringify({
        weather: { favorites: state.weather.favorites },
        crypto: { favorites: state.crypto.favorites },
      }));
    },
    toggleCryptoFavorite(state, action: PayloadAction<string>) {
      const cryptoId = action.payload;
      const index = state.crypto.favorites.indexOf(cryptoId);
      
      if (index >= 0) {
        state.crypto.favorites.splice(index, 1);
      } else {
        state.crypto.favorites.push(cryptoId);
      }
      
      // Persist to localStorage
      localStorage.setItem('dashboardState', JSON.stringify({
        weather: { favorites: state.weather.favorites },
        crypto: { favorites: state.crypto.favorites },
      }));
    },
    addNotification(state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) {
      const { type, message } = action.payload;
      const newNotification: Notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: Date.now(),
        read: false,
      };
      
      state.notifications.items.unshift(newNotification);
      state.notifications.unreadCount += 1;
      
      // Keep only the latest 20 notifications
      if (state.notifications.items.length > 20) {
        state.notifications.items = state.notifications.items.slice(0, 20);
      }
    },
    markNotificationAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.notifications.unreadCount = Math.max(0, state.notifications.unreadCount - 1);
      }
    },
    markAllNotificationsAsRead(state) {
      state.notifications.items.forEach(notification => {
        notification.read = true;
      });
      state.notifications.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Weather data
    builder.addCase(fetchWeatherData.pending, (state) => {
      state.weather.loading = true;
      state.weather.error = null;
    });
    builder.addCase(fetchWeatherData.fulfilled, (state, action) => {
      state.weather.loading = false;
      state.weather.data = action.payload;
      state.weather.lastUpdated = Date.now();
    });
    builder.addCase(fetchWeatherData.rejected, (state, action) => {
      state.weather.loading = false;
      state.weather.error = action.payload as string;
    });
    
    // Crypto data
    builder.addCase(fetchCryptoData.pending, (state) => {
      state.crypto.loading = true;
      state.crypto.error = null;
    });
    builder.addCase(fetchCryptoData.fulfilled, (state, action) => {
      state.crypto.loading = false;
      state.crypto.data = action.payload;
      state.crypto.lastUpdated = Date.now();
    });
    builder.addCase(fetchCryptoData.rejected, (state, action) => {
      state.crypto.loading = false;
      state.crypto.error = action.payload as string;
    });
    
    // News data
    builder.addCase(fetchNewsData.pending, (state) => {
      state.news.loading = true;
      state.news.error = null;
    });
    builder.addCase(fetchNewsData.fulfilled, (state, action) => {
      state.news.loading = false;
      state.news.data = action.payload;
      state.news.lastUpdated = Date.now();
    });
    builder.addCase(fetchNewsData.rejected, (state, action) => {
      state.news.loading = false;
      state.news.error = action.payload as string;
    });
  },
});

// Export actions
export const { 
  toggleWeatherFavorite, 
  toggleCryptoFavorite, 
  addNotification, 
  markNotificationAsRead,
  markAllNotificationsAsRead
} = dashboardSlice.actions;

// Create the store
export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
