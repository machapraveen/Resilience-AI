import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, Server as ServerIcon, Cpu, Activity, Shield, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { mockServers, mockIncidents, mockAuditLogs, mockChangeRequests } from '@/data/mockData';
import ResilienceAIService, { DEMO_CONFIG } from '@/integrations/servicenow/ResilienceAIService';
import ServerStatusCard from '@/components/dashboard/ServerStatusCard';
import IncidentList from '@/components/dashboard/IncidentList';
import AuditLogTable from '@/components/dashboard/AuditLogTable';
import CPUMetricsChart from '@/components/dashboard/CPUMetricsChart';
import RiskHeatmap from '@/components/dashboard/RiskHeatmap';

const Dashboard = () => {
  // 🚀 Using FIXED ResilienceAI service!
  const [resilienceAI] = useState(() => new ResilienceAIService(DEMO_CONFIG));
  const [serviceNowData, setServiceNowData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 📊 Data selection: Use ServiceNow data if available, otherwise mockData
  const auditLogs = serviceNowData?.auditLogs || mockAuditLogs;
  const incidents = serviceNowData?.incidents || mockIncidents;
  const servers = mockServers; // Keep using mock servers for display

  // Get the server with the highest risk score
  const highestRiskServer = [...servers].sort((a, b) => b.riskScore - a.riskScore)[0];
  
  // Get servers with predicted CPU spikes
  const serversWithPredictedSpikes = servers.filter(server => 
    server.cpuMetrics.some(metric => metric.predicted && metric.value > 85)
  );

  // 🔗 Load initial dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading ResilienceAI dashboard data...');
        
        const data = await resilienceAI.getDashboardData();
        setServiceNowData(data);
        setLastUpdated(new Date());
        
        console.log('✅ ResilienceAI dashboard data loaded:', {
          incidents: data.incidents?.length || 0,
          auditLogs: data.auditLogs?.length || 0
        });
        
        toast({
          title: 'ResilienceAI Connected',
          description: `Loaded ${data.incidents?.length || 0} incidents, ${data.auditLogs?.length || 0} audit logs`,
        });
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        toast({
          title: 'Demo Mode',
          description: 'Using mock data for demonstration',
          variant: 'default',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [resilienceAI]);

  // 🔄 Refresh dashboard data
  const refreshDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Refreshing ResilienceAI data...');
      const data = await resilienceAI.getDashboardData();
      setServiceNowData(data);
      setLastUpdated(new Date());
      
      toast({
        title: 'Data Refreshed',
        description: 'Dashboard updated with latest AI activity',
      });
    } catch (error) {
      console.error('❌ Refresh failed:', error);
      toast({
        title: 'Refresh Failed', 
        description: 'Could not refresh dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🤖 REAL AI Demo using FIXED service!
  const simulateRemediation = async () => {
    setIsLoading(true);
    
    try {
      const serverId = highestRiskServer?.id || 'prod-db-01';
      const cpuValue = 92;
      
      console.log(`🤖 Triggering ResilienceAI remediation for ${serverId} with CPU ${cpuValue}%`);
      
      // Use FIXED ResilienceAI service!
      await resilienceAI.triggerAutomaticRemediation(serverId, cpuValue);
      
      toast({
        title: '🤖 ResilienceAI Activated!',
        description: `AI agents initiated remediation for ${serverId}. Check audit logs for AI decisions!`,
      });
      
      // Refresh data after 2 seconds to see AI response
      setTimeout(refreshDashboardData, 2000);
      
    } catch (error) {
      console.error('❌ AI Demo failed:', error);
      
      toast({
        title: 'AI Demo Failed',
        description: 'Could not trigger AI demonstration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Enhanced risk assessment demo
  const triggerRiskAssessment = async () => {
    setIsLoading(true);
    
    try {
      const serverId = 'prod-web-02';
      
      console.log(`🛡️ Performing risk assessment for ${serverId}`);
      
      const riskData = await resilienceAI.performRiskAssessment(serverId);
      
      toast({
        title: '🛡️ Risk Assessment Complete',
        description: `Risk score: ${riskData.riskScore}. ${riskData.changeRequest ? 'Change request created due to high risk.' : 'Risk acceptable.'}`,
        variant: riskData.riskScore >= 70 ? 'destructive' : 'default',
      });
      
      setTimeout(refreshDashboardData, 1000);
      
    } catch (error) {
      console.error('❌ Risk assessment failed:', error);
      toast({
        title: 'Risk Assessment Failed',
        description: 'Could not perform risk assessment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">ResilienceAI Dashboard</h1>
          
          {/* 🚀 AI Service Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">ResilienceAI Active</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshDashboardData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          AI-powered monitoring and autonomous remediation with ServiceNow integration
        </p>
        
        {/* 🎯 Data source indicator */}
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()} • AI agents monitoring {servers.length} servers
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monitored Servers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ServerIcon className="h-5 w-5 text-servicenow-blue mr-2" />
              <span className="text-2xl font-bold">{servers.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-risk-high mr-2" />
              <span className="text-2xl font-bold">{incidents.filter(i => i.status !== 'closed').length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-risk-medium mr-2" />
              <span className="text-2xl font-bold">{serversWithPredictedSpikes.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {serversWithPredictedSpikes.length > 0 && (
        <div className="mb-6 p-4 border border-risk-high rounded-md bg-red-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-risk-high mr-2" />
              <div>
                <h2 className="font-medium">Critical Alert: CPU Spike Predicted</h2>
                <p className="text-sm text-muted-foreground">
                  AI model predicted CPU utilization to exceed 85% on {serversWithPredictedSpikes[0].name} within 5 minutes
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={triggerRiskAssessment} 
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                🛡️ Risk Assessment
              </Button>
              <Button 
                onClick={simulateRemediation} 
                disabled={isLoading}
                className="bg-servicenow-blue hover:bg-servicenow-blue/90"
              >
                🤖 Auto-Remediate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 Always show AI demo options */}
      <div className="mb-6 p-4 border border-blue-200 rounded-md bg-blue-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <h2 className="font-medium">ResilienceAI Control Center</h2>
              <p className="text-sm text-muted-foreground">
                Demonstrate autonomous AI agents: Auto-remediation, risk assessment, and intelligent decisions
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={triggerRiskAssessment} 
              disabled={isLoading}
              variant="outline"
            >
              🛡️ Demo Risk AI
            </Button>
            <Button 
              onClick={simulateRemediation} 
              disabled={isLoading}
              className="bg-servicenow-blue hover:bg-servicenow-blue/90"
            >
              🤖 Demo Auto AI
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="servers" className="mb-6">
        <TabsList>
          <TabsTrigger value="servers" className="flex items-center gap-1">
            <ServerIcon className="h-4 w-4" />
            Servers
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            CPU Metrics
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="servers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map(server => (
              <ServerStatusCard key={server.id} server={server} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          {highestRiskServer && (
            <div className="space-y-6">
              <CPUMetricsChart 
                metrics={highestRiskServer.cpuMetrics} 
                serverId={highestRiskServer.id} 
                serverName={highestRiskServer.name}
              />
              {serversWithPredictedSpikes.length > 0 && serversWithPredictedSpikes[0].id !== highestRiskServer.id && (
                <CPUMetricsChart 
                  metrics={serversWithPredictedSpikes[0].cpuMetrics}
                  serverId={serversWithPredictedSpikes[0].id}
                  serverName={serversWithPredictedSpikes[0].name}
                />
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="risk" className="mt-4">
          <RiskHeatmap servers={servers} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentList incidents={incidents} />
        <AuditLogTable logs={auditLogs.slice(0, 5)} />
      </div>
    </Layout>
  );
};

export default Dashboard;