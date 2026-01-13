import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Database, LineChart, Brain, Fish, Waves, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 ocean-wave-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl xl:text-6xl font-bold mb-6">
              <span className="gradient-text">Marine Data Platform</span>
              <br />
              <span className="text-foreground">for Sustainable Oceans</span>
            </h1>
            <p className="text-lg xl:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive AI-enabled platform integrating marine datasets to support data-driven decision-making in marine conservation and fisheries management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/visualizations">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Data <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 xl:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for marine research, data analysis, and ecosystem management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="border-border hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Data Integration</CardTitle>
                <CardDescription>
                  Upload and integrate multiple marine dataset types including oceanographic parameters, fish surveys, and eDNA data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Interactive Visualizations</CardTitle>
                <CardDescription>
                  Real-time interactive maps and dynamic charts showing ocean conditions, fish distribution, and biodiversity patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Advanced AI algorithms for species identification, population predictions, and ecosystem change detection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Fish className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Species Identification</CardTitle>
                <CardDescription>
                  Upload fish images for AI-powered species identification with detailed biological information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Waves className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Oceanographic Data</CardTitle>
                <CardDescription>
                  Comprehensive data on temperature, salinity, currents, and chemical composition with predictive modeling
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Geospatial Analysis</CardTitle>
                <CardDescription>
                  Location-based data analysis and visualization for marine protected areas and biodiversity hotspots
                </CardDescription>
              </CardHeader>
            </Card>
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
                  Start Exploring Marine Data Today
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Join scientists and policymakers in making data-driven decisions for sustainable marine ecosystems
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Create Account
                    </Button>
                  </Link>
                  <Link to="/api">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                      View API Docs
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
