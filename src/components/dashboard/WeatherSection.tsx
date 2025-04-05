
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { toggleWeatherFavorite, WeatherData } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function WeatherSection() {
  const { data, loading, error, favorites } = useAppSelector(
    (state) => state.dashboard.weather
  );
  const dispatch = useAppDispatch();

  const handleToggleFavorite = (cityId: string) => {
    dispatch(toggleWeatherFavorite(cityId));
  };

  // Weather icon mapping
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-36 rounded-md bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-destructive">
            <p>Error loading weather data.</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather</CardTitle>
        <Link to="/weather">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((city) => (
            <WeatherCard
              key={city.id}
              city={city}
              isFavorite={favorites.includes(city.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherCard({
  city,
  isFavorite,
  onToggleFavorite,
}: {
  city: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: (cityId: string) => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm card-hover">
      <div className="flex items-start justify-between">
        <div>
          <Link to={`/weather/${city.id}`}>
            <h3 className="font-semibold text-lg">{city.city}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{city.country}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggleFavorite(city.id)}
        >
          <Star
            className={cn("h-5 w-5", isFavorite ? "fill-yellow-400 text-yellow-400" : "")}
          />
          <span className="sr-only">
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </span>
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
            alt={city.condition}
            className="h-12 w-12 -ml-2"
          />
          <div>
            <span className="text-2xl font-bold">{city.temperature}°C</span>
            <p className="text-sm text-muted-foreground">{city.condition}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Humidity</p>
          <p className="font-medium">{city.humidity}%</p>
        </div>
      </div>
    </div>
  );
}
