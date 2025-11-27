import { create } from 'zustand';
import { Agent, GameView, LogEntry } from '../types';
import { INITIAL_PARTY, MOCK_LOGS } from '../constants';

interface GameState {
    currentView: GameView;
    party: Agent[];
    selectedAgentId: string | null;
    logs: LogEntry[];
    day: number;
    gold: number;

    // Actions
    switchView: (view: GameView) => void;
    selectAgent: (id: string | null) => void;
    addLog: (log: LogEntry) => void;
    setParty: (party: Agent[]) => void;
    updateAgent: (id: string, updates: Partial<Agent>) => void;
}

export const useGameStore = create<GameState>((set) => ({
    currentView: GameView.INN,
    party: INITIAL_PARTY,
    selectedAgentId: null,
    logs: MOCK_LOGS,
    day: 1,
    gold: 450,

    switchView: (view) => set({ currentView: view }),
    selectAgent: (id) => set({ selectedAgentId: id }),
    addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
    setParty: (party) => set({ party }),
    updateAgent: (id, updates) => set((state) => ({
        party: state.party.map(agent =>
            agent.id === id ? { ...agent, ...updates } : agent
        )
    })),
}));
