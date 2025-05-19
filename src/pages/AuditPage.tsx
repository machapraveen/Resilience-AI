
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Download, AlertCircle } from 'lucide-react';
import { mockAuditLogs } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRiskLevel } from '@/data/mockData';

const AuditPage = () => {
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
          <Input placeholder="Search audit logs..." />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="anomaly">Anomaly Detection</SelectItem>
            <SelectItem value="risk">Risk Assessment</SelectItem>
            <SelectItem value="change">Change Creation</SelectItem>
            <SelectItem value="vm">VM Restart</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
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
                {mockAuditLogs.map((log) => (
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
                {mockAuditLogs.length === 0 && (
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
