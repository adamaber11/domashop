'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { format } from 'date-fns';

interface SalesChartProps {
  data: { month: Date; totalSales: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const chartConfig = {
    totalSales: {
      label: 'Sales',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => format(value, 'MMM')}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '3 3' }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="totalSales"
            type="monotone"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              fill: "hsl(var(--primary))",
              r: 4
            }}
            activeDot={{
                r: 6
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
