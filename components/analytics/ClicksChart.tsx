"use client";

import { useState, useEffect } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ClickData {
  date: string;
  clicks: number;
}

interface ClicksChartProps {
  data: ClickData[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-md">
        <p className="text-sm font-medium">{format(parseISO(label), 'MMM d, yyyy')}</p>
        <p className="text-sm font-semibold text-teal-400">
          {payload[0].value.toLocaleString()} clicks
        </p>
      </div>
    );
  }

  return null;
};

const ClicksChart = ({ data, isLoading }: ClicksChartProps) => {
  const [chartData, setChartData] = useState<ClickData[]>([]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else if (!isLoading) {
      // Generate empty data if no data provided
      const emptyData: ClickData[] = [];
      const today = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = subDays(today, i);
        emptyData.push({
          date: date.toISOString().split('T')[0],
          clicks: 0
        });
      }
      
      setChartData(emptyData);
    }
  }, [data, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date"
            tickFormatter={(tick) => format(parseISO(tick), 'MMM d')}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ dy: 10 }}
            minTickGap={30}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value === 0 ? '0' : `${value}`}
            tick={{ dx: -10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="hsl(var(--chart-1))"
            fillOpacity={1}
            fill="url(#colorClicks)"
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--chart-1))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClicksChart;