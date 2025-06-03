
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockServers } from '@/data/mockData';
import RiskHeatmap from '@/components/dashboard/RiskHeatmap';
import { Shield, AlertCircle, Server as ServerIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getRiskLevel } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RiskPage = () => {
  // Calculate average risk score
  const avgRiskScore = mockServers.length > 0
    ? Math.round(mockServers.reduce((sum, server) => sum + server.riskScore, 0) / mockServers.length)
    : 0;
  
  // Count servers by risk level
  const riskCounts = mockServers.reduce((acc, server) => {
    const level = getRiskLevel(server.riskScore);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find highest risk server
  const highestRiskServer = [...mockServers].sort((a, b) => b.riskScore - a.riskScore)[0];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Risk Assessment</h1>
        <p className="text-muted-foreground">
          GRC integration and risk analysis for all infrastructure components
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{avgRiskScore}</div>
            <Progress value={avgRiskScore} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-risk-low"></div>
                  <span>Low: {riskCounts.low || 0}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-3 h-3 rounded-full bg-risk-medium"></div>
                  <span>Medium: {riskCounts.medium || 0}</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-risk-high"></div>
                  <span>High: {riskCounts.high || 0}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-3 h-3 rounded-full bg-risk-critical"></div>
                  <span>Critical: {riskCounts.critical || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Risk Asset
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highestRiskServer ? (
              <div className="flex items-center gap-2">
                <ServerIcon className="h-5 w-5 text-risk-high" />
                <div>
                  <div className="font-medium">{highestRiskServer.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Risk Score: {highestRiskServer.riskScore}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No servers found</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="heatmap" className="mb-6">
        <TabsList>
          <TabsTrigger value="heatmap" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Risk Heatmap
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Risk Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="heatmap" className="mt-4">
          <RiskHeatmap servers={mockServers} />
        </TabsContent>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Server Risk Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Server</th>
                      <th className="px-4 py-3 font-medium">Environment</th>
                      <th className="px-4 py-3 font-medium">IP Address</th>
                      <th className="px-4 py-3 font-medium">Location</th>
                      <th className="px-4 py-3 font-medium">Risk Score</th>
                      <th className="px-4 py-3 font-medium">Risk Level</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockServers.map((server) => {
                      const riskLevel = getRiskLevel(server.riskScore);
                      const getRiskColorClass = () => {
                        switch (riskLevel) {
                          case 'low': return 'text-risk-low';
                          case 'medium': return 'text-risk-medium';
                          case 'high': return 'text-risk-high';
                          case 'critical': return 'text-risk-critical';
                          default: return 'text-gray-500';
                        }
                      };
                      
                      return (
                        <tr key={server.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {server.name}
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {server.environment}
                          </td>
                          <td className="px-4 py-3">
                            {server.ip}
                          </td>
                          <td className="px-4 py-3">
                            {server.location}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {server.riskScore}
                          </td>
                          <td className={`px-4 py-3 font-medium uppercase ${getRiskColorClass()}`}>
                            {riskLevel}
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {server.status}
                          </td>
                        </tr>
                      );
                    })}
                    {mockServers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                          No servers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RiskPage;
