/**
 * ESG Metric Card Component
 * 
 * Displays sustainability metrics with status indicators,
 * anomaly flags, and quick actions
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'normal' | 'warning' | 'anomaly' | 'compliant';
  description?: string;
  lastUpdated?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = 'normal',
  description,
  lastUpdated,
  onClick
}: MetricCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'compliant':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'warning':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'anomaly':
        return <Badge variant="destructive">Anomaly</Badge>;
      case 'compliant':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Compliant</Badge>;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-primary" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return null;
  };

  return (
    <Card 
      data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn(
        "hover-elevate transition-all duration-200",
        onClick && "cursor-pointer",
        status === 'anomaly' && "border-l-4 border-l-destructive",
        status === 'warning' && "border-l-4 border-l-warning"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="text-sm font-medium text-foreground" data-testid="text-metric-title">{title}</h3>
        </div>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-3xl font-semibold font-mono text-foreground" data-testid="text-metric-value">
            {value}
          </p>
          {unit && (
            <span className="text-sm text-muted-foreground" data-testid="text-metric-unit">{unit}</span>
          )}
        </div>
        
        {trend && trendValue && (
          <div className="flex items-center gap-1.5 mb-2" data-testid="metric-trend">
            {getTrendIcon()}
            <span className={cn(
              "text-xs font-medium",
              trend === 'up' ? "text-primary" : trend === 'down' ? "text-destructive" : "text-muted-foreground"
            )}>
              {trendValue}
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}

        {description && (
          <p className="text-xs text-muted-foreground mb-3" data-testid="text-metric-description">
            {description}
          </p>
        )}

        {lastUpdated && (
          <p className="text-xs text-muted-foreground" data-testid="text-metric-updated">
            Updated {lastUpdated}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
