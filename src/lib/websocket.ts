
import { store, addNotification } from './store';

// Define WebSocket connection type
type WSConnection = {
  socket: WebSocket | null;
  isConnected: boolean;
  reconnectAttempts: number;
  reconnectTimeout: NodeJS.Timeout | null;
};

// Create WebSocket connection object
const connection: WSConnection = {
  socket: null,
  isConnected: false,
  reconnectAttempts: 0,
  reconnectTimeout: null,
};

// Initialize WebSocket connection
export const initWebSocket = () => {
  // Create WebSocket connection to CoinCap API
  try {
    // If there's an existing connection, close it
    if (connection.socket) {
      connection.socket.close();
    }

    // Clear any existing reconnect timeout
    if (connection.reconnectTimeout) {
      clearTimeout(connection.reconnectTimeout);
      connection.reconnectTimeout = null;
    }

    // Initialize connection
    connection.socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum');

    // Handle connection open
    connection.socket.onopen = () => {
      console.log('WebSocket connection established');
      connection.isConnected = true;
      connection.reconnectAttempts = 0;
      
      // Notify user that connection is established
      store.dispatch(
        addNotification({
          type: 'price_alert',
          message: 'Real-time cryptocurrency updates connected',
        })
      );
    };

    // Handle incoming messages
    connection.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Process price updates
        if (data.bitcoin) {
          const bitcoinPrice = parseFloat(data.bitcoin);
          const currentState = store.getState();
          const lastPrice = currentState.dashboard.crypto.data.find(
            (crypto) => crypto.id === 'bitcoin'
          )?.price || 0;
          
          // Calculate percent difference
          const percentDiff = ((bitcoinPrice - lastPrice) / lastPrice) * 100;
          
          // If price changed by more than 0.5%, send a notification
          if (Math.abs(percentDiff) >= 0.5) {
            store.dispatch(
              addNotification({
                type: 'price_alert',
                message: `Bitcoin ${percentDiff > 0 ? 'up' : 'down'} ${Math.abs(percentDiff).toFixed(2)}% to $${bitcoinPrice.toLocaleString()}`,
              })
            );
          }
        }
        
        if (data.ethereum) {
          const ethereumPrice = parseFloat(data.ethereum);
          const currentState = store.getState();
          const lastPrice = currentState.dashboard.crypto.data.find(
            (crypto) => crypto.id === 'ethereum'
          )?.price || 0;
          
          // Calculate percent difference
          const percentDiff = ((ethereumPrice - lastPrice) / lastPrice) * 100;
          
          // If price changed by more than 0.5%, send a notification
          if (Math.abs(percentDiff) >= 0.5) {
            store.dispatch(
              addNotification({
                type: 'price_alert',
                message: `Ethereum ${percentDiff > 0 ? 'up' : 'down'} ${Math.abs(percentDiff).toFixed(2)}% to $${ethereumPrice.toLocaleString()}`,
              })
            );
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    // Handle connection close
    connection.socket.onclose = () => {
      console.log('WebSocket connection closed');
      connection.isConnected = false;
      
      // Attempt to reconnect after delay
      connection.reconnectTimeout = setTimeout(() => {
        if (connection.reconnectAttempts < 5) {
          console.log(`Attempting to reconnect (${connection.reconnectAttempts + 1}/5)...`);
          connection.reconnectAttempts++;
          initWebSocket();
        } else {
          console.error('Failed to reconnect after 5 attempts');
          store.dispatch(
            addNotification({
              type: 'price_alert',
              message: 'Real-time updates disconnected. Please refresh the page.',
            })
          );
        }
      }, 5000);
    };

    // Handle connection error
    connection.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Close connection to trigger reconnect
      if (connection.socket) {
        connection.socket.close();
      }
    };
  } catch (error) {
    console.error('Error initializing WebSocket:', error);
  }
};

// Setup weather alert simulator
let weatherAlertInterval: NodeJS.Timeout | null = null;

export const startWeatherAlertSimulator = () => {
  if (weatherAlertInterval) {
    clearInterval(weatherAlertInterval);
  }
  
  // Send random weather alerts every 20-60 seconds
  weatherAlertInterval = setInterval(() => {
    const cities = ['New York', 'London', 'Tokyo'];
    const alerts = [
      'Heavy rain expected',
      'Tornado warning issued',
      'Extreme heat alert',
      'Snowstorm approaching',
      'Thunderstorm warning',
      'Flash flood alert',
      'High wind advisory',
    ];
    
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    
    store.dispatch(
      addNotification({
        type: 'weather_alert',
        message: `${randomCity}: ${randomAlert}`,
      })
    );
  }, Math.floor(Math.random() * 40000) + 20000); // Random interval between 20-60 seconds
};

// Clean up function for WebSocket connection
export const cleanupWebSocket = () => {
  if (connection.socket) {
    connection.socket.close();
    connection.socket = null;
  }
  
  if (connection.reconnectTimeout) {
    clearTimeout(connection.reconnectTimeout);
    connection.reconnectTimeout = null;
  }
  
  if (weatherAlertInterval) {
    clearInterval(weatherAlertInterval);
    weatherAlertInterval = null;
  }
};
