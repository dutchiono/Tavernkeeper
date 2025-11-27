# InnKeeper

A Next.js-based dungeon crawler game with ElizaOS agents, deterministic game engine, and Farcaster miniapp integration.

## Architecture

- **Frontend**: Next.js 14+ with App Router, PixiJS for 8-bit rendering
- **Backend**: Next.js API routes, BullMQ workers
- **Agents**: ElizaOS integration for AI-driven characters
- **Engine**: Deterministic TypeScript game engine with seeded PRNG
- **Database**: PostgreSQL with Supabase (cloud-hosted)
- **Queue**: Redis for BullMQ job queue (cloud-hosted)
- **Storage**: S3-compatible storage for sprites and replays (optional for dev)

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Accounts for cloud services (free tiers available):
  - [Neon](https://neon.tech) or [Supabase](https://supabase.com) for PostgreSQL
  - [Upstash](https://upstash.com) for Redis
  - [Cloudflare R2](https://www.cloudflare.com/products/r2/) or AWS S3 for storage (optional)

### Setup

**Note:** All commands should be run from the project root directory (`InnKeeper/`).

1. **Set up cloud services:**
   - **PostgreSQL**: Create a free database at [Neon](https://neon.tech) or [Supabase](https://supabase.com). Copy the connection string.
   - **Redis**: Create a free Redis database at [Upstash](https://upstash.com). Copy the REST URL.
   - **Storage** (optional for development): Set up Cloudflare R2 or AWS S3 bucket, or skip for now.

2. **Create environment file:**
   Create `apps/web/.env` with the following content:
   ```env
   # Database - Get from Neon or Supabase
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require

   # Redis - Get from Upstash or Redis Labs
   # Upstash format: redis://default:TOKEN@HOST:PORT
   # Redis Labs format: redis://default:PASSWORD@HOST:PORT
   # If SSL required, use rediss:// instead of redis://
   REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:PORT

   # Storage (optional for dev)
   MINIO_ENDPOINT=https://your-account.r2.cloudflarestorage.com
   MINIO_ACCESS_KEY=your-access-key
   MINIO_SECRET_KEY=your-secret-key
   MINIO_BUCKET=innkeeper

   # App config
   NEXTAUTH_SECRET=replace-me-with-random-string
   NEXTAUTH_URL=http://localhost:3000
   ELIZA_URL=http://localhost:3001
   ELIZA_API_KEY=your-eliza-api-key-here
   FARCASTER_SIGNER_KEY=your-farcaster-signer-key-here
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Install dependencies (from project root):**
   ```bash
   pnpm install
   ```

4. **Set up database:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration file: `supabase/migrations/20240101000000_initial_schema.sql`
   - Or copy the contents of `supabase-schema.sql` and run it

5. **Start development server (from project root):**
   ```bash
   pnpm dev
   ```

6. **Start workers (in separate terminal, from project root):**
   ```bash
   cd apps/web
   pnpm start-worker
   ```

## Project Structure

```
/innkeeper
  /apps
    /web          # Next.js application
  /packages
    /engine       # Game engine (deterministic, seeded RNG)
    /agents       # ElizaOS agent wrappers
    /lib          # Shared types and utilities
  /infra          # Infrastructure config (archived)
  /supabase       # Database migrations
  /agent-guide    # Instructions for other agents
```

## Development

- `pnpm dev` - Start Next.js dev server
- `pnpm build` - Build all packages
- `pnpm test` - Run tests
- `pnpm lint` - Lint all packages

## Documentation

See `/arc` directory for detailed architecture and specifications.

See `/agent-guide` for instructions for other agents working on the project.

