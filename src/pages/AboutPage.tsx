import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Target, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            About <span className="gradient-text">CMLRE</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Centre for Marine Living Resources and Ecology
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Waves className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Centre for Marine Living Resources and Ecology (CMLRE) is a premier research institution dedicated to understanding and conserving India's marine ecosystems. Our mission is to provide scientific knowledge and technological solutions for sustainable management of marine living resources.
              </p>
              <p>
                Through cutting-edge research, advanced monitoring systems, and data-driven approaches, we support policymakers, scientists, and stakeholders in making informed decisions about marine conservation and fisheries management.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Research Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Marine biodiversity assessment and monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Fisheries stock assessment and management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Oceanographic research and climate change impacts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Marine ecosystem modeling and prediction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Molecular biology and genetics of marine species</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Platform Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Scientists:</strong> Full access to data analysis and research tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Policymakers:</strong> Visualization tools and summary reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Data Administrators:</strong> Data management and user administration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Guest Users:</strong> Limited access to public datasets</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Platform Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The CMLRE Marine Data Platform serves as a unified hub for integrating, processing, and analyzing heterogeneous marine datasets. Our objectives include:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Centralize marine data from multiple sources and formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Provide interactive visualization tools for data exploration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Enable AI-powered analysis for species identification and ecosystem monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Support data-driven decision-making for marine conservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Facilitate collaboration between scientists, policymakers, and stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Promote sustainable fisheries and marine ecosystem management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <p className="text-muted-foreground mb-4">
                For more information about CMLRE and our research activities
              </p>
              <a
                href="https://cmlre.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Visit Official Website →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
