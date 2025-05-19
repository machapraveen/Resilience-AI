
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, Server as ServerIcon, Cpu, Activity, Shield } from 'lucide-react';
import { mockServers, mockIncidents, mockAuditLogs, mockChangeRequests } from '@/data/mockData';
import ServerStatusCard from '@/components/dashboard/ServerStatusCard';
import IncidentList from '@/components/dashboard/IncidentList';
import AuditLogTable from '@/components/dashboard/AuditLogTable';
import CPUMetricsChart from '@/components/dashboard/CPUMetricsChart';
import RiskHeatmap from '@/components/dashboard/RiskHeatmap';

const Dashboard = () => {
  // Get the server with the highest risk score
  const highestRiskServer = [...mockServers].sort((a, b) => b.riskScore - a.riskScore)[0];
  
  // Get servers with predicted CPU spikes
  const serversWithPredictedSpikes = mockServers.filter(server => 
    server.cpuMetrics.some(metric => metric.predicted && metric.value > 85)
  );

  const simulateRemediation = () => {
    toast({
      title: 'Auto-remediation initiated',
      description: `The ResilienceAI system has initiated auto-remediation for server ${highestRiskServer.name}.`,
      variant: 'default',
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">ResilienceAI Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and remediation of system performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monitored Servers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ServerIcon className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-2xl font-bold">{mockServers.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-risk-high mr-2" />
              <span className="text-2xl font-bold">{mockIncidents.filter(i => i.status !== 'closed').length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Predictions & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-risk-medium mr-2" />
              <span className="text-2xl font-bold">{serversWithPredictedSpikes.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {serversWithPredictedSpikes.length > 0 && (
        <div className="mb-6 p-4 border border-risk-high rounded-md bg-red-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-risk-high mr-2" />
              <div>
                <h2 className="font-medium">Critical Alert: CPU Spike Predicted</h2>
                <p className="text-sm text-muted-foreground">
                  ML model has predicted CPU utilization to exceed 85% on {serversWithPredictedSpikes[0].name} within the next 5 minutes
                </p>
              </div>
            </div>
            <Button onClick={simulateRemediation} className="bg-servicenow-blue hover:bg-servicenow-blue/90">
              Initiate Auto-Remediation
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="servers" className="mb-6">
        <TabsList>
          <TabsTrigger value="servers" className="flex items-center gap-1">
            <ServerIcon className="h-4 w-4" />
            Servers
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            CPU Metrics
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="servers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockServers.map(server => (
              <ServerStatusCard key={server.id} server={server} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          {highestRiskServer && (
            <div className="space-y-6">
              <CPUMetricsChart 
                metrics={highestRiskServer.cpuMetrics} 
                serverId={highestRiskServer.id} 
                serverName={highestRiskServer.name}
              />
              {serversWithPredictedSpikes.length > 0 && serversWithPredictedSpikes[0].id !== highestRiskServer.id && (
                <CPUMetricsChart 
                  metrics={serversWithPredictedSpikes[0].cpuMetrics}
                  serverId={serversWithPredictedSpikes[0].id}
                  serverName={serversWithPredictedSpikes[0].name}
                />
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="risk" className="mt-4">
          <RiskHeatmap servers={mockServers} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentList incidents={mockIncidents} />
        <AuditLogTable logs={mockAuditLogs.slice(0, 5)} />
      </div>
    </Layout>
  );
};

export default Dashboard;
