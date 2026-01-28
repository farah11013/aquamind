import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Target, Users, Globe, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            About <span className="gradient-text">AquaMind</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            AI-Driven Marine Intelligence Platform for Sustainable Oceans
          </p>
        </div>

        <div className="space-y-8">
          {/* Problem Statement */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <CardTitle className="text-2xl">The Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Marine ecosystems face unprecedented challenges: overfishing threatens 34% of global fish stocks, climate change causes ocean warming and acidification, and pollution degrades critical habitats. Traditional monitoring methods are fragmented, slow, and insufficient for real-time decision-making.
              </p>
              <p>
                Researchers, fisheries managers, and policymakers struggle with:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Lack of integrated, real-time marine data across multiple sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Inability to predict ecosystem changes and population trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Delayed detection of environmental anomalies and threats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Limited tools for sustainable fisheries management</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Our Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                AquaMind is an AI-driven unified marine intelligence platform that integrates real-time oceanographic data, predictive analytics, and smart monitoring to empower stakeholders with actionable insights for sustainable ocean management.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="font-semibold mb-2">Real-Time Monitoring</div>
                  <div className="text-sm">Live data from 127+ sensors tracking temperature, salinity, pH, oxygen, and fish movements</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="font-semibold mb-2">AI Predictions</div>
                  <div className="text-sm">Machine learning models forecast population trends, detect anomalies, and generate sustainability warnings</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="font-semibold mb-2">Smart Alerts</div>
                  <div className="text-sm">Instant notifications for environmental threats, endangered species, and overfishing risks</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="font-semibold mb-2">Species ID</div>
                  <div className="text-sm">Computer vision for instant fish identification with conservation status and habitat information</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Waves className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                AquaMind is dedicated to protecting and preserving marine ecosystems through cutting-edge AI technology and data-driven insights. Our mission is to provide scientific knowledge and technological solutions for sustainable management of marine living resources.
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
                The AquaMind Marine Data Platform serves as a unified hub for integrating, processing, and analyzing heterogeneous marine datasets. Our objectives include:
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

          {/* Sustainability Impact - SDGs */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Sustainability Impact (UN SDGs)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <p>
                AquaMind directly contributes to multiple United Nations Sustainable Development Goals:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="text-4xl font-bold text-primary mb-3">SDG 14</div>
                  <div className="font-semibold mb-2">Life Below Water</div>
                  <div className="text-sm">
                    Conserve and sustainably use oceans, seas, and marine resources through real-time monitoring, AI-powered insights, and data-driven conservation strategies.
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="text-4xl font-bold text-primary mb-3">SDG 13</div>
                  <div className="font-semibold mb-2">Climate Action</div>
                  <div className="text-sm">
                    Combat climate change impacts on marine ecosystems by detecting ocean warming, acidification, and ecosystem shifts through predictive analytics.
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="text-4xl font-bold text-primary mb-3">SDG 2</div>
                  <div className="font-semibold mb-2">Zero Hunger</div>
                  <div className="text-sm">
                    Support sustainable fisheries management to ensure food security for coastal communities while protecting marine biodiversity.
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-muted/50 mt-4">
                <div className="font-semibold mb-3">Measurable Impact:</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Reduce overfishing by 30% through AI-powered sustainable harvest recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Protect 15% of marine areas through data-driven Marine Protected Area planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Detect environmental threats 80% faster with real-time alert systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Support 10,000+ fishermen with sustainable fishing guidance and species identification</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Hackathon Vision */}
          <Card className="bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Hackathon Vision</h3>
                <p className="text-lg opacity-90 mb-6">
                  AquaMind represents the future of marine conservation - where AI, real-time data, and human expertise converge to protect our oceans. This platform demonstrates how technology can empower stakeholders to make informed, sustainable decisions that benefit both marine ecosystems and coastal communities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-primary-foreground/10">
                    <div className="font-bold mb-1">Innovation</div>
                    <div className="text-sm opacity-90">AI-driven insights for marine intelligence</div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary-foreground/10">
                    <div className="font-bold mb-1">Impact</div>
                    <div className="text-sm opacity-90">Real-world solutions for ocean sustainability</div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary-foreground/10">
                    <div className="font-bold mb-1">Scalability</div>
                    <div className="text-sm opacity-90">Cloud-ready architecture for global deployment</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
