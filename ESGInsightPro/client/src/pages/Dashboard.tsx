/**
 * ESG Dashboard Page
 * 
 * Main dashboard showing sustainability metrics, emissions tracking,
 * and anomaly detection with embedded chat widget
 */

import { useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { ChatWidget } from '@/components/ChatWidget';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  TrendingDown, 
  AlertTriangle, 
  Factory,
  FileText,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { UserRole, PageType } from '@shared/schema';
import type { UserRoleType } from '@shared/schema';

export default function Dashboard() {
  const [userRole] = useState<UserRoleType>(UserRole.ANALYST);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Sample ESG data for demo
  const metrics = [
    {
      title: 'Total Scope 1 Emissions',
      value: '8,900',
      unit: 'tCO₂e',
      trend: 'up' as const,
      trendValue: '+642%',
      status: 'anomaly' as const,
      description: 'Statistical outlier detected - 6.8σ above historical mean',
      lastUpdated: '2 hours ago'
    },
    {
      title: 'Scope 2 Emissions',
      value: '4,230',
      unit: 'tCO₂e',
      trend: 'down' as const,
      trendValue: '-12%',
      status: 'normal' as const,
      description: 'Market-based calculation with renewable energy credits',
      lastUpdated: '5 hours ago'
    },
    {
      title: 'Data Quality Score',
      value: '87.3',
      unit: '%',
      trend: 'up' as const,
      trendValue: '+5.2%',
      status: 'compliant' as const,
      description: 'Based on completeness, accuracy, and timeliness',
      lastUpdated: '1 hour ago'
    },
    {
      title: 'Water Consumption',
      value: '12,450',
      unit: 'm³',
      trend: 'stable' as const,
      trendValue: '+2%',
      status: 'warning' as const,
      description: 'Approaching target threshold for Q4',
      lastUpdated: '3 hours ago'
    }
  ];

  const recentAlerts = [
    {
      id: '1',
      severity: 'high',
      message: 'Anomalous emission record detected in Dubai facility',
      timestamp: '2 hours ago',
      metricId: 'metric-abc123'
    },
    {
      id: '2',
      severity: 'medium',
      message: 'Data validation pending for Q3 supplier submissions',
      timestamp: '5 hours ago',
      metricId: 'metric-def456'
    },
    {
      id: '3',
      severity: 'low',
      message: 'CSRD reporting deadline in 14 days',
      timestamp: '1 day ago',
      metricId: null
    }
  ];

  const facilities = [
    { name: 'Dubai HQ', emissions: '8,900 tCO₂e', status: 'anomaly' },
    { name: 'Abu Dhabi Plant', emissions: '3,200 tCO₂e', status: 'normal' },
    { name: 'Sharjah Warehouse', emissions: '1,450 tCO₂e', status: 'normal' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground" data-testid="text-app-title">
                  Sweep ESG Platform
                </h1>
                <p className="text-xs text-muted-foreground">Sustainability Reporting Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1.5" data-testid="badge-user-info">
                <Users className="h-3 w-3" />
                {userRole.replace('_', ' ')}
              </Badge>
              <ThemeToggle />
              <Button variant="outline" size="sm" data-testid="button-refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="text-section-overview">
            Emissions Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <MetricCard
                key={idx}
                {...metric}
                onClick={() => setSelectedMetric(metric.title)}
              />
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <Card className="lg:col-span-2" data-testid="card-recent-alerts">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Recent Alerts & Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    data-testid={`alert-${alert.id}`}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' 
                        ? 'border-l-destructive bg-destructive/5' 
                        : alert.severity === 'medium'
                        ? 'border-l-warning bg-warning/5'
                        : 'border-l-muted bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      </div>
                      <Badge 
                        variant={
                          alert.severity === 'high' ? 'destructive' : 
                          alert.severity === 'medium' ? 'secondary' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facility Breakdown */}
          <Card data-testid="card-facilities">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    data-testid={`facility-${idx}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{facility.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{facility.emissions}</p>
                    </div>
                    {facility.status === 'anomaly' && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 justify-start gap-3"
            data-testid="button-action-report"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium text-sm">Generate CSRD Report</p>
              <p className="text-xs text-muted-foreground">Compliance deadline: 14 days</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 justify-start gap-3"
            data-testid="button-action-data"
          >
            <TrendingDown className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium text-sm">Upload Emissions Data</p>
              <p className="text-xs text-muted-foreground">Import from Excel or CSV</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 justify-start gap-3"
            data-testid="button-action-analytics"
          >
            <BarChart3 className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium text-sm">View Analytics</p>
              <p className="text-xs text-muted-foreground">Detailed insights & trends</p>
            </div>
          </Button>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget
        userRole={userRole}
        userId="user-123"
        organizationName="Acme Sustainability Corp"
        currentPage="/dashboard"
        pageType={PageType.DASHBOARD}
      />
    </div>
  );
}
