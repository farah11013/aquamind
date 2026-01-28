import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fish, Dna, Waves, Brain, Map, TrendingUp, Activity, Bell, Database, LineChart, Zap, Shield } from 'lucide-react';

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
          {/* Real-Time Data Ingestion */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">Real-Time Data Ingestion</CardTitle>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Live</Badge>
              </div>
              <CardDescription className="text-base">
                Continuous data collection from multiple sources with automated processing and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>127+ IoT sensors monitoring temperature, salinity, pH, and oxygen levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Satellite data integration for sea surface temperature and chlorophyll</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Acoustic monitoring for fish movement and population tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Automated data cleaning, validation, and quality control</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* AI Analytics */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">AI Analytics</CardTitle>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Intelligent</Badge>
              </div>
              <CardDescription className="text-base">
                Machine learning models for predictive insights and anomaly detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Population trend forecasting with 87% accuracy using LSTM networks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Anomaly detection for environmental threats and ecosystem changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Correlation analysis between ocean parameters and fish populations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Explainable AI with confidence scores and reasoning</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Fish Species Identification */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Fish className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">Fish Species Identification</CardTitle>
                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Computer Vision</Badge>
              </div>
              <CardDescription className="text-base">
                AI-powered image recognition for instant species identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Convolutional Neural Network trained on 342+ marine species</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Confidence scores and alternative species suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Conservation status, habitat info, and biological characteristics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Support for camera upload and real-time identification</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Predictive Modeling */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">Predictive Modeling</CardTitle>
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Forecasting</Badge>
              </div>
              <CardDescription className="text-base">
                Advanced models for ecosystem forecasting and sustainability planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fish population predictions for optimal fishing windows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Climate impact modeling on marine ecosystems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Migration pattern forecasting based on environmental factors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Sustainable harvest recommendations with quota optimization</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Sustainability Monitoring */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">Sustainability Monitoring</CardTitle>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Conservation</Badge>
              </div>
              <CardDescription className="text-base">
                Track compliance and promote sustainable fishing practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fishing ban compliance monitoring (78% compliance rate achieved)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Overfishing risk alerts and sustainable catch recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Marine Protected Area effectiveness assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Biodiversity hotspot identification for conservation planning</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Smart Alerts */}
          <Card className="border-border hover:shadow-hover transition-all">
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">Smart Alerts</CardTitle>
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>
              </div>
              <CardDescription className="text-base">
                Real-time notifications for environmental anomalies and threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Temperature anomalies and thermal pollution detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Endangered species detection with immediate caution alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ocean acidification and pollution risk warnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Multi-channel notifications (dashboard, email, SMS)</span>
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
