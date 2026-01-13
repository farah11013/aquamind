import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

// Sample data for biodiversity
const biodiversityData = [
  { ecosystem: 'Coral Reefs', species: 3200, color: 'hsl(var(--chart-1))' },
  { ecosystem: 'Open Ocean', species: 1500, color: 'hsl(var(--chart-2))' },
  { ecosystem: 'Deep Sea', species: 850, color: 'hsl(var(--chart-3))' },
  { ecosystem: 'Coastal', species: 2800, color: 'hsl(var(--chart-2))' },
  { ecosystem: 'Polar', species: 650, color: 'hsl(var(--chart-4))' },
];

// Sample data for fisheries
const fisheriesData = [
  { month: 'Jan', catch: 4500, biomass: 12000 },
  { month: 'Feb', catch: 4200, biomass: 11500 },
  { month: 'Mar', catch: 5100, biomass: 13200 },
  { month: 'Apr', catch: 5800, biomass: 14500 },
  { month: 'May', catch: 6200, biomass: 15800 },
  { month: 'Jun', catch: 5900, biomass: 15200 },
];

// Sample data for climate impact
const climateImpactData = [
  { impact: 'Sea Level Rise', value: 35 },
  { impact: 'Ocean Acidification', value: 28 },
  { impact: 'Coral Bleaching', value: 42 },
  { impact: 'Species Migration', value: 25 },
  { impact: 'Extreme Weather', value: 18 },
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Sample data for oceanography radar chart
const oceanographyData = [
  { parameter: 'Temperature', 'Pacific Ocean': 8.0, 'Atlantic Ocean': 7.0 },
  { parameter: 'Salinity', 'Pacific Ocean': 6.5, 'Atlantic Ocean': 7.5 },
  { parameter: 'Currents', 'Pacific Ocean': 6.0, 'Atlantic Ocean': 6.5 },
  { parameter: 'Nutrients', 'Pacific Ocean': 5.5, 'Atlantic Ocean': 6.0 },
  { parameter: 'Oxygen', 'Pacific Ocean': 8.0, 'Atlantic Ocean': 7.5 },
  { parameter: 'pH', 'Pacific Ocean': 6.8, 'Atlantic Ocean': 6.5 },
];

export default function VisualizationsPage() {
  const [activeTab, setActiveTab] = useState('biodiversity');

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Data Visualizations</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our interactive data visualizations to gain insights into ocean ecosystems
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 xl:grid-cols-4 mb-8">
            <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
            <TabsTrigger value="fisheries">Fisheries</TabsTrigger>
            <TabsTrigger value="oceanography">Oceanography</TabsTrigger>
            <TabsTrigger value="climate">Climate Impact</TabsTrigger>
          </TabsList>

          {/* Biodiversity Tab */}
          <TabsContent value="biodiversity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Species Richness by Ecosystem</CardTitle>
                <CardDescription>
                  Distribution of marine species across different ocean ecosystems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={biodiversityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="ecosystem" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="species" fill="hsl(var(--chart-1))" name="Species Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fisheries Tab */}
          <TabsContent value="fisheries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fisheries Data Trends</CardTitle>
                <CardDescription>
                  Monthly catch and biomass data for sustainable fisheries management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fisheriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="catch" fill="hsl(var(--chart-1))" name="Catch (tons)" />
                      <Bar dataKey="biomass" fill="hsl(var(--chart-2))" name="Biomass (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Oceanography Tab */}
          <TabsContent value="oceanography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Oceanographic Parameters Comparison</CardTitle>
                <CardDescription>
                  Multi-parameter analysis of Pacific and Atlantic Ocean conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={oceanographyData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="parameter" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 9]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Radar 
                        name="Pacific Ocean" 
                        dataKey="Pacific Ocean" 
                        stroke="hsl(var(--chart-1))" 
                        fill="hsl(var(--chart-1))" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Atlantic Ocean" 
                        dataKey="Atlantic Ocean" 
                        stroke="hsl(var(--chart-2))" 
                        fill="hsl(var(--chart-2))" 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Climate Impact Tab */}
          <TabsContent value="climate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Climate Impact Distribution</CardTitle>
                <CardDescription>
                  Relative impact of different climate change factors on marine ecosystems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={climateImpactData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ impact, percent }) => `${impact}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="hsl(var(--chart-1))"
                        dataKey="value"
                      >
                        {climateImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
