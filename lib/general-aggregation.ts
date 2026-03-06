import type {
  ChatWithMessagesResponse,
  AgentListItem,
  AgentMetricsItem,
} from "@/types/botmaker";

function parseSecs(raw: string | undefined): number {
  if (!raw || raw === "-") return 0;
  const n = Number(String(raw).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export interface OverviewKpis {
  totalConversations: number;
  activeAgents: number;
  avgFirstResponseSecs: number;
  avgChatDurationSecs: number;
}

export interface TypificationCount {
  label: string;
  count: number;
}

export interface AgentChatCount {
  agentName: string;
  count: number;
}

export interface VariableCount {
  label: string;
  count: number;
}

export function computeOverviewKpis(
  chats: ChatWithMessagesResponse[],
  agents: AgentListItem[],
  metricsItems: AgentMetricsItem[],
): OverviewKpis {
  const activeAgents = agents.filter(
    (a) => a.isOnline || a.status === "online",
  ).length;

  let totalFirstResponse = 0;
  let firstResponseCount = 0;
  let totalAttending = 0;
  let attendingCount = 0;

  for (const item of metricsItems) {
    const fr = parseSecs(item.fromOpAssignedToOpFirstResponse);
    if (fr > 0) {
      totalFirstResponse += fr;
      firstResponseCount++;
    }
    const at = parseSecs(item.avgAttendingTime);
    if (at > 0) {
      totalAttending += at;
      attendingCount++;
    }
  }

  return {
    totalConversations: chats.length,
    activeAgents,
    avgFirstResponseSecs:
      firstResponseCount > 0 ? totalFirstResponse / firstResponseCount : 0,
    avgChatDurationSecs:
      attendingCount > 0 ? totalAttending / attendingCount : 0,
  };
}

export function countByTypification(
  metricsItems: AgentMetricsItem[],
): TypificationCount[] {
  const counts = new Map<string, number>();
  for (const item of metricsItems) {
    const raw = item.typification;
    if (!raw) continue;
    const label = raw.replace(/_/g, " ");
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function countChatsByAgent(
  metricsItems: AgentMetricsItem[],
): AgentChatCount[] {
  const counts = new Map<string, number>();
  for (const item of metricsItems) {
    const agentName = String(item.agentName || item.agentId || "Desconocido");
    counts.set(agentName, (counts.get(agentName) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([agentName, count]) => ({ agentName, count }))
    .sort((a, b) => b.count - a.count);
}

export function countByVariable(
  chats: ChatWithMessagesResponse[],
  variableName: string
): VariableCount[] {
  const counts = new Map<string, number>();
  for (const chat of chats) {
    const val = chat.variables?.[variableName];
    if (val) {
      const label = String(val).trim();
      if (label) {
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
    }
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}
