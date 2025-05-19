
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Filter, ExternalLink } from 'lucide-react';
import { mockIncidents } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Incident } from '@/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const IncidentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoRemediatedFilter, setAutoRemediatedFilter] = useState<string>('all');
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(mockIncidents);

  useEffect(() => {
    let results = mockIncidents;
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      results = results.filter(incident => 
        incident.number.toLowerCase().includes(lowercaseSearchTerm) ||
        incident.shortDescription.toLowerCase().includes(lowercaseSearchTerm) ||
        incident.serverName.toLowerCase().includes(lowercaseSearchTerm) ||
        incident.assignmentGroup.toLowerCase().includes(lowercaseSearchTerm) ||
        incident.description.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    
    // Filter by priority
    if (priorityFilter !== 'all') {
      results = results.filter(incident => incident.priority.toString() === priorityFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      results = results.filter(incident => incident.status === statusFilter);
    }
    
    // Filter by auto-remediated
    if (autoRemediatedFilter !== 'all') {
      const isAutoRemediated = autoRemediatedFilter === 'true';
      results = results.filter(incident => incident.autoRemediated === isAutoRemediated);
    }
    
    setFilteredIncidents(results);
  }, [searchTerm, priorityFilter, statusFilter, autoRemediatedFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setStatusFilter('all');
    setAutoRemediatedFilter('all');
  };

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
          <Input 
            placeholder="Search incidents..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Incidents</h4>
              
              <div className="space-y-2">
                <label htmlFor="priority-filter" className="text-sm">Priority</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger id="priority-filter">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="1">Priority 1 - Critical</SelectItem>
                    <SelectItem value="2">Priority 2 - High</SelectItem>
                    <SelectItem value="3">Priority 3 - Medium</SelectItem>
                    <SelectItem value="4">Priority 4 - Low</SelectItem>
                    <SelectItem value="5">Priority 5 - Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status-filter" className="text-sm">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="remediated-filter" className="text-sm">Auto-remediated</label>
                <Select value={autoRemediatedFilter} onValueChange={setAutoRemediatedFilter}>
                  <SelectTrigger id="remediated-filter">
                    <SelectValue placeholder="Auto-remediated" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Auto-remediated</SelectItem>
                    <SelectItem value="false">Manual resolution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
                {filteredIncidents.map((incident) => (
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
                {filteredIncidents.length === 0 && (
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
