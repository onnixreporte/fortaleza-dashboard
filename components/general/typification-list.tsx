"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TypificationCount } from "@/lib/general-aggregation";

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444",
  "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

interface TypificationListProps {
  data: TypificationCount[];
}

export function TypificationList({ data }: TypificationListProps) {
  const top = data.slice(0, 8);
  const rest = data.slice(8);
  const chartData =
    rest.length > 0
      ? [...top, { label: "Otros", count: rest.reduce((s, d) => s + d.count, 0) }]
      : top;

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Tipificaciones más comunes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Sin tipificaciones en este período
          </p>
        ) : (
          <div className="h-[320px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  strokeWidth={2}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value, name) => [`${value}`, `${name}`]}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", lineHeight: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
