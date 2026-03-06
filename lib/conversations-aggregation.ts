import type {
  ChatWithMessagesResponse,
  AgentListItem,
  AgentMetricsItem,
  ConversationRow,
} from "@/types/botmaker";

function parseSecs(raw: string | undefined): number {
  if (!raw || raw === "-") return 0;
  const n = Number(String(raw).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "—";
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function cleanTypification(raw: string | undefined): string {
  if (!raw) return "—";
  return raw.replace(/_/g, " ");
}

export function buildConversationRows(
  chats: ChatWithMessagesResponse[],
  agents: AgentListItem[],
  metricsItems: AgentMetricsItem[],
): ConversationRow[] {
  const agentMap = new Map<string, string>();
  for (const agent of agents) {
    agentMap.set(agent.id, agent.name ?? agent.email ?? agent.id);
  }

  const metricsMap = new Map<
    string,
    {
      typification: string;
      firstResponse: number;
      avgAttending: number;
      agentName: string;
    }
  >();
  for (const item of metricsItems) {
    const existing = metricsMap.get(item.chatId);
    if (!existing || (item.closedTime && !existing.typification)) {
      metricsMap.set(item.chatId, {
        typification: item.typification ?? "",
        firstResponse: parseSecs(item.fromOpAssignedToOpFirstResponse),
        avgAttending: parseSecs(item.avgAttendingTime),
        agentName: item.agentName ?? "",
      });
    }
  }

  return chats.map((chat) => {
    const chatId = chat.chat.chatId;
    const vars = chat.variables ?? {};
    const metrics = metricsMap.get(chatId);

    const customerName =
      vars.nombreContacto ||
      [chat.firstName, chat.lastName].filter(Boolean).join(" ") ||
      "—";

    let agentName = "—";
    if (metrics?.agentName) {
      agentName = metrics.agentName;
    } else if (chat.agentId) {
      agentName = agentMap.get(chat.agentId) ?? chat.agentId;
    }

    return {
      chatId,
      customerName,
      agentName,
      investmentReason: cleanTypification(vars.motivo_interes) || "—",
      adSource: vars.referralHeadline || "—",
      conversationLink:
        vars.url_conversacion ||
        `https://go.botmaker.com/#/chats/${chatId}`,
      closingTypification: cleanTypification(
        metrics?.typification || vars.typification,
      ),
      firstResponseTime: formatDuration(metrics?.firstResponse ?? 0),
      avgChatDuration: formatDuration(metrics?.avgAttending ?? 0),
    };
  });
}
