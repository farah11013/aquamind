import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Droplets, Wind, Thermometer, Gauge, Radio, MapPin } from 'lucide-react';
import { generateMarineData, getSensorStatuses, getFishMovements, type MarineDataPoint, type SensorStatus, type FishMovement } from '@/services/marineDataService';

export default function LiveDataPage() {
  const [marineData, setMarineData] = useState<MarineDataPoint>(generateMarineData());
  const [sensors, setSensors] = useState<SensorStatus[]>(getSensorStatuses());
  const [fishMovements, setFishMovements] = useState<FishMovement[]>(getFishMovements());

  useEffect(() => {
    const interval = setInterval(() => {
      setMarineData(generateMarineData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Live Marine Data</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time oceanographic parameters and sensor monitoring
          </p>
        </div>

        {/* Real-time Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marineData.temperature.toFixed(1)}°C</div>
              <p className="text-xs text-muted-foreground mt-1">
                {marineData.location.name}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Salinity</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marineData.salinity.toFixed(1)} PSU</div>
              <p className="text-xs text-muted-foreground mt-1">
                Practical Salinity Units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marineData.ph.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {marineData.ph > 8.0 ? 'Alkaline' : 'Normal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marineData.oxygen.toFixed(1)} mg/L</div>
              <p className="text-xs text-muted-foreground mt-1">
                {marineData.oxygen > 6 ? 'Healthy' : 'Low'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sensor Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              <CardTitle>Sensor Network Status</CardTitle>
            </div>
            <CardDescription>
              Real-time monitoring of deployed marine sensors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensors.map((sensor) => (
                <div key={sensor.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${sensor.status === 'active' ? 'bg-green-500' : sensor.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="font-medium">{sensor.name}</div>
                      <div className="text-sm text-muted-foreground">{sensor.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">Battery: {sensor.battery}%</div>
                      <div className="text-xs text-muted-foreground">
                        Updated {Math.floor((Date.now() - sensor.lastUpdate.getTime()) / 60000)}m ago
                      </div>
                    </div>
                    <Badge className={getStatusColor(sensor.status)}>
                      {sensor.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fish Movement Tracking */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Fish Movement Tracking</CardTitle>
            </div>
            <CardDescription>
              Recent fish school movements detected by acoustic sensors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fishMovements.map((movement, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{movement.species}</div>
                      <div className="text-sm text-muted-foreground">
                        Count: {movement.count} • Direction: {movement.direction}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {movement.location.lat.toFixed(4)}°N, {movement.location.lng.toFixed(4)}°E
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor((Date.now() - movement.timestamp.getTime()) / 60000)} minutes ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
