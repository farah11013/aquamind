import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fish, Dna, Waves, Brain, Map, TrendingUp } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Platform Features</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Our AI-powered platform integrates multiple data sources to provide comprehensive ocean insights for marine research and sustainable fisheries management</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Fisheries Analytics */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Fish className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Fisheries Analytics</CardTitle>
              <CardDescription className="text-base">
                AI-powered analysis of fish populations, migration patterns, and sustainable harvesting recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Population dynamics analysis and trend forecasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Migration pattern tracking and seasonal distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Sustainable harvest recommendations based on stock assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fishing pressure assessment and quota management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Molecular Biodiversity */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Dna className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Molecular Biodiversity</CardTitle>
              <CardDescription className="text-base">
                DNA sequencing data analysis for species identification, genetic diversity, and ecosystem health assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>eDNA sequence analysis for species detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Genetic diversity assessment and population genetics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Biodiversity hotspot identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ecosystem health monitoring through genetic markers</span>
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
                Comprehensive data on temperature, salinity, currents, and chemical composition with predictive modeling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Real-time ocean parameter monitoring (temperature, salinity, pH, oxygen)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Current patterns and water circulation analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Chemical composition tracking and water quality assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Predictive modeling for ocean condition forecasting</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* AI Predictions */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">AI Predictions</CardTitle>
              <CardDescription className="text-base">
                Machine learning algorithms for forecasting ecosystem changes, species movements, and climate impacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ecosystem change prediction and early warning systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Species distribution modeling under climate scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Automated otolith image analysis for age estimation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Correlation analysis between environmental factors and biodiversity</span>
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
                Visualize data layers on interactive maps with customizable parameters and real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Multi-layer map visualization with ocean conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fish distribution and biodiversity hotspot mapping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Marine protected area monitoring and planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Customizable filters by time, location, and species</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Advanced Analytics */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Advanced Analytics</CardTitle>
              <CardDescription className="text-base">
                Customizable dashboards, trend analysis, correlation detection, and anomaly identification tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Custom dashboard creation with drag-and-drop widgets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Temporal trend analysis and seasonal pattern detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Correlation analysis between multiple parameters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Automated anomaly detection and alert notifications</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
