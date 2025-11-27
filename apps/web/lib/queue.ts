import { Queue, QueueOptions } from 'bullmq';
import Redis from 'ioredis';

// BullMQ requires maxRetriesPerRequest to be null
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const runQueue = new Queue('run-simulation', {
  connection,
} as QueueOptions);

export const replayQueue = new Queue('replay-generation', {
  connection,
} as QueueOptions);

