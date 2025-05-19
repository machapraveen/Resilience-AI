
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CPUMetric } from '@/types';

interface CPUMetricsChartProps {
  metrics: CPUMetric[];
  serverId: string;
  serverName: string;
}

const CPUMetricsChart: React.FC<CPUMetricsChartProps> = ({ metrics, serverId, serverName }) => {
  // Format the data for the chart
  const chartData = metrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    value: metric.value,
    predicted: metric.predicted,
  }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">CPU Metrics: {serverName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={[0, 100]}
                label={{ 
                  value: 'CPU %', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'CPU']}
                labelFormatter={(label) => `Time: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                name="Actual" 
                type="monotone" 
                dataKey="value" 
                stroke="#2a74df"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={true}
                connectNulls
              />
              <Line 
                name="Predicted" 
                type="monotone" 
                dataKey={(dataPoint) => dataPoint.predicted ? dataPoint.value : null} 
                stroke="#e84855"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CPUMetricsChart;
