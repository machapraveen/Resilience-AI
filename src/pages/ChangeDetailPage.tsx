
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockChangeRequests, mockAuditLogs } from '@/data/mockData';
import AuditLogTable from '@/components/dashboard/AuditLogTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Calendar, Clock, FileStack, LinkIcon } from 'lucide-react';

const ChangeDetailPage = () => {
  const { changeId } = useParams<{ changeId: string }>();
  
  // Find the change from mock data
  const change = mockChangeRequests.find(c => c.id === changeId);
  
  // Find audit logs related to this change
  const relatedLogs = mockAuditLogs.filter(log => log.resourceId === changeId);
  
  if (!change) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-servicenow-blue mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Change request not found</p>
            <p className="text-gray-500">The change request you are looking for does not exist or has been moved.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const RiskBadge = ({ risk }: { risk: string }) => {
    const getRiskProps = () => {
      switch (risk) {
        case 'low':
          return { className: 'bg-risk-low hover:bg-risk-low', label: 'Low' };
        case 'medium':
          return { className: 'bg-risk-medium hover:bg-risk-medium', label: 'Medium' };
        case 'high':
          return { className: 'bg-risk-high hover:bg-risk-high', label: 'High' };
        case 'critical':
          return { className: 'bg-risk-critical hover:bg-risk-critical', label: 'Critical' };
        default:
          return { className: 'bg-gray-500 hover:bg-gray-600', label: risk };
      }
    };

    const { className, label } = getRiskProps();

    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusProps = () => {
      switch (status) {
        case 'draft':
          return { className: 'bg-gray-400 hover:bg-gray-500', label: 'Draft' };
        case 'assess':
          return { className: 'bg-blue-400 hover:bg-blue-500', label: 'Assess' };
        case 'approve':
          return { className: 'bg-risk-medium hover:bg-amber-500', label: 'Approve' };
        case 'implement':
          return { className: 'bg-purple-500 hover:bg-purple-600', label: 'Implement' };
        case 'review':
          return { className: 'bg-indigo-500 hover:bg-indigo-600', label: 'Review' };
        case 'closed':
          return { className: 'bg-risk-low hover:bg-green-600', label: 'Closed' };
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

  const TypeBadge = ({ type }: { type: string }) => {
    const getTypeProps = () => {
      switch (type) {
        case 'normal':
          return { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Normal' };
        case 'standard':
          return { className: 'bg-green-100 text-green-800 border-green-200', label: 'Standard' };
        case 'emergency':
          return { className: 'bg-red-100 text-red-800 border-red-200', label: 'Emergency' };
        default:
          return { className: 'bg-gray-100 text-gray-800 border-gray-200', label: type };
      }
    };

    const { className, label } = getTypeProps();

    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link 
          to="/changes" 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Changes
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{change.number}: {change.shortDescription}</h1>
            <p className="text-muted-foreground">
              {change.serverName} | {change.assignmentGroup}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <TypeBadge type={change.type} />
            <RiskBadge risk={change.risk} />
            <StatusBadge status={change.status} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-sm">
                {change.createdAt.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Planned Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-sm">
                {change.plannedStart ? change.plannedStart.toLocaleString() : 'Not scheduled'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Related Incident
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-risk-high mr-2" />
              {change.relatedIncidentId ? (
                <Link 
                  to={`/incidents/${change.relatedIncidentId}`} 
                  className="text-sm text-servicenow-blue hover:underline flex items-center"
                >
                  View related incident
                  <LinkIcon className="h-3 w-3 ml-1" />
                </Link>
              ) : (
                <span className="text-sm">No related incident</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 mb-6 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{change.description}</p>
            </div>
            
            {change.summary && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Summary</p>
                <p className="text-sm">{change.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="audit" className="mb-6">
        <TabsList>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="audit" className="mt-4">
          {relatedLogs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No audit logs found for this change request.
              </CardContent>
            </Card>
          ) : (
            <AuditLogTable logs={relatedLogs} />
          )}
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="py-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-servicenow-blue"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Change created</p>
                    <p className="text-xs text-muted-foreground">{change.createdAt.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-servicenow-blue"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Submitted for approval</p>
                    <p className="text-xs text-muted-foreground">{change.updatedAt.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending approval</p>
                    <p className="text-xs text-muted-foreground">Waiting for Security Operations</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">Reject</Button>
        <Button>Approve</Button>
      </div>
    </Layout>
  );
};

export default ChangeDetailPage;
