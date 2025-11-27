export interface AgentPersona {
  name: string;
  archetype: 'warrior' | 'rogue' | 'mage' | 'cleric' | 'ranger' | 'custom';
  aggression: number; // 0.0 to 1.0
  caution: number; // 0.0 to 1.0
  goals?: string[];
  traits?: string[];
}

export interface AgentMemory {
  shortTerm: Array<{ eventId: string; timestamp: number }>; // Last 10 events
  episodic: Array<{ runId: string; summary: string }>; // Per-run summaries
  longTerm: {
    reputations?: Record<string, number>; // Entity ID -> reputation score
    lore?: string[]; // Learned facts
    relationships?: Record<string, string>; // Entity ID -> relationship type
  };
}

export interface AgentManifest {
  id: string;
  persona: AgentPersona;
  plugins: string[];
}

