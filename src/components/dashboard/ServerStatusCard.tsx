
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server } from '@/types';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface ServerStatusCardProps {
  server: Server;
}

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({ server }) => {
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getLatestCpuValue = () => {
    if (!server.cpuMetrics || server.cpuMetrics.length === 0) return 'N/A';
    return server.cpuMetrics[server.cpuMetrics.length - 1].value + '%';
  };

  const hasPredictedSpike = server.cpuMetrics && 
    server.cpuMetrics.some(metric => metric.predicted && metric.value > 85);

  return (
    <Card className={`${hasPredictedSpike ? 'border-risk-high' : ''} hover:bg-gray-50 transition-colors`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link 
            to={`/servers/${server.id}`} 
            className="flex items-center gap-1 text-servicenow-blue hover:underline"
          >
            <CardTitle className="text-base">
              {server.name}
            </CardTitle>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <Badge className={`${getStatusColorClass(server.status)}`}>
            {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {server.environment} | {server.location}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div>
            <p className="text-muted-foreground">IP Address</p>
            <p className="font-medium">{server.ipAddress || server.ip}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CPU</p>
            <div className="flex items-center font-medium">
              {getLatestCpuValue()}
              {hasPredictedSpike && (
                <AlertCircle className="h-3 w-3 text-risk-high ml-1" />
              )}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">OS</p>
            <p className="font-medium">{server.os || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Risk Score</p>
            <div className={`flex items-center gap-1 font-medium ${
              server.riskScore >= 70 ? 'text-risk-high' : 
              server.riskScore >= 40 ? 'text-risk-medium' : 'text-risk-low'
            }`}>
              <ShieldAlert className="h-3 w-3" />
              {server.riskScore}
            </div>
          </div>
        </div>
        {server.statusMessage && (
          <div className="border-t pt-2 text-xs text-muted-foreground">
            {server.statusMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerStatusCard;
