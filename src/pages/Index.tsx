
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { fetchWeatherData, fetchCryptoData, fetchNewsData } from "@/lib/store";
import { initWebSocket, startWeatherAlertSimulator } from "@/lib/websocket";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WeatherSection } from "@/components/dashboard/WeatherSection";
import { CryptoSection } from "@/components/dashboard/CryptoSection";
import { NewsSection } from "@/components/dashboard/NewsSection";
import { FavoritesSection } from "@/components/dashboard/FavoritesSection";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchWeatherData(["new-york", "london", "tokyo"]));
    dispatch(fetchCryptoData(["bitcoin", "ethereum", "cardano"]));
    dispatch(fetchNewsData());

    // Set up WebSocket connection
    initWebSocket();
    startWeatherAlertSimulator();

    // Set up periodic data refresh (every 60 seconds)
    const intervalId = setInterval(() => {
      dispatch(fetchWeatherData(["new-york", "london", "tokyo"]));
      dispatch(fetchCryptoData(["bitcoin", "ethereum", "cardano"]));
      dispatch(fetchNewsData());
    }, 60000);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6 md:py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="mb-8">
          <FavoritesSection />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeatherSection />
            <CryptoSection />
          </div>
          <div className="space-y-6">
            <NewsSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
