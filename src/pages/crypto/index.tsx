
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchCryptoData, toggleCryptoFavorite, CryptoData } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const CryptoPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, favorites } = useAppSelector(
    (state) => state.dashboard.crypto
  );

  useEffect(() => {
    dispatch(fetchCryptoData(["bitcoin", "ethereum", "cardano"]));
  }, [dispatch]);

  const handleToggleFavorite = (cryptoId: string) => {
    dispatch(toggleCryptoFavorite(cryptoId));
  };

  // Format numbers with commas
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format large numbers with appropriate suffixes
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Cryptocurrency Dashboard</h1>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-7 bg-muted rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => dispatch(fetchCryptoData(["bitcoin", "ethereum", "cardano"]))}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {data.map((crypto) => (
              <CryptoDetailCard
                key={crypto.id}
                crypto={crypto}
                isFavorite={favorites.includes(crypto.id)}
                onToggleFavorite={handleToggleFavorite}
                formatNumber={formatNumber}
                formatLargeNumber={formatLargeNumber}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

function CryptoDetailCard({
  crypto,
  isFavorite,
  onToggleFavorite,
  formatNumber,
  formatLargeNumber,
}: {
  crypto: CryptoData;
  isFavorite: boolean;
  onToggleFavorite: (cryptoId: string) => void;
  formatNumber: (num: number, decimals?: number) => string;
  formatLargeNumber: (num: number) => string;
}) {
  const priceChangeIsPositive = crypto.priceChange24h >= 0;
  const PriceChangeIcon = priceChangeIsPositive ? TrendingUp : TrendingDown;
  const priceChangeColor = priceChangeIsPositive ? "text-dashboard-green" : "text-dashboard-red";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="h-10 w-10 mr-3"
            />
            <div>
              <CardTitle>
                <Link 
                  to={`/crypto/${crypto.id}`}
                  className="hover:underline"
                >
                  {crypto.name} ({crypto.symbol})
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(crypto.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleFavorite(crypto.id)}
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
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Price
            </p>
            <p className="text-3xl font-bold">${formatNumber(crypto.price)}</p>
            <div className={`flex items-center mt-1 ${priceChangeColor}`}>
              <PriceChangeIcon className="h-4 w-4 mr-1" />
              <span className="font-medium">
                {Math.abs(crypto.priceChange24h).toFixed(2)}%
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Market Cap
            </p>
            <p className="text-2xl font-bold">
              ${formatNumber(crypto.marketCap, 0)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              24h Volume
            </p>
            <p className="text-2xl font-bold">
              ${formatNumber(crypto.volume24h, 0)}
            </p>
          </div>

          <div className="flex items-end">
            <Link to={`/crypto/${crypto.id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CryptoPage;
