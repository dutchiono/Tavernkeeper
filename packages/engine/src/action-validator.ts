import type { Action, ActionType } from '@innkeeper/lib';
import type { Entity } from '@innkeeper/lib';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate an action against the Action DSL
 */
export function validateAction(action: Action, entities: Map<string, Entity>): ValidationResult {
  const errors: ValidationError[] = [];

  // Check actor exists
  if (!entities.has(action.actorId)) {
    errors.push({
      field: 'actorId',
      message: `Actor ${action.actorId} does not exist`,
    });
    return { valid: false, errors };
  }

  const actor = entities.get(action.actorId)!;

  // Type-specific validation
  switch (action.type) {
    case 'move':
      if (!action.target || typeof action.target.x !== 'number' || typeof action.target.y !== 'number') {
        errors.push({
          field: 'target',
          message: 'Move action requires valid target coordinates',
        });
      }
      break;

    case 'attack':
      if (!action.targetId || !entities.has(action.targetId)) {
        errors.push({
          field: 'targetId',
          message: `Attack target ${action.targetId} does not exist`,
        });
      }
      break;

    case 'skill_check':
      if (!action.skill || typeof action.difficulty !== 'number') {
        errors.push({
          field: 'skill_check',
          message: 'Skill check requires skill name and difficulty number',
        });
      }
      break;

    case 'use_item':
      // Item validation would require inventory check - simplified for now
      if (!action.itemId) {
        errors.push({
          field: 'itemId',
          message: 'Use item action requires itemId',
        });
      }
      break;

    case 'interact':
      if (!action.targetId || !entities.has(action.targetId)) {
        errors.push({
          field: 'targetId',
          message: `Interaction target ${action.targetId} does not exist`,
        });
      }
      if (!action.interaction) {
        errors.push({
          field: 'interaction',
          message: 'Interact action requires interaction type',
        });
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if action type is valid
 */
export function isValidActionType(type: string): type is ActionType {
  return ['move', 'attack', 'skill_check', 'use_item', 'interact'].includes(type);
}

