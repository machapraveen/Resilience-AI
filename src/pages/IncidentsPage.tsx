
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Filter, ExternalLink } from 'lucide-react';
import { mockIncidents } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const IncidentsPage = () => {
  const PriorityIndicator = ({ priority }: { priority: number }) => {
    const getColorClass = () => {
      switch (priority) {
        case 1: return 'bg-risk-critical';
        case 2: return 'bg-risk-high';
        case 3: return 'bg-risk-medium';
        case 4:
        case 5: return 'bg-risk-low';
        default: return 'bg-gray-500';
      }
    };

    return (
      <div className={`h-4 w-4 rounded-full ${getColorClass()}`} title={`Priority ${priority}`}></div>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
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

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Incident Management</h1>
        <p className="text-muted-foreground">
          Track and manage incidents across your infrastructure
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input placeholder="Search incidents..." />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Number</th>
                  <th className="px-4 py-3 font-medium">Short Description</th>
                  <th className="px-4 py-3 font-medium">Server</th>
                  <th className="px-4 py-3 font-medium">Assignment Group</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <PriorityIndicator priority={incident.priority} />
                    </td>
                    <td className="px-4 py-3 font-medium text-servicenow-blue">
                      {incident.number}
                    </td>
                    <td className="px-4 py-3">
                      {incident.shortDescription}
                      {incident.autoRemediated && (
                        <Badge variant="outline" className="ml-2 bg-servicenow-blue text-white text-xs">
                          Auto-remediated
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {incident.serverName}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {incident.assignmentGroup}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {incident.createdAt.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/incidents/${incident.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {mockIncidents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                      No incidents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default IncidentsPage;
