export interface ChatReferenceRes {
  chatId: string;
  channelId: string;
  contactId: string;
}

export interface ChatWithMessagesResponse {
  chat: ChatReferenceRes;
  creationTime?: string;
  lastSessionCreationTime?: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  email?: string;
  whatsAppWindowCloseDatetime?: string;
  variables?: Record<string, string>;
  tags?: string[];
  queueId?: string;
  agentId?: string;
  onHoldAgentId?: string;
  lastUserMessageDatetime?: string;
  isBanned?: boolean;
  isTester?: boolean;
  tester?: boolean;
  listMessagesURL?: string;
}

export interface ChatsPage {
  nextPage: string | null;
  items: ChatWithMessagesResponse[];
}

export interface AgentListItem {
  id: string;
  email?: string;
  name?: string;
  alias?: string;
  isOnline?: boolean;
  status?: string;
  role?: string;
  queues?: string[];
  slots?: number;
  priority?: string;
  groups?: string[];
  creationTime?: string;
}

export interface AgentsListPage {
  nextPage?: string | null;
  items?: AgentListItem[];
}

export interface AgentMetricsItem {
  chatId: string;
  agentId?: string;
  agentName?: string;
  typification?: string;
  sessionCreationTime?: string;
  closedTime?: string;
  queue?: string;
  avgAttendingTime?: string;
  avgResponseTime?: string;
  openSessions?: string;
  closedSessions?: string;
  onHold?: string;
  operatorResponses?: string;
  fromOpAssignedToOpFirstResponse?: string;
  sessionTransferIn?: string;
  sessionTransferOut?: string;
  closedWithNoMessages?: string;
  agentTimeout?: string;
  userTimeout?: string;
  sessionTimeout?: string;
  conversationLink?: string;
  [key: string]: unknown;
}

export interface AgentMetricsPage {
  nextPage: string | null;
  items: AgentMetricsItem[];
}

export interface ConversationRow {
  chatId: string;
  customerName: string;
  agentName: string;
  investmentReason: string;
  adSource: string;
  conversationLink: string;
  closingTypification: string;
  firstResponseTime: string;
  avgChatDuration: string;
}
