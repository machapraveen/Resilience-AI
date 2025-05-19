
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Download, AlertCircle } from 'lucide-react';
import { mockAuditLogs } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRiskLevel } from '@/data/mockData';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { AuditLog } from '@/types';

const AuditPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [serverFilter, setServerFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [filteredLogs, setFilteredLogs] = useState(mockAuditLogs);
  const [uniqueServers, setUniqueServers] = useState<string[]>([]);
  const [uniqueActions, setUniqueActions] = useState<string[]>([]);
  
  useEffect(() => {
    // Get unique server names and actions
    const servers = Array.from(new Set(mockAuditLogs.map(log => log.serverName)));
    const actions = Array.from(new Set(mockAuditLogs.map(log => log.action)));
    
    setUniqueServers(servers);
    setUniqueActions(actions);
    
    filterLogs();
  }, [searchTerm, actionFilter, serverFilter, dateFilter]);
  
  const filterLogs = () => {
    let results = [...mockAuditLogs];
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(log => 
        log.serverName.toLowerCase().includes(lowercasedSearch) ||
        log.action.toLowerCase().includes(lowercasedSearch) ||
        log.actor.toLowerCase().includes(lowercasedSearch) ||
        log.outcome.toLowerCase().includes(lowercasedSearch) ||
        log.details.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Filter by action
    if (actionFilter !== 'all') {
      results = results.filter(log => log.action === actionFilter);
    }
    
    // Filter by server
    if (serverFilter !== 'all') {
      results = results.filter(log => log.serverName === serverFilter);
    }
    
    // Filter by date
    const now = new Date();
    if (dateFilter === 'today') {
      results = results.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'this_week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      results = results.filter(log => log.timestamp >= weekAgo);
    } else if (dateFilter === 'this_month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      results = results.filter(log => log.timestamp >= monthAgo);
    }
    
    setFilteredLogs(results);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    // In a real app, you'd generate a CSV or JSON file here
    toast.success('Audit logs exported successfully');
  };

  const handleReset = () => {
    setSearchTerm('');
    setActionFilter('all');
    setServerFilter('all');
    setDateFilter('all');
  };

  const RiskIndicator = ({ score }: { score: number }) => {
    const riskLevel = getRiskLevel(score);
    const getColorClass = () => {
      switch (riskLevel) {
        case 'low': return 'bg-risk-low';
        case 'medium': return 'bg-risk-medium';
        case 'high': return 'bg-risk-high';
        case 'critical': return 'bg-risk-critical';
        default: return 'bg-gray-500';
      }
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getColorClass()}`}>
        {score}
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">
          Complete audit trail of all system actions and automated remediation
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input 
            placeholder="Search audit logs..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map(action => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Audit Logs</h4>
              
              <div className="space-y-2">
                <Label htmlFor="server-filter">Server</Label>
                <Select value={serverFilter} onValueChange={setServerFilter}>
                  <SelectTrigger id="server-filter">
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Servers</SelectItem>
                    {uniqueServers.map(server => (
                      <SelectItem key={server} value={server}>{server}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-filter">Time Period</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger id="date-filter">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
                <Button size="sm" onClick={filterLogs}>Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Server</th>
                  <th className="px-4 py-3 font-medium">Risk Score</th>
                  <th className="px-4 py-3 font-medium">Outcome</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {log.timestamp.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {log.action}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-servicenow-blue">{log.actor}</span>
                    </td>
                    <td className="px-4 py-3">
                      {log.serverName}
                    </td>
                    <td className="px-4 py-3">
                      <RiskIndicator score={log.riskScore} />
                    </td>
                    <td className="px-4 py-3">
                      {log.outcome}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                      No audit logs found
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

export default AuditPage;
