
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Server as ServerIcon, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Server } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { getRiskLevel } from '@/data/mockData';

interface ServerStatusCardProps {
  server: Server;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'online':
        return { className: 'bg-risk-low hover:bg-risk-low', label: 'Online' };
      case 'offline':
        return { className: 'bg-risk-high hover:bg-risk-high', label: 'Offline' };
      case 'maintenance':
        return { className: 'bg-risk-medium hover:bg-risk-medium', label: 'Maintenance' };
      case 'auto-remediated':
        return { className: 'bg-risk-medium hover:bg-risk-medium', label: 'Auto-remediated' };
      default:
        return { className: 'bg-gray-500 hover:bg-gray-600', label: status };
    }
  };

  const { className, label } = getStatusProps();

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

const RiskIndicator: React.FC<{ score: number }> = ({ score }) => {
  const riskLevel = getRiskLevel(score);
  const getColorClass = () => {
    switch (riskLevel) {
      case 'low': return 'text-risk-low';
      case 'medium': return 'text-risk-medium';
      case 'high': return 'text-risk-high';
      case 'critical': return 'text-risk-critical';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AlertCircle className={`h-4 w-4 ${getColorClass()}`} />
      <span className={`text-sm font-medium ${getColorClass()}`}>
        Risk: {score} ({riskLevel})
      </span>
    </div>
  );
};

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({ server }) => {
  // Get the latest CPU metric
  const latestMetric = server.cpuMetrics.length > 0 
    ? server.cpuMetrics.reduce((latest, current) => 
        current.timestamp > latest.timestamp ? current : latest
      )
    : null;
  
  // Get the latest predicted metric
  const latestPrediction = server.cpuMetrics
    .filter(metric => metric.predicted)
    .reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    , { timestamp: new Date(0), value: 0, predicted: true });

  // Check if there's a prediction above 85% CPU
  const hasCriticalPrediction = server.cpuMetrics
    .some(metric => metric.predicted && metric.value > 85);

  return (
    <Card className={hasCriticalPrediction ? "border-risk-high" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <ServerIcon className="h-5 w-5 text-servicenow-blue" />
            {server.name}
          </CardTitle>
          <StatusBadge status={server.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="text-sm text-gray-600">
            <p><span className="font-medium">IP:</span> {server.ip}</p>
            <p><span className="font-medium">Environment:</span> {server.environment}</p>
            <p><span className="font-medium">Group:</span> {server.assignmentGroup}</p>
          </div>
          <div className="flex flex-col gap-2">
            {latestMetric && (
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-servicenow-blue" />
                <span className="text-sm">
                  Current CPU: <span className="font-medium">{latestMetric.value.toFixed(1)}%</span>
                </span>
              </div>
            )}
            {latestPrediction && latestPrediction.value > 0 && (
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-risk-high" />
                <span className="text-sm">
                  Predicted CPU: <span className="font-medium">{latestPrediction.value.toFixed(1)}%</span>
                </span>
              </div>
            )}
            <RiskIndicator score={server.riskScore} />
          </div>
        </div>
        {hasCriticalPrediction && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-xs text-risk-high flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Critical CPU spike predicted in the next 5 minutes!
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Updated: {server.lastUpdated.toLocaleTimeString()}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/servers/${server.id}`}>
            Details
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServerStatusCard;
