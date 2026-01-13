import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Database, Fish, FileText } from 'lucide-react';
import { datasetApi, speciesApi } from '@/db/api';
import type { Dataset, Species } from '@/types/database';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [datasetsData, speciesData] = await Promise.all([
        datasetApi.getDatasets(10),
        speciesApi.getAllSpecies(),
      ]);
      setDatasets(datasetsData);
      setSpecies(speciesData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, <span className="gradient-text">{profile?.username}</span>
          </h1>
          <p className="text-muted-foreground">
            Role: <Badge variant="secondary" className="capitalize">{profile?.role}</Badge>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{datasets.length}</div>
              <p className="text-xs text-muted-foreground">Across all types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Species Catalog</CardTitle>
              <Fish className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{species.length}</div>
              <p className="text-xs text-muted-foreground">Identified species</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Upload</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button className="w-full mt-2" size="sm">
                Upload Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mt-2" size="sm">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="datasets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 xl:grid-cols-3">
            <TabsTrigger value="datasets">Recent Datasets</TabsTrigger>
            <TabsTrigger value="species">Species Catalog</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Datasets</CardTitle>
                <CardDescription>
                  Latest uploaded marine datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : datasets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No datasets available. Upload your first dataset to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {datasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{dataset.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dataset.description || 'No description'}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="capitalize">
                              {dataset.type.replace('_', ' ')}
                            </Badge>
                            <Badge variant="secondary">{dataset.status}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="species" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Species Catalog</CardTitle>
                <CardDescription>
                  Marine species in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {species.slice(0, 6).map((sp) => (
                      <div
                        key={sp.id}
                        className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <h3 className="font-medium italic">{sp.scientific_name}</h3>
                        <p className="text-sm text-muted-foreground">{sp.common_name}</p>
                        {sp.conservation_status && (
                          <Badge variant="outline" className="mt-2">
                            {sp.conservation_status}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Tools</CardTitle>
                <CardDescription>
                  Advanced AI-powered analysis features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Fish Species Identification</CardTitle>
                      <CardDescription>
                        Upload fish images for AI-powered species identification
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        Upload Image
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Otolith Analysis</CardTitle>
                      <CardDescription>
                        Automated age estimation from otolith images
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        Analyze Otolith
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">eDNA Analysis</CardTitle>
                      <CardDescription>
                        Species detection from environmental DNA samples
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        Upload eDNA Data
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Correlation Analysis</CardTitle>
                      <CardDescription>
                        Analyze relationships between ocean parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        Run Analysis
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
