import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Upload, Search, TrendingUp } from 'lucide-react';

export default function APIPage() {
  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">API Documentation</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            RESTful API for programmatic access to marine data and analysis tools
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 xl:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="species">Species</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Overview</CardTitle>
                <CardDescription>
                  The CMLRE Marine Data Platform API provides programmatic access to marine datasets, species information, and AI-powered analysis tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="block bg-muted p-3 rounded-md text-sm">
                    https://api.cmlre-marine.example.com/v1
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Response Format</h3>
                  <p className="text-sm text-muted-foreground">All API responses are returned in JSON format.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rate Limiting</h3>
                  <p className="text-sm text-muted-foreground">
                    API requests are limited to 1000 requests per hour per API key.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Data Access</CardTitle>
                  <CardDescription>
                    Retrieve oceanographic data, fish surveys, and biodiversity information
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Data Upload</CardTitle>
                  <CardDescription>
                    Upload new datasets in CSV, Excel, or JSON formats
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Species Identification</CardTitle>
                  <CardDescription>
                    AI-powered fish species identification from images
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Access predictive models and correlation analysis
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  All API requests require authentication using an API key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">API Key</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include your API key in the request header:
                  </p>
                  <code className="block bg-muted p-3 rounded-md text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Example Request</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`curl -X GET \\
  https://api.cmlre-marine.example.com/v1/datasets \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datasets API</CardTitle>
                <CardDescription>
                  Endpoints for managing and retrieving marine datasets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/datasets</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Retrieve all datasets</p>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`{
  "data": [
    {
      "id": "uuid",
      "name": "Indian Ocean Temperature Survey 2025",
      "type": "oceanographic",
      "status": "approved",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1
}`}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/datasets/:id</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Retrieve a specific dataset by ID</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">POST</Badge>
                    <code className="text-sm">/datasets</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Upload a new dataset</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="species" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Species API</CardTitle>
                <CardDescription>
                  Endpoints for species information and identification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/species</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Retrieve all species</p>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`{
  "data": [
    {
      "id": "uuid",
      "scientific_name": "Thunnus albacares",
      "common_name": "Yellowfin Tuna",
      "conservation_status": "Near Threatened",
      "habitat": "Pelagic waters"
    }
  ]
}`}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/species/search?q=tuna</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Search species by name</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">POST</Badge>
                    <code className="text-sm">/species/identify</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Upload fish image for AI identification</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis API</CardTitle>
                <CardDescription>
                  AI-powered analysis and prediction endpoints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">POST</Badge>
                    <code className="text-sm">/analysis/correlation</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyze correlations between ocean parameters and fish populations
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">POST</Badge>
                    <code className="text-sm">/analysis/otolith</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload otolith images for age estimation
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">POST</Badge>
                    <code className="text-sm">/analysis/edna</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyze eDNA sequences for species detection
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/analysis/predictions</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Retrieve ecosystem change predictions
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
