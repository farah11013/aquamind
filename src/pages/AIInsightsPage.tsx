import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, Users, Lightbulb, Target } from 'lucide-react';
import { getAIInsights, type AIInsight } from '@/services/marineDataService';

export default function AIInsightsPage() {
  const insights = getAIInsights();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prediction':
        return <TrendingUp className="h-5 w-5" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5" />;
      case 'sustainability':
        return <Target className="h-5 w-5" />;
      case 'population':
        return <Users className="h-5 w-5" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prediction':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'anomaly':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'sustainability':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'population':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'recommendation':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const hours = Math.floor((Date.now() - timestamp.getTime()) / 3600000);
    if (hours < 1) {
      const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
      return `${minutes} minutes ago`;
    }
    return `${hours} hours ago`;
  };

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">AI Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Intelligent analysis and predictive insights from marine data
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Generated today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.filter((i) => i.impact === 'high').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">AI accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.filter((i) => i.category === 'anomaly').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Detected</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights List */}
        <div className="space-y-6">
          {insights.map((insight: AIInsight) => (
            <Card key={insight.id} className="border-border hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${getCategoryColor(insight.category)}`}>
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{insight.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(insight.category)}>
                          {insight.category}
                        </Badge>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline">
                          {(insight.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(insight.timestamp)}
                  </div>
                </div>
              </CardHeader>
              {insight.data && (
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Data Points:</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(insight.data).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-xs text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm font-medium">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* AI Explanation Section */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>How AI Insights Work</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our AI system analyzes real-time and historical marine data using advanced machine learning algorithms to generate actionable insights:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Predictive Models:</strong> Time-series analysis and neural networks forecast population trends and environmental changes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Anomaly Detection:</strong> Unsupervised learning identifies unusual patterns that may indicate environmental threats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Sustainability Analysis:</strong> Multi-factor models assess fishing practices and ecosystem health</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Confidence Scoring:</strong> Each insight includes a confidence score based on data quality and model accuracy</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
