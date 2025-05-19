
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Incident } from '@/types';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, ArrowUpRight } from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
}

const IncidentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'new':
        return { className: 'bg-risk-high hover:bg-risk-high', label: 'New' };
      case 'in_progress':
        return { className: 'bg-risk-medium hover:bg-risk-medium', label: 'In Progress' };
      case 'resolved':
        return { className: 'bg-risk-low hover:bg-risk-low', label: 'Resolved' };
      case 'closed':
        return { className: 'bg-gray-500 hover:bg-gray-600', label: 'Closed' };
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

const PriorityIndicator: React.FC<{ priority: number }> = ({ priority }) => {
  const getColorClass = () => {
    switch (priority) {
      case 1: return 'text-risk-critical';
      case 2: return 'text-risk-high';
      case 3: return 'text-risk-medium';
      case 4:
      case 5: return 'text-risk-low';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`flex items-center gap-1 ${getColorClass()}`}>
      <AlertCircle className="h-3 w-3" />
      <span className="text-xs font-medium">P{priority}</span>
    </div>
  );
};

const IncidentList: React.FC<IncidentListProps> = ({ incidents }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Active Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No active incidents
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div 
                key={incident.id} 
                className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <Link 
                      to={`/incidents/${incident.id}`} 
                      className="text-sm font-medium text-servicenow-blue hover:underline flex items-center"
                    >
                      {incident.number}: {incident.shortDescription}
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Server: {incident.serverName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityIndicator priority={incident.priority} />
                    <IncidentStatusBadge status={incident.status} />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {incident.assignmentGroup}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {incident.createdAt.toLocaleTimeString()}
                    {incident.autoRemediated && (
                      <Badge variant="outline" className="ml-2 bg-servicenow-blue text-white text-xs">
                        Auto-remediated
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentList;
