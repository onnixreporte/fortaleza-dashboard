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
import type { VariableCount } from "@/lib/general-aggregation";

const PIE_COLORS = [
  "#f59e0b", "#8b5cf6", "#3b82f6", "#10b981", "#ef4444",
  "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

const DONUT_COLORS = [
  "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#ec4899", "#06b6d4", "#14b8a6", "#f97316", "#6366f1",
];

interface VariableChartProps {
  data: VariableCount[];
  title: string;
  emptyMessage: string;
  color?: string;
  variant?: "pie" | "donut";
}

export function VariableChart({
  data,
  title,
  emptyMessage,
  variant = "pie",
}: VariableChartProps) {
  const top = data.slice(0, 8);
  const rest = data.slice(8);
  const chartData =
    rest.length > 0
      ? [...top, { label: "Otros", count: rest.reduce((s, d) => s + d.count, 0) }]
      : top;

  const colors = variant === "donut" ? DONUT_COLORS : PIE_COLORS;
  const innerRadius = variant === "donut" ? 55 : 0;

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
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
                  innerRadius={innerRadius}
                  outerRadius={100}
                  paddingAngle={variant === "donut" ? 2 : 1}
                  strokeWidth={2}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
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
