
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Bell, Download, Check, AlertCircle, Server, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Mock notifications for demonstration
const mockNotifications = [
  {
    id: '1',
    type: 'alert',
    title: 'High CPU Usage Detected',
    description: 'Server AWS-EC2-01 is experiencing unusually high CPU usage (92%)',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    severity: 'high'
  },
  {
    id: '2',
    type: 'incident',
    title: 'Incident INC0010234 Created',
    description: 'An incident has been created for the network outage in US-East region',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    severity: 'critical'
  },
  {
    id: '3',
    type: 'change',
    title: 'Change Request Approved',
    description: 'Your change request CHG0002451 for server maintenance has been approved',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    severity: 'low'
  },
  {
    id: '4',
    type: 'security',
    title: 'Potential Security Vulnerability',
    description: 'A potential security vulnerability has been identified in AWS-EC2-03',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: false,
    severity: 'medium'
  },
  {
    id: '5',
    type: 'auto-remediation',
    title: 'Auto-Remediation Successful',
    description: 'ResilienceAI successfully remediated the memory leak in AWS-EC2-07',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    severity: 'info'
  }
];

const NotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  // Filter notifications based on search term and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || notification.severity === severityFilter;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-risk-critical" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-risk-high" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-risk-medium" />;
      case 'low':
        return <Check className="h-4 w-4 text-risk-low" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-risk-high" />;
      case 'incident':
        return <AlertCircle className="h-5 w-5 text-risk-critical" />;
      case 'change':
        return <Check className="h-5 w-5 text-blue-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-purple-500" />;
      case 'auto-remediation':
        return <Server className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage system notifications and alerts
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input 
            placeholder="Search notifications..." 
            value={searchTerm} 
            onChange={handleSearch}
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
            <SelectItem value="incident">Incidents</SelectItem>
            <SelectItem value="change">Changes</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="auto-remediation">Auto-Remediation</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="flex items-center gap-2" onClick={markAllAsRead}>
          <Check className="h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 border rounded-md ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          <Badge variant="outline" className={
                            notification.severity === 'critical' ? 'bg-risk-critical text-white' :
                            notification.severity === 'high' ? 'bg-risk-high text-white' :
                            notification.severity === 'medium' ? 'bg-risk-medium text-white' :
                            notification.severity === 'low' ? 'bg-risk-low text-white' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {notification.severity.charAt(0).toUpperCase() + notification.severity.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <div className="flex justify-end mt-3">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Bell className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                <p>No notifications found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default NotificationsPage;
