
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchWeatherData, toggleWeatherFavorite, WeatherData } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const WeatherPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, favorites } = useAppSelector(
    (state) => state.dashboard.weather
  );

  useEffect(() => {
    dispatch(fetchWeatherData(["new-york", "london", "tokyo"]));
  }, [dispatch]);

  const handleToggleFavorite = (cityId: string) => {
    dispatch(toggleWeatherFavorite(cityId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Weather Dashboard</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-7 bg-muted rounded w-1/2"></div>
                  <div className="h-5 bg-muted rounded w-1/4 mt-1"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Failed to load weather data</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => dispatch(fetchWeatherData(["new-york", "london", "tokyo"]))}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((city) => (
              <WeatherCard
                key={city.id}
                city={city}
                isFavorite={favorites.includes(city.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

function WeatherCard({
  city,
  isFavorite,
  onToggleFavorite,
}: {
  city: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: (cityId: string) => void;
}) {
  const date = new Date(city.timestamp);
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">
              <Link to={`/weather/${city.id}`} className="hover:underline">
                {city.city}
              </Link>
            </CardTitle>
            <CardDescription className="text-blue-100">
              {city.country}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => onToggleFavorite(city.id)}
          >
            <Star
              className={cn(
                "h-5 w-5",
                isFavorite ? "fill-yellow-400 text-yellow-400" : ""
              )}
            />
            <span className="sr-only">
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
              alt={city.condition}
              className="h-16 w-16 -ml-2"
            />
            <div>
              <span className="text-3xl font-bold">{city.temperature}°C</span>
              <p className="text-muted-foreground">{city.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Humidity</p>
            <p className="text-2xl font-bold">{city.humidity}%</p>
          </div>
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Last updated: {formattedDate} at {formattedTime}</p>
          <Link 
            to={`/weather/${city.id}`}
            className="text-primary font-medium inline-block mt-2 hover:underline"
          >
            View details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default WeatherPage;
