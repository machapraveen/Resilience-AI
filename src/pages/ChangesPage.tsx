
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Filter } from 'lucide-react';
import { mockChangeRequests } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChangeRequest } from '@/types';
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

const ChangesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredChanges, setFilteredChanges] = useState<ChangeRequest[]>(mockChangeRequests);

  useEffect(() => {
    let results = mockChangeRequests;
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      results = results.filter(change => 
        change.number.toLowerCase().includes(lowercaseSearchTerm) ||
        change.shortDescription.toLowerCase().includes(lowercaseSearchTerm) ||
        change.serverName.toLowerCase().includes(lowercaseSearchTerm) ||
        change.assignmentGroup.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      results = results.filter(change => change.type === typeFilter);
    }
    
    // Filter by risk
    if (riskFilter !== 'all') {
      results = results.filter(change => change.risk === riskFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      results = results.filter(change => change.status === statusFilter);
    }
    
    setFilteredChanges(results);
  }, [searchTerm, typeFilter, riskFilter, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setRiskFilter('all');
    setStatusFilter('all');
  };

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
        <h1 className="text-2xl font-bold mb-2">Change Management</h1>
        <p className="text-muted-foreground">
          Track and manage change requests generated by the system
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input 
            placeholder="Search changes..." 
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
              <h4 className="font-medium">Filter Changes</h4>
              
              <div className="space-y-2">
                <label htmlFor="type-filter" className="text-sm">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="risk-filter" className="text-sm">Risk</label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger id="risk-filter">
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="assess">Assess</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="implement">Implement</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
          <CardTitle className="text-lg">Change Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Number</th>
                  <th className="px-4 py-3 font-medium">Short Description</th>
                  <th className="px-4 py-3 font-medium">Server</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Risk</th>
                  <th className="px-4 py-3 font-medium">Assignment Group</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredChanges.map((change) => (
                  <tr key={change.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-servicenow-blue">
                      {change.number}
                    </td>
                    <td className="px-4 py-3">
                      {change.shortDescription}
                    </td>
                    <td className="px-4 py-3">
                      {change.serverName}
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={change.type} />
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge risk={change.risk} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {change.assignmentGroup}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {change.createdAt.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={change.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/changes/${change.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredChanges.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                      No change requests found
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

export default ChangesPage;
