'use client';

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface CategoryChartProps {
  data: { category: string; count: number }[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function CategoryChart({ data }: CategoryChartProps) {
    const chartConfig = data.reduce((acc, item, index) => {
        acc[item.category] = {
            label: item.category,
            color: COLORS[index % COLORS.length],
        };
        return acc;
    }, {});


  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={60}
            labelLine={false}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ right: 'auto', left: 0 }}
            iconSize={10}
            iconType="circle"
            formatter={(value, entry) => (
                <span className="text-muted-foreground text-sm">{value}</span>
            )}
           />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
