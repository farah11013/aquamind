import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileSpreadsheet, BarChart3, PieChart, TrendingUp, AlertCircle, Download, Table as TableIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DatasetStats {
  rowCount: number;
  columnCount: number;
  columns: string[];
  numericColumns: string[];
  categoricalColumns: string[];
  summary: Record<string, {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    count?: number;
    unique?: number;
  }>;
}

interface ParsedData {
  data: Record<string, any>[];
  stats: DatasetStats;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function DatasetAnalyticsPage() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Professional sample marine dataset
  const loadSampleDataset = () => {
    const sampleData = [
      { Station: 'A1', Latitude: 8.5, Longitude: 76.8, Temperature: 28.5, Salinity: 34.2, pH: 8.1, Oxygen: 5.8, Depth: 50, Season: 'Monsoon', Region: 'Arabian Sea' },
      { Station: 'A2', Latitude: 8.7, Longitude: 76.9, Temperature: 27.8, Salinity: 34.5, pH: 8.0, Oxygen: 5.5, Depth: 75, Season: 'Monsoon', Region: 'Arabian Sea' },
      { Station: 'A3', Latitude: 9.0, Longitude: 77.0, Temperature: 26.9, Salinity: 34.8, pH: 7.9, Oxygen: 5.2, Depth: 100, Season: 'Monsoon', Region: 'Arabian Sea' },
      { Station: 'B1', Latitude: 10.2, Longitude: 78.5, Temperature: 29.2, Salinity: 33.8, pH: 8.2, Oxygen: 6.1, Depth: 30, Season: 'Pre-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'B2', Latitude: 10.5, Longitude: 78.7, Temperature: 28.8, Salinity: 34.0, pH: 8.1, Oxygen: 5.9, Depth: 45, Season: 'Pre-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'B3', Latitude: 10.8, Longitude: 79.0, Temperature: 28.2, Salinity: 34.3, pH: 8.0, Oxygen: 5.6, Depth: 60, Season: 'Pre-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'C1', Latitude: 12.5, Longitude: 80.2, Temperature: 30.1, Salinity: 33.5, pH: 8.3, Oxygen: 6.4, Depth: 25, Season: 'Post-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'C2', Latitude: 12.8, Longitude: 80.5, Temperature: 29.5, Salinity: 33.7, pH: 8.2, Oxygen: 6.2, Depth: 40, Season: 'Post-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'C3', Latitude: 13.0, Longitude: 80.8, Temperature: 28.9, Salinity: 34.0, pH: 8.1, Oxygen: 5.9, Depth: 55, Season: 'Post-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'D1', Latitude: 15.2, Longitude: 72.8, Temperature: 27.5, Salinity: 35.2, pH: 8.0, Oxygen: 5.4, Depth: 80, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'D2', Latitude: 15.5, Longitude: 73.0, Temperature: 26.8, Salinity: 35.5, pH: 7.9, Oxygen: 5.1, Depth: 95, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'D3', Latitude: 15.8, Longitude: 73.2, Temperature: 26.2, Salinity: 35.8, pH: 7.8, Oxygen: 4.9, Depth: 110, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'E1', Latitude: 18.5, Longitude: 70.5, Temperature: 25.8, Salinity: 36.0, pH: 7.9, Oxygen: 5.0, Depth: 120, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'E2', Latitude: 18.8, Longitude: 70.8, Temperature: 25.2, Salinity: 36.2, pH: 7.8, Oxygen: 4.8, Depth: 135, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'E3', Latitude: 19.0, Longitude: 71.0, Temperature: 24.8, Salinity: 36.5, pH: 7.7, Oxygen: 4.6, Depth: 150, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'F1', Latitude: 11.5, Longitude: 79.5, Temperature: 29.8, Salinity: 33.2, pH: 8.3, Oxygen: 6.5, Depth: 20, Season: 'Summer', Region: 'Bay of Bengal' },
      { Station: 'F2', Latitude: 11.8, Longitude: 79.8, Temperature: 29.2, Salinity: 33.5, pH: 8.2, Oxygen: 6.3, Depth: 35, Season: 'Summer', Region: 'Bay of Bengal' },
      { Station: 'F3', Latitude: 12.0, Longitude: 80.0, Temperature: 28.7, Salinity: 33.8, pH: 8.1, Oxygen: 6.0, Depth: 50, Season: 'Summer', Region: 'Bay of Bengal' },
      { Station: 'G1', Latitude: 14.2, Longitude: 74.5, Temperature: 28.0, Salinity: 34.8, pH: 8.0, Oxygen: 5.6, Depth: 65, Season: 'Monsoon', Region: 'Arabian Sea' },
      { Station: 'G2', Latitude: 14.5, Longitude: 74.8, Temperature: 27.3, Salinity: 35.0, pH: 7.9, Oxygen: 5.3, Depth: 85, Season: 'Monsoon', Region: 'Arabian Sea' },
      { Station: 'G3', Latitude: 14.8, Longitude: 75.0, Temperature: 26.7, Salinity: 35.3, pH: 7.8, Oxygen: 5.0, Depth: 105, Season: 'Monsoon', Region: 'Arabian Sea' },
      { Station: 'H1', Latitude: 9.5, Longitude: 77.8, Temperature: 29.5, Salinity: 33.9, pH: 8.2, Oxygen: 6.2, Depth: 28, Season: 'Pre-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'H2', Latitude: 9.8, Longitude: 78.0, Temperature: 28.9, Salinity: 34.1, pH: 8.1, Oxygen: 5.9, Depth: 42, Season: 'Pre-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'H3', Latitude: 10.0, Longitude: 78.2, Temperature: 28.4, Salinity: 34.4, pH: 8.0, Oxygen: 5.7, Depth: 58, Season: 'Pre-Monsoon', Region: 'Bay of Bengal' },
      { Station: 'I1', Latitude: 16.5, Longitude: 71.8, Temperature: 26.5, Salinity: 35.7, pH: 7.9, Oxygen: 5.2, Depth: 90, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'I2', Latitude: 16.8, Longitude: 72.0, Temperature: 25.9, Salinity: 36.0, pH: 7.8, Oxygen: 4.9, Depth: 115, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'I3', Latitude: 17.0, Longitude: 72.2, Temperature: 25.4, Salinity: 36.3, pH: 7.7, Oxygen: 4.7, Depth: 140, Season: 'Winter', Region: 'Arabian Sea' },
      { Station: 'J1', Latitude: 13.5, Longitude: 81.2, Temperature: 30.2, Salinity: 33.0, pH: 8.4, Oxygen: 6.6, Depth: 18, Season: 'Summer', Region: 'Bay of Bengal' },
      { Station: 'J2', Latitude: 13.8, Longitude: 81.5, Temperature: 29.7, Salinity: 33.3, pH: 8.3, Oxygen: 6.4, Depth: 32, Season: 'Summer', Region: 'Bay of Bengal' },
      { Station: 'J3', Latitude: 14.0, Longitude: 81.8, Temperature: 29.1, Salinity: 33.6, pH: 8.2, Oxygen: 6.1, Depth: 48, Season: 'Summer', Region: 'Bay of Bengal' },
    ];

    const stats = calculateStats(sampleData);
    setParsedData({ data: sampleData, stats });
    setSelectedFile(null);
    setError(null);
    
    toast({
      title: 'Sample dataset loaded',
      description: 'Indian Ocean Oceanographic Survey Data (30 stations)',
    });
  };

  const calculateStats = (data: Record<string, any>[]): DatasetStats => {
    if (data.length === 0) {
      return {
        rowCount: 0,
        columnCount: 0,
        columns: [],
        numericColumns: [],
        categoricalColumns: [],
        summary: {},
      };
    }

    const columns = Object.keys(data[0]);
    const numericColumns: string[] = [];
    const categoricalColumns: string[] = [];
    const summary: Record<string, any> = {};

    columns.forEach((col) => {
      const values = data.map((row) => row[col]).filter((v) => v !== null && v !== undefined && v !== '');
      const numericValues = values.map((v) => Number(v)).filter((v) => !isNaN(v));

      if (numericValues.length > values.length * 0.5) {
        // Numeric column
        numericColumns.push(col);
        const sorted = [...numericValues].sort((a, b) => a - b);
        summary[col] = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
          median: sorted[Math.floor(sorted.length / 2)],
          count: numericValues.length,
        };
      } else {
        // Categorical column
        categoricalColumns.push(col);
        const uniqueValues = new Set(values);
        summary[col] = {
          count: values.length,
          unique: uniqueValues.size,
        };
      }
    });

    return {
      rowCount: data.length,
      columnCount: columns.length,
      columns,
      numericColumns,
      categoricalColumns,
      summary,
    };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Please select a valid CSV or Excel file');
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setParsedData(null);
  };

  const parseCSV = (file: File): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('CSV parsing error: ' + results.errors[0].message));
          } else {
            resolve(results.data as Record<string, any>[]);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const parseExcel = (file: File): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData as Record<string, any>[]);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setParsing(true);
    setError(null);

    try {
      let data: Record<string, any>[];

      if (selectedFile.name.endsWith('.csv')) {
        data = await parseCSV(selectedFile);
      } else {
        data = await parseExcel(selectedFile);
      }

      if (data.length === 0) {
        throw new Error('No data found in file');
      }

      const stats = calculateStats(data);
      setParsedData({ data, stats });

      toast({
        title: 'Analysis complete',
        description: `Processed ${stats.rowCount} rows and ${stats.columnCount} columns`,
      });
    } catch (err) {
      console.error('Parsing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      toast({
        title: 'Error',
        description: 'Failed to analyze dataset',
        variant: 'destructive',
      });
    } finally {
      setParsing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData(null);
    setError(null);
  };

  const generateBarChartData = () => {
    if (!parsedData || parsedData.stats.numericColumns.length === 0) return [];
    
    const firstNumericCol = parsedData.stats.numericColumns[0];
    const categoricalCol = parsedData.stats.categoricalColumns[0];
    
    if (!categoricalCol) {
      // If no categorical column, create bins for numeric data
      return parsedData.data.slice(0, 10).map((row, idx) => ({
        name: `Row ${idx + 1}`,
        value: Number(row[firstNumericCol]) || 0,
      }));
    }

    // Group by categorical column and aggregate numeric column
    const grouped = parsedData.data.reduce((acc, row) => {
      const key = String(row[categoricalCol] || 'Unknown');
      if (!acc[key]) {
        acc[key] = { sum: 0, count: 0 };
      }
      acc[key].sum += Number(row[firstNumericCol]) || 0;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    return Object.entries(grouped)
      .slice(0, 10)
      .map(([key, value]) => ({
        name: key,
        value: value.sum / value.count,
      }));
  };

  const generatePieChartData = () => {
    if (!parsedData || parsedData.stats.categoricalColumns.length === 0) return [];
    
    const categoricalCol = parsedData.stats.categoricalColumns[0];
    const counts = parsedData.data.reduce((acc, row) => {
      const key = String(row[categoricalCol] || 'Unknown');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };

  const generateLineChartData = () => {
    if (!parsedData || parsedData.stats.numericColumns.length < 2) return [];
    
    return parsedData.data.slice(0, 20).map((row, idx) => ({
      index: idx + 1,
      [parsedData.stats.numericColumns[0]]: Number(row[parsedData.stats.numericColumns[0]]) || 0,
      [parsedData.stats.numericColumns[1]]: Number(row[parsedData.stats.numericColumns[1]]) || 0,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Dataset Analytics</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload your marine dataset and get instant analytics with automated visualizations
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload Dataset
            </CardTitle>
            <CardDescription>
              Upload CSV or Excel files for automatic analysis and visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedFile && !parsedData ? (
              <>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV, XLSX, XLS (MAX. 50MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                  />
                </label>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 border-t border-border" />
                </div>
                
                <Button 
                  onClick={loadSampleDataset} 
                  variant="outline" 
                  className="w-full"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Load Sample Dataset (Indian Ocean Survey)
                </Button>
              </>
            ) : selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent/20">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={parsing || !!parsedData}
                    >
                      {parsing ? 'Analyzing...' : 'Analyze Dataset'}
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            ) : parsedData ? (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Dataset loaded successfully! View the analysis results below.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleReset} variant="outline" className="w-full">
                  Load New Dataset
                </Button>
              </div>
            ) : null}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {parsedData && (
          <div className="space-y-6">
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Rows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parsedData.stats.rowCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Columns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parsedData.stats.columnCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Numeric Columns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parsedData.stats.numericColumns.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Categorical Columns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parsedData.stats.categoricalColumns.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Visualizations */}
            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="preview">Data Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="charts" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  {parsedData.stats.numericColumns.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Distribution Analysis
                        </CardTitle>
                        <CardDescription>
                          {parsedData.stats.numericColumns[0]} by {parsedData.stats.categoricalColumns[0] || 'Index'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={generateBarChartData()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis 
                                dataKey="name" 
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
                              <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Pie Chart */}
                  {parsedData.stats.categoricalColumns.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5" />
                          Category Distribution
                        </CardTitle>
                        <CardDescription>
                          Top 5 categories in {parsedData.stats.categoricalColumns[0]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={generatePieChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="hsl(var(--chart-1))"
                                dataKey="value"
                              >
                                {generatePieChartData().map((entry, index) => (
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
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Line Chart */}
                  {parsedData.stats.numericColumns.length >= 2 && (
                    <Card className="xl:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Trend Analysis
                        </CardTitle>
                        <CardDescription>
                          Comparison of {parsedData.stats.numericColumns[0]} and {parsedData.stats.numericColumns[1]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={generateLineChartData()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis 
                                dataKey="index" 
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
                              <Line 
                                type="monotone" 
                                dataKey={parsedData.stats.numericColumns[0]} 
                                stroke="hsl(var(--chart-1))" 
                                strokeWidth={2}
                              />
                              <Line 
                                type="monotone" 
                                dataKey={parsedData.stats.numericColumns[1]} 
                                stroke="hsl(var(--chart-2))" 
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="statistics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistical Summary</CardTitle>
                    <CardDescription>
                      Descriptive statistics for all columns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Numeric Columns */}
                      {parsedData.stats.numericColumns.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Numeric Columns</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {parsedData.stats.numericColumns.map((col) => (
                              <div key={col} className="p-4 border border-border rounded-lg">
                                <h4 className="font-medium mb-2">{col}</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Min:</span>
                                    <span className="font-medium">{parsedData.stats.summary[col].min?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max:</span>
                                    <span className="font-medium">{parsedData.stats.summary[col].max?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mean:</span>
                                    <span className="font-medium">{parsedData.stats.summary[col].mean?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Median:</span>
                                    <span className="font-medium">{parsedData.stats.summary[col].median?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Count:</span>
                                    <span className="font-medium">{parsedData.stats.summary[col].count}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categorical Columns */}
                      {parsedData.stats.categoricalColumns.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Categorical Columns</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {parsedData.stats.categoricalColumns.map((col) => (
                              <div key={col} className="p-4 border border-border rounded-lg">
                                <h4 className="font-medium mb-2">{col}</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Values:</span>
                                    <span className="font-medium">{parsedData.stats.summary[col].count}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Unique Values:</span>
                                    <span className="font-medium">{parsedData.stats.summary[col].unique}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TableIcon className="h-5 w-5" />
                      Data Preview
                    </CardTitle>
                    <CardDescription>
                      First 10 rows of your dataset
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {parsedData.stats.columns.map((col) => (
                              <th key={col} className="text-left p-2 font-semibold">
                                {col}
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {parsedData.stats.numericColumns.includes(col) ? 'Numeric' : 'Text'}
                                </Badge>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.data.slice(0, 10).map((row, idx) => (
                            <tr key={idx} className="border-b border-border hover:bg-accent/50">
                              {parsedData.stats.columns.map((col) => (
                                <td key={col} className="p-2">
                                  {String(row[col] ?? '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
