import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, AlertTriangle, Fish, Droplet, TrendingDown, CheckCircle, Clock } from 'lucide-react';
import { getMarineAlerts, type MarineAlert } from '@/services/marineDataService';

export default function AlertsPage() {
  const [alerts] = useState<MarineAlert[]>(getMarineAlerts());
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'environmental':
        return <AlertTriangle className="h-5 w-5" />;
      case 'species':
        return <Fish className="h-5 w-5" />;
      case 'pollution':
        return <Droplet className="h-5 w-5" />;
      case 'overfishing':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'environmental':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'species':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pollution':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'overfishing':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
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
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');
  const highAlerts = activeAlerts.filter((a) => a.severity === 'high');

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Marine Alerts</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time monitoring and critical event notifications
          </p>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{criticalAlerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate action needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{highAlerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Monitor closely</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {alerts.filter((a) => a.status === 'resolved').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Feed</CardTitle>
            <CardDescription>
              Real-time notifications of environmental anomalies and critical events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Alerts</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="space-y-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No {filter === 'all' ? '' : filter} alerts found
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.status === 'resolved' ? 'border-border bg-muted/30' : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${getTypeColor(alert.type)}`}>
                            {getTypeIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{alert.title}</h3>
                              {alert.status === 'resolved' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <Badge className={getTypeColor(alert.type)}>
                                {alert.type}
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(alert.timestamp)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {alert.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium">{alert.location}</span>
                            </div>
                          </div>
                        </div>
                        {alert.status === 'active' && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Alert Configuration */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Alert Notifications</CardTitle>
            <CardDescription>
              Configure how you receive critical marine event notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive alerts via email for critical and high priority events
                </div>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <div className="font-medium">SMS Alerts</div>
                <div className="text-sm text-muted-foreground">
                  Get instant SMS notifications for critical events
                </div>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <div className="font-medium">Dashboard Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Show real-time alerts in the platform dashboard
                </div>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Enabled
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
