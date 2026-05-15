import React from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchGraph } from '../../api/stats';
import { monthLabel } from '../../utils/formatters';
import type { GraphDataPoint } from '../../types';

interface ChartPoint {
  name: string;
  count: number;
}

function buildChartData(data: GraphDataPoint[]): ChartPoint[] {
  const now = new Date();
  const points: ChartPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const found = data.find((p) => p.month === m && p.year === y);
    points.push({ name: monthLabel(m), count: found?.count ?? 0 });
  }

  return points;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d0f13] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white/50 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold text-sm">{payload[0].value} builds</p>
      </div>
    );
  }
  return null;
};

export const BuildsChart: React.FC = () => {
  const { data = [] } = useQuery({
    queryKey: ['graph'],
    queryFn: fetchGraph,
    refetchInterval: 60_000,
  });

  const chartData = buildChartData(data);

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="buildGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6B43A4" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#3d1d7a" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fill: '#ffffff50', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#ffffff50', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff15' }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8B5CF6"
            strokeWidth={2.5}
            fill="url(#buildGradient)"
            dot={{ fill: '#8B5CF6', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#A78BFA', r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
