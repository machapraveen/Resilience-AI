
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockIncidents, mockServers, mockAuditLogs, mockChangeRequests } from '@/data/mockData';
import AuditLogTable from '@/components/dashboard/AuditLogTable';
import { AlertCircle, CheckCircle, Clock, Server, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const IncidentDetailPage = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  
  // Find the incident from mock data
  const incident = mockIncidents.find(inc => inc.id === incidentId);
  
  // Find related server
  const relatedServer = mockServers.find(s => s.id === incident?.serverId);
  
  // Find related audit logs
  const relatedLogs = mockAuditLogs.filter(log => 
    log.resourceId === incidentId || 
    (incident && log.resourceId === incident.serverId)
  );

  // Find related change requests
  const relatedChanges = mockChangeRequests.filter(change => 
    change.relatedIncidentId === incidentId
  );
  
  if (!incident) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-servicenow-blue mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Incident not found</p>
            <p className="text-gray-500">The incident you are looking for does not exist or has been moved.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-risk-high">New</Badge>;
      case 'in_progress':
        return <Badge className="bg-risk-medium">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-risk-low">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-500 text-white">Closed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: number) => {
    const color = priority === 1 ? 'text-risk-critical' :
                 priority === 2 ? 'text-risk-high' :
                 priority === 3 ? 'text-risk-medium' : 'text-risk-low';
                 
    return (
      <div className={`flex items-center ${color}`}>
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>P{priority}</span>
      </div>
    );
  };
  
  const handleResolve = () => {
    toast({
      title: 'Incident resolved',
      description: `Incident ${incident.number} has been marked as resolved.`,
    });
  };
  
  const handleClose = () => {
    toast({
      title: 'Incident closed',
      description: `Incident ${incident.number} has been closed.`,
    });
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {incident.number}: {incident.shortDescription}
          </h1>
          <p className="text-muted-foreground">
            Opened {incident.createdAt.toLocaleDateString()} at {incident.createdAt.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {getStatusBadge(incident.status)}
          {getPriorityBadge(incident.priority)}
          {incident.autoRemediated && (
            <Badge className="bg-servicenow-blue">Auto-Remediated</Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assignment Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-sm font-semibold">{incident.assignmentGroup}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Affected Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Server className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-sm font-semibold">{incident.serverName}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-sm">
                {incident.updatedAt ? incident.updatedAt.toLocaleString() : 'Not updated'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-sm">{incident.description}</p>
            </div>
            
            {relatedServer && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Affected Configuration Item</h3>
                <div className="flex items-center">
                  <Server className="h-4 w-4 text-servicenow-blue mr-2" />
                  <span>{relatedServer.name} ({relatedServer.environment})</span>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Resolution Notes</h3>
              <p className="text-sm">
                {incident.resolutionNotes || 'No resolution notes available'}
              </p>
            </div>
            
            {incident.status !== 'closed' && incident.status !== 'resolved' && (
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={handleResolve}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve Incident
                </Button>
                <Button onClick={handleClose}>
                  Close Incident
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="timeline" className="mb-6">
        <TabsList>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
          <TabsTrigger value="changes">Related Changes</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                {/* Incident created */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-servicenow-blue flex items-center justify-center text-white">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Incident Created</p>
                    <p className="text-sm text-muted-foreground">
                      {incident.createdAt.toLocaleString()}
                    </p>
                    <p className="text-sm mt-1">
                      {incident.number} was created with priority P{incident.priority}
                    </p>
                  </div>
                </div>
                
                {/* Auto-remediated if applicable */}
                {incident.autoRemediated && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-servicenow-blue flex items-center justify-center text-white">
                        <Server className="h-5 w-5" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Auto-Remediation Applied</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(incident.createdAt.getTime() + 120000).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">
                        ResilienceAI automatically applied remediation to {incident.serverName}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Status updates */}
                {incident.status !== 'new' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-servicenow-blue flex items-center justify-center text-white">
                        <Clock className="h-5 w-5" />
                      </div>
                      {incident.status !== 'closed' && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Status Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {incident.updatedAt ? incident.updatedAt.toLocaleString() : new Date(incident.createdAt.getTime() + 300000).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">
                        Status changed to {incident.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="changes" className="mt-4">
          {relatedChanges.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No change requests associated with this incident
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-4">
                <div className="space-y-4">
                  {relatedChanges.map(change => (
                    <div key={change.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{change.number}: {change.summary}</h3>
                          <p className="text-sm text-muted-foreground">
                            {change.type} • {change.status}
                          </p>
                        </div>
                        <Badge className={
                          change.risk === 'high' ? 'bg-risk-high' : 
                          change.risk === 'medium' ? 'bg-risk-medium' : 
                          'bg-risk-low'
                        }>
                          {change.risk.toUpperCase()} Risk
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{change.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-muted-foreground">
                          Assigned to: {change.assignmentGroup}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Planned: {change.plannedStart.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="audit" className="mt-4">
          {relatedLogs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No audit logs found for this incident
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

export default IncidentDetailPage;
