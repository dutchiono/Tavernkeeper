import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { supabase } from '../lib/supabase';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Required by BullMQ
});

interface ReplayJobData {
  runId: string;
  format: 'gif' | 'png' | 'mp4';
}

export const replayWorker = new Worker<ReplayJobData>(
  'replay-generation',
  async (job: Job<ReplayJobData>) => {
    const { runId, format } = job.data;

    try {
      // Load run and events
      const { data: run, error: runError } = await supabase
        .from('runs')
        .select('*')
        .eq('id', runId)
        .single();

      if (runError || !run) {
        throw new Error(`Run ${runId} not found`);
      }

      const { data: events } = await supabase
        .from('world_events')
        .select('*')
        .eq('run_id', runId)
        .order('timestamp', { ascending: true })
        .limit(1000);

      // In production, this would:
      // 1. Load sprites and assets
      // 2. Render each frame based on events
      // 3. Compile into GIF/PNG sequence/MP4
      // 4. Upload to MinIO/S3
      // 5. Return URL

      // For now, return placeholder
      const replayUrl = `https://storage.example.com/replays/${runId}.${format}`;

      // Store replay URL in database (you might want to add a Replay model)
      // await supabase
      //   .from('runs')
      //   .update({ replay_url: replayUrl })
      //   .eq('id', runId);

      return {
        success: true,
        runId,
        format,
        url: replayUrl,
        message: 'Replay generation (implementation pending - would render frames and upload to storage)',
      };
    } catch (error) {
      console.error(`Error generating replay for run ${runId}:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 2, // Process up to 2 replays concurrently
  }
);

replayWorker.on('completed', (job) => {
  console.log(`Replay generation completed: ${job.id}`);
});

replayWorker.on('failed', (job, err) => {
  console.error(`Replay generation failed: ${job?.id}`, err);
});

