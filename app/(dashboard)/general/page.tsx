"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Download } from "lucide-react";
import { DateFilterBar } from "@/components/filters/date-filter-bar";
import { OverviewKpiCards } from "@/components/general/overview-kpi-cards";
import { TypificationList } from "@/components/general/typification-list";
import { AgentChatList } from "@/components/general/agent-chat-list";
import { VariableChart } from "@/components/general/variable-chart";
import { Button } from "@/components/ui/button";
import { useRefreshContext } from "@/store/refresh-context";
import { getDateFilter, type DatePreset } from "@/lib/date-filters";
import {
  computeOverviewKpis,
  countByTypification,
  countChatsByAgent,
  countByVariable,
} from "@/lib/general-aggregation";
import { exportToCsv } from "@/lib/export-csv";
import type {
  ChatWithMessagesResponse,
  AgentListItem,
  AgentMetricsItem,
  ChatsPage,
  AgentsListPage,
  AgentMetricsPage,
} from "@/types/botmaker";

async function fetchAllChats(
  from: string,
  to: string,
  longTerm: boolean,
): Promise<ChatWithMessagesResponse[]> {
  const params = new URLSearchParams({ from, to });
  if (longTerm) params.set("long-term-search", "true");

  let url: string | null = `/api/chats?${params.toString()}`;
  const acc: ChatWithMessagesResponse[] = [];

  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Chats API error: ${res.status}`);
    const page: ChatsPage = await res.json();
    acc.push(...(page.items ?? []));
    url = page.nextPage
      ? `/api/chats?nextPage=${encodeURIComponent(page.nextPage)}`
      : null;
  }
  return acc;
}

async function fetchAllAgents(): Promise<AgentListItem[]> {
  let url: string | null = "/api/agents";
  const acc: AgentListItem[] = [];

  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Agents API error: ${res.status}`);
    const page: AgentsListPage = await res.json();
    acc.push(...(page.items ?? []));
    url = page.nextPage
      ? `/api/agents?nextPage=${encodeURIComponent(page.nextPage)}`
      : null;
  }
  return acc;
}

async function fetchAllMetrics(
  from: string,
  to: string,
  sessionStatus: "open" | "closed",
): Promise<AgentMetricsItem[]> {
  const params = new URLSearchParams({
    from,
    to,
    "session-status": sessionStatus,
  });
  let url: string | null = `/api/agent-metrics?${params.toString()}`;
  const acc: AgentMetricsItem[] = [];

  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Metrics API error: ${res.status}`);
    const page: AgentMetricsPage = await res.json();
    acc.push(...(page.items ?? []));
    url = page.nextPage
      ? `/api/agent-metrics?nextPage=${encodeURIComponent(page.nextPage)}`
      : null;
  }
  return acc;
}

export default function GeneralPage() {
  const { registerRefresh, unregisterRefresh } = useRefreshContext();
  const [datePreset, setDatePreset] = useState<DatePreset>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [chats, setChats] = useState<ChatWithMessagesResponse[]>([]);
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [metricsItems, setMetricsItems] = useState<AgentMetricsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRefreshTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    registerRefresh(refresh);
    return unregisterRefresh;
  }, [registerRefresh, unregisterRefresh, refresh]);

  const isCustomIncomplete =
    datePreset === "custom" && (!customFrom || !customTo);

  const filter = useMemo(() => {
    if (isCustomIncomplete) return null;
    return getDateFilter(datePreset, customFrom || undefined, customTo || undefined);
  }, [datePreset, customFrom, customTo, isCustomIncomplete]);

  useEffect(() => {
    if (!filter) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const safeMetrics = (status: "open" | "closed") =>
      fetchAllMetrics(filter.from, filter.to, status).catch(
        () => [] as AgentMetricsItem[],
      );

    Promise.all([
      fetchAllChats(filter.from, filter.to, !!filter.longTerm),
      fetchAllAgents(),
      safeMetrics("closed"),
      safeMetrics("open"),
    ])
      .then(([chatsData, agentsData, closedMetrics, openMetrics]) => {
        if (cancelled) return;
        setChats(chatsData);
        setAgents(agentsData);
        setMetricsItems([...closedMetrics, ...openMetrics]);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Error desconocido");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter, refreshTrigger]);

  const kpis = useMemo(
    () => computeOverviewKpis(chats, agents, metricsItems),
    [chats, agents, metricsItems],
  );

  const typifications = useMemo(
    () => countByTypification(metricsItems),
    [metricsItems],
  );

  const agentChats = useMemo(
    () => countChatsByAgent(metricsItems),
    [metricsItems],
  );

  const investmentReasons = useMemo(
    () => countByVariable(chats, "motivo_interes"),
    [chats],
  );

  const adSources = useMemo(
    () => countByVariable(chats, "referralHeadline"),
    [chats],
  );

  const handleDateChange = useCallback(
    (preset: DatePreset, from?: string, to?: string) => {
      setDatePreset(preset);
      if (preset === "custom") {
        setCustomFrom(from ?? "");
        setCustomTo(to ?? "");
      }
    },
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">General</h2>
        <div className="flex items-center gap-2">
          <DateFilterBar
            selected={datePreset}
            customFrom={customFrom}
            customTo={customTo}
            onChange={handleDateChange}
            loading={loading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCsv(metricsItems, "general_metrics", [
                { key: "chatId", label: "ID" },
                { key: "agentName", label: "Agente" },
                { key: "agentEmail", label: "Email" },
                { key: "sessionStatus", label: "Estado" },
                { key: "typification", label: "Tipificación" },
                { key: "avgAttendingTime", label: "Tiempo Atención" },
                {
                  key: "fromOpAssignedToOpFirstResponse",
                  label: "1ra Respuesta",
                },
              ])
            }
            disabled={loading || metricsItems.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Cargando datos...
          </span>
        </div>
      ) : (
        <>
          <OverviewKpiCards kpis={kpis} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AgentChatList data={agentChats} />
            <TypificationList data={typifications} />
            <VariableChart
              data={investmentReasons}
              title="Motivo de inversión"
              emptyMessage="Sin motivos de inversión en este período"
              variant="pie"
            />
            <VariableChart
              data={adSources}
              title="Pauta más consultada"
              emptyMessage="Sin pautas en este período"
              variant="donut"
            />
          </div>
        </>
      )}
    </div>
  );
}
