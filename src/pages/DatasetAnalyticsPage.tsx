import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, AlertCircle, Download, TrendingUp, TrendingDown, Activity, Minus } from 'lucide-react';
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
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  Cell,
} from 'recharts';

interface AnalysisData {
  data: Record<string, any>[];
  numericColumns: string[];
  categoricalColumns: string[];
  timeColumn: string | null;
}

interface GrowthInsight {
  title: string;
  description: string;
  type: 'growth' | 'loss' | 'recovery' | 'degradation' | 'stable';
  severity: 'high' | 'medium' | 'low';
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const GROWTH_COLOR = '#10b981'; // Green
const LOSS_COLOR = '#ef4444'; // Red
const STABLE_COLOR = '#6b7280'; // Gray

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

    years.forEach((year, yearIdx) => {
      months.forEach((month, monthIdx) => {
        regions.forEach((region) => {
          const baseTemp = 26 + Math.sin((monthIdx / 12) * Math.PI * 2) * 4 + yearIdx * 0.3;
          const basePollution = 50 + yearIdx * 8 + (Math.random() - 0.5) * 10;
          const baseFishPop = 200 - yearIdx * 15 + Math.sin((monthIdx / 12) * Math.PI * 2) * 30;
          const baseCoralCover = 75 - yearIdx * 5 + (Math.random() - 0.5) * 5;

          sampleData.push({
            Year: year,
            Month: month,
            Period: `${year}-${String(monthIdx + 1).padStart(2, '0')}`,
            Region: region,
            Temperature: Number((baseTemp + (Math.random() - 0.5) * 2).toFixed(2)),
            Pollution: Number((basePollution + (Math.random() - 0.5) * 5).toFixed(2)),
            FishPopulation: Math.floor(baseFishPop + (Math.random() - 0.5) * 20),
            CoralCover: Number((baseCoralCover + (Math.random() - 0.5) * 3).toFixed(2)),
            Oxygen: Number((7.5 - yearIdx * 0.2 + (Math.random() - 0.5) * 0.5).toFixed(2)),
            pH: Number((8.1 - yearIdx * 0.05 + (Math.random() - 0.5) * 0.1).toFixed(2)),
          });
        });
      });
    });

    setUploadedFileName('Marine Environmental Data (2019-2024)');
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

    const analysisData: AnalysisData = {
      data,
      numericColumns,
      categoricalColumns,
      timeColumn,
    };

    setAnalysisData(analysisData);
    setSelectedParameter(numericColumns[0] || '');
    setSelectedParameter2(numericColumns[1] || numericColumns[0] || '');
    setError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    } else {
      setError('Unsupported file format. Please upload CSV or Excel files.');
      setParsing(false);
    }

    event.target.value = '';
  };

  // Line Chart Data - Time Series Trends
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
          min: Math.min(...values),
          max: Math.max(...values),
        }))
        .slice(0, 50);
    }

    return data.slice(0, 50).map((row, idx) => ({
      time: `Point ${idx + 1}`,
      value: row[parameter] || 0,
    }));
  };

  // Area Chart Data - Cumulative Growth/Loss
  const generateAreaChartData = (parameter: string) => {
    const lineData = generateLineChartData(parameter);
    let cumulative = 0;
    return lineData.map((d) => {
      cumulative += d.value;
      return { ...d, cumulative };
    });
  };

  // Bar Chart Data - Period/Region Comparison
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
          count: values.length,
        }))
        .slice(0, 20);
    }

    return [];
  };

  // Slope Chart Data - Before vs After Comparison
  const generateSlopeChartData = (parameter: string) => {
    if (!analysisData) return [];
    const data = analysisData.data;
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const categories = analysisData.categoricalColumns.length > 0 
      ? [...new Set(data.map((row) => String(row[analysisData.categoricalColumns[0]])))]
      : ['Overall'];

    return categories.slice(0, 10).map((category) => {
      const beforeValues = firstHalf
        .filter((row) => !analysisData.categoricalColumns[0] || String(row[analysisData.categoricalColumns[0]]) === category)
        .map((row) => row[parameter])
        .filter((v) => typeof v === 'number');
      
      const afterValues = secondHalf
        .filter((row) => !analysisData.categoricalColumns[0] || String(row[analysisData.categoricalColumns[0]]) === category)
        .map((row) => row[parameter])
        .filter((v) => typeof v === 'number');

      const before = beforeValues.length > 0 ? beforeValues.reduce((a, b) => a + b, 0) / beforeValues.length : 0;
      const after = afterValues.length > 0 ? afterValues.reduce((a, b) => a + b, 0) / afterValues.length : 0;
      const change = ((after - before) / before) * 100;

      return { category, before, after, change };
    });
  };





  // Growth/Loss Insight Generator
  const generateGrowthInsight = (chartType: string, parameter: string): GrowthInsight => {
    if (!analysisData) return { title: '', description: '', type: 'stable', severity: 'low' };

    const lineData = generateLineChartData(parameter);
    if (lineData.length < 2) return { title: 'Insufficient Data', description: 'Not enough data points for trend analysis.', type: 'stable', severity: 'low' };

    const firstValue = lineData[0].value;
    const lastValue = lineData[lineData.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    const absChange = Math.abs(change);

    switch (chartType) {
      case 'line':
        if (change > 15) {
          return {
            title: '⚠️ Significant Growth Detected',
            description: `${parameter} shows a ${change.toFixed(1)}% increase over the analysis period. This upward trend may indicate environmental stress, pollution accumulation, or temperature rise requiring immediate attention.`,
            type: 'degradation',
            severity: 'high',
          };
        } else if (change > 5) {
          return {
            title: '📈 Moderate Growth Trend',
            description: `${parameter} increased by ${change.toFixed(1)}%. Monitor this trend closely as continued growth may signal environmental changes or resource depletion.`,
            type: 'growth',
            severity: 'medium',
          };
        } else if (change < -15) {
          return {
            title: '✅ Significant Recovery Detected',
            description: `${parameter} decreased by ${Math.abs(change).toFixed(1)}%, indicating positive environmental recovery, pollution reduction, or ecosystem restoration. Continue conservation efforts.`,
            type: 'recovery',
            severity: 'high',
          };
        } else if (change < -5) {
          return {
            title: '📉 Moderate Decline Observed',
            description: `${parameter} shows a ${Math.abs(change).toFixed(1)}% decrease. This could indicate either positive recovery (if reducing pollution) or negative loss (if reducing biodiversity). Context-dependent analysis recommended.`,
            type: 'loss',
            severity: 'medium',
          };
        } else {
          return {
            title: '➡️ Stable Conditions',
            description: `${parameter} remains relatively stable with only ${absChange.toFixed(1)}% variation. Current environmental conditions are consistent with no major growth or loss patterns detected.`,
            type: 'stable',
            severity: 'low',
          };
        }

      case 'area':
        const cumulativeData = generateAreaChartData(parameter);
        const totalAccumulation = cumulativeData[cumulativeData.length - 1].cumulative;
        return {
          title: totalAccumulation > 0 ? '📊 Cumulative Growth Pattern' : '📊 Cumulative Loss Pattern',
          description: `Total cumulative ${parameter} reaches ${totalAccumulation.toFixed(2)}. ${totalAccumulation > 0 ? 'Increasing accumulation indicates sustained environmental pressure or resource growth.' : 'Decreasing cumulative values suggest resource depletion or environmental improvement.'}`,
          type: totalAccumulation > 0 ? 'growth' : 'loss',
          severity: Math.abs(totalAccumulation) > 1000 ? 'high' : 'medium',
        };

      case 'bar':
        const barData = generateBarChartData(parameter);
        if (barData.length > 1) {
          const maxCategory = barData.reduce((max, d) => (d.average > max.average ? d : max), barData[0]);
          const minCategory = barData.reduce((min, d) => (d.average < min.average ? d : min), barData[0]);
          const variation = ((maxCategory.average - minCategory.average) / minCategory.average) * 100;

          return {
            title: '🔍 Regional/Temporal Variation',
            description: `Highest ${parameter} in ${maxCategory.category} (${maxCategory.average.toFixed(2)}), lowest in ${minCategory.category} (${minCategory.average.toFixed(2)}). ${variation.toFixed(1)}% variation indicates ${variation > 50 ? 'significant spatial inequality requiring targeted intervention' : 'moderate regional differences'}.`,
            type: variation > 50 ? 'degradation' : 'stable',
            severity: variation > 50 ? 'high' : 'medium',
          };
        }
        break;

      case 'slope':
        const slopeData = generateSlopeChartData(parameter);
        const avgChange = slopeData.reduce((sum, d) => sum + d.change, 0) / slopeData.length;
        
        if (avgChange > 10) {
          return {
            title: '⚠️ Accelerating Growth',
            description: `Average ${avgChange.toFixed(1)}% increase detected across categories. This acceleration pattern suggests worsening environmental conditions or intensifying pressure on marine ecosystems.`,
            type: 'degradation',
            severity: 'high',
          };
        } else if (avgChange < -10) {
          return {
            title: '✅ Recovery in Progress',
            description: `Average ${Math.abs(avgChange).toFixed(1)}% decrease indicates positive recovery trajectory. Conservation measures appear effective. Maintain current interventions.`,
            type: 'recovery',
            severity: 'high',
          };
        } else {
          return {
            title: '➡️ Minimal Change',
            description: `Average change of ${Math.abs(avgChange).toFixed(1)}% suggests stable conditions with no significant growth or loss between periods.`,
            type: 'stable',
            severity: 'low',
          };
        }
    }

    return {
      title: 'Analysis Complete',
      description: `${parameter} data analyzed successfully.`,
      type: 'stable',
      severity: 'low',
    };
  };

  const downloadResults = () => {
    if (!analysisData) return;

    const csv = Papa.unparse(analysisData.data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth_loss_analysis_${Date.now()}.csv`;
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
            <span className="gradient-text">Growth & Loss Analysis Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload any dataset for comprehensive growth, loss, recovery, and degradation analysis with AI-driven insights
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
              Upload CSV or Excel files with any type of data. The system will automatically detect numeric columns for analysis.
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
                    <p className="text-xs text-muted-foreground">CSV, XLSX, XLS • Any dataset type accepted</p>
                  </div>
                  <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={parsing} />
                </label>

                <div className="flex justify-center">
                  <Button onClick={loadSampleDataset} variant="outline" disabled={parsing}>
                    <Activity className="h-4 w-4 mr-2" />
                    Load Sample Environmental Dataset
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
                    ✓ Analysis ready: {analysisData.data.length} records, {analysisData.numericColumns.length} numeric parameters
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
            {/* Parameter Selection */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analysis Parameters
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
                        <div className="text-xs text-muted-foreground">Parameters</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualizations Grid */}
            {analysisData.numericColumns.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* 1. Line Chart - Time Series Trends */}
              {selectedParameter && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Time-Series Trend Analysis</CardTitle>
                        <CardDescription>Identify growth, decline, spikes, and drops in {selectedParameter}</CardDescription>
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
                        <ReferenceLine y={generateLineChartData(selectedParameter).reduce((sum, d) => sum + d.value, 0) / generateLineChartData(selectedParameter).length} stroke="#f59e0b" strokeDasharray="5 5" label="Threshold" />
                        <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} name={selectedParameter} dot={{ r: 3 }} />
                        {'max' in (generateLineChartData(selectedParameter)[0] || {}) && (
                          <>
                            <Line type="monotone" dataKey="max" stroke={LOSS_COLOR} strokeWidth={1} strokeDasharray="3 3" name="Max" dot={false} />
                            <Line type="monotone" dataKey="min" stroke={GROWTH_COLOR} strokeWidth={1} strokeDasharray="3 3" name="Min" dot={false} />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                    <GrowthInsightBox insight={generateGrowthInsight('line', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* 2. Area Chart - Cumulative Growth/Loss */}
              {selectedParameter && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Cumulative Impact Analysis</CardTitle>
                        <CardDescription>Total accumulation and magnitude of {selectedParameter}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
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
                    <GrowthInsightBox insight={generateGrowthInsight('area', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* 3. Bar Chart - Period/Region Comparison */}
              {selectedParameter && generateBarChartData(selectedParameter).length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Comparative Analysis</CardTitle>
                        <CardDescription>Side-by-side comparison of {selectedParameter}</CardDescription>
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
                        <Bar dataKey="average" name="Average" radius={[8, 8, 0, 0]}>
                          {generateBarChartData(selectedParameter).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <GrowthInsightBox insight={generateGrowthInsight('bar', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* 4. Slope Chart - Before vs After */}
              {selectedParameter && generateSlopeChartData(selectedParameter).length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Before vs After Comparison</CardTitle>
                        <CardDescription>Growth/loss direction and rate of change for {selectedParameter}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                        Slope Chart
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {generateSlopeChartData(selectedParameter).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30">
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">{item.category}</div>
                            <div className="flex items-center gap-4">
                              <div className="text-xs text-muted-foreground">
                                Before: <span className="font-semibold">{item.before.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {item.change > 0 ? (
                                  <TrendingUp className="h-4 w-4 text-red-500" />
                                ) : item.change < 0 ? (
                                  <TrendingDown className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Minus className="h-4 w-4 text-gray-500" />
                                )}
                                <span className={`text-xs font-semibold ${item.change > 0 ? 'text-red-500' : item.change < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                                  {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                After: <span className="font-semibold">{item.after.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <GrowthInsightBox insight={generateGrowthInsight('slope', selectedParameter)} />
                  </CardContent>
                </Card>
              )}
            </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Preview</CardTitle>
                  <CardDescription>
                    Your dataset contains {analysisData.categoricalColumns.length} text column(s). 
                    Showing first 10 records for review.
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
                      This dataset contains text data. For growth/loss visualizations, please upload a dataset with numeric columns (e.g., temperature, population, sales, etc.).
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

function GrowthInsightBox({ insight }: { insight: GrowthInsight }) {
  const getInsightColor = (type: GrowthInsight['type']) => {
    switch (type) {
      case 'growth':
        return 'border-orange-500/20 bg-orange-500/5';
      case 'loss':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'recovery':
        return 'border-green-500/20 bg-green-500/5';
      case 'degradation':
        return 'border-red-500/20 bg-red-500/5';
      case 'stable':
        return 'border-gray-500/20 bg-gray-500/5';
      default:
        return 'border-border bg-muted/30';
    }
  };

  const getSeverityBadge = (severity: GrowthInsight['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Low Priority</Badge>;
    }
  };

  return (
    <div className={`mt-4 p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1">
          <Activity className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">{insight.title}</div>
            <div className="text-xs text-muted-foreground">{insight.description}</div>
          </div>
        </div>
        {getSeverityBadge(insight.severity)}
      </div>
    </div>
  );
}
