
import { useAppSelector } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export function FavoritesSection() {
  const weatherData = useAppSelector((state) => state.dashboard.weather.data);
  const weatherFavorites = useAppSelector((state) => state.dashboard.weather.favorites);
  const cryptoData = useAppSelector((state) => state.dashboard.crypto.data);
  const cryptoFavorites = useAppSelector((state) => state.dashboard.crypto.favorites);

  const favoriteWeather = weatherData.filter((city) => weatherFavorites.includes(city.id));
  const favoriteCrypto = cryptoData.filter((crypto) => cryptoFavorites.includes(crypto.id));

  const hasFavorites = favoriteWeather.length > 0 || favoriteCrypto.length > 0;

  if (!hasFavorites) {
    return (
      <Alert>
        <Star className="h-4 w-4" />
        <AlertTitle>No favorites yet</AlertTitle>
        <AlertDescription>
          Star your favorite cities and cryptocurrencies to see them here.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" /> 
          Your Favorites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {favoriteWeather.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Weather</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteWeather.map((city) => (
                  <Link
                    key={city.id}
                    to={`/weather/${city.id}`}
                    className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                      alt={city.condition}
                      className="h-10 w-10"
                    />
                    <div>
                      <p className="font-medium">{city.city}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{city.temperature}°C</span>
                        <span className="mx-1">•</span>
                        <span>{city.condition}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favoriteCrypto.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Cryptocurrency</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteCrypto.map((crypto) => (
                  <Link
                    key={crypto.id}
                    to={`/crypto/${crypto.id}`}
                    className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="h-8 w-8"
                    />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <div className="flex items-center text-sm">
                        <span>${crypto.price.toLocaleString()}</span>
                        <span 
                          className={
                            crypto.priceChange24h >= 0 
                              ? "text-dashboard-green ml-2" 
                              : "text-dashboard-red ml-2"
                          }
                        >
                          {crypto.priceChange24h >= 0 ? "+" : ""}
                          {crypto.priceChange24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
