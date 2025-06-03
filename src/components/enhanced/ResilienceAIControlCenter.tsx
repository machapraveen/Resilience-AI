
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Server, 
  AlertTriangle, 
  Activity, 
  Shield, 
  PlayCircle, 
  PauseCircle,
  Zap,
  Brain,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';

// Mock ServiceNow integration data
const initialState = {
  servers: [
    {
      id: 'srv-001',
      name: 'prod-web-01',
      status: 'online',
      cpuUsage: 42,
      riskScore: 25,
      lastChecked: new Date(),
      environment: 'production'
    },
    {
      id: 'srv-002', 
      name: 'prod-db-01',
      status: 'warning',
      cpuUsage: 89,
      riskScore: 85,
      lastChecked: new Date(),
      environment: 'production',
      prediction: { value: 94, confidence: 0.92 }
    },
    {
      id: 'srv-003',
      name: 'prod-cache-01', 
      status: 'auto-remediated',
      cpuUsage: 34,
      riskScore: 60,
      lastChecked: new Date(),
      environment: 'production'
    }
  ],
  aiAgents: [
    {
      id: 'resai_AutoRemediateBot',
      name: 'Auto Remediate Bot',
      status: 'active',
      lastAction: 'CPU remediation on prod-db-01',
      actionsToday: 12,
      successRate: 94.2
    },
    {
      id: 'resai_RiskAssessmentBot',
      name: 'Risk Assessment Bot', 
      status: 'active',
      lastAction: 'Change request CHG0010055 created',
      actionsToday: 8,
      successRate: 98.1
    }
  ],
  realtimeEvents: [],
  systemHealth: {
    overall: 87,
    incidents: 2,
    predictions: 3,
    automations: 95
  }
};

const ResilienceAIControlCenter = () => {
  const [state, setState] = useState(initialState);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [selectedServer, setSelectedServer] = useState(null);
  const [agentActivity, setAgentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Simulate real-time events from ServiceNow
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      // Simulate CPU spikes and AI agent responses
      const eventTypes = ['cpu_spike', 'remediation_completed', 'risk_assessment', 'prediction_update'];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const newEvent = generateRealtimeEvent(eventType);
      
      setState(prev => ({
        ...prev,
        realtimeEvents: [newEvent, ...prev.realtimeEvents.slice(0, 19)] // Keep last 20 events
      }));

      // Update agent activity
      if (newEvent.type === 'cpu_spike' || newEvent.type === 'remediation_completed') {
        const agentAction = {
          id: Date.now(),
          timestamp: new Date(),
          agent: newEvent.type === 'cpu_spike' ? 'Auto Remediate Bot' : 'Risk Assessment Bot',
          action: newEvent.description,
          status: 'completed',
          confidence: newEvent.confidence || 0.9
        };
        
        setAgentActivity(prev => [agentAction, ...prev.slice(0, 9)]);
      }

      // Add notifications
      if (newEvent.severity === 'high' || newEvent.type === 'remediation_completed') {
        const notification = {
          id: Date.now(),
          type: newEvent.type,
          message: newEvent.description,
          timestamp: new Date(),
          severity: newEvent.severity || 'info'
        };
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
      }

    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  const generateRealtimeEvent = (type) => {
    const events = {
      cpu_spike: {
        type: 'cpu_spike',
        server: 'prod-db-01',
        description: 'CPU utilization spiked to 91% - AI remediation triggered',
        severity: 'high',
        confidence: 0.92,
        timestamp: new Date()
      },
      remediation_completed: {
        type: 'remediation_completed',
        server: 'prod-cache-01',
        description: 'Auto-remediation completed successfully - Service restarted',
        severity: 'info',
        timestamp: new Date()
      },
      risk_assessment: {
        type: 'risk_assessment',
        server: 'prod-db-01',
        description: 'Risk score updated to 87 - Change request CHG0010056 created',
        severity: 'medium',
        timestamp: new Date()
      },
      prediction_update: {
        type: 'prediction_update',
        server: 'prod-web-02',
        description: 'ML model predicts 92% CPU in next 5 minutes (confidence: 0.89)',
        severity: 'warning',
        confidence: 0.89,
        timestamp: new Date()
      }
    };

    return events[type];
  };

  const handleTriggerRemediation = async (serverId) => {
    const server = state.servers.find(s => s.id === serverId);
    if (!server) return;

    // Simulate ServiceNow AI agent invocation
    const remediationAction = {
      id: Date.now(),
      timestamp: new Date(),
      agent: 'Auto Remediate Bot',
      action: `Manual remediation triggered for ${server.name}`,
      status: 'running',
      confidence: 0.95
    };

    setAgentActivity(prev => [remediationAction, ...prev]);

    // Simulate flow execution
    setTimeout(() => {
      setAgentActivity(prev => 
        prev.map(action => 
          action.id === remediationAction.id 
            ? { ...action, status: 'completed', action: `${action.action} - Completed successfully` }
            : action
        )
      );

      // Update server status
      setState(prev => ({
        ...prev,
        servers: prev.servers.map(s => 
          s.id === serverId 
            ? { ...s, status: 'auto-remediated', cpuUsage: Math.max(30, s.cpuUsage - 20) }
            : s
        )
      }));

    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'auto-remediated': return 'bg-blue-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'warning': return 'border-orange-500 bg-orange-50 text-orange-800';
      default: return 'border-blue-500 bg-blue-50 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            ResilienceAI Control Center
          </h1>
          <p className="text-gray-600 mt-1">
            x_YourCompany_resilience_ai | Real-time autonomous IT operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm">Real-time: {isRealTimeEnabled ? 'Active' : 'Paused'}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
          >
            {isRealTimeEnabled ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className="text-2xl font-bold">{state.systemHealth.overall}%</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={state.systemHealth.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Incidents</p>
                <p className="text-2xl font-bold">{state.systemHealth.incidents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Predictions</p>
                <p className="text-2xl font-bold">{state.systemHealth.predictions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Automation Rate</p>
                <p className="text-2xl font-bold">{state.systemHealth.automations}%</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="servers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="servers">Server Monitor</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="events">Live Events</TabsTrigger>
          <TabsTrigger value="flows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Server List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Monitored Servers</h3>
              {state.servers.map(server => (
                <Card key={server.id} className={`${server.status === 'warning' ? 'border-yellow-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(server.status)}`} />
                        <div>
                          <h4 className="font-semibold">{server.name}</h4>
                          <p className="text-sm text-gray-600">{server.environment}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">CPU Usage</p>
                        <p className={`text-lg font-bold ${server.cpuUsage > 85 ? 'text-red-600' : 'text-green-600'}`}>
                          {server.cpuUsage}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant={server.riskScore >= 70 ? 'destructive' : 'secondary'}>
                          Risk: {server.riskScore}
                        </Badge>
                        {server.prediction && (
                          <Badge variant="outline" className="border-red-500 text-red-600">
                            Predicted: {server.prediction.value}% (Conf: {Math.round(server.prediction.confidence * 100)}%)
                          </Badge>
                        )}
                      </div>
                      
                      {server.status === 'warning' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleTriggerRemediation(server.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Trigger AI Remediation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Notifications Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </h3>
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center text-gray-500">
                      No recent notifications
                    </CardContent>
                  </Card>
                ) : (
                  notifications.map(notification => (
                    <Alert key={notification.id} className={getSeverityColor(notification.severity)}>
                      <AlertDescription>
                        <div className="text-sm">
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Agents Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Agents Status</h3>
              {state.aiAgents.map(agent => (
                <Card key={agent.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">{agent.name}</h4>
                          <p className="text-sm text-gray-600">ID: {agent.id}</p>
                        </div>
                      </div>
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success Rate:</span>
                        <span className="text-sm font-medium">{agent.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Actions Today:</span>
                        <span className="text-sm font-medium">{agent.actionsToday}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Last Action:</span>
                        <p className="font-medium mt-1">{agent.lastAction}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Agent Activity Log */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agent Activity Log</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {agentActivity.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No recent agent activity</p>
                    ) : (
                      agentActivity.map(activity => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 border-l-2 border-blue-200">
                          <div className="flex-shrink-0">
                            {activity.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : activity.status === 'running' ? (
                              <Clock className="h-5 w-5 text-blue-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.agent}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {activity.timestamp.toLocaleTimeString()}
                              </span>
                              {activity.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  Confidence: {Math.round(activity.confidence * 100)}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Real-time Event Stream
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {state.realtimeEvents.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No real-time events</p>
                  ) : (
                    state.realtimeEvents.map((event, index) => (
                      <div key={index} className={`p-3 rounded border-l-4 ${getSeverityColor(event.severity)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{event.description}</p>
                            <p className="text-sm opacity-75">Server: {event.server}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">
                              {event.type}
                            </Badge>
                            <p className="text-xs mt-1">
                              {event.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  resai_IngestMetrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Continuously ingests metrics from Splunk/CloudWatch
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="default">Active</Badge>
                  <span className="text-sm text-gray-500">Every 30s</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  resai_RemediationFlow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Executes automated remediation for performance issues
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="default">Ready</Badge>
                  <span className="text-sm text-gray-500">On demand</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  resai_RiskCheck
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Evaluates risk scores and creates change requests
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="default">Active</Badge>
                  <span className="text-sm text-gray-500">Triggered</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResilienceAIControlCenter;
