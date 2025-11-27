-- InnKeeper Initial Schema Migration
-- This migration creates all the base tables for the InnKeeper application

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  persona JSONB NOT NULL,
  memory JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  stats JSONB NOT NULL,
  inventory JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dungeons table
CREATE TABLE IF NOT EXISTS dungeons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed TEXT UNIQUE NOT NULL,
  map JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Runs table
CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dungeon_id UUID REFERENCES dungeons(id) ON DELETE CASCADE NOT NULL,
  party TEXT[] NOT NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  result TEXT,
  seed TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Run logs table
CREATE TABLE IF NOT EXISTS run_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES runs(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  json JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- World events table
CREATE TABLE IF NOT EXISTS world_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES runs(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_agent_id ON characters(agent_id);
CREATE INDEX IF NOT EXISTS idx_runs_dungeon_id ON runs(dungeon_id);
CREATE INDEX IF NOT EXISTS idx_run_logs_run_id ON run_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_run_logs_timestamp ON run_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_world_events_run_id ON world_events(run_id);
CREATE INDEX IF NOT EXISTS idx_world_events_type ON world_events(type);
CREATE INDEX IF NOT EXISTS idx_world_events_timestamp ON world_events(timestamp);

-- Enable Row Level Security (RLS) - adjust policies as needed
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeons ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_events ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow all for now - adjust for production)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all on agents" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all on characters" ON characters FOR ALL USING (true);
CREATE POLICY "Allow all on dungeons" ON dungeons FOR ALL USING (true);
CREATE POLICY "Allow all on runs" ON runs FOR ALL USING (true);
CREATE POLICY "Allow all on run_logs" ON run_logs FOR ALL USING (true);
CREATE POLICY "Allow all on world_events" ON world_events FOR ALL USING (true);

