
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { mockServers } from '@/data/mockData';
import ServerStatusCard from '@/components/dashboard/ServerStatusCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Server } from '@/types';

const ServersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredServers, setFilteredServers] = useState<Server[]>(mockServers);

  useEffect(() => {
    let results = mockServers;
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      results = results.filter(server => 
        server.name.toLowerCase().includes(lowercaseSearchTerm) ||
        server.ipAddress.toLowerCase().includes(lowercaseSearchTerm) ||
        server.location.toLowerCase().includes(lowercaseSearchTerm) ||
        server.os?.toLowerCase().includes(lowercaseSearchTerm) ||
        server.assignmentGroup.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    
    // Filter by environment
    if (environmentFilter !== 'all') {
      results = results.filter(server => server.environment === environmentFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      results = results.filter(server => server.status === statusFilter);
    }
    
    setFilteredServers(results);
  }, [searchTerm, environmentFilter, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Server Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage all servers in your environment
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search servers..." 
            className="pl-8" 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Select 
          defaultValue="all" 
          value={environmentFilter}
          onValueChange={setEnvironmentFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          defaultValue="all"
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="auto-remediated">Auto-Remediated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredServers.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">No servers match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServers.map(server => (
            <ServerStatusCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ServersPage;
