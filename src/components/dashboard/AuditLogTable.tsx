
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLog } from '@/types';
import { getRiskLevel } from '@/data/mockData';
import { AlertCircle } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLog[];
}

const RiskIndicator: React.FC<{ score: number }> = ({ score }) => {
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

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2 border-b">Timestamp</th>
                <th className="px-4 py-2 border-b">Action</th>
                <th className="px-4 py-2 border-b">Actor</th>
                <th className="px-4 py-2 border-b">Server</th>
                <th className="px-4 py-2 border-b">Risk</th>
                <th className="px-4 py-2 border-b">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs">
                    {log.timestamp.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 font-medium text-sm">
                    {log.action}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className="text-servicenow-blue">{log.actor}</span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {log.serverName}
                  </td>
                  <td className="px-4 py-2">
                    <RiskIndicator score={log.riskScore} />
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {log.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogTable;
