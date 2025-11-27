export type ActionType = 'move' | 'attack' | 'skill_check' | 'use_item' | 'interact';

export interface BaseAction {
  type: ActionType;
  actorId: string;
  timestamp?: number;
}

export interface MoveAction extends BaseAction {
  type: 'move';
  target: { x: number; y: number };
}

export interface AttackAction extends BaseAction {
  type: 'attack';
  targetId: string;
  weaponId?: string;
}

export interface SkillCheckAction extends BaseAction {
  type: 'skill_check';
  skill: string; // e.g., 'stealth', 'perception', 'athletics'
  difficulty: number; // DC (Difficulty Class)
  targetId?: string; // Optional target entity
}

export interface UseItemAction extends BaseAction {
  type: 'use_item';
  itemId: string;
  targetId?: string;
}

export interface InteractAction extends BaseAction {
  type: 'interact';
  targetId: string;
  interaction: string; // e.g., 'inspect', 'open', 'take'
}

export type Action = MoveAction | AttackAction | SkillCheckAction | UseItemAction | InteractAction;

export interface ActionIntent {
  action: Action;
  agentId: string;
  priority?: number; // For resolving conflicts
}

