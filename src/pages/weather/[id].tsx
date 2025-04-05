
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchWeatherData, toggleWeatherFavorite } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock historical data - would be replaced with API data
const generateHistoricalData = (days: number, baseTemp: number, baseHumidity: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate some random variations
    const tempVariation = Math.random() * 8 - 4; // -4 to +4
    const humidityVariation = Math.random() * 20 - 10; // -10 to +10
    
    data.push({
      date: date.toISOString().split('T')[0],
      temperature: Math.round((baseTemp + tempVariation) * 10) / 10,
      humidity: Math.max(0, Math.min(100, Math.round(baseHumidity + humidityVariation))),
    });
  }
  
  return data;
};

const WeatherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data, loading, error, favorites } = useAppSelector(
    (state) => state.dashboard.weather
  );
  
  const cityData = data.find((city) => city.id === id);
  const isFavorite = favorites.includes(id || "");
  
  useEffect(() => {
    // If we don't have data yet, fetch it
    if (data.length === 0) {
      dispatch(fetchWeatherData(["new-york", "london", "tokyo"]));
    }
    
    // Generate historical data for the charts
    if (cityData) {
      setHistoryData(generateHistoricalData(7, cityData.temperature, cityData.humidity));
    }
  }, [dispatch, data.length, cityData]);
  
  const handleToggleFavorite = () => {
    if (id) {
      dispatch(toggleWeatherFavorite(id));
    }
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
  
  if (error || !cityData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-6 md:py-10">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate("/weather")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Weather
          </Button>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {error || "City not found. Please select a different city."}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/weather")}
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6 md:py-10">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/weather")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Weather
        </Button>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{cityData.city}</h1>
            <p className="text-muted-foreground">{cityData.country}</p>
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
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <img
                  src={`https://openweathermap.org/img/wn/${cityData.icon}@4x.png`}
                  alt={cityData.condition}
                  className="h-24 w-24 md:h-32 md:w-32"
                />
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold">
                    {cityData.temperature}°C
                  </h2>
                  <p className="text-xl text-muted-foreground mt-1">
                    {cityData.condition}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-2xl font-semibold">{cityData.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p className="text-md font-medium">
                    {new Date(cityData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="temperature">Temperature History</TabsTrigger>
            <TabsTrigger value="humidity">Humidity History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Weather Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                      />
                      <YAxis yAxisId="temp" orientation="left" tick={{ fontSize: 12 }}>
                        <text x={-25} y={15} textAnchor="middle" dominantBaseline="central">
                          °C
                        </text>
                      </YAxis>
                      <YAxis yAxisId="humidity" orientation="right" tick={{ fontSize: 12 }}>
                        <text x={25} y={15} textAnchor="middle" dominantBaseline="central">
                          %
                        </text>
                      </YAxis>
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "temperature") return `${value}°C`;
                          if (name === "humidity") return `${value}%`;
                          return value;
                        }}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          });
                        }}
                      />
                      <Line
                        yAxisId="temp"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#1E40AF"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="humidity"
                        type="monotone"
                        dataKey="humidity"
                        stroke="#10B981"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-700 mr-2"></div>
                    <span className="text-sm">Temperature</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-sm">Humidity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="temperature">
            <Card>
              <CardHeader>
                <CardTitle>Temperature History (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                      />
                      <YAxis tick={{ fontSize: 12 }}>
                        <text x={-25} y={15} textAnchor="middle" dominantBaseline="central">
                          °C
                        </text>
                      </YAxis>
                      <Tooltip 
                        formatter={(value) => [`${value}°C`, "Temperature"]}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          });
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#1E40AF"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="humidity">
            <Card>
              <CardHeader>
                <CardTitle>Humidity History (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                      />
                      <YAxis tick={{ fontSize: 12 }}>
                        <text x={-25} y={15} textAnchor="middle" dominantBaseline="central">
                          %
                        </text>
                      </YAxis>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Humidity"]}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          });
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default WeatherDetailPage;
