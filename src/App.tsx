
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from "./lib/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { cleanupWebSocket } from "./lib/websocket";

// Import pages
import Dashboard from "./pages/Index";
import WeatherPage from "./pages/weather/index";
import WeatherDetailPage from "./pages/weather/[id]";
import CryptoPage from "./pages/crypto/index";
import CryptoDetailPage from "./pages/crypto/[id]";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Clean up WebSocket connection on unmount
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/weather/:id" element={<WeatherDetailPage />} />
              <Route path="/crypto" element={<CryptoPage />} />
              <Route path="/crypto/:id" element={<CryptoDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
