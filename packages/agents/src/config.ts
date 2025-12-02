/**
 * Agent configuration loaded from environment variables
 */
export interface AgentConfig {
  elizaUrl: string;
  elizaApiKey: string;
  engineApiUrl: string;
}

export function getAgentConfig(): AgentConfig {
  return {
    elizaUrl: process.env.ELIZA_URL || 'http://localhost:3001',
    elizaApiKey: process.env.ELIZA_API_KEY || '',
    engineApiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  };
}

