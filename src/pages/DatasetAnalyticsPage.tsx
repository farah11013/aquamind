import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, AlertCircle, Download, Activity, BarChart3, PieChart, TrendingUp, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine,
} from 'recharts';

interface AnalysisData {
  data: Record<string, any>[];
  numericColumns: string[];
  categoricalColumns: string[];
  timeColumn: string | null;
  statistics: Record<string, any>;
}

interface DataInsight {
  title: string;
  description: string;
  type: 'trend' | 'distribution' | 'correlation' | 'summary';
  icon: string;
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function DatasetAnalyticsPage() {
  const { toast } = useToast();
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [parsing, setParsing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<string>('');
  const [selectedParameter2, setSelectedParameter2] = useState<string>('');

  const loadSampleDataset = () => {
    const sampleData: Record<string, any>[] = [];
    const years = [2019, 2020, 2021, 2022, 2023, 2024];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const regions = ['North', 'South', 'East', 'West'];
    const products = ['Product A', 'Product B', 'Product C'];

    years.forEach((year, yearIdx) => {
      months.forEach((month, monthIdx) => {
        regions.forEach((region) => {
          products.forEach((product) => {
            const baseSales = 10000 + yearIdx * 2000 + Math.sin((monthIdx / 12) * Math.PI * 2) * 3000;
            const baseRevenue = baseSales * (50 + Math.random() * 20);
            const baseCustomers = Math.floor(baseSales / 100);

            sampleData.push({
              Year: year,
              Month: month,
              Period: `${year}-${String(monthIdx + 1).padStart(2, '0')}`,
              Region: region,
              Product: product,
              Sales: Math.floor(baseSales + (Math.random() - 0.5) * 2000),
              Revenue: Number((baseRevenue + (Math.random() - 0.5) * 50000).toFixed(2)),
              Customers: baseCustomers + Math.floor((Math.random() - 0.5) * 100),
              Satisfaction: Number((4.0 + Math.random() * 1.0).toFixed(2)),
              GrowthRate: Number(((Math.random() - 0.3) * 20).toFixed(2)),
            });
          });
        });
      });
    });

    setUploadedFileName('Sample Business Analytics Data (2019-2024)');
    processData(sampleData);
    setError(null);

    toast({
      title: 'Sample dataset loaded',
      description: `${sampleData.length} records loaded`,
    });
  };

  const detectTimeColumn = (data: Record<string, any>[]): string | null => {
    const firstRow = data[0];
    const possibleTimeColumns = ['year', 'Year', 'YEAR', 'date', 'Date', 'DATE', 'period', 'Period', 'time', 'Time', 'timestamp'];

    for (const col of possibleTimeColumns) {
      if (col in firstRow) {
        return col;
      }
    }

    return null;
  };

  const calculateStatistics = (data: Record<string, any>[], numericColumns: string[]) => {
    const stats: Record<string, any> = {};

    numericColumns.forEach((col) => {
      const values = data.map((row) => row[col]).filter((v) => typeof v === 'number');
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;
        const sorted = [...values].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        stats[col] = {
          count: values.length,
          mean: Number(mean.toFixed(2)),
          median: Number(median.toFixed(2)),
          min: Number(min.toFixed(2)),
          max: Number(max.toFixed(2)),
          stdDev: Number(stdDev.toFixed(2)),
          range: Number((max - min).toFixed(2)),
        };
      }
    });

    return stats;
  };

  const processData = (data: Record<string, any>[]) => {
    if (data.length === 0) {
      setError('No data found in uploaded file.');
      setAnalysisData(null);
      return;
    }

    const firstRow = data[0];
    const numericColumns: string[] = [];
    const categoricalColumns: string[] = [];
    const timeColumn = detectTimeColumn(data);

    Object.entries(firstRow).forEach(([key, value]) => {
      if (key === timeColumn) return;
      if (typeof value === 'number') {
        numericColumns.push(key);
      } else {
        categoricalColumns.push(key);
      }
    });

    const statistics = calculateStatistics(data, numericColumns);

    const analysisData: AnalysisData = {
      data,
      numericColumns,
      categoricalColumns,
      timeColumn,
      statistics,
    };

    setAnalysisData(analysisData);
    setSelectedParameter(numericColumns[0] || '');
    setSelectedParameter2(numericColumns[1] || numericColumns[0] || '');
    setError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setError(null);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          setUploadedFileName(file.name);
          processData(results.data as Record<string, any>[]);
          setParsing(false);
          toast({
            title: 'Dataset uploaded',
            description: `${file.name} (${results.data.length} records)`,
          });
        },
        error: (error) => {
          setError(`CSV parsing error: ${error.message}`);
          setParsing(false);
        },
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          setUploadedFileName(file.name);
          processData(jsonData as Record<string, any>[]);
          setParsing(false);
          toast({
            title: 'Dataset uploaded',
            description: `${file.name} (${jsonData.length} records)`,
          });
        } catch (error) {
          setError(`Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setParsing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileExtension === 'pdf') {
      setError('PDF file support: Please convert your PDF tables to CSV or Excel format for analysis.');
      setParsing(false);
      toast({
        title: 'PDF files not supported',
        description: 'Please convert PDF to CSV/Excel format',
        variant: 'destructive',
      });
    } else {
      setError('Unsupported file format. Please upload CSV, Excel, or PDF files.');
      setParsing(false);
    }

    event.target.value = '';
  };

  // Line Chart Data - Time Series
  const generateLineChartData = (parameter: string) => {
    if (!analysisData) return [];
    const data = analysisData.data;

    if (analysisData.timeColumn) {
      const grouped: Record<string, number[]> = {};
      data.forEach((row) => {
        const timeKey = String(row[analysisData.timeColumn!]);
        const value = row[parameter];
        if (typeof value === 'number') {
          if (!grouped[timeKey]) grouped[timeKey] = [];
          grouped[timeKey].push(value);
        }
      });

      return Object.entries(grouped)
        .map(([time, values]) => ({
          time,
          value: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
        }))
        .slice(0, 50);
    }

    return data.slice(0, 50).map((row, idx) => ({
      time: `Point ${idx + 1}`,
      value: row[parameter] || 0,
    }));
  };

  // Bar Chart Data - Category Comparison
  const generateBarChartData = (parameter: string) => {
    if (!analysisData) return [];
    const data = analysisData.data;

    if (analysisData.categoricalColumns.length > 0) {
      const categoryCol = analysisData.categoricalColumns[0];
      const grouped: Record<string, number[]> = {};

      data.forEach((row) => {
        const category = String(row[categoryCol]);
        const value = row[parameter];
        if (typeof value === 'number') {
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(value);
        }
      });

      return Object.entries(grouped)
        .map(([category, values]) => ({
          category,
          average: values.reduce((a, b) => a + b, 0) / values.length,
          total: values.reduce((a, b) => a + b, 0),
          count: values.length,
        }))
        .slice(0, 20);
    }

    return [];
  };

  // Pie Chart Data - Distribution
  const generatePieChartData = () => {
    if (!analysisData || analysisData.categoricalColumns.length === 0) return [];
    const data = analysisData.data;
    const categoryCol = analysisData.categoricalColumns[0];

    const grouped: Record<string, number> = {};
    data.forEach((row) => {
      const category = String(row[categoryCol]);
      grouped[category] = (grouped[category] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 10);
  };

  // Scatter Plot Data - Correlation
  const generateScatterData = (param1: string, param2: string) => {
    if (!analysisData) return [];
    const data = analysisData.data;

    return data
      .map((row) => ({
        x: row[param1],
        y: row[param2],
      }))
      .filter((d) => typeof d.x === 'number' && typeof d.y === 'number')
      .slice(0, 200);
  };

  // Area Chart Data - Cumulative
  const generateAreaChartData = (parameter: string) => {
    const lineData = generateLineChartData(parameter);
    let cumulative = 0;
    return lineData.map((d) => {
      cumulative += d.value;
      return { ...d, cumulative };
    });
  };

  // Generate Insights
  const generateInsights = (): DataInsight[] => {
    if (!analysisData) return [];
    const insights: DataInsight[] = [];

    // Data Summary Insight
    insights.push({
      title: '📊 Dataset Overview',
      description: `Loaded ${analysisData.data.length} records with ${analysisData.numericColumns.length} numeric and ${analysisData.categoricalColumns.length} categorical columns. ${analysisData.timeColumn ? `Time-series data detected (${analysisData.timeColumn}).` : 'No time column detected.'}`,
      type: 'summary',
      icon: '📊',
    });

    // Numeric Analysis
    if (analysisData.numericColumns.length > 0 && selectedParameter) {
      const stats = analysisData.statistics[selectedParameter];
      if (stats) {
        const cv = (stats.stdDev / stats.mean) * 100;
        insights.push({
          title: `📈 ${selectedParameter} Analysis`,
          description: `Mean: ${stats.mean}, Range: ${stats.min} - ${stats.max}. ${cv > 30 ? 'High variability detected (CV: ' + cv.toFixed(1) + '%).' : 'Low variability (CV: ' + cv.toFixed(1) + '%).'} Standard deviation: ${stats.stdDev}.`,
          type: 'trend',
          icon: '📈',
        });
      }
    }

    // Categorical Distribution
    if (analysisData.categoricalColumns.length > 0) {
      const pieData = generatePieChartData();
      if (pieData.length > 0) {
        const total = pieData.reduce((sum, d) => sum + d.value, 0);
        const dominant = pieData.reduce((max, d) => (d.value > max.value ? d : max), pieData[0]);
        insights.push({
          title: '🎯 Distribution Pattern',
          description: `${analysisData.categoricalColumns[0]} has ${pieData.length} unique categories. "${dominant.name}" is most frequent (${((dominant.value / total) * 100).toFixed(1)}% of data).`,
          type: 'distribution',
          icon: '🎯',
        });
      }
    }

    // Correlation Insight
    if (analysisData.numericColumns.length >= 2) {
      insights.push({
        title: '🔗 Correlation Analysis',
        description: `${analysisData.numericColumns.length} numeric variables available for correlation analysis. Use scatter plots to explore relationships between ${selectedParameter} and ${selectedParameter2}.`,
        type: 'correlation',
        icon: '🔗',
      });
    }

    return insights;
  };

  const downloadResults = () => {
    if (!analysisData) return;

    const csv = Papa.unparse(analysisData.data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Download complete',
      description: `Exported ${analysisData.data.length} records`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Analytics Visualization Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload Excel, CSV, or PDF files for comprehensive data analysis and intelligent visualizations
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
              Upload CSV, Excel (.xlsx, .xls), or PDF files. The system will automatically analyze and visualize your data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!analysisData ? (
              <>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV, XLSX, XLS, PDF • Any data format accepted</p>
                  </div>
                  <input type="file" className="hidden" accept=".csv,.xlsx,.xls,.pdf" onChange={handleFileUpload} disabled={parsing} />
                </label>

                <div className="flex justify-center">
                  <Button onClick={loadSampleDataset} variant="outline" disabled={parsing}>
                    <Activity className="h-4 w-4 mr-2" />
                    Load Sample Business Dataset
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{uploadedFileName}</div>
                      <div className="text-xs text-muted-foreground">{analysisData.data.length} records</div>
                    </div>
                  </div>
                </div>

                <Alert className="border-green-500/20 bg-green-500/5">
                  <Activity className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-500">
                    ✓ Analysis ready: {analysisData.data.length} records, {analysisData.numericColumns.length} numeric columns, {analysisData.categoricalColumns.length} categorical columns
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setUploadedFileName('');
                      setAnalysisData(null);
                      setError(null);
                    }}
                    variant="outline"
                  >
                    Clear Dataset
                  </Button>
                  <Button onClick={downloadResults} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-500/20 bg-red-500/5">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500">{error}</AlertDescription>
              </Alert>
            )}

            {parsing && (
              <Alert>
                <Activity className="h-4 w-4 animate-spin" />
                <AlertDescription>Processing dataset...</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Analysis Dashboard */}
        {analysisData && (
          <>
            {/* Insights Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generateInsights().map((insight, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{insight.title}</div>
                          <div className="text-xs text-muted-foreground">{insight.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Parameter Selection */}
            {analysisData.numericColumns.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Visualization Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Primary Parameter</label>
                      <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {analysisData.numericColumns.map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Secondary Parameter</label>
                      <Select value={selectedParameter2} onValueChange={setSelectedParameter2}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {analysisData.numericColumns.map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{analysisData.data.length}</div>
                          <div className="text-xs text-muted-foreground">Records</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{analysisData.numericColumns.length}</div>
                          <div className="text-xs text-muted-foreground">Metrics</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visualizations Grid */}
            {analysisData.numericColumns.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 1. Line Chart - Trend Analysis */}
                {selectedParameter && analysisData.timeColumn && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Trend Analysis</CardTitle>
                          <CardDescription>Time-series visualization of {selectedParameter}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          Line Chart
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={generateLineChartData(selectedParameter)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="time" stroke="#ffffff" angle={-45} textAnchor="end" height={80} />
                          <YAxis stroke="#ffffff" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: '#ffffff',
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} name={selectedParameter} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* 2. Bar Chart - Category Comparison */}
                {selectedParameter && generateBarChartData(selectedParameter).length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Category Comparison</CardTitle>
                          <CardDescription>Average {selectedParameter} by category</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Bar Chart
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={generateBarChartData(selectedParameter)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="category" stroke="#ffffff" angle={-45} textAnchor="end" height={80} />
                          <YAxis stroke="#ffffff" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: '#ffffff',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="average" name="Average" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* 3. Pie Chart - Distribution */}
                {analysisData.categoricalColumns.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Distribution Analysis</CardTitle>
                          <CardDescription>{analysisData.categoricalColumns[0]} distribution</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                          Pie Chart
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={generatePieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {generatePieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: '#ffffff',
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* 4. Scatter Plot - Correlation */}
                {analysisData.numericColumns.length >= 2 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Correlation Analysis</CardTitle>
                          <CardDescription>
                            {selectedParameter} vs {selectedParameter2}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                          Scatter Plot
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" dataKey="x" name={selectedParameter} stroke="#ffffff" />
                          <YAxis type="number" dataKey="y" name={selectedParameter2} stroke="#ffffff" />
                          <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: '#ffffff',
                            }}
                          />
                          <Scatter data={generateScatterData(selectedParameter, selectedParameter2)} fill={CHART_COLORS[0]} />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* 5. Area Chart - Cumulative */}
                {selectedParameter && analysisData.timeColumn && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Cumulative Analysis</CardTitle>
                          <CardDescription>Cumulative {selectedParameter} over time</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                          Area Chart
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={generateAreaChartData(selectedParameter)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="time" stroke="#ffffff" angle={-45} textAnchor="end" height={80} />
                          <YAxis stroke="#ffffff" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: '#ffffff',
                            }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="cumulative" stroke={CHART_COLORS[3]} fill={CHART_COLORS[3]} fillOpacity={0.6} name="Cumulative" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* 6. Statistical Summary */}
                {selectedParameter && analysisData.statistics[selectedParameter] && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Statistical Summary</CardTitle>
                          <CardDescription>{selectedParameter} descriptive statistics</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                          Statistics
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(analysisData.statistics[selectedParameter]).map(([key, value]) => (
                          <div key={key} className="p-3 rounded-lg border border-border bg-muted/30">
                            <div className="text-xs text-muted-foreground uppercase mb-1">{key}</div>
                            <div className="text-xl font-bold text-primary">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Preview</CardTitle>
                  <CardDescription>
                    Your dataset contains {analysisData.categoricalColumns.length} text column(s). Showing first 10 records for review.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          {Object.keys(analysisData.data[0] || {}).map((col) => (
                            <th key={col} className="text-left p-2 text-sm font-semibold text-white">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData.data.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b border-border/50">
                            {Object.values(row).map((value, colIdx) => (
                              <td key={colIdx} className="p-2 text-sm text-white">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Alert className="mt-4 border-blue-500/20 bg-blue-500/5">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-blue-500">
                      This dataset contains text data. For visualizations, please upload a dataset with numeric columns (e.g., sales, revenue, temperature, etc.).
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
