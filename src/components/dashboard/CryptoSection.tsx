
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { toggleCryptoFavorite, CryptoData } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function CryptoSection() {
  const { data, loading, error, favorites } = useAppSelector(
    (state) => state.dashboard.crypto
  );
  const dispatch = useAppDispatch();

  const handleToggleFavorite = (cryptoId: string) => {
    dispatch(toggleCryptoFavorite(cryptoId));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cryptocurrency</CardTitle>
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
          <CardTitle>Cryptocurrency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-destructive">
            <p>Error loading cryptocurrency data.</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cryptocurrency</CardTitle>
        <Link to="/crypto">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              isFavorite={favorites.includes(crypto.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Format large numbers with appropriate suffixes
const formatNumber = (num: number) => {
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

function CryptoCard({
  crypto,
  isFavorite,
  onToggleFavorite,
}: {
  crypto: CryptoData;
  isFavorite: boolean;
  onToggleFavorite: (cryptoId: string) => void;
}) {
  const priceChangeColor = crypto.priceChange24h >= 0 ? "text-dashboard-green" : "text-dashboard-red";
  const PriceChangeIcon = crypto.priceChange24h >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm card-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="h-8 w-8 mr-2"
          />
          <div>
            <Link to={`/crypto/${crypto.id}`}>
              <h3 className="font-semibold">{crypto.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggleFavorite(crypto.id)}
        >
          <Star
            className={cn("h-5 w-5", isFavorite ? "fill-yellow-400 text-yellow-400" : "")}
          />
          <span className="sr-only">
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </span>
        </Button>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            ${crypto.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <div className={`flex items-center ${priceChangeColor}`}>
            <PriceChangeIcon className="h-4 w-4 mr-1" />
            <span className="font-medium">
              {Math.abs(crypto.priceChange24h).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>Market Cap: {formatNumber(crypto.marketCap)}</span>
          <span>Vol: {formatNumber(crypto.volume24h)}</span>
        </div>
      </div>
    </div>
  );
}
