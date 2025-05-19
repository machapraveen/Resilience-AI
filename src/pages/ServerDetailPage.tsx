
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockServers, mockIncidents, mockAuditLogs } from '@/data/mockData';
import CPUMetricsChart from '@/components/dashboard/CPUMetricsChart';
import AuditLogTable from '@/components/dashboard/AuditLogTable';
import IncidentList from '@/components/dashboard/IncidentList';
import { AlertCircle, Clock, Server as ServerIcon, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ServerDetailPage = () => {
  const { serverId } = useParams<{ serverId: string }>();
  
  // Find the server from mock data
  const server = mockServers.find(s => s.id === serverId);
  
  // Find incidents related to this server
  const relatedIncidents = mockIncidents.filter(i => i.serverId === serverId);
  
  // Find audit logs related to this server
  const relatedLogs = mockAuditLogs.filter(log => log.resourceId === serverId);
  
  if (!server) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-servicenow-blue mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Server not found</p>
            <p className="text-gray-500">The server you are looking for does not exist or has been moved.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{server.name}</h1>
          <p className="text-muted-foreground">
            {server.environment} | {server.location}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColorClass(server.status)} text-white`}>
            {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
          </Badge>
          
          <Badge variant="outline" className={server.riskScore >= 70 ? 'border-risk-high text-risk-high' : 
                                           server.riskScore >= 40 ? 'border-risk-medium text-risk-medium' : 
                                           'border-risk-low text-risk-low'}>
            <ShieldAlert className="h-3.5 w-3.5 mr-1" />
            Risk Score: {server.riskScore}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CPU Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ServerIcon className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-2xl font-bold">
                {server.cpuMetrics[server.cpuMetrics.length - 1].value}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-risk-high mr-2" />
              <span className="text-2xl font-bold">{relatedIncidents.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Audited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-sm">
                {relatedLogs.length > 0 
                  ? new Date(Math.max(...relatedLogs.map(log => log.timestamp.getTime())))
                      .toLocaleDateString() + ' ' + 
                    new Date(Math.max(...relatedLogs.map(log => log.timestamp.getTime())))
                      .toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                  : 'Never'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">IP Address</p>
                <p>{server.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                <p>{server.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Environment</p>
                <p>{server.environment}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Operating System</p>
                <p>{server.os}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Last Booted</p>
                <p>{server.lastBooted.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Assignment Group</p>
                <p>{server.assignmentGroup}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="metrics" className="mb-6">
        <TabsList>
          <TabsTrigger value="metrics">CPU Metrics</TabsTrigger>
          <TabsTrigger value="incidents">Related Incidents</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="mt-4">
          <CPUMetricsChart 
            metrics={server.cpuMetrics} 
            serverId={server.id} 
            serverName={server.name}
          />
        </TabsContent>
        
        <TabsContent value="incidents" className="mt-4">
          {relatedIncidents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No incidents found for this server.
              </CardContent>
            </Card>
          ) : (
            <IncidentList incidents={relatedIncidents} />
          )}
        </TabsContent>
        
        <TabsContent value="audit" className="mt-4">
          {relatedLogs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No audit logs found for this server.
              </CardContent>
            </Card>
          ) : (
            <AuditLogTable logs={relatedLogs} />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ServerDetailPage;
