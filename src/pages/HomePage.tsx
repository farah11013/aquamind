import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Database, LineChart, Brain, Fish, Waves, MapPin, Activity, TrendingUp } from 'lucide-react';
import { getRealTimeStats } from '@/services/marineDataService';

export default function HomePage() {
  const [stats, setStats] = useState(getRealTimeStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getRealTimeStats());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 ocean-wave-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl xl:text-6xl font-bold mb-6">
              <span className="gradient-text">AquaMind</span>
              <br />
              <span className="text-foreground">AI-Driven Marine Intelligence Platform</span>
            </h1>
            <p className="text-lg xl:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering researchers, fisheries, conservationists, and policymakers with real-time marine data, AI insights, and predictive analytics for sustainable ocean management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/live-data">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Live Data <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/ai-insights">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View AI Insights
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Statistics */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl xl:text-3xl font-bold mb-2">Live Marine Statistics</h2>
            <p className="text-muted-foreground">Real-time data from our sensor network</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.activeSensors}</div>
                <div className="text-sm text-muted-foreground">Active Sensors</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{(stats.dataPoints / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Fish className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.speciesMonitored}</div>
                <div className="text-sm text-muted-foreground">Species Monitored</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.alertsToday}</div>
                <div className="text-sm text-muted-foreground">Alerts Today</div>
              </CardContent>
            </Card>
          </div>

          {/* Current Ocean Conditions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-muted-foreground mb-1">Temperature</div>
                <div className="text-2xl font-bold">{stats.temperature}°C</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-muted-foreground mb-1">Salinity</div>
                <div className="text-2xl font-bold">{stats.salinity} PSU</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-muted-foreground mb-1">pH Level</div>
                <div className="text-2xl font-bold">{stats.ph}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-muted-foreground mb-1">Oxygen</div>
                <div className="text-2xl font-bold">{stats.oxygen} mg/L</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI-powered tools for marine research, data analysis, and ecosystem management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Link to="/live-data">
              <Card className="border-border hover:shadow-hover transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Real-Time Data</CardTitle>
                  <CardDescription>
                    Live oceanographic parameters, sensor monitoring, and fish movement tracking with interactive dashboards
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/ai-insights">
              <Card className="border-border hover:shadow-hover transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>
                    Predictive analytics, anomaly detection, sustainability warnings, and actionable recommendations powered by AI
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/fish-identification">
              <Card className="border-border hover:shadow-hover transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Fish className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Fish Species ID</CardTitle>
                  <CardDescription>
                    AI-powered image recognition for instant fish species identification with conservation status and habitat info
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/dataset-analytics">
              <Card className="border-border hover:shadow-hover transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>
                    Time-series analysis, heatmaps, trend graphs, and downloadable reports with customizable filters
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/alerts">
              <Card className="border-border hover:shadow-hover transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Waves className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Smart Alerts</CardTitle>
                  <CardDescription>
                    Real-time notifications for environmental anomalies, endangered species detection, and pollution risks
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/features">
              <Card className="border-border hover:shadow-hover transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Geospatial Analysis</CardTitle>
                  <CardDescription>
                    Interactive maps with marine data layers, biodiversity hotspots, and protected area monitoring
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 xl:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl xl:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              AquaMind is dedicated to protecting and preserving marine ecosystems through cutting-edge AI technology and data-driven insights. We empower stakeholders with the tools and knowledge needed to make informed decisions for sustainable fisheries management, marine conservation, and climate resilience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">SDG 14</div>
                <div className="text-sm text-muted-foreground">Life Below Water</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">SDG 13</div>
                <div className="text-sm text-muted-foreground">Climate Action</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">SDG 2</div>
                <div className="text-sm text-muted-foreground">Zero Hunger</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="p-8 xl:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                  Start Exploring Marine Intelligence Today
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Join researchers, fishermen, conservationists, and policymakers in making data-driven decisions for sustainable marine ecosystems
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/live-data">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      View Live Data
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
