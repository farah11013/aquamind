import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dna, Waves, Map, Activity, LineChart, Zap, Brain } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Platform Features</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive AI-powered tools for marine research, conservation, and sustainable fisheries management
          </p>
        </div>

        {/* Key Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Activity className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">Real-Time</div>
              <div className="text-sm text-muted-foreground">Live data monitoring</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Brain className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">AI-Powered</div>
              <div className="text-sm text-muted-foreground">Predictive analytics</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">Actionable</div>
              <div className="text-sm text-muted-foreground">Data-driven insights</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Molecular Biodiversity */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Dna className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Molecular Biodiversity</CardTitle>
              <CardDescription className="text-base">
                eDNA sequencing and genetic analysis for species detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Environmental DNA analysis for non-invasive species detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Genetic diversity assessment and population genetics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Biodiversity monitoring in hard-to-reach marine areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Early detection of invasive species</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Oceanographic Data */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Waves className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Oceanographic Data</CardTitle>
              <CardDescription className="text-base">
                Comprehensive environmental parameter monitoring and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Temperature, salinity, pH, and dissolved oxygen tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ocean current patterns and water circulation analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Chemical composition monitoring (nutrients, pollutants)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Depth profiling and bathymetric data integration</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Interactive Mapping */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Interactive Mapping</CardTitle>
              <CardDescription className="text-base">
                Geospatial visualization with customizable data layers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Real-time sensor locations and status visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fish movement tracking with migration route overlays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Marine Protected Areas and biodiversity hotspot mapping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Heatmaps for temperature, salinity, and species distribution</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Advanced Analytics */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Advanced Analytics</CardTitle>
              <CardDescription className="text-base">
                Customizable dashboards with time-series analysis and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Time-series analysis with trend detection and seasonality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Comparative analysis across regions and time periods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Downloadable reports in PDF, Excel, and CSV formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Custom filters for species, location, date range, and parameters</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
