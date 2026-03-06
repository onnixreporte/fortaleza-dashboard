"use client";

import {
  MessageSquare,
  Users,
  Clock,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/conversations-aggregation";
import type { OverviewKpis } from "@/lib/general-aggregation";

interface OverviewKpiCardsProps {
  kpis: OverviewKpis;
}

export function OverviewKpiCards({ kpis }: OverviewKpiCardsProps) {
  const cards = [
    {
      label: "Total conversaciones",
      value: kpis.totalConversations.toLocaleString("es-PY"),
      icon: MessageSquare,
    },
    {
      label: "Agentes activos",
      value: kpis.activeAgents.toLocaleString("es-PY"),
      icon: Users,
    },
    {
      label: "Prom. 1ra respuesta",
      value: formatDuration(kpis.avgFirstResponseSecs),
      icon: Clock,
    },
    {
      label: "Duración prom. chat",
      value: formatDuration(kpis.avgChatDurationSecs),
      icon: Timer,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <card.icon className="size-3.5" />
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
