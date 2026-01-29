import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { History, FileSpreadsheet, Trash2, Eye, Download, Calendar, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllDatasetHistory, deleteDatasetFromHistory, type DatasetHistory } from '@/lib/datasetHistoryApi';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [history, setHistory] = useState<DatasetHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDatasetHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load dataset history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      await deleteDatasetFromHistory(id);
      toast({
        title: 'Dataset deleted',
        description: `${filename} has been removed from history`,
      });
      loadHistory();
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete dataset',
        variant: 'destructive',
      });
      console.error(err);
    }
  };

  const handleView = (dataset: DatasetHistory) => {
    // Store dataset in sessionStorage and navigate to analytics page
    sessionStorage.setItem('loadDataset', JSON.stringify(dataset));
    navigate('/analytics');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'csv':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'xlsx':
      case 'xls':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'sample':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            <span className="gradient-text">Dataset History</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            View and manage all your uploaded datasets
          </p>
        </div>

        {/* Statistics Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="text-sm text-muted-foreground mb-1">Total Datasets</div>
                <div className="text-3xl font-bold text-primary">{history.length}</div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="text-sm text-muted-foreground mb-1">Total Records</div>
                <div className="text-3xl font-bold text-primary">
                  {history.reduce((sum, h) => sum + h.record_count, 0).toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="text-sm text-muted-foreground mb-1">Storage Used</div>
                <div className="text-3xl font-bold text-primary">
                  {formatFileSize(history.reduce((sum, h) => sum + (h.file_size || 0), 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center">
                <Database className="h-12 w-12 text-muted-foreground animate-pulse mb-4" />
                <p className="text-muted-foreground">Loading history...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert className="border-red-500/20 bg-red-500/5">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">{error}</AlertDescription>
          </Alert>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center">
                <History className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No datasets uploaded yet</p>
                <Button onClick={() => navigate('/analytics')}>Upload Your First Dataset</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {history.map((dataset) => (
              <Card key={dataset.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg truncate">{dataset.filename}</h3>
                          <Badge variant="outline" className={getFileTypeColor(dataset.file_type)}>
                            {dataset.file_type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(dataset.upload_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            <span>{dataset.record_count.toLocaleString()} records</span>
                          </div>
                          <div>
                            <span className="font-medium">{dataset.numeric_columns.length}</span> numeric columns
                          </div>
                          <div>
                            <span className="font-medium">{dataset.categorical_columns.length}</span> categorical columns
                          </div>
                        </div>
                        {dataset.time_column && (
                          <div className="text-xs text-muted-foreground">
                            Time column: <span className="font-medium text-primary">{dataset.time_column}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(dataset)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(dataset.id, dataset.filename)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
