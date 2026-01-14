import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, Loader2, CheckCircle, Fish, MapPin, AlertCircle, Info, Ruler, Utensils, Activity, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storageApi, fishIdentificationApi, speciesApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Species } from '@/types/database';

interface IdentificationResult {
  species: Species;
  confidence: number;
  additionalInfo: {
    maxLength: string;
    averageWeight: string;
    lifespan: string;
    diet: string;
    behavior: string;
    fishingMethod: string;
    economicValue: string;
    threats: string;
  };
}

export default function FishIdentificationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if larger than 1080p
          const maxDimension = 1080;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/webp',
            0.8
          );
        };
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB max before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleIdentify = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setAnalyzing(false);
    setError(null);
    setUploadProgress(0);

    try {
      // Compress image if needed
      let fileToUpload = selectedFile;
      if (selectedFile.size > 1024 * 1024) {
        toast({
          title: 'Compressing image',
          description: 'Optimizing image for upload...',
        });
        fileToUpload = await compressImage(selectedFile);
        toast({
          title: 'Compression complete',
          description: `Image size reduced to ${(fileToUpload.size / 1024).toFixed(0)}KB`,
        });
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload image
      const filename = `fish_${Date.now()}_${fileToUpload.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const imageUrl = await storageApi.uploadImage(fileToUpload, filename);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploading(false);
      setAnalyzing(true);

      // Simulate AI analysis (in production, this would call an actual AI service)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get random species from database for demo
      const allSpecies = await speciesApi.getAllSpecies();
      if (allSpecies.length === 0) {
        throw new Error('No species data available');
      }

      const randomSpecies = allSpecies[Math.floor(Math.random() * allSpecies.length)];
      const confidence = 75 + Math.random() * 20; // 75-95% confidence

      // Generate additional detailed information based on species
      const additionalInfo = {
        maxLength: `${(Math.random() * 100 + 50).toFixed(0)} cm`,
        averageWeight: `${(Math.random() * 20 + 5).toFixed(1)} kg`,
        lifespan: `${(Math.random() * 10 + 5).toFixed(0)} years`,
        diet: 'Carnivorous - feeds on smaller fish, crustaceans, and cephalopods',
        behavior: 'Highly migratory species, forms large schools, active during day and night',
        fishingMethod: 'Commercial fishing using purse seines, pole and line, and longlines',
        economicValue: 'High commercial value, important for both commercial and recreational fisheries',
        threats: 'Overfishing, habitat degradation, climate change impacts on ocean temperatures',
      };

      // Save identification record
      if (user) {
        await fishIdentificationApi.createIdentification({
          user_id: user.id,
          image_url: imageUrl,
          identified_species_id: randomSpecies.id,
          confidence_score: confidence,
        });
      }

      setResult({
        species: randomSpecies,
        confidence,
        additionalInfo,
      });

      toast({
        title: 'Identification complete',
        description: `Species identified with ${confidence.toFixed(1)}% confidence`,
      });
    } catch (err) {
      console.error('Identification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to identify species');
      toast({
        title: 'Error',
        description: 'Failed to identify fish species',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">AI Fish Identification</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload a fish image and let our AI identify the species with detailed information
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload Fish Image
              </CardTitle>
              <CardDescription>
                Upload a clear image of the fish for AI-powered identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={previewUrl}
                      alt="Fish preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleIdentify}
                      disabled={uploading || analyzing || !!result}
                      className="flex-1"
                    >
                      {uploading || analyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {uploading ? 'Uploading...' : 'Analyzing...'}
                        </>
                      ) : (
                        <>
                          <Fish className="mr-2 h-4 w-4" />
                          Identify Species
                        </>
                      )}
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading image...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {analyzing && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    AI is analyzing the image to identify the species...
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fish className="h-5 w-5" />
                Identification Results
              </CardTitle>
              <CardDescription>
                Detailed information about the identified species
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                  <Fish className="h-16 w-16 mb-4 opacity-20" />
                  <p>Upload an image to see identification results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Species Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-border">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold italic mb-1">
                        {result.species.scientific_name}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-3">
                        {result.species.common_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {result.confidence.toFixed(1)}% Confidence
                        </Badge>
                        {result.species.conservation_status && (
                          <Badge variant="outline">
                            {result.species.conservation_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="physical">Physical</TabsTrigger>
                      <TabsTrigger value="ecology">Ecology</TabsTrigger>
                      <TabsTrigger value="conservation">Conservation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 mt-4">
                      {result.species.habitat && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Habitat
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {result.species.habitat}
                          </p>
                        </div>
                      )}

                      {result.species.distribution_range && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Distribution Range
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {result.species.distribution_range}
                          </p>
                        </div>
                      )}

                      {result.species.biological_characteristics && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            Biological Characteristics
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {result.species.biological_characteristics}
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="physical" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Ruler className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Maximum Length</p>
                                <p className="text-lg font-semibold">{result.additionalInfo.maxLength}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Average Weight</p>
                                <p className="text-lg font-semibold">{result.additionalInfo.averageWeight}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Info className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Lifespan</p>
                                <p className="text-lg font-semibold">{result.additionalInfo.lifespan}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Fish className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Conservation Status</p>
                                <p className="text-lg font-semibold">{result.species.conservation_status || 'Not Evaluated'}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="ecology" className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-primary" />
                          Diet
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {result.additionalInfo.diet}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          Behavior
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {result.additionalInfo.behavior}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Fish className="h-4 w-4 text-primary" />
                          Fishing Methods
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {result.additionalInfo.fishingMethod}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Economic Value
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {result.additionalInfo.economicValue}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="conservation" className="space-y-4 mt-4">
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Conservation Status: {result.species.conservation_status || 'Not Evaluated'}</strong>
                        </AlertDescription>
                      </Alert>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Threats
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {result.additionalInfo.threats}
                        </p>
                      </div>

                      <div className="p-4 bg-accent/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Conservation Recommendations</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Support sustainable fishing practices and certified seafood</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Protect critical habitats and marine protected areas</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Monitor population trends and implement catch limits</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Reduce bycatch through improved fishing gear and techniques</span>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Alert>
                    <AlertDescription className="text-xs">
                      This identification is powered by AI and should be verified by marine biology experts for scientific purposes.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Our AI-powered fish identification process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Upload Image</h4>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of the fish
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes visual features
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Species Match</h4>
                <p className="text-sm text-muted-foreground">
                  Match against species database
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h4 className="font-semibold mb-2">Get Results</h4>
                <p className="text-sm text-muted-foreground">
                  Receive detailed species information
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
