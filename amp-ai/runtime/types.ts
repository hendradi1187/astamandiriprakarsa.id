export interface AgentConfig {
  name: string;
  model?: string;
  temperature?: number;
  engine?: string;
  resolution?: string;
  quality?: string;
  memory?: { enabled: boolean; type: string };
  handoff?: { next: string[] };
  tools?: string[];
}

export interface LoadedAgent {
  slug: string;
  config: AgentConfig;
  systemPrompt: string;
}

export interface WorkflowDef {
  workflow: {
    start: string;
    [agentName: string]: { next?: string[] } | string;
  };
}

export interface RunContext {
  userInput: string;
  results: Record<string, string>;
}
