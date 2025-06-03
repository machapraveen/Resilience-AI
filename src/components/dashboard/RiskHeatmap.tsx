
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server } from '@/types';
import { getRiskLevel } from '@/data/mockData';

interface RiskHeatmapProps {
  servers: Server[];
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ servers }) => {
  // Group servers by risk level
  const serversByRisk = servers.reduce(
    (acc, server) => {
      const riskLevel = getRiskLevel(server.riskScore);
      acc[riskLevel].push(server);
      return acc;
    },
    { low: [], medium: [], high: [], critical: [] } as Record<string, Server[]>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Risk Assessment Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {['critical', 'high', 'medium', 'low'].map((level) => {
            const riskServers = serversByRisk[level as keyof typeof serversByRisk];
            if (riskServers.length === 0) return null;
            
            return (
              <div key={level} className="space-y-2">
                <h3 className="text-sm font-medium capitalize">{level} Risk ({riskServers.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {riskServers.map(server => (
                    <div 
                      key={server.id}
                      className={`
                        p-2 rounded-md border text-white text-sm
                        ${level === 'critical' ? 'bg-risk-critical' : ''}
                        ${level === 'high' ? 'bg-risk-high' : ''}
                        ${level === 'medium' ? 'bg-risk-medium' : ''}
                        ${level === 'low' ? 'bg-risk-low' : ''}
                      `}
                    >
                      <div className="font-medium">{server.name}</div>
                      <div className="text-xs opacity-90">Score: {server.riskScore}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {Object.values(serversByRisk).every(servers => servers.length === 0) && (
            <div className="text-center py-6 text-muted-foreground">
              No servers found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskHeatmap;
