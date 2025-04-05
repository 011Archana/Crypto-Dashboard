
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchCryptoData, toggleCryptoFavorite } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, TrendingDown, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock historical data - would be replaced with API data
const generateHistoricalPriceData = (days: number, basePrice: number, volatility: number) => {
  const data = [];
  const now = new Date();
  
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate some random variations based on volatility
    const change = ((Math.random() * 2 - 1) * volatility) * currentPrice;
    currentPrice += change;
    
    // Ensure price doesn't go negative
    currentPrice = Math.max(currentPrice, 0.1 * basePrice);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.round(Math.random() * basePrice * 100000),
    });
  }
  
  return data;
};

const CryptoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [timePeriod, setTimePeriod] = useState("7d");
  
  const { data, loading, error, favorites } = useAppSelector(
    (state) => state.dashboard.crypto
  );
  
  const cryptoData = data.find((crypto) => crypto.id === id);
  const isFavorite = favorites.includes(id || "");
  
  useEffect(() => {
    // If we don't have data yet, fetch it
    if (data.length === 0) {
      dispatch(fetchCryptoData(["bitcoin", "ethereum", "cardano"]));
    }
    
    // Generate historical data for the charts
    if (cryptoData) {
      let days = 7;
      let volatility = 0.02; // 2% daily volatility
      
      // Adjust based on selected time period
      if (timePeriod === "30d") {
        days = 30;
        volatility = 0.015;
      } else if (timePeriod === "90d") {
        days = 90;
        volatility = 0.01;
      } else if (timePeriod === "1y") {
        days = 365;
        volatility = 0.008;
      }
      
      setHistoryData(generateHistoricalPriceData(days, cryptoData.price, volatility));
    }
  }, [dispatch, data.length, cryptoData, timePeriod]);
  
  const handleToggleFavorite = () => {
    if (id) {
      dispatch(toggleCryptoFavorite(id));
    }
  };
  
  // Format numbers with commas
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-6 md:py-10">
          <div className="h-6 bg-muted rounded w-24 mb-8 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-1/3 mb-6 animate-pulse"></div>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-7 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !cryptoData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-6 md:py-10">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate("/crypto")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cryptocurrencies
          </Button>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {error || "Cryptocurrency not found. Please select a different one."}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/crypto")}
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Define the price change icon component based on the price change
  const PriceChangeIcon = cryptoData.priceChange24h >= 0 ? TrendingUp : TrendingDown;
  const priceChangeColor = cryptoData.priceChange24h >= 0 ? "text-dashboard-green" : "text-dashboard-red";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6 md:py-10">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/crypto")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cryptocurrencies
        </Button>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img 
              src={cryptoData.image} 
              alt={cryptoData.name}
              className="h-12 w-12 mr-4" 
            />
            <div>
              <h1 className="text-3xl font-bold">{cryptoData.name}</h1>
              <p className="text-muted-foreground">{cryptoData.symbol}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              isFavorite && "bg-yellow-50 border-yellow-200"
            )}
            onClick={handleToggleFavorite}
          >
            <Star
              className={cn("h-5 w-5", isFavorite ? "fill-yellow-400 text-yellow-400" : "")}
            />
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <h2 className="text-3xl font-bold mt-1">
                  ${formatNumber(cryptoData.price)}
                </h2>
                <div className={`flex items-center mt-1 ${priceChangeColor}`}>
                  <PriceChangeIcon className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {Math.abs(cryptoData.priceChange24h).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <h2 className="text-3xl font-bold mt-1">
                  ${formatNumber(cryptoData.marketCap, 0)}
                </h2>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <h2 className="text-3xl font-bold mt-1">
                  ${formatNumber(cryptoData.volume24h, 0)}
                </h2>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-lg font-medium mt-1">
                  {new Date(cryptoData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-6 flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Price Chart</TabsTrigger>
              <TabsTrigger value="volume">Volume Chart</TabsTrigger>
              <TabsTrigger value="comparison">Price & Volume</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Button
              variant={timePeriod === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("7d")}
            >
              7D
            </Button>
            <Button
              variant={timePeriod === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("30d")}
            >
              30D
            </Button>
            <Button
              variant={timePeriod === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("90d")}
            >
              90D
            </Button>
            <Button
              variant={timePeriod === "1y" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("1y")}
            >
              1Y
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="overview" className="mt-0">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={historyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          if (timePeriod === "1y") {
                            return date.toLocaleDateString(undefined, {
                              month: 'short',
                            });
                          }
                          return date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `$${formatNumber(value)}`}
                      />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <Tooltip 
                        formatter={(value) => [`$${formatNumber(Number(value))}`, "Price"]}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          });
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#1E40AF" 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="volume" className="mt-0">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={historyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          if (timePeriod === "1y") {
                            return date.toLocaleDateString(undefined, {
                              month: 'short',
                            });
                          }
                          return date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${formatNumber(value, 0)}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${formatNumber(Number(value), 0)}`, "Volume"]}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          });
                        }}
                      />
                      <Bar dataKey="volume" fill="#10B981" barSize={timePeriod === "1y" ? 2 : 10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="comparison" className="mt-0">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          if (timePeriod === "1y") {
                            return date.toLocaleDateString(undefined, {
                              month: 'short',
                            });
                          }
                          return date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                      />
                      <YAxis 
                        yAxisId="price"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${formatNumber(value)}`}
                      />
                      <YAxis 
                        yAxisId="volume"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${formatNumber(value, 0)}`}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "price") return [`$${formatNumber(Number(value))}`, "Price"];
                          if (name === "volume") return [`$${formatNumber(Number(value), 0)}`, "Volume"];
                          return [value, name];
                        }}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          });
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="price"
                        type="monotone" 
                        dataKey="price" 
                        stroke="#1E40AF" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        yAxisId="volume"
                        type="monotone" 
                        dataKey="volume" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CryptoDetailPage;
