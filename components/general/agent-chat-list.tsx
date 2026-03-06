"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import type { AgentChatCount } from "@/lib/general-aggregation";

interface AgentChatListProps {
  data: AgentChatCount[];
}

export function AgentChatList({ data }: AgentChatListProps) {
  const top = data.slice(0, 10);

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Chats atendidos por agente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {top.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Sin agentes en este período
          </p>
        ) : (
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis 
                  dataKey="agentName" 
                  type="category" 
                  width={150} 
                  tick={{ fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--chart-2, #10b981)" 
                  radius={[0, 4, 4, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
