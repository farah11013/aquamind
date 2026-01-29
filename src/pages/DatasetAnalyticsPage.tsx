import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, AlertCircle, Download, Calendar, TrendingUp, Activity, BarChart3, Plus, X } from 'lucide-react';
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
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';

interface UploadedDataset {
  id: string;
  name: string;
  data: Record<string, any>[];
  rowCount: number;
}

interface TimeSeriesData {
  data: Record<string, any>[];
  yearColumn: string;
  dateColumn: string | null;
  years: number[];
  yearRange: { min: number; max: number };
  numericColumns: string[];
  categoricalColumns: string[];
  timeSeriesValid: boolean;
  validationMessage: string;
  datasetCount: number;
}

interface ChartInsight {
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'seasonal' | 'correlation' | 'distribution';
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
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [parsing, setParsing] = useState(false);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedYearRange, setSelectedYearRange] = useState<[number, number] | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<string>('');

  // Load sample multi-year marine datasets
  const loadSampleDatasets = () => {
    const dataset1: Record<string, any>[] = [];
    const dataset2: Record<string, any>[] = [];
    const years = [2019, 2020, 2021, 2022, 2023];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Dataset 1: Arabian Sea stations
    years.forEach((year) => {
      months.forEach((month, monthIdx) => {
        ['Station_A1', 'Station_A2'].forEach((station) => {
          const baseTemp = 26 + Math.sin((monthIdx / 12) * Math.PI * 2) * 4;
          const baseSalinity = 35 + Math.cos((monthIdx / 12) * Math.PI * 2) * 2;
          const basePh = 8.0 + Math.sin((monthIdx / 12) * Math.PI) * 0.3;
          const baseOxygen = 5.5 + Math.cos((monthIdx / 12) * Math.PI * 2) * 1.5;
          const baseChlorophyll = 0.5 + Math.sin((monthIdx / 12) * Math.PI * 2) * 0.4;

          dataset1.push({
            Year: year,
            Month: month,
            Date: `${year}-${String(monthIdx + 1).padStart(2, '0')}-15`,
            Station: station,
            Region: 'Arabian Sea',
            Temperature: Number((baseTemp + (Math.random() - 0.5) * 2).toFixed(2)),
            Salinity: Number((baseSalinity + (Math.random() - 0.5) * 1).toFixed(2)),
            pH: Number((basePh + (Math.random() - 0.5) * 0.2).toFixed(2)),
            Oxygen: Number((baseOxygen + (Math.random() - 0.5) * 1).toFixed(2)),
            Chlorophyll: Number((baseChlorophyll + (Math.random() - 0.5) * 0.2).toFixed(3)),
            FishPopulation: Math.floor(150 + Math.sin((monthIdx / 12) * Math.PI * 2) * 50 + (Math.random() - 0.5) * 30),
            Depth: Math.floor(50 + Math.random() * 100),
            Latitude: Number((15 + Math.random() * 3).toFixed(2)),
            Longitude: Number((72 + Math.random() * 3).toFixed(2)),
          });
        });
      });
    });

    // Dataset 2: Bay of Bengal stations
    years.forEach((year) => {
      months.forEach((month, monthIdx) => {
        ['Station_B1', 'Station_B2'].forEach((station) => {
          const baseTemp = 27 + Math.sin((monthIdx / 12) * Math.PI * 2) * 3.5;
          const baseSalinity = 33 + Math.cos((monthIdx / 12) * Math.PI * 2) * 1.5;
          const basePh = 8.1 + Math.sin((monthIdx / 12) * Math.PI) * 0.25;
          const baseOxygen = 6.0 + Math.cos((monthIdx / 12) * Math.PI * 2) * 1.2;
          const baseChlorophyll = 0.6 + Math.sin((monthIdx / 12) * Math.PI * 2) * 0.35;

          dataset2.push({
            Year: year,
            Month: month,
            Date: `${year}-${String(monthIdx + 1).padStart(2, '0')}-15`,
            Station: station,
            Region: 'Bay of Bengal',
            Temperature: Number((baseTemp + (Math.random() - 0.5) * 2).toFixed(2)),
            Salinity: Number((baseSalinity + (Math.random() - 0.5) * 1).toFixed(2)),
            pH: Number((basePh + (Math.random() - 0.5) * 0.2).toFixed(2)),
            Oxygen: Number((baseOxygen + (Math.random() - 0.5) * 1).toFixed(2)),
            Chlorophyll: Number((baseChlorophyll + (Math.random() - 0.5) * 0.2).toFixed(3)),
            FishPopulation: Math.floor(180 + Math.sin((monthIdx / 12) * Math.PI * 2) * 60 + (Math.random() - 0.5) * 30),
            Depth: Math.floor(30 + Math.random() * 80),
            Latitude: Number((10 + Math.random() * 3).toFixed(2)),
            Longitude: Number((78 + Math.random() * 3).toFixed(2)),
          });
        });
      });
    });

    const datasets: UploadedDataset[] = [
      {
        id: 'sample-1',
        name: 'Arabian Sea Dataset (2019-2023)',
        data: dataset1,
        rowCount: dataset1.length,
      },
      {
        id: 'sample-2',
        name: 'Bay of Bengal Dataset (2019-2023)',
        data: dataset2,
        rowCount: dataset2.length,
      },
    ];

    setUploadedDatasets(datasets);
    processCombinedDatasets(datasets);
    setError(null);

    toast({
      title: 'Sample datasets loaded',
      description: `2 datasets loaded with ${dataset1.length + dataset2.length} total records`,
    });
  };

  const detectYearColumn = (data: Record<string, any>[]): string | null => {
    const firstRow = data[0];
    const possibleYearColumns = ['year', 'Year', 'YEAR', 'yr', 'Yr'];

    for (const col of possibleYearColumns) {
      if (col in firstRow) {
        const value = firstRow[col];
        if (typeof value === 'number' && value >= 1900 && value <= 2100) {
          return col;
        }
      }
    }

    for (const [key, value] of Object.entries(firstRow)) {
      if (typeof value === 'number' && value >= 1900 && value <= 2100) {
        return key;
      }
    }

    return null;
  };

  const detectDateColumn = (data: Record<string, any>[]): string | null => {
    const firstRow = data[0];
    const possibleDateColumns = ['date', 'Date', 'DATE', 'datetime', 'DateTime', 'timestamp'];

    for (const col of possibleDateColumns) {
      if (col in firstRow) {
        return col;
      }
    }

    return null;
  };

  const extractYears = (data: Record<string, any>[], yearColumn: string): number[] => {
    const years = new Set<number>();
    data.forEach((row) => {
      const year = row[yearColumn];
      if (typeof year === 'number') {
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => a - b);
  };

  const combineDatasets = (datasets: UploadedDataset[]): Record<string, any>[] => {
    const combined: Record<string, any>[] = [];
    datasets.forEach((dataset) => {
      combined.push(...dataset.data);
    });
    return combined;
  };

  const processCombinedDatasets = (datasets: UploadedDataset[]) => {
    if (datasets.length < 2) {
      setError('Please upload at least 2 datasets for comprehensive analysis.');
      setTimeSeriesData(null);
      return;
    }

    const combinedData = combineDatasets(datasets);

    if (combinedData.length === 0) {
      setError('No data found in uploaded datasets.');
      setTimeSeriesData(null);
      return;
    }

    const yearColumn = detectYearColumn(combinedData);

    if (!yearColumn) {
      setError('No year column detected. Please ensure your datasets have a "Year" column with values between 1900-2100.');
      setTimeSeriesData(null);
      return;
    }

    const years = extractYears(combinedData, yearColumn);
    const yearRange = { min: Math.min(...years), max: Math.max(...years) };
    const yearSpan = yearRange.max - yearRange.min + 1;

    if (yearSpan < 4) {
      setError(`Combined dataset must contain at least 4 years of data. Current span: ${yearSpan} years (${yearRange.min}-${yearRange.max})`);
      setTimeSeriesData(null);
      return;
    }

    const dateColumn = detectDateColumn(combinedData);
    const firstRow = combinedData[0];
    const numericColumns: string[] = [];
    const categoricalColumns: string[] = [];

    Object.entries(firstRow).forEach(([key, value]) => {
      if (key === yearColumn || key === dateColumn) return;
      if (typeof value === 'number') {
        numericColumns.push(key);
      } else {
        categoricalColumns.push(key);
      }
    });

    const timeSeriesData: TimeSeriesData = {
      data: combinedData,
      yearColumn,
      dateColumn,
      years,
      yearRange,
      numericColumns,
      categoricalColumns,
      timeSeriesValid: true,
      validationMessage: `✓ Valid combined dataset: ${datasets.length} datasets merged, ${yearSpan} years (${yearRange.min}-${yearRange.max}), ${combinedData.length} total records`,
      datasetCount: datasets.length,
    };

    setTimeSeriesData(timeSeriesData);
    setSelectedYearRange([yearRange.min, yearRange.max]);
    setSelectedParameter(numericColumns[0] || '');
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
          const newDataset: UploadedDataset = {
            id: `dataset-${Date.now()}`,
            name: file.name,
            data: results.data as Record<string, any>[],
            rowCount: results.data.length,
          };
          const updatedDatasets = [...uploadedDatasets, newDataset];
          setUploadedDatasets(updatedDatasets);
          processCombinedDatasets(updatedDatasets);
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
          const newDataset: UploadedDataset = {
            id: `dataset-${Date.now()}`,
            name: file.name,
            data: jsonData as Record<string, any>[],
            rowCount: jsonData.length,
          };
          const updatedDatasets = [...uploadedDatasets, newDataset];
          setUploadedDatasets(updatedDatasets);
          processCombinedDatasets(updatedDatasets);
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

  const removeDataset = (id: string) => {
    const updatedDatasets = uploadedDatasets.filter((d) => d.id !== id);
    setUploadedDatasets(updatedDatasets);
    if (updatedDatasets.length >= 2) {
      processCombinedDatasets(updatedDatasets);
    } else {
      setTimeSeriesData(null);
      if (updatedDatasets.length === 1) {
        setError('Please upload at least 2 datasets for comprehensive analysis.');
      }
    }
    toast({
      title: 'Dataset removed',
      description: `${updatedDatasets.length} dataset(s) remaining`,
    });
  };

  const getFilteredData = () => {
    if (!timeSeriesData || !selectedYearRange) return [];
    return timeSeriesData.data.filter((row) => {
      const year = row[timeSeriesData.yearColumn];
      return year >= selectedYearRange[0] && year <= selectedYearRange[1];
    });
  };

  const generateYearWiseData = (parameter: string) => {
    if (!timeSeriesData) return [];
    const filteredData = getFilteredData();
    const yearGroups: Record<number, number[]> = {};

    filteredData.forEach((row) => {
      const year = row[timeSeriesData.yearColumn];
      const value = row[parameter];
      if (typeof value === 'number') {
        if (!yearGroups[year]) yearGroups[year] = [];
        yearGroups[year].push(value);
      }
    });

    return Object.entries(yearGroups)
      .map(([year, values]) => ({
        year: Number(year),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      }))
      .sort((a, b) => a.year - b.year);
  };

  const generateDistributionData = (parameter: string) => {
    if (!timeSeriesData) return [];
    const filteredData = getFilteredData();
    const categoryCount: Record<string, number> = {};

    if (timeSeriesData.categoricalColumns.includes(parameter)) {
      filteredData.forEach((row) => {
        const value = String(row[parameter]);
        categoryCount[value] = (categoryCount[value] || 0) + 1;
      });
    } else {
      const values = filteredData.map((row) => row[parameter]).filter((v) => typeof v === 'number');
      if (values.length === 0) return [];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const bins = 5;
      const binSize = (max - min) / bins;

      for (let i = 0; i < bins; i++) {
        const binStart = min + i * binSize;
        const binEnd = binStart + binSize;
        const binLabel = `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
        categoryCount[binLabel] = values.filter((v) => v >= binStart && v < binEnd).length;
      }
    }

    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  };

  const generateScatterData = (param1: string, param2: string) => {
    if (!timeSeriesData) return [];
    const filteredData = getFilteredData();
    return filteredData
      .map((row) => ({
        x: row[param1],
        y: row[param2],
        year: row[timeSeriesData.yearColumn],
      }))
      .filter((d) => typeof d.x === 'number' && typeof d.y === 'number');
  };

  const generateHistogramData = (parameter: string) => {
    if (!timeSeriesData) return [];
    const filteredData = getFilteredData();
    const values = filteredData.map((row) => row[parameter]).filter((v) => typeof v === 'number');

    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const bins = 10;
    const binSize = (max - min) / bins;
    const histogram: { range: string; frequency: number }[] = [];

    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      const frequency = values.filter((v) => v >= binStart && v < binEnd).length;
      histogram.push({
        range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        frequency,
      });
    }

    return histogram;
  };

  const generateBoxPlotData = (parameter: string) => {
    if (!timeSeriesData) return [];
    const filteredData = getFilteredData();
    const yearGroups: Record<number, number[]> = {};

    filteredData.forEach((row) => {
      const year = row[timeSeriesData.yearColumn];
      const value = row[parameter];
      if (typeof value === 'number') {
        if (!yearGroups[year]) yearGroups[year] = [];
        yearGroups[year].push(value);
      }
    });

    return Object.entries(yearGroups).map(([year, values]) => {
      const sorted = values.sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const median = sorted[Math.floor(sorted.length * 0.5)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const iqr = q3 - q1;
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);

      return {
        year: Number(year),
        min,
        q1,
        median,
        q3,
        max,
        outliers: outliers.length,
      };
    });
  };

  const generateSeasonalData = (parameter: string) => {
    if (!timeSeriesData || !timeSeriesData.dateColumn) return [];
    const filteredData = getFilteredData();
    const monthlyData: Record<string, number[]> = {};

    filteredData.forEach((row) => {
      const dateStr = row[timeSeriesData.dateColumn!];
      const value = row[parameter];
      if (typeof value === 'number' && dateStr) {
        const date = new Date(dateStr);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!monthlyData[month]) monthlyData[month] = [];
        monthlyData[month].push(value);
      }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months
      .map((month) => ({
        month,
        average: monthlyData[month] ? monthlyData[month].reduce((a, b) => a + b, 0) / monthlyData[month].length : 0,
      }))
      .filter((d) => d.average > 0);
  };

  const generateInsight = (chartType: string, parameter: string): ChartInsight => {
    if (!timeSeriesData) return { title: '', description: '', type: 'trend' };

    const filteredData = getFilteredData();
    const yearWiseData = generateYearWiseData(parameter);

    switch (chartType) {
      case 'line':
        const trend = yearWiseData.length > 1 ? (yearWiseData[yearWiseData.length - 1].average - yearWiseData[0].average) / yearWiseData[0].average * 100 : 0;
        return {
          title: trend > 5 ? 'Increasing Trend' : trend < -5 ? 'Decreasing Trend' : 'Stable Trend',
          description: `Combined analysis from ${timeSeriesData.datasetCount} datasets shows ${parameter} with a ${Math.abs(trend).toFixed(1)}% ${trend > 0 ? 'increase' : 'decrease'} over ${yearWiseData.length} years. ${trend > 10 ? 'Significant upward trend detected across all regions.' : trend < -10 ? 'Significant downward trend detected across all regions.' : 'Relatively stable pattern observed.'}`,
          type: 'trend',
        };

      case 'bar':
        const maxYear = yearWiseData.reduce((max, d) => (d.average > max.average ? d : max), yearWiseData[0]);
        const minYear = yearWiseData.reduce((min, d) => (d.average < min.average ? d : min), yearWiseData[0]);
        return {
          title: 'Year-wise Variation',
          description: `Across ${timeSeriesData.datasetCount} datasets, highest average ${parameter} recorded in ${maxYear.year} (${maxYear.average.toFixed(2)}), lowest in ${minYear.year} (${minYear.average.toFixed(2)}). Inter-annual variation of ${((maxYear.average - minYear.average) / minYear.average * 100).toFixed(1)}% observed.`,
          type: 'anomaly',
        };

      case 'area':
        const seasonalData = generateSeasonalData(parameter);
        if (seasonalData.length > 0) {
          const maxMonth = seasonalData.reduce((max, d) => (d.average > max.average ? d : max), seasonalData[0]);
          const minMonth = seasonalData.reduce((min, d) => (d.average < min.average ? d : min), seasonalData[0]);
          return {
            title: 'Seasonal Pattern',
            description: `Combined seasonal analysis reveals clear variation. Peak values in ${maxMonth.month} (${maxMonth.average.toFixed(2)}), lowest in ${minMonth.month} (${minMonth.average.toFixed(2)}). Seasonal amplitude: ${((maxMonth.average - minMonth.average) / minMonth.average * 100).toFixed(1)}% across all datasets.`,
            type: 'seasonal',
          };
        }
        return {
          title: 'Cumulative Trend',
          description: `Cumulative ${parameter} analysis from ${timeSeriesData.datasetCount} merged datasets shows consistent patterns with ${filteredData.length} data points.`,
          type: 'trend',
        };

      case 'box':
        const boxData = generateBoxPlotData(parameter);
        const totalOutliers = boxData.reduce((sum, d) => sum + d.outliers, 0);
        return {
          title: 'Variability Analysis',
          description: `${totalOutliers} outliers detected across ${boxData.length} years from ${timeSeriesData.datasetCount} datasets. ${totalOutliers > 10 ? 'High variability indicates significant environmental fluctuations across regions.' : 'Low variability suggests stable conditions.'} Median values range from ${Math.min(...boxData.map((d) => d.median)).toFixed(2)} to ${Math.max(...boxData.map((d) => d.median)).toFixed(2)}.`,
          type: 'anomaly',
        };

      case 'pie':
        const distData = generateDistributionData(parameter);
        const dominant = distData.reduce((max, d) => (d.value > max.value ? d : max), distData[0]);
        return {
          title: 'Distribution Analysis',
          description: `Combined dataset analysis: ${dominant.name} represents ${((dominant.value / filteredData.length) * 100).toFixed(1)}% of total observations. Distribution across ${distData.length} categories from ${timeSeriesData.datasetCount} sources shows ${distData.length > 5 ? 'high diversity' : 'concentrated patterns'}.`,
          type: 'distribution',
        };

      case 'histogram':
        const histData = generateHistogramData(parameter);
        const maxFreq = Math.max(...histData.map((d) => d.frequency));
        const modalBin = histData.find((d) => d.frequency === maxFreq);
        return {
          title: 'Frequency Distribution',
          description: `Most frequent values fall in range ${modalBin?.range} with ${maxFreq} occurrences across ${timeSeriesData.datasetCount} datasets. Distribution shows ${maxFreq > filteredData.length * 0.3 ? 'concentrated' : 'dispersed'} pattern.`,
          type: 'distribution',
        };

      case 'scatter':
        return {
          title: 'Parameter Correlation',
          description: `Scatter plot from ${timeSeriesData.datasetCount} merged datasets reveals relationship patterns. ${filteredData.length} observations across ${yearWiseData.length} years enable comprehensive correlation analysis.`,
          type: 'correlation',
        };

      default:
        return { title: 'Analysis', description: 'Data visualization generated.', type: 'trend' };
    }
  };

  const downloadResults = () => {
    if (!timeSeriesData) return;

    const filteredData = getFilteredData();
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marine_analytics_combined_${selectedYearRange?.[0]}-${selectedYearRange?.[1]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Download complete',
      description: `Exported ${filteredData.length} combined records`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Marine Analytics Platform</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload multiple marine datasets for comprehensive combined analysis with AI-driven insights
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload Multiple Datasets (Minimum 2 Required)
            </CardTitle>
            <CardDescription>
              Upload CSV or Excel files with at least 4 years of marine data. Use the + button to add more datasets for comprehensive analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedDatasets.length === 0 ? (
              <>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload first dataset</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV, XLSX, XLS (MAX. 50MB) • Minimum 4 years required</p>
                  </div>
                  <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={parsing} />
                </label>

                <div className="flex justify-center">
                  <Button onClick={loadSampleDatasets} variant="outline" disabled={parsing}>
                    <Activity className="h-4 w-4 mr-2" />
                    Load Sample Datasets (2 datasets)
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {/* Uploaded Datasets List */}
                <div className="space-y-2">
                  {uploadedDatasets.map((dataset, index) => (
                    <div key={dataset.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Dataset {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{dataset.name}</div>
                          <div className="text-xs text-muted-foreground">{dataset.rowCount} records</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeDataset(dataset.id)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add More Dataset Button */}
                <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">Add Another Dataset</span>
                  </div>
                  <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={parsing} />
                </label>

                {timeSeriesData && (
                  <Alert className="border-green-500/20 bg-green-500/5">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">{timeSeriesData.validationMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setUploadedDatasets([]);
                      setTimeSeriesData(null);
                      setError(null);
                    }}
                    variant="outline"
                  >
                    Clear All Datasets
                  </Button>
                  {timeSeriesData && (
                    <Button onClick={downloadResults} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Combined Results
                    </Button>
                  )}
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

        {/* Analytics Dashboard */}
        {timeSeriesData && (
          <>
            {/* Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Combined Analysis Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Year Range</label>
                    <div className="flex gap-2">
                      <Select
                        value={String(selectedYearRange?.[0])}
                        onValueChange={(value) => setSelectedYearRange([Number(value), selectedYearRange![1]])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSeriesData.years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="flex items-center">to</span>
                      <Select
                        value={String(selectedYearRange?.[1])}
                        onValueChange={(value) => setSelectedYearRange([selectedYearRange![0], Number(value)])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSeriesData.years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Primary Parameter</label>
                    <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSeriesData.numericColumns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{getFilteredData().length}</div>
                        <div className="text-xs text-muted-foreground">Records</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{timeSeriesData.datasetCount}</div>
                        <div className="text-xs text-muted-foreground">Datasets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{timeSeriesData.numericColumns.length}</div>
                        <div className="text-xs text-muted-foreground">Parameters</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualizations Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Line Chart - Multi-Year Trends */}
              {selectedParameter && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Multi-Year Trend Analysis</CardTitle>
                        <CardDescription>Combined {selectedParameter} patterns from all datasets</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Line Chart
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={generateYearWiseData(selectedParameter)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="average" stroke={CHART_COLORS[0]} strokeWidth={2} name="Average" dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="max" stroke={CHART_COLORS[1]} strokeWidth={1} strokeDasharray="5 5" name="Max" />
                        <Line type="monotone" dataKey="min" stroke={CHART_COLORS[2]} strokeWidth={1} strokeDasharray="5 5" name="Min" />
                      </LineChart>
                    </ResponsiveContainer>
                    <AIInsightBox insight={generateInsight('line', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* Bar Chart - Year-wise Comparison */}
              {selectedParameter && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Year-wise Comparison</CardTitle>
                        <CardDescription>Annual average {selectedParameter} across datasets</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Bar Chart
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={generateYearWiseData(selectedParameter)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="average" fill={CHART_COLORS[0]} name="Average" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <AIInsightBox insight={generateInsight('bar', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* Area Chart - Seasonal Variation */}
              {selectedParameter && timeSeriesData.dateColumn && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Seasonal Variation</CardTitle>
                        <CardDescription>Monthly {selectedParameter} patterns combined</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Area Chart
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={generateSeasonalData(selectedParameter)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area type="monotone" dataKey="average" stroke={CHART_COLORS[3]} fill={CHART_COLORS[3]} fillOpacity={0.6} name="Average" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <AIInsightBox insight={generateInsight('area', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* Box Plot - Year-wise Variability */}
              {selectedParameter && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Variability & Outliers</CardTitle>
                        <CardDescription>Year-wise {selectedParameter} distribution</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                        Box Plot
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={generateBoxPlotData(selectedParameter)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="min" fill={CHART_COLORS[2]} name="Min" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="q1" fill={CHART_COLORS[1]} name="Q1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="median" fill={CHART_COLORS[0]} name="Median" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="q3" fill={CHART_COLORS[1]} name="Q3" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="max" fill={CHART_COLORS[2]} name="Max" radius={[4, 4, 0, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <AIInsightBox insight={generateInsight('box', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* Histogram - Frequency Distribution */}
              {selectedParameter && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Frequency Distribution</CardTitle>
                        <CardDescription>{selectedParameter} value distribution</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                        Histogram
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={generateHistogramData(selectedParameter)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="frequency" fill={CHART_COLORS[4]} name="Frequency" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <AIInsightBox insight={generateInsight('histogram', selectedParameter)} />
                  </CardContent>
                </Card>
              )}

              {/* Pie Chart - Distribution Analysis */}
              {timeSeriesData.categoricalColumns.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Distribution Analysis</CardTitle>
                        <CardDescription>{timeSeriesData.categoricalColumns[0]} distribution</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                        Pie Chart
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={generateDistributionData(timeSeriesData.categoricalColumns[0])}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {generateDistributionData(timeSeriesData.categoricalColumns[0]).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <AIInsightBox insight={generateInsight('pie', timeSeriesData.categoricalColumns[0])} />
                  </CardContent>
                </Card>
              )}

              {/* Scatter Plot - Parameter Relationships */}
              {timeSeriesData.numericColumns.length >= 2 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Parameter Correlation</CardTitle>
                        <CardDescription>
                          {selectedParameter} vs {timeSeriesData.numericColumns.find((c) => c !== selectedParameter)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        Scatter Plot
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name={selectedParameter}
                          stroke="hsl(var(--muted-foreground))"
                          label={{ value: selectedParameter, position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name={timeSeriesData.numericColumns.find((c) => c !== selectedParameter)}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Scatter
                          data={generateScatterData(selectedParameter, timeSeriesData.numericColumns.find((c) => c !== selectedParameter)!)}
                          fill={CHART_COLORS[0]}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                    <AIInsightBox insight={generateInsight('scatter', selectedParameter)} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Statistical Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Combined Statistical Summary
                </CardTitle>
                <CardDescription>Aggregated statistics from {timeSeriesData.datasetCount} datasets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeSeriesData.numericColumns.slice(0, 8).map((col) => {
                    const values = getFilteredData()
                      .map((row) => row[col])
                      .filter((v) => typeof v === 'number');
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    const min = Math.min(...values);
                    const max = Math.max(...values);

                    return (
                      <div key={col} className="p-4 rounded-lg border border-border bg-muted/30">
                        <div className="text-sm font-medium text-muted-foreground mb-2">{col}</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Avg:</span>
                            <span className="font-semibold">{avg.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Min:</span>
                            <span className="font-semibold">{min.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max:</span>
                            <span className="font-semibold">{max.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Range:</span>
                            <span className="font-semibold">{(max - min).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function AIInsightBox({ insight }: { insight: ChartInsight }) {
  const getInsightColor = (type: ChartInsight['type']) => {
    switch (type) {
      case 'trend':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'anomaly':
        return 'border-red-500/20 bg-red-500/5';
      case 'seasonal':
        return 'border-green-500/20 bg-green-500/5';
      case 'correlation':
        return 'border-purple-500/20 bg-purple-500/5';
      case 'distribution':
        return 'border-orange-500/20 bg-orange-500/5';
      default:
        return 'border-border bg-muted/30';
    }
  };

  return (
    <div className={`mt-4 p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
      <div className="flex items-start gap-2">
        <Activity className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <div className="font-semibold text-sm mb-1">{insight.title}</div>
          <div className="text-xs text-muted-foreground">{insight.description}</div>
        </div>
      </div>
    </div>
  );
}
